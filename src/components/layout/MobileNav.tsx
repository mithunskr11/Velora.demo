import React from 'react';
import { Home, CheckSquare, Camera, Users, User } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const MobileNav: React.FC = () => {
  const { currentRoute, navigate, openCamera, user } = useApp();

  const navItems = [
    { label: 'Home', route: '/home', icon: Home },
    { label: 'Habits', route: '/habits', icon: CheckSquare },
    { label: 'Camera', isCenter: true },
    { label: 'Community', route: '/community', icon: Users },
    { label: 'Profile', route: `/profile/${user?.username || 'alex_rivera'}`, icon: User },
  ];

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white/95 dark:bg-[#102A24]/95 backdrop-blur-md border-t border-emerald-100 dark:border-emerald-950/60 px-3 py-2 z-40 select-none shadow-lg">
      <div className="flex items-center justify-around max-w-md mx-auto">
        {navItems.map((item) => {
          if (item.isCenter) {
            return (
              <button
                key="center-camera"
                onClick={() => openCamera()}
                className="relative -top-5 w-14 h-14 rounded-full bg-gradient-to-tr from-[#087F5B] via-[#39A96B] to-[#F4C95D] text-white flex items-center justify-center shadow-lg shadow-[#087F5B]/40 hover:scale-105 active:scale-95 transition-transform border-4 border-white dark:border-[#102A24]"
                aria-label="Open VELORA Camera"
                title="VELORA Snap"
              >
                <Camera className="w-6 h-6 stroke-[2.5]" />
              </button>
            );
          }

          const Icon = item.icon!;
          const isActive = currentRoute === item.route;

          return (
            <button
              key={item.route}
              onClick={() => navigate(item.route!)}
              className={`flex flex-col items-center justify-center py-1 px-2 rounded-lg text-xs transition-colors ${
                isActive
                  ? 'text-[#087F5B] dark:text-[#7BC96F] font-bold'
                  : 'text-slate-500 dark:text-emerald-300/70 hover:text-[#087F5B]'
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5]' : 'stroke-2'}`} />
              <span className="text-[10px] mt-0.5">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
