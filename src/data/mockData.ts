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
  AIRecommendation,
  Story,
  Conversation,
  Message,
  SnapSticker
} from '../types';

export const INITIAL_USER: User = {
  id: 'user-alex-101',
  name: 'Alex Rivera',
  username: 'alex_rivera',
  email: 'alex@velora.demo',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
  bio: 'Mindful mover & sustainability advocate. Building 1% better habits daily 🌱🏃‍♂️',
  age: 26,
  gender: 'Non-binary',
  height: 172,
  weight: 65,
  bodyFat: 17.5,
  isHealthPrivate: true,
  activityLevel: 'Moderate',
  sleepDuration: 7.5,
  diet: 'Vegetarian',
  goals: ['Fitness', 'Mental Wellness', 'Sustainability'],
  interests: ['Walking', 'Running', 'Meditation', 'Reading', 'Nature'],
  availableTime: '30 minutes',
  difficulty: 'Intermediate',
  activityVisibility: 'public',
  postVisibility: 'public',
  followersCount: 142,
  followingCount: 98,
  createdAt: '2026-08-01T10:00:00Z',
  updatedAt: '2026-10-07T08:00:00Z'
};

export const INITIAL_HABITS: Habit[] = [
  {
    id: 'habit-1',
    userId: 'user-alex-101',
    name: 'Drink 2.5L Water',
    description: 'Keep hydration levels high throughout the working day with reusable bottle.',
    category: 'Health',
    frequency: 'daily',
    difficulty: 'Beginner',
    time: '08:00 AM',
    healthBenefit: 'Boosts cognitive energy, cellular repair and skin hydration.',
    ecoImpact: 'Saves 2 single-use plastic bottles daily by using stainless steel flask.',
    completed: true,
    streak: 12,
    xpValue: 10,
    ecoPoints: 5,
    completedDates: ['2026-10-01', '2026-10-02', '2026-10-03', '2026-10-04', '2026-10-05', '2026-10-06', '2026-10-07'],
    createdAt: '2026-08-15'
  },
  {
    id: 'habit-2',
    userId: 'user-alex-101',
    name: '20-Minute Nature Walk',
    description: 'Step outside for brisk paced outdoor walking and natural sunlight exposure.',
    category: 'Fitness',
    frequency: 'daily',
    difficulty: 'Beginner',
    time: '07:30 AM',
    healthBenefit: 'Lowers cortisol, strengthens cardiovascular base and improves mood.',
    ecoImpact: 'Replaced short motorized transit trip, saving ~350g CO2.',
    completed: true,
    streak: 7,
    xpValue: 15,
    ecoPoints: 10,
    completedDates: ['2026-10-01', '2026-10-02', '2026-10-03', '2026-10-04', '2026-10-05', '2026-10-06', '2026-10-07'],
    createdAt: '2026-08-15'
  },
  {
    id: 'habit-3',
    userId: 'user-alex-101',
    name: 'Read 10 Pages',
    description: 'Deep non-fiction or mindfulness literature without phone distraction.',
    category: 'Personal',
    frequency: 'daily',
    difficulty: 'Beginner',
    time: '09:00 PM',
    healthBenefit: 'Sharpens attention span, improves vocabulary and reduces pre-sleep blue light.',
    ecoImpact: 'Promoting mindful reading habits using digital e-reader or borrowed library books.',
    completed: true,
    streak: 9,
    xpValue: 10,
    ecoPoints: 2,
    completedDates: ['2026-10-01', '2026-10-02', '2026-10-03', '2026-10-04', '2026-10-05', '2026-10-06', '2026-10-07'],
    createdAt: '2026-08-18'
  },
  {
    id: 'habit-4',
    userId: 'user-alex-101',
    name: '10-Minute Meditation',
    description: 'Guided breath awareness and body scan to quiet morning anxiety.',
    category: 'Mental Wellness',
    frequency: 'daily',
    difficulty: 'Intermediate',
    time: '07:00 AM',
    healthBenefit: 'Enhances emotional regulation, HRV variability and focus.',
    ecoImpact: 'Fosters inner calm and reduced stress-induced consumerism.',
    completed: false,
    streak: 6,
    xpValue: 15,
    ecoPoints: 3,
    completedDates: ['2026-10-01', '2026-10-02', '2026-10-03', '2026-10-04', '2026-10-05', '2026-10-06'],
    createdAt: '2026-08-20'
  },
  {
    id: 'habit-5',
    userId: 'user-alex-101',
    name: 'Avoid Single-Use Plastic',
    description: 'Carry canvas tote bags, cloth produce pouches and reusable cutlery.',
    category: 'Sustainability',
    frequency: 'daily',
    difficulty: 'Intermediate',
    time: 'All Day',
    healthBenefit: 'Avoids microplastic shedding in hot food and beverages.',
    ecoImpact: 'Prevents non-biodegradable landfill waste and ocean plastic accumulation.',
    completed: true,
    streak: 15,
    xpValue: 20,
    ecoPoints: 15,
    completedDates: ['2026-10-01', '2026-10-02', '2026-10-03', '2026-10-04', '2026-10-05', '2026-10-06', '2026-10-07'],
    createdAt: '2026-08-10'
  }
];

