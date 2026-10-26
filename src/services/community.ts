// VELORA Community Service
import { Post, Comment, User } from '../types';
import { INITIAL_POSTS, INITIAL_COMMUNITY_USERS } from '../data/mockData';

const COMMUNITY_POSTS_KEY = 'velora_community_posts';
const COMMUNITY_FOLLOWS_KEY = 'velora_community_follows';

export const communityService = {
  getPosts(): Post[] {
    try {
      const stored = localStorage.getItem(COMMUNITY_POSTS_KEY);
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.warn(e);
    }
    return INITIAL_POSTS;
  },

  savePosts(posts: Post[]): void {
    try {
      localStorage.setItem(COMMUNITY_POSTS_KEY, JSON.stringify(posts));
    } catch (e) {
      console.warn(e);
    }
  },

  getCommunityUsers() {
    return INITIAL_COMMUNITY_USERS;
  },

  createPost(
    user: User, 
    caption: string, 
    activity?: Post['activity'], 
    photos?: string[],
    badgeEarned?: string
  ): Post {
    const newPost: Post = {
      id: `post-${Date.now()}`,
      userId: user.id,
      authorName: user.name,
      authorUsername: user.username,
      authorAvatar: user.avatar,
      caption,
      activity,
      photos: photos && photos.length > 0 ? photos : undefined,
      likes: 1,
      hasLiked: true,
      comments: [],
      badgeEarned,
      visibility: user.postVisibility,
      timestamp: 'Just now'
    };

    const current = this.getPosts();
    const updated = [newPost, ...current];
    this.savePosts(updated);
    return newPost;
  },

  toggleLike(postId: string): Post[] {
    const posts = this.getPosts();
    const updated = posts.map(post => {
      if (post.id === postId) {
        const nextLiked = !post.hasLiked;
        return {
          ...post,
          hasLiked: nextLiked,
          likes: nextLiked ? post.likes + 1 : Math.max(0, post.likes - 1)
        };
      }
      return post;
    });
    this.savePosts(updated);
    return updated;
  },

  addComment(postId: string, user: User, text: string): Post[] {
    const posts = this.getPosts();
    const newComment: Comment = {
      id: `c-${Date.now()}`,
      userId: user.id,
      userName: user.name,
      userAvatar: user.avatar,
      text,
      timestamp: 'Just now'
    };

    const updated = posts.map(post => {
      if (post.id === postId) {
        return {
          ...post,
          comments: [...post.comments, newComment]
        };
      }
      return post;
    });
    this.savePosts(updated);
    return updated;
  }
};
