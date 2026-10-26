import React, { useState } from 'react';
import { 
  X, 
  Search, 
  Send, 
  Clock, 
  Eye, 
  Repeat, 
  Bookmark, 
  Users, 
  Globe, 
  Lock, 
  Sparkles, 
  Check, 
  CheckCircle2, 
  AlertCircle,
  MessageSquare,
  Share2
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { SnapViewMode, StoryAudience, SnapSticker, AttachedActivitySummary } from '../../types';

interface SendToModalProps {
  isOpen: boolean;
  onClose: () => void;
  photoData: {
    photoUrl: string;
    filter: string;
    caption: string;
    textOverlay?: string;
    stickers: SnapSticker[];
    attachedActivity?: AttachedActivitySummary | null;
  };
  onCompleted: () => void;
}

export const SendToModal: React.FC<SendToModalProps> = ({
  isOpen,
  onClose,
  photoData,
  onCompleted,
}) => {
  const { 
    user, 
    communityUsers, 
    sendSnap, 
    publishStory, 
    createCommunityPost, 
    navigate 
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRecipientIds, setSelectedRecipientIds] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<SnapViewMode>('replay_allowed');
  const [storyAudience, setStoryAudience] = useState<StoryAudience>('followers');
  const [customNote, setCustomNote] = useState('');
  
  // Status feedback state
  const [isSending, setIsSending] = useState(false);
  const [confirmationData, setConfirmationData] = useState<{
    type: 'snap' | 'story' | 'post' | 'private';
    recipientCount?: number;
    conversationId?: string;
  } | null>(null);

  if (!isOpen) return null;

  // Filter candidate friends and users
  const filteredUsers = communityUsers.filter((u) => {
    if (u.id === user.id) return false;
    const matchesSearch = 
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.username.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  const toggleRecipient = (id: string) => {
    setSelectedRecipientIds((prev) =>
      prev.includes(id) ? prev.filter((r) => r !== id) : [...prev, id]
    );
  };

  const handleSendSnap = async () => {
    if (selectedRecipientIds.length === 0) return;
    setIsSending(true);

    try {
      const result = sendSnap({
        recipientIds: selectedRecipientIds,
        mediaPath: photoData.photoUrl,
        filter: photoData.filter,
        caption: photoData.caption,
        textOverlay: photoData.textOverlay,
        stickers: photoData.stickers,
        attachedActivity: photoData.attachedActivity || undefined,
        viewMode,
      });

      setIsSending(false);
      setConfirmationData({
        type: 'snap',
        recipientCount: selectedRecipientIds.length,
        conversationId: result.firstConversationId,
      });
    } catch (e) {
      setIsSending(false);
      console.error(e);
    }
  };

  const handlePublishStory = () => {
    setIsSending(true);
    publishStory({
      mediaPath: photoData.photoUrl,
      filter: photoData.filter,
      caption: photoData.caption,
      textOverlay: photoData.textOverlay,
      stickers: photoData.stickers,
      attachedActivity: photoData.attachedActivity || undefined,
      audience: storyAudience,
    });

    setIsSending(false);
    setConfirmationData({
      type: 'story',
    });
  };

  const handleCreateCommunityPost = () => {
    setIsSending(true);
    const stickerNames = photoData.stickers.map((s) => s.label).join(' • ');
    const postContent = photoData.caption || 'Captured with VELORA Snap 🌿';

    const actData = photoData.attachedActivity ? {
      type: photoData.attachedActivity.type,
      distance: photoData.attachedActivity.distance,
      duration: typeof photoData.attachedActivity.duration === 'number' ? photoData.attachedActivity.duration : 1200,
      calories: photoData.attachedActivity.calories || 250,
      elevation: 25
    } : undefined;

    createCommunityPost(
      postContent,
      actData,
      [photoData.photoUrl],
      stickerNames || undefined
    );

    setIsSending(false);
    setConfirmationData({
      type: 'post',
    });
  };

  const handleSavePrivately = () => {
    // Saves to private journal
    setConfirmationData({
      type: 'private',
    });
  };

  // Render Confirmation Screen when complete
  if (confirmationData) {
    return (
      <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
        <div className="bg-white dark:bg-[#102A24] border border-emerald-100 dark:border-emerald-800 rounded-3xl p-6 max-w-sm w-full text-center shadow-2xl animate-in zoom-in-95">
          <div className="w-14 h-14 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-[#087F5B] dark:text-[#7BC96F] flex items-center justify-center mx-auto mb-4 border border-emerald-200 dark:border-emerald-800">
            <CheckCircle2 className="w-8 h-8 stroke-[2.5]" />
          </div>

          <h3 className="text-xl font-extrabold text-[#173B32] dark:text-emerald-100 mb-1">
            {confirmationData.type === 'snap' && 'Snap Sent!'}
            {confirmationData.type === 'story' && 'Added to VELORA Story!'}
            {confirmationData.type === 'post' && 'Shared to Community!'}
            {confirmationData.type === 'private' && 'Saved Privately!'}
          </h3>

          <p className="text-xs text-slate-500 dark:text-emerald-300/80 mb-6 leading-relaxed">
            {confirmationData.type === 'snap' &&
              `Delivered to ${confirmationData.recipientCount} friend${
                confirmationData.recipientCount! > 1 ? 's' : ''
              }. Snaps are set to "${viewMode}".`}
            {confirmationData.type === 'story' &&
              'Your 24-hour Story is live for your chosen audience.'}
            {confirmationData.type === 'post' &&
              'Your photo and workout stats are now featured in the Community feed.'}
            {confirmationData.type === 'private' &&
              'Saved securely in your private VELORA logbook.'}
          </p>

          <div className="space-y-2">
            {confirmationData.type === 'snap' && confirmationData.conversationId && (
              <button
                onClick={() => {
                  onCompleted();
                  navigate('/inbox');
                }}
                className="w-full py-2.5 px-4 rounded-xl bg-[#087F5B] hover:bg-[#076a4c] text-white text-xs font-bold shadow-md shadow-[#087F5B]/30 flex items-center justify-center gap-2 transition-transform active:scale-95"
              >
                <MessageSquare className="w-4 h-4" />
                Go to Conversation
              </button>
            )}

            {confirmationData.type === 'post' && (
              <button
                onClick={() => {
                  onCompleted();
                  navigate('/community');
                }}
                className="w-full py-2.5 px-4 rounded-xl bg-[#087F5B] hover:bg-[#076a4c] text-white text-xs font-bold shadow-md shadow-[#087F5B]/30 flex items-center justify-center gap-2 transition-transform active:scale-95"
              >
                <Share2 className="w-4 h-4" />
                View in Community
              </button>
            )}

            <button
              onClick={onCompleted}
              className="w-full py-2 px-4 rounded-xl bg-slate-100 dark:bg-emerald-950/60 text-slate-700 dark:text-emerald-200 text-xs font-semibold hover:bg-slate-200 dark:hover:bg-emerald-900/40 transition-colors"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-end sm:items-center justify-center p-0 sm:p-4 select-none animate-in fade-in duration-200">
      <div className="bg-white dark:bg-[#102A24] border-t sm:border border-emerald-100 dark:border-emerald-800/80 rounded-t-3xl sm:rounded-3xl w-full max-w-lg max-h-[92vh] flex flex-col overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-emerald-100 dark:border-emerald-900/60">
          <div>
            <h3 className="text-base font-extrabold text-[#173B32] dark:text-[#7BC96F] flex items-center gap-2">
              <Send className="w-4 h-4 text-[#087F5B]" />
              Send & Share Snap
            </h3>
            <p className="text-[11px] text-slate-500 dark:text-emerald-300/70">
              Select friends or broadcast to your VELORA network
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-emerald-900/40 text-slate-400 hover:text-slate-600 dark:hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5">
          {/* Snap Disappearing Option Selector */}
          <div className="bg-[#F4FAF5] dark:bg-[#173B32]/60 border border-emerald-100 dark:border-emerald-800/60 rounded-2xl p-3.5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-[#173B32] dark:text-emerald-200 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-[#39A96B]" />
                Snap Privacy & Expiry
              </span>
              <span className="text-[10px] text-emerald-700 dark:text-emerald-300 font-semibold uppercase">
                {viewMode.replace('_', ' ')}
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => setViewMode('view_once')}
                className={`py-2 px-2 rounded-xl text-xs font-semibold flex flex-col items-center gap-1 border transition-all ${
                  viewMode === 'view_once'
                    ? 'bg-[#087F5B] text-white border-[#087F5B] shadow-sm'
                    : 'bg-white dark:bg-emerald-950/40 text-slate-600 dark:text-emerald-200 border-emerald-200/60 dark:border-emerald-800/40 hover:border-emerald-400'
                }`}
              >
                <Eye className="w-3.5 h-3.5" />
                <span className="text-[11px]">View Once</span>
              </button>

              <button
                onClick={() => setViewMode('replay_allowed')}
                className={`py-2 px-2 rounded-xl text-xs font-semibold flex flex-col items-center gap-1 border transition-all ${
                  viewMode === 'replay_allowed'
                    ? 'bg-[#087F5B] text-white border-[#087F5B] shadow-sm'
                    : 'bg-white dark:bg-emerald-950/40 text-slate-600 dark:text-emerald-200 border-emerald-200/60 dark:border-emerald-800/40 hover:border-emerald-400'
                }`}
              >
                <Repeat className="w-3.5 h-3.5" />
                <span className="text-[11px]">Replay Allowed</span>
              </button>

              <button
                onClick={() => setViewMode('save_in_chat')}
                className={`py-2 px-2 rounded-xl text-xs font-semibold flex flex-col items-center gap-1 border transition-all ${
                  viewMode === 'save_in_chat'
                    ? 'bg-[#087F5B] text-white border-[#087F5B] shadow-sm'
                    : 'bg-white dark:bg-emerald-950/40 text-slate-600 dark:text-emerald-200 border-emerald-200/60 dark:border-emerald-800/40 hover:border-emerald-400'
                }`}
              >
                <Bookmark className="w-3.5 h-3.5" />
                <span className="text-[11px]">Save in Chat</span>
              </button>
            </div>

            <p className="text-[10px] text-slate-400 dark:text-emerald-400/60 mt-2 flex items-center gap-1">
              <AlertCircle className="w-3 h-3 flex-shrink-0" />
              Note: Web browsers cannot prevent external captures or screenshots.
            </p>
          </div>

          {/* Optional Message input */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-emerald-200 mb-1">
              Add Private Note (optional)
            </label>
            <input
              type="text"
              value={customNote}
              onChange={(e) => setCustomNote(e.target.value)}
              placeholder="e.g. Check out the pace on hill 3!"
              className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-emerald-950/40 border border-emerald-200/60 dark:border-emerald-800/60 text-[#173B32] dark:text-white placeholder-slate-400 focus:outline-none focus:border-[#39A96B]"
            />
          </div>

          {/* Quick Publish Channels: Stories & Community */}
          <div className="space-y-2">
            <span className="text-xs font-bold text-slate-700 dark:text-emerald-200 block">
              Share to Channels
            </span>

            {/* Story Button */}
            <div className="p-3 rounded-2xl bg-gradient-to-r from-emerald-500/10 via-teal-500/10 to-transparent border border-emerald-200/60 dark:border-emerald-800/60 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#087F5B] to-[#F4C95D] p-[2px]">
                  <div className="w-full h-full bg-white dark:bg-[#102A24] rounded-full flex items-center justify-center">
                    <Sparkles className="w-5 h-5 text-[#087F5B]" />
                  </div>
                </div>
                <div>
                  <h4 className="text-xs font-bold text-[#173B32] dark:text-white">VELORA Story (24h)</h4>
                  <div className="flex items-center gap-2 mt-0.5">
                    <select
                      value={storyAudience}
                      onChange={(e) => setStoryAudience(e.target.value as StoryAudience)}
                      className="text-[10px] bg-white dark:bg-emerald-950 border border-emerald-200 dark:border-emerald-800 rounded px-1.5 py-0.5 text-slate-700 dark:text-emerald-200 font-medium"
                    >
                      <option value="public">Public</option>
                      <option value="followers">Followers</option>
                      <option value="friends">Selected Friends</option>
                      <option value="private">Private</option>
                    </select>
                  </div>
                </div>
              </div>

              <button
                onClick={handlePublishStory}
                disabled={isSending}
                className="py-1.5 px-3.5 rounded-xl bg-[#087F5B] hover:bg-[#076a4c] text-white text-xs font-bold transition-transform active:scale-95"
              >
                + Add Story
              </button>
            </div>

            {/* Community Post Button */}
            <div className="p-3 rounded-2xl bg-slate-50 dark:bg-emerald-950/30 border border-emerald-200/60 dark:border-emerald-800/60 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-900/50 flex items-center justify-center text-[#087F5B] dark:text-[#7BC96F]">
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-[#173B32] dark:text-white">Community Post</h4>
                  <p className="text-[10px] text-slate-500 dark:text-emerald-400/70">
                    Publish to public activity stream
                  </p>
                </div>
              </div>

              <button
                onClick={handleCreateCommunityPost}
                disabled={isSending}
                className="py-1.5 px-3.5 rounded-xl bg-white dark:bg-emerald-900/60 border border-emerald-200 dark:border-emerald-700 text-[#087F5B] dark:text-emerald-200 text-xs font-bold hover:bg-emerald-50 transition-colors"
              >
                Post to Feed
              </button>
            </div>
          </div>

          {/* Direct Friends List */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-700 dark:text-emerald-200">
                Send to Friends ({selectedRecipientIds.length} selected)
              </span>
              {selectedRecipientIds.length > 0 && (
                <button
                  onClick={() => setSelectedRecipientIds([])}
                  className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold hover:underline"
                >
                  Clear all
                </button>
              )}
            </div>

            {/* Search Input */}
            <div className="relative mb-3">
              <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search friends by name or @username..."
                className="w-full pl-8 pr-3 py-1.5 text-xs rounded-xl bg-slate-50 dark:bg-emerald-950/40 border border-emerald-200/60 dark:border-emerald-800/60 text-[#173B32] dark:text-white placeholder-slate-400 focus:outline-none focus:border-[#39A96B]"
              />
            </div>

            {/* Friends selectable list */}
            <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
              {filteredUsers.length === 0 ? (
                <p className="text-xs text-slate-400 py-3 text-center">No matching users found.</p>
              ) : (
                filteredUsers.map((u) => {
                  const isSelected = selectedRecipientIds.includes(u.id);
                  return (
                    <div
                      key={u.id}
                      onClick={() => toggleRecipient(u.id)}
                      className={`flex items-center justify-between p-2 rounded-xl cursor-pointer transition-all ${
                        isSelected
                          ? 'bg-emerald-50 dark:bg-emerald-900/40 border border-emerald-300 dark:border-emerald-700'
                          : 'hover:bg-slate-50 dark:hover:bg-emerald-950/40 border border-transparent'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <img
                          src={u.avatar}
                          alt={u.name}
                          className="w-8 h-8 rounded-full object-cover border border-emerald-200 dark:border-emerald-800"
                        />
                        <div>
                          <h5 className="text-xs font-bold text-[#173B32] dark:text-white leading-tight">
                            {u.name}
                          </h5>
                          <span className="text-[10px] text-slate-500 dark:text-emerald-400/70">
                            @{u.username} • {u.bio || u.goals[0] || 'Active Member'}
                          </span>
                        </div>
                      </div>

                      <div
                        className={`w-5 h-5 rounded-md flex items-center justify-center transition-colors ${
                          isSelected
                            ? 'bg-[#087F5B] text-white'
                            : 'border border-slate-300 dark:border-emerald-800 bg-white dark:bg-emerald-950'
                        }`}
                      >
                        {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>

        {/* Footer actions */}
        <div className="p-4 border-t border-emerald-100 dark:border-emerald-900/60 bg-[#F4FAF5]/50 dark:bg-[#173B32]/30 flex items-center justify-between gap-3">
          <button
            onClick={handleSavePrivately}
            className="py-2.5 px-3 rounded-xl border border-emerald-200 dark:border-emerald-800 text-xs font-semibold text-slate-600 dark:text-emerald-300 hover:bg-white dark:hover:bg-emerald-900/40 transition-colors"
          >
            Save Privately
          </button>

          <button
            onClick={handleSendSnap}
            disabled={selectedRecipientIds.length === 0 || isSending}
            className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-lg transition-transform ${
              selectedRecipientIds.length === 0
                ? 'bg-slate-200 dark:bg-emerald-950 text-slate-400 dark:text-emerald-700 cursor-not-allowed'
                : 'bg-gradient-to-r from-[#087F5B] to-[#39A96B] hover:brightness-110 text-white shadow-[#087F5B]/30 active:scale-95'
            }`}
          >
            <Send className="w-3.5 h-3.5" />
            <span>
              {selectedRecipientIds.length === 0
                ? 'Select Recipients'
                : `Send Snap (${selectedRecipientIds.length})`}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};
