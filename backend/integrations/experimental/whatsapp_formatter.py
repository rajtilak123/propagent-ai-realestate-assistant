# ==============================================================================
# Experimental Future Integration Layer
# PropAgent AI - WhatsApp Message Card Formatter
# ==============================================================================

def format_whatsapp_message(text: str, cards: list) -> tuple:
  """
  Appends formatted cards representation to the text message,
  and returns (full_text, image_url).
  Designed for future production Twilio WhatsApp API sync.
  """
  formatted_parts = [text]
  image_url = None

  for card in cards:
    card_type = card.get("type")
    card_data = card.get("data", {})

    if card_type == "property":
      image_url = card_data.get("image")
      
      card_text = (
        f"\n🏡 *Property Recommendation*\n\n"
        f"📍 *{card_data.get('name', 'Premium Plot')}*\n"
        f"💰 Price: {card_data.get('price', 'TBD')}\n"
        f"📌 Location: {card_data.get('location', 'TBD')}\n"
        f"📐 Size: {card_data.get('size', 'TBD')}\n"
        f"🧭 Facing: {card_data.get('facing', 'TBD')}\n"
        f"📄 Approval: {card_data.get('approvals', 'TBD')}\n"
        f"📈 Appreciation Potential: {card_data.get('appreciationPotential', 'TBD')}\n\n"
        f"✨ *Why This Plot?*\n"
        f"{card_data.get('explanation', card_data.get('investmentSuitability', ''))}"
      )
      formatted_parts.append(card_text)

    elif card_type == "booking":
      card_text = (
        f"\n✅ *Site Visit Confirmed*\n\n"
        f"📅 Date: {card_data.get('date', 'TBD')}\n"
        f"🕙 Time: {card_data.get('time', 'TBD')}\n"
        f"🏡 Plot: {card_data.get('plotName', 'TBD')}\n"
        f"👨‍💼 Assigned Agent: {card_data.get('agentName', 'TBD')}\n"
        f"📌 Status: {card_data.get('status', 'Confirmed')}"
      )
      formatted_parts.append(card_text)

    elif card_type == "escalation":
      card_text = (
        f"\n👨‍💼 *Connecting you with a Sales Executive*\n\n"
        f"Agent: {card_data.get('agentName', 'TBD')}\n"
        f"Phone: {card_data.get('phone', 'TBD')}"
      )
      formatted_parts.append(card_text)

    elif card_type == "lead_summary":
      card_text = (
        f"\n📋 *Lead Qualification Summary*\n\n"
        f"💰 Budget: {card_data.get('budget', 'TBD')}\n"
        f"📍 Locations: {card_data.get('location', 'TBD')}\n"
        f"📅 Timeline: {card_data.get('timeline', 'TBD')}\n"
        f"📈 Lead Score: {card_data.get('score', 'TBD')}"
      )
      formatted_parts.append(card_text)

    elif card_type == "emi_plan":
      price_str = card_data.get("plotPrice", "₹55,00,000")
      try:
        numeric_str = "".join([c for c in price_str if c.isdigit()])
        price_val = int(numeric_str) if numeric_str else 5500000
      except:
        price_val = 5500000
        
      downpayment = int(price_val * 0.2)
      loan_amount = price_val - downpayment
      r = 0.085 / 12
      n = 240
      emi = int(loan_amount * r * ((1 + r) ** n) / (((1 + r) ** n) - 1))
      
      def fmt_currency(val):
        return f"₹{val:,}"

      card_text = (
        f"\n📊 *Estimated EMI Plan*\n\n"
        f"💰 Plot Price: {price_str}\n"
        f"🏦 Downpayment (20%): {fmt_currency(downpayment)}\n"
        f"💼 Loan Amount (80%): {fmt_currency(loan_amount)}\n"
        f"📉 Interest Rate: 8.5%\n"
        f"📅 Tenure: 20 Years\n"
        f"💸 Est. Monthly EMI: {fmt_currency(emi)} / month"
      )
      formatted_parts.append(card_text)

  return "\n".join(formatted_parts).strip(), image_url
