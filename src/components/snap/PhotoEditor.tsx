import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Send, 
  Sparkles, 
  Type, 
  Sticker as StickerIcon, 
  MapPin, 
  Crop, 
  Smile, 
  X, 
  Check, 
  Flame, 
  Leaf, 
  Clock, 
  Activity as ActivityIcon,
  Layers
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { VELORA_STICKERS } from '../../data/mockData';
import { PHOTO_FILTERS } from '../../services/snap';
import { Activity, SnapSticker, AttachedActivitySummary } from '../../types';
import { SendToModal } from './SendToModal';

interface PhotoEditorProps {
  photoUrl: string;
  initialActivity?: Activity | null;
  onRetake: () => void;
  onClose: () => void;
}

const COMMON_EMOJIS = ['🌿', '🏃‍♂️', '💧', '🔥', '✨', '⚡', '🚴‍♀️', '🧘‍♂️', '🏆', '💚', '🌞', '🌱'];

export const PhotoEditor: React.FC<PhotoEditorProps> = ({
  photoUrl,
  initialActivity,
  onRetake,
  onClose,
}) => {
  const { activities } = useApp();

  // Active edit state
  const [activeFilterId, setActiveFilterId] = useState<string>('normal');
  const [selectedStickers, setSelectedStickers] = useState<SnapSticker[]>([]);
  const [caption, setCaption] = useState<string>('');
  const [textOverlay, setTextOverlay] = useState<string>('');
  const [isAddingText, setIsAddingText] = useState<boolean>(false);
  const [aspectCrop, setAspectCrop] = useState<'9:16' | '1:1' | '4:3'>('9:16');
  
  // Attached activity from user history
  const [attachedActivity, setAttachedActivity] = useState<AttachedActivitySummary | null>(() => {
    if (initialActivity) {
      return {
        id: initialActivity.id,
        title: initialActivity.title,
        type: initialActivity.type,
        distance: initialActivity.distance,
        duration: initialActivity.duration,
        avgPace: initialActivity.pace,
        pace: initialActivity.pace,
        ecoScore: initialActivity.ecoPointsEarned,
        calories: initialActivity.calories,
        routePreview: initialActivity.route,
      };
    }
    return null;
  });

  // Modal drawer toggles
  const [activeTab, setActiveTab] = useState<'filters' | 'stickers' | 'activity' | 'crop'>('filters');
  const [showSendModal, setShowSendModal] = useState<boolean>(false);

  // Filter style mapping
  const currentFilter = PHOTO_FILTERS.find((f) => f.id === activeFilterId) || PHOTO_FILTERS[0];

  const toggleSticker = (sticker: typeof VELORA_STICKERS[0]) => {
    const exists = selectedStickers.some((s) => s.id === sticker.id);
    if (exists) {
      setSelectedStickers((prev) => prev.filter((s) => s.id !== sticker.id));
    } else {
      setSelectedStickers((prev) => [
        ...prev,
        {
          id: sticker.id,
          label: sticker.label,
          icon: sticker.icon || sticker.emoji || '🌿',
          emoji: sticker.emoji || sticker.icon || '🌿',
          category: (sticker as any).category,
        },
      ]);
    }
  };

  const handleSelectActivity = (act: Activity) => {
    if (attachedActivity?.id === act.id) {
      setAttachedActivity(null);
    } else {
      setAttachedActivity({
        id: act.id,
        title: act.title,
        type: act.type,
        distance: act.distance,
        duration: act.duration,
        avgPace: act.pace,
        pace: act.pace,
        ecoScore: act.ecoPointsEarned,
        calories: act.calories,
        routePreview: act.route,
      });
    }
  };

  const addEmojiToCaption = (emoji: string) => {
    setCaption((prev) => prev + emoji);
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#0A1F1A] text-white flex flex-col justify-between select-none overflow-hidden animate-in fade-in duration-150">
      {/* Top Header: Retake & Action */}
      <div className="relative z-20 flex items-center justify-between px-4 py-3 bg-gradient-to-b from-black/80 via-black/40 to-transparent">
        <button
          onClick={onRetake}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/15 hover:bg-white/25 text-xs font-semibold backdrop-blur-md transition-all active:scale-95"
        >
          <ArrowLeft className="w-4 h-4" />
          Retake
        </button>

        <span className="text-xs font-bold tracking-wider text-emerald-300">
          SNAP STUDIO
        </span>

        <button
          onClick={() => setShowSendModal(true)}
          className="flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-gradient-to-r from-[#087F5B] to-[#39A96B] hover:brightness-110 text-xs font-bold shadow-lg shadow-[#087F5B]/40 active:scale-95 transition-transform"
        >
          <span>Send / Post</span>
          <Send className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Main Preview Area */}
      <div className="relative flex-1 flex items-center justify-center p-3 sm:p-4 overflow-hidden">
        <div
          className={`relative max-w-sm w-full mx-auto overflow-hidden rounded-3xl shadow-2xl border border-emerald-900/60 bg-black flex items-center justify-center transition-all duration-300 ${
            aspectCrop === '9:16'
              ? 'aspect-[9/16]'
              : aspectCrop === '1:1'
              ? 'aspect-square'
              : 'aspect-[4/3]'
          }`}
        >
          {/* Main Photo with Applied Filter */}
          <img
            src={photoUrl}
            alt="Captured Snap"
            className="w-full h-full object-cover transition-all duration-300"
            style={{
              filter: currentFilter.cssFilter,
            }}
          />

          {/* Text Overlay banner (if defined) */}
          {textOverlay && (
            <div className="absolute top-12 left-4 right-4 pointer-events-none">
              <div className="inline-block max-w-full bg-black/65 backdrop-blur-md px-3.5 py-1.5 rounded-2xl text-white font-extrabold text-sm sm:text-base tracking-wide border border-white/20 shadow-lg">
                {textOverlay}
              </div>
            </div>
          )}

          {/* Attached Activity Card Overlay */}
          {attachedActivity && (
            <div className="absolute top-4 left-4 right-4 pointer-events-none">
              <div className="bg-[#173B32]/90 backdrop-blur-md border border-[#39A96B]/50 rounded-2xl p-2.5 shadow-xl">
                <div className="flex items-center justify-between text-xs font-bold text-white mb-1">
                  <span className="flex items-center gap-1.5 text-emerald-300">
                    <ActivityIcon className="w-3.5 h-3.5 text-[#39A96B]" />
                    {attachedActivity.title}
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-[#7BC96F] border border-emerald-500/30">
                    Verified GPS
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-2 text-center pt-1 border-t border-emerald-800/50">
                  <div>
                    <span className="block text-[9px] text-emerald-300/70 uppercase">Distance</span>
                    <span className="text-xs font-extrabold text-white">{attachedActivity.distance} km</span>
                  </div>
                  <div>
                    <span className="block text-[9px] text-emerald-300/70 uppercase">Pace</span>
                    <span className="text-xs font-extrabold text-white">{attachedActivity.avgPace} /km</span>
                  </div>
                  <div>
                    <span className="block text-[9px] text-emerald-300/70 uppercase">Eco Score</span>
                    <span className="text-xs font-extrabold text-[#7BC96F]">+{attachedActivity.ecoScore}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Selected VELORA Stickers rendered on photo */}
          {selectedStickers.length > 0 && (
            <div className="absolute bottom-14 left-4 right-4 flex flex-wrap gap-2 pointer-events-none">
              {selectedStickers.map((stk) => (
                <div
                  key={stk.id}
                  className="px-3 py-1.5 rounded-xl bg-white/95 text-slate-900 font-extrabold text-xs shadow-xl border border-white flex items-center gap-1.5 animate-in zoom-in-90"
                >
                  <span className="text-base leading-none">{stk.emoji}</span>
                  <span>{stk.label}</span>
                </div>
              ))}
            </div>
          )}

          {/* Caption text bottom display */}
          {caption && (
            <div className="absolute bottom-3 left-4 right-4 pointer-events-none">
              <div className="bg-black/60 backdrop-blur-md rounded-xl px-3 py-1.5 text-xs text-white/95 font-medium border border-white/10 truncate">
                {caption}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Editor Tool Controls & Drawer */}
      <div className="relative z-20 bg-[#102A24]/95 border-t border-emerald-950/60 backdrop-blur-md px-4 pt-3 pb-6 max-w-xl mx-auto w-full">
        {/* Caption & Quick Emoji bar */}
        <div className="mb-3 space-y-2">
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder="Add a snap caption..."
              className="flex-1 bg-black/40 border border-emerald-800/40 rounded-xl px-3 py-1.5 text-xs text-white placeholder-emerald-400/50 focus:outline-none focus:border-[#39A96B]"
            />
            <button
              onClick={() => setIsAddingText(!isAddingText)}
              className={`p-2 rounded-xl text-xs font-bold transition-colors ${
                textOverlay || isAddingText
                  ? 'bg-[#087F5B] text-white'
                  : 'bg-black/30 text-emerald-300 hover:bg-black/50'
              }`}
              title="Add text overlay banner"
            >
              <Type className="w-4 h-4" />
            </button>
          </div>

          {/* Text banner input if open */}
          {isAddingText && (
            <div className="flex items-center gap-2 animate-in fade-in">
              <input
                type="text"
                value={textOverlay}
                onChange={(e) => setTextOverlay(e.target.value)}
                placeholder="Top headline text overlay (e.g. 5K Sunrise Run!)..."
                className="flex-1 bg-black/60 border border-emerald-700/60 rounded-xl px-3 py-1.5 text-xs text-[#F4C95D] font-bold focus:outline-none"
              />
              {textOverlay && (
                <button
                  onClick={() => setTextOverlay('')}
                  className="p-1 text-slate-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          )}

          {/* Quick emoji row */}
          <div className="flex items-center gap-1.5 overflow-x-auto py-1 scrollbar-none">
            {COMMON_EMOJIS.map((emoji) => (
              <button
                key={emoji}
                onClick={() => addEmojiToCaption(emoji)}
                className="text-sm p-1 hover:bg-white/10 rounded-lg transition-transform active:scale-125"
              >
                {emoji}
              </button>
            ))}
          </div>
        </div>

        {/* Tab switchers */}
        <div className="flex items-center justify-around border-t border-emerald-900/40 pt-2 mb-3">
          <button
            onClick={() => setActiveTab('filters')}
            className={`flex items-center gap-1.5 text-xs font-semibold py-1 px-2.5 rounded-lg transition-colors ${
              activeTab === 'filters' ? 'bg-[#087F5B] text-white' : 'text-emerald-300/70 hover:text-white'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Filters</span>
          </button>

          <button
            onClick={() => setActiveTab('stickers')}
            className={`flex items-center gap-1.5 text-xs font-semibold py-1 px-2.5 rounded-lg transition-colors ${
              activeTab === 'stickers' ? 'bg-[#087F5B] text-white' : 'text-emerald-300/70 hover:text-white'
            }`}
          >
            <StickerIcon className="w-3.5 h-3.5" />
            <span>Stickers ({selectedStickers.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('activity')}
            className={`flex items-center gap-1.5 text-xs font-semibold py-1 px-2.5 rounded-lg transition-colors ${
              activeTab === 'activity' ? 'bg-[#087F5B] text-white' : 'text-emerald-300/70 hover:text-white'
            }`}
          >
            <MapPin className="w-3.5 h-3.5" />
            <span>Attach Activity {attachedActivity ? '✓' : ''}</span>
          </button>

          <button
            onClick={() => setActiveTab('crop')}
            className={`flex items-center gap-1.5 text-xs font-semibold py-1 px-2.5 rounded-lg transition-colors ${
              activeTab === 'crop' ? 'bg-[#087F5B] text-white' : 'text-emerald-300/70 hover:text-white'
            }`}
          >
            <Crop className="w-3.5 h-3.5" />
            <span>Crop</span>
          </button>
        </div>

        {/* Tab Content 1: Filters */}
        {activeTab === 'filters' && (
          <div className="flex gap-2.5 overflow-x-auto pb-1 scrollbar-none">
            {PHOTO_FILTERS.map((filt) => (
              <button
                key={filt.id}
                onClick={() => setActiveFilterId(filt.id)}
                className={`flex flex-col items-center gap-1 flex-shrink-0 p-1.5 rounded-xl border transition-all ${
                  activeFilterId === filt.id
                    ? 'border-[#7BC96F] bg-emerald-900/40 text-[#7BC96F]'
                    : 'border-emerald-900/40 text-emerald-300/70 hover:border-emerald-700'
                }`}
              >
                <div 
                  className="w-12 h-12 rounded-lg overflow-hidden border border-white/20"
                  style={{ filter: filt.cssFilter }}
                >
                  <img src={photoUrl} alt={filt.name} className="w-full h-full object-cover" />
                </div>
                <span className="text-[10px] font-medium">{filt.name}</span>
              </button>
            ))}
          </div>
        )}

        {/* Tab Content 2: VELORA Stickers */}
        {activeTab === 'stickers' && (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-36 overflow-y-auto pr-1">
            {VELORA_STICKERS.map((stk) => {
              const isSelected = selectedStickers.some((s) => s.id === stk.id);
              return (
                <button
                  key={stk.id}
                  onClick={() => toggleSticker(stk)}
                  className={`flex items-center gap-2 p-2 rounded-xl text-left border text-xs font-semibold transition-all ${
                    isSelected
                      ? 'bg-gradient-to-r from-[#087F5B] to-[#39A96B] border-emerald-400 text-white shadow-md'
                      : 'bg-black/30 border-emerald-900/40 text-emerald-200 hover:border-emerald-700'
                  }`}
                >
                  <span className="text-lg leading-none">{stk.emoji}</span>
                  <span className="truncate flex-1">{stk.label}</span>
                  {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                </button>
              );
            })}
          </div>
        )}

        {/* Tab Content 3: Attach Saved Activity */}
        {activeTab === 'activity' && (
          <div className="space-y-2 max-h-36 overflow-y-auto pr-1">
            <p className="text-[11px] text-emerald-300/80">
              Attach a saved workout from your history to prove your effort:
            </p>
            {activities.length === 0 ? (
              <p className="text-xs text-slate-400 italic">No saved activities found in your history.</p>
            ) : (
              activities.map((act) => {
                const isSelected = attachedActivity?.id === act.id;
                return (
                  <button
                    key={act.id}
                    onClick={() => handleSelectActivity(act)}
                    className={`w-full flex items-center justify-between p-2.5 rounded-xl border text-xs transition-all text-left ${
                      isSelected
                        ? 'bg-emerald-950/80 border-[#7BC96F] text-white shadow-md'
                        : 'bg-black/30 border-emerald-900/40 text-emerald-200 hover:border-emerald-700'
                    }`}
                  >
                    <div>
                      <div className="font-bold flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-[#39A96B]" />
                        <span>{act.title}</span>
                      </div>
                      <div className="text-[10px] text-emerald-400/70 mt-0.5">
                        {act.distance} km • {typeof act.duration === 'number' ? Math.round(act.duration / 60) + ' min' : act.duration} • {act.pace}
                      </div>
                    </div>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      isSelected ? 'bg-emerald-500 text-white' : 'bg-emerald-900/50 text-[#7BC96F]'
                    }`}>
                      {isSelected ? 'Attached' : '+ Attach'}
                    </span>
                  </button>
                );
              })
            )}
          </div>
        )}

        {/* Tab Content 4: Crop Presets */}
        {activeTab === 'crop' && (
          <div className="flex items-center justify-around gap-2 pt-1">
            {(['9:16', '1:1', '4:3'] as const).map((ratio) => (
              <button
                key={ratio}
                onClick={() => setAspectCrop(ratio)}
                className={`flex-1 py-2 rounded-xl text-xs font-bold border transition-colors ${
                  aspectCrop === ratio
                    ? 'bg-[#087F5B] border-[#7BC96F] text-white'
                    : 'bg-black/30 border-emerald-900/40 text-emerald-300/70 hover:border-emerald-700'
                }`}
              >
                {ratio === '9:16' ? 'Story (9:16)' : ratio === '1:1' ? 'Square (1:1)' : 'Standard (4:3)'}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Recipient / Send Modal */}
      {showSendModal && (
        <SendToModal
          isOpen={showSendModal}
          onClose={() => setShowSendModal(false)}
          photoData={{
            photoUrl,
            filter: activeFilterId,
            caption,
            textOverlay,
            stickers: selectedStickers,
            attachedActivity,
          }}
          onCompleted={() => {
            setShowSendModal(false);
            onClose();
          }}
        />
      )}
    </div>
  );
};
