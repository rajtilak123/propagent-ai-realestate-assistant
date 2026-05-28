import os
import uvicorn
from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from dotenv import load_dotenv

# Import components
import database
import models
import assistant
import analytics

load_dotenv()

app = FastAPI(
  title="PropAgent AI Sales Assistant Backend",
  version="1.2",
  description="Agentic Real Estate Sales Automation Workflow Engine"
)

# Enable CORS for React Frontend (production-safe and configurable)
cors_origins = os.getenv("CORS_ORIGIN", "*").split(",")
app.add_middleware(
  CORSMiddleware,
  allow_origins=cors_origins,
  allow_credentials=True,
  allow_methods=["*"],
  allow_headers=["*"],
)

# Centralized Error Handling Layer
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
  print(f"[API Global Error] Exception on {request.url.path}: {str(exc)}")
  return JSONResponse(
    status_code=500,
    content={
      "message": "PropAgent AI had a brief network timeout. We are connecting you back to dialog services.",
      "intent": "fallback_unknown",
      "confidence": 0.0,
      "lead_score": 50,
      "temperature": "Cold",
      "conversation_stage": "qualifying",
      "next_action": "request_missing_details",
      "cards": [],
      "memory_updates": {},
      "workflow_steps": [f"Backend Exception: {str(exc)}", "Triggered Centralized Error Fallback."]
    }
  )

# API ENDPOINTS

@app.post("/api/chat", response_model=models.ChatResponse)
async def chat_endpoint(request: models.ChatRequest):
  if not request.session_id:
    raise HTTPException(status_code=400, detail="session_id is required")
  
  result = assistant.process_agent_message(request.session_id, request.message)
  return result

@app.get("/api/dashboard")
async def get_dashboard_metrics():
  stats = analytics.calculate_dashboard_stats()
  return stats

@app.get("/api/leads")
async def list_leads():
  leads = database.get_sessions()
  return leads

@app.get("/api/properties")
async def list_properties():
  props = database.get_properties()
  return props

@app.post("/api/reset-demo")
async def reset_demo_endpoint():
  database.reset_db()
  return {"status": "success", "message": "Demo database and stateful sessions successfully reset."}

# Startup hook
@app.on_event("startup")
def startup_event():
  database.reset_db()
  print("[FastAPI Server] Mock database seeded and ready.")

if __name__ == "__main__":
  port = int(os.getenv("PORT", "8000"))
  host = os.getenv("HOST", "127.0.0.1")
  uvicorn.run("main:app", host=host, port=port, reload=True)
