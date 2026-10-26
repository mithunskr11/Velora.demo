import React, { useState } from 'react';
import { 
  Sparkles, 
  Plus, 
  ArrowRight, 
  Flame, 
  MapPin, 
  CalendarCheck, 
  Award, 
  Clock, 
  Compass,
  CheckCircle2,
  ChevronRight,
  Bot,
  Users,
  Leaf,
  ChevronDown,
  ChevronUp,
  Check
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { TopStatCards } from '../components/dashboard/StatWidgets';
import { HabitCard } from '../components/dashboard/HabitCard';
import { AISuggestionCard } from '../components/dashboard/AISuggestionCard';
import { WeeklyActivityChart } from '../components/dashboard/WeeklyActivityChart';
import { QuickActionBar } from '../components/dashboard/QuickActionBar';
import { StoriesBar } from '../components/snap/StoriesBar';

interface HomePageProps {
  onOpenAddHabit: () => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onOpenAddHabit }) => {
  const { 
    user, 
    habits, 
    activities, 
    recentBadge, 
    navigate, 
    todayCheckinDone, 
    milestones, 
    showBadgeCelebration,
    badges 
  } = useApp();

  const [tourExpanded, setTourExpanded] = useState(true);

  const todayHabits = habits.slice(0, 5);
  const latestActivity = activities[0];

  const walkthroughSteps = [
    { id: 1, label: 'Habit Check', route: '/habits', done: milestones.habitCompleted || habits.some(h => h.completed), desc: 'Check off a habit (+10 XP)' },
    { id: 2, label: 'Mood Check-in', route: '/check-in', done: todayCheckinDone, desc: 'Log mood & reflect (+25 XP)' },
    { id: 3, label: 'AI Coach', route: '/coach', done: true, desc: 'Chat with empathetic coach' },
    { id: 4, label: 'GPS Workout', route: '/map', done: milestones.activityLogged || activities.length > 0, desc: 'Live GPS simulation (+35 XP)' },
    { id: 5, label: 'Community Proof', route: '/community', done: milestones.proofShared, desc: 'Post workout snapshot (+10 XP)' },
    { id: 6, label: 'Monthly AI Plan', route: '/monthly-update', done: milestones.monthlyPlanGenerated, desc: 'Adapt personalized plan (+50 XP)' },
  ];

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-300">
      {/* Welcome Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#173B32] dark:text-emerald-50 tracking-tight">
            Good Morning, {user.name.split(' ')[0]} 👋
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-emerald-300/80 mt-1">
            “Small steps. Better habits. Bigger impact.”
          </p>
        </div>

        <div className="flex items-center gap-2">
          {!todayCheckinDone && (
            <button
              onClick={() => navigate('/check-in')}
              className="flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs shadow-md shadow-amber-500/20 hover:scale-105 active:scale-95 transition-all"
            >
              <CalendarCheck className="w-3.5 h-3.5" />
              <span>Daily Check-in</span>
            </button>
          )}

          <button
            onClick={onOpenAddHabit}
            className="flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-[#087F5B] hover:bg-[#076a4c] text-white font-bold text-xs shadow-md shadow-[#087F5B]/25 hover:scale-105 active:scale-95 transition-all"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>Add Habit</span>
          </button>
        </div>
      </div>

      {/* VELORA Stories Section */}
      <StoriesBar />

      {/* Guided Walkthrough Bar for Evaluators / Evaluator Quick Tour */}
      <div className="p-4 rounded-3xl bg-white dark:bg-[#102A24] border border-emerald-200/80 dark:border-emerald-800/50 shadow-sm">
        <div 
          onClick={() => setTourExpanded(!tourExpanded)}
          className="flex items-center justify-between cursor-pointer select-none"
        >
          <div className="flex items-center gap-2">
            <span className="p-1 rounded-lg bg-emerald-100 dark:bg-emerald-900 text-[#087F5B] dark:text-[#7BC96F]">
              <Sparkles className="w-4 h-4" />
            </span>
            <span className="text-xs font-bold text-[#173B32] dark:text-emerald-100">
              Complete VELORA Evaluation Walkthrough (6 Milestones)
            </span>
          </div>

          <button className="text-slate-400 hover:text-slate-600">
            {tourExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>

        {tourExpanded && (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 pt-3 mt-2 border-t border-emerald-50 dark:border-emerald-900/40">
            {walkthroughSteps.map((step) => (
              <button
                key={step.id}
                onClick={() => navigate(step.route)}
                className={`p-2.5 rounded-2xl border text-left transition-all hover:scale-102 ${
                  step.done
                    ? 'bg-emerald-50/80 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-800'
                    : 'bg-[#F4FAF5] dark:bg-[#173B32] border-emerald-100 dark:border-emerald-800/40 hover:border-[#087F5B]'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] font-bold text-slate-400">Step {step.id}</span>
                  {step.done ? (
                    <span className="w-4 h-4 rounded-full bg-[#087F5B] text-white flex items-center justify-center">
                      <Check className="w-2.5 h-2.5 stroke-[3]" />
                    </span>
                  ) : (
                    <span className="w-2 h-2 rounded-full bg-slate-300" />
                  )}
                </div>
                <h5 className="text-xs font-bold text-[#173B32] dark:text-emerald-100 truncate">
                  {step.label}
                </h5>
                <p className="text-[10px] text-slate-500 dark:text-emerald-300/70 truncate mt-0.5">
                  {step.desc}
                </p>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* 4 Core Top Stat Cards */}
      <TopStatCards />

      {/* Quick Action Bar */}
      <QuickActionBar onOpenAddHabit={onOpenAddHabit} />

      {/* Grid: AI Suggestion & Today's Movement */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <AISuggestionCard />
        </div>

        {/* Latest Activity / GPS Quick Card */}
        <div className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-[#102A24] border border-emerald-100/80 dark:border-emerald-900/40 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-slate-400 dark:text-emerald-300/70 uppercase tracking-wide">
                TODAY'S ACTIVITY
              </span>
              <span className="flex items-center gap-1 text-[11px] font-bold text-[#4DA3D9]">
                <MapPin className="w-3.5 h-3.5" /> GPS Verified
              </span>
            </div>

            {latestActivity ? (
              <div className="space-y-3">
                <h4 className="text-base font-extrabold text-[#173B32] dark:text-emerald-100">
                  {latestActivity.title}
                </h4>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-extrabold text-[#4DA3D9] font-mono">
                    {latestActivity.distance} km
                  </span>
                  <span className="text-xs text-slate-400">
                    in {Math.floor(latestActivity.duration / 60)} min ({latestActivity.calories} kcal)
                  </span>
                </div>
                <p className="text-xs text-slate-500 dark:text-emerald-300/70">
                  Pace: {latestActivity.pace} • Elevation: +{latestActivity.elevation}m
                </p>
              </div>
            ) : (
              <p className="text-xs text-slate-500">No activities recorded today yet.</p>
            )}
          </div>

          <div className="pt-4 mt-3 border-t border-emerald-50 dark:border-emerald-900/40 flex items-center justify-between">
            <button
              onClick={() => navigate('/map')}
              className="text-xs font-bold text-[#087F5B] dark:text-[#7BC96F] flex items-center gap-1 hover:underline"
            >
              <span>Launch Live GPS Map</span>
              <ChevronRight className="w-4 h-4" />
            </button>
            <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold">
              +35 XP / workout
            </span>
          </div>
        </div>
      </div>

      {/* Grid: Today's Habits Checklist & Weekly Progress Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Today's Habits */}
        <div className="lg:col-span-2 space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-extrabold text-[#173B32] dark:text-emerald-100">
                Today's Habits
              </h3>
              <p className="text-xs text-slate-500 dark:text-emerald-300/70">
                Check off actions to sustain your 7-day streak & earn XP.
              </p>
            </div>
            <button
              onClick={() => navigate('/habits')}
              className="text-xs font-bold text-[#087F5B] dark:text-[#7BC96F] hover:underline"
            >
              View All ({habits.length}) →
            </button>
          </div>

          <div className="space-y-2.5">
            {todayHabits.map((habit) => (
              <HabitCard key={habit.id} habit={habit} />
            ))}
          </div>
        </div>

        {/* Right Column: Weekly Flow & Recent Badge */}
        <div className="space-y-6">
          <WeeklyActivityChart />

          {/* Recent Badge Widget */}
          {recentBadge && (
            <div 
              onClick={() => showBadgeCelebration(recentBadge)}
              className="p-5 rounded-3xl bg-amber-50/70 dark:bg-amber-950/20 border border-amber-200/80 dark:border-amber-800/40 shadow-sm cursor-pointer hover:shadow-md transition-all group"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-2xl bg-amber-100 dark:bg-amber-900/60 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                  {recentBadge.icon}
                </div>
                <div>
                  <span className="text-[10px] font-bold text-amber-700 dark:text-amber-400 uppercase tracking-wide">
                    RECENT ACHIEVEMENT (CLICK TO VIEW)
                  </span>
                  <h4 className="text-sm font-extrabold text-[#173B32] dark:text-emerald-100">
                    {recentBadge.name}
                  </h4>
                  <p className="text-[11px] text-slate-500 dark:text-emerald-300/70 mt-0.5 line-clamp-1">
                    {recentBadge.description}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
