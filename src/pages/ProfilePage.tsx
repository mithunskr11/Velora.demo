import React from 'react';
import { 
  User, 
  Flame, 
  MapPin, 
  Award, 
  ShieldCheck, 
  Calendar, 
  Sparkles, 
  CheckCircle2, 
  Lock,
  Leaf
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const ProfilePage: React.FC = () => {
  const { user, streak, badges, activities, posts, ecoScore, levelInfo } = useApp();

  const userPosts = posts.filter(p => p.userId === user.id);
  const unlockedBadges = badges.filter(b => b.unlocked);

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-300">
      {/* Profile Header Card */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#102A24] border border-emerald-100 dark:border-emerald-900/40 shadow-sm relative overflow-hidden">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 text-center sm:text-left">
          <img
            src={user.avatar}
            alt={user.name}
            className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl object-cover ring-4 ring-emerald-100 dark:ring-emerald-800 shadow-md"
          />

          <div className="space-y-2 flex-1">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h1 className="text-2xl font-extrabold text-[#173B32] dark:text-emerald-50">
                  {user.name}
                </h1>
                <span className="text-xs text-slate-400 font-medium">@{user.username}</span>
              </div>

              <div className="flex items-center justify-center sm:justify-end gap-2">
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#087F5B] text-white">
                  Level {levelInfo.level}
                </span>
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300">
                  🔥 {streak}d Streak
                </span>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-slate-600 dark:text-emerald-200/80 max-w-xl">
              {user.bio}
            </p>

            {/* Social Followers Counters */}
            <div className="flex items-center justify-center sm:justify-start gap-6 pt-2 text-xs">
              <div>
                <span className="font-bold text-sm text-[#173B32] dark:text-emerald-100">{user.followersCount}</span>
                <span className="text-slate-400 ml-1">Followers</span>
              </div>
              <div>
                <span className="font-bold text-sm text-[#173B32] dark:text-emerald-100">{user.followingCount}</span>
                <span className="text-slate-400 ml-1">Following</span>
              </div>
              <div>
                <span className="font-bold text-sm text-[#087F5B] dark:text-[#7BC96F]">{ecoScore}</span>
                <span className="text-slate-400 ml-1">Eco Score</span>
              </div>
            </div>
          </div>
        </div>

        {/* Privacy Protection Notice */}
        <div className="mt-6 pt-4 border-t border-emerald-50 dark:border-emerald-900/40 flex items-center justify-between text-xs text-slate-500 dark:text-emerald-300/70">
          <span className="flex items-center gap-1.5 font-medium">
            <Lock className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            Health metrics (Weight, Height, Body fat) are strictly protected by VELORA Privacy Shield.
          </span>
          <span className="hidden sm:inline font-mono text-[11px] text-slate-400">
            Encrypted Profile
          </span>
        </div>
      </div>

      {/* Badges Showcase */}
      <div className="p-6 rounded-3xl bg-white dark:bg-[#102A24] border border-emerald-100 dark:border-emerald-900/40 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-extrabold text-[#173B32] dark:text-emerald-100 flex items-center gap-2">
            <Award className="w-5 h-5 text-[#F4C95D]" />
            Unlocked Badges ({unlockedBadges.length})
          </h3>
          <span className="text-xs font-semibold text-slate-400">
            {badges.length - unlockedBadges.length} to unlock
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-3">
          {unlockedBadges.map((badge) => (
            <div
              key={badge.id}
              className="p-3.5 rounded-2xl bg-[#F4FAF5] dark:bg-[#173B32] border border-emerald-100 dark:border-emerald-800/40 text-center space-y-1 hover:scale-105 transition-transform"
            >
              <span className="text-3xl block">{badge.icon}</span>
              <h4 className="text-xs font-bold text-[#173B32] dark:text-emerald-100 truncate">
                {badge.name}
              </h4>
              <span className="text-[10px] text-emerald-700 dark:text-emerald-300 block">
                Unlocked
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Activities & Proof Posts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Recent Workouts */}
        <div className="p-6 rounded-3xl bg-white dark:bg-[#102A24] border border-emerald-100 dark:border-emerald-900/40 shadow-sm space-y-4">
          <h3 className="text-base font-extrabold text-[#173B32] dark:text-emerald-100 flex items-center gap-2">
            <MapPin className="w-5 h-5 text-[#4DA3D9]" />
            Recent GPS Activities
          </h3>

          <div className="space-y-3">
            {activities.slice(0, 3).map((act) => (
              <div key={act.id} className="p-3 rounded-2xl bg-[#F4FAF5] dark:bg-[#173B32] flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-[#173B32] dark:text-emerald-100">{act.title}</h4>
                  <span className="text-[11px] text-slate-400 font-mono">
                    {act.distance} km • {Math.floor(act.duration / 60)} min • {act.calories} kcal
                  </span>
                </div>
                <span className="text-xs font-bold text-[#087F5B] dark:text-[#7BC96F]">
                  +{act.xpEarned} XP
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* User's Community Posts */}
        <div className="p-6 rounded-3xl bg-white dark:bg-[#102A24] border border-emerald-100 dark:border-emerald-900/40 shadow-sm space-y-4">
          <h3 className="text-base font-extrabold text-[#173B32] dark:text-emerald-100 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-[#087F5B]" />
            Activity Proof Posts
          </h3>

          <div className="space-y-3">
            {userPosts.slice(0, 3).map((p) => (
              <div key={p.id} className="p-3 rounded-2xl bg-[#F4FAF5] dark:bg-[#173B32] space-y-1">
                <p className="text-xs font-medium text-slate-700 dark:text-emerald-200 line-clamp-2">
                  "{p.caption}"
                </p>
                <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1">
                  <span>{p.timestamp}</span>
                  <span>❤️ {p.likes} likes • {p.comments.length} comments</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
