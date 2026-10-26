import React, { useState } from 'react';
import { X, Image, MapPin, Sparkles, Send, Lock, Globe } from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface CreatePostModalProps {
  isOpen: boolean;
  onClose: () => void;
  presetActivity?: any;
}

export const CreatePostModal: React.FC<CreatePostModalProps> = ({
  isOpen,
  onClose,
  presetActivity
}) => {
  const { createCommunityPost, activities, recentBadge, activeProofActivity } = useApp();

  const activityToUse = presetActivity || activeProofActivity || activities[0];

  const [caption, setCaption] = useState('');
  const [selectedActivityId, setSelectedActivityId] = useState<string>('');
  const [selectedPhoto, setSelectedPhoto] = useState<string>(
    'https://images.unsplash.com/photo-1502082553048-f009c37129b9?auto=format&fit=crop&w=800&q=80'
  );
  const [visibility, setVisibility] = useState<'public' | 'private'>('public');

  // Sync state whenever modal opens
  React.useEffect(() => {
    if (isOpen) {
      if (activityToUse) {
        setSelectedActivityId(activityToUse.id);
        setCaption(`${activityToUse.type} completed! (${activityToUse.distance} km in ${Math.floor(activityToUse.duration / 60)} min). Felt energized and grounded 🌿`);
      } else {
        setCaption('Daily movement routine checked off! Building consistent steps every day 🌱');
      }
    }
  }, [isOpen, activityToUse]);

  if (!isOpen) return null;

  const currentActivity = activities.find(a => a.id === selectedActivityId);

  const samplePhotos = [
    'https://images.unsplash.com/photo-1502082553048-f009c37129b9?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1452626038306-9aae5e071dd3?auto=format&fit=crop&w=800&q=80'
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!caption.trim()) return;

    const activityData = currentActivity ? {
      type: currentActivity.type,
      distance: currentActivity.distance,
      duration: currentActivity.duration,
      calories: currentActivity.calories,
      elevation: currentActivity.elevation
    } : undefined;

    createCommunityPost(
      caption.trim(),
      activityData,
      selectedPhoto ? [selectedPhoto] : undefined,
      recentBadge ? recentBadge.name : undefined
    );

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="w-full max-w-lg bg-white dark:bg-[#102A24] rounded-3xl p-6 sm:p-7 shadow-2xl border border-emerald-100 dark:border-emerald-900/50 relative max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between pb-4 border-b border-emerald-100 dark:border-emerald-900/40">
          <div>
            <h3 className="text-xl font-extrabold text-[#173B32] dark:text-emerald-100 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-[#39A96B]" />
              Share Activity Proof
            </h3>
            <p className="text-xs text-slate-500 dark:text-emerald-300/70">
              Celebrate your movement with the VELORA community (+10 Community XP).
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-emerald-200 hover:bg-emerald-50 dark:hover:bg-emerald-900/20"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-emerald-200 mb-1">
              Caption / Reflections
            </label>
            <textarea
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder="How did the session feel? Mention your eco choices or highlights..."
              rows={3}
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#F4FAF5] dark:bg-[#173B32] border border-emerald-200/70 dark:border-emerald-800/50 text-[#173B32] dark:text-emerald-100 text-sm focus:outline-none focus:ring-2 focus:ring-[#087F5B]"
              required
            />
          </div>

          {/* Attach Activity Stats */}
          {activities.length > 0 && (
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-emerald-200 mb-1">
                Link Recent Activity
              </label>
              <select
                value={selectedActivityId}
                onChange={(e) => setSelectedActivityId(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-[#F4FAF5] dark:bg-[#173B32] border border-emerald-200/70 dark:border-emerald-800/50 text-xs font-semibold text-slate-800 dark:text-emerald-200"
              >
                {activities.map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.title} — {a.distance} km ({Math.floor(a.duration / 60)} min, {a.calories} kcal)
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Proof Photo Selection */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-emerald-200 mb-2">
              Select Proof Photo / Snapshot
            </label>
            <div className="grid grid-cols-4 gap-2">
              {samplePhotos.map((img, i) => (
                <div
                  key={i}
                  onClick={() => setSelectedPhoto(img)}
                  className={`relative rounded-xl overflow-hidden aspect-video cursor-pointer border-2 transition-all ${
                    selectedPhoto === img
                      ? 'border-[#087F5B] ring-2 ring-[#087F5B]/30 scale-102'
                      : 'border-transparent opacity-75 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt="proof" className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          </div>

          {/* Visibility Toggle */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-[#F4FAF5] dark:bg-[#173B32] border border-emerald-100 dark:border-emerald-800/40">
            <span className="text-xs font-semibold text-slate-700 dark:text-emerald-200 flex items-center gap-2">
              {visibility === 'public' ? (
                <>
                  <Globe className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  Public Community Feed
                </>
              ) : (
                <>
                  <Lock className="w-4 h-4 text-amber-500" />
                  Private Log Only
                </>
              )}
            </span>
            <button
              type="button"
              onClick={() => setVisibility(v => v === 'public' ? 'private' : 'public')}
              className="text-xs font-bold text-[#087F5B] dark:text-[#7BC96F] hover:underline"
            >
              Switch to {visibility === 'public' ? 'Private' : 'Public'}
            </button>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-600 dark:text-emerald-300 hover:bg-slate-100 dark:hover:bg-emerald-900/30"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold bg-[#087F5B] hover:bg-[#076a4c] text-white shadow-md shadow-[#087F5B]/30 hover:scale-105 active:scale-95 transition-all"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Share Proof (+10 XP)</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