export const INITIAL_ACTIVITIES: Activity[] = [
  {
    id: 'act-1',
    userId: 'user-alex-101',
    type: 'Walking',
    title: 'Sunrise Greenbelt Trail Walk',
    distance: 5.21,
    duration: 1938, // 32m 18s
    pace: '6\'12" /km',
    speed: 5.8,
    calories: 186,
    elevation: 42,
    route: [
      { lat: 37.7749, lng: -122.4194 },
      { lat: 37.7758, lng: -122.4178 },
      { lat: 37.7772, lng: -122.4165 },
      { lat: 37.7791, lng: -122.4150 },
      { lat: 37.7810, lng: -122.4138 },
      { lat: 37.7825, lng: -122.4155 },
      { lat: 37.7808, lng: -122.4180 },
      { lat: 37.7780, lng: -122.4195 },
      { lat: 37.7749, lng: -122.4194 }
    ],
    proof: {
      photoUrl: 'https://images.unsplash.com/photo-1502082553048-f009c37129b9?auto=format&fit=crop&w=800&q=80',
      caption: 'Morning walk completed! Crisp air and gentle sun 🌿'
    },
    visibility: 'public',
    xpEarned: 35,
    ecoPointsEarned: 15,
    timestamp: '2026-10-07T07:45:00Z'
  },
  {
    id: 'act-2',
    userId: 'user-alex-101',
    type: 'Running',
    title: 'Twilight River Park Loop',
    distance: 4.80,
    duration: 1520, // 25m 20s
    pace: '5\'16" /km',
    speed: 11.4,
    calories: 340,
    elevation: 58,
    route: [
      { lat: 37.7749, lng: -122.4194 },
      { lat: 37.7785, lng: -122.4150 },
      { lat: 37.7820, lng: -122.4120 },
      { lat: 37.7850, lng: -122.4160 },
      { lat: 37.7790, lng: -122.4210 },
      { lat: 37.7749, lng: -122.4194 }
    ],
    proof: {
      photoUrl: 'https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?auto=format&fit=crop&w=800&q=80',
      caption: 'Clear mind run through the woods after work 🏃'
    },
    visibility: 'public',
    xpEarned: 45,
    ecoPointsEarned: 20,
    timestamp: '2026-10-05T18:30:00Z'
  },
  {
    id: 'act-3',
    userId: 'user-alex-101',
    type: 'Cycling',
    title: 'Eco Commute & Bay Trail',
    distance: 12.4,
    duration: 2580, // 43m
    pace: '3\'28" /km',
    speed: 17.3,
    calories: 410,
    elevation: 95,
    route: [
      { lat: 37.7749, lng: -122.4194 },
      { lat: 37.7890, lng: -122.4100 },
      { lat: 37.8020, lng: -122.4050 },
      { lat: 37.7749, lng: -122.4194 }
    ],
    visibility: 'public',
    xpEarned: 50,
    ecoPointsEarned: 30,
    timestamp: '2026-10-03T16:15:00Z'
  }
];

