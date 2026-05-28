from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any

class ChatRequest(BaseModel):
  session_id: str = Field(..., description="Unique customer session key")
  message: str = Field(..., description="Incoming customer text message")

class CardWrapper(BaseModel):
  type: str = Field(..., description="Card rendering style: 'property', 'booking', 'escalation', 'lead_summary', 'emi_plan'")
  data: Dict[str, Any] = Field(..., description="Fidelity variables for rendering the card components")

class ChatResponse(BaseModel):
  message: str = Field(..., description="AI conversational reply text")
  intent: str = Field(..., description="Detected intent label")
  confidence: float = Field(..., description="Confidence score (0.0 to 1.0) of intent detection")
  lead_score: int = Field(..., description="Calculated lead quality rating (0-100)")
  temperature: str = Field(..., description="Lead temperature: 'Hot', 'Warm', 'Cold', 'Escalated'")
  conversation_stage: str = Field(..., description="Current state machine stage: 'initial', 'qualifying', 'recommending', 'booking', 'escalation', 'completed'")
  next_action: str = Field(..., description="Autonomous next best action recommendation")
  cards: List[CardWrapper] = Field(default_factory=list, description="Visual action cards attached to reply")
  memory_updates: Dict[str, Any] = Field(default_factory=dict, description="Extracted memory tags saved during turn")
  workflow_steps: List[str] = Field(default_factory=list, description="Logs illustrating the agentic decision pipeline")

class LeadDetails(BaseModel):
  id: str
  name: str
  phone: str
  avatar: str
  leadScore: int
  leadTemperature: str
  buyingProbability: int
  conversationStage: str
  nextAction: str
  isEscalated: bool
  isBookingConfirmed: bool
  memory: Dict[str, Any]
  journeyMilestones: List[Dict[str, Any]]
  currentWorkflowSteps: List[str]
  unreadCount: int
  bookingDetails: Optional[Dict[str, Any]] = None

class PropertyResponse(BaseModel):
  id: str
  name: str
  location: str
  price: str
  size: str
  facing: str
  approvals: str
  amenities: List[str]
  maintenance: str
  image: str
  appreciationPotential: str
  matchScore: int
  investmentSuitability: str
  explanation: str
