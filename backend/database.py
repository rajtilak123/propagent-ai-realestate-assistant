import copy
from typing import Dict, Any, List, Optional

# Property Database (Knowledge base)
PROPERTIES_SEED = [
  {
    "id": "prop-1",
    "name": "Green Meadows Phase 1 (Plot A12)",
    "location": "Mokila, Hyderabad",
    "price": "₹55,00,000",
    "size": "250 Sq. Yards",
    "facing": "East Facing",
    "approvals": "HMDA & RERA Approved",
    "amenities": ["24/7 Gated Security", "Blacktop Roads", "Underground Utilities", "Clubhouse", "Children Park"],
    "maintenance": "₹2,500 / month (1 Year Free)",
    "image": "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    "appreciationPotential": "20-25% y-o-y growth expected",
    "matchScore": 95,
    "investmentSuitability": "High yield mid-term investment or immediate premium villa construction.",
    "explanation": "This plot in high-growth Mokila matches your ₹55 Lakh budget. Expected ROI of 18-24% over 3 years due to nearby IT corridor expansion and direct ORR access."
  },
  {
    "id": "prop-2",
    "name": "Royal Palms County (Plot B45)",
    "location": "Shankarpally, Hyderabad",
    "price": "₹42,00,000",
    "size": "200 Sq. Yards",
    "facing": "North Facing",
    "approvals": "DTCP & RERA Approved",
    "amenities": ["Gated Entrance", "Swimming Pool", "Overhead Tank", "Jogging Track", "Landscape Gardens"],
    "maintenance": "₹2,000 / month",
    "image": "https://images.unsplash.com/photo-1524813686514-a57563d77d61?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    "appreciationPotential": "15-18% y-o-y growth expected",
    "matchScore": 88,
    "investmentSuitability": "Excellent low-entry point for young tech professionals seeking steady appreciation.",
    "explanation": "Shankarpally offers premium lifestyle features at a lower entry ticket. Expected ROI is 15-20% over 3 years driven by Shankarpally industrial corridor growth."
  },
  {
    "id": "prop-3",
    "name": "Eldorado Orchards (Plot C8)",
    "location": "Chevella, Hyderabad",
    "price": "₹28,00,000",
    "size": "150 Sq. Yards",
    "facing": "West Facing",
    "approvals": "DTCP Approved, RERA Pending",
    "amenities": ["Organic Farming Area", "Solar Street Lighting", "Compound Wall", "Water Grid Connection", "CCTV System"],
    "maintenance": "₹1,200 / month",
    "image": "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    "appreciationPotential": "25-30% y-o-y growth expected (Speculation Zone)",
    "matchScore": 72,
    "investmentSuitability": "Perfect for long-term farm land banking and peaceful weekend farmhouse build.",
    "explanation": "Highly recommended for maximum land acreage under ₹30 Lakhs. ROI projected at 30% over 3 years due to the Chevella-Bijapur highway 4-laning project."
  },
  {
    "id": "prop-4",
    "name": "Sovereign Heights (Plot E102)",
    "location": "Patancheru, Hyderabad",
    "price": "₹75,00,000",
    "size": "300 Sq. Yards",
    "facing": "Northeast Corner Facing",
    "approvals": "HMDA & RERA Approved",
    "amenities": ["Ultra Clubhouse", "Gymnasium", "Tennis Court", "Avenue Plantation", "Rainwater Harvesting"],
    "maintenance": "₹3,500 / month",
    "image": "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    "appreciationPotential": "22-26% y-o-y growth expected",
    "matchScore": 92,
    "investmentSuitability": "Premium compliance Vaastu-perfect corner plot for high-end luxury villa builds.",
    "explanation": "Corner plot E102 fits your larger budget. Expected ROI of 24% over 3 years due to heavy industrial logistics growth and proximity to Miyapur metro corridor."
  },
  {
    "id": "prop-5",
    "name": "Pinewood Estates (Plot D34)",
    "location": "Adibatla, Hyderabad",
    "price": "₹48,00,000",
    "size": "220 Sq. Yards",
    "facing": "South Facing",
    "approvals": "HMDA Approved",
    "amenities": ["Underground Cabling", "Avenue Lighting", "24/7 Security Patrol", "Walking Trails", "Overhead Tank"],
    "maintenance": "₹1,800 / month",
    "image": "https://images.unsplash.com/photo-1507035895480-2b3156c31fc8?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    "appreciationPotential": "18-22% y-o-y growth expected",
    "matchScore": 80,
    "investmentSuitability": "Ideal for tech professionals looking for a plot close to Adibatla SEZs.",
    "explanation": "Adibatla is prime tech land. Expected ROI is 20% over 3 years driven by expansion of TCS Aerospace and upcoming electronic SEZ park."
  }
]

