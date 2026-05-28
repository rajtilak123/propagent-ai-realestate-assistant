import os
import re
import time
from typing import Dict, Any, List, Tuple
from openai import OpenAI
from dotenv import load_dotenv

import database
import knowledge_service

# Load env
load_dotenv()

OPENAI_API_KEY = os.getenv("OPENAI_API_KEY", "")
DEMO_MODE = os.getenv("DEMO_MODE", "true").lower() == "true"

# Define Prompt Loading Helpers
def load_prompt_file(filename: str) -> str:
  prompt_dir = os.path.join(os.path.dirname(__file__), "prompts")
  file_path = os.path.join(prompt_dir, filename)
  if os.path.exists(file_path):
    with open(file_path, "r", encoding="utf-8") as f:
      return f.read().strip()
  return ""

# 1. Intent Detection Utility
def detect_intent(message: str) -> Tuple[str, float]:
  text = clean_str(message)
  
  # Check rules (Fallback NLP Classifier)
  if text.match_any(["negotiate", "discount", "less price", "offer"]):
    return "negotiation", 0.98
  elif text.match_any(["agent", "human", "call me", "phone", "director", "manager", "support", "speak to", "contact"]):
    return "escalation_request", 0.99
  elif text.match_any(["visit", "schedule", "tomorrow", "saturday", "sunday", "tour", "appointment", "go see"]):
    return "site_visit", 0.95
  elif text.match_any(["book", "reserve", "token", "downpayment", "down payment", "buying"]):
    return "booking_request", 0.92
  elif text.match_any(["emi", "loan", "bank", "finance", "scheme", "mortgage"]):
    return "emi_query", 0.94
  elif text.match_any(["hmda", "dtcp", "rera", "approved", "approvals", "documents", "clear title", "legal"]):
    return "documents_query", 0.93
  elif text.match_any(["price", "cost", "how much", "rate", "sq yard", "per sq"]):
    return "pricing_query", 0.96
  elif text.match_any(["appreciation", "investment", "future growth", "return", "returns", "profit"]):
    return "investment_query", 0.89
  elif text.match_any(["plot", "project", "layout", "sizes", "size", "facing", "details"]):
    return "property_inquiry", 0.85
  elif text.match_any(["hi", "hello", "hey", "greet", "good morning", "good evening"]):
    return "greeting", 0.97
  
  return "fallback_unknown", 0.60

# Add text utility
class TextHelper(str):
  def match_any(self, keywords: List[str]) -> bool:
    for kw in keywords:
      if kw in self:
        return True
    return False

# Override Message type
def clean_str(s: str) -> TextHelper:
  return TextHelper(s.lower())

# 2. Extract & Update Memory Layer
def update_memory(session: Dict[str, Any], message: str) -> Dict[str, Any]:
  text = message.lower()
  memory = session.get("memory", {})
  updates = {}

  # Extract budget
  budget_match = re.search(r'(\d+)\s*(lakh|lakhs|cr|crore)', text)
  if budget_match:
    budget_val = f"₹{budget_match.group(0).upper()}"
    memory["budget"] = budget_val
    updates["budget"] = budget_val

  # Extract location focus
  locations = ["mokila", "shankarpally", "chevella", "patancheru", "adibatla"]
  found_locs = []
  for loc in locations:
    if loc in text:
      found_locs.append(loc.capitalize())
  if found_locs:
    memory["preferredLocations"] = found_locs
    updates["preferredLocations"] = found_locs

  # Extract investment timeline
  if "immediate" in text or "now" in text or "this week" in text or "1 month" in text:
    timeline = "Immediate / Under 1 month"
    memory["investmentTimeline"] = timeline
    updates["investmentTimeline"] = timeline
  elif "3 months" in text or "2 months" in text:
    timeline = "Within 3 months"
    memory["investmentTimeline"] = timeline
    updates["investmentTimeline"] = timeline
  elif "6 months" in text or "later" in text:
    timeline = "Within 6 months"
    memory["investmentTimeline"] = timeline
    updates["investmentTimeline"] = timeline

  session["memory"] = memory
  return updates

