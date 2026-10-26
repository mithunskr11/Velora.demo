import React, { useState, useEffect, useRef } from 'react';
import { 
  X, 
  Trash2, 
  Eye, 
  ChevronLeft, 
  ChevronRight, 
  Send, 
  Smile, 
  MapPin, 
  Sparkles, 
  Share2, 
  ShieldCheck,
  Activity as ActivityIcon
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Story } from '../../types';
import { PHOTO_FILTERS } from '../../services/snap';

const STORY_DURATION_MS = 5000;

export const StoryViewerModal: React.FC = () => {
  const { 
    activeStory, 
    stories, 
    closeStoryViewer, 
    openStoryViewer, 
    deleteStory, 
    user,
    sendMessage,
    navigate
  } = useApp();

  const [progress, setProgress] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [showViewersDrawer, setShowViewersDrawer] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [replySentMessage, setReplySentMessage] = useState(false);

  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);

  if (!activeStory) return null;

  const isCurrentUserStory = activeStory.userId === user.id;
  const currentFilter = PHOTO_FILTERS.find((f) => f.id === activeStory.filter) || PHOTO_FILTERS[0];

  // Current story index among active stories
  const currentIndex = stories.findIndex((s) => s.id === activeStory.id);

  // Auto-progress timer
  useEffect(() => {
    setProgress(0);
    setReplySentMessage(false);
    setShowViewersDrawer(false);

    if (isPaused) return;

    const tickInterval = 50;
    const increment = (tickInterval / STORY_DURATION_MS) * 100;

    progressIntervalRef.current = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressIntervalRef.current!);
          handleNext();
          return 100;
        }
        return prev + increment;
      });
    }, tickInterval);

    return () => {
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
      }
    };
  }, [activeStory.id, isPaused]);

  const handleNext = () => {
    if (currentIndex < stories.length - 1) {
      openStoryViewer(stories[currentIndex + 1].id);
    } else {
      closeStoryViewer();
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      openStoryViewer(stories[currentIndex - 1].id);
    } else {
      // Re-start current story from 0
      setProgress(0);
    }
  };

  const handleDelete = () => {
    deleteStory(activeStory.id);
  };

  const handleSendReply = () => {
    if (!replyText.trim()) return;
    sendMessage(
      `conv-${activeStory.userId}`,
      `Replied to story: "${replyText.trim()}"`
    );
    setReplyText('');
    setReplySentMessage(true);
    setTimeout(() => {
      setReplySentMessage(false);
    }, 2500);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center select-none overflow-hidden animate-in fade-in duration-200">
      {/* Container simulating a mobile story frame */}
      <div 
        className="relative w-full max-w-md h-full sm:h-[94vh] sm:rounded-3xl overflow-hidden bg-[#0A1F1A] border sm:border-emerald-950/60 flex flex-col justify-between shadow-2xl"
        onMouseDown={() => setIsPaused(true)}
        onMouseUp={() => setIsPaused(false)}
        onTouchStart={() => setIsPaused(true)}
        onTouchEnd={() => setIsPaused(false)}
      >
        {/* Progress Bar Segments */}
        <div className="absolute top-3 left-3 right-3 z-30 flex items-center gap-1.5">
          {stories.map((st, i) => {
            let segProgress = 0;
            if (i < currentIndex) segProgress = 100;
            else if (i === currentIndex) segProgress = progress;

            return (
              <div
                key={st.id}
                className="flex-1 h-1 bg-white/30 rounded-full overflow-hidden backdrop-blur-sm"
              >
                <div
                  className="h-full bg-white transition-all duration-75"
                  style={{ width: `${segProgress}%` }}
                />
              </div>
            );
          })}
        </div>

        {/* Top Header Controls */}
        <div className="relative z-30 pt-6 px-4 pb-2 flex items-center justify-between bg-gradient-to-b from-black/80 via-black/30 to-transparent">
          {/* User info */}
          <div className="flex items-center gap-2.5">
            <img
              src={activeStory.userAvatar}
              alt={activeStory.userName}
              className="w-9 h-9 rounded-full object-cover border-2 border-emerald-400"
            />
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-extrabold text-white leading-tight">
                  {activeStory.userName}
                </span>
                <span className="text-[10px] text-white/60">
                  {activeStory.timeAgo || 'Just now'}
                </span>
              </div>
              <span className="text-[10px] text-emerald-300 font-medium capitalize">
                Audience: {activeStory.audience}
              </span>
            </div>
          </div>

          {/* Right Header Buttons */}
          <div className="flex items-center gap-2">
            {isCurrentUserStory && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleDelete();
                }}
                className="p-2 rounded-full bg-white/10 hover:bg-rose-500/80 text-white/90 hover:text-white transition-colors"
                title="Delete this Story"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}

            <button
              onClick={(e) => {
                e.stopPropagation();
                closeStoryViewer();
              }}
              className="p-2 rounded-full bg-white/20 hover:bg-white/30 text-white transition-colors"
            >
              <X className="w-4 h-4 stroke-[2.5]" />
            </button>
          </div>
        </div>

        {/* Story Photo & Overlays Content */}
        <div className="relative flex-1 flex items-center justify-center overflow-hidden">
          {/* Main Photo with applied filter */}
          <img
            src={activeStory.photoUrl || activeStory.mediaPath}
            alt="Story"
            className="w-full h-full object-cover select-none"
            style={{
              filter: currentFilter.cssFilter || currentFilter.css || 'none',
            }}
          />

          {/* Attached Activity Card */}
          {activeStory.attachedActivity && (
            <div className="absolute top-16 left-4 right-4 z-20 pointer-events-none">
              <div className="bg-[#173B32]/90 backdrop-blur-md border border-[#39A96B]/50 rounded-2xl p-2.5 shadow-xl">
                <div className="flex items-center justify-between text-xs font-bold text-white mb-1">
                  <span className="flex items-center gap-1.5 text-emerald-300">
                    <ActivityIcon className="w-3.5 h-3.5 text-[#39A96B]" />
                    {activeStory.attachedActivity.title}
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-[#7BC96F] border border-emerald-500/30">
                    GPS Workout
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-2 text-center pt-1 border-t border-emerald-800/50">
                  <div>
                    <span className="block text-[9px] text-emerald-300/70 uppercase">Distance</span>
                    <span className="text-xs font-extrabold text-white">
                      {activeStory.attachedActivity.distance} km
                    </span>
                  </div>
                  <div>
                    <span className="block text-[9px] text-emerald-300/70 uppercase">Pace</span>
                    <span className="text-xs font-extrabold text-white">
                      {activeStory.attachedActivity.avgPace || activeStory.attachedActivity.pace || '5:10 /km'}
                    </span>
                  </div>
                  <div>
                    <span className="block text-[9px] text-emerald-300/70 uppercase">Eco Score</span>
                    <span className="text-xs font-extrabold text-[#7BC96F]">
                      +{activeStory.attachedActivity.ecoScore || 15}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Text banner overlay */}
          {activeStory.textOverlay && (
            <div className="absolute top-36 left-4 right-4 z-20 pointer-events-none text-center">
              <span className="inline-block bg-black/70 backdrop-blur-md px-4 py-1.5 rounded-2xl text-white font-extrabold text-sm border border-white/20 shadow-lg">
                {activeStory.textOverlay}
              </span>
            </div>
          )}

          {/* Stickers */}
          {activeStory.stickers && activeStory.stickers.length > 0 && (
            <div className="absolute bottom-24 left-4 right-4 z-20 flex flex-wrap gap-2 pointer-events-none">
              {activeStory.stickers.map((stk) => (
                <div
                  key={stk.id}
                  className="px-3 py-1.5 rounded-xl bg-white/95 text-slate-900 font-extrabold text-xs shadow-xl border border-white flex items-center gap-1.5"
                >
                  <span className="text-base leading-none">{stk.emoji || stk.icon}</span>
                  <span>{stk.label}</span>
                </div>
              ))}
            </div>
          )}

          {/* Caption */}
          {activeStory.caption && (
            <div className="absolute bottom-16 left-4 right-4 z-20 pointer-events-none">
              <div className="bg-black/60 backdrop-blur-md rounded-xl px-3.5 py-2 text-xs text-white/95 font-medium border border-white/10">
                {activeStory.caption}
              </div>
            </div>
          )}

          {/* Tap Zones: Left (prev) & Right (next) */}
          <div
            onClick={(e) => {
              e.stopPropagation();
              handlePrev();
            }}
            className="absolute top-0 bottom-0 left-0 w-1/3 z-10 cursor-pointer"
            aria-label="Previous story"
          />
          <div
            onClick={(e) => {
              e.stopPropagation();
              handleNext();
            }}
            className="absolute top-0 bottom-0 right-0 w-2/3 z-10 cursor-pointer"
            aria-label="Next story"
          />
        </div>

        {/* Bottom Interactive Area */}
        <div className="relative z-30 p-3 bg-gradient-to-t from-black/90 via-black/60 to-transparent">
          {/* Current User Viewers bar */}
          {isCurrentUserStory ? (
            <div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowViewersDrawer(!showViewersDrawer);
                }}
                className="w-full py-2 px-3 rounded-xl bg-white/15 hover:bg-white/25 text-white text-xs font-bold flex items-center justify-center gap-2 backdrop-blur-md transition-colors"
              >
                <Eye className="w-4 h-4 text-emerald-300" />
                <span>Seen by {activeStory.viewers?.length || 0} friends</span>
              </button>

              {/* Viewers Drawer */}
              {showViewersDrawer && (
                <div 
                  onClick={(e) => e.stopPropagation()}
                  className="mt-2 p-3 rounded-2xl bg-[#173B32]/95 border border-emerald-800/80 backdrop-blur-md text-white max-h-40 overflow-y-auto"
                >
                  <div className="text-[11px] font-bold text-emerald-300 uppercase tracking-wider mb-2">
                    Story Viewers
                  </div>
                  {(!activeStory.viewers || activeStory.viewers.length === 0) ? (
                    <p className="text-xs text-emerald-300/60">No views yet. Share with friends!</p>
                  ) : (
                    <div className="space-y-2">
                      {activeStory.viewers.map((viewer) => (
                        <div key={viewer.userId} className="flex items-center justify-between text-xs">
                          <div className="flex items-center gap-2">
                            <img
                              src={viewer.userAvatar}
                              alt={viewer.userName}
                              className="w-6 h-6 rounded-full object-cover"
                            />
                            <span className="font-semibold">{viewer.userName}</span>
                          </div>
                          <span className="text-[10px] text-emerald-300/70">{viewer.viewedAt}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          ) : (
            /* Friend's Story Reply Input */
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleSendReply();
                }}
                placeholder={`Send a reply to ${activeStory.userName.split(' ')[0]}...`}
                className="flex-1 px-3.5 py-2 text-xs rounded-full bg-white/15 border border-white/20 text-white placeholder-white/60 backdrop-blur-md focus:outline-none focus:border-emerald-400"
              />
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleSendReply();
                }}
                disabled={!replyText.trim()}
                className={`p-2.5 rounded-full transition-transform active:scale-90 ${
                  replyText.trim()
                    ? 'bg-[#087F5B] text-white hover:brightness-110 shadow-md'
                    : 'bg-white/10 text-white/40 cursor-not-allowed'
                }`}
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {replySentMessage && (
            <div className="text-center text-[11px] font-bold text-[#7BC96F] mt-1.5 animate-in fade-in">
              Reply delivered to chat!
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