# Customer Sessions Seed Data
SESSIONS_SEED = [
  {
    "id": "chat-rahul",
    "name": "Rahul Sharma",
    "phone": "+91 98765 43210",
    "avatar": "https://api.dicebear.com/7.x/avataaars/svg?seed=Rahul",
    "leadScore": 92,
    "leadTemperature": "Hot",
    "buyingProbability": 95,
    "conversationStage": "recommending",
    "nextAction": "suggest_site_visit",
    "unreadCount": 0,
    "isEscalated": False,
    "isBookingConfirmed": False,
    "memory": {
      "budget": "₹50,00,000 to ₹60,00,000",
      "preferredLocations": ["Mokila", "Shankarpally"],
      "investmentTimeline": "Within 3 months",
      "viewedProperties": ["prop-1"],
      "bookingPreferences": "Prefers weekends"
    },
    "journeyMilestones": [
      { "id": "m1", "label": "Customer Joined", "timestamp": "10:15 AM", "status": "completed" },
      { "id": "m2", "label": "Shared Budget & Location", "timestamp": "10:18 AM", "status": "completed" },
      { "id": "m3", "label": "Property Recommended", "timestamp": "10:20 AM", "status": "completed" },
      { "id": "m4", "label": "Site Visit Booked", "status": "pending" },
      { "id": "m5", "label": "Escalated to Agent", "status": "pending" }
    ],
    "currentWorkflowSteps": [
      "Intent parsed: pricing_query (98% confidence)",
      "Memory extracted: budget: ₹55L, location: Mokila",
      "Lead Score calculated: 92 (Hot)",
      "Action Orchestrator: Recommend Green Meadows A12",
      "Next Action selected: suggest_site_visit"
    ],
    "messages": [
      {
        "id": "msg-r1",
        "sender": "user",
        "text": "Hello, I am looking to invest in plots near Mokila.",
        "timestamp": "10:15 AM"
      },
      {
        "id": "msg-r2",
        "sender": "ai",
        "text": "Hello Rahul! Welcome to PropAgent AI. I can certainly help you find premium plots. To help me narrow down the best choices, what would be your budget range and investment timeline?",
        "timestamp": "10:16 AM"
      },
      {
        "id": "msg-r3",
        "sender": "user",
        "text": "My budget is around 55 lakhs, and I want to buy within the next 3 months.",
        "timestamp": "10:18 AM"
      },
      {
        "id": "msg-r4",
        "sender": "ai",
        "text": "Perfect! Earlier you mentioned a ₹55 lakh budget. I have found an excellent match in Mokila that aligns with your timeline.",
        "timestamp": "10:20 AM",
        "cardType": "property",
        "cardData": PROPERTIES_SEED[0]
      },
      {
        "id": "msg-r5",
        "sender": "ai",
        "text": "Would you like to schedule a site visit this coming Saturday? I can arrange a transport for you.",
        "timestamp": "10:21 AM"
      }
    ]
  },
  {
    "id": "chat-priya",
    "name": "Priya Reddy",
    "phone": "+91 87654 32109",
    "avatar": "https://api.dicebear.com/7.x/avataaars/svg?seed=Priya",
    "leadScore": 68,
    "leadTemperature": "Warm",
    "buyingProbability": 60,
    "conversationStage": "qualifying",
    "nextAction": "recommend_property",
    "unreadCount": 2,
    "isEscalated": False,
    "isBookingConfirmed": False,
    "memory": {
      "budget": "Under ₹45,00,000",
      "preferredLocations": ["Shankarpally"],
      "investmentTimeline": "Next 6 months"
    },
    "journeyMilestones": [
      { "id": "m1", "label": "Customer Joined", "timestamp": "Yesterday", "status": "completed" },
      { "id": "m2", "label": "Shared Budget & Location", "timestamp": "Yesterday", "status": "completed" },
      { "id": "m3", "label": "Property Recommended", "status": "pending" },
      { "id": "m4", "label": "Site Visit Booked", "status": "pending" },
      { "id": "m5", "label": "Escalated to Agent", "status": "pending" }
    ],
    "currentWorkflowSteps": [
      "Intent parsed: documents_query (91% confidence)",
      "Memory extracted: budget: ₹45L, location: Shankarpally",
      "Lead Score calculated: 68 (Warm)",
      "Action Orchestrator: Address legal approvals query",
      "Next Action selected: recommend_property"
    ],
    "messages": [
      {
        "id": "msg-p1",
        "sender": "user",
        "text": "Hi, are your properties DTCP approved?",
        "timestamp": "Yesterday"
      },
      {
        "id": "msg-p2",
        "sender": "ai",
        "text": "Hello Priya! Yes, our properties are fully approved. We offer both HMDA and DTCP approved layouts with clear titles. May I know which location you are focusing on and your budget limit?",
        "timestamp": "Yesterday"
      },
      {
        "id": "msg-p3",
        "sender": "user",
        "text": "I am interested in Shankarpally, budget is under 45 Lakhs. I plan to buy in 6 months.",
        "timestamp": "9:30 AM"
      },
      {
        "id": "msg-p4",
        "sender": "user",
        "text": "Are bank loans available for Shankarpally plots?",
        "timestamp": "9:31 AM"
      }
    ]
  },
  {
    "id": "chat-arjun",
    "name": "Arjun Mehta",
    "phone": "+91 76543 21098",
    "avatar": "https://api.dicebear.com/7.x/avataaars/svg?seed=Arjun",
    "leadScore": 95,
    "leadTemperature": "Escalated",
    "buyingProbability": 80,
    "conversationStage": "escalation",
    "nextAction": "completed",
    "unreadCount": 0,
    "isEscalated": True,
    "isBookingConfirmed": False,
    "memory": {
      "budget": "₹75,00,000+",
      "preferredLocations": ["Patancheru"],
      "investmentTimeline": "Immediate",
      "escalationHistory": ["Requested price negotiation on Sovereign Heights"]
    },
    "journeyMilestones": [
      { "id": "m1", "label": "Customer Joined", "timestamp": "Monday", "status": "completed" },
      { "id": "m2", "label": "Shared Budget & Location", "timestamp": "Monday", "status": "completed" },
      { "id": "m3", "label": "Property Recommended", "timestamp": "Monday", "status": "completed" },
      { "id": "m4", "label": "Site Visit Booked", "status": "pending" },
      { "id": "m5", "label": "Escalated to Agent", "timestamp": "Tuesday", "status": "completed" }
    ],
    "currentWorkflowSteps": [
      "Intent parsed: negotiation (99% confidence)",
      "Escalation trigger detected: 'price negotiation'",
      "Action Orchestrator: Transition to human handover",
      "Lead Status updated: Escalated",
      "Next Action selected: None (Human Assigned)"
    ],
    "messages": [
      {
        "id": "msg-a1",
        "sender": "user",
        "text": "I am looking for premium plots in Patancheru.",
        "timestamp": "Monday"
      },
      {
        "id": "msg-a2",
        "sender": "ai",
        "text": "Welcome Arjun! I can show you our luxury corner plots in Sovereign Heights, Patancheru. Our plots start from ₹75 Lakhs. Does that budget suit you?",
        "timestamp": "Monday"
      },
      {
        "id": "msg-a3",
        "sender": "user",
        "text": "Yes budget fits. Can you send details of the 300 Sq. Yards plot?",
        "timestamp": "Monday"
      },
      {
        "id": "msg-a4",
        "sender": "ai",
        "text": "Here are the details for Sovereign Heights Corner Plot E102. It matches your premium standards.",
        "timestamp": "Monday",
        "cardType": "property",
        "cardData": PROPERTIES_SEED[3]
      },
      {
        "id": "msg-a5",
        "sender": "user",
        "text": "This looks good but I want to negotiate the price. Can I talk to your sales director or manager?",
        "timestamp": "Tuesday"
      },
      {
        "id": "msg-a6",
        "sender": "ai",
        "text": "Connecting you with a sales executive.",
        "timestamp": "Tuesday",
        "cardType": "escalation",
        "cardData": {
          "agentName": "Mr. Vikram Rathore (Senior Sales Director)",
          "phone": "+91 99999 88888"
        }
      }
    ]
  },
  {
    "id": "chat-sneha",
    "name": "Sneha Reddy",
    "phone": "+91 95432 10987",
    "avatar": "https://api.dicebear.com/7.x/avataaars/svg?seed=Sneha",
    "leadScore": 88,
    "leadTemperature": "Hot",
    "buyingProbability": 90,
    "conversationStage": "booking",
    "nextAction": "completed",
    "unreadCount": 0,
    "isEscalated": False,
    "isBookingConfirmed": True,
    "bookingDetails": {
      "date": "This Saturday (May 30)",
      "time": "11:00 AM",
      "plotName": "Pinewood Estates (Plot D34)",
      "agentName": "Rohan Sharma"
    },
    "memory": {
      "budget": "₹45,00,000 to ₹50,00,000",
      "preferredLocations": ["Adibatla"],
      "investmentTimeline": "Immediate",
      "viewedProperties": ["prop-5"],
      "bookingPreferences": "Preferred time: 11:00 AM Saturday"
    },
    "journeyMilestones": [
      { "id": "m1", "label": "Customer Joined", "timestamp": "10:00 AM", "status": "completed" },
      { "id": "m2", "label": "Shared Budget & Location", "timestamp": "10:05 AM", "status": "completed" },
      { "id": "m3", "label": "Property Recommended", "timestamp": "10:08 AM", "status": "completed" },
      { "id": "m4", "label": "Site Visit Booked", "timestamp": "10:12 AM", "status": "completed" },
      { "id": "m5", "label": "Escalated to Agent", "status": "pending" }
    ],
    "currentWorkflowSteps": [
      "Intent parsed: site_visit (96% confidence)",
      "Plot selection resolved: Plot D34, Adibatla",
      "Booking flow initialized",
      "Time slot confirmed: Saturday 11:00 AM",
      "Booking Confirmation Card generated",
      "Lead status updated: Hot / Booking Active"
    ],
    "messages": [
      {
        "id": "msg-s1",
        "sender": "user",
        "text": "Hi, I saw your Adibatla plots project. Can I book a site visit?",
        "timestamp": "10:00 AM"
      },
      {
        "id": "msg-s2",
        "sender": "ai",
        "text": "Hello Sneha! I would be delighted to schedule a site visit for you. We have prime plots in Pinewood Estates, Adibatla, which matches your preferences. What is your convenient day and time?",
        "timestamp": "10:02 AM"
      },
      {
        "id": "msg-s3",
        "sender": "user",
        "text": "This Saturday around 11 AM works for me.",
        "timestamp": "10:05 AM"
      },
      {
        "id": "msg-s4",
        "sender": "ai",
        "text": "Site visit confirmed! Here is your Booking Confirmation Card. Our sales advisor Rohan will pick you up at the location.",
        "timestamp": "10:08 AM",
        "cardType": "booking",
        "cardData": {
          "date": "This Saturday (May 30)",
          "time": "11:00 AM",
          "plotName": "Pinewood Estates (Plot D34)",
          "agentName": "Rohan Sharma",
          "status": "Confirmed"
        }
      }
    ]
  }
]

