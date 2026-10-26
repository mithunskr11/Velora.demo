import React from 'react';
import { 
  X, 
  CheckSquare, 
  MapPin, 
  CalendarCheck, 
  Share2, 
  Leaf, 
  Bot,
  Sparkles
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface QuickActionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenAddHabit: () => void;
  onOpenCreatePost: () => void;
}

export const QuickActionModal: React.FC<QuickActionModalProps> = ({
  isOpen,
  onClose,
  onOpenAddHabit,
  onOpenCreatePost
}) => {
  const { navigate } = useApp();

  if (!isOpen) return null;

  const actions = [
    {
      title: 'Add Habit',
      description: 'Create a new personal, fitness, or eco habit',
      icon: CheckSquare,
      color: 'from-emerald-600 to-teal-500',
      action: () => {
        onClose();
        onOpenAddHabit();
      }
    },
    {
      title: 'Start Activity',
      description: 'Launch GPS tracking for walking, running, or cycling',
      icon: MapPin,
      color: 'from-sky-500 to-blue-600',
      action: () => {
        onClose();
        navigate('/map');
      }
    },
    {
      title: 'Daily Check-in',
      description: 'Log your mood, habits, and emotional baseline',
      icon: CalendarCheck,
      color: 'from-amber-500 to-orange-500',
      action: () => {
        onClose();
        navigate('/check-in');
      }
    },
    {
      title: 'Share Activity Proof',
      description: 'Post workout photo & stats to the community',
      icon: Share2,
      color: 'from-purple-500 to-indigo-600',
      action: () => {
        onClose();
        onOpenCreatePost();
      }
    },
    {
      title: 'Log Eco Action',
      description: 'Record sustainable actions & boost Eco Score',
      icon: Leaf,
      color: 'from-green-600 to-emerald-700',
      action: () => {
        onClose();
        navigate('/eco');
      }
    },
    {
      title: 'Talk to AI Coach',
      description: 'Get empathetic advice or habit recalibration',
      icon: Bot,
      color: 'from-emerald-700 to-green-900',
      action: () => {
        onClose();
        navigate('/coach');
      }
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="w-full max-w-lg bg-white dark:bg-[#102A24] rounded-3xl p-6 shadow-2xl border border-emerald-100 dark:border-emerald-900/50 relative"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between pb-4 border-b border-emerald-100 dark:border-emerald-900/40">
          <div>
            <h3 className="text-xl font-extrabold text-[#173B32] dark:text-emerald-100 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-[#39A96B]" />
              Quick Action
            </h3>
            <p className="text-xs text-slate-500 dark:text-emerald-300/70">What would you like to record or explore right now?</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-emerald-200 hover:bg-emerald-50 dark:hover:bg-emerald-900/20"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
          {actions.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.title}
                onClick={item.action}
                className="flex items-start gap-3 p-3.5 rounded-2xl bg-[#F4FAF5] dark:bg-[#173B32] border border-emerald-100/80 dark:border-emerald-800/40 hover:border-[#39A96B] dark:hover:border-[#39A96B] hover:shadow-md transition-all text-left group"
              >
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-tr ${item.color} flex items-center justify-center text-white shrink-0 group-hover:scale-110 transition-transform shadow-sm`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-[#173B32] dark:text-emerald-100 group-hover:text-[#087F5B] dark:group-hover:text-[#7BC96F] transition-colors">
                    {item.title}
                  </h4>
                  <p className="text-[11px] text-slate-500 dark:text-emerald-300/70 leading-snug mt-0.5">
                    {item.description}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
