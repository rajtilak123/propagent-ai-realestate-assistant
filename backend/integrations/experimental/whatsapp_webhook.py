# ==============================================================================
# Experimental Future Integration Layer
# PropAgent AI - Twilio WhatsApp Webhook Controller
# ==============================================================================

import time
from fastapi import APIRouter, Form, Response
from twilio.twiml.messaging_response import MessagingResponse

# Enable relative paths imports from root backend
import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))

import database
import assistant
from integrations.experimental.whatsapp_formatter import format_whatsapp_message

router = APIRouter()
processed_sids = {}

@router.post("/webhook/whatsapp")
async def whatsapp_webhook(
    From: str = Form(...),
    Body: str = Form(...),
    MessageSid: str = Form(None)
):
  """
  Receives and responds to Twilio Sandbox WhatsApp webhooks.
  To deploy: mount this router in main.py.
  """
  global processed_sids
  print("=== WhatsApp Webhook Triggered ===")
  print("From:", From)
  print("Body:", Body)
  print("MessageSid:", MessageSid)
  
  try:
    if MessageSid:
      if MessageSid in processed_sids:
        print(f"[Twilio Webhook] Duplicate MessageSid ignored: {MessageSid}")
        twiml = MessagingResponse()
        return Response(content=str(twiml), media_type="application/xml")
      processed_sids[MessageSid] = time.time()
    
    # Prune old SIDs (>1 hour) to keep memory footprint clean
    now = time.time()
    for sid, ts in list(processed_sids.items()):
      if now - ts > 3600:
        processed_sids.pop(sid, None)

    # Use phone number as session_id (strip "whatsapp:" prefix if present)
    session_id = From.replace("whatsapp:", "").strip()
    
    # Get session, customize metadata if new
    session = database.get_session(session_id)
    if session.get("phone") == "+91 XXXXX XXXXX" or not session.get("isWhatsApp"):
      session["phone"] = session_id
      session["name"] = f"WhatsApp Lead ({session_id})"
      session["isWhatsApp"] = True
      database.update_session(session_id, session)

    # Pass message to assistant engine
    response_data = assistant.process_agent_message(session_id, Body)
    
    # Get replies and format
    reply_text = response_data.get("message", "")
    cards = response_data.get("cards", [])
    
    formatted_reply, image_url = format_whatsapp_message(reply_text, cards)
    print("Assistant Response:", formatted_reply)
    
    # Build TwiML MessagingResponse
    twiml = MessagingResponse()
    msg = twiml.message()
    msg.body(formatted_reply)
    if image_url:
      msg.media(image_url)
      
    twiml_str = str(twiml)
    print("TwiML Response:", twiml_str)
    return Response(content=twiml_str, media_type="application/xml")

  except Exception as e:
    print(f"[Webhook Error] Exception: {str(e)}")
    twiml = MessagingResponse()
    twiml.message("⚠️ PropAgent AI is temporarily unavailable. Please try again shortly.")
    twiml_str = str(twiml)
    print("TwiML Fallback Response:", twiml_str)
    return Response(content=twiml_str, media_type="application/xml")
