import React from 'react';
import { Sparkles, Bot, ArrowRight, Zap, Leaf } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const AISuggestionCard: React.FC = () => {
  const { navigate, streak, ecoScore } = useApp();

  return (
    <div className="p-5 sm:p-6 rounded-3xl bg-gradient-to-br from-[#087F5B] to-[#173B32] text-white shadow-xl shadow-[#087F5B]/20 relative overflow-hidden group">
      {/* Decorative leaf / light accents */}
      <div className="absolute right-0 top-0 w-48 h-48 bg-white/10 rounded-full blur-2xl pointer-events-none group-hover:scale-110 transition-transform" />
      <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-[#39A96B]/30 rounded-full blur-xl pointer-events-none" />

      <div className="relative z-10">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-xl bg-white/20 backdrop-blur-md text-white">
              <Bot className="w-4 h-4" />
            </span>
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-200">
              VELORA AI INSIGHT
            </span>
          </div>
          <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-[#F4C95D] text-[#173B32] shadow-sm">
            94% Match
          </span>
        </div>

        <h3 className="text-base sm:text-lg font-extrabold leading-snug">
          “Based on your {streak}-day momentum and today's moderate activity, try a 15-minute outdoor nature walk.”
        </h3>

        <p className="text-xs sm:text-sm text-emerald-100/80 mt-2 leading-relaxed">
          Lowers afternoon blood sugar, burns ~65 kcal, and prevents vehicle emissions (+10 Eco Points).
        </p>

        <div className="flex flex-wrap items-center gap-3 mt-4 pt-3 border-t border-white/15">
          <button
            onClick={() => navigate('/map')}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white text-[#087F5B] font-bold text-xs shadow-md hover:bg-emerald-50 hover:scale-105 active:scale-95 transition-all"
          >
            <Zap className="w-3.5 h-3.5 fill-current text-[#F4A261]" />
            <span>Start Activity on Map</span>
          </button>

          <button
            onClick={() => navigate('/coach')}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/15 hover:bg-white/25 text-white font-semibold text-xs transition-colors"
          >
            <span>Ask Coach Why</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
