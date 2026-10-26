import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { 
  User, 
  Habit, 
  Activity, 
  Post, 
  Badge, 
  EcoAction, 
  EcoChallenge, 
  MonthlyUpdateRecord, 
  NotificationItem, 
  MoodType,
  ActivityType,
  AIRecommendation,
  Story,
  Conversation,
  Message,
  Snap,
  SnapSticker,
  SnapViewMode,
  SnapDeliveryStatus,
  StoryAudience,
  AttachedActivitySummary
} from '../types';
import { 
  INITIAL_USER, 
  INITIAL_HABITS, 
  INITIAL_ACTIVITIES, 
  INITIAL_POSTS, 
  INITIAL_COMMUNITY_USERS,
  INITIAL_BADGES, 
  INITIAL_ECO_ACTIONS, 
  INITIAL_ECO_CHALLENGES, 
  INITIAL_NOTIFICATIONS, 
  INITIAL_MONTHLY_HISTORY,
  INITIAL_RECOMMENDATIONS
} from '../data/mockData';
import { authService } from '../services/auth';
import { gamificationService, calculateLevel, LevelInfo } from '../services/gamification';
import { ecoService } from '../services/eco';
import { communityService } from '../services/community';
import { recommendationService } from '../services/recommendations';
import { snapService } from '../services/snap';

export interface FlowMilestones {
  habitCompleted: boolean;
  checkinDone: boolean;
  activityLogged: boolean;
  proofShared: boolean;
  followedUser: boolean;
  monthlyPlanGenerated: boolean;
}

interface AppContextType {
  // Navigation
  currentRoute: string;
  navigate: (route: string) => void;
  theme: 'light' | 'dark';
  toggleTheme: () => void;

  // Auth & User
  user: User;
  isAuthenticated: boolean;
  login: (email: string) => void;
  loginDemo: () => void;
  logout: () => void;
  updateUser: (fields: Partial<User>) => void;

  // Habits
  habits: Habit[];
  toggleHabit: (habitId: string) => void;
  addHabit: (habit: Omit<Habit, 'id' | 'userId' | 'completed' | 'streak' | 'completedDates' | 'createdAt'>) => void;
  deleteHabit: (habitId: string) => void;
  editHabit: (habitId: string, updates: Partial<Habit>) => void;
  habitCompletionPercentage: number;

  // Gamification & Streaks
  xp: number;
  levelInfo: LevelInfo;
  streak: number;
  badges: Badge[];
  recentBadge: Badge | null;
  awardXP: (amount: number, reason?: string) => void;
  activeBadgeCelebration: Badge | null;
  showBadgeCelebration: (badge: Badge) => void;
  dismissBadgeCelebration: () => void;

  // Eco
  ecoScore: number;
  ecoActions: EcoAction[];
  ecoChallenges: EcoChallenge[];
  toggleEcoAction: (actionId: string) => void;

  // Activities
  activities: Activity[];
  addActivity: (activity: Activity) => void;
  activeProofActivity: Activity | null;
  setActiveProofActivity: (activity: Activity | null) => void;

  // Community
  posts: Post[];
  communityUsers: typeof INITIAL_COMMUNITY_USERS;
  toggleLikePost: (postId: string) => void;
  addCommentToPost: (postId: string, text: string) => void;
  createCommunityPost: (caption: string, activity?: Post['activity'], photos?: string[], badgeEarned?: string) => void;
  toggleFollowUser: (userId: string) => void;

  // Monthly
  monthlyHistory: MonthlyUpdateRecord[];
  addMonthlyUpdate: (record: MonthlyUpdateRecord) => void;

  // Notifications
  notifications: NotificationItem[];
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  unreadNotificationsCount: number;

  // Daily Check-in
  todayCheckinDone: boolean;
  submitCheckin: (mood: MoodType, text: string, habitIdsCompleted: string[]) => void;
  todayMood: MoodType | null;

  // AI & Recommendations
  recommendations: AIRecommendation[];
  refreshRecommendations: () => void;

  // Global Modals
  quickActionOpen: boolean;
  setQuickActionOpen: (open: boolean) => void;

  // Evaluation Walkthrough Milestones
  milestones: FlowMilestones;

