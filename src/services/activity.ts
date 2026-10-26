// VELORA Activity Engine & GPS Service
// Supports live simulation (Demo GPS Mode) and browser geolocation.

import { ActivityType, ActivityCoordinate, Activity } from '../types';

// Predefined scenic loop around Emerald Greenbelt Park / Lake
export const SIMULATED_SCENIC_ROUTE: ActivityCoordinate[] = [
  { lat: 37.7749, lng: -122.4194 },
  { lat: 37.7758, lng: -122.4178 },
  { lat: 37.7770, lng: -122.4162 },
  { lat: 37.7788, lng: -122.4148 },
  { lat: 37.7805, lng: -122.4135 },
  { lat: 37.7820, lng: -122.4149 },
  { lat: 37.7832, lng: -122.4170 },
  { lat: 37.7822, lng: -122.4192 },
  { lat: 37.7801, lng: -122.4215 },
  { lat: 37.7778, lng: -122.4225 },
  { lat: 37.7760, lng: -122.4212 },
  { lat: 37.7749, lng: -122.4194 }
];

export interface TrackingMetrics {
  durationSeconds: number;
  distanceKm: number;
  speedKmh: number;
  paceFormatted: string;
  caloriesKcal: number;
  elevationMeters: number;
  heartRateBpm: number;
  coordinates: ActivityCoordinate[];
}

// Haversine formula to compute distance between coordinates in km
export function haversineDistance(c1: ActivityCoordinate, c2: ActivityCoordinate): number {
  const R = 6371; // km
  const dLat = ((c2.lat - c1.lat) * Math.PI) / 180;
  const dLng = ((c2.lng - c1.lng) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((c1.lat * Math.PI) / 180) *
      Math.cos((c2.lat * Math.PI) / 180) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export function formatDuration(seconds: number): string {
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  if (hrs > 0) {
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

export function calculatePace(durationSec: number, distanceKm: number): string {
  if (distanceKm <= 0.02 || durationSec <= 0) return "0'00\" /km";
  const secPerKm = durationSec / distanceKm;
  const mins = Math.floor(secPerKm / 60);
  const secs = Math.floor(secPerKm % 60);
  return `${mins}'${secs.toString().padStart(2, '0')}" /km`;
}

export function estimateCalories(type: ActivityType, distanceKm: number, durationSec: number): number {
  // Simple realistic MET based formulas
  const hours = durationSec / 3600;
  let calPerHour = 260; // Walking baseline
  if (type === 'Running') calPerHour = 650;
  if (type === 'Cycling') calPerHour = 480;
  if (type === 'Hiking') calPerHour = 420;
  
  // Blend duration and distance
  const byDuration = hours * calPerHour;
  const byDistance = distanceKm * (type === 'Running' ? 70 : type === 'Cycling' ? 35 : 45);
  return Math.round((byDuration + byDistance) / 2);
}

export const activityService = {
  createCompletedActivity(
    type: ActivityType,
    metrics: TrackingMetrics,
    userId: string,
    proof?: { photoUrl?: string; caption?: string }
  ): Activity {
    const xpEarned = Math.round(30 + metrics.distanceKm * 5);
    const ecoPointsEarned = Math.round(10 + metrics.distanceKm * 3);

    return {
      id: `act-${Date.now()}`,
      userId,
      type,
      title: `${type} Outdoor Session`,
      distance: Number(metrics.distanceKm.toFixed(2)),
      duration: metrics.durationSeconds,
      pace: metrics.paceFormatted,
      speed: Number(metrics.speedKmh.toFixed(1)),
      calories: metrics.caloriesKcal,
      elevation: metrics.elevationMeters,
      route: metrics.coordinates,
      proof,
      visibility: 'public',
      xpEarned,
      ecoPointsEarned,
      timestamp: new Date().toISOString()
    };
  }
};