export const INITIAL_POSTS: Post[] = [
  {
    id: 'post-1',
    userId: 'user-alex-101',
    authorName: 'Alex Rivera',
    authorUsername: 'alex_rivera',
    authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    caption: 'Morning walk completed! Crisp air and gentle sun 🌿 5.2 km through the green corridor. Replaced morning cab ride!',
    activity: {
      type: 'Walking',
      distance: 5.21,
      duration: 1938,
      calories: 186,
      elevation: 42
    },
    photos: [
      'https://images.unsplash.com/photo-1502082553048-f009c37129b9?auto=format&fit=crop&w=800&q=80'
    ],
    likes: 24,
    hasLiked: true,
    comments: [
      {
        id: 'c-1',
        userId: 'user-priya-102',
        userName: 'Priya Sharma',
        userAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80',
        text: 'That trail looks so serene! Love the zero-emission commute 🌱',
        timestamp: '1 hour ago'
      },
      {
        id: 'c-2',
        userId: 'user-karthik-103',
        userName: 'Karthik Rao',
        userAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
        text: 'Consistency on point Alex! 7-day streak looks good on you 🔥',
        timestamp: '45 mins ago'
      }
    ],
    badgeEarned: '7-Day Streak',
    visibility: 'public',
    timestamp: '2 hours ago'
  },
  {
    id: 'post-2',
    userId: 'user-priya-102',
    authorName: 'Priya Sharma',
    authorUsername: 'priya_eco',
    authorAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80',
    caption: 'Completed my 14-day zero plastic challenge! Placed compost bin on the balcony and cooked seasonal meals all week 🥦🌍',
    photos: [
      'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=800&q=80'
    ],
    likes: 41,
    hasLiked: false,
    comments: [
      {
        id: 'c-3',
        userId: 'user-sneha-104',
        userName: 'Sneha Patel',
        userAvatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80',
        text: 'Inspiring Priya! How do you store greens without bags?',
        timestamp: '3 hours ago'
      }
    ],
    badgeEarned: 'Planet Protector',
    visibility: 'public',
    timestamp: '4 hours ago'
  },
  {
    id: 'post-3',
    userId: 'user-karthik-103',
    authorName: 'Karthik Rao',
    authorUsername: 'karthik_runs',
    authorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
    caption: 'Completed my first 10 km run! 🏃‍♂️ Legs were feeling heavy at km 8, but the cadence kept me floating. Fuelled by local oats and hydration.',
    activity: {
      type: 'Running',
      distance: 10.12,
      duration: 3240,
      calories: 780,
      elevation: 110
    },
    photos: [
      'https://images.unsplash.com/photo-1452626038306-9aae5e071dd3?auto=format&fit=crop&w=800&q=80'
    ],
    likes: 56,
    hasLiked: true,
    comments: [],
    badgeEarned: '100 KM Club',
    visibility: 'public',
    timestamp: 'Yesterday'
  },
  {
    id: 'post-4',
    userId: 'user-sneha-104',
    authorName: 'Sneha Patel',
    authorUsername: 'sneha_wellness',
    authorAvatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80',
    caption: 'Sunset yoga and breathwork by the botanical gardens. Taking time to down-regulate the nervous system after a demanding sprint week 🧘‍♀️✨',
    photos: [
      'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=800&q=80'
    ],
    likes: 38,
    hasLiked: false,
    comments: [],
    badgeEarned: 'Consistency Champion',
    visibility: 'public',
    timestamp: '2 days ago'
  }
];

export const INITIAL_COMMUNITY_USERS = [
  {
    id: 'user-priya-102',
    name: 'Priya Sharma',
    username: 'priya_eco',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80',
    bio: 'Zero-waste lifestyle enthusiast & urban gardener. 🌿 Eco Score: 88',
    goals: ['Sustainability', 'Health'],
    followersCount: 310,
    followingCount: 140,
    activitiesCount: 42,
    isFollowing: true
  },
  {
    id: 'user-karthik-103',
    name: 'Karthik Rao',
    username: 'karthik_runs',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
    bio: 'Half-marathoner in training. Trail running enthusiast 🏃‍♂️',
    goals: ['Fitness', 'Productivity'],
    followersCount: 490,
    followingCount: 220,
    activitiesCount: 78,
    isFollowing: true
  },
  {
    id: 'user-sneha-104',
    name: 'Sneha Patel',
    username: 'sneha_wellness',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80',
    bio: 'Yoga teacher & somatic breathwork coach. Finding stillness in city life 🧘‍♀️',
    goals: ['Mental Wellness', 'Health'],
    followersCount: 620,
    followingCount: 180,
    activitiesCount: 64,
    isFollowing: false
  },
  {
    id: 'user-arjun-105',
    name: 'Arjun Mehta',
    username: 'arjun_cycles',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
    bio: 'Bike commuter & tree-planting volunteer. 1,200 km pedaled this season 🚴‍♂️',
    goals: ['Fitness', 'Sustainability'],
    followersCount: 240,
    followingCount: 110,
    activitiesCount: 91,
    isFollowing: false
  },
  {
    id: 'user-divya-106',
    name: 'Divya Nair',
    username: 'divya_reads',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80',
    bio: 'Habit stacking researcher. 30-day streak builder and deep work practitioner 📚',
    goals: ['Productivity', 'Study', 'Mental Wellness'],
    followersCount: 380,
    followingCount: 195,
    activitiesCount: 35,
    isFollowing: false
  }
];

