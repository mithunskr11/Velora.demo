import React, { useState } from 'react';
import { Leaf, Sparkles, ArrowRight, Lock, Mail, User as UserIcon } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const LoginPage: React.FC = () => {
  const { login, loginDemo, navigate } = useApp();
  const [email, setEmail] = useState('alex@velora.demo');
  const [password, setPassword] = useState('password123');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login(email || 'alex@velora.demo');
  };

  return (
    <div className="min-h-screen bg-[#F4FAF5] dark:bg-[#102A24] flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white dark:bg-[#102A24] rounded-3xl p-8 shadow-2xl border border-emerald-100 dark:border-emerald-900/60 relative">
        <div className="text-center mb-6">
          <div 
            onClick={() => navigate('/')} 
            className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#087F5B] to-[#39A96B] flex items-center justify-center text-white mx-auto shadow-md shadow-[#087F5B]/30 cursor-pointer mb-3"
          >
            <Leaf className="w-7 h-7" />
          </div>
          <h2 className="text-2xl font-extrabold text-[#173B32] dark:text-emerald-100">Welcome Back</h2>
          <p className="text-xs text-slate-500 dark:text-emerald-300/70 mt-1">
            Sign in to continue your habit streaks & eco impact.
          </p>
        </div>

        {/* Demo User Fast Track Banner */}
        <div className="mb-6 p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-[#087F5B] dark:text-[#7BC96F] flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" /> Demo Account Ready
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#087F5B] text-white font-mono">
              alex@velora.demo
            </span>
          </div>
          <button
            onClick={loginDemo}
            className="w-full py-2.5 rounded-xl bg-[#087F5B] hover:bg-[#076a4c] text-white font-bold text-xs shadow-md shadow-[#087F5B]/25 hover:scale-102 active:scale-98 transition-all"
          >
            1-Click Demo Login (Alex)
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-emerald-200 mb-1">Email</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-[#F4FAF5] dark:bg-[#173B32] border border-emerald-200/70 dark:border-emerald-800/60 text-[#173B32] dark:text-emerald-100 text-sm focus:outline-none focus:ring-2 focus:ring-[#087F5B]"
                required
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-bold text-slate-700 dark:text-emerald-200">Password</label>
              <button 
                type="button" 
                onClick={() => alert('Password reset link sent to demo inbox!')}
                className="text-[11px] text-[#087F5B] dark:text-[#7BC96F] hover:underline"
              >
                Forgot?
              </button>
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-[#F4FAF5] dark:bg-[#173B32] border border-emerald-200/70 dark:border-emerald-800/60 text-[#173B32] dark:text-emerald-100 text-sm focus:outline-none focus:ring-2 focus:ring-[#087F5B]"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-[#087F5B] hover:bg-[#076a4c] text-white font-bold text-sm shadow-md shadow-[#087F5B]/30 hover:scale-102 active:scale-98 transition-all"
          >
            Sign In to VELORA
          </button>
        </form>

        <div className="relative my-6 text-center">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-200 dark:border-emerald-900" />
          </div>
          <span className="relative px-3 bg-white dark:bg-[#102A24] text-[11px] text-slate-400">
            or continue with
          </span>
        </div>

        <button
          onClick={loginDemo}
          className="w-full py-2.5 rounded-xl border border-slate-200 dark:border-emerald-800 bg-white dark:bg-[#173B32] hover:bg-slate-50 dark:hover:bg-emerald-900/40 text-xs font-bold text-slate-700 dark:text-emerald-200 flex items-center justify-center gap-2 transition-colors"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"/>
            <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"/>
            <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15z"/>
            <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"/>
          </svg>
          <span>Continue with Google</span>
        </button>

        <p className="mt-6 text-center text-xs text-slate-500 dark:text-emerald-300/70">
          Don't have an account?{' '}
          <button 
            onClick={() => navigate('/signup')} 
            className="font-bold text-[#087F5B] dark:text-[#7BC96F] hover:underline"
          >
            Create account
          </button>
        </p>
      </div>
    </div>
  );
};

export const SignupPage: React.FC = () => {
  const { navigate } = useApp();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    navigate('/onboarding');
  };

  return (
    <div className="min-h-screen bg-[#F4FAF5] dark:bg-[#102A24] flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white dark:bg-[#102A24] rounded-3xl p-8 shadow-2xl border border-emerald-100 dark:border-emerald-900/60 relative">
        <div className="text-center mb-6">
          <div 
            onClick={() => navigate('/')} 
            className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#087F5B] to-[#39A96B] flex items-center justify-center text-white mx-auto shadow-md shadow-[#087F5B]/30 cursor-pointer mb-3"
          >
            <Leaf className="w-7 h-7" />
          </div>
          <h2 className="text-2xl font-extrabold text-[#173B32] dark:text-emerald-100">Join VELORA</h2>
          <p className="text-xs text-slate-500 dark:text-emerald-300/70 mt-1">
            “Your Habits. Your Mind. Your Impact.”
          </p>
        </div>

        <form onSubmit={handleNext} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-emerald-200 mb-1">Your Name</label>
            <div className="relative">
              <UserIcon className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Alex Rivera"
                className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-[#F4FAF5] dark:bg-[#173B32] border border-emerald-200/70 dark:border-emerald-800/60 text-[#173B32] dark:text-emerald-100 text-sm focus:outline-none focus:ring-2 focus:ring-[#087F5B]"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-emerald-200 mb-1">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="alex@example.com"
                className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-[#F4FAF5] dark:bg-[#173B32] border border-emerald-200/70 dark:border-emerald-800/60 text-[#173B32] dark:text-emerald-100 text-sm focus:outline-none focus:ring-2 focus:ring-[#087F5B]"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-emerald-200 mb-1">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-[#F4FAF5] dark:bg-[#173B32] border border-emerald-200/70 dark:border-emerald-800/60 text-[#173B32] dark:text-emerald-100 text-sm focus:outline-none focus:ring-2 focus:ring-[#087F5B]"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-[#087F5B] hover:bg-[#076a4c] text-white font-bold text-sm shadow-md shadow-[#087F5B]/30 hover:scale-102 active:scale-98 transition-all flex items-center justify-center gap-2"
          >
            <span>Continue to Onboarding</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <p className="mt-6 text-center text-xs text-slate-500 dark:text-emerald-300/70">
          Already have an account?{' '}
          <button 
            onClick={() => navigate('/login')} 
            className="font-bold text-[#087F5B] dark:text-[#7BC96F] hover:underline"
          >
            Sign In
          </button>
        </p>
      </div>
    </div>
  );
};
