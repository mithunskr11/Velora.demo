import React, { useState } from 'react';
import { 
  CalendarCheck, 
  Sparkles, 
  Check, 
  X, 
  Send, 
  Heart, 
  Brain, 
  Bot,
  ArrowRight,
  ShieldAlert
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { MoodType } from '../types';
import { aiService } from '../services/ai';

export const CheckInPage: React.FC = () => {
  const { habits, submitCheckin, todayCheckinDone, todayMood, navigate } = useApp();

  const [selectedCompleted, setSelectedCompleted] = useState<string[]>(
    habits.filter(h => h.completed).map(h => h.id)
  );
  const [selectedMood, setSelectedMood] = useState<MoodType>('😊 Happy');
  const [moodText, setMoodText] = useState('');
  const [aiInsight, setAiInsight] = useState<string | null>(null);
  const [isSaved, setIsSaved] = useState(todayCheckinDone);

  const moodOptions: { type: MoodType; label: string; desc: string }[] = [
    { type: '😊 Happy', label: 'Happy', desc: 'High vitality & optimism' },
    { type: '🙂 Good', label: 'Good', desc: 'Calm, balanced & steady' },
    { type: '😐 Okay', label: 'Okay', desc: 'Neutral, floating along' },
    { type: '😔 Sad', label: 'Sad', desc: 'Low energy, reflective' },
    { type: '😣 Stressed', label: 'Stressed', desc: 'Pressure, hurried pace' },
    { type: '😴 Tired', label: 'Tired', desc: 'Physically or mentally drained' },
  ];

  const toggleHabitInList = (id: string) => {
    setSelectedCompleted(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const handleSaveCheckin = (e: React.FormEvent) => {
    e.preventDefault();
    submitCheckin(selectedMood, moodText, selectedCompleted);
    const feedback = aiService.analyzeMoodCheckin(selectedMood, moodText);
    setAiInsight(feedback);
    setIsSaved(true);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="text-center">
        <div className="w-12 h-12 rounded-2xl bg-amber-100 dark:bg-amber-950/60 text-[#F4A261] flex items-center justify-center mx-auto mb-2 shadow-sm">
          <CalendarCheck className="w-6 h-6" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#173B32] dark:text-emerald-50">
          How did you do today?
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-emerald-300/80 mt-1">
          Review your habits, log your mood, and calibrate tomorrow's AI recommendations.
        </p>
      </div>

      <form onSubmit={handleSaveCheckin} className="space-y-6">
        {/* Section 1: Habits completed or skipped */}
        <div className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-[#102A24] border border-emerald-100 dark:border-emerald-900/40 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-700 dark:text-emerald-200">
              1. Today's Habits Checklist
            </h3>
            <span className="text-xs text-slate-400">
              {selectedCompleted.length} of {habits.length} checked
            </span>
          </div>

          <div className="space-y-2">
            {habits.map((h) => {
              const isChecked = selectedCompleted.includes(h.id);
              return (
                <div
                  key={h.id}
                  onClick={() => toggleHabitInList(h.id)}
                  className={`p-3 rounded-2xl border flex items-center justify-between cursor-pointer transition-all ${
                    isChecked
                      ? 'bg-emerald-50/70 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-800'
                      : 'bg-[#F4FAF5] dark:bg-[#173B32] border-emerald-100 dark:border-emerald-900/40'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-7 h-7 rounded-xl flex items-center justify-center text-xs font-bold ${
                      isChecked ? 'bg-[#087F5B] text-white' : 'border border-slate-300 dark:border-slate-600'
                    }`}>
                      {isChecked ? <Check className="w-4 h-4 stroke-[3]" /> : null}
                    </div>
                    <div>
                      <span className={`text-xs sm:text-sm font-bold ${isChecked ? 'text-[#087F5B] dark:text-[#7BC96F]' : 'text-slate-700 dark:text-emerald-100'}`}>
                        {h.name}
                      </span>
                      <span className="text-[10px] text-slate-400 block">{h.category}</span>
                    </div>
                  </div>

                  <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full ${
                    isChecked ? 'bg-emerald-100 text-[#087F5B] dark:bg-emerald-900/60 dark:text-emerald-200' : 'bg-slate-100 text-slate-500'
                  }`}>
                    {isChecked ? 'Completed' : 'Skipped'}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Section 2: Mood selection */}
        <div className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-[#102A24] border border-emerald-100 dark:border-emerald-900/40 shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-slate-700 dark:text-emerald-200">
            2. How are you feeling today?
          </h3>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {moodOptions.map((mood) => {
              const isSel = selectedMood === mood.type;
              return (
                <button
                  type="button"
                  key={mood.type}
                  onClick={() => setSelectedMood(mood.type)}
                  className={`p-3.5 rounded-2xl border text-center transition-all ${
                    isSel
                      ? 'bg-amber-50 dark:bg-amber-950/40 border-amber-400 dark:border-amber-600 shadow-md scale-102'
                      : 'bg-[#F4FAF5] dark:bg-[#173B32] border-emerald-100 dark:border-emerald-900/40 hover:border-amber-300'
                  }`}
                >
                  <span className="text-2xl block mb-1">{mood.type.split(' ')[0]}</span>
                  <span className="text-xs font-bold text-[#173B32] dark:text-emerald-100 block">{mood.label}</span>
                  <span className="text-[10px] text-slate-400 dark:text-emerald-300/60 mt-0.5 block leading-tight">{mood.desc}</span>
                </button>
              );
            })}
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-emerald-200 mb-1">
              Tell VELORA how you feel… (Optional)
            </label>
            <textarea
              value={moodText}
              onChange={(e) => setMoodText(e.target.value)}
              placeholder="e.g. Busy sprint at work today, took a 20-min walk which helped clear afternoon brain fog..."
              rows={3}
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#F4FAF5] dark:bg-[#173B32] border border-emerald-200/70 dark:border-emerald-800 text-xs sm:text-sm text-[#173B32] dark:text-emerald-100 focus:outline-none focus:ring-2 focus:ring-[#087F5B]"
            />
          </div>

          {/* Wellness Disclaimer */}
          <div className="flex items-start gap-2 p-3 rounded-xl bg-slate-50 dark:bg-emerald-950/20 text-[10px] text-slate-500 dark:text-emerald-300/60">
            <ShieldAlert className="w-4 h-4 shrink-0 text-slate-400" />
            <span>
              Wellness Disclaimer: VELORA’s emotional coach is an encouraging lifestyle companion and does not diagnose or treat medical conditions.
            </span>
          </div>
        </div>

        {/* Action Button */}
        <div className="text-center pt-2">
          <button
            type="submit"
            className="w-full sm:w-auto px-10 py-3.5 rounded-2xl bg-[#087F5B] hover:bg-[#076a4c] text-white font-extrabold text-sm shadow-xl shadow-[#087F5B]/30 hover:scale-105 active:scale-95 transition-all inline-flex items-center justify-center gap-2"
          >
            <Sparkles className="w-4 h-4 text-[#F4C95D]" />
            <span>Save Check-in & Calibrate AI (+25 XP)</span>
          </button>
        </div>
      </form>

      {/* AI Post Check-in Insight */}
      {isSaved && (
        <div className="p-5 sm:p-6 rounded-3xl bg-gradient-to-r from-emerald-900 to-[#087F5B] text-white shadow-xl animate-in zoom-in-95 duration-200">
          <div className="flex items-center gap-2 mb-2">
            <Bot className="w-5 h-5 text-[#F4C95D]" />
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-200">
              AI Emotional Calibration Complete
            </span>
          </div>
          <p className="text-sm leading-relaxed text-emerald-50">
            {aiInsight || 'Check-in recorded! Your streak was maintained and your daily habit weights have been dynamically updated.'}
          </p>
          <div className="mt-4 flex items-center justify-end gap-3">
            <button
              onClick={() => navigate('/coach')}
              className="px-4 py-2 rounded-xl bg-white text-[#087F5B] text-xs font-bold hover:bg-emerald-50 transition-colors"
            >
              Chat with AI Coach →
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