export const INITIAL_BADGES: Badge[] = [
  {
    id: 'badge-1',
    name: '7-Day Streak',
    description: 'Maintained uninterrupted habit consistency for 7 days in a row.',
    icon: '🔥',
    category: 'streak',
    unlocked: true,
    unlockedAt: '2026-10-07',
    requirement: 'Complete all target habits for 7 consecutive days'
  },
  {
    id: 'badge-2',
    name: 'Eco Starter',
    description: 'Completed your first 5 planetary positive eco-actions.',
    icon: '🌱',
    category: 'eco',
    unlocked: true,
    unlockedAt: '2026-09-12',
    requirement: 'Log 5 sustainable lifestyle actions'
  },
  {
    id: 'badge-3',
    name: 'Habit Builder',
    description: 'Checked off 25 habits across different health and wellness domains.',
    icon: '🧱',
    category: 'habit',
    unlocked: true,
    unlockedAt: '2026-09-20',
    requirement: 'Check off 25 total daily habit repetitions'
  },
  {
    id: 'badge-4',
    name: 'Consistency Champion',
    description: 'Reached an 85% or higher overall weekly completion rate.',
    icon: '🏆',
    category: 'habit',
    unlocked: true,
    unlockedAt: '2026-10-01',
    requirement: 'Achieve 85% weekly completion'
  },
  {
    id: 'badge-5',
    name: 'First Activity',
    description: 'Tracked your first live GPS workout on the VELORA map.',
    icon: '📍',
    category: 'activity',
    unlocked: true,
    unlockedAt: '2026-08-20',
    requirement: 'Complete and record 1 GPS route'
  },
  {
    id: 'badge-6',
    name: '10 Activities',
    description: 'Logged 10 physical activity sessions with verified distance & calories.',
    icon: '🏃',
    category: 'activity',
    unlocked: true,
    unlockedAt: '2026-09-28',
    requirement: 'Log 10 workouts or hikes'
  },
  {
    id: 'badge-7',
    name: '100 KM Club',
    description: 'Covered over 100 total kilometers powered strictly by human movement.',
    icon: '🚴',
    category: 'activity',
    unlocked: false,
    requirement: 'Accumulate 100 km across walks, runs, and rides'
  },
  {
    id: 'badge-8',
    name: 'Early Riser',
    description: 'Completed morning wellness routine before 8:00 AM for 5 days.',
    icon: '🌅',
    category: 'habit',
    unlocked: true,
    unlockedAt: '2026-09-15',
    requirement: 'Check in before 8:00 AM on 5 separate days'
  },
  {
    id: 'badge-9',
    name: 'Healthy Week',
    description: 'Logged water, nutrition, and exercise every day for a full calendar week.',
    icon: '🍏',
    category: 'habit',
    unlocked: true,
    unlockedAt: '2026-10-04',
    requirement: 'Achieve 100% on health category for 7 days'
  },
  {
    id: 'badge-10',
    name: 'Planet Protector',
    description: 'Achieved an Eco Score of 70+ and saved over 10 kg of carbon emissions.',
    icon: '🌍',
    category: 'eco',
    unlocked: true,
    unlockedAt: '2026-10-06',
    requirement: 'Maintain Eco Score above 70 and complete 3 eco challenges'
  }
];

export const INITIAL_ECO_ACTIONS: EcoAction[] = [
  {
    id: 'eco-1',
    label: 'Walked or cycled instead of motor vehicle',
    category: 'Mobility',
    points: 20,
    completed: true,
    co2SavedGrams: 850
  },
  {
    id: 'eco-2',
    label: 'Properly segregated & recycled household waste',
    category: 'Waste',
    points: 10,
    completed: true,
    co2SavedGrams: 200
  },
  {
    id: 'eco-3',
    label: 'Turned off standby appliances & saved electricity',
    category: 'Energy',
    points: 15,
    completed: true,
    co2SavedGrams: 420
  },
  {
    id: 'eco-4',
    label: 'Avoided single-use plastics & carried reusable bag',
    category: 'Waste',
    points: 15,
    completed: false,
    co2SavedGrams: 150
  },
  {
    id: 'eco-5',
    label: 'Ate a 100% plant-based meal today',
    category: 'Diet',
    points: 20,
    completed: true,
    co2SavedGrams: 1200
  }
];

