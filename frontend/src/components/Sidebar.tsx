import React, { useState } from 'react';
import { Search, Building2, BellRing, Sparkles, MessageCircle, AlertTriangle, CalendarRange } from 'lucide-react';
import { CustomerSession } from '../types';

interface SidebarProps {
  sessions: CustomerSession[];
  activeSessionId: string;
  onSelectSession: (id: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ sessions, activeSessionId, onSelectSession }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredSessions = sessions.filter(session => 
    session.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    session.phone.includes(searchTerm)
  );

  const getTemperatureBadge = (temp: CustomerSession['leadTemperature']) => {
    switch (temp) {
      case 'Hot':
        return (
          <span className="bg-red-500/20 text-red-400 border border-red-500/30 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">
            🔥 Hot
          </span>
        );
      case 'Warm':
        return (
          <span className="bg-yellow-500/20 text-yellow-400 border border-yellow-500/30 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">
            ⚡ Warm
          </span>
        );
      case 'Cold':
        return (
          <span className="bg-slate-700/30 text-slate-400 border border-slate-700/30 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">
            ❄️ Cold
          </span>
        );
      case 'Escalated':
        return (
          <span className="bg-rose-500/20 text-rose-400 border border-rose-500/30 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase flex items-center space-x-0.5">
            <AlertTriangle className="w-2.5 h-2.5" />
            <span>Escalated</span>
          </span>
        );
      default:
        return null;
    }
  };

  const getWhatsAppStatusBadge = (session: CustomerSession) => {
    const isWhatsApp = session.isWhatsApp || session.id.startsWith('+') || session.id.startsWith('whatsapp:');
    if (!isWhatsApp) return null;

    const lastMsg = session.messages[session.messages.length - 1];
    const isUserLast = lastMsg && lastMsg.sender === 'user';

    if (session.isEscalated) {
      return (
        <span className="bg-red-500/20 text-red-400 border border-red-500/30 text-[9px] font-bold px-1.5 py-0.5 rounded flex items-center space-x-1">
          <span className="w-1 h-1 rounded-full bg-red-500 animate-pulse" />
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
          <span className="w-1 h-1 rounded-full bg-yellow-500" />
          <span>Awaiting Reply</span>
        </span>
      );
    }
    return (
      <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[9px] font-bold px-1.5 py-0.5 rounded flex items-center space-x-1">
        <span className="w-1 h-1 rounded-full bg-emerald-500" />
        <span>Live</span>
      </span>
    );
  };

  return (
    <div className="w-full md:w-80 flex flex-col border-r border-slate-800/80 bg-slate-950/80 h-full select-none">
      {/* Brand Header */}
      <div className="p-4 border-b border-slate-800/80 bg-slate-900/40 flex items-center justify-between">
        <div className="flex items-center space-x-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-brand-primary to-emerald-400 flex items-center justify-center shadow-glow">
            <Building2 className="w-5 h-5 text-slate-950" />
          </div>
          <div>
            <h1 className="text-sm font-bold text-slate-100 font-sans tracking-wide">PropAgent AI</h1>
            <div className="flex items-center space-x-1 text-[10px] text-brand-primary font-bold">
              <Sparkles className="w-3 h-3 animate-pulse-slow" />
              <span>SALES AUTOMATION</span>
            </div>
          </div>
        </div>

        {/* Small Active Badge */}
        <div className="bg-slate-800/80 p-1.5 rounded-lg border border-slate-700/50 hover:bg-slate-800 cursor-pointer relative group">
          <BellRing className="w-4 h-4 text-brand-primary" />
          <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-brand-primary rounded-full border-2 border-slate-950 animate-ping" />
          <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-brand-primary rounded-full border-2 border-slate-950" />
        </div>
      </div>

      {/* Search Input */}
      <div className="p-3 border-b border-slate-900/60 bg-slate-950/40">
        <div className="relative">
          <input
            type="text"
            placeholder="Search leads or phone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-900/80 border border-slate-800/80 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-brand-primary/50 transition-colors"
          />
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
        </div>
      </div>

      {/* Chats Section Title */}
      <div className="px-4 py-2 bg-slate-950/30 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
        Active Customer Enquiries ({filteredSessions.length})
      </div>

      {/* Chat List */}
      <div className="flex-1 overflow-y-auto divide-y divide-slate-900/40">
        {filteredSessions.map((session) => {
          const isActive = session.id === activeSessionId;
          const lastMsg = session.messages[session.messages.length - 1];
          const hasBooking = session.isBookingConfirmed;

          return (
            <div
              key={session.id}
              onClick={() => onSelectSession(session.id)}
              className={`flex items-center space-x-3 p-3.5 cursor-pointer hover:bg-slate-900/50 transition-all duration-200 ${
                isActive ? 'bg-slate-900/70 border-l-4 border-l-brand-primary' : 'border-l-4 border-l-transparent'
              }`}
            >
              {/* Avatar Column */}
              <div className="relative shrink-0">
                <img
                  src={session.avatar}
                  alt={session.name}
                  className="w-11 h-11 rounded-full border border-slate-700/60 bg-slate-900"
                />
                {/* Online Green dot */}
                <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 rounded-full border-2 border-slate-950 shadow-glow" />
              </div>

              {/* Chat details */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-0.5">
                  <div className="flex items-center space-x-1.5 min-w-0">
                    <h3 className="text-xs font-semibold text-slate-200 truncate font-sans">{session.name}</h3>
                    {(session.isWhatsApp || session.id.startsWith('+') || session.id.startsWith('whatsapp:')) && (
                      <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[9px] font-bold px-1.5 py-0.2 rounded uppercase shrink-0 flex items-center space-x-0.5" title="WhatsApp Live Session">
                        <MessageCircle className="w-2.5 h-2.5" />
                        <span>WA</span>
                      </span>
                    )}
                  </div>
                  <span className="text-[10px] text-slate-500 shrink-0 font-sans">
                    {lastMsg ? lastMsg.timestamp : ''}
                  </span>
                </div>

                <div className="flex items-center justify-between mt-1">
                  <p className="text-[11px] text-slate-400 truncate pr-2">
                    {lastMsg ? lastMsg.text : 'Start conversation...'}
                  </p>
                  
                  {/* Indicators (Booking icon + unread count) */}
                  <div className="flex items-center space-x-1.5 shrink-0">
                    {getWhatsAppStatusBadge(session)}
                    {hasBooking && (
                      <CalendarRange className="w-3.5 h-3.5 text-emerald-400" />
                    )}
                    {session.unreadCount > 0 && (
                      <span className="bg-brand-primary text-slate-950 font-bold text-[9px] w-4.5 h-4.5 rounded-full flex items-center justify-center shadow-glow animate-pulse">
                        {session.unreadCount}
                      </span>
                    )}
                  </div>
                </div>

                {/* Score & Temperature badges */}
                <div className="flex items-center space-x-1.5 mt-2 flex-wrap gap-y-1">
                  {getTemperatureBadge(session.leadTemperature)}
                  <span className="text-[9px] text-slate-400 font-mono">
                    Score: <strong className="text-slate-300 font-bold">{session.leadScore}</strong>
                  </span>
                </div>
              </div>
            </div>
          );

        })}
        {filteredSessions.length === 0 && (
          <div className="p-8 text-center text-xs text-slate-500 space-y-2">
            <MessageCircle className="w-8 h-8 text-slate-700 mx-auto" />
            <p>No active customers match your search criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
};
