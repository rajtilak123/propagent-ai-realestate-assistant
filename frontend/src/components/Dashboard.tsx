import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, 
  Flame, 
  PhoneCall, 
  Percent, 
  Activity, 
  RotateCcw 
} from 'lucide-react';
import { CustomerSession, DashboardStats } from '../types';
import { CustomerJourneyTimeline, AgenticAIWorkflowVisualization } from './Visualizers';

interface DashboardProps {
  stats: DashboardStats;
  activeSession: CustomerSession;
  onResetDemo: () => void;
  backendActive: boolean;
  lastSyncTime: string;
}

// Custom Counter Animation using fixed duration and steps
const AnimatedCounter: React.FC<{ value: number; duration?: number; suffix?: string; isFloat?: boolean }> = ({ value, duration = 800, suffix = "", isFloat = false }) => {
  const [count, setCount] = React.useState<number>(0);

  React.useEffect(() => {
    let start = 0;
    const end = value;
    if (start === end) {
      setCount(end);
      return;
    }

    const steps = 40;
    const increment = (end - start) / steps;
    let currentStep = 0;

    const timer = setInterval(() => {
      currentStep += 1;
      const nextVal = start + increment * currentStep;
      if (currentStep >= steps) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(isFloat ? parseFloat(nextVal.toFixed(1)) : Math.round(nextVal));
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [value, duration, isFloat]);

  return <span>{count}{suffix}</span>;
};

export const Dashboard: React.FC<DashboardProps> = ({ 
  stats, 
  activeSession, 
  onResetDemo,
  backendActive,
  lastSyncTime
}) => {
  
  // Calculate specific metrics for progress bars
  const totalTemp = stats.leadTemperatures.Hot + stats.leadTemperatures.Warm + stats.leadTemperatures.Cold + stats.leadTemperatures.Escalated;
  const hotPct = Math.round((stats.leadTemperatures.Hot / (totalTemp || 1)) * 100);
  const warmPct = Math.round((stats.leadTemperatures.Warm / (totalTemp || 1)) * 100);
  const coldPct = Math.round((stats.leadTemperatures.Cold / (totalTemp || 1)) * 100);
  const escalatedPct = Math.round((stats.leadTemperatures.Escalated / (totalTemp || 1)) * 100);

  return (
    <div className="w-full xl:w-96 flex flex-col bg-slate-950/95 border-l border-slate-800/80 h-full overflow-y-auto select-none font-sans">
      {/* Dashboard Header */}
      <div className="p-4 border-b border-slate-800/80 bg-slate-900/40 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Activity className="w-4.5 h-4.5 text-brand-primary animate-pulse" />
          <h2 className="text-xs font-bold text-slate-100 uppercase tracking-wider">Enterprise Analytics</h2>
        </div>

        {/* Demo Reset Trigger */}
        <button
          onClick={onResetDemo}
          className="flex items-center space-x-1 px-2.5 py-1.5 rounded-lg border border-slate-800 hover:border-brand-primary/40 text-[10px] text-slate-400 hover:text-brand-primary transition-all duration-200"
          title="Reset Seed Data"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset Demo</span>
        </button>
      </div>

      {/* Main stats block */}
      <div className="p-4 space-y-5">
        
        {/* Live System Status Widget */}
        <div className="glass-card rounded-2xl p-4 border border-slate-800/50 flex flex-col space-y-3 relative overflow-hidden shadow-lg shadow-brand-primary/2">
          <div className="absolute top-0 right-0 w-24 h-24 bg-brand-primary/5 rounded-full blur-xl pointer-events-none" />
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-450 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.6)]"></span>
              </span>
              <span className="text-[10px] font-bold text-slate-200 uppercase tracking-wider">AI Engine: Active</span>
            </div>
            <span className="bg-brand-primary/10 text-brand-primary border border-brand-primary/20 text-[8px] font-bold px-2 py-0.5 rounded-full font-sans uppercase">
              Demo Mode: Enabled
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-900/80 text-[10px] text-slate-400 font-mono">
            <div>
              <span className="text-slate-500">Backend:</span>{' '}
              <span className={backendActive ? 'text-emerald-450 font-semibold' : 'text-yellow-500 font-semibold'}>
                {backendActive ? 'Connected' : 'Local Simulation'}
              </span>
            </div>
            <div className="text-right">
              <span className="text-slate-500">Sync:</span>{' '}
              <span className="text-slate-300">{lastSyncTime}</span>
            </div>
          </div>
        </div>

        {/* KPI Mini Grid */}
        <div className="grid grid-cols-2 gap-3.5">
          <motion.div 
            whileHover={{ y: -3, borderColor: 'rgba(16, 185, 129, 0.25)' }}
            transition={{ duration: 0.2 }}
            className="glass-card rounded-xl p-3 flex flex-col space-y-1 border border-slate-900 cursor-pointer shadow-md"
          >
            <div className="flex items-center space-x-1.5 text-slate-400">
              <Users className="w-3.5 h-3.5 text-brand-primary" />
              <span className="text-[10px] uppercase font-bold tracking-wide">Total Leads</span>
            </div>
            <span className="text-lg font-bold text-slate-100">
              <AnimatedCounter value={stats.totalLeads} />
            </span>
          </motion.div>

          <motion.div 
            whileHover={{ y: -3, borderColor: 'rgba(239, 68, 68, 0.25)' }}
            transition={{ duration: 0.2 }}
            className="glass-card rounded-xl p-3 flex flex-col space-y-1 border border-slate-900 cursor-pointer shadow-md"
          >
            <div className="flex items-center space-x-1.5 text-slate-400">
              <Flame className="w-3.5 h-3.5 text-red-500" />
              <span className="text-[10px] uppercase font-bold tracking-wide">Hot Leads</span>
            </div>
            <span className="text-lg font-bold text-slate-100">
              <AnimatedCounter value={stats.leadTemperatures.Hot} />
            </span>
          </motion.div>

          <motion.div 
            whileHover={{ y: -3, borderColor: 'rgba(244, 63, 94, 0.25)' }}
            transition={{ duration: 0.2 }}
            className="glass-card rounded-xl p-3 flex flex-col space-y-1 border border-slate-900 cursor-pointer shadow-md"
          >
            <div className="flex items-center space-x-1.5 text-slate-400">
              <PhoneCall className="w-3.5 h-3.5 text-rose-400" />
              <span className="text-[10px] uppercase font-bold tracking-wide">Escalated</span>
            </div>
            <span className="text-lg font-bold text-slate-100">
              <AnimatedCounter value={stats.escalationsCount} />
            </span>
          </motion.div>

          <motion.div 
            whileHover={{ y: -3, borderColor: 'rgba(16, 185, 129, 0.25)' }}
            transition={{ duration: 0.2 }}
            className="glass-card rounded-xl p-3 flex flex-col space-y-1 border border-slate-900 cursor-pointer shadow-md"
          >
            <div className="flex items-center space-x-1.5 text-slate-400">
              <Percent className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-[10px] uppercase font-bold tracking-wide">Conv. Rate</span>
            </div>
            <span className="text-lg font-bold text-slate-100">
              <AnimatedCounter value={stats.conversionRate} suffix="%" isFloat={true} />
            </span>
          </motion.div>
        </div>

        {/* Lead Score Radial Gauge for active session */}
        <div className="glass-card rounded-2xl p-4 border border-slate-800/60 flex flex-col items-center shadow-md">
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider self-start mb-2">Active Lead Quality Rating</span>
          
          <div className="relative w-28 h-28 flex items-center justify-center">
            {/* SVG circle */}
            <svg className="w-full h-full transform -rotate-90">
              <circle
                cx="56"
                cy="56"
                r="46"
                className="stroke-slate-900 fill-transparent"
                strokeWidth="8"
              />
              <motion.circle
                cx="56"
                cy="56"
                r="46"
                className="stroke-brand-primary fill-transparent"
                strokeWidth="8"
                strokeDasharray="289"
                initial={{ strokeDashoffset: 289 }}
                animate={{ strokeDashoffset: 289 - (289 * activeSession.leadScore) / 100 }}
                transition={{ duration: 1, ease: 'easeOut' }}
              />
            </svg>
            <div className="absolute flex flex-col items-center text-center">
              <span className="text-2xl font-bold text-slate-100">
                <AnimatedCounter value={activeSession.leadScore} />
              </span>
              <span className="text-[9px] text-slate-500 font-medium font-mono">Out of 100</span>
            </div>
          </div>

          {(() => {
            const isWhatsApp = activeSession.isWhatsApp || activeSession.id.startsWith('+') || activeSession.id.startsWith('whatsapp:');
            if (!isWhatsApp) return null;

            const lastMsg = activeSession.messages[activeSession.messages.length - 1];
            const isUserLast = lastMsg && lastMsg.sender === 'user';

            if (activeSession.isEscalated) {
              return (
                <div className="mt-2 text-xs bg-red-500/20 text-red-400 border border-red-500/30 text-[10px] font-bold px-2 py-0.5 rounded flex items-center space-x-1 shadow-glow">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                  <span>🔴 Escalated</span>
                </div>
              );
            }
            if (activeSession.isBookingConfirmed) {
              return (
                <div className="mt-2 text-xs bg-teal-500/20 text-teal-400 border border-teal-500/30 text-[10px] font-bold px-2 py-0.5 rounded flex items-center space-x-1 shadow-glow">
                  <span>📅 Visit Scheduled</span>
                </div>
              );
            }
            if (isUserLast) {
              return (
                <div className="mt-2 text-xs bg-yellow-500/20 text-yellow-400 border border-yellow-500/30 text-[10px] font-bold px-2 py-0.5 rounded flex items-center space-x-1 animate-pulse">
                  <span className="w-1.5 h-1.5 rounded-full bg-yellow-500" />
                  <span>Awaiting Reply</span>
                </div>
              );
            }
            return (
              <div className="mt-2 text-xs bg-emerald-500/20 text-emerald-450 border border-emerald-500/30 text-[10px] font-bold px-2 py-0.5 rounded flex items-center space-x-1 shadow-glow">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-550" />
                <span>🟢 WhatsApp Live</span>
              </div>
            );
          })()}
          
          <div className="flex items-center space-x-2 mt-3 text-xs w-full justify-between bg-slate-900/40 px-3 py-1.5 rounded-xl border border-slate-900">
            <div className="flex flex-col">
              <span className="text-slate-500 text-[10px]">Buying Probability</span>
              <span className="text-slate-200 font-bold">{activeSession.buyingProbability}%</span>
            </div>
            <div className="flex flex-col items-end">
              <span className="text-slate-500 text-[10px]">Temperature</span>
              <span className={`font-bold ${
                activeSession.leadTemperature === 'Hot' ? 'text-red-400' :
                activeSession.leadTemperature === 'Warm' ? 'text-yellow-400' :
                activeSession.leadTemperature === 'Escalated' ? 'text-rose-400' : 'text-slate-400'
              }`}>{activeSession.leadTemperature}</span>
            </div>
          </div>
        </div>

        {/* Lead Temperature Distribution bar */}
        <div className="glass-card rounded-2xl p-4 border border-slate-800/60 space-y-3 shadow-md">
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Lead Temperature Distribution</span>
          <div className="h-3 w-full bg-slate-900 rounded-full flex overflow-hidden">
            <div style={{ width: `${hotPct}%` }} className="bg-red-500 h-full" title={`Hot: ${hotPct}%`} />
            <div style={{ width: `${warmPct}%` }} className="bg-yellow-500 h-full" title={`Warm: ${warmPct}%`} />
            <div style={{ width: `${escalatedPct}%` }} className="bg-rose-500 h-full" title={`Escalated: ${escalatedPct}%`} />
            <div style={{ width: `${coldPct}%` }} className="bg-slate-700 h-full" title={`Cold: ${coldPct}%`} />
          </div>
          <div className="grid grid-cols-4 gap-1 text-[9px] text-center text-slate-400 font-sans">
            <div className="flex items-center justify-center space-x-1">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
              <span>Hot ({stats.leadTemperatures.Hot})</span>
            </div>
            <div className="flex items-center justify-center space-x-1">
              <span className="w-1.5 h-1.5 rounded-full bg-yellow-500" />
              <span>Warm ({stats.leadTemperatures.Warm})</span>
            </div>
            <div className="flex items-center justify-center space-x-1">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
              <span>Esc ({stats.leadTemperatures.Escalated})</span>
            </div>
            <div className="flex items-center justify-center space-x-1">
              <span className="w-1.5 h-1.5 rounded-full bg-slate-700" />
              <span>Cold ({stats.leadTemperatures.Cold})</span>
            </div>
          </div>
        </div>

        {/* Custom Conversion Funnel SVG chart */}
        <div className="glass-card rounded-2xl p-4 border border-slate-800/60 space-y-3 shadow-md">
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Conversion Funnel</span>
          
          <div className="space-y-2">
            {[
              { label: 'Visited Landing Page', value: stats.funnelStats.visited, pct: 100 },
              { label: 'Qualified Leads', value: stats.funnelStats.qualified, pct: Math.round(stats.funnelStats.qualified/stats.funnelStats.visited*100) },
              { label: 'Recommended Plots', value: stats.funnelStats.recommended, pct: Math.round(stats.funnelStats.recommended/stats.funnelStats.visited*100) },
              { label: 'Booked Site Visit', value: stats.funnelStats.booked, pct: Math.round(stats.funnelStats.booked/stats.funnelStats.visited*100) },
            ].map((step, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex justify-between text-[10px] font-sans">
                  <span className="text-slate-300 font-medium">{step.label}</span>
                  <span className="text-slate-400">{step.value} Leads ({step.pct}%)</span>
                </div>
                <div className="h-2 w-full bg-slate-900 rounded-full overflow-hidden border border-slate-900">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${step.pct}%` }}
                    transition={{ duration: 1, delay: idx * 0.15, ease: "easeOut" }}
                    className={`h-full ${idx === 3 ? 'bg-gradient-to-r from-emerald-600 to-teal-400 shadow-glow' : 'bg-slate-700/80'}`}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Journey Timeline */}
        <CustomerJourneyTimeline milestones={activeSession.journeyMilestones} />

        {/* Live Agentic AI Workflow Visualizer */}
        <AgenticAIWorkflowVisualization 
          steps={activeSession.currentWorkflowSteps} 
          stage={activeSession.conversationStage} 
          session={activeSession}
        />

        {/* Activity Feed */}
        <div className="glass-card rounded-2xl p-4 border border-slate-800/60 space-y-3 shadow-md">
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Live Activity Audit</span>
          <div className="max-h-64 overflow-y-auto pr-1">
            <div className="space-y-2.5">
              <AnimatePresence initial={false}>
                {stats.activityFeed.map((activity) => (
                  <motion.div
                    key={activity.id}
                    initial={{ opacity: 0, x: -10, height: 0 }}
                    animate={{ opacity: 1, x: 0, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                    className="flex items-center space-x-2 text-[11px] border-b border-slate-900/60 pb-2 last:border-0 last:pb-0 overflow-hidden font-sans"
                  >
                    <div className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                      activity.type === 'booking' ? 'bg-emerald-500 shadow-[0_0_6px_#10b981]' :
                      activity.type === 'recommendation' ? 'bg-yellow-500 shadow-[0_0_6px_#eab308]' :
                      activity.type === 'escalated' ? 'bg-rose-500 shadow-[0_0_6px_#f43f5e]' : 'bg-slate-500'
                    }`} />
                    <div className="flex-1 truncate">
                      <span className="text-slate-500 font-mono text-[9px]">{activity.timestamp}</span>
                      <span className="text-slate-400 font-medium"> — </span>
                      <span className="font-semibold text-slate-200">{activity.sessionName}</span>
                      <span className="text-slate-400"> {activity.description}</span>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
