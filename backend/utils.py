# PropAgent AI - Backend Utility Helpers
import time

def get_current_timestamp() -> str:
  """
  Returns standard WhatsApp message formatted timestamps (e.g. 10:15 AM).
  """
  return time.strftime("%I:%M %p")

def clean_input_string(text: str) -> str:
  """
  Standardizes incoming user text for NLP parsing and intent lookup.
  """
  return text.strip().lower()

def log_agent_pipeline(step_name: str, details: str):
  """
  Standard console logs for dialog execution pipeline.
  """
  print(f"[PropAgent Pipeline] {step_name}: {details}")

