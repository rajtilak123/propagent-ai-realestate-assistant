import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { ChatWindow } from './components/ChatWindow';
import { Dashboard } from './components/Dashboard';
import { FutureScope } from './components/FutureScope';
import { mockChats } from './data/mockChats';
import { mockDashboardStats } from './data/mockDashboard';
import { mockProperties } from './data/mockProperties';
import { CustomerSession, Message, DashboardStats } from './types';
import { Cpu } from 'lucide-react';

const BACKEND_URL = (import.meta as any).env.VITE_API_URL || 'http://localhost:8000';

export const App: React.FC = () => {
  const [sessions, setSessions] = useState<CustomerSession[]>([]);
  const [activeSessionId, setActiveSessionId] = useState<string>('chat-rahul');
  const [dashboardStats, setDashboardStats] = useState<DashboardStats>(mockDashboardStats);
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const [backendActive, setBackendActive] = useState<boolean>(false);
  const [lastSyncTime, setLastSyncTime] = useState<string>(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));

  // Load leads and metrics from FastAPI backend (with graceful local fallback)
  const fetchData = async () => {
    try {
      // 1. Fetch sessions
      const leadsRes = await fetch(`${BACKEND_URL}/api/leads`);
      if (leadsRes.ok) {
        const leadsData = await leadsRes.json();
        setSessions(leadsData);
        setBackendActive(true);
        setLastSyncTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
      } else {
        throw new Error('Failed to fetch leads');
      }

      // 2. Fetch dashboard stats
      const statsRes = await fetch(`${BACKEND_URL}/api/dashboard`);
      if (statsRes.ok) {
        const statsData = await statsRes.json();
        setDashboardStats(statsData);
      }
    } catch (err) {
      setSessions(prev => prev.length === 0 ? JSON.parse(JSON.stringify(mockChats)) : prev);
      setBackendActive(currentActive => {
        if (currentActive) {
          console.log("[PropAgent Sync] Backend server disconnected. Operating in local simulation mode.");
        }
        return false;
      });
      setLastSyncTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(() => {
      fetchData();
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const activeSession = sessions.find(s => s.id === activeSessionId);

  const handleSelectSession = (id: string) => {
    setActiveSessionId(id);
    setIsTyping(false);
  };

  const handleSendMessage = async (text: string) => {
    if (!activeSession) return;

    const userTimestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const userMsg: Message = {
      id: `msg-u-${Date.now()}`,
      sender: 'user',
      text,
      timestamp: userTimestamp
    };

    // Update active session locally first to show the message immediately
    const updatedMessages = [...activeSession.messages, userMsg];
    setSessions(prev => prev.map(s => {
      if (s.id === activeSessionId) {
        return {
          ...s,
          messages: updatedMessages,
          currentWorkflowSteps: [
            `Sending message to agent core: "${text}"`,
            'Connecting to backend API workflow orchestrator...'
          ]
        };
      }
      return s;
    }));

    setIsTyping(true);

    // Call FastAPI Backend if active
    if (backendActive) {
      try {
        const chatRes = await fetch(`${BACKEND_URL}/api/chat`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            session_id: activeSessionId,
            message: text
          })
        });

        if (chatRes.ok) {
          const resData = await chatRes.json();

          // Wait a brief simulated latency so typing indicator shows naturally
          setTimeout(() => {
            const aiMsgTimestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            const cardData = resData.cards && resData.cards.length > 0 ? resData.cards[0] : null;

            const aiMsg: Message = {
              id: `msg-ai-${Date.now()}`,
              sender: 'ai',
              text: resData.message,
              timestamp: aiMsgTimestamp,
              cardType: cardData ? cardData.type : undefined,
              cardData: cardData ? cardData.data : undefined
            };

            setSessions(prev => prev.map(s => {
              if (s.id === activeSessionId) {
                const isBooking = (resData.intent === 'site_visit' || resData.intent === 'site_visit_booking') && cardData;
                const isEscalation = resData.intent === 'escalation_request' || resData.intent === 'human_escalation' || resData.conversation_stage === 'escalation';

                const newSession: CustomerSession = {
                  ...s,
                  leadScore: resData.lead_score,
                  leadTemperature: resData.temperature,
                  buyingProbability: Math.round(resData.lead_score * 0.98),
                  conversationStage: resData.conversation_stage,
                  nextAction: resData.next_action,
                  isEscalated: isEscalation,
                  isBookingConfirmed: isBooking ? true : s.isBookingConfirmed,
                  bookingDetails: isBooking ? cardData.data : s.bookingDetails,
                  currentWorkflowSteps: resData.workflow_steps,
                  messages: [...updatedMessages, aiMsg]
                };

                // Sync milestones
                newSession.journeyMilestones = newSession.journeyMilestones.map(m => {
                  if (m.id === 'm2' && resData.lead_score >= 50) return { ...m, status: 'completed', timestamp: 'Active' };
                  if (m.id === 'm3' && resData.conversation_stage === 'recommending') return { ...m, status: 'completed', timestamp: 'Active' };
                  if (m.id === 'm4' && newSession.isBookingConfirmed) return { ...m, status: 'completed', timestamp: 'Active' };
                  if (m.id === 'm5' && newSession.isEscalated) return { ...m, status: 'completed', timestamp: 'Active' };
                  return m;
                });

                return newSession;
              }
              return s;
            }));

            setIsTyping(false);
            
            // Re-fetch dashboard stats to update funnel/kpi states
            fetchDashboardStats();
          }, 1200);

          return;
        }
      } catch (err) {
        console.log("[PropAgent Sync] API call failed. Falling back to local simulation logic.");
      }
    }

    // Fallback: Run local simulation if backend is inactive or failed
    runLocalSimulationFallback(text, updatedMessages);
  };

  const fetchDashboardStats = async () => {
    try {
      const statsRes = await fetch(`${BACKEND_URL}/api/dashboard`);
      if (statsRes.ok) {
        const statsData = await statsRes.json();
        setDashboardStats(statsData);
      }
    } catch (err) {
      // Fail silently to avoid console warnings when offline
    }
  };

  // Local dialog agent simulation fallback
  const runLocalSimulationFallback = (text: string, updatedMessages: Message[]) => {
    setTimeout(() => {
      const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      const lowerText = text.toLowerCase();
      
      let replyText = "";
      let cardType: Message['cardType'] = undefined;
      let cardData: any = undefined;
      let score = activeSession ? activeSession.leadScore : 50;
      let stage = activeSession ? activeSession.conversationStage : 'initial';
      let nextAction = activeSession ? activeSession.nextAction : 'ask_qualification';
      let isEscalated = activeSession ? activeSession.isEscalated : false;
      let isBookingConfirmed = activeSession ? activeSession.isBookingConfirmed : false;
      let bookingDetails = activeSession ? activeSession.bookingDetails : undefined;

      const hasKeywords = (kws: string[]) => kws.some(kw => lowerText.includes(kw));

      let detectedIntent = "greeting";

      if (hasKeywords(['agent', 'connect', 'negotiate', 'negotiation', 'human', 'director', 'manager', 'speak to'])) {
        detectedIntent = "human_escalation";
        replyText = "Understood. I have flagged your profile for custom price negotiation on our premium inventory. To secure the best terms, I have paused automated AI workflows and routed you directly to our Senior Sales Director. He will contact you shortly.";
        cardType = 'escalation';
        cardData = { agentName: 'Mr. Vikram Rathore (Senior Sales Director)', phone: '+91 99999 88888' };
        score = 95;
        stage = 'escalation';
        nextAction = 'completed';
        isEscalated = true;
      } else if (hasKeywords(['book', 'visit', 'tour', 'schedule', 'appointment'])) {
        detectedIntent = "site_visit_booking";
        const requestedDay = lowerText.includes('sunday') ? 'This Sunday (May 31)' : 'This Saturday (May 30)';
        const requestedTime = (lowerText.includes('morning') || lowerText.includes('11')) ? '11:00 AM' : '4:00 PM';
        replyText = "Your physical site inspection has been confirmed. A dedicated investment advisor will guide you through the plot borders, layout maps, and clear title documentation. Here are your booking details:";
        cardType = 'booking';
        cardData = { date: requestedDay, time: requestedTime, plotName: 'Green Meadows Phase 1 (Plot A12)', agentName: 'Rohan Sharma', status: 'Confirmed' };
        score = 90;
        stage = 'completed';
        nextAction = 'completed';
        isBookingConfirmed = true;
        bookingDetails = cardData;
      } else if (hasKeywords(['investment', 'roi', 'returns', 'appreciation'])) {
        detectedIntent = "investment_query";
        replyText = "Green Meadows Phase-II has shown projected appreciation of 18–22% YoY due to upcoming ORR connectivity and IT corridor expansion.";
        cardType = 'property';
        cardData = mockProperties[0];
        score = Math.min(score + 10, 95);
        if (stage === 'initial') stage = 'qualifying';
        else if (stage === 'qualifying') stage = 'recommending';
        nextAction = 'suggest_site_visit';
      } else if (hasKeywords(['emi', 'loan', 'finance', 'installment'])) {
        detectedIntent = "emi_query";
        replyText = "Flexible EMI plans starting from ₹24,500/month are available through partnered banking institutions.";
        cardType = 'emi_plan';
        cardData = { plotPrice: '₹55,00,000' };
        score = Math.min(score + 5, 95);
        if (stage === 'initial') stage = 'qualifying';
        else if (stage === 'qualifying') stage = 'recommending';
        nextAction = 'suggest_site_visit';
      } else if (hasKeywords(['hmda', 'approved', 'dtcp', 'legal'])) {
        detectedIntent = "compliance_query";
        replyText = "All highlighted properties are HMDA & DTCP approved with verified legal documentation.";
        score = Math.min(score + 5, 95);
        if (stage === 'initial') stage = 'qualifying';
        else if (stage === 'qualifying') stage = 'recommending';
        nextAction = 'suggest_site_visit';
      } else if (hasKeywords(['price', 'plot', 'budget', 'cost'])) {
        detectedIntent = "pricing_query";
        replyText = "Based on your budget, Plot A12 at Green Meadows is the strongest investment match.";
        cardType = 'property';
        cardData = mockProperties[0];
        score = Math.min(score + 10, 95);
        if (stage === 'initial') stage = 'qualifying';
        else if (stage === 'qualifying') stage = 'recommending';
        nextAction = 'suggest_site_visit';
      } else {
        detectedIntent = "greeting";
        replyText = "Welcome to PropAgent AI Sales Assistant. I can assist you with verifying HMDA layout approvals, calculating plot EMI options, scheduling site visits, or matching plots. Let's begin with your target budget and location preference.";
        score = Math.min(score + 5, 90);
      }

      const temp: CustomerSession['leadTemperature'] = isEscalated ? 'Escalated' : score >= 85 ? 'Hot' : score >= 50 ? 'Warm' : 'Cold';

      const aiMsg: Message = {
        id: `msg-sim-${Date.now()}`,
        sender: 'ai',
        text: replyText,
        timestamp,
        cardType,
        cardData
      };

      setSessions(prev => prev.map(s => {
        if (s.id === activeSessionId) {
          const updated: CustomerSession = {
            ...s,
            leadScore: score,
            leadTemperature: temp,
            buyingProbability: Math.round(score * 0.98),
            conversationStage: stage,
            nextAction,
            isEscalated,
            isBookingConfirmed,
            bookingDetails,
            currentWorkflowSteps: [
              'Bypassed backend API. Loaded local fallback agent.',
              `Intent detected: ${detectedIntent} (Local Fallback)`,
              `Recalculated Lead Score: ${score}`,
              `Stage transition: ${s.conversationStage} -> ${stage}`
            ],
            messages: [...updatedMessages, aiMsg]
          };

          // Sync milestones
          updated.journeyMilestones = updated.journeyMilestones.map(m => {
            if (m.id === 'm2' && score >= 50) return { ...m, status: 'completed', timestamp: 'Active' };
            if (m.id === 'm3' && stage === 'recommending') return { ...m, status: 'completed', timestamp: 'Active' };
            if (m.id === 'm4' && updated.isBookingConfirmed) return { ...m, status: 'completed', timestamp: 'Active' };
            if (m.id === 'm5' && updated.isEscalated) return { ...m, status: 'completed', timestamp: 'Active' };
            return m;
          });

          return updated;
        }
        return s;
      }));

      setIsTyping(false);
    }, 1200);
  };

  const handleBookSiteVisit = (plotName: string) => {
    handleSendMessage(`I want to book a site visit to view ${plotName}`);
  };

  const handleResetDemo = async () => {
    setIsTyping(false);
    if (backendActive) {
      try {
        const resetRes = await fetch(`${BACKEND_URL}/api/reset-demo`, { method: 'POST' });
        if (resetRes.ok) {
          await fetchData();
          return;
        }
      } catch (err) {
        console.error('Reset endpoint failed:', err);
      }
    }
    // local reset fallback
    setSessions(JSON.parse(JSON.stringify(mockChats)));
    setDashboardStats(mockDashboardStats);
  };

  if (!activeSession) return null;

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-brand-darkbg font-sans">
      
      {/* Top Banner Branding */}
      <div className="bg-slate-950/90 border-b border-slate-900 px-4 py-2 flex items-center justify-between text-xs select-none shrink-0">
        <div className="flex items-center space-x-2">
          <Cpu className="w-4.5 h-4.5 text-brand-primary animate-pulse" />
          <span className="font-bold tracking-wide text-slate-200 uppercase font-sans">Autonomous AI Sales Agent Panel</span>
          <span className="bg-brand-primary/10 text-brand-primary border border-brand-primary/20 text-[9px] font-bold px-1.5 py-0.5 rounded font-sans">V1.2 PROTOTYPE</span>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-1.5">
            <span className={`w-2.5 h-2.5 rounded-full ${backendActive ? 'bg-emerald-500 animate-pulse' : 'bg-yellow-500 animate-ping'}`} />
            <span className={`w-2.5 h-2.5 rounded-full ${backendActive ? 'bg-emerald-500' : 'bg-yellow-500'} absolute`} />
            <span className="text-[10px] text-slate-400 font-semibold font-mono uppercase">
              {backendActive ? 'FastAPI Connected' : 'Local Fallback Simulator'}
            </span>
          </div>
          <div className="text-[10px] text-slate-500 font-mono">PORT: 8000 | 3000</div>
        </div>
      </div>

      {/* Main Layout Workspace Grid */}
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden relative">
        <Sidebar 
          sessions={sessions} 
          activeSessionId={activeSessionId} 
          onSelectSession={handleSelectSession} 
        />

        <ChatWindow 
          session={activeSession} 
          onSendMessage={handleSendMessage} 
          isTyping={isTyping} 
          onBookSiteVisit={handleBookSiteVisit} 
        />

        <Dashboard 
          stats={dashboardStats} 
          activeSession={activeSession} 
          onResetDemo={handleResetDemo} 
          backendActive={backendActive}
          lastSyncTime={lastSyncTime}
        />
      </div>

      {/* Optional Roadmap footer view in workspace layout */}
      <div className="bg-slate-950/80 border-t border-slate-900 px-6 py-4 max-h-48 overflow-y-auto shrink-0">
        <FutureScope />
      </div>
    </div>
  );
};
export default App;
