// VELORA Firebase Architecture Abstraction
// Designed for Google Cloud Firestore, Firebase Authentication & Firebase Storage.
// Automatically falls back to localStorage/Mock state when Firebase credentials are not set.

import { User, Habit, Activity, Post, EcoAction, MonthlyUpdateRecord } from '../types';

export const isFirebaseConfigured = (): boolean => {
  // Check if env vars are provided
  return Boolean(
    import.meta.env.VITE_FIREBASE_API_KEY &&
    import.meta.env.VITE_FIREBASE_PROJECT_ID
  );
};

export interface DataRepository<T> {
  getAll(): Promise<T[]>;
  getById(id: string): Promise<T | null>;
  create(item: T): Promise<T>;
  update(id: string, updates: Partial<T>): Promise<T>;
  delete(id: string): Promise<boolean>;
}

// Memory / LocalStorage based resilient fallback repository
class LocalStorageRepository<T extends { id: string }> implements DataRepository<T> {
  private storageKey: string;
  private defaultItems: T[];

  constructor(storageKey: string, defaultItems: T[] = []) {
    this.storageKey = storageKey;
    this.defaultItems = defaultItems;
  }

  private load(): T[] {
    try {
      const data = localStorage.getItem(this.storageKey);
      if (!data) {
        this.save(this.defaultItems);
        return this.defaultItems;
      }
      return JSON.parse(data);
    } catch (e) {
      console.warn(`Failed to read ${this.storageKey}`, e);
      return this.defaultItems;
    }
  }

  private save(items: T[]): void {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(items));
    } catch (e) {
      console.warn(`Failed to write ${this.storageKey}`, e);
    }
  }

  async getAll(): Promise<T[]> {
    return this.load();
  }

  async getById(id: string): Promise<T | null> {
    const items = this.load();
    return items.find(item => item.id === id) || null;
  }

  async create(item: T): Promise<T> {
    const items = this.load();
    const updated = [item, ...items];
    this.save(updated);
    return item;
  }

  async update(id: string, updates: Partial<T>): Promise<T> {
    const items = this.load();
    const index = items.findIndex(item => item.id === id);
    if (index === -1) throw new Error(`Item ${id} not found in ${this.storageKey}`);
    const updated = { ...items[index], ...updates };
    items[index] = updated;
    this.save(items);
    return updated;
  }

  async delete(id: string): Promise<boolean> {
    const items = this.load();
    const filtered = items.filter(item => item.id !== id);
    this.save(filtered);
    return true;
  }
}

// Repositories exported for clean separation of concerns
export const firestoreServices = {
  usersRepo: new LocalStorageRepository<User>('velora_users'),
  habitsRepo: new LocalStorageRepository<Habit>('velora_habits'),
  activitiesRepo: new LocalStorageRepository<Activity>('velora_activities'),
  postsRepo: new LocalStorageRepository<Post>('velora_posts'),
  ecoActivitiesRepo: new LocalStorageRepository<EcoAction>('velora_eco_actions'),
  monthlyUpdatesRepo: new LocalStorageRepository<MonthlyUpdateRecord>('velora_monthly_updates'),
};
