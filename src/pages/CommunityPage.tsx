import React, { useState } from 'react';
import { 
  Users, 
  Heart, 
  MessageCircle, 
  Share2, 
  Plus, 
  MapPin, 
  Flame, 
  Award, 
  Sparkles, 
  UserCheck, 
  UserPlus, 
  Send,
  Leaf,
  Camera
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Post } from '../types';
import { StoriesBar } from '../components/snap/StoriesBar';

interface CommunityPageProps {
  onOpenCreatePost: () => void;
}

export const CommunityPage: React.FC<CommunityPageProps> = ({ onOpenCreatePost }) => {
  const { 
    posts, 
    communityUsers, 
    toggleLikePost, 
    addCommentToPost, 
    toggleFollowUser, 
    user,
    navigate,
    openCamera
  } = useApp();

  const [activeTab, setActiveTab] = useState<'for_you' | 'following' | 'discover'>('for_you');
  const [activeCommentPostId, setActiveCommentPostId] = useState<string | null>(null);
  const [commentInput, setCommentInput] = useState<string>('');
  const [searchUserQuery, setSearchUserQuery] = useState<string>('');

  const filteredPosts = activeTab === 'following'
    ? posts.filter(p => p.userId === user.id || communityUsers.some(u => u.id === p.userId && u.isFollowing))
    : posts;

  const filteredCommunityUsers = communityUsers.filter(u =>
    u.name.toLowerCase().includes(searchUserQuery.toLowerCase()) ||
    u.username.toLowerCase().includes(searchUserQuery.toLowerCase()) ||
    u.goals.some(g => g.toLowerCase().includes(searchUserQuery.toLowerCase()))
  );

  const handleAddComment = (postId: string) => {
    if (!commentInput.trim()) return;
    addCommentToPost(postId, commentInput.trim());
    setCommentInput('');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#173B32] dark:text-emerald-50">
            Social Community
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-emerald-300/80 mt-1">
            Connect with friends, share activity proof, and cheer on sustainable habits.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            onClick={() => openCamera()}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-2xl bg-gradient-to-r from-[#087F5B] to-[#39A96B] hover:brightness-110 text-white font-bold text-xs sm:text-sm shadow-md shadow-[#087F5B]/30 hover:scale-105 active:scale-95 transition-all"
          >
            <Camera className="w-4 h-4" />
            <span>VELORA Snap</span>
          </button>

          <button
            onClick={onOpenCreatePost}
            className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-white dark:bg-emerald-950/80 border border-emerald-200 dark:border-emerald-800 text-[#087F5B] dark:text-emerald-200 hover:bg-emerald-50 dark:hover:bg-emerald-900/40 font-bold text-xs sm:text-sm shadow-sm transition-all"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>Share Proof</span>
          </button>
        </div>
      </div>

      {/* Stories Bar */}
      <StoriesBar />

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-emerald-100 dark:border-emerald-900/40 pb-2">
        {[
          { key: 'for_you', label: 'For You' },
          { key: 'following', label: 'Following' },
          { key: 'discover', label: 'Discover Members' },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key as any)}
            className={`px-4 py-2 rounded-2xl text-xs sm:text-sm font-bold transition-all ${
              activeTab === tab.key
                ? 'bg-[#087F5B] text-white shadow-sm'
                : 'text-slate-600 dark:text-emerald-200 hover:bg-emerald-50 dark:hover:bg-emerald-900/20'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* DISCOVER TAB: Users List */}
      {activeTab === 'discover' && (
        <div className="space-y-4">
          <input
            type="text"
            value={searchUserQuery}
            onChange={(e) => setSearchUserQuery(e.target.value)}
            placeholder="Search community by name, username, or goals (e.g. 'Fitness', 'Priya')..."
            className="w-full px-4 py-3 rounded-2xl bg-white dark:bg-[#102A24] border border-emerald-200/70 dark:border-emerald-800 text-xs sm:text-sm text-[#173B32] dark:text-emerald-100 focus:outline-none focus:ring-2 focus:ring-[#087F5B]"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredCommunityUsers.map((u) => (
              <div
                key={u.id}
                className="p-5 rounded-3xl bg-white dark:bg-[#102A24] border border-emerald-100 dark:border-emerald-900/40 shadow-sm flex items-start justify-between gap-4"
              >
                <div 
                  onClick={() => navigate(`/profile/${u.username}`)}
                  className="flex items-start gap-3 cursor-pointer group flex-1"
                >
                  <img
                    src={u.avatar}
                    alt={u.name}
                    className="w-12 h-12 rounded-2xl object-cover ring-2 ring-emerald-100 dark:ring-emerald-800 group-hover:scale-105 transition-transform"
                  />
                  <div>
                    <h4 className="text-sm font-extrabold text-[#173B32] dark:text-emerald-100 group-hover:text-[#087F5B]">
                      {u.name}
                    </h4>
                    <span className="text-[11px] text-slate-400 block">@{u.username}</span>
                    <p className="text-xs text-slate-500 dark:text-emerald-300/80 mt-1 line-clamp-2">
                      {u.bio}
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      {u.goals.map((g) => (
                        <span key={g} className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300">
                          {g}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => toggleFollowUser(u.id)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 ${
                    u.isFollowing
                      ? 'bg-slate-100 dark:bg-emerald-950/50 text-slate-600 dark:text-emerald-300 hover:bg-rose-50 hover:text-rose-600'
                      : 'bg-[#087F5B] hover:bg-[#076a4c] text-white shadow-sm'
                  }`}
                >
                  {u.isFollowing ? 'Following' : 'Follow'}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* FEED (FOR YOU / FOLLOWING) */}
      {activeTab !== 'discover' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Feed Column */}
          <div className="lg:col-span-2 space-y-5">
            {filteredPosts.map((post) => (
              <div
                key={post.id}
                className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-[#102A24] border border-emerald-100 dark:border-emerald-900/40 shadow-sm space-y-4"
              >
                {/* Author Info */}
                <div className="flex items-center justify-between">
                  <div 
                    onClick={() => navigate(`/profile/${post.authorUsername}`)}
                    className="flex items-center gap-3 cursor-pointer group"
                  >
                    <img
                      src={post.authorAvatar}
                      alt={post.authorName}
                      className="w-10 h-10 rounded-full object-cover ring-2 ring-emerald-100 dark:ring-emerald-800 group-hover:scale-105 transition-transform"
                    />
                    <div>
                      <h4 className="text-sm font-extrabold text-[#173B32] dark:text-emerald-100 group-hover:text-[#087F5B]">
                        {post.authorName}
                      </h4>
                      <span className="text-[11px] text-slate-400">@{post.authorUsername} • {post.timestamp}</span>
                    </div>
                  </div>

                  {post.badgeEarned && (
                    <span className="flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
                      <Award className="w-3.5 h-3.5 text-[#F4A261]" />
                      {post.badgeEarned}
                    </span>
                  )}
                </div>

                {/* Caption */}
                <p className="text-sm text-[#173B32] dark:text-emerald-100 leading-relaxed">
                  {post.caption}
                </p>

                {/* Activity Stats Tag */}
                {post.activity && (
                  <div className="p-3.5 rounded-2xl bg-[#F4FAF5] dark:bg-[#173B32] border border-emerald-100 dark:border-emerald-800/40 grid grid-cols-4 gap-2 text-center">
                    <div>
                      <span className="text-[10px] text-slate-400 block font-bold">TYPE</span>
                      <span className="text-xs font-bold text-[#087F5B] dark:text-[#7BC96F]">{post.activity.type}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block font-bold">DISTANCE</span>
                      <span className="text-xs font-bold text-[#4DA3D9] font-mono">{post.activity.distance} km</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block font-bold">TIME</span>
                      <span className="text-xs font-bold text-slate-700 dark:text-emerald-200 font-mono">
                        {Math.floor(post.activity.duration / 60)} min
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block font-bold">CALORIES</span>
                      <span className="text-xs font-bold text-[#F4A261] font-mono">{post.activity.calories} kcal</span>
                    </div>
                  </div>
                )}

                {/* Photo Proof */}
                {post.photos && post.photos.length > 0 && (
                  <div className="rounded-2xl overflow-hidden max-h-80 aspect-video shadow-sm">
                    <img
                      src={post.photos[0]}
                      alt="workout proof"
                      className="w-full h-full object-cover hover:scale-102 transition-transform duration-300"
                    />
                  </div>
                )}

                {/* Action Strip: Like, Comment, Share */}
                <div className="flex items-center justify-between pt-3 border-t border-emerald-50 dark:border-emerald-900/30">
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => toggleLikePost(post.id)}
                      className={`flex items-center gap-1.5 text-xs font-bold transition-colors ${
                        post.hasLiked ? 'text-rose-500' : 'text-slate-500 dark:text-emerald-300 hover:text-rose-500'
                      }`}
                    >
                      <Heart className={`w-4 h-4 ${post.hasLiked ? 'fill-current' : ''}`} />
                      <span>{post.likes}</span>
                    </button>

                    <button
                      onClick={() => setActiveCommentPostId(activeCommentPostId === post.id ? null : post.id)}
                      className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 dark:text-emerald-300 hover:text-[#087F5B]"
                    >
                      <MessageCircle className="w-4 h-4" />
                      <span>{post.comments.length} Comments</span>
                    </button>
                  </div>

                  <button
                    onClick={() => alert('Post link copied to clipboard!')}
                    className="text-slate-400 hover:text-slate-600 dark:hover:text-emerald-300"
                    title="Share Post"
                  >
                    <Share2 className="w-4 h-4" />
                  </button>
                </div>

                {/* Comments Section Drawer */}
                {activeCommentPostId === post.id && (
                  <div className="pt-3 border-t border-emerald-100 dark:border-emerald-900/40 space-y-3">
                    <div className="space-y-2">
                      {post.comments.map((c) => (
                        <div key={c.id} className="p-2.5 rounded-xl bg-[#F4FAF5] dark:bg-[#173B32] text-xs">
                          <span className="font-bold text-[#173B32] dark:text-emerald-100">{c.userName}: </span>
                          <span className="text-slate-600 dark:text-emerald-200">{c.text}</span>
                        </div>
                      ))}
                    </div>

                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={commentInput}
                        onChange={(e) => setCommentInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            handleAddComment(post.id);
                          }
                        }}
                        placeholder="Write an encouraging comment (press Enter)..."
                        className="flex-1 px-3.5 py-2.5 rounded-xl bg-[#F4FAF5] dark:bg-[#173B32] border border-emerald-200/70 dark:border-emerald-800 text-xs focus:outline-none focus:ring-1 focus:ring-[#087F5B]"
                      />
                      <button
                        onClick={() => handleAddComment(post.id)}
                        disabled={!commentInput.trim()}
                        className="px-4 py-2.5 rounded-xl bg-[#087F5B] disabled:opacity-50 text-white text-xs font-bold hover:bg-[#076a4c] transition-colors"
                      >
                        <Send className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="flex items-center gap-2 pt-1">
                      {['🔥 Keep it up!', '🌱 Inspiring eco effort!', '💪 Super consistent!'].map((quick) => (
                        <button
                          key={quick}
                          type="button"
                          onClick={() => {
                            addCommentToPost(post.id, quick);
                          }}
                          className="text-[10px] px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 hover:bg-emerald-100 transition-colors"
                        >
                          {quick}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Right Column: Suggested Friends to Follow */}
          <div className="space-y-4">
            <div className="p-5 rounded-3xl bg-white dark:bg-[#102A24] border border-emerald-100 dark:border-emerald-900/40 shadow-sm">
              <h3 className="text-sm font-extrabold text-[#173B32] dark:text-emerald-100 mb-3 flex items-center gap-2">
                <Users className="w-4 h-4 text-[#087F5B]" />
                Suggested Friends
              </h3>

              <div className="space-y-3">
                {communityUsers.slice(0, 4).map((u) => (
                  <div key={u.id} className="flex items-center justify-between gap-3">
                    <div 
                      onClick={() => navigate(`/profile/${u.username}`)}
                      className="flex items-center gap-2.5 cursor-pointer flex-1 min-w-0"
                    >
                      <img src={u.avatar} alt={u.name} className="w-9 h-9 rounded-full object-cover" />
                      <div className="min-w-0">
                        <h4 className="text-xs font-bold text-[#173B32] dark:text-emerald-100 truncate">
                          {u.name}
                        </h4>
                        <span className="text-[10px] text-slate-400 block truncate">@{u.username}</span>
                      </div>
                    </div>

                    <button
                      onClick={() => toggleFollowUser(u.id)}
                      className={`px-3 py-1.5 rounded-xl text-[11px] font-bold transition-all shrink-0 ${
                        u.isFollowing
                          ? 'bg-slate-100 dark:bg-emerald-950/50 text-slate-600 dark:text-emerald-300'
                          : 'bg-[#087F5B] text-white shadow-sm'
                      }`}
                    >
                      {u.isFollowing ? 'Following' : 'Follow'}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
