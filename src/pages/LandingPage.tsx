import React from 'react';
import { 
  Leaf, 
  ArrowRight, 
  Sparkles, 
  Flame, 
  MapPin, 
  Users, 
  TrendingUp, 
  ShieldCheck, 
  CheckCircle2, 
  Zap, 
  Compass,
  CalendarCheck
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const LandingPage: React.FC = () => {
  const { navigate, loginDemo } = useApp();

  return (
    <div className="min-h-screen bg-[#F4FAF5] dark:bg-[#102A24] text-[#173B32] dark:text-[#F4FAF5] selection:bg-[#39A96B] selection:text-white transition-colors">
      {/* Top Navigation */}
      <header className="sticky top-0 z-40 bg-white/80 dark:bg-[#102A24]/80 backdrop-blur-md border-b border-emerald-100 dark:border-emerald-950/60 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/')}>
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#087F5B] to-[#39A96B] flex items-center justify-center text-white shadow-md shadow-[#087F5B]/20">
              <Leaf className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xl font-extrabold tracking-tight text-[#087F5B] dark:text-[#7BC96F]">
                VELORA
              </span>
              <span className="text-[10px] block text-emerald-800/70 dark:text-emerald-300/70 font-semibold uppercase tracking-wider">
                Lifestyle • Mind • Impact
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/login')}
              className="text-xs sm:text-sm font-bold text-slate-700 dark:text-emerald-200 px-4 py-2 rounded-xl hover:text-[#087F5B] transition-colors"
            >
              Sign In
            </button>
            <button
              onClick={loginDemo}
              className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-[#087F5B] hover:bg-[#076a4c] text-white text-xs sm:text-sm font-bold shadow-lg shadow-[#087F5B]/25 hover:scale-105 active:scale-95 transition-all"
            >
              <Sparkles className="w-4 h-4 text-[#F4C95D]" />
              <span>Launch Demo App</span>
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-12 pb-20 px-6 overflow-hidden">
        <div className="max-w-5xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-100/80 dark:bg-emerald-900/40 text-[#087F5B] dark:text-[#7BC96F] text-xs font-bold mb-6 border border-emerald-200 dark:border-emerald-800">
            <Leaf className="w-4 h-4" />
            <span>“Your Habits. Your Mind. Your Impact.”</span>
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-[#173B32] dark:text-emerald-50 leading-[1.1]">
            Build Better Habits.<br />
            Feel Better.<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#087F5B] via-[#39A96B] to-[#4DA3D9]">
              Live Sustainably.
            </span>
          </h1>

          <p className="mt-6 text-base sm:text-xl text-slate-600 dark:text-emerald-200/80 max-w-2xl mx-auto leading-relaxed">
            An AI-powered lifestyle companion that personalizes your daily habits, tracks outdoor activities, understands your mood, motivates you and helps you make a positive impact on the planet.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 mt-8">
            <button
              onClick={() => navigate('/signup')}
              className="flex items-center gap-2 px-8 py-4 rounded-2xl bg-[#087F5B] hover:bg-[#076a4c] text-white font-extrabold text-sm sm:text-base shadow-xl shadow-[#087F5B]/30 hover:scale-105 active:scale-95 transition-all"
            >
              <span>Get Started Free</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={loginDemo}
              className="flex items-center gap-2 px-8 py-4 rounded-2xl bg-white dark:bg-[#173B32] border-2 border-emerald-200 dark:border-emerald-700 hover:border-[#087F5B] text-[#173B32] dark:text-emerald-100 font-bold text-sm sm:text-base shadow-sm hover:scale-105 active:scale-95 transition-all"
            >
              <Sparkles className="w-4 h-4 text-[#F4C95D]" />
              <span>Explore VELORA (Demo User)</span>
            </button>
          </div>

          {/* Realistic Dashboard Mockup Card */}
          <div className="mt-14 max-w-4xl mx-auto bg-white dark:bg-[#102A24] rounded-3xl p-6 sm:p-8 shadow-2xl border-2 border-emerald-100 dark:border-emerald-900/60 text-left relative overflow-hidden group">
            <div className="flex items-center justify-between pb-4 border-b border-emerald-100 dark:border-emerald-900/40">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-rose-400" />
                <div className="w-3 h-3 rounded-full bg-amber-400" />
                <div className="w-3 h-3 rounded-full bg-emerald-400" />
                <span className="text-xs font-semibold text-slate-400 pl-2">VELORA Lifestyle Dashboard</span>
              </div>
              <span className="text-xs font-bold text-[#087F5B] dark:text-[#7BC96F] bg-emerald-50 dark:bg-emerald-950/60 px-3 py-1 rounded-full">
                🔥 7 Day Streak Active
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 my-4">
              <div className="p-3 rounded-2xl bg-[#F4FAF5] dark:bg-[#173B32]">
                <span className="text-[10px] font-bold text-slate-400 block">STREAK</span>
                <span className="text-xl font-extrabold text-[#F4A261] font-mono">7 Days 🔥</span>
              </div>
              <div className="p-3 rounded-2xl bg-[#F4FAF5] dark:bg-[#173B32]">
                <span className="text-[10px] font-bold text-slate-400 block">EXPERIENCE</span>
                <span className="text-xl font-extrabold text-[#F4C95D] font-mono">450 XP ⭐</span>
              </div>
              <div className="p-3 rounded-2xl bg-[#F4FAF5] dark:bg-[#173B32]">
                <span className="text-[10px] font-bold text-slate-400 block">ECO SCORE</span>
                <span className="text-xl font-extrabold text-[#087F5B] dark:text-[#7BC96F] font-mono">72 / 100 🌿</span>
              </div>
              <div className="p-3 rounded-2xl bg-[#F4FAF5] dark:bg-[#173B32]">
                <span className="text-[10px] font-bold text-slate-400 block">HABITS TODAY</span>
                <span className="text-xl font-extrabold text-[#39A96B] font-mono">85% Done ✓</span>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-gradient-to-r from-[#087F5B] to-[#173B32] text-white flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase font-bold text-emerald-200">AI Recommendation</span>
                <p className="text-sm font-bold mt-0.5">“Try a 15-minute nature walk today to boost afternoon focus.”</p>
              </div>
              <button 
                onClick={loginDemo}
                className="px-4 py-2 rounded-xl bg-white text-[#087F5B] text-xs font-bold hover:bg-emerald-50 shrink-0"
              >
                Open Dashboard
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Why VELORA? */}
      <section className="py-20 px-6 bg-white dark:bg-[#102A24]/60 border-t border-b border-emerald-100 dark:border-emerald-900/40">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#173B32] dark:text-emerald-100">
              Why VELORA?
            </h2>
            <p className="text-slate-600 dark:text-emerald-300/80 text-sm sm:text-base mt-2">
              “Small habits create a healthier person and a healthier planet.”
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 rounded-3xl bg-[#F4FAF5] dark:bg-[#173B32] border border-emerald-100 dark:border-emerald-800/50">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-[#087F5B] flex items-center justify-center mb-4">
                <Sparkles className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-[#173B32] dark:text-emerald-100 mb-2">
                1. AI Personalization Engine
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-emerald-200/70 leading-relaxed">
                Uses Content-Based Filtering & Cosine Similarity to tailor habits around your schedule, current fitness level, and emotional state.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-[#F4FAF5] dark:bg-[#173B32] border border-emerald-100 dark:border-emerald-800/50">
              <div className="w-12 h-12 rounded-2xl bg-sky-100 text-[#4DA3D9] flex items-center justify-center mb-4">
                <MapPin className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-[#173B32] dark:text-emerald-100 mb-2">
                2. Live GPS Activity Tracking
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-emerald-200/70 leading-relaxed">
                Track walks, runs, and bike rides with real-time route rendering, cadence, calories, and elevation. Includes full Demo GPS mode.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-[#F4FAF5] dark:bg-[#173B32] border border-emerald-100 dark:border-emerald-800/50">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-[#39A96B] flex items-center justify-center mb-4">
                <Leaf className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-[#173B32] dark:text-emerald-100 mb-2">
                3. Quantified Eco Impact
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-emerald-200/70 leading-relaxed">
                Calculate CO2 grams saved whenever you walk instead of drive, avoid single-use plastics, or complete weekly climate challenges.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-6">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#173B32] dark:text-emerald-100 mb-4">
            How VELORA Works
          </h2>
          <p className="text-slate-600 dark:text-emerald-300/80 text-sm max-w-xl mx-auto mb-12">
            The closed-loop lifestyle cycle that gets smarter every single month.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-left">
            {[
              { step: '01', title: 'Profile & Mood', desc: 'Set your goals, available time, and daily emotional state.' },
              { step: '02', title: 'Action & Route', desc: 'Check off micro-habits and log outdoor GPS movement.' },
              { step: '03', title: 'Proof & Community', desc: 'Share photo proof, earn XP, maintain streaks and follow friends.' },
              { step: '04', title: 'Monthly Plan Upgrade', desc: 'VELORA analyzes your month-over-month progress and evolves your habits.' },
            ].map((s) => (
              <div key={s.step} className="p-5 rounded-3xl bg-white dark:bg-[#102A24] border border-emerald-100 dark:border-emerald-800/50 shadow-sm">
                <span className="text-2xl font-extrabold text-[#087F5B] dark:text-[#7BC96F] font-mono">{s.step}</span>
                <h4 className="text-base font-bold text-[#173B32] dark:text-emerald-100 mt-2">{s.title}</h4>
                <p className="text-xs text-slate-500 dark:text-emerald-300/70 mt-1 leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>

          <div className="mt-16 p-8 rounded-3xl bg-gradient-to-r from-[#087F5B] via-[#39A96B] to-[#173B32] text-white shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="text-left">
              <h3 className="text-2xl font-extrabold">Ready to begin your journey?</h3>
              <p className="text-xs sm:text-sm text-emerald-100 mt-1">
                Demo user Alex is already seeded with habits, streak, and community data.
              </p>
            </div>
            <button
              onClick={loginDemo}
              className="px-8 py-3.5 rounded-2xl bg-white text-[#087F5B] font-extrabold text-sm shadow-xl hover:bg-emerald-50 hover:scale-105 active:scale-95 transition-all shrink-0"
            >
              Enter Dashboard Demo →
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 border-t border-emerald-100 dark:border-emerald-950/60 text-center text-xs text-slate-500 dark:text-emerald-300/60">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Leaf className="w-4 h-4 text-[#087F5B]" />
            <span className="font-bold text-[#087F5B] dark:text-[#7BC96F]">VELORA</span>
            <span>— “Your Habits. Your Mind. Your Impact.”</span>
          </div>
          <div>
            Built with React, TypeScript, Tailwind CSS, Gemini AI & Firebase Architecture.
          </div>
        </div>
      </footer>
    </div>
  );
};