# Global DB state references
properties_db = copy.deepcopy(PROPERTIES_SEED)
sessions_db: Dict[str, Any] = {s["id"]: copy.deepcopy(s) for s in SESSIONS_SEED}

def get_properties() -> List[Dict[str, Any]]:
  global properties_db
  return properties_db

def get_sessions() -> List[Dict[str, Any]]:
  global sessions_db
  return list(sessions_db.values())

def get_session(session_id: str) -> Optional[Dict[str, Any]]:
  global sessions_db
  if session_id not in sessions_db:
    # Auto-initialize a new session
    sessions_db[session_id] = {
      "id": session_id,
      "name": f"New Prospect ({session_id[:6]})",
      "phone": "+91 XXXXX XXXXX",
      "avatar": f"https://api.dicebear.com/7.x/avataaars/svg?seed={session_id}",
      "leadScore": 20,
      "leadTemperature": "Cold",
      "buyingProbability": 20,
      "conversationStage": "initial",
      "nextAction": "ask_qualification",
      "unreadCount": 0,
      "isEscalated": False,
      "isBookingConfirmed": False,
      "memory": {},
      "journeyMilestones": [
        { "id": "m1", "label": "Customer Joined", "status": "completed" },
        { "id": "m2", "label": "Shared Budget & Location", "status": "pending" },
        { "id": "m3", "label": "Property Recommended", "status": "pending" },
        { "id": "m4", "label": "Site Visit Booked", "status": "pending" },
        { "id": "m5", "label": "Escalated to Agent", "status": "pending" }
      ],
      "currentWorkflowSteps": ["Session initialized."],
      "messages": []
    }
  return sessions_db[session_id]

def update_session(session_id: str, updated_data: Dict[str, Any]):
  global sessions_db
  if session_id in sessions_db:
    sessions_db[session_id].update(updated_data)

def reset_db():
  global properties_db, sessions_db
  properties_db = copy.deepcopy(PROPERTIES_SEED)
  sessions_db = {s["id"]: copy.deepcopy(s) for s in SESSIONS_SEED}
