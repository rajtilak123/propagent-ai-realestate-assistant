import React from 'react';
import { motion } from 'framer-motion';
import { 
  Milestone, 
  Globe2, 
  MessageSquareShare, 
  Smartphone,
  DatabaseZap,
  Mic,
  ChevronRight
} from 'lucide-react';

export const FutureScope: React.FC = () => {
  const roadmaps = [
    {
      title: 'WhatsApp API Integration',
      desc: 'Connect our Agentic state machine directly with Twilio Business WhatsApp API to enable real-time messaging on verified numbers.',
      icon: Smartphone,
      color: 'text-emerald-400 border-emerald-500/20 bg-emerald-500/5'
    },
    {
      title: 'Voice AI Assistant',
      desc: 'Process incoming audio messages using OpenAI Whisper and text-to-speech to support conversational voice note intake.',
      icon: Mic,
      color: 'text-purple-400 border-purple-500/20 bg-purple-500/5'
    },
    {
      title: 'Telugu Multilingual Support',
      desc: 'Deploy regional language support using fine-tuned translation models to resolve local real estate queries natively in Telugu.',
      icon: Globe2,
      color: 'text-amber-400 border-amber-500/20 bg-amber-500/5'
    },
    {
      title: 'RAG Semantic Search',
      desc: 'Integrate vector databases (ChromaDB/Pgvector) to enable semantic search on legal titles, DTCP approvals, and zoning brochures.',
      icon: DatabaseZap,
      color: 'text-sky-400 border-sky-500/20 bg-sky-500/5'
    },
    {
      title: 'CRM Synchronization',
      desc: 'Sync hot leads, classified budgets, and booked site visits directly into Salesforce, HubSpot, or custom builder software in real-time.',
      icon: MessageSquareShare,
      color: 'text-rose-400 border-rose-500/20 bg-rose-500/5'
    },
    {
      title: 'Automated Follow-ups',
      desc: 'Schedule agentic follow-up triggers and drips depending on customer timeline memory parameters to boost site visit rates.',
      icon: Milestone,
      color: 'text-indigo-400 border-indigo-500/20 bg-indigo-500/5'
    }
  ];

  return (
    <div className="glass-panel border border-slate-800/80 rounded-2xl p-6 mt-6 shadow-xl font-sans">
      <div className="flex items-center space-x-2.5 mb-4">
        <Milestone className="w-5 h-5 text-brand-primary" />
        <h3 className="text-sm font-bold text-slate-100 uppercase tracking-wider">Enterprise Roadmap & Extensions</h3>
      </div>
      
      <p className="text-xs text-slate-400 leading-relaxed mb-5">
        Designed for production readiness, the modular architecture decouples the dialog state machine, enabling plug-and-play expansions for the following modules:
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {roadmaps.map((item, idx) => {
          const Icon = item.icon;
          return (
            <motion.div
              key={idx}
              whileHover={{ scale: 1.02 }}
              className={`p-4 rounded-2xl border flex flex-col space-y-2.5 ${item.color}`}
            >
              <div className="flex items-center space-x-2">
                <div className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 shrink-0">
                  <Icon className="w-4 h-4 text-slate-200" />
                </div>
                <h4 className="text-xs font-semibold text-slate-100">{item.title}</h4>
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed flex-1">
                {item.desc}
              </p>
              <div className="flex items-center text-[10px] text-slate-500 font-semibold uppercase hover:text-slate-300 cursor-pointer pt-1">
                <span>View Schema</span>
                <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};