export const INITIAL_ECO_CHALLENGES: EcoChallenge[] = [
  {
    id: 'ch-1',
    title: 'Walk 3 km Zero-Emission',
    description: 'Substitute a motorized errand with active foot travel.',
    points: 30,
    progress: 3.0,
    target: 3.0,
    unit: 'km',
    completed: true,
    icon: '🚶'
  },
  {
    id: 'ch-2',
    title: 'Plant a Tree / Native Shrub',
    description: 'Join a local tree-planting drive or plant in your neighborhood.',
    points: 50,
    progress: 0,
    target: 1,
    unit: 'tree',
    completed: false,
    icon: '🌳'
  },
  {
    id: 'ch-3',
    title: 'Avoid Plastic for 7 Days',
    description: 'Maintain zero disposable packaging consumption this week.',
    points: 40,
    progress: 5,
    target: 7,
    unit: 'days',
    completed: false,
    icon: '🥡'
  }
];

export const INITIAL_RECOMMENDATIONS: AIRecommendation[] = [
  {
    id: 'rec-1',
    name: '15-Minute Brisk Post-Lunch Walk',
    category: 'Fitness',
    matchPercentage: 92,
    reason: 'Matches your fitness goal, 30-minute daily availability and recent sedentary afternoon blocks.',
    difficulty: 'Beginner',
    benefit: 'Reduces postprandial glucose spike by 22% and prevents 2 PM energy dip.',
    duration: '15 mins',
    ecoPoints: 8,
    xp: 15,
    whyDetails: 'Calculated via cosine similarity across your Fitness goal vector (weight 0.88), moderate activity level, and preference for outdoor walking.'
  },
  {
    id: 'rec-2',
    name: '5-Minute Box Breathing',
    category: 'Mental Wellness',
    matchPercentage: 88,
    reason: 'Recommended based on your recent check-in note mentioning work deadlines.',
    difficulty: 'Beginner',
    benefit: 'Directly triggers parasympathetic response and lowers acute heart rate.',
    duration: '5 mins',
    ecoPoints: 2,
    xp: 10,
    whyDetails: 'Derived from emotional state analysis and mental wellness priority in your onboarding profile.'
  },
  {
    id: 'rec-3',
    name: 'Mindful Plant-Based Breakfast',
    category: 'Health',
    matchPercentage: 86,
    reason: 'Aligns with your Vegetarian diet, digestion recovery and high eco-impact score.',
    difficulty: 'Intermediate',
    benefit: 'Provides sustained complex carbohydrates with 0g saturated animal fat.',
    duration: '20 mins',
    ecoPoints: 20,
    xp: 20,
    whyDetails: 'High alignment with your Sustainability goal (score 0.92) and vegetarian nutrition preferences.'
  },
  {
    id: 'rec-4',
    name: 'Weekend Green Corridor Cycling',
    category: 'Fitness',
    matchPercentage: 78,
    reason: 'You logged outdoor walks consistently; cycling offers progressive low-impact cardio.',
    difficulty: 'Intermediate',
    benefit: 'Builds quadricep endurance and lung volume with near-zero joint strain.',
    duration: '45 mins',
    ecoPoints: 25,
    xp: 35,
    whyDetails: 'Matches your interest in nature trails and previous weekend activity cadence.'
  }
];

