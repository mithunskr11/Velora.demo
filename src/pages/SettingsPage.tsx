import React, { useState } from 'react';
import { 
  Settings, 
  User, 
  Lock, 
  Bell, 
  Bot, 
  Moon, 
  Sun, 
  ShieldCheck, 
  HelpCircle, 
  LogOut, 
  Check, 
  Sparkles,
  Save
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { GoalType } from '../types';

export const SettingsPage: React.FC = () => {
  const { user, updateUser, theme, toggleTheme, logout, navigate } = useApp();

  const [name, setName] = useState(user.name);
  const [username, setUsername] = useState(user.username);
  const [bio, setBio] = useState(user.bio);
  const [weight, setWeight] = useState(user.weight);
  const [height, setHeight] = useState(user.height);
  const [isHealthPrivate, setIsHealthPrivate] = useState(user.isHealthPrivate);
  const [activityVisibility, setActivityVisibility] = useState(user.activityVisibility);
  const [postVisibility, setPostVisibility] = useState(user.postVisibility);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateUser({
      name,
      username,
      bio,
      weight,
      height,
      isHealthPrivate,
      activityVisibility,
      postVisibility
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#173B32] dark:text-emerald-50">
          Settings & Privacy
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-emerald-300/80 mt-1">
          Manage your account, biological privacy settings, and AI preferences.
        </p>
      </div>

      {savedSuccess && (
        <div className="p-3.5 rounded-2xl bg-emerald-100 dark:bg-emerald-900/60 border border-emerald-300 text-[#087F5B] dark:text-emerald-200 text-xs font-bold flex items-center gap-2">
          <Check className="w-4 h-4 stroke-[3]" />
          <span>Profile and privacy preferences saved successfully!</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        {/* Personal Details */}
        <div className="p-6 rounded-3xl bg-white dark:bg-[#102A24] border border-emerald-100 dark:border-emerald-900/40 shadow-sm space-y-4">
          <h3 className="text-base font-extrabold text-[#173B32] dark:text-emerald-100 flex items-center gap-2">
            <User className="w-5 h-5 text-[#087F5B]" />
            Personal Profile
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-emerald-200 mb-1">Display Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#F4FAF5] dark:bg-[#173B32] border border-emerald-200/70 dark:border-emerald-800 text-xs sm:text-sm text-[#173B32] dark:text-emerald-100 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-emerald-200 mb-1">Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#F4FAF5] dark:bg-[#173B32] border border-emerald-200/70 dark:border-emerald-800 text-xs sm:text-sm text-[#173B32] dark:text-emerald-100 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-emerald-200 mb-1">Bio</label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              rows={2}
              className="w-full px-3.5 py-2 rounded-xl bg-[#F4FAF5] dark:bg-[#173B32] border border-emerald-200/70 dark:border-emerald-800 text-xs text-[#173B32] dark:text-emerald-100 focus:outline-none"
            />
          </div>
        </div>

        {/* Health Data & Privacy Controls */}
        <div className="p-6 rounded-3xl bg-white dark:bg-[#102A24] border border-emerald-100 dark:border-emerald-900/40 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-extrabold text-[#173B32] dark:text-emerald-100 flex items-center gap-2">
              <Lock className="w-5 h-5 text-amber-500" />
              Health Data & Visibility Shield
            </h3>
            <span className="text-xs font-bold text-[#087F5B] dark:text-[#7BC96F]">
              HIPAA / GDPR Ready
            </span>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-emerald-200 mb-1">Current Weight (kg)</label>
              <input
                type="number"
                value={weight}
                onChange={(e) => setWeight(Number(e.target.value))}
                className="w-full px-3.5 py-2 rounded-xl bg-[#F4FAF5] dark:bg-[#173B32] border border-emerald-200/70 dark:border-emerald-800 text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-emerald-200 mb-1">Height (cm)</label>
              <input
                type="number"
                value={height}
                onChange={(e) => setHeight(Number(e.target.value))}
                className="w-full px-3.5 py-2 rounded-xl bg-[#F4FAF5] dark:bg-[#173B32] border border-emerald-200/70 dark:border-emerald-800 text-xs"
              />
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-emerald-50/60 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900 space-y-3">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={isHealthPrivate}
                onChange={(e) => setIsHealthPrivate(e.target.checked)}
                className="rounded text-[#087F5B] focus:ring-[#087F5B] w-4 h-4"
              />
              <div>
                <span className="text-xs font-bold text-slate-800 dark:text-emerald-100 block">
                  Keep Biological Health Stats Strictly Private
                </span>
                <span className="text-[11px] text-slate-500 dark:text-emerald-300/70 block">
                  When enabled, followers and public visitors can NEVER see your weight, height, or body fat percentage.
                </span>
              </div>
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div>
                <label className="block text-[11px] font-bold text-slate-600 dark:text-emerald-300 mb-1">Activity Visibility</label>
                <select
                  value={activityVisibility}
                  onChange={(e) => setActivityVisibility(e.target.value as any)}
                  className="w-full px-3 py-1.5 rounded-xl bg-white dark:bg-[#173B32] border border-emerald-200 dark:border-emerald-800 text-xs"
                >
                  <option value="public">Public (All community members)</option>
                  <option value="followers">Followers Only</option>
                  <option value="private">Private (Only Me)</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 dark:text-emerald-300 mb-1">Community Post Visibility</label>
                <select
                  value={postVisibility}
                  onChange={(e) => setPostVisibility(e.target.value as any)}
                  className="w-full px-3 py-1.5 rounded-xl bg-white dark:bg-[#173B32] border border-emerald-200 dark:border-emerald-800 text-xs"
                >
                  <option value="public">Public Feed</option>
                  <option value="followers">Followers Only</option>
                  <option value="private">Private Archive</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Interface & Theme Preferences */}
        <div className="p-6 rounded-3xl bg-white dark:bg-[#102A24] border border-emerald-100 dark:border-emerald-900/40 shadow-sm space-y-4">
          <h3 className="text-base font-extrabold text-[#173B32] dark:text-emerald-100 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-[#39A96B]" />
            Preferences & Appearance
          </h3>

          <div className="flex items-center justify-between p-3 rounded-2xl bg-[#F4FAF5] dark:bg-[#173B32]">
            <div className="flex items-center gap-2.5">
              {theme === 'light' ? <Sun className="w-5 h-5 text-amber-500" /> : <Moon className="w-5 h-5 text-amber-300" />}
              <div>
                <span className="text-xs font-bold text-slate-700 dark:text-emerald-200 block">Appearance Theme</span>
                <span className="text-[11px] text-slate-400">Current: {theme === 'light' ? 'Nature Light' : 'Dark Forest'}</span>
              </div>
            </div>
            <button
              type="button"
              onClick={toggleTheme}
              className="px-4 py-1.5 rounded-xl text-xs font-bold bg-white dark:bg-emerald-950 border border-emerald-200 dark:border-emerald-800 text-slate-700 dark:text-emerald-200"
            >
              Switch to {theme === 'light' ? 'Dark Forest' : 'Light'}
            </button>
          </div>
        </div>

        {/* Save & Danger Zone */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
          <button
            type="button"
            onClick={logout}
            className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-rose-50 hover:bg-rose-100 text-rose-600 text-xs font-bold transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out of VELORA</span>
          </button>

          <button
            type="submit"
            className="flex items-center gap-2 px-7 py-3 rounded-2xl bg-[#087F5B] hover:bg-[#076a4c] text-white text-xs font-bold shadow-md shadow-[#087F5B]/30 hover:scale-105 active:scale-95 transition-all w-full sm:w-auto justify-center"
          >
            <Save className="w-4 h-4" />
            <span>Save Settings</span>
          </button>
        </div>
      </form>
    </div>
  );
};
