export type Category = 'Humor' | 'Confession' | 'Idea' | 'Motivation';

export type Emoji = '❤️' | '😂' | '🔥' | '😮' | '😢' | '👏';

export const EMOJIS: Emoji[] = ['❤️', '😂', '🔥', '😮', '😢', '👏'];

export interface Reaction {
  emoji: Emoji;
  count: number;
  hasReacted: boolean;
}

export interface Post {
  id: string;
  message: string;
  category: Category;
  likes: number;
  color: string;
  rotation: number;
  created_at: string;
  reactions?: Record<Emoji, number>;
}

export const STICKY_COLORS = [
  'sticky-yellow',
  'sticky-pink',
  'sticky-blue',
  'sticky-green',
  'sticky-purple',
  'sticky-orange',
  'sticky-mint',
  'sticky-peach',
] as const;

export const CATEGORY_EMOJIS: Record<Category, string> = {
  Humor: '😂',
  Confession: '🤫',
  Idea: '💡',
  Motivation: '🚀',
};

export const CATEGORY_BADGE_CLASSES: Record<Category, string> = {
  Humor: 'badge-humor',
  Confession: 'badge-confession',
  Idea: 'badge-idea',
  Motivation: 'badge-motivation',
};

export const MOOD_EMOJIS = ['😊', '😔', '😡', '❤️', '🔥', '💭', '✨', '🎉'] as const;
export type MoodEmoji = typeof MOOD_EMOJIS[number];