# 3. Dynamic Lead Scoring
def calculate_lead_score(session: Dict[str, Any]) -> Tuple[int, str, int]:
  score = 20 # Baseline score
  memory = session.get("memory", {})
  messages = session.get("messages", [])
  
  # Engagement frequency (+5 per turns, max +20)
  score += min(len(messages) * 5, 20)

  # Parameter completeness
  if memory.get("budget"):
    score += 15
  if memory.get("preferredLocations"):
    score += 15
  if memory.get("investmentTimeline"):
    score += 15
  
  # High Intent parameters
  if session.get("isBookingConfirmed"):
    score += 25
  if session.get("isEscalated"):
    score += 15

  # Cap score
  score = min(score, 98)
  
  # Assessment of temperature and probability
  probability = MathRound(score * 0.98)
  
  temperature = "Cold"
  if score >= 85:
    temperature = "Hot"
  elif score >= 50:
    temperature = "Warm"
  
  if session.get("isEscalated"):
    temperature = "Escalated"

  return score, temperature, probability

def MathRound(val: float) -> int:
  return int(val + 0.5)

# 4. State Machine Transitions
def transition_stage(session: Dict[str, Any], intent: str):
  current_stage = session.get("conversationStage", "initial")
  
  # Logical state loops
  if intent == "escalation_request" or intent == "negotiation":
    session["conversationStage"] = "escalation"
  elif current_stage == "initial" and intent == "greeting":
    session["conversationStage"] = "qualifying"
  elif current_stage == "qualifying" and session.get("memory", {}).get("budget"):
    session["conversationStage"] = "recommending"
  elif current_stage == "recommending" and intent in ["site_visit", "booking_request"]:
    session["conversationStage"] = "booking"
  elif session.get("isBookingConfirmed"):
    session["conversationStage"] = "completed"

# 5. Next Best Action Engine
def next_best_action(session: Dict[str, Any], intent: str) -> str:
  if session.get("isEscalated"):
    return "completed"
  if session.get("isBookingConfirmed"):
    return "completed"
    
  memory = session.get("memory", {})
  
  if not memory.get("budget"):
    return "ask_budget"
  if not memory.get("preferredLocations"):
    return "ask_location"
  if not memory.get("viewedProperties"):
    return "recommend_property"
  if intent in ["pricing_query", "property_inquiry"] and not session.get("isBookingConfirmed"):
    return "suggest_site_visit"
    
  return "request_missing_details"

# 6. Core Message Handler Orchestration
def process_agent_message(session_id: str, message_text: str) -> Dict[str, Any]:
  session = database.get_session(session_id)
  
  # Register message in session history
  timestamp = time.strftime("%I:%M %p")
  user_msg = {
    "id": f"msg-u-{int(time.time() * 1000)}",
    "sender": "user",
    "text": message_text,
    "timestamp": timestamp
  }
  session["messages"].append(user_msg)
  
  workflow_steps = [f"Turn initialized. Received input: '{message_text}'"]

  # Intent Detection
  intent, confidence = detect_intent(message_text)
  workflow_steps.append(f"Intent classified: {intent} ({int(confidence * 100)}% confidence)")

  # Memory Updates
  memory_updates = update_memory(session, message_text)
  if memory_updates:
    workflow_steps.append(f"Memory update: {', '.join([f'{k}={v}' for k, v in memory_updates.items()])}")

  # Transition state machine
  old_stage = session["conversationStage"]
  transition_stage(session, intent)
  if old_stage != session["conversationStage"]:
    workflow_steps.append(f"Stage transition: {old_stage} -> {session['conversationStage']}")

  # Lead Scoring computation
  score, temperature, probability = calculate_lead_score(session)
  session["leadScore"] = score
  session["leadTemperature"] = temperature
  session["buyingProbability"] = probability
  workflow_steps.append(f"Lead Score recalculated: {score} ({temperature})")

  # Next Best Action
  next_act = next_best_action(session, intent)
  session["nextAction"] = next_act
  workflow_steps.append(f"Autonomous Action Orchestrator chose action: {next_act}")

  # Recommend Properties and compute Card variables
  recommendations = knowledge_service.get_recommendations(session.get("memory", {}))
  cards = []

  # Logic variables for response generation
  reply_text = ""
  card_type = None
  card_data = {}

  # Fallback NLP Generator or OpenAI LIVE call
  use_live_openai = (OPENAI_API_KEY != "") and (not DEMO_MODE)
  
  if use_live_openai:
    workflow_steps.append("DEMO_MODE=false & OpenAI key active. Querying live model 'gpt-4o-mini'...")
    try:
      reply_text = query_openai_sales_response(session, message_text, intent, recommendations, next_act)
    except Exception as e:
      workflow_steps.append(f"OpenAI client error: {str(e)}. Triggering local fallback response.")
      use_live_openai = False # fallback

  if not use_live_openai:
    workflow_steps.append("Operating in local Agent Simulation mode.")
    reply_text, card_type, card_data = generate_local_response_and_cards(session, message_text, intent, recommendations, next_act)
    
  # Compose dynamic Card wrapper in standard response schema
  if card_type:
    cards.append({
      "type": card_type,
      "data": card_data
    })
    workflow_steps.append(f"Generated action card wrapper: '{card_type}'")

  # Complete milestones updates
  update_milestones(session)

  # Save AI message to history
  ai_msg_id = f"msg-ai-{int(time.time() * 1000)}"
  ai_msg = {
    "id": ai_msg_id,
    "sender": "ai",
    "text": reply_text,
    "timestamp": timestamp
  }
  if card_type:
    ai_msg["cardType"] = card_type
    ai_msg["cardData"] = card_data
  session["messages"].append(ai_msg)

  # Sync variables back to Database
  session["currentWorkflowSteps"] = workflow_steps
  database.update_session(session_id, session)

  return {
    "message": reply_text,
    "intent": intent,
    "confidence": confidence,
    "lead_score": score,
    "temperature": temperature,
    "conversation_stage": session["conversationStage"],
    "next_action": next_act,
    "cards": cards,
    "memory_updates": memory_updates,
    "workflow_steps": workflow_steps
  }

