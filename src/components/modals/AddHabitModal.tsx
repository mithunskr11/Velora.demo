import React, { useState } from 'react';
import { X, Sparkles, CheckSquare, Heart, Dumbbell, Brain, Leaf, Clock, Award } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { HabitCategory, DifficultyLevel } from '../../types';

interface AddHabitModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialCategory?: HabitCategory;
}

export const AddHabitModal: React.FC<AddHabitModalProps> = ({
  isOpen,
  onClose,
  initialCategory = 'Health'
}) => {
  const { addHabit } = useApp();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<HabitCategory>(initialCategory);
  const [frequency, setFrequency] = useState<'daily' | 'weekdays' | 'weekends' | '3x_week'>('daily');
  const [difficulty, setDifficulty] = useState<DifficultyLevel>('Beginner');
  const [time, setTime] = useState('08:00 AM');
  const [reminder, setReminder] = useState('15 mins before');
  const [healthBenefit, setHealthBenefit] = useState('');
  const [ecoImpact, setEcoImpact] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const categories: { label: HabitCategory; icon: any }[] = [
    { label: 'Health', icon: Heart },
    { label: 'Fitness', icon: Dumbbell },
    { label: 'Mental Wellness', icon: Brain },
    { label: 'Sustainability', icon: Leaf },
    { label: 'Productivity', icon: CheckSquare },
    { label: 'Personal', icon: Sparkles }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Please provide a name for your habit.');
      return;
    }

    // Default benefits if omitted
    const finalHealthBenefit = healthBenefit.trim() || 'Improves vitality, energy consistency and long-term well-being.';
    const finalEcoImpact = ecoImpact.trim() || 'Contributes to a lower footprint through mindful everyday actions.';

    addHabit({
      name: name.trim(),
      description: description.trim() || 'Daily habit to cultivate mindful living.',
      category,
      frequency,
      difficulty,
      time,
      reminder,
      healthBenefit: finalHealthBenefit,
      ecoImpact: finalEcoImpact,
      xpValue: difficulty === 'Advanced' ? 25 : difficulty === 'Intermediate' ? 15 : 10,
      ecoPoints: category === 'Sustainability' ? 20 : 5
    });

    // Reset and close
    setName('');
    setDescription('');
    setHealthBenefit('');
    setEcoImpact('');
    setError('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="w-full max-w-xl max-h-[90vh] overflow-y-auto bg-white dark:bg-[#102A24] rounded-3xl p-6 sm:p-8 shadow-2xl border border-emerald-100 dark:border-emerald-900/50 relative"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between pb-4 border-b border-emerald-100 dark:border-emerald-900/40">
          <div>
            <h3 className="text-xl font-extrabold text-[#173B32] dark:text-emerald-100 flex items-center gap-2">
              <CheckSquare className="w-5 h-5 text-[#087F5B] dark:text-[#7BC96F]" />
              Create New Habit
            </h3>
            <p className="text-xs text-slate-500 dark:text-emerald-300/70">
              Personalized routines designed for your body, mind, and the planet.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-emerald-200 hover:bg-emerald-50 dark:hover:bg-emerald-900/20"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="mt-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          {/* Category Selector */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-emerald-200 mb-2">Category</label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {categories.map((cat) => {
                const Icon = cat.icon;
                const isSelected = category === cat.label;
                return (
                  <button
                    type="button"
                    key={cat.label}
                    onClick={() => setCategory(cat.label)}
                    className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold border transition-all text-left ${
                      isSelected
                        ? 'bg-[#087F5B] text-white border-[#087F5B] shadow-sm'
                        : 'bg-[#F4FAF5] dark:bg-[#173B32] text-slate-700 dark:text-emerald-200 border-emerald-100 dark:border-emerald-800/50 hover:border-[#39A96B]'
                    }`}
                  >
                    <Icon className="w-4 h-4 shrink-0" />
                    <span className="truncate">{cat.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Name & Description */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-emerald-200 mb-1">Habit Name *</label>
            <input
              type="text"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (error) setError('');
              }}
              placeholder="e.g. 20-Minute Nature Walk, Drink 2L Water, Avoid Plastic"
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#F4FAF5] dark:bg-[#173B32] border border-emerald-200/70 dark:border-emerald-800/50 text-[#173B32] dark:text-emerald-100 text-sm focus:outline-none focus:ring-2 focus:ring-[#087F5B]"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-emerald-200 mb-1">Description / Cue</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What triggers this habit and how will you execute it?"
              rows={2}
              className="w-full px-3.5 py-2 rounded-xl bg-[#F4FAF5] dark:bg-[#173B32] border border-emerald-200/70 dark:border-emerald-800/50 text-[#173B32] dark:text-emerald-100 text-xs focus:outline-none focus:ring-2 focus:ring-[#087F5B]"
            />
          </div>

          {/* Frequency & Difficulty */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-emerald-200 mb-1">Frequency</label>
              <select
                value={frequency}
                onChange={(e) => setFrequency(e.target.value as any)}
                className="w-full px-3 py-2 rounded-xl bg-[#F4FAF5] dark:bg-[#173B32] border border-emerald-200/70 dark:border-emerald-800/50 text-xs font-semibold text-slate-800 dark:text-emerald-200 focus:outline-none focus:ring-2 focus:ring-[#087F5B]"
              >
                <option value="daily">Every Day</option>
                <option value="weekdays">Weekdays Only</option>
                <option value="weekends">Weekends Only</option>
                <option value="3x_week">3 Times a Week</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-emerald-200 mb-1">Difficulty</label>
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value as any)}
                className="w-full px-3 py-2 rounded-xl bg-[#F4FAF5] dark:bg-[#173B32] border border-emerald-200/70 dark:border-emerald-800/50 text-xs font-semibold text-slate-800 dark:text-emerald-200 focus:outline-none focus:ring-2 focus:ring-[#087F5B]"
              >
                <option value="Beginner">Beginner (+10 XP)</option>
                <option value="Intermediate">Intermediate (+15 XP)</option>
                <option value="Advanced">Advanced (+25 XP)</option>
              </select>
            </div>
          </div>

          {/* Time & Reminder */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-emerald-200 mb-1">Preferred Time</label>
              <input
                type="text"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                placeholder="e.g. 07:30 AM or Evening"
                className="w-full px-3 py-2 rounded-xl bg-[#F4FAF5] dark:bg-[#173B32] border border-emerald-200/70 dark:border-emerald-800/50 text-xs text-slate-800 dark:text-emerald-200 focus:outline-none focus:ring-2 focus:ring-[#087F5B]"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-emerald-200 mb-1">Reminder</label>
              <input
                type="text"
                value={reminder}
                onChange={(e) => setReminder(e.target.value)}
                placeholder="e.g. 15 mins before"
                className="w-full px-3 py-2 rounded-xl bg-[#F4FAF5] dark:bg-[#173B32] border border-emerald-200/70 dark:border-emerald-800/50 text-xs text-slate-800 dark:text-emerald-200 focus:outline-none focus:ring-2 focus:ring-[#087F5B]"
              />
            </div>
          </div>

          {/* Health Benefit & Eco Impact */}
          <div className="p-3.5 rounded-2xl bg-emerald-50/60 dark:bg-emerald-950/40 border border-emerald-100 dark:border-emerald-900/40 space-y-3">
            <div>
              <label className="block text-xs font-bold text-[#087F5B] dark:text-[#7BC96F] mb-1">
                Health & Mind Benefit (Optional)
              </label>
              <input
                type="text"
                value={healthBenefit}
                onChange={(e) => setHealthBenefit(e.target.value)}
                placeholder="e.g. Reduces cortisol, sharpens alertness, aids digestion"
                className="w-full px-3 py-1.5 rounded-lg bg-white dark:bg-[#173B32] border border-emerald-200 dark:border-emerald-800 text-xs text-slate-800 dark:text-emerald-100 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#087F5B] dark:text-[#7BC96F] mb-1">
                Eco Impact / Sustainability (Optional)
              </label>
              <input
                type="text"
                value={ecoImpact}
                onChange={(e) => setEcoImpact(e.target.value)}
                placeholder="e.g. Saves single-use plastic, lowers vehicle emissions"
                className="w-full px-3 py-1.5 rounded-lg bg-white dark:bg-[#173B32] border border-emerald-200 dark:border-emerald-800 text-xs text-slate-800 dark:text-emerald-100 focus:outline-none"
              />
            </div>
          </div>

          {/* Submit Action */}
          <div className="flex items-center justify-end gap-3 pt-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-600 dark:text-emerald-300 hover:bg-slate-100 dark:hover:bg-emerald-900/30"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl text-xs font-bold bg-[#087F5B] hover:bg-[#076a4c] text-white shadow-md shadow-[#087F5B]/30 hover:scale-105 active:scale-95 transition-all"
            >
              Add Habit & Earn XP
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
