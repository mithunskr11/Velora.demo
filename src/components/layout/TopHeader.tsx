import React, { useState } from 'react';
import { 
  Search, 
  Bell, 
  Moon, 
  Sun, 
  Flame, 
  Leaf, 
  Plus, 
  Sparkles, 
  Check, 
  X,
  ExternalLink,
  Camera,
  MessageSquare
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface TopHeaderProps {
  onOpenSearch: () => void;
}

export const TopHeader: React.FC<TopHeaderProps> = ({ onOpenSearch }) => {
  const { 
    user, 
    streak, 
    ecoScore, 
    levelInfo, 
    theme, 
    toggleTheme, 
    notifications, 
    unreadNotificationsCount, 
    markNotificationRead, 
    markAllNotificationsRead,
    navigate,
    setQuickActionOpen,
    openCamera,
    inboxUnreadCount
  } = useApp();

  const [notifOpen, setNotifOpen] = useState(false);

  return (
    <header className="sticky top-0 z-20 bg-white/90 dark:bg-[#102A24]/90 backdrop-blur-md border-b border-emerald-100 dark:border-emerald-950/40 px-4 lg:px-8 py-3 transition-colors">
      <div className="flex items-center justify-between gap-4 max-w-7xl mx-auto">
        {/* Left: Search Trigger */}
        <div className="flex items-center gap-3 flex-1 max-w-md">
          <button
            onClick={onOpenSearch}
            className="w-full flex items-center gap-2.5 px-3.5 py-2 rounded-xl bg-[#F4FAF5] dark:bg-[#173B32] border border-emerald-200/60 dark:border-emerald-800/40 text-slate-500 dark:text-emerald-200/70 text-xs sm:text-sm hover:border-[#39A96B] transition-colors text-left group"
          >
            <Search className="w-4 h-4 text-emerald-600 dark:text-emerald-400 group-hover:scale-110 transition-transform" />
            <span className="flex-1 truncate">Search habits, activities, friends, challenges...</span>
            <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] bg-white dark:bg-emerald-950/70 border border-emerald-200 dark:border-emerald-800 rounded text-emerald-800 dark:text-emerald-300 font-mono">
              ⌘K
            </kbd>
          </button>
        </div>

        {/* Right: Quick Stats, Actions & Notification Center */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Quick Streak Pill */}
          <div 
            onClick={() => navigate('/rewards')}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/50 text-[#F4A261] dark:text-[#F4C95D] text-xs font-bold cursor-pointer hover:scale-105 transition-transform"
            title="7-Day Streak Active!"
          >
            <Flame className="w-3.5 h-3.5 fill-current" />
            <span>{streak}d</span>
          </div>

          {/* Eco Score Pill */}
          <div 
            onClick={() => navigate('/eco')}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/50 text-[#087F5B] dark:text-[#7BC96F] text-xs font-bold cursor-pointer hover:scale-105 transition-transform"
            title="Your Eco Score"
          >
            <Leaf className="w-3.5 h-3.5 fill-current text-[#39A96B]" />
            <span>{ecoScore}</span>
          </div>

          {/* Desktop Quick Add Button */}
          <button
            onClick={() => setQuickActionOpen(true)}
            className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#087F5B] hover:bg-[#076a4c] text-white text-xs font-semibold shadow-sm shadow-[#087F5B]/30 hover:scale-105 active:scale-95 transition-all"
          >
            <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>Quick Action</span>
          </button>

          {/* Camera Quick Button */}
          <button
            onClick={() => openCamera()}
            className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl bg-gradient-to-r from-[#087F5B] to-[#39A96B] text-white text-xs font-bold shadow-sm shadow-[#087F5B]/20 hover:scale-105 active:scale-95 transition-transform"
            title="Open VELORA Snap Camera"
          >
            <Camera className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Snap</span>
          </button>

          {/* Inbox / Messages Icon */}
          <button
            onClick={() => navigate('/inbox')}
            className="relative p-2 rounded-xl text-slate-600 dark:text-emerald-300 hover:bg-emerald-50 dark:hover:bg-emerald-900/30 transition-colors"
            title="Inbox & Snaps"
            aria-label="Inbox"
          >
            <MessageSquare className="w-4 h-4" />
            {inboxUnreadCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 min-w-[16px] h-4 px-1 rounded-full bg-rose-500 text-white text-[9px] font-extrabold flex items-center justify-center">
                {inboxUnreadCount}
              </span>
            )}
          </button>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-xl text-slate-600 dark:text-emerald-300 hover:bg-emerald-50 dark:hover:bg-emerald-900/30 transition-colors"
            aria-label="Toggle Theme"
          >
            {theme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4 text-amber-300" />}
          </button>

          {/* Notification Bell with Dropdown */}
          <div className="relative">
            <button
              onClick={() => setNotifOpen(!notifOpen)}
              className="relative p-2 rounded-xl text-slate-600 dark:text-emerald-300 hover:bg-emerald-50 dark:hover:bg-emerald-900/30 transition-colors"
              aria-label="Notifications"
            >
              <Bell className="w-4 h-4" />
              {unreadNotificationsCount > 0 && (
                <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
              )}
            </button>

            {/* Notification Drawer */}
            {notifOpen && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white dark:bg-[#102A24] rounded-2xl shadow-2xl border border-emerald-100 dark:border-emerald-900/60 py-3 z-50 animate-in fade-in duration-200">
                <div className="flex items-center justify-between px-4 pb-2 border-b border-emerald-100 dark:border-emerald-900/40">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-[#173B32] dark:text-emerald-100">Notifications</span>
                    {unreadNotificationsCount > 0 && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#087F5B] text-white">
                        {unreadNotificationsCount} new
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    {unreadNotificationsCount > 0 && (
                      <button
                        onClick={markAllNotificationsRead}
                        className="text-[11px] text-[#087F5B] dark:text-[#7BC96F] hover:underline font-semibold"
                      >
                        Mark all read
                      </button>
                    )}
                    <button 
                      onClick={() => setNotifOpen(false)}
                      className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="max-h-80 overflow-y-auto px-2 py-2 space-y-1 divide-y divide-emerald-50 dark:divide-emerald-950/40">
                  {notifications.slice(0, 8).map((notif) => (
                    <div
                      key={notif.id}
                      onClick={() => {
                        markNotificationRead(notif.id);
                        if (notif.linkRoute) {
                          setNotifOpen(false);
                          navigate(notif.linkRoute);
                        }
                      }}
                      className={`p-2.5 rounded-xl cursor-pointer transition-colors ${
                        notif.read
                          ? 'opacity-70 hover:bg-emerald-50/50 dark:hover:bg-emerald-900/20'
                          : 'bg-[#F4FAF5] dark:bg-[#173B32] hover:bg-emerald-50 dark:hover:bg-emerald-900/30'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <p className="text-xs font-bold text-[#173B32] dark:text-emerald-100">{notif.title}</p>
                        <span className="text-[10px] text-slate-400 whitespace-nowrap">{notif.timestamp}</span>
                      </div>
                      <p className="text-[11px] text-slate-600 dark:text-emerald-200/70 mt-0.5 leading-relaxed">
                        {notif.message}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="pt-2 px-4 border-t border-emerald-100 dark:border-emerald-900/40 text-center">
                  <button
                    onClick={() => {
                      setNotifOpen(false);
                      navigate('/progress');
                    }}
                    className="text-xs text-[#087F5B] dark:text-[#7BC96F] font-semibold hover:underline"
                  >
                    View Lifestyle Insights
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* User Avatar */}
          <div 
            onClick={() => navigate('/profile/alex_rivera')}
            className="flex items-center gap-2 pl-2 cursor-pointer group"
          >
            <img
              src={user.avatar}
              alt={user.name}
              className="w-8 h-8 rounded-full object-cover ring-2 ring-[#087F5B]/30 group-hover:ring-[#087F5B] transition-all"
            />
            <div className="hidden xl:block text-left">
              <span className="text-xs font-bold text-[#173B32] dark:text-emerald-100 block leading-tight">
                {user.name.split(' ')[0]}
              </span>
              <span className="text-[10px] text-emerald-700 dark:text-emerald-400 font-medium">
                Lvl {levelInfo.level}
              </span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
