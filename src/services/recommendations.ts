// VELORA Recommendation Engine
// Technical Recommendation Model: Content-Based Filtering + Cosine Similarity
// Computes cosine similarity between User Feature Vector and Candidate Habit Vectors.

import { User, AIRecommendation, HabitCategory } from '../types';

interface CandidateHabitTemplate {
  name: string;
  category: HabitCategory;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  duration: string;
  benefit: string;
  ecoPoints: number;
  xp: number;
  // Feature vector dimensions: [Fitness, Health, Study, Productivity, Mental Wellness, Sustainability, Outdoor, LowTime]
  features: number[];
  reasonTemplate: string;
}

const HABIT_CATALOG: CandidateHabitTemplate[] = [
  {
    name: '15-Minute Brisk Walk',
    category: 'Fitness',
    difficulty: 'Beginner',
    duration: '15 mins',
    benefit: 'Aids metabolic regulation, clears brain fog, and adds active steps.',
    ecoPoints: 10,
    xp: 15,
    features: [1.0, 0.8, 0.0, 0.4, 0.7, 0.9, 1.0, 1.0],
    reasonTemplate: 'Matches your fitness goals, outdoor interest, and 15-30 min schedule.'
  },
  {
    name: 'Morning Breathwork & Meditation',
    category: 'Mental Wellness',
    difficulty: 'Beginner',
    duration: '10 mins',
    benefit: 'Activates vagus nerve, settles cortisol spikes and increases morning presence.',
    ecoPoints: 5,
    xp: 15,
    features: [0.2, 0.9, 0.3, 0.7, 1.0, 0.3, 0.2, 1.0],
    reasonTemplate: 'Matches your mental wellness target and calms nervous system.'
  },
  {
    name: 'Zero-Waste Lunch Packing',
    category: 'Sustainability',
    difficulty: 'Intermediate',
    duration: '15 mins',
    benefit: 'Consumes wholesome home-cooked nutrition while eliminating single-use packaging.',
    ecoPoints: 25,
    xp: 20,
    features: [0.3, 0.8, 0.0, 0.4, 0.2, 1.0, 0.0, 0.8],
    reasonTemplate: 'High match with your sustainability goals and plant-based nutrition.'
  },
  {
    name: 'Green Corridor Cycling Session',
    category: 'Fitness',
    difficulty: 'Intermediate',
    duration: '35 mins',
    benefit: 'Cardiovascular endurance training with zero direct vehicle tailpipe emissions.',
    ecoPoints: 30,
    xp: 35,
    features: [1.0, 0.9, 0.0, 0.3, 0.6, 1.0, 1.0, 0.4],
    reasonTemplate: 'Blends your aerobic fitness target with eco-friendly transit.'
  },
  {
    name: '20-Minute Deep Reading Block',
    category: 'Productivity',
    difficulty: 'Beginner',
    duration: '20 mins',
    benefit: 'Restores attention span and deep focus away from endless social feeds.',
    ecoPoints: 2,
    xp: 15,
    features: [0.0, 0.4, 0.9, 1.0, 0.8, 0.2, 0.0, 0.9],
    reasonTemplate: 'Matches your interest in continuous learning and productivity.'
  },
  {
    name: 'Hydration Reset with Lemon & Salt',
    category: 'Health',
    difficulty: 'Beginner',
    duration: '5 mins',
    benefit: 'Replenishes trace electrolytes and cellular hydration first thing in the morning.',
    ecoPoints: 5,
    xp: 10,
    features: [0.4, 1.0, 0.2, 0.5, 0.3, 0.4, 0.0, 1.0],
    reasonTemplate: 'Essential foundation for your overall health & vitality goals.'
  }
];

function calculateCosineSimilarity(vecA: number[], vecB: number[]): number {
  let dotProduct = 0;
  let normA = 0;
  let normB = 0;

  for (let i = 0; i < vecA.length; i++) {
    dotProduct += vecA[i] * vecB[i];
    normA += vecA[i] * vecA[i];
    normB += vecB[i] * vecB[i];
  }

  if (normA === 0 || normB === 0) return 0;
  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
}

function buildUserFeatureVector(user: User): number[] {
  // Dimensions: [Fitness, Health, Study, Productivity, Mental Wellness, Sustainability, Outdoor, LowTime]
  const goals = user.goals || [];
  const interests = user.interests || [];

  return [
    goals.includes('Fitness') ? 1.0 : 0.2,
    goals.includes('Health') ? 1.0 : 0.3,
    goals.includes('Study') ? 1.0 : 0.1,
    goals.includes('Productivity') ? 1.0 : 0.2,
    goals.includes('Mental Wellness') ? 1.0 : 0.3,
    goals.includes('Sustainability') ? 1.0 : 0.2,
    (interests.includes('Walking') || interests.includes('Running') || interests.includes('Nature') || interests.includes('Cycling')) ? 1.0 : 0.2,
    user.availableTime === '15 minutes' || user.availableTime === '30 minutes' ? 1.0 : 0.5
  ];
}

export const recommendationService = {
  getPersonalizedRecommendations(user: User, existingHabitNames: string[] = []): AIRecommendation[] {
    const userVector = buildUserFeatureVector(user);

    const scored = HABIT_CATALOG
      .filter(item => !existingHabitNames.some(name => name.toLowerCase() === item.name.toLowerCase()))
      .map((item, idx) => {
        const similarity = calculateCosineSimilarity(userVector, item.features);
        // Normalize similarity to realistic percentage (72% - 96%)
        const matchPercentage = Math.min(97, Math.max(72, Math.round(similarity * 100)));

        return {
          id: `rec-engine-${idx}`,
          name: item.name,
          category: item.category,
          matchPercentage,
          reason: item.reasonTemplate,
          difficulty: item.difficulty,
          benefit: item.benefit,
          duration: item.duration,
          ecoPoints: item.ecoPoints,
          xp: item.xp,
          whyDetails: `Calculated via content-based cosine similarity (${(similarity).toFixed(2)}) based on your goals: ${user.goals.join(', ')}.`
        };
      });

    return scored.sort((a, b) => b.matchPercentage - a.matchPercentage);
  }
};
