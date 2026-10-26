import React, { useState } from 'react';
import { 
  TrendingUp, 
  Flame, 
  Sparkles, 
  Bot, 
  Smile, 
  Calendar, 
  Zap, 
  Leaf,
  Scale
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const ProgressPage: React.FC = () => {
  const { streak, habitCompletionPercentage, ecoScore, xp, user, navigate } = useApp();
  const [timeframe, setTimeframe] = useState<'weekly' | 'monthly'>('weekly');

  const aiInsights = [
    {
      title: 'Consistency Spike',
      text: 'Your habit consistency improved by 18% this month, driven by early morning hydration and walking.',
      icon: TrendingUp,
      color: 'text-[#087F5B]'
    },
    {
      title: 'Peak Timing Window',
      text: 'You are most consistent with morning activities between 7:00 AM - 8:30 AM before screen time.',
      icon: Zap,
      color: 'text-[#F4A261]'
    },
    {
      title: 'Anchor Keystone Habit',
      text: 'Outdoor walking is currently your strongest anchor habit with a 95% 30-day compliance rate.',
      icon: Sparkles,
      color: 'text-[#4DA3D9]'
    }
  ];

  // Weight Trend Data (67kg down to 65kg)
  const weightData = [
    { week: 'W1 Sep', weight: 67.2 },
    { week: 'W2 Sep', weight: 66.8 },
    { week: 'W3 Sep', weight: 66.4 },
    { week: 'W4 Sep', weight: 65.8 },
    { week: 'W1 Oct', weight: 65.2 },
    { week: 'W2 Oct', weight: 65.0 },
  ];

  // Mood Distribution
  const moodBreakdown = [
    { label: 'Happy 😊', percent: 45, color: 'bg-emerald-500' },
    { label: 'Good 🙂', percent: 35, color: 'bg-[#39A96B]' },
    { label: 'Okay 😐', percent: 12, color: 'bg-amber-400' },
    { label: 'Tired 😴', percent: 8, color: 'bg-slate-400' },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#173B32] dark:text-emerald-50">
            Progress Analytics
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-emerald-300/80 mt-1">
            Data-backed lifestyle trends, physical adaptations, and AI behavioral insights.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-white dark:bg-[#102A24] p-1.5 rounded-2xl border border-emerald-100 dark:border-emerald-900/40">
          <button
            onClick={() => setTimeframe('weekly')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              timeframe === 'weekly'
                ? 'bg-[#087F5B] text-white shadow-sm'
                : 'text-slate-500 dark:text-emerald-200'
            }`}
          >
            Weekly
          </button>
          <button
            onClick={() => setTimeframe('monthly')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              timeframe === 'monthly'
                ? 'bg-[#087F5B] text-white shadow-sm'
                : 'text-slate-500 dark:text-emerald-200'
            }`}
          >
            Monthly
          </button>
        </div>
      </div>

      {/* AI Behavioral Insights Callouts */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {aiInsights.map((insight) => {
          const Icon = insight.icon;
          return (
            <div
              key={insight.title}
              className="p-5 rounded-3xl bg-white dark:bg-[#102A24] border border-emerald-100 dark:border-emerald-900/40 shadow-sm space-y-2"
            >
              <div className="flex items-center gap-2">
                <Icon className={`w-4 h-4 ${insight.color}`} />
                <h4 className="text-xs font-extrabold text-[#173B32] dark:text-emerald-100 uppercase tracking-wide">
                  {insight.title}
                </h4>
              </div>
              <p className="text-xs text-slate-600 dark:text-emerald-200/80 leading-relaxed">
                “{insight.text}”
              </p>
            </div>
          );
        })}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart 1: Habit Completion & Streak Trajectory */}
        <div className="p-6 rounded-3xl bg-white dark:bg-[#102A24] border border-emerald-100 dark:border-emerald-900/40 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-extrabold text-[#173B32] dark:text-emerald-100">
              Habit Completion Rate (85% Average)
            </h3>
            <span className="text-xs font-bold text-[#087F5B] dark:text-[#7BC96F]">
              +14% vs Last Month
            </span>
          </div>

          <div className="h-48 flex items-end justify-between gap-3 pt-6 pb-2">
            {[72, 78, 80, 85, 88, 82, 85].map((pct, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
                <span className="opacity-0 group-hover:opacity-100 text-[10px] bg-slate-800 text-white px-1 rounded transition-opacity">
                  {pct}%
                </span>
                <div
                  className="w-full bg-gradient-to-t from-[#087F5B] to-[#39A96B] rounded-xl transition-all duration-500"
                  style={{ height: `${pct}%` }}
                />
                <span className="text-[11px] font-semibold text-slate-400">
                  {['M', 'T', 'W', 'T', 'F', 'S', 'S'][i]}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Chart 2: Physical Adaptation & Weight Trajectory */}
        <div className="p-6 rounded-3xl bg-white dark:bg-[#102A24] border border-emerald-100 dark:border-emerald-900/40 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-extrabold text-[#173B32] dark:text-emerald-100 flex items-center gap-2">
              <Scale className="w-4 h-4 text-[#4DA3D9]" />
              Weight Adaptation (67kg → 65kg)
            </h3>
            <span className="text-xs font-bold text-[#4DA3D9]">
              -2.2 kg (Lean Mass Retained)
            </span>
          </div>

          <div className="h-48 flex items-end justify-between gap-3 pt-6 pb-2">
            {weightData.map((d) => {
              // Normalize 64kg to 68kg range to fit height
              const heightPct = Math.round(((d.weight - 64) / 4) * 80) + 15;
              return (
                <div key={d.week} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
                  <span className="text-[10px] font-mono font-bold text-slate-500">
                    {d.weight}
                  </span>
                  <div
                    className="w-full bg-gradient-to-t from-[#4DA3D9] to-sky-300 rounded-xl transition-all duration-500"
                    style={{ height: `${heightPct}%` }}
                  />
                  <span className="text-[10px] font-semibold text-slate-400 truncate w-full text-center">
                    {d.week}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Grid: Mood Breakdown & Distance Flow */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Mood Distribution */}
        <div className="p-6 rounded-3xl bg-white dark:bg-[#102A24] border border-emerald-100 dark:border-emerald-900/40 shadow-sm space-y-4">
          <h3 className="text-base font-extrabold text-[#173B32] dark:text-emerald-100 flex items-center gap-2">
            <Smile className="w-4 h-4 text-[#F4A261]" />
            Monthly Emotional Baseline
          </h3>

          <div className="space-y-3">
            {moodBreakdown.map((m) => (
              <div key={m.label} className="space-y-1">
                <div className="flex items-center justify-between text-xs font-bold">
                  <span className="text-slate-700 dark:text-emerald-200">{m.label}</span>
                  <span className="text-slate-400">{m.percent}%</span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-emerald-950/60 rounded-full h-2 overflow-hidden">
                  <div
                    className={`${m.color} h-2 rounded-full transition-all duration-500`}
                    style={{ width: `${m.percent}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Distance & Calorie Totals */}
        <div className="p-6 rounded-3xl bg-white dark:bg-[#102A24] border border-emerald-100 dark:border-emerald-900/40 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="text-base font-extrabold text-[#173B32] dark:text-emerald-100 mb-4">
              Movement & Energy Expenditure
            </h3>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-[#F4FAF5] dark:bg-[#173B32]">
                <span className="text-[10px] text-slate-400 font-bold block uppercase">30-DAY DISTANCE</span>
                <span className="text-2xl font-extrabold text-[#4DA3D9] font-mono">68.2 km</span>
                <span className="text-[11px] text-emerald-600 dark:text-emerald-400 block mt-1">+12.4 km vs prior</span>
              </div>

              <div className="p-4 rounded-2xl bg-[#F4FAF5] dark:bg-[#173B32]">
                <span className="text-[10px] text-slate-400 font-bold block uppercase">CALORIES BURNED</span>
                <span className="text-2xl font-extrabold text-[#F4A261] font-mono">4,820 kcal</span>
                <span className="text-[11px] text-slate-400 block mt-1">Through human power</span>
              </div>
            </div>
          </div>

          <div className="pt-4 mt-4 border-t border-emerald-50 dark:border-emerald-900/40 flex items-center justify-between">
            <span className="text-xs text-slate-500">
              Ready for your next monthly AI review?
            </span>
            <button
              onClick={() => navigate('/monthly-update')}
              className="text-xs font-bold text-[#087F5B] dark:text-[#7BC96F] hover:underline"
            >
              Open Monthly Review →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
