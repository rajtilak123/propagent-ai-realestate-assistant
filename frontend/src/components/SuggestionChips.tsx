import React from 'react';
import { Landmark, CalendarRange, Coins, HeartHandshake, MapPin } from 'lucide-react';

interface SuggestionChipsProps {
  onChipClick: (text: string) => void;
  isEscalated: boolean;
}

export const SuggestionChips: React.FC<SuggestionChipsProps> = ({ onChipClick, isEscalated }) => {
  const chips = [
    { text: 'Plot prices', icon: Coins, color: 'text-yellow-400 border-yellow-500/30' },
    { text: 'Book site visit', icon: CalendarRange, color: 'text-emerald-400 border-emerald-500/30' },
    { text: 'HMDA approved?', icon: Landmark, color: 'text-sky-400 border-sky-500/30' },
    { text: 'EMI plans', icon: Coins, color: 'text-purple-400 border-purple-500/30' },
    { text: 'Investment options', icon: MapPin, color: 'text-amber-400 border-amber-500/30' },
    { text: 'Connect Agent', icon: HeartHandshake, color: 'text-rose-400 border-rose-500/30' },
  ];

  if (isEscalated) return null;

  return (
    <div className="flex flex-wrap gap-2 py-3 px-4 border-t border-slate-800/40 bg-slate-950/20 max-w-full overflow-x-auto">
      {chips.map((chip, idx) => {
        const Icon = chip.icon;
        return (
          <button
            key={idx}
            onClick={() => onChipClick(chip.text)}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-full border text-xs font-sans font-medium bg-slate-900/60 hover:bg-slate-800/60 hover:border-slate-500/50 hover:scale-105 active:scale-95 transition-all duration-200 ${chip.color}`}
          >
            <Icon className="w-3.5 h-3.5" />
            <span>{chip.text}</span>
          </button>
        );
      })}
    </div>
  );
};
