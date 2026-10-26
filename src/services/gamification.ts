// VELORA Gamification Service
import confetti from 'canvas-confetti';
import { Badge } from '../types';

export interface LevelInfo {
  level: number;
  currentXp: number;
  levelStartXp: number;
  nextLevelXp: number;
  progressPercentage: number;
}

export function calculateLevel(xp: number): LevelInfo {
  // Each level takes 100 XP baseline
  const level = Math.floor(xp / 100) + 1;
  const levelStartXp = (level - 1) * 100;
  const nextLevelXp = level * 100;
  const xpInCurrentLevel = xp - levelStartXp;
  const progressPercentage = Math.min(100, Math.max(0, Math.round((xpInCurrentLevel / 100) * 100)));

  return {
    level,
    currentXp: xp,
    levelStartXp,
    nextLevelXp,
    progressPercentage
  };
}

export const gamificationService = {
  triggerCelebration(): void {
    try {
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.7 },
        colors: ['#087F5B', '#39A96B', '#7BC96F', '#4DA3D9', '#F4C95D']
      });
    } catch (e) {
      // Fallback silently if canvas not available
    }
  },

  checkBadgeUnlocks(
    badges: Badge[], 
    stats: { streak: number; totalActivities: number; ecoScore: number; habitCount: number }
  ): { updatedBadges: Badge[]; newlyUnlocked: Badge[] } {
    const newlyUnlocked: Badge[] = [];
    const updatedBadges = badges.map(badge => {
      if (badge.unlocked) return badge;

      let shouldUnlock = false;
      if (badge.id === 'badge-1' && stats.streak >= 7) shouldUnlock = true;
      if (badge.id === 'badge-4' && stats.habitCount >= 15) shouldUnlock = true;
      if (badge.id === 'badge-6' && stats.totalActivities >= 10) shouldUnlock = true;
      if (badge.id === 'badge-10' && stats.ecoScore >= 70) shouldUnlock = true;

      if (shouldUnlock) {
        const unlockedBadge = { ...badge, unlocked: true, unlockedAt: new Date().toISOString() };
        newlyUnlocked.push(unlockedBadge);
        return unlockedBadge;
      }
      return badge;
    });

    if (newlyUnlocked.length > 0) {
      this.triggerCelebration();
    }

    return { updatedBadges, newlyUnlocked };
  }
};
