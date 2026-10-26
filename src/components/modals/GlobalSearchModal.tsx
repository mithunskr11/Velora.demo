import React, { useState, useMemo } from 'react';
import { Search, X, CheckSquare, MapPin, Users, Award, Leaf, ArrowRight } from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GlobalSearchModal: React.FC<GlobalSearchModalProps> = ({ isOpen, onClose }) => {
  const { habits, activities, communityUsers, ecoChallenges, navigate } = useApp();
  const [query, setQuery] = useState('');

  const searchResults = useMemo(() => {
    if (!query.trim()) return null;
    const q = query.toLowerCase();

    const matchedHabits = habits.filter(h => 
      h.name.toLowerCase().includes(q) || h.category.toLowerCase().includes(q)
    );
    const matchedActivities = activities.filter(a => 
      a.title.toLowerCase().includes(q) || a.type.toLowerCase().includes(q)
    );
    const matchedUsers = communityUsers.filter(u => 
      u.name.toLowerCase().includes(q) || 
      u.username.toLowerCase().includes(q) ||
      u.goals.some(g => g.toLowerCase().includes(q))
    );
    const matchedChallenges = ecoChallenges.filter(c => 
      c.title.toLowerCase().includes(q) || c.description.toLowerCase().includes(q)
    );

    return {
      habits: matchedHabits,
      activities: matchedActivities,
      users: matchedUsers,
      challenges: matchedChallenges
    };
  }, [query, habits, activities, communityUsers, ecoChallenges]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="w-full max-w-2xl bg-white dark:bg-[#102A24] rounded-3xl shadow-2xl border border-emerald-100 dark:border-emerald-900/50 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="flex items-center gap-3 px-5 py-4 border-b border-emerald-100 dark:border-emerald-900/40">
          <Search className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search habits, users, activities, challenges, goals..."
            className="flex-1 bg-transparent text-sm sm:text-base text-[#173B32] dark:text-emerald-100 focus:outline-none placeholder-slate-400"
            autoFocus
          />
          <button
            onClick={onClose}
            className="p-1 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-emerald-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Results Container */}
        <div className="p-4 max-h-[60vh] overflow-y-auto space-y-4">
          {!query.trim() && (
            <div className="py-8 text-center text-slate-400 dark:text-emerald-300/60">
              <p className="text-xs">Type anything to explore VELORA — e.g. "walk", "priya", "plastic", "fitness"</p>
            </div>
          )}

          {searchResults && (
            <>
              {/* Habits */}
              {searchResults.habits.length > 0 && (
                <div>
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <CheckSquare className="w-3.5 h-3.5 text-emerald-600" />
                    Habits ({searchResults.habits.length})
                  </h4>
                  <div className="space-y-1">
                    {searchResults.habits.map((h) => (
                      <div
                        key={h.id}
                        onClick={() => {
                          onClose();
                          navigate('/habits');
                        }}
                        className="flex items-center justify-between p-2.5 rounded-xl hover:bg-[#F4FAF5] dark:hover:bg-[#173B32] cursor-pointer transition-colors"
                      >
                        <div>
                          <p className="text-sm font-semibold text-[#173B32] dark:text-emerald-100">{h.name}</p>
                          <span className="text-[11px] text-emerald-600 dark:text-emerald-400">{h.category} • Streak: {h.streak}d</span>
                        </div>
                        <ArrowRight className="w-4 h-4 text-slate-400" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Users */}
              {searchResults.users.length > 0 && (
                <div>
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-sky-600" />
                    Community Members ({searchResults.users.length})
                  </h4>
                  <div className="space-y-1">
                    {searchResults.users.map((u) => (
                      <div
                        key={u.id}
                        onClick={() => {
                          onClose();
                          navigate(`/profile/${u.username}`);
                        }}
                        className="flex items-center justify-between p-2.5 rounded-xl hover:bg-[#F4FAF5] dark:hover:bg-[#173B32] cursor-pointer transition-colors"
                      >
                        <div className="flex items-center gap-2.5">
                          <img src={u.avatar} alt={u.name} className="w-8 h-8 rounded-full object-cover" />
                          <div>
                            <p className="text-sm font-semibold text-[#173B32] dark:text-emerald-100">{u.name}</p>
                            <span className="text-[11px] text-slate-500 dark:text-emerald-300">@{u.username} • Goals: {u.goals.join(', ')}</span>
                          </div>
                        </div>
                        <ArrowRight className="w-4 h-4 text-slate-400" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Challenges */}
              {searchResults.challenges.length > 0 && (
                <div>
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <Leaf className="w-3.5 h-3.5 text-emerald-600" />
                    Eco Challenges ({searchResults.challenges.length})
                  </h4>
                  <div className="space-y-1">
                    {searchResults.challenges.map((c) => (
                      <div
                        key={c.id}
                        onClick={() => {
                          onClose();
                          navigate('/eco');
                        }}
                        className="flex items-center justify-between p-2.5 rounded-xl hover:bg-[#F4FAF5] dark:hover:bg-[#173B32] cursor-pointer transition-colors"
                      >
                        <div>
                          <p className="text-sm font-semibold text-[#173B32] dark:text-emerald-100">{c.title}</p>
                          <span className="text-[11px] text-emerald-600 dark:text-emerald-400">+{c.points} Eco Points • {c.description}</span>
                        </div>
                        <ArrowRight className="w-4 h-4 text-slate-400" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {searchResults.habits.length === 0 && searchResults.users.length === 0 && searchResults.challenges.length === 0 && (
                <div className="py-6 text-center text-slate-500 text-xs">
                  No direct matches for "{query}". Try checking community discovery or habit catalog.
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};
