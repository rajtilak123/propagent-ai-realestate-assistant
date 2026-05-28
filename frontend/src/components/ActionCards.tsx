import React from 'react';
import { motion } from 'framer-motion';
import { 
  MapPin, 
  TrendingUp, 
  ShieldCheck, 
  Calendar, 
  Clock, 
  User, 
  Sparkles,
  Percent,
  AlertTriangle
} from 'lucide-react';
import { Property } from '../types';

// ==================== PROPERTY CARD ====================
interface PropertyCardProps {
  property: Property;
  onBookClick?: (plotName: string) => void;
}

export const PropertyCard: React.FC<PropertyCardProps> = ({ property, onBookClick }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5, rotateX: 0.5, rotateY: -0.5, boxShadow: '0 12px 30px -5px rgba(16,185,129,0.15), 0 8px 15px -6px rgba(16,185,129,0.15)' }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      className="glass-card overflow-hidden rounded-2xl border border-slate-700/40 w-full max-w-sm shadow-xl font-sans mt-2"
    >
      <div className="relative h-44 w-full">
        <img 
          src={property.image} 
          alt={property.name} 
          className="w-full h-full object-cover"
        />
        {/* Match Score Badge */}
        <div className="absolute top-3 right-3 bg-brand-darkbg/85 backdrop-blur border border-brand-primary/50 text-brand-primary text-xs font-bold px-2.5 py-1 rounded-full flex items-center space-x-1 shadow-glow animate-pulse-slow">
          <Sparkles className="w-3.5 h-3.5" />
          <span>{property.matchScore}% Match</span>
        </div>
      </div>

      <div className="p-4 space-y-3">
        <div>
          <h4 className="text-base font-semibold text-slate-100 font-sans tracking-wide leading-tight">{property.name}</h4>
          <div className="flex items-center space-x-1 mt-1 text-slate-400 text-xs">
            <MapPin className="w-3.5 h-3.5 text-brand-primary" />
            <span>{property.location}</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 border-y border-slate-800/60 py-2.5 my-2.5 text-xs">
          <div className="flex flex-col">
            <span className="text-slate-400">Total Price</span>
            <span className="text-brand-primary font-bold text-sm mt-0.5">{property.price}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-slate-400">Plot Size</span>
            <span className="text-slate-200 font-semibold mt-0.5">{property.size}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-slate-400">Facing</span>
            <span className="text-slate-200 font-semibold mt-0.5">{property.facing}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-slate-400">Approvals</span>
            <span className="text-brand-primary font-semibold flex items-center mt-0.5 text-[11px]">
              <ShieldCheck className="w-3.5 h-3.5 mr-0.5" />
              HMDA/DTCP Approved
            </span>
          </div>
        </div>

        {/* Dynamic Highlight Factors */}
        <div className="space-y-1.5 text-xs bg-slate-900/40 p-2.5 rounded-xl border border-slate-800/50">
          <div className="flex items-start space-x-1.5">
            <TrendingUp className="w-3.5 h-3.5 text-yellow-500 mt-0.5 shrink-0" />
            <span><strong className="text-yellow-500 font-medium">Appreciation:</strong> {property.appreciationPotential}</span>
          </div>
          <div className="flex items-start space-x-1.5">
            <Sparkles className="w-3.5 h-3.5 text-brand-primary mt-0.5 shrink-0" />
            <span><strong className="text-brand-primary font-medium">Why This Plot?</strong> {property.explanation}</span>
          </div>
        </div>

        {/* AI Confidence Indicators */}
        <div className="border-t border-slate-800/60 pt-2.5 mt-2.5 text-[10px] space-y-2 font-sans bg-slate-950/20 p-2.5 rounded-xl border border-slate-900/40 shadow-inner">
          <div className="flex justify-between items-center">
            <span className="text-slate-450 font-medium">Recommendation Confidence</span>
            <div className="flex items-center space-x-2">
              <div className="w-20 h-1.5 bg-slate-950 rounded-full overflow-hidden border border-slate-900">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: '94%' }}
                  transition={{ duration: 0.8, ease: 'easeOut' }}
                  className="bg-emerald-500 h-full" 
                />
              </div>
              <span className="text-emerald-400 font-bold font-mono">94%</span>
            </div>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-slate-450 font-medium">Investment Fit Match</span>
            <div className="flex items-center space-x-2">
              <div className="w-20 h-1.5 bg-slate-950 rounded-full overflow-hidden border border-slate-900">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${property.matchScore}%` }}
                  transition={{ duration: 0.8, ease: 'easeOut' }}
                  className="bg-brand-primary h-full" 
                />
              </div>
              <span className="text-brand-primary font-bold font-mono">{property.matchScore}%</span>
            </div>
          </div>
        </div>

        {onBookClick && (
          <button 
            onClick={() => onBookClick(property.name)}
            className="w-full bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-slate-100 text-xs font-semibold py-2 px-4 rounded-xl shadow-glow hover:scale-[1.02] transition-all duration-200 mt-2 flex items-center justify-center space-x-1"
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Schedule Site Visit</span>
          </button>
        )}
      </div>
    </motion.div>
  );
};

// ==================== BOOKING CONFIRMATION CARD ====================
interface BookingCardProps {
  date: string;
  time: string;
  plotName: string;
  agentName: string;
  status: string;
}

export const BookingCard: React.FC<BookingCardProps> = ({ date, time, plotName, agentName, status }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="glass-card rounded-2xl border-l-4 border-l-brand-primary border-slate-700/40 p-4 w-full max-w-xs shadow-xl font-sans mt-2"
    >
      <div className="flex justify-between items-start">
        <h4 className="text-xs font-bold uppercase tracking-wider text-brand-primary">Site Visit Scheduled</h4>
        <span className="bg-emerald-500/25 text-brand-primary border border-brand-primary/30 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">
          {status}
        </span>
      </div>

      <div className="mt-3 space-y-2 text-xs">
        <p className="text-slate-100 font-semibold leading-snug">{plotName}</p>
        
        <div className="flex items-center space-x-2 mt-2 bg-slate-950/30 p-2 rounded-lg text-slate-200">
          <Calendar className="w-4 h-4 text-brand-primary shrink-0" />
          <div>
            <p className="font-semibold">{date}</p>
            <div className="flex items-center space-x-1 text-slate-400 text-[10px] mt-0.5">
              <Clock className="w-3 h-3" />
              <span>{time}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-2 pt-1.5 border-t border-slate-800/60">
          <User className="w-4 h-4 text-emerald-400/80" />
          <div className="text-[11px]">
            <p className="text-slate-400">Assigned Partner</p>
            <p className="text-slate-200 font-semibold">{agentName}</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// ==================== ESCALATION HANDOFF CARD ====================
interface EscalationCardProps {
  agentName: string;
  phone: string;
}

export const EscalationCard: React.FC<EscalationCardProps> = ({ agentName, phone }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="glass-card rounded-2xl border-l-4 border-l-rose-500 border-slate-700/40 p-4 w-full max-w-xs shadow-xl font-sans mt-2"
    >
      <div className="flex justify-between items-start">
        <h4 className="text-xs font-bold uppercase tracking-wider text-rose-400 flex items-center space-x-1">
          <AlertTriangle className="w-3.5 h-3.5 mr-1" />
          Human Agent Hand-off
        </h4>
        <span className="bg-rose-500/25 text-rose-400 border border-rose-500/30 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">
          Escalated
        </span>
      </div>

      <div className="mt-3 space-y-2 text-xs">
        <p className="text-slate-200 leading-relaxed">
          AI workflow has paused. You have been connected with our sales executive to negotiate customized pricing.
        </p>

        <div className="bg-rose-950/20 border border-rose-500/10 p-2.5 rounded-xl space-y-1 mt-2">
          <div className="flex items-center space-x-2">
            <User className="w-4 h-4 text-rose-400" />
            <span className="font-semibold text-slate-200">{agentName}</span>
          </div>
          <div className="text-[10px] text-slate-400 pl-6">
            Senior Sales Lead
          </div>
          <div className="text-slate-300 font-mono pl-6 mt-0.5">
            📞 {phone}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// ==================== LEAD SUMMARY CARD ====================
interface LeadSummaryCardProps {
  budget?: string;
  location?: string;
  timeline?: string;
  score: number;
}

export const LeadSummaryCard: React.FC<LeadSummaryCardProps> = ({ budget, location, timeline, score }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -3, rotateX: 0.5, rotateY: -0.5, boxShadow: '0 8px 20px -5px rgba(14,165,233,0.1)' }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      className="glass-card rounded-2xl border border-slate-800 p-4 w-full max-w-xs shadow-md font-sans text-xs mt-2 space-y-3"
    >
      <div className="flex items-center justify-between">
        <span className="text-slate-300 font-semibold font-sans">Lead Qualification Record</span>
        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
          score >= 80 ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
          score >= 50 ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30' :
          'bg-slate-500/20 text-slate-400 border border-slate-500/30'
        }`}>
          Score: {score}
        </span>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between border-b border-slate-900/60 pb-1.5 text-slate-450">
          <span>Budget Range</span>
          <span className="text-slate-200 font-semibold">{budget || 'Pending input'}</span>
        </div>
        <div className="flex justify-between border-b border-slate-900/60 pb-1.5 text-slate-450">
          <span>Location Focus</span>
          <span className="text-slate-200 font-semibold">{location || 'Pending input'}</span>
        </div>
        <div className="flex justify-between border-b border-slate-900/60 pb-1.5 text-slate-450">
          <span>Timeline Target</span>
          <span className="text-slate-200 font-semibold">{timeline || 'Pending input'}</span>
        </div>
      </div>

      {/* AI Qualification Confidence */}
      <div className="border-t border-slate-900/60 pt-2.5 mt-1 text-[10px] flex justify-between items-center font-sans">
        <span className="text-slate-500">Qualification Confidence</span>
        <div className="flex items-center space-x-2">
          <div className="w-16 h-1 bg-slate-950 rounded-full overflow-hidden border border-slate-900/40">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: '91%' }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
              className="bg-sky-400 h-full" 
            />
          </div>
          <span className="text-sky-400 font-bold font-mono">91%</span>
        </div>
      </div>
    </motion.div>
  );
};

