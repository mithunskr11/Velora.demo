import React from 'react';
import { Award, Sparkles, X, Share2, ArrowRight } from 'lucide-react';
import { Badge } from '../../types';
import { useApp } from '../../context/AppContext';

interface BadgeCelebrationModalProps {
  badge: Badge | null;
  onClose: () => void;
}

export const BadgeCelebrationModal: React.FC<BadgeCelebrationModalProps> = ({ badge, onClose }) => {
  const { navigate, createCommunityPost } = useApp();

  if (!badge) return null;

  const handleShareBadge = () => {
    createCommunityPost(
      `Just unlocked the "${badge.name}" badge on VELORA! 🔥 Consistency pays off!`,
      undefined,
      undefined,
      badge.name
    );
    onClose();
    navigate('/community');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="w-full max-w-md bg-white dark:bg-[#102A24] rounded-3xl p-6 sm:p-8 shadow-2xl border-2 border-amber-300 dark:border-amber-700/60 text-center relative overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Subtle decorative glow */}
        <div className="absolute -top-12 -right-12 w-36 h-36 bg-amber-400/20 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -bottom-12 -left-12 w-36 h-36 bg-emerald-400/20 rounded-full blur-2xl pointer-events-none" />

        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-emerald-200 hover:bg-slate-100 dark:hover:bg-emerald-900/40"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="w-20 h-20 rounded-3xl bg-amber-100 dark:bg-amber-950/60 text-4xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-amber-500/20 animate-bounce">
          {badge.icon}
        </div>

        <span className="text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400 block mb-1">
          ACHIEVEMENT UNLOCKED ⭐
        </span>

        <h3 className="text-2xl font-extrabold text-[#173B32] dark:text-emerald-100">
          {badge.name}
        </h3>

        <p className="text-xs sm:text-sm text-slate-600 dark:text-emerald-200/80 mt-2 leading-relaxed">
          {badge.description}
        </p>

        <div className="p-3 my-4 rounded-2xl bg-amber-50/80 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/60 text-xs text-amber-800 dark:text-amber-300 font-semibold">
          Requirement Met: {badge.requirement}
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3 mt-6">
          <button
            onClick={handleShareBadge}
            className="w-full sm:flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl bg-[#087F5B] hover:bg-[#076a4c] text-white text-xs font-bold shadow-md shadow-[#087F5B]/30 hover:scale-102 active:scale-98 transition-all"
          >
            <Share2 className="w-4 h-4" />
            <span>Share to Community</span>
          </button>

          <button
            onClick={onClose}
            className="w-full sm:w-auto px-5 py-3 rounded-2xl bg-slate-100 dark:bg-emerald-950/50 hover:bg-slate-200 text-slate-700 dark:text-emerald-200 text-xs font-semibold transition-colors"
          >
            Awesome!
          </button>
        </div>
      </div>
    </div>
  );
};
