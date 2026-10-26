// VELORA Core Types & Data Models

export type GoalType = 
  | 'Fitness'
  | 'Health'
  | 'Study'
  | 'Productivity'
  | 'Mental Wellness'
  | 'Sustainability';

export type ActivityLevel = 'Sedentary' | 'Light' | 'Moderate' | 'Active' | 'Very Active';

export type DietType = 'Vegetarian' | 'Non-Vegetarian' | 'Vegan' | 'Other';

export type DifficultyLevel = 'Beginner' | 'Intermediate' | 'Advanced';

export type AvailableTime = '15 minutes' | '30 minutes' | '45 minutes' | '60+ minutes';

export type HabitCategory = 
  | 'Personal'
  | 'Health'
  | 'Fitness'
  | 'Productivity'
  | 'Mental Wellness'
  | 'Sustainability';

export type MoodType = '😊 Happy' | '🙂 Good' | '😐 Okay' | '😔 Sad' | '😣 Stressed' | '😴 Tired';

export type ActivityType = 'Walking' | 'Running' | 'Cycling' | 'Hiking' | 'Other';

export type Visibility = 'public' | 'followers' | 'private';

export interface User {
  id: string;
  name: string;
  username: string;
  email: string;
  avatar: string;
  bio: string;
  age: number;
  gender: string;
  // Private health details
  height: number; // cm
  weight: number; // kg
  bodyFat?: number; // %
  isHealthPrivate: boolean;
  activityLevel: ActivityLevel;
  sleepDuration: number; // hours
  diet: DietType;
  goals: GoalType[];
  interests: string[];
  availableTime: AvailableTime;
  difficulty: DifficultyLevel;
  activityVisibility: Visibility;
  postVisibility: Visibility;
  followersCount: number;
  followingCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface Habit {
  id: string;
  userId: string;
  name: string;
  description: string;
  category: HabitCategory;
  frequency: 'daily' | 'weekdays' | 'weekends' | '3x_week';
  difficulty: DifficultyLevel;
  reminder?: string;
  time?: string;
  healthBenefit: string;
  ecoImpact: string;
  completed: boolean;
  streak: number;
  xpValue: number;
  ecoPoints: number;
  completedDates: string[]; // YYYY-MM-DD
  createdAt: string;
}

export interface CheckIn {
  id: string;
  userId: string;
  date: string;
  completedHabitIds: string[];
  skippedHabitIds: string[];
  mood: MoodType;
  moodText: string;
  timestamp: string;
}

export interface ActivityCoordinate {
  lat: number;
  lng: number;
  timestamp?: number;
}

export interface Activity {
  id: string;
  userId: string;
  type: ActivityType;
  title: string;
  distance: number; // in km
  duration: number; // in seconds
  pace: string; // e.g. "5'32\" /km"
  speed: number; // km/h
  calories: number; // kcal
  elevation: number; // meters
  route: ActivityCoordinate[];
  proof?: {
    photoUrl?: string;
    caption?: string;
    screenshotUrl?: string;
  };
  visibility: Visibility;
  xpEarned: number;
  ecoPointsEarned: number;
  timestamp: string;
}

export interface Comment {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  text: string;
  timestamp: string;
}

export interface Post {
  id: string;
  userId: string;
  authorName: string;
  authorUsername: string;
  authorAvatar: string;
  caption: string;
  activity?: {
    type: ActivityType;
    distance: number;
    duration: number;
    calories: number;
    elevation: number;
  };
  photos?: string[];
  likes: number;
  hasLiked: boolean;
  comments: Comment[];
  badgeEarned?: string;
  visibility: Visibility;
  timestamp: string;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: 'streak' | 'eco' | 'activity' | 'habit' | 'community';
  unlocked: boolean;
  unlockedAt?: string;
  requirement: string;
}

export interface EcoAction {
  id: string;
  label: string;
  category: string;
  points: number;
  completed: boolean;
  co2SavedGrams: number;
}

export interface EcoChallenge {
  id: string;
  title: string;
  description: string;
  points: number;
  progress: number;
  target: number;
  unit: string;
  completed: boolean;
  icon: string;
}

export interface MonthlyPlanComparison {
  oldPlan: {
    walkingDuration: string;
    frequency: string;
    difficulty: DifficultyLevel;
    habitsCount: number;
  };
  newPlan: {
    walkingDuration: string;
    frequency: string;
    difficulty: DifficultyLevel;
    habitsCount: number;
  };
  summary: string;
  reason: string;
  newHabits: string[];
}

export interface MonthlyUpdateRecord {
  id: string;
  userId: string;
  monthName: string;
  year: number;
  prevWeight: number;
  currentWeight: number;
  height: number;
  activityLevel: ActivityLevel;
  sleepDuration: number;
  goals: GoalType[];
  newGoals: GoalType[];
  mood: MoodType;
  availableTime: AvailableTime;
  difficulty: DifficultyLevel;
  plan: MonthlyPlanComparison;
  accepted: boolean;
  timestamp: string;
  stats: {
    habitCompletionRate: number;
    totalDistanceKm: number;
    streak: number;
    ecoScore: number;
  };
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: 'streak' | 'badge' | 'eco' | 'activity' | 'ai' | 'monthly' | 'social' | 'snap' | 'message' | 'story';
  read: boolean;
  timestamp: string;
  icon?: string;
  linkRoute?: string;
}

export interface AIRecommendation {
  id: string;
  name: string;
  category: HabitCategory;
  matchPercentage: number;
  reason: string;
  difficulty: DifficultyLevel;
  benefit: string;
  duration: string;
  ecoPoints: number;
  xp: number;
  whyDetails: string;
}

// ==========================================
// VELORA SNAP DATA MODELS
// ==========================================

export type SnapViewMode = 'view_once' | 'replay_allowed' | 'save_in_chat' | 'replay';
export type SnapDeliveryStatus = 'sending' | 'sent' | 'delivered' | 'opened';
export type StoryAudience = 'public' | 'followers' | 'friends' | 'private';

export interface SnapSticker {
  id: string;
  label: string;
  icon?: string;
  emoji?: string;
  color?: string;
  category?: string;
  x?: number;
  y?: number;
}

export interface AttachedActivitySummary {
  id: string;
  type: ActivityType;
  title: string;
  distance: number;
  duration: number | string;
  calories?: number;
  pace?: string;
  avgPace?: string;
  ecoScore?: number;
  routePreview?: any;
}

export interface Snap {
  id: string;
  senderId: string;
  senderName: string;
  senderAvatar: string;
  recipientIds: string[];
  mediaPath: string; // Base64 data URL or image URL
  caption?: string;
  stickers?: SnapSticker[];
  textOverlay?: string;
  filter?: string;
  cropRatio?: string;
  createdAt: string;
  expiryAt?: string;
  viewMode: SnapViewMode;
  status: SnapDeliveryStatus;
  activityId?: string;
  attachedActivity?: AttachedActivitySummary;
  openedBy?: Record<string, string>; // recipientId -> timestamp
  replayedBy?: Record<string, number>; // recipientId -> count
}

export interface Conversation {
  id: string;
  participantIds: string[];
  participant: {
    id: string;
    name: string;
    username: string;
    avatar: string;
    isFollowing?: boolean;
  };
  lastMessage?: {
    id: string;
    text: string;
    senderId: string;
    timestamp: string;
    isSnap?: boolean;
    snapStatus?: SnapDeliveryStatus;
  };
  unreadCount: number;
  updatedAt: string;
}

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  type: 'text' | 'snap';
  text?: string;
  mediaPath?: string;
  snapDetails?: {
    snapId: string;
    viewMode: SnapViewMode;
    status: SnapDeliveryStatus;
    caption?: string;
    stickers?: SnapSticker[];
    textOverlay?: string;
    filter?: string;
    attachedActivity?: AttachedActivitySummary;
    openedAt?: string;
    replayedCount?: number;
  };
  deliveryStatus: SnapDeliveryStatus;
  createdAt: string;
  openedAt?: string;
}

export interface StoryViewer {
  userId: string;
  userName: string;
  userAvatar: string;
  viewedAt: string;
}

export interface Story {
  id: string;
  userId: string;
  userName: string;
  userUsername?: string;
  userAvatar: string;
  mediaPath: string;
  photoUrl?: string;
  caption?: string;
  stickers?: SnapSticker[];
  textOverlay?: string;
  filter?: string;
  attachedActivity?: AttachedActivitySummary;
  audience: StoryAudience;
  createdAt: string;
  expiryAt: string; // 24h after createdAt
  viewers: StoryViewer[];
  hasViewed?: boolean;
  isViewed?: boolean;
  timeAgo?: string;
}
