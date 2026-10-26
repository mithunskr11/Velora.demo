// VELORA SNAP Service
import { Snap, Story, Conversation, Message, SnapViewMode, StoryAudience, SnapDeliveryStatus, SnapSticker, AttachedActivitySummary } from '../types';
import { VELORA_STICKERS, INITIAL_STORIES, INITIAL_CONVERSATIONS, INITIAL_MESSAGES } from '../data/mockData';

const STORIES_KEY = 'velora_snap_stories';
const CONVERSATIONS_KEY = 'velora_snap_conversations';
const MESSAGES_KEY = 'velora_snap_messages';

export const PHOTO_FILTERS = [
  { id: 'normal', name: 'Normal', css: 'none', cssFilter: 'none' },
  { id: 'forest', name: 'Forest Glow', css: 'saturate(1.25) contrast(1.1) hue-rotate(-8deg)', cssFilter: 'saturate(1.25) contrast(1.1) hue-rotate(-8deg)' },
  { id: 'health', name: 'Crisp Blue', css: 'contrast(1.15) brightness(1.05) saturate(1.1) hue-rotate(10deg)', cssFilter: 'contrast(1.15) brightness(1.05) saturate(1.1) hue-rotate(10deg)' },
  { id: 'warm', name: 'Sunset Warmth', css: 'sepia(0.25) saturate(1.3) contrast(1.05)', cssFilter: 'sepia(0.25) saturate(1.3) contrast(1.05)' },
  { id: 'monolith', name: 'Monolith B&W', css: 'grayscale(1) contrast(1.25)', cssFilter: 'grayscale(1) contrast(1.25)' },
  { id: 'vivid', name: 'Vivid Nature', css: 'saturate(1.4) contrast(1.15) brightness(1.02)', cssFilter: 'saturate(1.4) contrast(1.15) brightness(1.02)' }
];

export const snapService = {
  getStickers(): SnapSticker[] {
    return VELORA_STICKERS;
  },

  getStories(): Story[] {
    try {
      const stored = localStorage.getItem(STORIES_KEY);
      if (stored) {
        const parsed: Story[] = JSON.parse(stored);
        const now = new Date().getTime();
        // Filter out expired stories (24h)
        return parsed.filter(s => new Date(s.expiryAt).getTime() > now);
      }
    } catch (e) {
      console.warn('Failed to load stories from local storage', e);
    }
    return INITIAL_STORIES;
  },

  saveStories(stories: Story[]): void {
    try {
      localStorage.setItem(STORIES_KEY, JSON.stringify(stories));
    } catch (e) {
      console.warn('Failed to save stories to local storage', e);
    }
  },

  getConversations(): Conversation[] {
    try {
      const stored = localStorage.getItem(CONVERSATIONS_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.warn('Failed to load conversations', e);
    }
    return INITIAL_CONVERSATIONS;
  },

  saveConversations(conversations: Conversation[]): void {
    try {
      localStorage.setItem(CONVERSATIONS_KEY, JSON.stringify(conversations));
    } catch (e) {
      console.warn('Failed to save conversations', e);
    }
  },

  getMessages(): Record<string, Message[]> {
    try {
      const stored = localStorage.getItem(MESSAGES_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.warn('Failed to load messages', e);
    }
    return INITIAL_MESSAGES;
  },

  saveMessages(messages: Record<string, Message[]>): void {
    try {
      localStorage.setItem(MESSAGES_KEY, JSON.stringify(messages));
    } catch (e) {
      console.warn('Failed to save messages', e);
    }
  },

  createStory(
    userId: string,
    userName: string,
    userUsername: string,
    userAvatar: string,
    mediaPath: string,
    caption?: string,
    stickers?: SnapSticker[],
    textOverlay?: string,
    filter?: string,
    attachedActivity?: AttachedActivitySummary,
    audience: StoryAudience = 'followers'
  ): Story {
    const now = new Date();
    const expiry = new Date(now.getTime() + 24 * 60 * 60 * 1000); // 24 hours expiry

    const newStory: Story = {
      id: `story-${Date.now()}`,
      userId,
      userName,
      userUsername,
      userAvatar,
      mediaPath,
      caption,
      stickers,
      textOverlay,
      filter,
      attachedActivity,
      audience,
      createdAt: now.toISOString(),
      expiryAt: expiry.toISOString(),
      viewers: [],
      hasViewed: false
    };

    const currentStories = this.getStories();
    const updated = [newStory, ...currentStories];
    this.saveStories(updated);
    return newStory;
  },

  deleteStory(storyId: string): Story[] {
    const current = this.getStories();
    const filtered = current.filter(s => s.id !== storyId);
    this.saveStories(filtered);
    return filtered;
  },

  markStoryAsViewed(storyId: string, viewerId: string, viewerName: string, viewerAvatar: string): Story[] {
    const current = this.getStories();
    const updated = current.map(story => {
      if (story.id === storyId) {
        const hasViewer = story.viewers.some(v => v.userId === viewerId);
        const newViewers = hasViewer 
          ? story.viewers 
          : [...story.viewers, { userId: viewerId, userName: viewerName, userAvatar: viewerAvatar, viewedAt: 'Just now' }];
        return {
          ...story,
          hasViewed: true,
          viewers: newViewers
        };
      }
      return story;
    });
    this.saveStories(updated);
    return updated;
  }
};
