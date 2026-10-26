// VELORA Sustainability & Eco Score Engine

import { EcoAction, EcoChallenge } from '../types';

export const ecoService = {
  calculateEcoScore(actions: EcoAction[], challenges: EcoChallenge[]): number {
    const totalActions = actions.length || 1;
    const completedActions = actions.filter(a => a.completed).length;
    const actionWeight = (completedActions / totalActions) * 60; // Up to 60 points

    const totalChallenges = challenges.length || 1;
    const challengeProgress = challenges.reduce((acc, c) => acc + (c.progress / c.target), 0) / totalChallenges;
    const challengeWeight = challengeProgress * 40; // Up to 40 points

    const score = Math.round(actionWeight + challengeWeight);
    return Math.min(100, Math.max(0, score));
  },

  calculateTotalCo2Saved(actions: EcoAction[]): { grams: number; kg: string; treesEquivalent: number } {
    const totalGrams = actions
      .filter(a => a.completed)
      .reduce((sum, a) => sum + (a.co2SavedGrams || 0), 0);
    const kg = (totalGrams / 1000).toFixed(2);
    // Average mature tree absorbs ~21.77 kg of CO2 per year (~60g/day)
    const treesEquivalent = Math.max(0.1, Number((totalGrams / 1500).toFixed(1)));

    return {
      grams: totalGrams,
      kg,
      treesEquivalent
    };
  }
};