// ==================== EMI CALCULATION CARD ====================
interface EmiPlanCardProps {
  plotPrice: string;
}

export const EmiPlanCard: React.FC<EmiPlanCardProps> = ({ plotPrice }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -3, rotateX: 0.5, rotateY: -0.5, boxShadow: '0 8px 20px -5px rgba(168,85,247,0.15)' }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      className="glass-card rounded-2xl border border-purple-500/20 p-4 w-full max-w-xs shadow-xl font-sans mt-2 space-y-3"
    >
      <div className="flex justify-between items-start">
        <h4 className="text-xs font-bold uppercase tracking-wider text-purple-400 flex items-center space-x-1">
          <Percent className="w-3.5 h-3.5 mr-1" />
          Flexible EMI Options
        </h4>
        <span className="bg-purple-500/25 text-purple-400 border border-purple-500/30 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">
          Calculator
        </span>
      </div>

      <div className="space-y-2 text-xs">
        <p className="text-slate-300">
          Estimated schemes for <strong>{plotPrice}</strong> with 20% downpayment:
        </p>

        <div className="space-y-1.5 mt-2 font-sans">
          <div className="flex justify-between bg-slate-900/60 p-2 rounded-lg border border-slate-800">
            <span className="text-slate-400">3 Years (8.5% Rate)</span>
            <span className="text-purple-400 font-bold">₹1,38,000 / mo</span>
          </div>
          <div className="flex justify-between bg-slate-900/60 p-2 rounded-lg border border-slate-800">
            <span className="text-slate-400">5 Years (8.9% Rate)</span>
            <span className="text-purple-400 font-bold">₹91,000 / mo</span>
          </div>
          <div className="flex justify-between bg-slate-900/60 p-2 rounded-lg border border-slate-800">
            <span className="text-slate-400">10 Years (9.5% Rate)</span>
            <span className="text-purple-400 font-bold">₹58,500 / mo</span>
          </div>
        </div>

        {/* Dynamic Investment Suitability Confidence */}
        <div className="border-t border-slate-900/60 pt-2.5 mt-1.5 text-[10px] flex justify-between items-center font-sans">
          <span className="text-slate-500">Investment Fit Confidence</span>
          <div className="flex items-center space-x-2">
            <div className="w-16 h-1 bg-slate-950 rounded-full overflow-hidden border border-slate-900/40">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: '96%' }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
                className="bg-purple-400 h-full" 
              />
            </div>
            <span className="text-purple-400 font-bold font-mono">96%</span>
          </div>
        </div>

        <div className="text-[10px] text-slate-400 text-center leading-relaxed">
          *Bank loans available from HDFC, ICICI, SBI with 80% funding.
        </div>
      </div>
    </motion.div>
  );
};
