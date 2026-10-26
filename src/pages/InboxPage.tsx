import React, { useState, useEffect, useRef } from 'react';
import { 
  MessageSquare, 
  Send, 
  Camera, 
  Search, 
  Check, 
  CheckCheck, 
  Eye, 
  Clock, 
  Repeat, 
  Bookmark, 
  Flame, 
  Sparkles, 
  ArrowLeft, 
  X, 
  ShieldCheck,
  Activity as ActivityIcon
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Conversation, Message, SnapDeliveryStatus, SnapViewMode } from '../types';
import { PHOTO_FILTERS } from '../services/snap';

export const InboxPage: React.FC = () => {
  const {
    user,
    conversations,
    messages,
    activeConversationId,
    setActiveConversationId,
    sendMessage,
    openSnapMessage,
    openCamera,
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [inputText, setInputText] = useState('');
  const [activeViewingSnapMessage, setActiveViewingSnapMessage] = useState<Message | null>(null);
  const [viewCountdown, setViewCountdown] = useState<number>(0);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Active conversation object
  const activeConv: Conversation | undefined = conversations.find((c) => c.id === activeConversationId);

  // Messages for active conversation: messages is Record<string, Message[]>
  const currentMessages: Message[] = 
    activeConversationId && (messages as any)[activeConversationId]
      ? (messages as any)[activeConversationId]
      : [];

  // Scroll to bottom when messages update
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [currentMessages.length, activeConversationId]);

  // Handle View Once countdown timer
  useEffect(() => {
    if (!activeViewingSnapMessage) return;

    if (activeViewingSnapMessage.snapDetails?.viewMode === 'view_once') {
      setViewCountdown(7);
      const timer = setInterval(() => {
        setViewCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            handleCloseSnapView();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [activeViewingSnapMessage?.id]);

  const handleOpenSnap = (msg: Message) => {
    if (!msg.snapDetails) return;

    // Check if view once is already expired and opened
    if (msg.snapDetails.viewMode === 'view_once' && msg.deliveryStatus === 'opened') {
      return;
    }

    if (activeConv) {
      openSnapMessage(activeConv.id, msg.id);
    }
    setActiveViewingSnapMessage(msg);
  };

  const handleCloseSnapView = () => {
    if (activeViewingSnapMessage && activeConv) {
      openSnapMessage(activeConv.id, activeViewingSnapMessage.id);
    }
    setActiveViewingSnapMessage(null);
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || !activeConv) return;

    sendMessage(activeConv.id, inputText.trim());
    setInputText('');
  };

  const filteredConversations = conversations.filter(
    (c) =>
      c.participant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.participant.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-4">
      {/* Top Banner & Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white dark:bg-[#102A24] border border-emerald-100 dark:border-emerald-950/60 rounded-3xl p-5 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-extrabold text-[#173B32] dark:text-[#7BC96F] tracking-tight">
              VELORA Inbox
            </h1>
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-[#087F5B] dark:text-[#7BC96F] text-xs font-bold">
              Private Snaps & Direct Chat
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-emerald-300/70 mt-1">
            End-to-end simulated private messaging, interactive workout proofs, and disappearing snaps.
          </p>
        </div>

        <button
          onClick={() => openCamera()}
          className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-2xl bg-gradient-to-r from-[#087F5B] to-[#39A96B] hover:brightness-110 text-white text-xs font-bold shadow-md shadow-[#087F5B]/25 transition-transform active:scale-95"
        >
          <Camera className="w-4 h-4" />
          <span>New Snap</span>
        </button>
      </div>

      {/* Main Inbox Layout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 h-[620px] bg-white dark:bg-[#102A24] border border-emerald-100 dark:border-emerald-950/60 rounded-3xl overflow-hidden shadow-sm">
        {/* Left Column: Conversations List */}
        <div
          className={`lg:col-span-5 border-r border-emerald-100 dark:border-emerald-950/60 flex flex-col h-full ${
            activeConversationId ? 'hidden lg:flex' : 'flex'
          }`}
        >
          {/* Search Box */}
          <div className="p-3.5 border-b border-emerald-100 dark:border-emerald-950/60">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search conversations..."
                className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-[#F4FAF5] dark:bg-[#173B32] border border-emerald-200/60 dark:border-emerald-800/40 text-[#173B32] dark:text-white placeholder-slate-400 focus:outline-none focus:border-[#39A96B]"
              />
            </div>
          </div>

          {/* Conversations Scrollable Items */}
          <div className="flex-1 overflow-y-auto divide-y divide-emerald-50 dark:divide-emerald-950/40">
            {filteredConversations.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-400">
                No conversations found. Start a snap with a friend!
              </div>
            ) : (
              filteredConversations.map((conv) => {
                const isSelected = conv.id === activeConversationId;
                const isSnapMessage = conv.lastMessage?.isSnap;
                const snapStatus = conv.lastMessage?.snapStatus;

                return (
                  <div
                    key={conv.id}
                    onClick={() => setActiveConversationId(conv.id)}
                    className={`p-3.5 flex items-center justify-between cursor-pointer transition-colors ${
                      isSelected
                        ? 'bg-emerald-50/80 dark:bg-emerald-950/60 border-l-4 border-[#087F5B]'
                        : 'hover:bg-slate-50/60 dark:hover:bg-emerald-950/30'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0 flex-1 pr-2">
                      <div className="relative flex-shrink-0">
                        <img
                          src={conv.participant.avatar}
                          alt={conv.participant.name}
                          className="w-11 h-11 rounded-full object-cover border border-emerald-200 dark:border-emerald-800"
                        />
                        <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-500 border-2 border-white dark:border-[#102A24]" />
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between">
                          <h4 className="text-xs font-bold text-[#173B32] dark:text-white truncate">
                            {conv.participant.name}
                          </h4>
                          <span className="text-[10px] text-slate-400 dark:text-emerald-400/60">
                            {conv.lastMessage?.timestamp || 'Active'}
                          </span>
                        </div>

                        <div className="flex items-center gap-1.5 mt-0.5">
                          {isSnapMessage && (
                            <span className="text-[#087F5B] dark:text-[#7BC96F]">
                              <Flame className="w-3 h-3 fill-current" />
                            </span>
                          )}
                          <p
                            className={`text-xs truncate ${
                              conv.unreadCount > 0
                                ? 'font-bold text-[#173B32] dark:text-white'
                                : 'text-slate-500 dark:text-emerald-300/70'
                            }`}
                          >
                            {conv.lastMessage?.text || 'No messages yet'}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col items-end gap-1 flex-shrink-0">
                      {conv.unreadCount > 0 && (
                        <span className="px-2 py-0.5 rounded-full bg-[#087F5B] text-white text-[10px] font-extrabold shadow-sm">
                          {conv.unreadCount}
                        </span>
                      )}

                      {/* Snap status indicator */}
                      {isSnapMessage && (
                        <span
                          className={`text-[10px] font-semibold flex items-center gap-1 ${
                            snapStatus === 'opened'
                              ? 'text-slate-400'
                              : 'text-[#087F5B] dark:text-[#7BC96F]'
                          }`}
                        >
                          {snapStatus === 'opened' ? (
                            'Opened'
                          ) : (
                            <span className="flex items-center gap-0.5 text-rose-500 font-bold">
                              <Flame className="w-3 h-3 fill-current" /> Snap
                            </span>
                          )}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right Column: Chat View */}
        <div
          className={`lg:col-span-7 flex flex-col h-full bg-[#F4FAF5]/40 dark:bg-[#102A24]/40 ${
            !activeConversationId ? 'hidden lg:flex items-center justify-center' : 'flex'
          }`}
        >
          {!activeConv ? (
            <div className="p-8 text-center space-y-3">
              <div className="w-14 h-14 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-[#087F5B] dark:text-[#7BC96F] flex items-center justify-center mx-auto">
                <MessageSquare className="w-7 h-7" />
              </div>
              <h3 className="text-base font-bold text-[#173B32] dark:text-white">
                Select a conversation
              </h3>
              <p className="text-xs text-slate-500 dark:text-emerald-300/70 max-w-xs mx-auto">
                Send workout snaps, reply with stickers, or chat with fellow VELORA athletes.
              </p>
            </div>
          ) : (
            <>
              {/* Chat Header */}
              <div className="p-3.5 bg-white dark:bg-[#102A24] border-b border-emerald-100 dark:border-emerald-950/60 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setActiveConversationId('')}
                    className="lg:hidden p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-emerald-900/40 text-slate-500"
                  >
                    <ArrowLeft className="w-4 h-4" />
                  </button>

                  <img
                    src={activeConv.participant.avatar}
                    alt={activeConv.participant.name}
                    className="w-10 h-10 rounded-full object-cover border border-emerald-200 dark:border-emerald-800"
                  />

                  <div>
                    <h3 className="text-xs sm:text-sm font-extrabold text-[#173B32] dark:text-white leading-tight">
                      {activeConv.participant.name}
                    </h3>
                    <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium">
                      @{activeConv.participant.username} • Active in VELORA
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => openCamera()}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/80 hover:bg-emerald-100 dark:hover:bg-emerald-900/50 text-[#087F5B] dark:text-[#7BC96F] text-xs font-bold border border-emerald-200/60 dark:border-emerald-800/60 transition-colors"
                  >
                    <Camera className="w-3.5 h-3.5" />
                    <span>Send Snap</span>
                  </button>
                </div>
              </div>

              {/* Messages Thread */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {/* Privacy transparency banner */}
                <div className="mx-auto max-w-sm p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200/50 dark:border-emerald-800/40 text-[10px] text-emerald-800 dark:text-emerald-300 text-center flex items-center justify-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#39A96B]" />
                  <span>Simulated encrypted delivery • Snaps follow sender's expiry rules</span>
                </div>

                {currentMessages.map((msg: Message) => {
                  const isMe = msg.senderId === user.id;

                  return (
                    <div
                      key={msg.id}
                      className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
                    >
                      {/* Snap Card Message */}
                      {msg.snapDetails ? (
                        <div
                          className={`max-w-xs sm:max-w-sm rounded-2xl overflow-hidden border transition-all ${
                            isMe
                              ? 'bg-emerald-800 text-white border-emerald-700'
                              : 'bg-white dark:bg-[#173B32] text-[#173B32] dark:text-white border-emerald-100 dark:border-emerald-800 shadow-sm'
                          }`}
                        >
                          {/* If Snap is unopened and from friend */}
                          {!isMe && msg.deliveryStatus !== 'opened' ? (
                            <button
                              onClick={() => handleOpenSnap(msg)}
                              className="p-4 flex items-center gap-3 w-full hover:bg-emerald-50/50 dark:hover:bg-emerald-900/30 text-left transition-colors group"
                            >
                              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-rose-500 to-[#F4A261] text-white flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
                                <Flame className="w-6 h-6 fill-current animate-pulse" />
                              </div>
                              <div>
                                <span className="text-xs font-extrabold block text-rose-600 dark:text-rose-400">
                                  New Snap Received
                                </span>
                                <span className="text-[11px] font-medium text-slate-500 dark:text-emerald-300">
                                  Tap to open ({msg.snapDetails.viewMode.replace('_', ' ')})
                                </span>
                              </div>
                            </button>
                          ) : !isMe && msg.snapDetails.viewMode === 'view_once' ? (
                            /* Already opened view once snap */
                            <div className="p-3.5 flex items-center gap-2.5 text-slate-400">
                              <Eye className="w-4 h-4" />
                              <span className="text-xs italic">
                                Opened • Snap expired (View Once)
                              </span>
                            </div>
                          ) : (
                            /* Persistent or own sent snap thumbnail */
                            <div className="p-2 space-y-2">
                              <div
                                onClick={() => handleOpenSnap(msg)}
                                className="relative aspect-[4/3] rounded-xl overflow-hidden cursor-pointer group"
                              >
                                <img
                                  src={msg.mediaPath || 'https://images.unsplash.com/photo-1473496169904-658ba7c44d8a?auto=format&fit=crop&w=600&q=80'}
                                  alt="Snap preview"
                                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                                />
                                <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                                  <span className="px-3 py-1 rounded-full bg-black/60 text-white text-xs font-bold backdrop-blur-md flex items-center gap-1.5">
                                    <Eye className="w-3.5 h-3.5" />
                                    {isMe ? 'View Sent Snap' : 'Replay Snap'}
                                  </span>
                                </div>
                              </div>

                              {msg.snapDetails.caption && (
                                <p className="text-xs px-1 font-medium">{msg.snapDetails.caption}</p>
                              )}

                              {msg.snapDetails.attachedActivity && (
                                <div className="p-2 rounded-lg bg-black/20 text-[10px] flex items-center justify-between">
                                  <span className="flex items-center gap-1 font-bold">
                                    <ActivityIcon className="w-3 h-3 text-[#39A96B]" />
                                    {msg.snapDetails.attachedActivity.title}
                                  </span>
                                  <span>{msg.snapDetails.attachedActivity.distance} km</span>
                                </div>
                              )}
                            </div>
                          )}

                          {/* Message note / custom caption */}
                          {msg.text && (
                            <div className="px-3 pb-2 text-xs font-medium">
                              {msg.text}
                            </div>
                          )}
                        </div>
                      ) : (
                        /* Standard Text Message */
                        <div
                          className={`max-w-xs sm:max-w-sm px-4 py-2.5 rounded-2xl text-xs font-medium leading-relaxed shadow-sm ${
                            isMe
                              ? 'bg-[#087F5B] text-white rounded-br-none'
                              : 'bg-white dark:bg-[#173B32] text-[#173B32] dark:text-white rounded-bl-none border border-emerald-100 dark:border-emerald-800'
                          }`}
                        >
                          {msg.text}
                        </div>
                      )}

                      {/* Timestamp & Delivery Status */}
                      <div className="flex items-center gap-1 mt-1 text-[10px] text-slate-400 dark:text-emerald-400/60 px-1">
                        <span>{new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        {isMe && (
                          <span className="flex items-center gap-0.5 capitalize">
                            • {msg.deliveryStatus}
                            {msg.deliveryStatus === 'opened' ? (
                              <CheckCheck className="w-3 h-3 text-[#7BC96F]" />
                            ) : msg.deliveryStatus === 'delivered' ? (
                              <CheckCheck className="w-3 h-3 text-slate-400" />
                            ) : (
                              <Check className="w-3 h-3 text-slate-400" />
                            )}
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
                <div ref={messagesEndRef} />
              </div>

              {/* Message Input Box */}
              <form
                onSubmit={handleSendMessage}
                className="p-3 bg-white dark:bg-[#102A24] border-t border-emerald-100 dark:border-emerald-950/60 flex items-center gap-2"
              >
                <button
                  type="button"
                  onClick={() => openCamera()}
                  className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 hover:bg-emerald-100 dark:hover:bg-emerald-900/40 text-[#087F5B] dark:text-[#7BC96F] transition-colors"
                  title="Take or upload Snap"
                >
                  <Camera className="w-4 h-4" />
                </button>

                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="Send a private reply..."
                  className="flex-1 px-3.5 py-2 text-xs rounded-xl bg-[#F4FAF5] dark:bg-[#173B32] border border-emerald-200/60 dark:border-emerald-800/40 text-[#173B32] dark:text-white placeholder-slate-400 focus:outline-none focus:border-[#39A96B]"
                />

                <button
                  type="submit"
                  disabled={!inputText.trim()}
                  className={`p-2.5 rounded-xl transition-transform ${
                    inputText.trim()
                      ? 'bg-[#087F5B] hover:bg-[#076a4c] text-white active:scale-95'
                      : 'bg-slate-100 dark:bg-emerald-950/60 text-slate-300 dark:text-emerald-800 cursor-not-allowed'
                  }`}
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </>
          )}
        </div>
      </div>

      {/* Interactive Full-Screen Snap Viewer Modal for Received Snaps */}
      {activeViewingSnapMessage && activeViewingSnapMessage.snapDetails && (
        <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-3 select-none animate-in fade-in">
          <div className="relative w-full max-w-sm aspect-[9/16] bg-[#0A1F1A] rounded-3xl overflow-hidden border border-emerald-900 shadow-2xl flex flex-col justify-between">
            {/* Top Bar with Countdown Timer */}
            <div className="relative z-20 flex items-center justify-between p-4 bg-gradient-to-b from-black/80 via-black/30 to-transparent text-white">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold">{activeConv?.participant.name || 'Friend'}</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/20 uppercase font-semibold">
                  {activeViewingSnapMessage.snapDetails.viewMode.replace('_', ' ')}
                </span>
              </div>

              <div className="flex items-center gap-2">
                {activeViewingSnapMessage.snapDetails.viewMode === 'view_once' && (
                  <div className="w-7 h-7 rounded-full bg-rose-500 text-white font-extrabold text-xs flex items-center justify-center animate-pulse">
                    {viewCountdown}s
                  </div>
                )}
                <button
                  onClick={handleCloseSnapView}
                  className="p-1.5 rounded-full bg-white/20 hover:bg-white/30 text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Photo & Overlays */}
            <div className="relative flex-1 flex items-center justify-center overflow-hidden">
              <img
                src={activeViewingSnapMessage.mediaPath || 'https://images.unsplash.com/photo-1473496169904-658ba7c44d8a?auto=format&fit=crop&w=600&q=80'}
                alt="Snap"
                className="w-full h-full object-cover"
              />

              {/* Text overlay banner */}
              {activeViewingSnapMessage.snapDetails.textOverlay && (
                <div className="absolute top-16 left-4 right-4 text-center">
                  <span className="inline-block bg-black/70 backdrop-blur-md px-3.5 py-1.5 rounded-2xl text-white font-extrabold text-xs border border-white/20">
                    {activeViewingSnapMessage.snapDetails.textOverlay}
                  </span>
                </div>
              )}

              {/* Attached Activity */}
              {activeViewingSnapMessage.snapDetails.attachedActivity && (
                <div className="absolute top-28 left-4 right-4">
                  <div className="bg-[#173B32]/90 backdrop-blur-md border border-[#39A96B]/50 rounded-2xl p-2.5 text-white shadow-xl">
                    <div className="text-xs font-bold flex items-center gap-1.5 text-emerald-300">
                      <ActivityIcon className="w-3.5 h-3.5 text-[#39A96B]" />
                      {activeViewingSnapMessage.snapDetails.attachedActivity.title}
                    </div>
                    <div className="grid grid-cols-3 gap-2 text-center pt-1 mt-1 border-t border-emerald-800/50 text-[10px]">
                      <div>
                        <span className="block text-emerald-300/70">Distance</span>
                        <span className="font-bold">{activeViewingSnapMessage.snapDetails.attachedActivity.distance} km</span>
                      </div>
                      <div>
                        <span className="block text-emerald-300/70">Pace</span>
                        <span className="font-bold">{activeViewingSnapMessage.snapDetails.attachedActivity.avgPace || activeViewingSnapMessage.snapDetails.attachedActivity.pace || '4:50 /km'}</span>
                      </div>
                      <div>
                        <span className="block text-emerald-300/70">Eco</span>
                        <span className="font-bold text-[#7BC96F]">+{activeViewingSnapMessage.snapDetails.attachedActivity.ecoScore || 15}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Stickers */}
              {activeViewingSnapMessage.snapDetails.stickers && (
                <div className="absolute bottom-16 left-4 right-4 flex flex-wrap gap-1.5">
                  {activeViewingSnapMessage.snapDetails.stickers.map((stk) => (
                    <div
                      key={stk.id}
                      className="px-2.5 py-1 rounded-xl bg-white text-slate-900 font-extrabold text-[11px] shadow-lg flex items-center gap-1"
                    >
                      <span>{stk.emoji || stk.icon}</span>
                      <span>{stk.label}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Caption */}
              {activeViewingSnapMessage.snapDetails.caption && (
                <div className="absolute bottom-4 left-4 right-4">
                  <div className="bg-black/60 backdrop-blur-md rounded-xl px-3 py-1.5 text-xs text-white">
                    {activeViewingSnapMessage.snapDetails.caption}
                  </div>
                </div>
              )}
            </div>

            {/* Bottom prompt */}
            <div className="p-3 text-center bg-black/60 text-[10px] text-white/70">
              {activeViewingSnapMessage.snapDetails.viewMode === 'view_once'
                ? 'Disappears when closed or time expires'
                : 'Tap X to return to chat'}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
