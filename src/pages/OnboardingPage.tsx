import React, { useState } from 'react';
import { 
  CheckSquare, 
  Bot, 
  MapPin, 
  Leaf, 
  Users, 
  ArrowRight, 
  ArrowLeft,
  Sparkles
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const OnboardingPage: React.FC = () => {
  const { navigate } = useApp();
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    {
      title: 'Build Healthy Habits',
      subtitle: 'Small, friction-free daily routines that compound into life-changing momentum.',
      icon: CheckSquare,
      color: 'from-emerald-500 to-[#087F5B]',
      badge: 'Step 1 of 5'
    },
    {
      title: 'Get Personalized AI Guidance',
      subtitle: 'VELORA’s AI coach understands your mood, schedule, and fatigue levels in real time.',
      icon: Bot,
      color: 'from-teal-500 to-emerald-700',
      badge: 'Step 2 of 5'
    },
    {
      title: 'Track Your Activities',
      subtitle: 'Interactive GPS routes, pace tracking, calories burned, and verified workout proof.',
      icon: MapPin,
      color: 'from-sky-500 to-blue-600',
      badge: 'Step 3 of 5'
    },
    {
      title: 'Live Sustainably',
      subtitle: 'Quantify your carbon offset and earn Eco Score points for walking and reducing waste.',
      icon: Leaf,
      color: 'from-green-500 to-[#087F5B]',
      badge: 'Step 4 of 5'
    },
    {
      title: 'Grow Together',
      subtitle: 'Connect with friends, share workout snapshots, celebrate streaks, and inspire each other.',
      icon: Users,
      color: 'from-amber-500 to-[#F4A261]',
      badge: 'Step 5 of 5'
    }
  ];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(s => s + 1);
    } else {
      navigate('/profile-setup');
    }
  };

  const current = steps[currentStep];
  const Icon = current.icon;

  return (
    <div className="min-h-screen bg-[#F4FAF5] dark:bg-[#102A24] flex items-center justify-center p-6">
      <div className="w-full max-w-xl bg-white dark:bg-[#102A24] rounded-3xl p-8 sm:p-10 shadow-2xl border border-emerald-100 dark:border-emerald-900/60 relative text-center">
        {/* Progress Dots */}
        <div className="flex items-center justify-center gap-2 mb-8">
          {steps.map((_, i) => (
            <div
              key={i}
              className={`h-2 rounded-full transition-all duration-300 ${
                i === currentStep
                  ? 'w-8 bg-[#087F5B] dark:bg-[#7BC96F]'
                  : i < currentStep
                  ? 'w-2 bg-[#39A96B]'
                  : 'w-2 bg-emerald-100 dark:bg-emerald-900'
              }`}
            />
          ))}
        </div>

        {/* Animated Icon Avatar */}
        <div className={`w-24 h-24 rounded-3xl bg-gradient-to-tr ${current.color} flex items-center justify-center text-white mx-auto shadow-xl shadow-emerald-900/20 mb-6 transition-all duration-500`}>
          <Icon className="w-12 h-12" />
        </div>

        <span className="text-xs font-bold uppercase tracking-wider text-[#087F5B] dark:text-[#7BC96F] block mb-2">
          {current.badge}
        </span>

        <h2 className="text-2xl sm:text-3xl font-extrabold text-[#173B32] dark:text-emerald-50 mb-3">
          {current.title}
        </h2>

        <p className="text-sm sm:text-base text-slate-600 dark:text-emerald-200/80 max-w-md mx-auto leading-relaxed">
          {current.subtitle}
        </p>

        {/* Bottom Navigation Controls */}
        <div className="flex items-center justify-between gap-4 mt-10 pt-6 border-t border-emerald-100 dark:border-emerald-900/40">
          {currentStep > 0 ? (
            <button
              onClick={() => setCurrentStep(s => s - 1)}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold text-slate-600 dark:text-emerald-300 hover:bg-slate-100 dark:hover:bg-emerald-900/40"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
          ) : (
            <button
              onClick={() => navigate('/home')}
              className="text-xs font-semibold text-slate-400 hover:text-slate-600"
            >
              Skip to Demo
            </button>
          )}

          <button
            onClick={handleNext}
            className="flex items-center gap-2 px-7 py-3 rounded-2xl bg-[#087F5B] hover:bg-[#076a4c] text-white font-bold text-sm shadow-md shadow-[#087F5B]/30 hover:scale-105 active:scale-95 transition-all ml-auto"
          >
            <span>{currentStep === steps.length - 1 ? 'Start Profile Setup' : 'Next Step'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
