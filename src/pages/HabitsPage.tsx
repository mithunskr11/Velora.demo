import React, { useState } from 'react';
import { 
  Plus, 
  CheckSquare, 
  Sparkles, 
  Heart, 
  Dumbbell, 
  Brain, 
  Leaf, 
  Trash2, 
  Check, 
  Flame, 
  Clock,
  Filter
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { HabitCategory } from '../types';

interface HabitsPageProps {
  onOpenAddHabit: () => void;
}

export const HabitsPage: React.FC<HabitsPageProps> = ({ onOpenAddHabit }) => {
  const { habits, toggleHabit, deleteHabit, habitCompletionPercentage, streak } = useApp();
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const categories: string[] = [
    'All',
    'Personal',
    'Health',
    'Fitness',
    'Productivity',
    'Mental Wellness',
    'Sustainability'
  ];

  const filteredHabits = selectedCategory === 'All'
    ? habits
    : habits.filter(h => h.category === selectedCategory);

  const completedCount = habits.filter(h => h.completed).length;

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header & Stats Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#173B32] dark:text-emerald-50">
            Habit Management
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-emerald-300/80 mt-1">
            Build consistency through repeatable micro-actions.
          </p>
        </div>

        <button
          onClick={onOpenAddHabit}
          className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-[#087F5B] hover:bg-[#076a4c] text-white font-bold text-xs sm:text-sm shadow-md shadow-[#087F5B]/30 hover:scale-105 active:scale-95 transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>Add Custom Habit</span>
        </button>
      </div>

      {/* Progress Strip */}
      <div className="p-4 sm:p-5 rounded-3xl bg-white dark:bg-[#102A24] border border-emerald-100 dark:border-emerald-900/40 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-900/60 text-[#087F5B] dark:text-[#7BC96F] flex items-center justify-center font-bold text-lg font-mono">
            {completedCount}/{habits.length}
          </div>
          <div>
            <h4 className="text-sm font-extrabold text-[#173B32] dark:text-emerald-100">
              {habitCompletionPercentage}% Completed Today
            </h4>
            <p className="text-xs text-slate-500 dark:text-emerald-300/70">
              {streak} consecutive days of disciplined habits 🔥
            </p>
          </div>
        </div>

        <div className="w-full sm:w-64 bg-slate-100 dark:bg-emerald-950/60 rounded-full h-2.5 overflow-hidden">
          <div 
            className="bg-gradient-to-r from-[#087F5B] to-[#39A96B] h-2.5 rounded-full transition-all duration-500"
            style={{ width: `${habitCompletionPercentage}%` }}
          />
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 rounded-2xl text-xs font-bold whitespace-nowrap transition-all ${
              selectedCategory === cat
                ? 'bg-[#087F5B] text-white shadow-sm scale-102'
                : 'bg-white dark:bg-[#102A24] text-slate-600 dark:text-emerald-200 border border-emerald-100 dark:border-emerald-900/50 hover:bg-emerald-50 dark:hover:bg-emerald-900/20'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Habit Cards Grid */}
      {filteredHabits.length > 0 ? (
        <div className="space-y-3">
          {filteredHabits.map((habit) => (
            <div
              key={habit.id}
              className={`p-4 sm:p-5 rounded-3xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                habit.completed
                  ? 'bg-emerald-50/70 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800/40'
                  : 'bg-white dark:bg-[#102A24] border-emerald-100 dark:border-emerald-900/40 shadow-sm hover:shadow-md'
              }`}
            >
              {/* Left Info */}
              <div className="flex items-start gap-4 flex-1">
                <button
                  onClick={() => toggleHabit(habit.id)}
                  className={`w-11 h-11 rounded-2xl flex items-center justify-center font-bold transition-all shrink-0 mt-0.5 ${
                    habit.completed
                      ? 'bg-[#087F5B] text-white shadow-md shadow-[#087F5B]/30 scale-105'
                      : 'border-2 border-emerald-300 dark:border-emerald-700 hover:border-[#087F5B] hover:bg-emerald-50 dark:hover:bg-emerald-900/30 text-transparent hover:text-emerald-400'
                  }`}
                  aria-label={habit.completed ? 'Mark incomplete' : 'Mark complete'}
                >
                  <Check className="w-6 h-6 stroke-[3]" />
                </button>

                <div className="space-y-1 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className={`text-base font-extrabold ${
                      habit.completed
                        ? 'line-through text-slate-400 dark:text-emerald-400/50'
                        : 'text-[#173B32] dark:text-emerald-100'
                    }`}>
                      {habit.name}
                    </h3>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-200">
                      {habit.category}
                    </span>
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                      {habit.difficulty}
                    </span>
                  </div>

                  <p className="text-xs text-slate-500 dark:text-emerald-300/70 leading-relaxed">
                    {habit.description}
                  </p>

                  <div className="flex items-center gap-4 text-xs pt-1 flex-wrap">
                    {habit.streak > 0 && (
                      <span className="flex items-center gap-1 font-bold text-[#F4A261] dark:text-[#F4C95D]">
                        <Flame className="w-3.5 h-3.5 fill-current" />
                        {habit.streak} day streak
                      </span>
                    )}
                    <span className="text-slate-400">
                      +{habit.xpValue} XP
                    </span>
                    {habit.ecoPoints > 0 && (
                      <span className="text-[#39A96B] font-semibold">
                        +{habit.ecoPoints} Eco Points
                      </span>
                    )}
                    {habit.healthBenefit && (
                      <span className="hidden md:inline text-slate-400 text-[11px]">
                        Benefit: {habit.healthBenefit}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Right Action Buttons */}
              <div className="flex items-center justify-end gap-2 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-emerald-50 dark:border-emerald-900/30">
                <button
                  onClick={() => deleteHabit(habit.id)}
                  className="p-2.5 rounded-xl text-slate-300 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/20 transition-colors"
                  title="Delete Habit"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="p-12 rounded-3xl bg-white dark:bg-[#102A24] text-center border border-emerald-100 dark:border-emerald-900/40">
          <CheckSquare className="w-12 h-12 text-[#39A96B] mx-auto mb-3 opacity-60" />
          <h4 className="text-base font-bold text-[#173B32] dark:text-emerald-100">
            No habits in “{selectedCategory}” category
          </h4>
          <p className="text-xs text-slate-500 dark:text-emerald-300/70 mt-1 max-w-sm mx-auto">
            “Start your first habit 🌱”
          </p>
          <button
            onClick={onOpenAddHabit}
            className="mt-4 px-5 py-2.5 rounded-2xl bg-[#087F5B] text-white text-xs font-bold hover:bg-[#076a4c]"
          >
            Create Habit
          </button>
        </div>
      )}
    </div>
  );
};
