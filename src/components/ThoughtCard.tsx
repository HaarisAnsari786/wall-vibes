import { useState } from 'react';
import { Post, CATEGORY_EMOJIS, CATEGORY_BADGE_CLASSES, Emoji } from '@/types/post';
import { EmojiReactions } from './EmojiReactions';
import { formatDistanceToNow } from 'date-fns';
import { cn } from '@/lib/utils';

interface ThoughtCardProps {
  post: Post;
  reactions: Record<Emoji, number>;
  userReactions: Emoji[];
  onReact: (postId: string, emoji: Emoji) => Promise<boolean>;
  onUnreact: (postId: string, emoji: Emoji) => Promise<boolean>;
  onClick?: () => void;
  index?: number;
}

export function ThoughtCard({ 
  post, 
  reactions, 
  userReactions, 
  onReact, 
  onUnreact,
  onClick,
  index = 0 
}: ThoughtCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const timeAgo = formatDistanceToNow(new Date(post.created_at), { addSuffix: true });

  const totalReactions = Object.values(reactions).reduce((sum, count) => sum + count, 0);

  return (
    <div 
      className="masonry-item animate-card-enter"
      style={{ animationDelay: `${index * 0.05}s` }}
    >
      <article
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={onClick}
        className={cn(
          "thought-card p-5 cursor-pointer",
          post.color
        )}
      >
        {/* Category badge */}
        <div className={cn(
          "inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold mb-3",
          CATEGORY_BADGE_CLASSES[post.category]
        )}>
          <span>{CATEGORY_EMOJIS[post.category]}</span>
          <span>{post.category}</span>
        </div>

        {/* Message */}
        <p className="text-base leading-relaxed text-foreground mb-4">
          {post.message}
        </p>

        {/* Emoji Reactions */}
        <div className="mb-3" onClick={(e) => e.stopPropagation()}>
          <EmojiReactions
            postId={post.id}
            reactions={reactions}
            userReactions={userReactions}
            onReact={onReact}
            onUnreact={onUnreact}
          />
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-3 border-t border-border/50">
          <span className="text-xs text-muted-foreground">
            {totalReactions > 0 && `${totalReactions} reactions • `}
            {timeAgo}
          </span>
          
          {/* Trending indicator */}
          {totalReactions >= 10 && (
            <span className="text-sm animate-pulse">🔥</span>
          )}
        </div>
      </article>
    </div>
  );
}