export const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif-snap-1',
    title: '🔥 New Snap received from Priya',
    message: 'Priya Sharma sent you a Disappearing Snap with attached 5.2 km trail run.',
    type: 'snap',
    read: false,
    timestamp: '10 minutes ago',
    linkRoute: '/inbox'
  },
  {
    id: 'notif-msg-1',
    title: '💬 New message from Karthik',
    message: 'Karthik: "Hey, are you joining the community weekend ride?"',
    type: 'message',
    read: false,
    timestamp: '25 minutes ago',
    linkRoute: '/inbox'
  },
  {
    id: 'notif-reply-1',
    title: '↩️ Sneha replied to your snap',
    message: 'Sneha Patel replied: "Incredible cadence on that hill climb!"',
    type: 'snap',
    read: false,
    timestamp: '45 minutes ago',
    linkRoute: '/inbox'
  },
  {
    id: 'notif-story-1',
    title: '✨ Arjun posted a new VELORA Story',
    message: 'Arjun Mehta shared a 24-hour sunrise yoga workout snap.',
    type: 'story',
    read: false,
    timestamp: '1 hour ago',
    linkRoute: '/home'
  },
  {
    id: 'notif-follow-1',
    title: '👥 Priya started following you',
    message: 'Priya Sharma (@priya_eco) is now following your eco activities and streaks.',
    type: 'social',
    read: true,
    timestamp: '2 hours ago',
    linkRoute: '/community'
  },
  {
    id: 'notif-mention-1',
    title: '🏷️ Karthik mentioned you',
    message: 'Karthik mentioned you in a Community Post: "@alex_rivera crushed the trail today!"',
    type: 'social',
    read: true,
    timestamp: '3 hours ago',
    linkRoute: '/community'
  },
  {
    id: 'notif-1',
    title: '🔥 Your 7-day streak is active!',
    message: 'Awesome work Alex! You maintained habits for 7 consecutive days. +50 XP bonus added.',
    type: 'streak',
    read: false,
    timestamp: '4 hours ago',
    linkRoute: '/rewards'
  },
  {
    id: 'notif-2',
    title: '⭐ You earned a new badge!',
    message: 'You unlocked "Planet Protector" for maintaining an Eco Score above 70.',
    type: 'badge',
    read: true,
    timestamp: '5 hours ago',
    linkRoute: '/rewards'
  },
  {
    id: 'notif-6',
    title: '📊 Your monthly progress update is ready',
    message: 'Review October changes and let VELORA adapt your personalized habit plan.',
    type: 'monthly',
    read: true,
    timestamp: '1 day ago',
    linkRoute: '/monthly-update'
  }
];

export const INITIAL_MONTHLY_HISTORY: MonthlyUpdateRecord[] = [
  {
    id: 'm-sep-2026',
    userId: 'user-alex-101',
    monthName: 'September',
    year: 2026,
    prevWeight: 67.5,
    currentWeight: 66.2,
    height: 172,
    activityLevel: 'Light',
    sleepDuration: 7.0,
    goals: ['Fitness', 'Health'],
    newGoals: ['Fitness', 'Health', 'Mental Wellness'],
    mood: '🙂 Good',
    availableTime: '30 minutes',
    difficulty: 'Beginner',
    plan: {
      oldPlan: {
        walkingDuration: '15-minute walk',
        frequency: '3 days/week',
        difficulty: 'Beginner',
        habitsCount: 3
      },
      newPlan: {
        walkingDuration: '20-minute walk',
        frequency: '4 days/week',
        difficulty: 'Intermediate',
        habitsCount: 4
      },
      summary: 'Cardiovascular consistency improved by 22% during September.',
      reason: 'Your weekly walking frequency reached 95% compliance, making it safe to increase daily duration from 15 to 20 minutes.',
      newHabits: ['10-Minute Meditation', 'Drink 2.5L Water']
    },
    accepted: true,
    timestamp: '2026-09-30T18:00:00Z',
    stats: {
      habitCompletionRate: 81,
      totalDistanceKm: 42.5,
      streak: 5,
      ecoScore: 65
    }
  },
  {
    id: 'm-oct-2026',
    userId: 'user-alex-101',
    monthName: 'October',
    year: 2026,
    prevWeight: 66.2,
    currentWeight: 65.0,
    height: 172,
    activityLevel: 'Moderate',
    sleepDuration: 7.5,
    goals: ['Fitness', 'Mental Wellness', 'Sustainability'],
    newGoals: ['Fitness', 'Mental Wellness', 'Sustainability'],
    mood: '😊 Happy',
    availableTime: '30 minutes',
    difficulty: 'Intermediate',
    plan: {
      oldPlan: {
        walkingDuration: '20-minute walk',
        frequency: '4 days/week',
        difficulty: 'Intermediate',
        habitsCount: 4
      },
      newPlan: {
        walkingDuration: '30-minute brisk walk',
        frequency: '5 days/week',
        difficulty: 'Intermediate',
        habitsCount: 5
      },
      summary: 'Weight down 1.2 kg with sustained energy and higher eco score.',
      reason: 'Your activity increased this month, so VELORA gradually increased your recommended walking duration to 30 minutes 5 days a week.',
      newHabits: ['Avoid Single-Use Plastic', 'Read 10 Pages']
    },
    accepted: true,
    timestamp: '2026-10-06T12:00:00Z',
    stats: {
      habitCompletionRate: 85,
      totalDistanceKm: 68.2,
      streak: 7,
      ecoScore: 72
    }
  }
];

