import React from 'react';
import { motion } from 'framer-motion';
import { Brain } from 'lucide-react';

interface TypingIndicatorProps {
  workflowSteps?: string[];
}

export const TypingIndicator: React.FC<TypingIndicatorProps> = ({ workflowSteps }) => {
  // Select some default simulated agentic reasoning steps if none are active
  const defaultSteps = [
    'Intent detection engine matching keywords...',
    'Fetching customer memory profile...',
    'Consulting real estate property database...',
    'Calculating matching score & composing response...'
  ];

  const steps = workflowSteps && workflowSteps.length > 0 ? workflowSteps : defaultSteps;

  return (
    <div className="flex flex-col space-y-3 p-4 bg-whatsapp-bubbleBgIn/50 rounded-2xl rounded-tl-none max-w-[85%] border border-slate-800/40">
      {/* WhatsApp standard dots */}
      <div className="flex items-center space-x-2">
        <div className="flex space-x-1 items-center">
          <span className="block w-2.5 h-2.5 bg-brand-primary rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
          <span className="block w-2.5 h-2.5 bg-brand-primary rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
          <span className="block w-2.5 h-2.5 bg-brand-primary rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
        </div>
        <span className="text-xs text-slate-400 font-medium font-sans">PropAgent AI is processing...</span>
      </div>

      {/* Agent Reasoning Box */}
      <div className="mt-2 text-xs border border-brand-primary/20 rounded-xl bg-slate-900/60 p-3 space-y-2">
        <div className="flex items-center space-x-1.5 text-brand-primary font-semibold font-sans">
          <Brain className="w-3.5 h-3.5 animate-pulse-slow" />
          <span>Agent Core Reasoning Pipeline</span>
        </div>
        
        <div className="space-y-1.5 font-mono text-[10px] text-slate-300">
          {steps.map((step, idx) => (
            <motion.div 
              key={idx} 
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.4 }}
              className="flex items-start space-x-1.5"
            >
              <span className="text-brand-primary/70">{idx + 1}.</span>
              <span className="flex-1 leading-relaxed">{step}</span>
            </motion.div>
          ))}
        </div>

        <div className="h-1 flow-line rounded mt-1.5" />
      </div>
    </div>
  );
};
