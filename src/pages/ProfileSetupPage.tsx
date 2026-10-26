import React, { useState } from 'react';
import { 
  User, 
  Sparkles, 
  ShieldCheck, 
  ArrowRight, 
  ArrowLeft, 
  Heart, 
  Dumbbell, 
  Clock, 
  Check, 
  Lock
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { GoalType, ActivityLevel, DietType, DifficultyLevel, AvailableTime } from '../types';

export const ProfileSetupPage: React.FC = () => {
  const { user, updateUser, navigate, refreshRecommendations } = useApp();

  const [step, setStep] = useState(1);

  // Form states
  const [name, setName] = useState(user.name);
  const [age, setAge] = useState(user.age || 26);
  const [gender, setGender] = useState(user.gender || 'Non-binary');
  const [avatar, setAvatar] = useState(user.avatar);
  
  // Health
  const [height, setHeight] = useState(user.height || 172);
  const [weight, setWeight] = useState(user.weight || 65);
  const [bodyFat, setBodyFat] = useState(user.bodyFat || 17.5);
  const [isHealthPrivate, setIsHealthPrivate] = useState(true);

  // Lifestyle
  const [activityLevel, setActivityLevel] = useState<ActivityLevel>(user.activityLevel || 'Moderate');
  const [sleepDuration, setSleepDuration] = useState(user.sleepDuration || 7.5);
  const [diet, setDiet] = useState<DietType>(user.diet || 'Vegetarian');

  // Goals
  const allGoals: GoalType[] = ['Fitness', 'Health', 'Study', 'Productivity', 'Mental Wellness', 'Sustainability'];
  const [selectedGoals, setSelectedGoals] = useState<GoalType[]>(user.goals || ['Fitness', 'Mental Wellness', 'Sustainability']);

  // Interests
  const allInterests = ['Running', 'Walking', 'Cycling', 'Reading', 'Meditation', 'Yoga', 'Nature', 'Travel', 'Exercise', 'Learning', 'Productivity'];
  const [selectedInterests, setSelectedInterests] = useState<string[]>(user.interests || ['Walking', 'Reading', 'Nature']);

  // Available Time & Difficulty
  const [availableTime, setAvailableTime] = useState<AvailableTime>(user.availableTime || '30 minutes');
  const [difficulty, setDifficulty] = useState<DifficultyLevel>(user.difficulty || 'Intermediate');
  const [formError, setFormError] = useState<string>('');

  const toggleGoal = (g: GoalType) => {
    setFormError('');
    setSelectedGoals(prev => 
      prev.includes(g) ? (prev.length > 1 ? prev.filter(item => item !== g) : prev) : [...prev, g]
    );
  };

  const toggleInterest = (i: string) => {
    setFormError('');
    setSelectedInterests(prev =>
      prev.includes(i) ? prev.filter(item => item !== i) : [...prev, i]
    );
  };

  const handleNextStep = () => {
    if (step === 1) {
      if (!name.trim()) {
        setFormError('Please enter your full name.');
        return;
      }
      if (age < 12 || age > 110) {
        setFormError('Please enter a valid age between 12 and 110.');
        return;
      }
    } else if (step === 2) {
      if (selectedGoals.length === 0) {
        setFormError('Please select at least one primary wellness goal.');
        return;
      }
    }
    setFormError('');
    setStep(s => s + 1);
  };

  const handleFinish = () => {
    if (selectedInterests.length === 0) {
      setFormError('Please select at least one activity interest.');
      return;
    }
    setFormError('');
    updateUser({
      name,
      age,
      gender,
      avatar,
      height,
      weight,
      bodyFat,
      isHealthPrivate,
      activityLevel,
      sleepDuration,
      diet,
      goals: selectedGoals,
      interests: selectedInterests,
      availableTime,
      difficulty
    });
    refreshRecommendations();
    navigate('/home');
  };

  return (
    <div className="min-h-screen bg-[#F4FAF5] dark:bg-[#102A24] flex items-center justify-center p-4 py-10">
      <div className="w-full max-w-2xl bg-white dark:bg-[#102A24] rounded-3xl p-6 sm:p-10 shadow-2xl border border-emerald-100 dark:border-emerald-900/60 relative">
        {/* Header */}
        <div className="text-center mb-6">
          <span className="text-xs font-bold text-[#087F5B] dark:text-[#7BC96F] uppercase tracking-wider block mb-1">
            Step {step} of 3
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#173B32] dark:text-emerald-50">
            Let’s Get to Know You
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-emerald-300/70 mt-1 max-w-md mx-auto">
            Your information helps VELORA create better personalized habit recommendations.
          </p>
        </div>

        {/* Step Indicator */}
        <div className="flex items-center justify-center gap-2 mb-8">
          {[1, 2, 3].map((s) => (
            <div
              key={s}
              className={`h-2 rounded-full transition-all duration-300 ${
                s === step
                  ? 'w-10 bg-[#087F5B]'
                  : s < step
                  ? 'w-4 bg-[#39A96B]'
                  : 'w-4 bg-emerald-100 dark:bg-emerald-900'
              }`}
            />
          ))}
        </div>

        {/* STEP 1: Basic Information & Health (Private) */}
        {step === 1 && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-emerald-200 mb-1">Full Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#F4FAF5] dark:bg-[#173B32] border border-emerald-200/70 dark:border-emerald-800 text-sm focus:outline-none focus:ring-2 focus:ring-[#087F5B]"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-emerald-200 mb-1">Age</label>
                <input
                  type="number"
                  value={age}
                  onChange={(e) => setAge(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#F4FAF5] dark:bg-[#173B32] border border-emerald-200/70 dark:border-emerald-800 text-sm focus:outline-none focus:ring-2 focus:ring-[#087F5B]"
                />
              </div>
            </div>

            {/* Health Metrics & Privacy Shield */}
            <div className="p-4 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#087F5B] dark:text-[#7BC96F] flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-[#087F5B]" /> Health Metrics (Private by Default)
                </span>
                <span className="text-[10px] text-emerald-800 dark:text-emerald-300 font-semibold flex items-center gap-1">
                  <Lock className="w-3 h-3" /> Never shared publicly
                </span>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 dark:text-emerald-300 mb-1">Height (cm)</label>
                  <input
                    type="number"
                    value={height}
                    onChange={(e) => setHeight(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-white dark:bg-[#173B32] border border-emerald-200 dark:border-emerald-800 text-xs font-semibold focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 dark:text-emerald-300 mb-1">Weight (kg)</label>
                  <input
                    type="number"
                    value={weight}
                    onChange={(e) => setWeight(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-white dark:bg-[#173B32] border border-emerald-200 dark:border-emerald-800 text-xs font-semibold focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 dark:text-emerald-300 mb-1">Body Fat % (opt)</label>
                  <input
                    type="number"
                    value={bodyFat}
                    onChange={(e) => setBodyFat(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-white dark:bg-[#173B32] border border-emerald-200 dark:border-emerald-800 text-xs font-semibold focus:outline-none"
                  />
                </div>
              </div>

              <label className="flex items-center gap-2 pt-1 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isHealthPrivate}
                  onChange={(e) => setIsHealthPrivate(e.target.checked)}
                  className="rounded text-[#087F5B] focus:ring-[#087F5B]"
                />
                <span className="text-xs text-slate-700 dark:text-emerald-200 font-medium">
                  Keep weight, height, and biological stats strictly private on my public profile.
                </span>
              </label>
            </div>
          </div>
        )}

        {/* STEP 2: Lifestyle & Goals */}
        {step === 2 && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-emerald-200 mb-2">Activity Level</label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {(['Sedentary', 'Light', 'Moderate', 'Active', 'Very Active'] as ActivityLevel[]).map((lvl) => (
                  <button
                    type="button"
                    key={lvl}
                    onClick={() => setActivityLevel(lvl)}
                    className={`px-3 py-2 rounded-xl text-xs font-bold border transition-all text-center ${
                      activityLevel === lvl
                        ? 'bg-[#087F5B] text-white border-[#087F5B] shadow-sm'
                        : 'bg-[#F4FAF5] dark:bg-[#173B32] text-slate-700 dark:text-emerald-200 border-emerald-100 dark:border-emerald-800 hover:border-[#39A96B]'
                    }`}
                  >
                    {lvl}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-emerald-200 mb-1">Diet Preference</label>
                <select
                  value={diet}
                  onChange={(e) => setDiet(e.target.value as DietType)}
                  className="w-full px-3 py-2.5 rounded-xl bg-[#F4FAF5] dark:bg-[#173B32] border border-emerald-200 dark:border-emerald-800 text-xs font-semibold focus:outline-none"
                >
                  <option value="Vegetarian">Vegetarian 🌱</option>
                  <option value="Non-Vegetarian">Non-Vegetarian 🍗</option>
                  <option value="Vegan">Vegan 🍃</option>
                  <option value="Other">Other 🥗</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-emerald-200 mb-1">Average Sleep (Hours)</label>
                <input
                  type="number"
                  step="0.5"
                  value={sleepDuration}
                  onChange={(e) => setSleepDuration(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#F4FAF5] dark:bg-[#173B32] border border-emerald-200 dark:border-emerald-800 text-xs font-semibold focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-emerald-200 mb-2">Primary Goals</label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {allGoals.map((g) => {
                  const isSel = selectedGoals.includes(g);
                  return (
                    <button
                      type="button"
                      key={g}
                      onClick={() => toggleGoal(g)}
                      className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold border transition-all ${
                        isSel
                          ? 'bg-[#087F5B] text-white border-[#087F5B] shadow-sm'
                          : 'bg-[#F4FAF5] dark:bg-[#173B32] text-slate-700 dark:text-emerald-200 border-emerald-100 dark:border-emerald-800 hover:border-[#39A96B]'
                      }`}
                    >
                      <span>{g}</span>
                      {isSel && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* STEP 3: Interests, Available Time & Difficulty */}
        {step === 3 && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-emerald-200 mb-2">Interests & Activities</label>
              <div className="flex flex-wrap gap-2">
                {allInterests.map((interest) => {
                  const isSel = selectedInterests.includes(interest);
                  return (
                    <button
                      type="button"
                      key={interest}
                      onClick={() => toggleInterest(interest)}
                      className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                        isSel
                          ? 'bg-[#087F5B] text-white shadow-sm'
                          : 'bg-[#F4FAF5] dark:bg-[#173B32] text-slate-700 dark:text-emerald-200 border border-emerald-100 dark:border-emerald-800 hover:border-[#39A96B]'
                      }`}
                    >
                      {interest}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-emerald-200 mb-1">Available Daily Time</label>
                <select
                  value={availableTime}
                  onChange={(e) => setAvailableTime(e.target.value as AvailableTime)}
                  className="w-full px-3 py-2.5 rounded-xl bg-[#F4FAF5] dark:bg-[#173B32] border border-emerald-200 dark:border-emerald-800 text-xs font-semibold focus:outline-none"
                >
                  <option value="15 minutes">15 minutes</option>
                  <option value="30 minutes">30 minutes</option>
                  <option value="45 minutes">45 minutes</option>
                  <option value="60+ minutes">60+ minutes</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-emerald-200 mb-1">Preferred Difficulty</label>
                <select
                  value={difficulty}
                  onChange={(e) => setDifficulty(e.target.value as DifficultyLevel)}
                  className="w-full px-3 py-2.5 rounded-xl bg-[#F4FAF5] dark:bg-[#173B32] border border-emerald-200 dark:border-emerald-800 text-xs font-semibold focus:outline-none"
                >
                  <option value="Beginner">Beginner (gentle, sustainable pacing)</option>
                  <option value="Intermediate">Intermediate (balanced challenge)</option>
                  <option value="Advanced">Advanced (high intensity & volume)</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {formError && (
          <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold text-center">
            {formError}
          </div>
        )}

        {/* Footer Navigation Buttons */}
        <div className="flex items-center justify-between gap-4 mt-8 pt-6 border-t border-emerald-100 dark:border-emerald-900/40">
          {step > 1 ? (
            <button
              type="button"
              onClick={() => {
                setFormError('');
                setStep(s => s - 1);
              }}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold text-slate-600 dark:text-emerald-300 hover:bg-slate-100 dark:hover:bg-emerald-900/40"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Previous</span>
            </button>
          ) : (
            <div />
          )}

          {step < 3 ? (
            <button
              type="button"
              onClick={handleNextStep}
              className="flex items-center gap-2 px-7 py-3 rounded-2xl bg-[#087F5B] hover:bg-[#076a4c] text-white font-bold text-sm shadow-md shadow-[#087F5B]/30 hover:scale-105 active:scale-95 transition-all ml-auto"
            >
              <span>Next</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleFinish}
              className="flex items-center gap-2 px-8 py-3 rounded-2xl bg-gradient-to-r from-[#087F5B] to-[#39A96B] hover:scale-105 text-white font-extrabold text-sm shadow-xl shadow-[#087F5B]/30 active:scale-95 transition-all ml-auto"
            >
              <Sparkles className="w-4 h-4 text-[#F4C95D]" />
              <span>Launch My VELORA Plan</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