# Generate offline responses & Card definitions
def generate_local_response_and_cards(
  session: Dict[str, Any], 
  message_text: str, 
  intent: str, 
  recommendations: List[Dict[str, Any]], 
  next_act: str
) -> Tuple[str, str, Dict[str, Any]]:
  
  text = clean_str(message_text)
  memory = session.get("memory", {})
  
  reply = ""
  card_type = None
  card_data = {}

  if intent == "escalation_request" or intent == "negotiation":
    reply = "Understood. I have flagged your profile for custom price negotiation on our premium inventory. To secure the best terms, I have paused automated AI workflows and routed you directly to our Senior Sales Director. He will contact you shortly."
    card_type = "escalation"
    card_data = {
      "agentName": "Mr. Vikram Rathore (Senior Sales Director)",
      "phone": "+91 99999 88888"
    }
    session["isEscalated"] = True
    session["conversationStage"] = "escalation"
    session["nextAction"] = "completed"

  elif intent == "site_visit":
    requested_day = "This Sunday (May 31)" if "sunday" in text else "This Saturday (May 30)"
    requested_time = "11:00 AM" if "morning" in text or "11" in text else "4:00 PM"
    
    plot_name = "Green Meadows Phase 1 (Plot A12)"
    if recommendations:
      plot_name = recommendations[0]["name"]
      
    reply = f"Your physical site inspection has been confirmed. A dedicated investment advisor will guide you through the plot borders, layout maps, and clear title documentation. Here are your booking details:"
    card_type = "booking"
    card_data = {
      "date": requested_day,
      "time": requested_time,
      "plotName": plot_name,
      "agentName": "Rohan Sharma",
      "status": "Confirmed"
    }
    session["isBookingConfirmed"] = True
    session["bookingDetails"] = card_data
    session["conversationStage"] = "completed"

  elif intent == "pricing_query" or intent == "property_inquiry":
    if recommendations:
      best_match = recommendations[0]
      memory["viewedProperties"] = [best_match["id"]]
      session["memory"] = memory
      
      reply = f"Based on your requirements, the best-matched property is {best_match['name']} in {best_match['location']}. It matches {best_match['matchScore']}% of your preferences and is projected for {best_match['appreciationPotential']} due to the surrounding IT corridor expansion."
      card_type = "property"
      card_data = best_match
    else:
      reply = "We offer premium gated community plots in Mokila and Shankarpally starting from ₹28 Lakhs. Please share your target budget and location to view specific matching options."

  elif intent == "investment_query":
    if recommendations:
      best_match = recommendations[0]
      reply = f"Our developments in {best_match['location']} offer premium appreciation. {best_match['name']} projects a {best_match['appreciationPotential']} driven by infrastructure growth and direct road connectivity. Here is the matching investment profile:"
      card_type = "property"
      card_data = best_match
    else:
      reply = "Our development projects in Mokila and Shankarpally sit directly in high-growth corridors with projected annual capital gains of 18-22%. Please share your budget to view specific plot yields."

  elif intent == "emi_query":
    reply = "We facilitate quick home loans via partner financial institutions (HDFC, ICICI, SBI) covering up to 80% of funding. Below are monthly EMI projections based on current interest rates:"
    card_type = "emi_plan"
    card_data = {
      "plotPrice": "₹55,00,000"
    }

  elif intent == "documents_query":
    reply = "All layout plots in our catalog carry clear titles with 100% HMDA/DTCP legal approvals and active RERA registrations. We provide verified copy links and parent deeds for 30-year verification."

  elif intent == "booking_request":
    reply = "You can reserve any selected plot with a booking token of ₹1,00,000. We accept card payment, bank transfers, and immediate UPI. A formal booking receipt will be generated instantly."

  elif budget_extracted := memory.get("budget"):
    reply = f"We have updated your investor profile with a budget parameter of {budget_extracted}. Based on current pricing trends in the West Hyderabad development sector, here is your active qualification checklist:"
    card_type = "lead_summary"
    card_data = {
      "budget": budget_extracted,
      "location": ", ".join(memory.get("preferredLocations", [])) or "Mokila",
      "timeline": memory.get("investmentTimeline") or "3 months",
      "score": session["leadScore"]
    }
  else:
    reply = "Welcome to PropAgent AI Sales Assistant. I can assist you with verifying HMDA layout approvals, calculating plot EMI options, scheduling site visits, or matching plots. Let's begin with your target budget and location preference."

  return reply, card_type, card_data

