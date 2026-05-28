import re
from typing import List, Dict, Any
from database import get_properties

def clean_price_to_number(price_str: str) -> float:
  # Converts e.g., '₹55,00,000' or '55 Lakhs' or '30L' to standard float value in Lakhs
  clean_str = price_str.replace('₹', '').replace(',', '').strip()
  
  # Check if in Lakhs
  if 'lakh' in clean_str.lower() or 'l' in clean_str.lower():
    match = re.search(r'[\d\.]+', clean_str)
    return float(match.group()) if match else 50.0
  elif 'cr' in clean_str.lower():
    match = re.search(r'[\d\.]+', clean_str)
    return float(match.group()) * 100 if match else 100.0
  
  # Standard division if in raw numbers (e.g. 5500000 -> 55.0)
  try:
    val = float(clean_str)
    if val > 100000:
      return val / 100000
    return val
  except ValueError:
    return 50.0 # fallback

def calculate_match_score(property_item: Dict[str, Any], buyer_memory: Dict[str, Any]) -> int:
  score = 70 # baseline suitability

  # 1. Budget Match (up to +15 pts)
  buyer_budget_str = buyer_memory.get("budget")
  if buyer_budget_str:
    buyer_budget = clean_price_to_number(buyer_budget_str)
    plot_price = clean_price_to_number(property_item["price"])
    diff = abs(buyer_budget - plot_price)
    
    if diff <= 5:
      score += 15
    elif diff <= 15:
      score += 8
    elif plot_price > buyer_budget:
      score -= 10 # slightly too expensive

  # 2. Location Match (up to +15 pts)
  pref_locations = buyer_memory.get("preferredLocations", [])
  if not pref_locations and buyer_memory.get("location"):
    pref_locations = [buyer_memory.get("location")]
  
  if pref_locations:
    matched = False
    for loc in pref_locations:
      if loc.lower() in property_item["location"].lower():
        score += 15
        matched = True
        break
    if not matched:
      score -= 10

  # 3. Sizing / Facing Matches (+5 pts)
  facing_pref = buyer_memory.get("bookingPreferences", "")
  if facing_pref and property_item["facing"].lower() in facing_pref.lower():
    score += 5

  # Cap between 50 and 99
  return max(50, min(score, 99))

def generate_why_this_plot(property_item: Dict[str, Any], buyer_memory: Dict[str, Any], match_pct: int) -> str:
  loc = property_item["location"].split(",")[0]
  price = property_item["price"]
  facing = property_item["facing"]
  
  explanation = f"{match_pct}% Match: This plot in high-growth {loc} is priced at {price}. "
  
  reasons = []
  if buyer_memory.get("budget"):
    reasons.append(f"fits closely inside your stated budget of {buyer_memory.get('budget')}")
  if buyer_memory.get("preferredLocations") or buyer_memory.get("location"):
    reasons.append(f"aligns with your location focus")
  
  reasons.append("offers clear legal approvals (HMDA/DTCP)")
  reasons.append(f"is premium {facing}")
  
  explanation += "It " + ", ".join(reasons) + "."
  return explanation

def get_recommendations(buyer_memory: Dict[str, Any]) -> List[Dict[str, Any]]:
  properties = get_properties()
  recommendations = []

  for prop in properties:
    prop_copy = copy_dict(prop)
    match_score = calculate_match_score(prop_copy, buyer_memory)
    prop_copy["matchScore"] = match_score
    prop_copy["explanation"] = generate_why_this_plot(prop_copy, buyer_memory, match_score)
    recommendations.append(prop_copy)

  # Sort by match score descending
  recommendations.sort(key=lambda x: x["matchScore"], reverse=True)
  return recommendations

def copy_dict(d: Dict[str, Any]) -> Dict[str, Any]:
  import copy
  return copy.deepcopy(d)
