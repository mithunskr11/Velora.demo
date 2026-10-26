// VELORA Auth Service
import { User } from '../types';
import { INITIAL_USER } from '../data/mockData';

const AUTH_USER_KEY = 'velora_auth_user';

export interface AuthSession {
  user: User | null;
  isAuthenticated: boolean;
  isDemo: boolean;
}

export const authService = {
  getCurrentUser(): User | null {
    try {
      const stored = localStorage.getItem(AUTH_USER_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.warn('Failed to parse stored auth user', e);
    }
    // Default to initial demo user Alex
    return INITIAL_USER;
  },

  loginDemoUser(): User {
    const user = { ...INITIAL_USER };
    try {
      localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user));
    } catch (e) {
      console.warn('Failed to persist auth user', e);
    }
    return user;
  },

  loginWithEmail(email: string): User {
    const user = {
      ...INITIAL_USER,
      email,
      name: email.split('@')[0].replace(/[._]/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
      username: email.split('@')[0].toLowerCase()
    };
    try {
      localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user));
    } catch (e) {
      console.warn(e);
    }
    return user;
  },

  signUpWithEmail(email: string, name: string): User {
    const user: User = {
      ...INITIAL_USER,
      id: `user-${Date.now()}`,
      name,
      email,
      username: name.toLowerCase().replace(/\s+/g, '_'),
      createdAt: new Date().toISOString()
    };
    try {
      localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user));
    } catch (e) {
      console.warn(e);
    }
    return user;
  },

  updateUserProfile(updatedFields: Partial<User>): User {
    const currentUser = this.getCurrentUser() || INITIAL_USER;
    const merged: User = {
      ...currentUser,
      ...updatedFields,
      updatedAt: new Date().toISOString()
    };
    try {
      localStorage.setItem(AUTH_USER_KEY, JSON.stringify(merged));
    } catch (e) {
      console.warn(e);
    }
    return merged;
  },

  logout(): void {
    try {
      localStorage.removeItem(AUTH_USER_KEY);
    } catch (e) {
      console.warn(e);
    }
  }
};
