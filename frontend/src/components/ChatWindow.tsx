import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Send, 
  Smile, 
  Paperclip, 
  Mic, 
  Phone, 
  Video, 
  MoreVertical, 
  Bot, 
  User, 
  AlertTriangle
} from 'lucide-react';
import { CustomerSession } from '../types';
import { PropertyCard, BookingCard, EscalationCard, LeadSummaryCard, EmiPlanCard } from './ActionCards';
import { SuggestionChips } from './SuggestionChips';
import { TypingIndicator } from './TypingIndicator';

interface ChatWindowProps {
  session: CustomerSession;
  onSendMessage: (text: string) => void;
  isTyping: boolean;
  onBookSiteVisit: (plotName: string) => void;
}

export const ChatWindow: React.FC<ChatWindowProps> = ({ 
  session, 
  onSendMessage, 
  isTyping, 
  onBookSiteVisit 
}) => {
  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const isWhatsApp = session.isWhatsApp || session.id.startsWith('+') || session.id.startsWith('whatsapp:');
  const lastMsg = session.messages[session.messages.length - 1];
  const isUserLast = lastMsg && lastMsg.sender === 'user';

  const getWhatsAppBadge = () => {
    if (!isWhatsApp) return null;
    if (session.isEscalated) {
      return (
        <span className="bg-red-500/20 text-red-400 border border-red-500/30 text-[9px] font-bold px-1.5 py-0.5 rounded flex items-center space-x-1">
          <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
          <span>🔴 Escalated</span>
        </span>
      );
    }
    if (session.isBookingConfirmed) {
      return (
        <span className="bg-teal-500/20 text-teal-400 border border-teal-500/30 text-[9px] font-bold px-1.5 py-0.5 rounded flex items-center space-x-1">
          <span>📅 Visit Scheduled</span>
        </span>
      );
    }
    if (isUserLast) {
      return (
        <span className="bg-yellow-500/20 text-yellow-400 border border-yellow-500/30 text-[9px] font-bold px-1.5 py-0.5 rounded flex items-center space-x-1 animate-pulse">
          <span className="w-1.5 h-1.5 rounded-full bg-yellow-500" />
          <span>🟡 Awaiting Reply</span>
        </span>
      );
    }
    return (
      <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[9px] font-bold px-1.5 py-0.5 rounded flex items-center space-x-1">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
        <span>🟢 WhatsApp Live</span>
      </span>
    );
  };

  // Auto-scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [session.messages, isTyping]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    onSendMessage(inputText.trim());
    setInputText('');
  };

  const handleChipClick = (text: string) => {
    onSendMessage(text);
  };

  const getStageLabel = (stage: CustomerSession['conversationStage']) => {
    switch (stage) {
      case 'initial': return 'Greeting & Intake';
      case 'qualifying': return 'Lead Qualification';
      case 'recommending': return 'Property Recommendation';
      case 'booking': return 'Site Visit Scheduling';
      case 'escalation': return 'Human Agent Hand-off';
      case 'completed': return 'Closed Complete';
      default: return stage;
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-slate-900/10 border-r border-slate-800/80">
      {/* Active Chat Header */}
      <div className="p-3 border-b border-slate-800/80 bg-slate-950/70 flex items-center justify-between select-none">
        <div className="flex items-center space-x-3 min-w-0">
          <img
            src={session.avatar}
            alt={session.name}
            className="w-10 h-10 rounded-full border border-slate-700/60"
          />
          <div className="min-w-0">
            <div className="flex items-center space-x-1.5">
              <h2 className="text-xs font-semibold text-slate-100 font-sans truncate">{session.name}</h2>
              {isWhatsApp ? (
                getWhatsAppBadge()
              ) : session.isEscalated ? (
                <span className="bg-rose-500/20 text-rose-400 border border-rose-500/30 text-[9px] font-bold px-1.5 py-0.5 rounded uppercase flex items-center space-x-0.5">
                  <AlertTriangle className="w-2.5 h-2.5" />
                  <span>Escalated</span>
                </span>
              ) : (
                <span className="bg-brand-primary/10 text-brand-primary border border-brand-primary/20 text-[9px] font-bold px-1.5 py-0.5 rounded uppercase flex items-center space-x-0.5">
                  <Bot className="w-2.5 h-2.5 animate-pulse" />
                  <span>Active AI</span>
                </span>
              )}
            </div>
            <p className="text-[10px] text-slate-400 mt-0.5 font-sans">
              Stage: <strong className="text-brand-primary">{getStageLabel(session.conversationStage)}</strong>
            </p>
          </div>
        </div>

        {/* Action icons */}
        <div className="flex items-center space-x-3 text-slate-400">
          <Phone className="w-4 h-4 hover:text-slate-200 cursor-pointer" />
          <Video className="w-4.5 h-4.5 hover:text-slate-200 cursor-pointer" />
          <div className="h-4 w-px bg-slate-800" />
          <MoreVertical className="w-4 h-4 hover:text-slate-200 cursor-pointer" />
        </div>
      </div>

      {/* Messages Scroll Area */}
      <div 
        className="flex-1 p-4 overflow-y-auto space-y-4 bg-cover bg-center"
        style={{
          backgroundImage: 'radial-gradient(circle at 10% 20%, rgba(13, 20, 35, 0.95) 0%, rgba(9, 13, 22, 0.98) 90%)'
        }}
      >
        <div className="flex justify-center select-none mb-2">
          <span className="bg-slate-950/80 border border-slate-800/80 text-[10px] text-slate-400 font-sans font-medium px-3 py-1 rounded-full uppercase tracking-wider">
            🔒 End-to-End Encrypted Agent Simulation
          </span>
        </div>

        <AnimatePresence initial={false}>
          {session.messages.map((message) => {
            const isUser = message.sender === 'user';
            const isSystem = message.sender === 'system';

            if (isSystem) {
              return (
                <div key={message.id} className="flex justify-center my-2">
                  <span className="bg-slate-800/40 border border-slate-700/20 text-[10px] text-slate-300 font-sans px-3 py-1 rounded-lg">
                    {message.text}
                  </span>
                </div>
              );
            }

            return (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 10, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
                className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}
              >
                <div className="flex items-end space-x-1.5 max-w-[85%]">
                  {!isUser && (
                    <div className="w-6 h-6 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-[10px] shrink-0 mb-1 select-none">
                      {session.isEscalated ? <User className="w-3.5 h-3.5 text-rose-400" /> : <Bot className="w-3.5 h-3.5 text-brand-primary" />}
                    </div>
                  )}

                  <div className="flex flex-col space-y-1">
                    {/* Bubble */}
                    <div
                      className={`px-3.5 py-2.5 rounded-2xl text-[12px] font-sans leading-relaxed shadow-md ${
                        isUser
                          ? 'bg-whatsapp-bubbleBgOut text-slate-100 rounded-tr-none border border-emerald-950/40'
                          : 'bg-whatsapp-bubbleBgIn text-slate-200 rounded-tl-none border border-slate-800/50'
                      }`}
                    >
                      <p className="whitespace-pre-line">{message.text}</p>
                      <span className={`block text-[9px] text-right mt-1.5 select-none ${isUser ? 'text-emerald-400/80' : 'text-slate-500'}`}>
                        {message.timestamp}
                      </span>
                    </div>

                    {/* Cards associated with message */}
                    {message.cardType && (
                      <div className="pt-1.5">
                        {message.cardType === 'property' && (
                          <PropertyCard 
                            property={message.cardData} 
                            onBookClick={session.isEscalated ? undefined : onBookSiteVisit} 
                          />
                        )}
                        {message.cardType === 'booking' && (
                          <BookingCard {...message.cardData} />
                        )}
                        {message.cardType === 'escalation' && (
                          <EscalationCard {...message.cardData} />
                        )}
                        {message.cardType === 'lead_summary' && (
                          <LeadSummaryCard {...message.cardData} />
                        )}
                        {message.cardType === 'emi_plan' && (
                          <EmiPlanCard {...message.cardData} />
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>

        {isTyping && (
          <div className="flex justify-start">
            <TypingIndicator 
              workflowSteps={session.currentWorkflowSteps} 
            />
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggestion Chips */}
      <SuggestionChips onChipClick={handleChipClick} isEscalated={session.isEscalated} />

      {/* Input Area */}
      <form onSubmit={handleSubmit} className="p-3 border-t border-slate-800 bg-slate-950/90 flex items-center space-x-2">
        <div className="flex items-center space-x-1.5 text-slate-400 px-1 select-none">
          <Smile className="w-5 h-5 hover:text-slate-200 cursor-pointer transition-colors" />
          <Paperclip className="w-4.5 h-4.5 hover:text-slate-200 cursor-pointer transition-colors" />
        </div>

        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          disabled={session.isEscalated}
          placeholder={session.isEscalated ? "Handoff complete. Input disabled." : "Type a message or select a suggestion..."}
          className={`flex-1 text-xs px-4 py-2.5 rounded-xl text-slate-200 bg-slate-900 border focus:outline-none transition-all duration-200 ${
            session.isEscalated 
              ? 'border-slate-800 placeholder-slate-600 bg-slate-950/20 text-slate-500 cursor-not-allowed'
              : 'border-slate-800 focus:border-brand-primary/50 focus:bg-slate-900/90 placeholder-slate-500'
          }`}
        />

        <div className="flex items-center justify-center">
          {inputText.trim() && !session.isEscalated ? (
            <button
              type="submit"
              className="w-10 h-10 rounded-xl bg-brand-primary hover:bg-emerald-400 text-slate-950 flex items-center justify-center hover:scale-105 active:scale-95 shadow-glow transition-all"
            >
              <Send className="w-4 h-4" />
            </button>
          ) : (
            <div className={`w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center text-slate-400 ${session.isEscalated ? 'cursor-not-allowed' : 'cursor-pointer hover:bg-slate-700 hover:text-slate-200'} transition-all`}>
              <Mic className="w-4.5 h-4.5" />
            </div>
          )}
        </div>
      </form>
    </div>
  );
};
