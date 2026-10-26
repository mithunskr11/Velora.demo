import React from 'react';
import { 
  Check, 
  Flame, 
  Heart, 
  Dumbbell, 
  Brain, 
  Leaf, 
  CheckSquare, 
  Sparkles, 
  Trash2, 
  Clock 
} from 'lucide-react';
import { Habit } from '../../types';
import { useApp } from '../../context/AppContext';

interface HabitCardProps {
  habit: Habit;
  onDelete?: (id: string) => void;
}

export const HabitCard: React.FC<HabitCardProps> = ({ habit, onDelete }) => {
  const { toggleHabit } = useApp();

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Health': return Heart;
      case 'Fitness': return Dumbbell;
      case 'Mental Wellness': return Brain;
      case 'Sustainability': return Leaf;
      case 'Productivity': return CheckSquare;
      default: return Sparkles;
    }
  };

  const Icon = getCategoryIcon(habit.category);

  return (
    <div 
      className={`p-4 rounded-2xl sm:rounded-3xl border transition-all flex items-center justify-between gap-3 ${
        habit.completed
          ? 'bg-emerald-50/60 dark:bg-emerald-950/20 border-emerald-200/80 dark:border-emerald-800/40 opacity-95'
          : 'bg-white dark:bg-[#102A24] border-emerald-100/80 dark:border-emerald-900/40 hover:border-[#39A96B] shadow-sm hover:shadow-md'
      }`}
    >
      <div className="flex items-center gap-3.5 flex-1 min-w-0">
        {/* Category Icon Badge */}
        <div className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 transition-transform ${
          habit.completed
            ? 'bg-[#087F5B] text-white shadow-sm'
            : 'bg-[#F4FAF5] dark:bg-[#173B32] text-[#087F5B] dark:text-[#7BC96F] border border-emerald-100 dark:border-emerald-800/60'
        }`}>
          <Icon className="w-5 h-5" />
        </div>

        {/* Text Details */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h4 className={`text-sm sm:text-base font-bold truncate ${
              habit.completed
                ? 'line-through text-slate-500 dark:text-emerald-300/60'
                : 'text-[#173B32] dark:text-emerald-100'
            }`}>
              {habit.name}
            </h4>
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-100/70 dark:bg-emerald-900/40 text-emerald-800 dark:text-emerald-200">
              {habit.category}
            </span>
            {habit.time && (
              <span className="hidden sm:inline-flex items-center gap-1 text-[10px] text-slate-400">
                <Clock className="w-3 h-3" />
                {habit.time}
              </span>
            )}
          </div>

          <div className="flex items-center gap-3 mt-1 text-xs">
            {habit.streak > 0 && (
              <span className="flex items-center gap-1 font-bold text-[#F4A261] dark:text-[#F4C95D] text-[11px]">
                <Flame className="w-3.5 h-3.5 fill-current" />
                {habit.streak} day streak
              </span>
            )}
            <span className="text-slate-400 text-[11px]">
              +{habit.xpValue} XP
            </span>
            {habit.ecoPoints > 0 && (
              <span className="text-[#39A96B] font-semibold text-[11px] hidden sm:inline">
                +{habit.ecoPoints} Eco
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-2 shrink-0">
        {onDelete && (
          <button
            onClick={() => onDelete(habit.id)}
            className="p-2 rounded-xl text-slate-300 hover:text-rose-500 transition-colors"
            title="Delete habit"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        )}

        <button
          onClick={() => toggleHabit(habit.id)}
          className={`w-10 h-10 rounded-2xl flex items-center justify-center font-bold transition-all ${
            habit.completed
              ? 'bg-[#087F5B] text-white shadow-md shadow-[#087F5B]/30 scale-105'
              : 'border-2 border-emerald-300 dark:border-emerald-700 hover:border-[#087F5B] hover:bg-emerald-50 dark:hover:bg-emerald-900/30 text-transparent hover:text-emerald-400'
          }`}
          aria-label={habit.completed ? 'Mark incomplete' : 'Mark complete'}
        >
          <Check className="w-5 h-5 stroke-[3]" />
        </button>
      </div>
    </div>
  );
};
