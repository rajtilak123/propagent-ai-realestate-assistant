import React from 'react';

import { 
  CheckCircle2, 
  Circle, 
  Map, 
  BrainCircuit
} from 'lucide-react';
import { JourneyMilestone } from '../types';

// ==================== CUSTOMER JOURNEY TIMELINE ====================
interface JourneyTimelineProps {
  milestones: JourneyMilestone[];
}

export const CustomerJourneyTimeline: React.FC<JourneyTimelineProps> = ({ milestones }) => {
  return (
    <div className="glass-card rounded-2xl p-4 border border-slate-800/60 font-sans text-xs">
      <div className="flex items-center space-x-1.5 mb-3">
        <Map className="w-4 h-4 text-brand-primary" />
        <h4 className="font-semibold text-slate-100 uppercase tracking-wider text-[11px]">Customer Journey Map</h4>
      </div>

      <div className="relative pl-5 space-y-4 border-l border-slate-850/60 ml-2 py-1">
        {milestones.map((milestone) => {
          const isDone = milestone.status === 'completed';
          return (
            <div key={milestone.id} className="relative">
              {/* Dot Icon */}
              <div className="absolute -left-[27px] top-0.5 bg-brand-darkbg rounded-full p-0.5 z-10">
                {isDone ? (
                  <CheckCircle2 className="w-4.5 h-4.5 text-brand-primary fill-brand-primary/10" />
                ) : (
                  <Circle className="w-4.5 h-4.5 text-slate-600" />
                )}
              </div>

              {/* Milestone Details */}
              <div className="flex flex-col">
                <span className={`font-medium ${isDone ? 'text-slate-100' : 'text-slate-500'}`}>
                  {milestone.label}
                </span>
                {milestone.timestamp && (
                  <span className="text-[10px] text-slate-400 mt-0.5">{milestone.timestamp}</span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// ==================== AGENTIC AI WORKFLOW VISUALIZER ====================
import { motion } from 'framer-motion';

interface WorkflowProps {
  steps: string[];
  stage: string;
  session: any;
}

export const AgenticAIWorkflowVisualization: React.FC<WorkflowProps> = ({ steps, stage, session }) => {
  const stages = [
    {
      name: 'Intent Detection',
      desc: 'Classifies customer message category and intent confidence.',
      getLog: () => {
        const found = steps.find(s => s.includes("Intent classified:") || s.includes("Intent parsed:"));
        return found ? found.replace(/Intent classified:|Intent parsed:/i, '').trim() : 'Classifying intent...';
      }
    },
    {
      name: 'Memory Extraction',
      desc: 'Extracts location, budget, and timeline facts into session memory.',
      getLog: () => {
        const found = steps.find(s => s.includes("Memory update:") || s.includes("Memory extracted:"));
        if (found) return found.replace(/Memory update:|Memory extracted:/i, '').trim();
        const mem = session.memory || {};
        if (mem.budget || mem.preferredLocations) {
          const loc = mem.preferredLocations && mem.preferredLocations.length > 0 ? mem.preferredLocations.join(', ') : 'None';
          return `Extracted: budget=${mem.budget || 'any'}, location=${loc}`;
        }
        return 'No new variables extracted.';
      }
    },
    {
      name: 'Lead Qualification',
      desc: 'Calculates active score and temperature dynamically.',
      getLog: () => {
        const found = steps.find(s => s.includes("Lead Score recalculated:") || s.includes("Lead Score calculated:"));
        return found ? found.replace(/Lead Score recalculated:|Lead Score calculated:/i, '').trim() : `Score: ${session.leadScore} (${session.leadTemperature})`;
      }
    },
    {
      name: 'Recommendation Engine',
      desc: 'Queries knowledge base and computes Vaastu & appreciation yields.',
      getLog: () => {
        const found = steps.find(s => s.includes("Generated action card wrapper:") || s.includes("Recommend"));
        if (found) return found.replace(/Generated action card wrapper:/i, '').trim();
        if (session.memory && session.memory.viewedProperties && session.memory.viewedProperties.length > 0) return 'Recommended: Green Meadows Plot A12';
        return 'Analyzing potential investment matches...';
      }
    },
    {
      name: 'Workflow Transition',
      desc: 'Moves pipeline stage depending on current milestones.',
      getLog: () => {
        const found = steps.find(s => s.includes("Stage transition:"));
        return found ? found.replace(/Stage transition:/i, '').trim() : `Active Stage: ${stage}`;
      }
    },
    {
      name: 'Next Best Action',
      desc: 'Dispatches next conversational goal or human agent handover.',
      getLog: () => {
        const found = steps.find(s => s.includes("Autonomous Action Orchestrator chose action:") || s.includes("Action Orchestrator:"));
        return found ? found.replace(/Autonomous Action Orchestrator chose action:|Action Orchestrator:/i, '').trim() : `Next Goal: ${session.nextAction}`;
      }
    }
  ];

  return (
    <div className="glass-card rounded-2xl p-4 border border-slate-800/60 font-sans text-xs flex flex-col space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-1.5">
          <BrainCircuit className="w-4 h-4 text-brand-primary animate-pulse" />
          <h4 className="font-semibold text-slate-100 uppercase tracking-wider text-[11px]">Live Agentic Engine</h4>
        </div>
        <span className="bg-emerald-500/10 text-brand-primary border border-brand-primary/20 font-mono text-[9px] uppercase font-bold px-2 py-0.5 rounded-md">
          Stage: {stage}
        </span>
      </div>

      {/* Vertical Timeline */}
      <div className="relative pl-6 space-y-4.5 border-l border-slate-800/60 ml-3.5 py-1">
        {stages.map((stg, i) => {
          const logVal = stg.getLog();
          const isDone = logVal && !logVal.includes("Scanning") && !logVal.includes("Analyzing") && !logVal.includes("Classifying");
          return (
            <motion.div 
              key={i}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.08 }}
              className="relative group"
            >
              {/* Timeline Node dot */}
              <div className="absolute -left-[33px] top-0.5 bg-slate-950 rounded-full p-0.5 z-10">
                <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-bold border transition-all duration-300 ${
                  isDone 
                    ? 'bg-brand-primary/10 text-brand-primary border-brand-primary/50 shadow-glow' 
                    : 'bg-slate-900 text-slate-500 border-slate-850'
                }`}>
                  {i + 1}
                </div>
              </div>

              {/* Stage Description & Log Badge */}
              <div className="flex flex-col space-y-0.5">
                <span className="font-semibold text-slate-200 text-[10px] tracking-wide group-hover:text-brand-primary transition-colors duration-150">
                  {stg.name}
                </span>
                <p className="text-[9px] text-slate-500 leading-snug">
                  {stg.desc}
                </p>
                {logVal && (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-[9px] text-emerald-400 font-mono mt-1 bg-slate-950/60 border border-slate-900 px-2 py-0.5 rounded-md w-fit flex items-center space-x-1"
                  >
                    <span className={`w-1 h-1 rounded-full bg-emerald-400 ${isDone ? 'animate-pulse' : ''}`} />
                    <span className="truncate max-w-[200px]">{logVal}</span>
                  </motion.div>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Listening Footer */}
      <div className="flex items-center space-x-1.5 animate-pulse text-[9px] text-brand-primary/80 font-bold border-t border-slate-900 pt-3 font-mono">
        <span className="w-1.5 h-1.5 rounded-full bg-brand-primary" />
        <span>Agentic Orchestrator Listening...</span>
      </div>
    </div>
  );
};
