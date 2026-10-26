import React, { useState } from 'react';
import { 
  CalendarClock, 
  Sparkles, 
  ArrowRight, 
  Check, 
  RotateCcw, 
  TrendingUp, 
  Bot, 
  Scale, 
  Heart, 
  Leaf,
  History,
  CheckCircle2
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { aiService } from '../services/ai';
import { MonthlyPlanComparison, MonthlyUpdateRecord, ActivityLevel, GoalType } from '../types';

export const MonthlyUpdatePage: React.FC = () => {
  const { 
    user, 
    updateUser, 
    monthlyHistory, 
    addMonthlyUpdate, 
    streak, 
    ecoScore, 
    habitCompletionPercentage,
    navigate 
  } = useApp();

  const [viewTab, setViewTab] = useState<'update' | 'history'>('update');

  // Monthly Check-in inputs
  const [prevWeight] = useState(user.weight ? user.weight + 1.2 : 66.2);
  const [currentWeight, setCurrentWeight] = useState(user.weight || 65.0);
  const [height] = useState(user.height || 172);
  const [activityLevel, setActivityLevel] = useState<ActivityLevel>(user.activityLevel || 'Moderate');
  const [sleepDuration, setSleepDuration] = useState(user.sleepDuration || 7.5);
  const [goals] = useState<GoalType[]>(user.goals || ['Fitness', 'Mental Wellness']);
  const [newGoals, setNewGoals] = useState<GoalType[]>(['Fitness', 'Mental Wellness', 'Sustainability']);
  const [fitnessNotes, setFitnessNotes] = useState('Feeling stronger and completing walks with higher cadence.');
  const [mood, setMood] = useState<'😊 Happy' | '🙂 Good' | '😐 Okay'>('😊 Happy');
  const [availableTime, setAvailableTime] = useState(user.availableTime || '30 minutes');

  // AI Generated Upgraded Plan State
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedPlan, setGeneratedPlan] = useState<MonthlyPlanComparison | null>(null);
  const [isAccepted, setIsAccepted] = useState(false);

  const handleRunMonthlyUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsGenerating(true);

    const prevPlan = {
      walkingDuration: '20-minute walk',
      frequency: '3-4 days/week',
      difficulty: 'Beginner',
      habitsCount: 4
    };

    const updatePayload = {
      prevWeight,
      currentWeight,
      activityLevel,
      goals: newGoals,
      availableTime,
      mood,
      fitnessNotes
    };

    try {
      const plan = await aiService.getMonthlyPlanUpgrade(prevPlan, updatePayload);
      setGeneratedPlan(plan);
    } catch (e) {
      console.warn(e);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleAcceptPlan = () => {
    if (!generatedPlan) return;

    const record: MonthlyUpdateRecord = {
      id: `m-nov-${Date.now()}`,
      userId: user.id,
      monthName: 'November',
      year: 2026,
      prevWeight,
      currentWeight,
      height,
      activityLevel,
      sleepDuration,
      goals,
      newGoals,
      mood: '😊 Happy',
      availableTime,
      difficulty: 'Intermediate',
      plan: generatedPlan,
      accepted: true,
      timestamp: new Date().toISOString(),
      stats: {
        habitCompletionRate: habitCompletionPercentage,
        totalDistanceKm: 74.5,
        streak,
        ecoScore
      }
    };

    addMonthlyUpdate(record);
    updateUser({
      weight: currentWeight,
      activityLevel,
      goals: newGoals
    });
    setIsAccepted(true);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-300">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-900/40 text-[#087F5B] dark:text-[#7BC96F] text-xs font-bold mb-2">
            <Sparkles className="w-3.5 h-3.5 text-[#F4C95D]" />
            <span>Core Adaptive AI Feature</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#173B32] dark:text-emerald-50">
            Monthly Personalization
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-emerald-300/80 mt-1">
            “Your Monthly VELORA Check-in is ready 🌱”
          </p>
        </div>

        <div className="flex items-center gap-2 bg-white dark:bg-[#102A24] p-1.5 rounded-2xl border border-emerald-100 dark:border-emerald-900/40">
          <button
            onClick={() => setViewTab('update')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
              viewTab === 'update'
                ? 'bg-[#087F5B] text-white shadow-sm'
                : 'text-slate-600 dark:text-emerald-200'
            }`}
          >
            Check-in & Plan Update
          </button>
          <button
            onClick={() => setViewTab('history')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
              viewTab === 'history'
                ? 'bg-[#087F5B] text-white shadow-sm'
                : 'text-slate-600 dark:text-emerald-200'
            }`}
          >
            Monthly History ({monthlyHistory.length})
          </button>
        </div>
      </div>

      {/* VIEW 1: MONTHLY HISTORY COMPARISON */}
      {viewTab === 'history' && (
        <div className="space-y-4">
          <h3 className="text-lg font-extrabold text-[#173B32] dark:text-emerald-100">
            Month-over-Month Lifestyle Progress
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {monthlyHistory.map((rec) => (
              <div
                key={rec.id}
                className="p-6 rounded-3xl bg-white dark:bg-[#102A24] border border-emerald-100 dark:border-emerald-900/40 shadow-sm space-y-4"
              >
                <div className="flex items-center justify-between border-b border-emerald-50 dark:border-emerald-900/40 pb-3">
                  <div>
                    <h4 className="text-base font-extrabold text-[#173B32] dark:text-emerald-100">
                      {rec.monthName} {rec.year}
                    </h4>
                    <span className="text-[11px] text-slate-400">Plan Status: Accepted ✓</span>
                  </div>
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 dark:bg-emerald-900 text-[#087F5B] dark:text-[#7BC96F]">
                    {rec.plan.newPlan.difficulty}
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs">
                  <div className="p-2.5 rounded-xl bg-[#F4FAF5] dark:bg-[#173B32]">
                    <span className="text-[10px] text-slate-400 block font-bold">WEIGHT</span>
                    <span className="font-bold text-[#173B32] dark:text-emerald-100">{rec.currentWeight} kg</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-[#F4FAF5] dark:bg-[#173B32]">
                    <span className="text-[10px] text-slate-400 block font-bold">HABITS</span>
                    <span className="font-bold text-[#39A96B]">{rec.stats.habitCompletionRate}%</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-[#F4FAF5] dark:bg-[#173B32]">
                    <span className="text-[10px] text-slate-400 block font-bold">STREAK</span>
                    <span className="font-bold text-[#F4A261]">{rec.stats.streak}d 🔥</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-[#F4FAF5] dark:bg-[#173B32]">
                    <span className="text-[10px] text-slate-400 block font-bold">ECO SCORE</span>
                    <span className="font-bold text-[#087F5B]">{rec.stats.ecoScore} 🌿</span>
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-emerald-50/50 dark:bg-emerald-950/40 text-xs text-slate-700 dark:text-emerald-200">
                  <span className="font-bold text-[#087F5B] dark:text-[#7BC96F] block mb-1">
                    AI Calibration Rationale:
                  </span>
                  <p className="leading-relaxed">{rec.plan.reason}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* VIEW 2: ACTIVE MONTHLY UPDATE FORM */}
      {viewTab === 'update' && (
        <div className="space-y-6">
          {!generatedPlan ? (
            <form onSubmit={handleRunMonthlyUpdate} className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#102A24] border border-emerald-100 dark:border-emerald-900/40 shadow-sm space-y-6">
              <div className="border-b border-emerald-50 dark:border-emerald-900/40 pb-4">
                <h3 className="text-lg font-extrabold text-[#173B32] dark:text-emerald-100">
                  Your Monthly Progress Update
                </h3>
                <p className="text-xs text-slate-500 dark:text-emerald-300/70 mt-0.5">
                  Reflect on changes in body composition, daily energy, and goals over the past 30 days.
                </p>
              </div>

              {/* Weight Comparison */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-[#F4FAF5] dark:bg-[#173B32] border border-emerald-100 dark:border-emerald-800/40">
                  <span className="text-xs font-bold text-slate-400 block mb-1">PREVIOUS WEIGHT</span>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-extrabold font-mono text-slate-500">{prevWeight}</span>
                    <span className="text-xs font-semibold text-slate-400">kg</span>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800">
                  <span className="text-xs font-bold text-[#087F5B] dark:text-[#7BC96F] block mb-1">CURRENT WEIGHT (KG) *</span>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      step="0.1"
                      value={currentWeight}
                      onChange={(e) => setCurrentWeight(Number(e.target.value))}
                      className="text-2xl font-extrabold font-mono text-[#087F5B] bg-transparent w-24 focus:outline-none"
                    />
                    <span className="text-xs font-bold text-[#087F5B]">kg (-{(prevWeight - currentWeight).toFixed(1)} kg)</span>
                  </div>
                </div>
              </div>

              {/* Lifestyle Changes */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-emerald-200 mb-1">Activity Level</label>
                  <select
                    value={activityLevel}
                    onChange={(e) => setActivityLevel(e.target.value as any)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#F4FAF5] dark:bg-[#173B32] border border-emerald-200 dark:border-emerald-800 text-xs font-semibold"
                  >
                    <option value="Light">Light</option>
                    <option value="Moderate">Moderate</option>
                    <option value="Active">Active (More active this month)</option>
                    <option value="Very Active">Very Active</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-emerald-200 mb-1">Available Daily Time</label>
                  <select
                    value={availableTime}
                    onChange={(e) => setAvailableTime(e.target.value as any)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#F4FAF5] dark:bg-[#173B32] border border-emerald-200 dark:border-emerald-800 text-xs font-semibold"
                  >
                    <option value="15 minutes">15 minutes</option>
                    <option value="30 minutes">30 minutes</option>
                    <option value="45 minutes">45 minutes</option>
                    <option value="60+ minutes">60+ minutes</option>
                  </select>
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-emerald-200 mb-1">
                  Fitness & Lifestyle Highlights (Optional)
                </label>
                <textarea
                  value={fitnessNotes}
                  onChange={(e) => setFitnessNotes(e.target.value)}
                  placeholder="How did your energy, sleep, or eco habits feel this past month?"
                  rows={2}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#F4FAF5] dark:bg-[#173B32] border border-emerald-200 dark:border-emerald-800 text-xs focus:outline-none"
                />
              </div>

              {/* Submit CTA */}
              <div className="pt-2 text-center sm:text-right">
                <button
                  type="submit"
                  disabled={isGenerating}
                  className="px-8 py-3.5 rounded-2xl bg-[#087F5B] hover:bg-[#076a4c] text-white font-extrabold text-sm shadow-xl shadow-[#087F5B]/30 hover:scale-105 active:scale-95 transition-all inline-flex items-center gap-2"
                >
                  <Sparkles className="w-4 h-4 text-[#F4C95D]" />
                  <span>{isGenerating ? 'AI Analyzing Changes...' : 'Update My VELORA Plan'}</span>
                </button>
              </div>
            </form>
          ) : (
            /* AFTER UPDATE: OLD PLAN VS NEW PLAN */
            <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#102A24] border-2 border-emerald-200 dark:border-emerald-800 shadow-xl space-y-6 animate-in zoom-in-95 duration-200">
              <div className="flex items-center justify-between border-b border-emerald-100 dark:border-emerald-900/40 pb-4">
                <div>
                  <h3 className="text-xl font-extrabold text-[#173B32] dark:text-emerald-100 flex items-center gap-2">
                    <CheckCircle2 className="w-6 h-6 text-[#087F5B]" />
                    Your VELORA Plan Has Been Updated
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-emerald-300/70 mt-1">
                    {generatedPlan.summary}
                  </p>
                </div>
                <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-[#F4C95D] text-[#173B32]">
                  New Plan Ready
                </span>
              </div>

              {/* Old Plan vs New Plan Comparison Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Old Plan */}
                <div className="p-5 rounded-2xl bg-[#F4FAF5] dark:bg-[#173B32] border border-emerald-100 dark:border-emerald-900/40 space-y-2 opacity-80">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">
                    PREVIOUS PLAN
                  </span>
                  <h4 className="text-base font-bold text-slate-700 dark:text-emerald-200">
                    {generatedPlan.oldPlan.walkingDuration}
                  </h4>
                  <div className="text-xs text-slate-500 space-y-1">
                    <p>Frequency: {generatedPlan.oldPlan.frequency}</p>
                    <p>Difficulty: {generatedPlan.oldPlan.difficulty}</p>
                    <p>Target Habits: {generatedPlan.oldPlan.habitsCount} daily</p>
                  </div>
                </div>

                {/* New Plan */}
                <div className="p-5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border-2 border-[#087F5B] dark:border-[#39A96B] space-y-2 shadow-sm">
                  <span className="text-[10px] font-bold text-[#087F5B] dark:text-[#7BC96F] uppercase tracking-wide">
                    UPGRADED NEW PLAN ⭐
                  </span>
                  <h4 className="text-base font-extrabold text-[#173B32] dark:text-emerald-100">
                    {generatedPlan.newPlan.walkingDuration}
                  </h4>
                  <div className="text-xs text-slate-700 dark:text-emerald-200 space-y-1">
                    <p className="font-semibold">Frequency: {generatedPlan.newPlan.frequency}</p>
                    <p className="font-semibold">Difficulty: {generatedPlan.newPlan.difficulty}</p>
                    <p className="font-semibold">Target Habits: {generatedPlan.newPlan.habitsCount} daily</p>
                  </div>
                </div>
              </div>

              {/* Explanation Quote */}
              <div className="p-4 rounded-2xl bg-[#F4FAF5] dark:bg-[#173B32] border border-emerald-100 dark:border-emerald-800/40 text-xs text-slate-700 dark:text-emerald-200 leading-relaxed">
                <span className="font-bold text-[#087F5B] dark:text-[#7BC96F] block mb-1">
                  Why VELORA adapted this:
                </span>
                “{generatedPlan.reason}”
              </div>

              {/* Recommended New Habits */}
              {generatedPlan.newHabits.length > 0 && (
                <div>
                  <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                    Recommended New Habit Additions:
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {generatedPlan.newHabits.map((h, i) => (
                      <span key={i} className="px-3 py-1.5 rounded-xl bg-emerald-100 dark:bg-emerald-900/60 text-[#087F5B] dark:text-emerald-200 text-xs font-bold">
                        + {h}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Accept / Customize / Skip */}
              <div className="pt-4 border-t border-emerald-100 dark:border-emerald-900/40 flex flex-wrap items-center justify-between gap-3">
                <button
                  onClick={() => setGeneratedPlan(null)}
                  className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-500 hover:text-slate-700"
                >
                  Adjust Inputs
                </button>

                <div className="flex items-center gap-3">
                  {isAccepted ? (
                    <div className="flex flex-wrap items-center gap-2">
                      <div className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-100 text-[#087F5B] dark:bg-emerald-900/60 dark:text-emerald-200 text-xs font-bold">
                        <Check className="w-4 h-4 stroke-[3]" />
                        <span>Plan Activated!</span>
                      </div>
                      <button
                        onClick={() => navigate('/recommendations')}
                        className="px-5 py-2.5 rounded-xl bg-[#087F5B] hover:bg-[#076a4c] text-white text-xs font-bold shadow-sm"
                      >
                        View Updated Recommendations →
                      </button>
                      <button
                        onClick={() => navigate('/home')}
                        className="px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-emerald-950/40 text-slate-700 dark:text-emerald-200 text-xs font-semibold"
                      >
                        Go to Dashboard
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={handleAcceptPlan}
                      className="px-7 py-3 rounded-xl bg-[#087F5B] hover:bg-[#076a4c] text-white text-xs font-bold shadow-md shadow-[#087F5B]/30 hover:scale-105 active:scale-95 transition-all"
                    >
                      Accept & Activate Plan (+50 XP)
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