// ==========================================
// VELORA SNAP MOCK DATA
// ==========================================

export const VELORA_STICKERS: SnapSticker[] = [
  { id: 'st-eco', label: 'Eco Action', icon: '🌿', color: 'bg-emerald-600 text-white' },
  { id: 'st-workout', label: 'Workout Complete', icon: '🏃', color: 'bg-sky-600 text-white' },
  { id: 'st-walk', label: 'Morning Walk', icon: '🚶', color: 'bg-teal-600 text-white' },
  { id: 'st-hydration', label: 'Hydration Goal', icon: '💧', color: 'bg-blue-500 text-white' },
  { id: 'st-meditation', label: 'Meditation', icon: '🧘', color: 'bg-indigo-600 text-white' },
  { id: 'st-streak', label: 'Streak Maintained', icon: '🔥', color: 'bg-amber-500 text-white' },
  { id: 'st-achievement', label: 'Achievement Unlocked', icon: '⭐', color: 'bg-yellow-500 text-slate-900 font-bold' }
];

export const INITIAL_STORIES: Story[] = [
  {
    id: 'story-priya-1',
    userId: 'user-priya-102',
    userName: 'Priya Sharma',
    userUsername: 'priya_eco',
    userAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80',
    mediaPath: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=900&q=80',
    caption: 'Zero-waste market run! All local veggies in reusable mesh bags 🥦🌱',
    stickers: [
      { id: 'st-eco', label: 'Eco Action', icon: '🌿' }
    ],
    audience: 'followers',
    createdAt: new Date(Date.now() - 2 * 3600 * 1000).toISOString(),
    expiryAt: new Date(Date.now() + 22 * 3600 * 1000).toISOString(),
    viewers: [
      { userId: 'user-karthik-103', userName: 'Karthik Rao', userAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80', viewedAt: '1 hour ago' }
    ],
    hasViewed: false
  },
  {
    id: 'story-karthik-1',
    userId: 'user-karthik-103',
    userName: 'Karthik Rao',
    userUsername: 'karthik_runs',
    userAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
    mediaPath: 'https://images.unsplash.com/photo-1452626038306-9aae5e071dd3?auto=format&fit=crop&w=900&q=80',
    caption: 'Sunrise trail interval workout. Crisp morning air!',
    stickers: [
      { id: 'st-workout', label: 'Workout Complete', icon: '🏃' }
    ],
    attachedActivity: {
      id: 'act-k-1',
      type: 'Running',
      title: 'Greenbelt Morning Intervals',
      distance: 6.4,
      duration: 1860,
      calories: 420,
      pace: '4\'50" /km'
    },
    audience: 'public',
    createdAt: new Date(Date.now() - 4 * 3600 * 1000).toISOString(),
    expiryAt: new Date(Date.now() + 20 * 3600 * 1000).toISOString(),
    viewers: [],
    hasViewed: false
  },
  {
    id: 'story-sneha-1',
    userId: 'user-sneha-104',
    userName: 'Sneha Patel',
    userUsername: 'sneha_wellness',
    userAvatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80',
    mediaPath: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=900&q=80',
    caption: '15 minutes of lakeside breathing before the workday starts 🧘‍♀️✨',
    stickers: [
      { id: 'st-meditation', label: 'Meditation', icon: '🧘' }
    ],
    audience: 'followers',
    createdAt: new Date(Date.now() - 6 * 3600 * 1000).toISOString(),
    expiryAt: new Date(Date.now() + 18 * 3600 * 1000).toISOString(),
    viewers: [],
    hasViewed: true
  },
  {
    id: 'story-arjun-1',
    userId: 'user-arjun-105',
    userName: 'Arjun Mehta',
    userUsername: 'arjun_cycles',
    userAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
    mediaPath: 'https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?auto=format&fit=crop&w=900&q=80',
    caption: 'Morning bike commute along the waterfront path 🚴‍♂️ Zero emissions!',
    stickers: [
      { id: 'st-eco', label: 'Eco Action', icon: '🌿' }
    ],
    audience: 'public',
    createdAt: new Date(Date.now() - 7 * 3600 * 1000).toISOString(),
    expiryAt: new Date(Date.now() + 17 * 3600 * 1000).toISOString(),
    viewers: [],
    hasViewed: true
  }
];

export const INITIAL_CONVERSATIONS: Conversation[] = [
  {
    id: 'conv-priya',
    participantIds: ['user-alex-101', 'user-priya-102'],
    participant: {
      id: 'user-priya-102',
      name: 'Priya Sharma',
      username: 'priya_eco',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80',
      isFollowing: true
    },
    lastMessage: {
      id: 'msg-p-snap-1',
      text: '📸 Sent a Snap (Tap to view)',
      senderId: 'user-priya-102',
      timestamp: '15m ago',
      isSnap: true,
      snapStatus: 'delivered'
    },
    unreadCount: 1,
    updatedAt: new Date(Date.now() - 15 * 60 * 1000).toISOString()
  },
  {
    id: 'conv-karthik',
    participantIds: ['user-alex-101', 'user-karthik-103'],
    participant: {
      id: 'user-karthik-103',
      name: 'Karthik Rao',
      username: 'karthik_runs',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
      isFollowing: true
    },
    lastMessage: {
      id: 'msg-k-2',
      text: 'Crushed the 5k today, did you do your morning walk?',
      senderId: 'user-karthik-103',
      timestamp: '2h ago',
      isSnap: false
    },
    unreadCount: 0,
    updatedAt: new Date(Date.now() - 2 * 3600 * 1000).toISOString()
  },
  {
    id: 'conv-sneha',
    participantIds: ['user-alex-101', 'user-sneha-104'],
    participant: {
      id: 'user-sneha-104',
      name: 'Sneha Patel',
      username: 'sneha_wellness',
      avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80',
      isFollowing: false
    },
    lastMessage: {
      id: 'msg-s-1',
      text: 'Thanks for sharing the meditation tip! Loved the focus.',
      senderId: 'user-sneha-104',
      timestamp: 'Yesterday',
      isSnap: false
    },
    unreadCount: 0,
    updatedAt: new Date(Date.now() - 24 * 3600 * 1000).toISOString()
  }
];

export const INITIAL_MESSAGES: Record<string, Message[]> = {
  'conv-priya': [
    {
      id: 'msg-p-1',
      conversationId: 'conv-priya',
      senderId: 'user-alex-101',
      type: 'text',
      text: 'Hey Priya! How was your zero-waste shopping trip this morning?',
      deliveryStatus: 'opened',
      createdAt: new Date(Date.now() - 40 * 60 * 1000).toISOString(),
      openedAt: new Date(Date.now() - 38 * 60 * 1000).toISOString()
    },
    {
      id: 'msg-p-2',
      conversationId: 'conv-priya',
      senderId: 'user-priya-102',
      type: 'text',
      text: 'It was great! Found organic spinach and apples completely without plastic wrappers.',
      deliveryStatus: 'opened',
      createdAt: new Date(Date.now() - 30 * 60 * 1000).toISOString()
    },
    {
      id: 'msg-p-snap-1',
      conversationId: 'conv-priya',
      senderId: 'user-priya-102',
      type: 'snap',
      mediaPath: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=900&q=80',
      snapDetails: {
        snapId: 'snap-p-1',
        viewMode: 'replay_allowed',
        status: 'delivered',
        caption: 'Look at this fresh harvest! 🥦🌿',
        stickers: [{ id: 'st-eco', label: 'Eco Action', icon: '🌿' }],
        replayedCount: 0
      },
      deliveryStatus: 'delivered',
      createdAt: new Date(Date.now() - 15 * 60 * 1000).toISOString()
    }
  ],
  'conv-karthik': [
    {
      id: 'msg-k-1',
      conversationId: 'conv-karthik',
      senderId: 'user-alex-101',
      type: 'text',
      text: 'Just finished my 5.2 km sunrise trail walk!',
      deliveryStatus: 'opened',
      createdAt: new Date(Date.now() - 3 * 3600 * 1000).toISOString()
    },
    {
      id: 'msg-k-2',
      conversationId: 'conv-karthik',
      senderId: 'user-karthik-103',
      type: 'text',
      text: 'Crushed the 5k today, did you do your morning walk?',
      deliveryStatus: 'opened',
      createdAt: new Date(Date.now() - 2 * 3600 * 1000).toISOString()
    }
  ],
  'conv-sneha': [
    {
      id: 'msg-s-1',
      conversationId: 'conv-sneha',
      senderId: 'user-sneha-104',
      type: 'text',
      text: 'Thanks for sharing the meditation tip! Loved the focus.',
      deliveryStatus: 'opened',
      createdAt: new Date(Date.now() - 24 * 3600 * 1000).toISOString()
    }
  ]
};
