export interface Property {
  id: string;
  name: string;
  location: string;
  price: string;
  size: string;
  facing: string;
  approvals: string;
  amenities: string[];
  maintenance: string;
  image: string;
  appreciationPotential: string;
  matchScore: number;
  explanation: string;
  investmentSuitability: string;
}

export interface ConversationMemory {
  budget?: string;
  preferredLocations?: string[];
  investmentTimeline?: string;
  viewedProperties?: string[];
  bookingPreferences?: string;
  escalationHistory?: string[];
  previousRecommendations?: string[];
}

export interface Message {
  id: string;
  sender: 'user' | 'ai' | 'system';
  text: string;
  timestamp: string;
  cardType?: 'property' | 'booking' | 'escalation' | 'lead_summary' | 'emi_plan';
  cardData?: any;
}

export interface JourneyMilestone {
  id: string;
  label: string;
  timestamp?: string;
  status: 'pending' | 'completed';
}

export interface CustomerSession {
  id: string;
  name: string;
  phone: string;
  avatar: string;
  leadScore: number;
  leadTemperature: 'Hot' | 'Warm' | 'Cold' | 'Escalated';
  buyingProbability: number; // 0 to 100
  conversationStage: 'initial' | 'qualifying' | 'recommending' | 'booking' | 'escalation' | 'completed';
  nextAction: 'ask_qualification' | 'recommend_property' | 'suggest_site_visit' | 'escalate_to_human' | 'show_emi_plans' | 'update_lead_score' | 'request_missing_details' | 'completed';
  messages: Message[];
  memory: ConversationMemory;
  currentWorkflowSteps: string[];
  journeyMilestones: JourneyMilestone[];
  unreadCount: number;
  isEscalated: boolean;
  isBookingConfirmed: boolean;
  bookingDetails?: {
    date: string;
    time: string;
    plotName: string;
    agentName: string;
  };
  isWhatsApp?: boolean;
}

export interface DashboardStats {
  totalLeads: number;
  activeLeads: number;
  conversionRate: number;
  avgResponseTimeMs: number;
  leadTemperatures: {
    Hot: number;
    Warm: number;
    Cold: number;
    Escalated: number;
  };
  escalationsCount: number;
  siteVisitsCount: number;
  funnelStats: {
    visited: number;
    qualified: number;
    recommended: number;
    booked: number;
    escalated: number;
  };
  weeklyBookingTrends: { day: string; bookings: number }[];
  activityFeed: {
    id: string;
    sessionName: string;
    timestamp: string;
    description: string;
    type: 'joined' | 'message' | 'recommendation' | 'booking' | 'escalated';
  }[];
}
