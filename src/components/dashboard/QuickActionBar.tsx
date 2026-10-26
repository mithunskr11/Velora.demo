import React from 'react';
import { 
  CheckCircle2, 
  MapPin, 
  CalendarCheck, 
  Bot, 
  Leaf, 
  PlusCircle 
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface QuickActionBarProps {
  onOpenAddHabit: () => void;
}

export const QuickActionBar: React.FC<QuickActionBarProps> = ({ onOpenAddHabit }) => {
  const { navigate } = useApp();

  const actions = [
    {
      label: 'Complete Habit',
      icon: CheckCircle2,
      color: 'bg-emerald-50 text-[#087F5B] hover:bg-emerald-100 dark:bg-emerald-950/50 dark:text-emerald-300',
      onClick: () => navigate('/habits')
    },
    {
      label: 'Start Activity',
      icon: MapPin,
      color: 'bg-sky-50 text-[#4DA3D9] hover:bg-sky-100 dark:bg-sky-950/50 dark:text-sky-300',
      onClick: () => navigate('/map')
    },
    {
      label: 'Daily Check-in',
      icon: CalendarCheck,
      color: 'bg-amber-50 text-[#F4A261] hover:bg-amber-100 dark:bg-amber-950/50 dark:text-amber-300',
      onClick: () => navigate('/check-in')
    },
    {
      label: 'Ask AI Coach',
      icon: Bot,
      color: 'bg-teal-50 text-[#087F5B] hover:bg-teal-100 dark:bg-teal-950/50 dark:text-teal-300',
      onClick: () => navigate('/coach')
    },
    {
      label: 'Eco Action',
      icon: Leaf,
      color: 'bg-emerald-50 text-[#39A96B] hover:bg-emerald-100 dark:bg-emerald-950/50 dark:text-emerald-300',
      onClick: () => navigate('/eco')
    },
    {
      label: 'Add Habit',
      icon: PlusCircle,
      color: 'bg-emerald-100/70 text-[#087F5B] hover:bg-emerald-200 dark:bg-emerald-900/40 dark:text-emerald-200 font-bold',
      onClick: onOpenAddHabit
    }
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
      {actions.map((item) => {
        const Icon = item.icon;
        return (
          <button
            key={item.label}
            onClick={item.onClick}
            className={`flex items-center justify-center gap-2 px-3 py-2.5 rounded-2xl border border-emerald-100/60 dark:border-emerald-900/40 text-xs font-semibold transition-all hover:scale-103 active:scale-97 text-center ${item.color}`}
          >
            <Icon className="w-4 h-4 shrink-0" />
            <span className="truncate">{item.label}</span>
          </button>
        );
      })}
    </div>
  );
};
