// VELORA AI Service
// Handles Gemini API integration via proxy with full offline/deterministic fallback.

import { User, AIRecommendation, MonthlyPlanComparison, MoodType } from '../types';
import { INITIAL_RECOMMENDATIONS } from '../data/mockData';

export interface UserAIContext {
  name: string;
  streak: number;
  xp: number;
  ecoScore: number;
  mood?: string;
  goals: string[];
  interests: string[];
  activityLevel: string;
  availableTime: string;
  difficulty: string;
  habitsSummary?: string;
}

export interface AICoachReply {
  reply: string;
  source: 'gemini' | 'fallback';
  model?: string;
  error?: string;
  keyMissing?: boolean;
}

export interface ChatHistoryEntry {
  sender: 'user' | 'coach';
  text: string;
}

export const aiService = {
  async getCoachResponse(
    message: string, 
    context: UserAIContext,
    history: ChatHistoryEntry[] = []
  ): Promise<AICoachReply> {
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          message, 
          history: history.map(h => ({ sender: h.sender, text: h.text })),
          userContext: context 
        })
      });

      if (response.ok) {
        const data = await response.json();
        if (data.reply) {
          return {
            reply: data.reply,
            source: data.source || (data.fallback ? 'fallback' : 'gemini'),
            model: data.model,
            error: data.error,
            keyMissing: data.keyMissing
          };
        }
      } else {
        const errData = await response.json().catch(() => ({}));
        console.warn('Backend chat API error status:', response.status, errData);
      }
    } catch (e: any) {
      console.warn('Backend AI route unavailable, using local coach generator:', e);
    }

    return {
      reply: this.generateLocalCoachResponse(message, context),
      source: 'fallback',
      error: 'Backend AI route unavailable.'
    };
  },

  async getRecommendations(context: UserAIContext): Promise<AIRecommendation[]> {
    try {
      const response = await fetch('/api/ai/recommendations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userContext: context })
      });
      if (response.ok) {
        const data = await response.json();
        if (data.recommendations && Array.isArray(data.recommendations) && data.recommendations.length > 0) {
          return data.recommendations.map((rec: any, idx: number) => ({
            id: `ai-rec-${Date.now()}-${idx}`,
            name: rec.name,
            category: rec.category || 'Health',
            matchPercentage: rec.matchPercentage || 88,
            reason: rec.reason || 'Aligned with your current wellness profile.',
            difficulty: rec.difficulty || 'Beginner',
            benefit: rec.benefit || 'Promotes physical recovery and energy consistency.',
            duration: rec.duration || '20 mins',
            ecoPoints: rec.ecoPoints || 10,
            xp: rec.xp || 15,
            whyDetails: `Calculated from goal alignment (${context.goals.join(', ')}) and your ${context.availableTime} availability.`
          }));
        }
      }
    } catch (e) {
      console.warn('AI recommendations route unavailable, using dynamic fallback:', e);
    }
    return INITIAL_RECOMMENDATIONS;
  },

  async getMonthlyPlanUpgrade(
    prevPlan: any, 
    monthlyUpdate: any
  ): Promise<MonthlyPlanComparison> {
    try {
      const response = await fetch('/api/ai/monthly-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prevPlan, monthlyUpdate })
      });
      if (response.ok) {
        const data = await response.json();
        if (data.plan && data.plan.summary) {
          return {
            oldPlan: {
              walkingDuration: prevPlan?.walkingDuration || '20-minute walk',
              frequency: prevPlan?.frequency || '4 days/week',
              difficulty: prevPlan?.difficulty || 'Intermediate',
              habitsCount: prevPlan?.habitsCount || 4
            },
            newPlan: {
              walkingDuration: data.plan.recommendedAdjustments?.[0]?.to || '30-minute brisk walk',
              frequency: '5 days/week',
              difficulty: 'Intermediate',
              habitsCount: 5
            },
            summary: data.plan.summary,
            reason: data.plan.recommendedAdjustments?.[0]?.reason || 'Your cardiovascular endurance and habit consistency increased steadily over the last 30 days.',
            newHabits: (data.plan.newHabitSuggestions || []).map((s: any) => s.name || 'Evening Wind-down Routine')
          };
        }
      }
    } catch (e) {
      console.warn('AI Monthly Plan route unavailable, using local fallback:', e);
    }

    return {
      oldPlan: {
        walkingDuration: '20-minute walk',
        frequency: '3-4 days/week',
        difficulty: 'Beginner',
        habitsCount: 4
      },
      newPlan: {
        walkingDuration: '30-minute walk',
        frequency: '5 days/week',
        difficulty: 'Intermediate',
        habitsCount: 5
      },
      summary: 'Your activity increased this month, so VELORA gradually elevated your target duration to support progressive overload safely.',
      reason: 'Your weekly walking compliance was 92% and weight dropped 1.2 kg with stable energy levels.',
      newHabits: ['Avoid Single-Use Plastic', '15-Minute Evening Reading']
    };
  },

  generateLocalCoachResponse(message: string, context: UserAIContext): string {
    const msg = (message || '').toLowerCase();
    const name = context.name || 'Alex';

    if (msg.includes('tired') || msg.includes("don't want") || msg.includes('exhausted') || msg.includes('sleepy')) {
      return `That’s completely okay, ${name}. You don’t have to do everything today. How about a simple 5-minute walk or a glass of cold water? Small steps still count and protect your streak. 🌱`;
    }
    if (msg.includes('motivate') || msg.includes('motivation') || msg.includes('inspire')) {
      return `Look at how far you've come, ${name}! 🔥 You are holding a ${context.streak}-day streak and earned ${context.xp} XP. Consistency is built on the days you show up for just 2 minutes. You've got this!`;
    }
    if (msg.includes('stress') || msg.includes('anxious') || msg.includes('overwhelmed')) {
      return `Let’s hit pause together, ${name}. Breathe in for 4 seconds, hold for 4, and exhale smoothly for 6. 🌿 Let's skip heavy tasks for now. Would you like a 3-minute guided breathing pause?`;
    }
    if (msg.includes('habit') || msg.includes('suggest') || msg.includes('what should i do')) {
      return `Based on your ${context.availableTime} availability and ${context.mood || 'good'} mood, I suggest a 15-minute nature walk without checking emails. It refreshes your focus and adds +10 XP + 5 Eco Points! 🍃`;
    }
    if (msg.includes('progress') || msg.includes('streak') || msg.includes('score')) {
      return `You're crushing it, ${name}! Your Eco Score is ${context.ecoScore}/100 and your habit completion rate is 85%. You have completed 5.2 km of active travel this week! 📈`;
    }
    return `I hear you, ${name}. Every intentional action creates a healthier person and a healthier planet. How can I support your routine today? 🌱`;
  },

  analyzeMoodCheckin(mood: MoodType, text: string): string {
    if (mood === '😣 Stressed' || mood === '😴 Tired') {
      return 'We noticed signs of fatigue today. VELORA has automatically dialed down high-intensity habit reminders to prioritize nervous system recovery.';
    }
    if (mood === '😊 Happy' || mood === '🙂 Good') {
      return 'Great emotional energy detected! This is an ideal window to tackle your active outdoor workouts and eco challenges.';
    }
    return 'Thank you for checking in. Tracking your emotional baseline helps VELORA tailor your habit pacing.';
  }
};
