import React from 'react';
import { Plus, Sparkles, Camera } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Story } from '../../types';

export const StoriesBar: React.FC = () => {
  const { 
    user, 
    stories, 
    openStoryViewer, 
    openCamera 
  } = useApp();

  // Find user's own active stories
  const userStories = stories.filter((s) => s.userId === user.id);
  const hasUserStory = userStories.length > 0;

  // Filter friends' stories (deduplicating by user or showing unique friend story items)
  const friendStories = stories.filter((s) => s.userId !== user.id);

  // Group or pick unique recent story per friend for the bar
  const uniqueFriendStories: Story[] = [];
  const seenUserIds = new Set<string>();

  for (const st of friendStories) {
    if (!seenUserIds.has(st.userId)) {
      seenUserIds.add(st.userId);
      uniqueFriendStories.push(st);
    }
  }

  return (
    <div className="w-full mb-6">
      <div className="flex items-center justify-between mb-2.5 px-1">
        <div className="flex items-center gap-2">
          <span className="text-xs font-extrabold uppercase tracking-wider text-emerald-800 dark:text-emerald-300 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-[#F4C95D]" />
            VELORA Stories
          </span>
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-[#087F5B] dark:text-[#7BC96F] font-bold">
            24h Snaps
          </span>
        </div>

        <button
          onClick={() => openCamera()}
          className="text-[11px] font-bold text-[#087F5B] dark:text-[#7BC96F] hover:underline flex items-center gap-1"
        >
          <Camera className="w-3 h-3" />
          + Add Snap
        </button>
      </div>

      {/* Horizontal Scroll Area */}
      <div className="flex items-center gap-3.5 overflow-x-auto pb-2 pt-1 px-1 scrollbar-none select-none">
        {/* Current User Story bubble */}
        <div className="flex flex-col items-center gap-1.5 flex-shrink-0">
          <div className="relative group">
            <button
              onClick={() => {
                if (hasUserStory) {
                  openStoryViewer(userStories[0].id);
                } else {
                  openCamera();
                }
              }}
              className={`w-16 h-16 rounded-full p-[2.5px] transition-transform duration-200 group-hover:scale-105 active:scale-95 flex items-center justify-center ${
                hasUserStory
                  ? 'bg-gradient-to-tr from-[#087F5B] via-[#39A96B] to-[#F4C95D] shadow-md shadow-[#087F5B]/20'
                  : 'bg-emerald-200 dark:bg-emerald-900/60'
              }`}
            >
              <img
                src={user.avatar}
                alt={user.name}
                className="w-full h-full rounded-full object-cover border-2 border-white dark:border-[#102A24]"
              />
            </button>

            {/* Plus badge or indicator */}
            {!hasUserStory ? (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  openCamera();
                }}
                className="absolute bottom-0 right-0 w-5 h-5 rounded-full bg-[#087F5B] text-white flex items-center justify-center border-2 border-white dark:border-[#102A24] shadow-sm hover:scale-110 active:scale-90 transition-transform"
                title="Create a Story"
              >
                <Plus className="w-3 h-3 stroke-[3]" />
              </button>
            ) : (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  openCamera();
                }}
                className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-[#087F5B] text-white flex items-center justify-center border-2 border-white dark:border-[#102A24] shadow-sm hover:scale-110 active:scale-90 transition-transform"
                title="Add another snap"
              >
                <Plus className="w-3 h-3 stroke-[3]" />
              </button>
            )}
          </div>
          <span className="text-[11px] font-medium text-slate-700 dark:text-emerald-200/90 max-w-[68px] truncate text-center">
            {hasUserStory ? 'Your Story' : 'Add Story'}
          </span>
        </div>

        {/* Friends Stories */}
        {uniqueFriendStories.map((story) => {
          const isSeen = Boolean(story.hasViewed || story.isViewed);
          const firstName = story.userName.split(' ')[0];

          return (
            <div key={story.id} className="flex flex-col items-center gap-1.5 flex-shrink-0">
              <button
                onClick={() => openStoryViewer(story.id)}
                className={`w-16 h-16 rounded-full p-[2.5px] transition-transform duration-200 hover:scale-105 active:scale-95 flex items-center justify-center ${
                  isSeen
                    ? 'bg-slate-300 dark:bg-emerald-950/80 border border-slate-200 dark:border-emerald-800'
                    : 'bg-gradient-to-tr from-[#087F5B] via-[#39A96B] to-[#F4C95D] shadow-md shadow-[#087F5B]/30'
                }`}
              >
                <img
                  src={story.userAvatar}
                  alt={story.userName}
                  className="w-full h-full rounded-full object-cover border-2 border-white dark:border-[#102A24]"
                />
              </button>
              <span className="text-[11px] font-medium text-slate-700 dark:text-emerald-200/90 max-w-[68px] truncate text-center">
                {firstName}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
