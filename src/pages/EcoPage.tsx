import React from 'react';
import { 
  Leaf, 
  Check, 
  TrendingUp, 
  Award, 
  Sparkles, 
  Zap, 
  Globe, 
  ArrowRight,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { ecoService } from '../services/eco';

export const EcoPage: React.FC = () => {
  const { ecoScore, ecoActions, ecoChallenges, toggleEcoAction, navigate } = useApp();

  const co2Summary = ecoService.calculateTotalCo2Saved(ecoActions);

  const ecoHistory = [
    { month: 'Jun', score: 55 },
    { month: 'Jul', score: 60 },
    { month: 'Aug', score: 65 },
    { month: 'Sep', score: 68 },
    { month: 'Oct', score: ecoScore },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-900/40 text-[#087F5B] dark:text-[#7BC96F] text-xs font-bold mb-2">
            <Leaf className="w-3.5 h-3.5" />
            <span>Sustainable Lifestyle Tracking</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#173B32] dark:text-emerald-50">
            Your Sustainable Journey
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-emerald-300/80 mt-1">
            “Small daily habits protect the climate and build personal health.”
          </p>
        </div>

        <button
          onClick={() => navigate('/progress')}
          className="text-xs font-bold text-[#087F5B] dark:text-[#7BC96F] hover:underline self-start sm:self-auto"
        >
          View Long-term Impact Charts →
        </button>
      </div>

      {/* Main Score Hero Card */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-[#087F5B] to-[#173B32] text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden">
        <div className="absolute right-0 top-0 w-80 h-80 bg-[#39A96B]/20 rounded-full blur-3xl pointer-events-none" />

        <div className="space-y-3 z-10 max-w-lg text-center md:text-left">
          <span className="text-xs font-extrabold uppercase tracking-wider text-emerald-200">
            COMPOSITE SUSTAINABILITY RATING
          </span>
          <div className="flex items-baseline justify-center md:justify-start gap-3">
            <span className="text-5xl sm:text-6xl font-extrabold font-mono tracking-tight">
              {ecoScore}
            </span>
            <span className="text-xl sm:text-2xl text-emerald-200 font-bold">/ 100</span>
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#F4C95D] text-[#173B32] ml-2">
              Grade A 🌿
            </span>
          </div>

          <p className="text-xs sm:text-sm text-emerald-100/90 leading-relaxed">
            Your Eco Score is calculated via weighted completion of low-carbon mobility, plastic avoidance, and energy reduction actions.
          </p>

          <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 pt-2">
            <div className="p-3 rounded-2xl bg-white/10 backdrop-blur-md">
              <span className="text-[10px] text-emerald-200 block uppercase font-bold">EST. CO2 AVOIDED</span>
              <span className="text-base font-extrabold font-mono">{co2Summary.kg} kg</span>
            </div>
            <div className="p-3 rounded-2xl bg-white/10 backdrop-blur-md">
              <span className="text-[10px] text-emerald-200 block uppercase font-bold">TREES EQUIVALENT</span>
              <span className="text-base font-extrabold font-mono">~{co2Summary.treesEquivalent} trees</span>
            </div>
          </div>
        </div>

        {/* Circular Gauge Graphic */}
        <div className="relative w-40 h-40 shrink-0 flex items-center justify-center z-10">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r="40"
              className="text-white/20 stroke-current"
              strokeWidth="10"
              fill="transparent"
            />
            <circle
              cx="50"
              cy="50"
              r="40"
              className="text-[#7BC96F] stroke-current"
              strokeWidth="10"
              strokeDasharray={251.2}
              strokeDashoffset={251.2 - (251.2 * ecoScore) / 100}
              strokeLinecap="round"
              fill="transparent"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <Leaf className="w-8 h-8 text-[#7BC96F]" />
            <span className="text-xs font-bold mt-1 text-emerald-100">Verified</span>
          </div>
        </div>
      </div>

      {/* Grid: Today's Eco Actions & Challenges */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Today's Eco Actions */}
        <div className="p-6 rounded-3xl bg-white dark:bg-[#102A24] border border-emerald-100 dark:border-emerald-900/40 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-extrabold text-[#173B32] dark:text-emerald-100 flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-[#087F5B]" />
              Today's Eco Actions
            </h3>
            <span className="text-xs text-slate-400">
              +{ecoActions.filter(a => a.completed).length * 10} XP today
            </span>
          </div>

          <div className="space-y-2.5">
            {ecoActions.map((action) => (
              <div
                key={action.id}
                onClick={() => toggleEcoAction(action.id)}
                className={`p-3.5 rounded-2xl border flex items-center justify-between cursor-pointer transition-all ${
                  action.completed
                    ? 'bg-emerald-50/70 dark:bg-emerald-950/30 border-emerald-300 dark:border-emerald-800'
                    : 'bg-[#F4FAF5] dark:bg-[#173B32] border-emerald-100 dark:border-emerald-800/40 hover:border-emerald-300'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs font-bold transition-all ${
                    action.completed
                      ? 'bg-[#087F5B] text-white shadow-sm'
                      : 'border-2 border-emerald-200 dark:border-emerald-700'
                  }`}>
                    {action.completed && <Check className="w-5 h-5 stroke-[3]" />}
                  </div>
                  <div>
                    <span className={`text-xs sm:text-sm font-bold ${
                      action.completed ? 'text-[#087F5B] dark:text-[#7BC96F]' : 'text-slate-700 dark:text-emerald-100'
                    }`}>
                      {action.label}
                    </span>
                    <span className="text-[10px] text-slate-400 block">
                      Category: {action.category} • ~{action.co2SavedGrams}g CO2 saved
                    </span>
                  </div>
                </div>

                <span className="text-xs font-bold text-[#087F5B] dark:text-[#7BC96F]">
                  +{action.points} Eco
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Climate Challenges */}
        <div className="p-6 rounded-3xl bg-white dark:bg-[#102A24] border border-emerald-100 dark:border-emerald-900/40 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-extrabold text-[#173B32] dark:text-emerald-100 flex items-center gap-2">
              <Award className="w-5 h-5 text-[#F4C95D]" />
              Eco Challenges
            </h3>
            <span className="text-xs text-slate-400">Weekly Milestones</span>
          </div>

          <div className="space-y-3">
            {ecoChallenges.map((ch) => {
              const progressPercent = Math.min(100, Math.round((ch.progress / ch.target) * 100));
              return (
                <div
                  key={ch.id}
                  className="p-4 rounded-2xl bg-[#F4FAF5] dark:bg-[#173B32] border border-emerald-100 dark:border-emerald-800/40 space-y-2"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2.5">
                      <span className="text-2xl">{ch.icon}</span>
                      <div>
                        <h4 className="text-sm font-bold text-[#173B32] dark:text-emerald-100">{ch.title}</h4>
                        <p className="text-[11px] text-slate-500 dark:text-emerald-300/70">{ch.description}</p>
                      </div>
                    </div>
                    <span className="text-xs font-extrabold text-[#39A96B] px-2.5 py-1 rounded-full bg-emerald-100/70 dark:bg-emerald-900/40">
                      +{ch.points} Eco
                    </span>
                  </div>

                  <div className="w-full bg-slate-200 dark:bg-emerald-950/60 rounded-full h-2 overflow-hidden mt-2">
                    <div
                      className="bg-[#087F5B] h-2 rounded-full transition-all duration-500"
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-slate-400">
                    <span>Progress: {ch.progress} / {ch.target} {ch.unit}</span>
                    <span>{ch.completed ? 'Completed ✓' : `${progressPercent}%`}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Eco Score History Bar Chart */}
      <div className="p-6 rounded-3xl bg-white dark:bg-[#102A24] border border-emerald-100 dark:border-emerald-900/40 shadow-sm">
        <h3 className="text-base font-extrabold text-[#173B32] dark:text-emerald-100 mb-4 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-[#087F5B]" />
          5-Month Eco Score Trajectory
        </h3>

        <div className="grid grid-cols-5 gap-3 pt-6 items-end h-40">
          {ecoHistory.map((item) => (
            <div key={item.month} className="flex flex-col items-center gap-2 h-full justify-end">
              <span className="text-xs font-bold text-[#087F5B] dark:text-[#7BC96F] font-mono">{item.score}</span>
              <div
                className="w-full max-w-[36px] bg-gradient-to-t from-[#087F5B] to-[#7BC96F] rounded-xl transition-all duration-500"
                style={{ height: `${(item.score / 100) * 100}%` }}
              />
              <span className="text-xs font-semibold text-slate-500 dark:text-emerald-300/70">{item.month}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
