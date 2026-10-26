import React from 'react';
import { 
  Home, 
  CheckSquare, 
  MapPin, 
  Users, 
  Bot, 
  Leaf, 
  TrendingUp, 
  Award, 
  CalendarClock, 
  User as UserIcon, 
  Settings, 
  HelpCircle, 
  LogOut,
  Flame,
  Sparkles,
  Camera,
  MessageSquare
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const Sidebar: React.FC = () => {
  const { 
    currentRoute, 
    navigate, 
    streak, 
    levelInfo, 
    ecoScore, 
    logout,
    openCamera,
    inboxUnreadCount,
    user
  } = useApp();

  const navItems = [
    { label: 'Home', route: '/home', icon: Home },
    { label: 'Habits', route: '/habits', icon: CheckSquare },
    { 
      label: 'Inbox & Snaps', 
      route: '/inbox', 
      icon: MessageSquare, 
      badge: inboxUnreadCount > 0 ? `${inboxUnreadCount}` : undefined,
      badgeColor: 'bg-rose-500 text-white' 
    },
    { label: 'GPS Map', route: '/map', icon: MapPin },
    { label: 'AI Coach', route: '/coach', icon: Bot, badge: 'AI' },
    { label: 'Recommendations', route: '/recommendations', icon: Sparkles },
    { label: 'Community', route: '/community', icon: Users },
    { label: 'Eco Impact', route: '/eco', icon: Leaf },
    { label: 'Progress', route: '/progress', icon: TrendingUp },
    { label: 'Rewards & Badges', route: '/rewards', icon: Award },
    { label: 'Monthly Review', route: '/monthly-update', icon: CalendarClock },
    { label: 'Profile', route: `/profile/${user?.username || 'alex_rivera'}`, icon: UserIcon },
  ];

  return (
    <aside className="hidden lg:flex flex-col w-64 bg-white dark:bg-[#102A24] border-r border-emerald-100 dark:border-emerald-950/40 h-screen sticky top-0 px-4 py-5 z-30 select-none">
      {/* Brand Identity */}
      <div 
        onClick={() => navigate('/home')} 
        className="flex items-center gap-3 px-3 py-2 cursor-pointer group"
      >
        <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#087F5B] to-[#39A96B] flex items-center justify-center text-white shadow-md shadow-[#087F5B]/20 group-hover:scale-105 transition-transform">
          <Leaf className="w-6 h-6 text-white" />
        </div>
        <div>
          <span className="text-xl font-extrabold tracking-tight text-[#087F5B] dark:text-[#7BC96F] block leading-none">
            VELORA
          </span>
          <span className="text-[10px] text-emerald-700/70 dark:text-emerald-300/60 font-medium tracking-wide">
            Habits • Mind • Impact
          </span>
        </div>
      </div>

      {/* Mini Status Widget */}
      <div className="mt-4 mx-1 p-3 rounded-xl bg-[#F4FAF5] dark:bg-[#173B32] border border-emerald-100/70 dark:border-emerald-800/40">
        <div className="flex items-center justify-between text-xs font-semibold mb-2">
          <span className="flex items-center gap-1 text-[#F4A261] dark:text-[#F4C95D]">
            <Flame className="w-3.5 h-3.5 fill-current" /> {streak} Day Streak
          </span>
          <span className="text-emerald-700 dark:text-emerald-300 flex items-center gap-1 font-bold">
            <Leaf className="w-3.5 h-3.5 text-[#39A96B]" /> {ecoScore} Eco
          </span>
        </div>
        <div className="w-full bg-emerald-100 dark:bg-emerald-950/60 rounded-full h-1.5 overflow-hidden">
          <div 
            className="bg-gradient-to-r from-[#087F5B] to-[#F4C95D] h-1.5 rounded-full transition-all duration-500" 
            style={{ width: `${levelInfo.progressPercentage}%` }}
          />
        </div>
        <div className="flex justify-between items-center mt-1 text-[10px] text-emerald-800/70 dark:text-emerald-300/70 font-medium">
          <span>Level {levelInfo.level}</span>
          <span>{levelInfo.currentXp} XP</span>
        </div>
      </div>

      {/* Desktop VELORA Snap Button */}
      <button
        onClick={() => openCamera()}
        className="mt-3 w-full py-2.5 px-3 rounded-2xl bg-gradient-to-r from-[#087F5B] via-[#39A96B] to-[#7BC96F] hover:brightness-110 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md shadow-[#087F5B]/25 hover:scale-[1.02] active:scale-[0.98] transition-all"
        title="Open Fullscreen Camera"
      >
        <Camera className="w-4 h-4" />
        <span>Take VELORA Snap</span>
      </button>

      {/* Navigation Links */}
      <nav className="mt-3 flex-1 space-y-1 overflow-y-auto pr-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentRoute === item.route;
          return (
            <button
              key={item.route}
              onClick={() => navigate(item.route)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium text-sm transition-all text-left ${
                isActive
                  ? 'bg-[#087F5B] text-white shadow-sm shadow-[#087F5B]/25 font-semibold'
                  : 'text-[#173B32]/80 dark:text-emerald-100/80 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 hover:text-[#087F5B] dark:hover:text-[#7BC96F]'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-emerald-600 dark:text-emerald-400'}`} />
              <span className="flex-1 truncate">{item.label}</span>
              {item.badge && (
                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                  item.badgeColor 
                    ? item.badgeColor 
                    : isActive 
                    ? 'bg-white/20 text-white' 
                    : 'bg-emerald-100 dark:bg-emerald-800 text-[#087F5B] dark:text-emerald-200'
                }`}>
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Footer Utility Items */}
      <div className="pt-3 border-t border-emerald-100 dark:border-emerald-950/60 space-y-0.5">
        <button
          onClick={() => navigate('/settings')}
          className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium text-slate-600 dark:text-emerald-300 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 ${
            currentRoute === '/settings' ? 'text-[#087F5B] font-bold' : ''
          }`}
        >
          <Settings className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          <span>Settings & Privacy</span>
        </button>

        <button
          onClick={() => navigate('/')}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium text-slate-600 dark:text-emerald-300 hover:bg-emerald-50 dark:hover:bg-emerald-900/20"
        >
          <HelpCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          <span>Product Overview</span>
        </button>

        <button
          onClick={logout}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/20 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
};