# Ingestion for Milestones Completed
def update_milestones(session: Dict[str, Any]):
  milestones = session.get("journeyMilestones", [])
  memory = session.get("memory", {})
  
  for m in milestones:
    if m["id"] == "m2" and memory.get("budget"):
      m["status"] = "completed"
      m["timestamp"] = time.strftime("%I:%M %p")
    elif m["id"] == "m3" and memory.get("viewedProperties"):
      m["status"] = "completed"
      m["timestamp"] = time.strftime("%I:%M %p")
    elif m["id"] == "m4" and session.get("isBookingConfirmed"):
      m["status"] = "completed"
      m["timestamp"] = time.strftime("%I:%M %p")
    elif m["id"] == "m5" and session.get("isEscalated"):
      m["status"] = "completed"
      m["timestamp"] = time.strftime("%I:%M %p")

# OpenAI LIVE request handler
def query_openai_sales_response(
  session: Dict[str, Any], 
  message_text: str, 
  intent: str, 
  recommendations: List[Dict[str, Any]], 
  next_act: str
) -> str:
  client = OpenAI(api_key=OPENAI_API_KEY)
  
  sales_prompt = load_prompt_file("sales_prompt.txt")
  qualification_prompt = load_prompt_file("qualification_prompt.txt")
  
  # Format property context
  properties_context = ""
  if recommendations:
    best = recommendations[0]
    properties_context = f"BEST RECOMMENDED PLOT: {best['name']} in {best['location']}. Price: {best['price']}, Size: {best['size']}, Facing: {best['facing']}, approvals: {best['approvals']}. appreciation: {best['appreciationPotential']}."

  memory = session.get("memory", {})
  memory_context = f"CURRENT BUYER MEMORY: Budget: {memory.get('budget', 'unknown')}, Location pref: {memory.get('preferredLocations', 'unknown')}, Timeline: {memory.get('investmentTimeline', 'unknown')}."

  system_prompt = f"{sales_prompt}\n\n{qualification_prompt}\n\n{memory_context}\n\n{properties_context}\n\nNEXT RECOMMENDED ACTION TO DISPATCH: {next_act}."

  # Compile dialogue history context
  messages = []
  messages.append({"role": "system", "content": system_prompt})
  
  # Load last 5 messages to avoid token blow-up
  for m in session.get("messages", [])[-6:-1]: # exclude the latest user message which we will append as active
    role = "user" if m["sender"] == "user" else "assistant"
    messages.append({"role": role, "content": m["text"]})
    
  messages.append({"role": "user", "content": message_text})

  completion = client.chat.completions.create(
    model="gpt-4o-mini",
    messages=messages,
    max_tokens=150,
    temperature=0.7
  )
  
  return completion.choices[0].message.content.strip()