  // VELORA SNAP & Stories & Inbox
  cameraOpen: boolean;
  initialSnapActivity: Activity | null;
  openCamera: (activity?: Activity) => void;
  closeCamera: () => void;
  stories: Story[];
  activeStory: Story | null;
  openStoryViewer: (storyId: string) => void;
  closeStoryViewer: () => void;
  publishStory: (storyData: {
    mediaPath: string;
    caption?: string;
    stickers?: SnapSticker[];
    textOverlay?: string;
    filter?: string;
    attachedActivity?: AttachedActivitySummary;
    audience?: StoryAudience;
  }) => void;
  deleteStory: (storyId: string) => void;
  conversations: Conversation[];
  messages: Record<string, Message[]>;
  activeConversationId: string | null;
  setActiveConversationId: (id: string | null) => void;
  sendSnap: (data: {
    mediaPath: string;
    caption?: string;
    stickers?: SnapSticker[];
    textOverlay?: string;
    filter?: string;
    viewMode: SnapViewMode;
    recipientIds: string[];
    audience?: StoryAudience;
    postToStory?: boolean;
    postToCommunity?: boolean;
    attachedActivity?: AttachedActivitySummary;
  }) => { snapId: string; firstConversationId?: string };
  sendMessage: (conversationId: string, text: string) => void;
  openSnapMessage: (messageId: string, conversationId: string) => void;
  inboxUnreadCount: number;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentRoute, setCurrentRoute] = useState<string>('/home');
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  // User & Auth
  const [user, setUser] = useState<User>(() => authService.getCurrentUser() || INITIAL_USER);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(true);

  // Habits
  const [habits, setHabits] = useState<Habit[]>(() => {
    try {
      const stored = localStorage.getItem('velora_habits');
      return stored ? JSON.parse(stored) : INITIAL_HABITS;
    } catch {
      return INITIAL_HABITS;
    }
  });

  // Gamification
  const [xp, setXp] = useState<number>(() => {
    try {
      const stored = localStorage.getItem('velora_xp');
      return stored ? Number(stored) : 450;
    } catch {
      return 450;
    }
  });
  const [streak, setStreak] = useState<number>(7);
  const [badges, setBadges] = useState<Badge[]>(() => {
    try {
      const stored = localStorage.getItem('velora_badges');
      return stored ? JSON.parse(stored) : INITIAL_BADGES;
    } catch {
      return INITIAL_BADGES;
    }
  });
  const [activeBadgeCelebration, setActiveBadgeCelebration] = useState<Badge | null>(null);

  // Eco
  const [ecoActions, setEcoActions] = useState<EcoAction[]>(() => {
    try {
      const stored = localStorage.getItem('velora_eco_actions');
      return stored ? JSON.parse(stored) : INITIAL_ECO_ACTIONS;
    } catch {
      return INITIAL_ECO_ACTIONS;
    }
  });
  const [ecoChallenges, setEcoChallenges] = useState<EcoChallenge[]>(INITIAL_ECO_CHALLENGES);

  // Activities
  const [activities, setActivities] = useState<Activity[]>(() => {
    try {
      const stored = localStorage.getItem('velora_activities');
      return stored ? JSON.parse(stored) : INITIAL_ACTIVITIES;
    } catch {
      return INITIAL_ACTIVITIES;
    }
  });
  const [activeProofActivity, setActiveProofActivity] = useState<Activity | null>(null);

  // Community
  const [posts, setPosts] = useState<Post[]>(() => communityService.getPosts());
  const [communityUsers, setCommunityUsers] = useState(INITIAL_COMMUNITY_USERS);

  // Monthly
  const [monthlyHistory, setMonthlyHistory] = useState<MonthlyUpdateRecord[]>(() => {
    try {
      const stored = localStorage.getItem('velora_monthly_history');
      return stored ? JSON.parse(stored) : INITIAL_MONTHLY_HISTORY;
    } catch {
      return INITIAL_MONTHLY_HISTORY;
    }
  });

  // Notifications
  const [notifications, setNotifications] = useState<NotificationItem[]>(() => {
    try {
      const stored = localStorage.getItem('velora_notifs');
      return stored ? JSON.parse(stored) : INITIAL_NOTIFICATIONS;
    } catch {
      return INITIAL_NOTIFICATIONS;
    }
  });

  // Checkin & Mood
  const [todayCheckinDone, setTodayCheckinDone] = useState<boolean>(false);
  const [todayMood, setTodayMood] = useState<MoodType | null>('😊 Happy');

  // Quick Action Modal
  const [quickActionOpen, setQuickActionOpen] = useState<boolean>(false);

  // AI recommendations
  const [recommendations, setRecommendations] = useState<AIRecommendation[]>(() => 
    recommendationService.getPersonalizedRecommendations(INITIAL_USER, INITIAL_HABITS.map(h => h.name))
  );

  // Guided Flow Milestones
  const [milestones, setMilestones] = useState<FlowMilestones>({
    habitCompleted: false,
    checkinDone: false,
    activityLogged: false,
    proofShared: false,
    followedUser: false,
    monthlyPlanGenerated: false,
  });

  // VELORA SNAP & Stories & Inbox
  const [cameraOpen, setCameraOpen] = useState<boolean>(false);
  const [initialSnapActivity, setInitialSnapActivity] = useState<Activity | null>(null);
  const [stories, setStories] = useState<Story[]>(() => snapService.getStories());
  const [activeStory, setActiveStory] = useState<Story | null>(null);
  const [conversations, setConversations] = useState<Conversation[]>(() => snapService.getConversations());
  const [messages, setMessages] = useState<Record<string, Message[]>>(() => snapService.getMessages());
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);

  // Sync Snap local storage
  useEffect(() => {
    snapService.saveStories(stories);
  }, [stories]);

  useEffect(() => {
    snapService.saveConversations(conversations);
  }, [conversations]);

  useEffect(() => {
    snapService.saveMessages(messages);
  }, [messages]);

  // Persistence
  useEffect(() => {
    try {
      localStorage.setItem('velora_habits', JSON.stringify(habits));
    } catch {}
  }, [habits]);

  useEffect(() => {
    try {
      localStorage.setItem('velora_xp', xp.toString());
    } catch {}
  }, [xp]);

  useEffect(() => {
    try {
      localStorage.setItem('velora_badges', JSON.stringify(badges));
    } catch {}
  }, [badges]);

  useEffect(() => {
    try {
      localStorage.setItem('velora_eco_actions', JSON.stringify(ecoActions));
    } catch {}
  }, [ecoActions]);

  useEffect(() => {
    try {
      localStorage.setItem('velora_activities', JSON.stringify(activities));
    } catch {}
  }, [activities]);

  useEffect(() => {
    try {
      localStorage.setItem('velora_notifs', JSON.stringify(notifications));
    } catch {}
  }, [notifications]);

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  // Derived state
  const levelInfo = calculateLevel(xp);
  const ecoScore = ecoService.calculateEcoScore(ecoActions, ecoChallenges);
  const habitCompletionPercentage = Math.round(
    (habits.filter(h => h.completed).length / Math.max(habits.length, 1)) * 100
  );
  const unreadNotificationsCount = notifications.filter(n => !n.read).length;
  const recentBadge = badges.find(b => b.unlocked) || null;

  const navigate = (route: string) => {
    setCurrentRoute(route);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  const loginDemo = () => {
    const u = authService.loginDemoUser();
    setUser(u);
    setIsAuthenticated(true);
    navigate('/home');
  };

  const login = (email: string) => {
    const u = authService.loginWithEmail(email);
    setUser(u);
    setIsAuthenticated(true);
    navigate('/home');
  };

  const logout = () => {
    authService.logout();
    setIsAuthenticated(false);
    navigate('/');
  };

  const updateUser = (fields: Partial<User>) => {
    const updated = authService.updateUserProfile(fields);
    setUser(updated);
    // Refresh recommendations whenever profile attributes update
    const recs = recommendationService.getPersonalizedRecommendations(updated, habits.map(h => h.name));
    setRecommendations(recs);
  };

  const checkAndAwardBadges = (currentStreakVal: number, activitiesCount: number, currentEcoScore: number) => {
    const { updatedBadges, newlyUnlocked } = gamificationService.checkBadgeUnlocks(badges, {
      streak: currentStreakVal,
      totalActivities: activitiesCount,
      ecoScore: currentEcoScore,
      habitCount: habits.filter(h => h.completed).length
    });

    if (newlyUnlocked.length > 0) {
      setBadges(updatedBadges);
      setActiveBadgeCelebration(newlyUnlocked[0]);
      // Add notification
      const notif: NotificationItem = {
        id: `notif-${Date.now()}`,
        title: `⭐ Unlocked ${newlyUnlocked[0].name}!`,
        message: newlyUnlocked[0].description,
        type: 'badge',
        read: false,
        timestamp: 'Just now'
      };
      setNotifications(prev => [notif, ...prev]);
    }
  };

  const awardXP = (amount: number, reason?: string) => {
    setXp(prev => {
      const nextXp = prev + amount;
      const prevLvl = calculateLevel(prev).level;
      const nextLvl = calculateLevel(nextXp).level;
      if (nextLvl > prevLvl) {
        gamificationService.triggerCelebration();
      }
      return nextXp;
    });

    if (reason) {
      const notif: NotificationItem = {
        id: `notif-${Date.now()}`,
        title: `+${amount} XP Earned!`,
        message: reason,
        type: 'badge',
        read: false,
        timestamp: 'Just now'
      };
      setNotifications(prev => [notif, ...prev]);
    }
  };

  const toggleHabit = (habitId: string) => {
    setHabits(prev =>
      prev.map(h => {
        if (h.id === habitId) {
          const nextCompleted = !h.completed;
          if (nextCompleted) {
            awardXP(h.xpValue || 10, `Completed habit: ${h.name}`);
            gamificationService.triggerCelebration();
            setMilestones(m => ({ ...m, habitCompleted: true }));
          }
          const nextStreak = nextCompleted ? h.streak + 1 : Math.max(0, h.streak - 1);
          checkAndAwardBadges(Math.max(streak, nextStreak), activities.length, ecoScore);
          return {
            ...h,
            completed: nextCompleted,
            streak: nextStreak
          };
        }
        return h;
      })
    );
  };

  const addHabit = (data: Omit<Habit, 'id' | 'userId' | 'completed' | 'streak' | 'completedDates' | 'createdAt'>) => {
    const newHabit: Habit = {
      ...data,
      id: `habit-${Date.now()}`,
      userId: user.id,
      completed: false,
      streak: 0,
      completedDates: [],
      createdAt: new Date().toISOString()
    };
    setHabits(prev => [newHabit, ...prev]);
    awardXP(15, `Added new habit: ${newHabit.name}`);
    gamificationService.triggerCelebration();
  };

  const deleteHabit = (habitId: string) => {
    setHabits(prev => prev.filter(h => h.id !== habitId));
  };

  const editHabit = (habitId: string, updates: Partial<Habit>) => {
    setHabits(prev => prev.map(h => (h.id === habitId ? { ...h, ...updates } : h)));
  };

  const toggleEcoAction = (actionId: string) => {
    setEcoActions(prev => {
      const updated = prev.map(a => {
        if (a.id === actionId) {
          const nextCompleted = !a.completed;
          if (nextCompleted) {
            awardXP(10, `Completed Eco Action: ${a.label}`);
          }
          return { ...a, completed: nextCompleted };
        }
        return a;
      });
      const newScore = ecoService.calculateEcoScore(updated, ecoChallenges);
      checkAndAwardBadges(streak, activities.length, newScore);
      return updated;
    });
  };

  const addActivity = (activity: Activity) => {
    setActivities(prev => [activity, ...prev]);
    setActiveProofActivity(activity);
    awardXP(activity.xpEarned, `Completed ${activity.type} (${activity.distance} km)`);
    setMilestones(m => ({ ...m, activityLogged: true }));
    checkAndAwardBadges(streak, activities.length + 1, ecoScore);
  };

  const toggleLikePost = (postId: string) => {
    setPosts(prev =>
      prev.map(post => {
        if (post.id === postId) {
          const nextLiked = !post.hasLiked;
          return {
            ...post,
            hasLiked: nextLiked,
            likes: nextLiked ? post.likes + 1 : Math.max(0, post.likes - 1)
          };
        }
        return post;
      })
    );
  };

  const addCommentToPost = (postId: string, text: string) => {
    const updated = communityService.addComment(postId, user, text);
    setPosts(updated);
  };

  const createCommunityPost = (
    caption: string, 
    activity?: Post['activity'], 
    photos?: string[], 
    badgeEarned?: string
  ) => {
    const newPost = communityService.createPost(user, caption, activity, photos, badgeEarned);
    setPosts(prev => [newPost, ...prev]);
    awardXP(10, 'Earned +10 Community XP for posting workout proof');
    gamificationService.triggerCelebration();
    setMilestones(m => ({ ...m, proofShared: true }));
  };

  const toggleFollowUser = (userId: string) => {
    setCommunityUsers(prev =>
      prev.map(u => {
        if (u.id === userId) {
          const nextFollowing = !u.isFollowing;
          setUser(cur => ({
            ...cur,
            followingCount: nextFollowing ? cur.followingCount + 1 : Math.max(0, cur.followingCount - 1)
          }));
          if (nextFollowing) {
            setMilestones(m => ({ ...m, followedUser: true }));
            awardXP(5, `Followed ${u.name}`);
          }
          return {
            ...u,
            isFollowing: nextFollowing,
            followersCount: nextFollowing ? u.followersCount + 1 : Math.max(0, u.followersCount - 1)
          };
        }
        return u;
      })
    );
  };

  const addMonthlyUpdate = (record: MonthlyUpdateRecord) => {
    setMonthlyHistory(prev => [record, ...prev]);
    try {
      localStorage.setItem('velora_monthly_history', JSON.stringify([record, ...monthlyHistory]));
    } catch {}

    // Update active habits to align with updated plan
    if (record.plan.newPlan.walkingDuration) {
      setHabits(prev => {
        const hasWalking = prev.find(h => h.name.toLowerCase().includes('walk'));
        if (hasWalking) {
          return prev.map(h => 
            h.id === hasWalking.id 
              ? { ...h, name: record.plan.newPlan.walkingDuration, difficulty: record.plan.newPlan.difficulty }
              : h
          );
        }
        return prev;
      });
    }

    // Refresh recommendations with new targets
    refreshRecommendations();
    awardXP(50, `Completed ${record.monthName} Monthly Personalization Review!`);
    gamificationService.triggerCelebration();
    setMilestones(m => ({ ...m, monthlyPlanGenerated: true }));
  };

  const markNotificationRead = (id: string) => {
    setNotifications(prev => prev.map(n => (n.id === id ? { ...n, read: true } : n)));
  };

  const markAllNotificationsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const submitCheckin = (mood: MoodType, text: string, habitIdsCompleted: string[]) => {
    setTodayCheckinDone(true);
    setTodayMood(mood);
    setHabits(prev =>
      prev.map(h => ({
        ...h,
        completed: habitIdsCompleted.includes(h.id)
      }))
    );
    awardXP(25, 'Daily check-in and mood reflection logged');
    gamificationService.triggerCelebration();
    setMilestones(m => ({ ...m, checkinDone: true }));
  };

  const refreshRecommendations = () => {
    const recs = recommendationService.getPersonalizedRecommendations(user, habits.map(h => h.name));
    setRecommendations(recs);
  };

  const showBadgeCelebration = (badge: Badge) => {
    setActiveBadgeCelebration(badge);
    gamificationService.triggerCelebration();
  };

  const dismissBadgeCelebration = () => {
    setActiveBadgeCelebration(null);
  };

  // Camera & Snap handlers
  const openCamera = (activity?: Activity) => {
    setInitialSnapActivity(activity || null);
    setCameraOpen(true);
  };

  const closeCamera = () => {
    setCameraOpen(false);
    setInitialSnapActivity(null);
  };

  const openStoryViewer = (storyId: string) => {
    const found = stories.find(s => s.id === storyId);
    if (found) {
      const updated = snapService.markStoryAsViewed(storyId, user.id, user.name, user.avatar);
      setStories(updated);
      setActiveStory(found);
    }
  };

  const closeStoryViewer = () => {
    setActiveStory(null);
  };

  const publishStory = (storyData: {
    mediaPath: string;
    caption?: string;
    stickers?: SnapSticker[];
    textOverlay?: string;
    filter?: string;
    attachedActivity?: AttachedActivitySummary;
    audience?: StoryAudience;
  }) => {
    const created = snapService.createStory(
      user.id,
      user.name,
      user.username,
      user.avatar,
      storyData.mediaPath,
      storyData.caption,
      storyData.stickers,
      storyData.textOverlay,
      storyData.filter,
      storyData.attachedActivity,
      storyData.audience || 'followers'
    );
    setStories(prev => [created, ...prev.filter(s => s.id !== created.id)]);
    awardXP(15, 'Published a 24h VELORA Story');
    gamificationService.triggerCelebration();

    const notif: NotificationItem = {
      id: `notif-story-${Date.now()}`,
      title: '📖 Story Published',
      message: 'Your 24-hour VELORA Story is live for followers to see.',
      type: 'social',
      read: false,
      timestamp: 'Just now'
    };
    setNotifications(prev => [notif, ...prev]);
  };

  const deleteStory = (storyId: string) => {
    const updated = snapService.deleteStory(storyId);
    setStories(updated);
    if (activeStory?.id === storyId) {
      setActiveStory(null);
    }
  };

  const sendSnap = (data: {
    mediaPath: string;
    caption?: string;
    stickers?: SnapSticker[];
    textOverlay?: string;
    filter?: string;
    viewMode: SnapViewMode;
    recipientIds: string[];
    audience?: StoryAudience;
    postToStory?: boolean;
    postToCommunity?: boolean;
    attachedActivity?: AttachedActivitySummary;
  }) => {
    const snapId = `snap-${Date.now()}`;
    let firstConvId: string | undefined = undefined;

    // Send private snap message to each selected recipient
    data.recipientIds.forEach(recId => {
      const targetUser = communityUsers.find(u => u.id === recId) || {
        id: recId,
        name: recId === 'user-priya-102' ? 'Priya Sharma' : 'Friend',
        username: 'friend',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80'
      };

      // Find or create conversation
      const conv = conversations.find(c => c.participant.id === recId || c.participantIds.includes(recId));
      const convId = conv ? conv.id : `conv-${recId}`;

      if (!firstConvId) {
        firstConvId = convId;
      }

      const snapMessage: Message = {
        id: `msg-${Date.now()}-${recId}`,
        conversationId: convId,
        senderId: user.id,
        type: 'snap',
        mediaPath: data.mediaPath,
        snapDetails: {
          snapId,
          viewMode: data.viewMode,
          status: 'sent',
          caption: data.caption,
          stickers: data.stickers,
          textOverlay: data.textOverlay,
          filter: data.filter,
          attachedActivity: data.attachedActivity,
          replayedCount: 0
        },
        deliveryStatus: 'sent',
        createdAt: new Date().toISOString()
      };

      setMessages(prev => ({
        ...prev,
        [convId]: [...(prev[convId] || []), snapMessage]
      }));

      // Update conversation in list
      setConversations(prev => {
        const existingIdx = prev.findIndex(c => c.id === convId);
        const updatedConv: Conversation = {
          id: convId,
          participantIds: [user.id, recId],
          participant: {
            id: targetUser.id,
            name: targetUser.name,
            username: targetUser.username,
            avatar: targetUser.avatar,
            isFollowing: (targetUser as any).isFollowing
          },
          lastMessage: {
            id: snapMessage.id,
            text: '📸 Sent a Snap',
            senderId: user.id,
            timestamp: 'Just now',
            isSnap: true,
            snapStatus: 'sent'
          },
          unreadCount: 0,
          updatedAt: new Date().toISOString()
        };

        if (existingIdx !== -1) {
          const list = [...prev];
          list[existingIdx] = updatedConv;
          return list;
        }
        return [updatedConv, ...prev];
      });
    });

    // Optionally post to Story
    if (data.postToStory) {
      publishStory({
        mediaPath: data.mediaPath,
        caption: data.caption,
        stickers: data.stickers,
        textOverlay: data.textOverlay,
        filter: data.filter,
        attachedActivity: data.attachedActivity,
        audience: data.audience || 'followers'
      });
    }

    // Optionally create Community Post
    if (data.postToCommunity) {
      const actData = data.attachedActivity ? {
        type: data.attachedActivity.type,
        distance: data.attachedActivity.distance,
        duration: typeof data.attachedActivity.duration === 'number' ? data.attachedActivity.duration : 1200,
        calories: data.attachedActivity.calories || 250,
        elevation: 25
      } : undefined;

      createCommunityPost(
        data.caption || 'Captured via VELORA Snap! 🌿',
        actData,
        [data.mediaPath],
        data.stickers?.[0]?.label
      );
    }

    awardXP(20, 'Sent a VELORA Snap (+20 XP)');
    gamificationService.triggerCelebration();

    return { snapId, firstConversationId: firstConvId };
  };

  const sendMessage = (conversationId: string, text: string) => {
    if (!text.trim()) return;
    const msgId = `msg-${Date.now()}`;
    const newMsg: Message = {
      id: msgId,
      conversationId,
      senderId: user.id,
      type: 'text',
      text: text.trim(),
      deliveryStatus: 'sent',
      createdAt: new Date().toISOString()
    };

    setMessages(prev => ({
      ...prev,
      [conversationId]: [...(prev[conversationId] || []), newMsg]
    }));

    setConversations(prev =>
      prev.map(c => {
        if (c.id === conversationId) {
          return {
            ...c,
            lastMessage: {
              id: msgId,
              text: text.trim(),
              senderId: user.id,
              timestamp: 'Just now',
              isSnap: false
            },
            updatedAt: new Date().toISOString()
          };
        }
        return c;
      })
    );

    awardXP(5, 'Sent message');
  };

  const openSnapMessage = (messageId: string, conversationId: string) => {
    setMessages(prev => {
      const thread = prev[conversationId] || [];
      const updatedThread = thread.map(m => {
        if (m.id === messageId && m.snapDetails) {
          return {
            ...m,
            deliveryStatus: 'opened' as SnapDeliveryStatus,
            openedAt: new Date().toISOString(),
            snapDetails: {
              ...m.snapDetails,
              status: 'opened' as SnapDeliveryStatus,
              openedAt: new Date().toISOString(),
              replayedCount: (m.snapDetails.replayedCount || 0) + 1
            }
          };
        }
        return m;
      });
      return {
        ...prev,
        [conversationId]: updatedThread
      };
    });

    setConversations(prev =>
      prev.map(c => {
        if (c.id === conversationId) {
          return {
            ...c,
            unreadCount: Math.max(0, (c.unreadCount || 1) - 1),
            lastMessage: c.lastMessage?.id === messageId ? {
              ...c.lastMessage,
              snapStatus: 'opened' as SnapDeliveryStatus
            } : c.lastMessage
          };
        }
        return c;
      })
    );
  };

  const inboxUnreadCount = conversations.reduce((sum, c) => sum + (c.unreadCount || 0), 0);

  return (
    <AppContext.Provider
      value={{
        currentRoute,
        navigate,
        theme,
        toggleTheme,
        user,
        isAuthenticated,
        login,
        loginDemo,
        logout,
        updateUser,
        habits,
        toggleHabit,
        addHabit,
        deleteHabit,
        editHabit,
        habitCompletionPercentage,
        xp,
        levelInfo,
        streak,
        badges,
        recentBadge,
        awardXP,
        activeBadgeCelebration,
        showBadgeCelebration,
        dismissBadgeCelebration,
        ecoScore,
        ecoActions,
        ecoChallenges,
        toggleEcoAction,
        activities,
        addActivity,
        activeProofActivity,
        setActiveProofActivity,
        posts,
        communityUsers,
        toggleLikePost,
        addCommentToPost,
        createCommunityPost,
        toggleFollowUser,
        monthlyHistory,
        addMonthlyUpdate,
        notifications,
        markNotificationRead,
        markAllNotificationsRead,
        unreadNotificationsCount,
        todayCheckinDone,
        submitCheckin,
        todayMood,
        recommendations,
        refreshRecommendations,
        quickActionOpen,
        setQuickActionOpen,
        milestones,
        cameraOpen,
        initialSnapActivity,
        openCamera,
        closeCamera,
        stories,
        activeStory,
        openStoryViewer,
        closeStoryViewer,
        publishStory,
        deleteStory,
        conversations,
        messages,
        activeConversationId,
        setActiveConversationId,
        sendSnap,
        sendMessage,
        openSnapMessage,
        inboxUnreadCount
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within an AppProvider');
  return context;
};
