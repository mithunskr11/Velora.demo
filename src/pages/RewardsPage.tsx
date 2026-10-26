import React from 'react';
import { Award, Flame, Star, Sparkles, CheckCircle2, Lock, Zap, Leaf } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const RewardsPage: React.FC = () => {
  const { xp, levelInfo, streak, badges, ecoScore, showBadgeCelebration } = useApp();

  const xpRules = [
    { action: 'Daily Habit Checked', reward: '+10 to +25 XP', icon: '✓' },
    { action: 'Track GPS Workout', reward: '+30 to +50 XP', icon: '🏃' },
    { action: 'Post Workout Proof', reward: '+10 Community XP', icon: '📸' },
    { action: '7-Day Streak Milestone', reward: '+50 Bonus XP', icon: '🔥' },
    { action: 'Monthly Plan Review', reward: '+50 XP', icon: '📊' },
    { action: 'Sustainable Eco Action', reward: '+10 to +25 Eco Points', icon: '🌱' },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 dark:bg-amber-950/60 text-[#F4A261] dark:text-[#F4C95D] text-xs font-bold mb-2">
          <Award className="w-3.5 h-3.5" />
          <span>Gamification & Milestone System</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#173B32] dark:text-emerald-50">
          Rewards & Badges
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-emerald-300/80 mt-1">
          Every intentional action earns XP, levels up your lifestyle mastery, and unlocks badges.
        </p>
      </div>

      {/* Level Progress Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-[#173B32] via-[#087F5B] to-[#39A96B] text-white shadow-xl relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 relative z-10">
          <div>
            <span className="text-xs font-extrabold uppercase tracking-wider text-emerald-200">
              CURRENT TIER
            </span>
            <div className="flex items-baseline gap-3 mt-1">
              <span className="text-4xl sm:text-5xl font-extrabold font-mono">
                LEVEL {levelInfo.level}
              </span>
              <span className="text-sm font-bold text-[#F4C95D]">
                Habit Architect ⭐
              </span>
            </div>
            <p className="text-xs text-emerald-100/80 mt-1">
              {levelInfo.currentXp} total XP earned • {levelInfo.nextLevelXp - levelInfo.currentXp} XP to Level {levelInfo.level + 1}
            </p>
          </div>

          <div className="sm:text-right">
            <span className="text-3xl sm:text-4xl font-extrabold font-mono text-[#F4C95D]">
              {levelInfo.currentXp} / {levelInfo.nextLevelXp} XP
            </span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-6 w-full bg-black/20 rounded-full h-3 overflow-hidden p-0.5 relative z-10">
          <div
            className="bg-[#F4C95D] h-2 rounded-full transition-all duration-500"
            style={{ width: `${levelInfo.progressPercentage}%` }}
          />
        </div>
      </div>

      {/* Badges Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-extrabold text-[#173B32] dark:text-emerald-100 flex items-center gap-2">
            <Award className="w-5 h-5 text-[#087F5B]" />
            Achievement Badges ({badges.filter(b => b.unlocked).length} / {badges.length} Unlocked)
          </h3>
          <span className="text-xs text-slate-400">Keep completing daily targets</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {badges.map((badge) => (
            <div
              key={badge.id}
              onClick={() => showBadgeCelebration(badge)}
              className={`p-5 rounded-3xl border transition-all flex items-start gap-4 cursor-pointer hover:scale-102 ${
                badge.unlocked
                  ? 'bg-white dark:bg-[#102A24] border-emerald-100 dark:border-emerald-900/40 shadow-sm hover:shadow-md'
                  : 'bg-[#F4FAF5]/60 dark:bg-[#173B32]/40 border-slate-200/50 dark:border-emerald-950/40 opacity-70 hover:opacity-90'
              }`}
            >
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-3xl shrink-0 ${
                badge.unlocked ? 'bg-amber-50 dark:bg-amber-950/40 shadow-sm' : 'bg-slate-100 dark:bg-emerald-950/60 grayscale'
              }`}>
                {badge.icon}
              </div>

              <div className="space-y-1 flex-1 min-w-0">
                <div className="flex items-center justify-between gap-1">
                  <h4 className="text-sm font-extrabold text-[#173B32] dark:text-emerald-100 truncate">
                    {badge.name}
                  </h4>
                  {badge.unlocked ? (
                    <span className="text-[10px] font-bold text-[#087F5B] dark:text-[#7BC96F] shrink-0">
                      Unlocked ✓
                    </span>
                  ) : (
                    <Lock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  )}
                </div>

                <p className="text-xs text-slate-500 dark:text-emerald-300/70 leading-relaxed">
                  {badge.description}
                </p>

                <p className="text-[10px] text-slate-400 pt-1">
                  Req: {badge.requirement}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* XP Earning Mechanics Guide */}
      <div className="p-6 rounded-3xl bg-white dark:bg-[#102A24] border border-emerald-100 dark:border-emerald-900/40 shadow-sm space-y-4">
        <h3 className="text-base font-extrabold text-[#173B32] dark:text-emerald-100">
          How to Earn XP & Eco Points
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {xpRules.map((rule) => (
            <div key={rule.action} className="p-3.5 rounded-2xl bg-[#F4FAF5] dark:bg-[#173B32] flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-700 dark:text-emerald-200">
                {rule.icon} {rule.action}
              </span>
              <span className="text-xs font-extrabold text-[#087F5B] dark:text-[#7BC96F]">
                {rule.reward}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
