import React from 'react';
import { Sparkles, Plus, Check, ShieldCheck, Heart, Dumbbell, Brain, Leaf, ArrowRight } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { AIRecommendation } from '../types';

export const RecommendationsPage: React.FC = () => {
  const { recommendations, addHabit, habits, navigate } = useApp();

  const handleAdd = (rec: AIRecommendation) => {
    addHabit({
      name: rec.name,
      description: rec.benefit,
      category: rec.category,
      frequency: 'daily',
      difficulty: rec.difficulty,
      healthBenefit: rec.benefit,
      ecoImpact: `Earns +${rec.ecoPoints} Eco Points towards your weekly goals.`,
      xpValue: rec.xp,
      ecoPoints: rec.ecoPoints
    });
  };

  const isAlreadyAdded = (name: string) => {
    return habits.some(h => h.name.toLowerCase() === name.toLowerCase());
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-900/40 text-[#087F5B] dark:text-[#7BC96F] text-xs font-bold mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Content-Based Filtering & Cosine Similarity</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#173B32] dark:text-emerald-50">
            Recommended For You
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-emerald-300/80 mt-1">
            Personalized habit targets calibrated from your goals, available schedule, and active movement.
          </p>
        </div>

        <button
          onClick={() => navigate('/coach')}
          className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-white dark:bg-[#102A24] border border-emerald-200 dark:border-emerald-800 text-[#087F5B] dark:text-[#7BC96F] font-bold text-xs hover:bg-emerald-50 self-start sm:self-auto"
        >
          <span>Ask AI Coach For More</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Recommendations Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {recommendations.map((rec) => {
          const added = isAlreadyAdded(rec.name);

          return (
            <div
              key={rec.id}
              className="p-6 rounded-3xl bg-white dark:bg-[#102A24] border border-emerald-100 dark:border-emerald-900/40 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group"
            >
              <div>
                {/* Match Percentage Pill */}
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-emerald-100/80 dark:bg-emerald-900/50 text-[#087F5B] dark:text-[#7BC96F]">
                    {rec.category}
                  </span>
                  <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-[#087F5B] text-white shadow-sm font-mono">
                    {rec.matchPercentage}% Match
                  </span>
                </div>

                <h3 className="text-lg font-extrabold text-[#173B32] dark:text-emerald-100">
                  {rec.name}
                </h3>

                <p className="text-xs text-slate-600 dark:text-emerald-200/80 mt-1.5 leading-relaxed">
                  {rec.reason}
                </p>

                {/* Details Callout */}
                <div className="mt-4 p-3.5 rounded-2xl bg-[#F4FAF5] dark:bg-[#173B32] border border-emerald-100 dark:border-emerald-800/40 space-y-2">
                  <div className="flex items-start gap-2">
                    <span className="text-[11px] font-bold text-[#087F5B] dark:text-[#7BC96F] shrink-0">
                      Why VELORA recommends this:
                    </span>
                    <span className="text-[11px] text-slate-600 dark:text-emerald-200/70 leading-snug">
                      {rec.whyDetails}
                    </span>
                  </div>

                  <div className="flex items-start gap-2 pt-1 border-t border-emerald-100/60 dark:border-emerald-800/40">
                    <span className="text-[11px] font-bold text-slate-500 shrink-0">Expected Benefit:</span>
                    <span className="text-[11px] text-slate-600 dark:text-emerald-200/70 leading-snug">
                      {rec.benefit}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3 mt-4 text-xs font-semibold text-slate-400">
                  <span>⏱ {rec.duration}</span>
                  <span>• {rec.difficulty}</span>
                  <span className="text-[#087F5B] dark:text-[#7BC96F]">+{rec.xp} XP</span>
                  <span className="text-[#39A96B]">+{rec.ecoPoints} Eco Points</span>
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-5 mt-4 border-t border-emerald-50 dark:border-emerald-900/40">
                {added ? (
                  <div className="flex items-center justify-center gap-2 py-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-[#087F5B] dark:text-[#7BC96F] text-xs font-bold">
                    <Check className="w-4 h-4 stroke-[3]" />
                    <span>Added to Your Habits</span>
                  </div>
                ) : (
                  <button
                    onClick={() => handleAdd(rec)}
                    className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-[#087F5B] hover:bg-[#076a4c] text-white text-xs font-bold shadow-md shadow-[#087F5B]/20 hover:scale-102 active:scale-98 transition-all"
                  >
                    <Plus className="w-4 h-4 stroke-[2.5]" />
                    <span>Add to My Routine (+15 XP)</span>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
