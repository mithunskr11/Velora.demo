import React from 'react';
import { Flame, Star, Leaf, CheckCircle2, TrendingUp, Sparkles, Award } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const TopStatCards: React.FC = () => {
  const { streak, xp, levelInfo, ecoScore, habitCompletionPercentage, navigate } = useApp();

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
      {/* 1. Streak Card */}
      <div 
        onClick={() => navigate('/rewards')}
        className="p-4 sm:p-5 rounded-2xl sm:rounded-3xl bg-white dark:bg-[#102A24] border border-emerald-100/80 dark:border-emerald-900/40 shadow-sm hover:shadow-md transition-all cursor-pointer group relative overflow-hidden"
      >
        <div className="absolute -right-4 -top-4 w-16 h-16 bg-amber-400/10 rounded-full blur-xl group-hover:scale-150 transition-transform" />
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-bold text-slate-500 dark:text-emerald-300/70 tracking-wide">
            CURRENT STREAK
          </span>
          <div className="w-8 h-8 rounded-xl bg-amber-100/80 dark:bg-amber-950/60 text-[#F4A261] dark:text-[#F4C95D] flex items-center justify-center group-hover:scale-110 transition-transform">
            <Flame className="w-4 h-4 fill-current" />
          </div>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl sm:text-3xl font-extrabold text-[#173B32] dark:text-emerald-100 font-mono tracking-tight">
            {streak}
          </span>
          <span className="text-xs font-bold text-amber-600 dark:text-amber-400">
            Days Active 🔥
          </span>
        </div>
        <p className="text-[11px] text-slate-500 dark:text-emerald-300/60 mt-1 truncate">
          Personal record: 14 days
        </p>
      </div>

      {/* 2. XP & Level Card */}
      <div 
        onClick={() => navigate('/rewards')}
        className="p-4 sm:p-5 rounded-2xl sm:rounded-3xl bg-white dark:bg-[#102A24] border border-emerald-100/80 dark:border-emerald-900/40 shadow-sm hover:shadow-md transition-all cursor-pointer group relative overflow-hidden"
      >
        <div className="absolute -right-4 -top-4 w-16 h-16 bg-yellow-400/10 rounded-full blur-xl group-hover:scale-150 transition-transform" />
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-bold text-slate-500 dark:text-emerald-300/70 tracking-wide">
            EXPERIENCE XP
          </span>
          <div className="w-8 h-8 rounded-xl bg-yellow-100/80 dark:bg-yellow-950/60 text-[#F4C95D] flex items-center justify-center group-hover:scale-110 transition-transform">
            <Star className="w-4 h-4 fill-current" />
          </div>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl sm:text-3xl font-extrabold text-[#173B32] dark:text-emerald-100 font-mono tracking-tight">
            {xp}
          </span>
          <span className="text-xs font-bold text-[#087F5B] dark:text-[#7BC96F]">
            Lvl {levelInfo.level} ⭐
          </span>
        </div>
        <div className="mt-2 w-full bg-slate-100 dark:bg-emerald-950/50 rounded-full h-1.5 overflow-hidden">
          <div 
            className="bg-[#F4C95D] h-1.5 rounded-full transition-all duration-500"
            style={{ width: `${levelInfo.progressPercentage}%` }}
          />
        </div>
      </div>

      {/* 3. Eco Score Card */}
      <div 
        onClick={() => navigate('/eco')}
        className="p-4 sm:p-5 rounded-2xl sm:rounded-3xl bg-white dark:bg-[#102A24] border border-emerald-100/80 dark:border-emerald-900/40 shadow-sm hover:shadow-md transition-all cursor-pointer group relative overflow-hidden"
      >
        <div className="absolute -right-4 -top-4 w-16 h-16 bg-emerald-400/10 rounded-full blur-xl group-hover:scale-150 transition-transform" />
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-bold text-slate-500 dark:text-emerald-300/70 tracking-wide">
            ECO SCORE
          </span>
          <div className="w-8 h-8 rounded-xl bg-emerald-100/80 dark:bg-emerald-950/60 text-[#087F5B] dark:text-[#7BC96F] flex items-center justify-center group-hover:scale-110 transition-transform">
            <Leaf className="w-4 h-4 fill-current" />
          </div>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl sm:text-3xl font-extrabold text-[#087F5B] dark:text-[#7BC96F] font-mono tracking-tight">
            {ecoScore}
          </span>
          <span className="text-xs font-bold text-slate-400">/ 100 🌿</span>
        </div>
        <p className="text-[11px] text-emerald-700/80 dark:text-emerald-300/70 mt-1 truncate">
          Top 12% eco impact
        </p>
      </div>

      {/* 4. Habit Completion Card */}
      <div 
        onClick={() => navigate('/habits')}
        className="p-4 sm:p-5 rounded-2xl sm:rounded-3xl bg-white dark:bg-[#102A24] border border-emerald-100/80 dark:border-emerald-900/40 shadow-sm hover:shadow-md transition-all cursor-pointer group relative overflow-hidden"
      >
        <div className="absolute -right-4 -top-4 w-16 h-16 bg-teal-400/10 rounded-full blur-xl group-hover:scale-150 transition-transform" />
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-bold text-slate-500 dark:text-emerald-300/70 tracking-wide">
            HABIT COMPLETION
          </span>
          <div className="w-8 h-8 rounded-xl bg-teal-100/80 dark:bg-teal-950/60 text-[#39A96B] flex items-center justify-center group-hover:scale-110 transition-transform">
            <CheckCircle2 className="w-4 h-4" />
          </div>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl sm:text-3xl font-extrabold text-[#173B32] dark:text-emerald-100 font-mono tracking-tight">
            {habitCompletionPercentage}%
          </span>
          <span className="text-xs font-bold text-[#39A96B]">Today ✓</span>
        </div>
        <div className="mt-2 w-full bg-slate-100 dark:bg-emerald-950/50 rounded-full h-1.5 overflow-hidden">
          <div 
            className="bg-[#39A96B] h-1.5 rounded-full transition-all duration-500"
            style={{ width: `${habitCompletionPercentage}%` }}
          />
        </div>
      </div>
    </div>
  );
};
