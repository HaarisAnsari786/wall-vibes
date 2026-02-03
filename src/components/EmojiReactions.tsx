import { useState, useEffect } from 'react';
import { EMOJIS, Emoji } from '@/types/post';
import { cn } from '@/lib/utils';

interface EmojiReactionsProps {
  postId: string;
  reactions: Record<Emoji, number>;
  userReactions: Emoji[];
  onReact: (postId: string, emoji: Emoji) => Promise<boolean>;
  onUnreact: (postId: string, emoji: Emoji) => Promise<boolean>;
}

export function EmojiReactions({ 
  postId, 
  reactions, 
  userReactions, 
  onReact, 
  onUnreact 
}: EmojiReactionsProps) {
  const [animatingEmoji, setAnimatingEmoji] = useState<Emoji | null>(null);
  const [localReactions, setLocalReactions] = useState(reactions);
  const [localUserReactions, setLocalUserReactions] = useState(userReactions);

  useEffect(() => {
    setLocalReactions(reactions);
    setLocalUserReactions(userReactions);
  }, [reactions, userReactions]);

  const handleClick = async (emoji: Emoji) => {
    if (animatingEmoji) return;
    
    setAnimatingEmoji(emoji);
    const hasReacted = localUserReactions.includes(emoji);
    
    // Optimistic update
    if (hasReacted) {
      setLocalReactions(prev => ({
        ...prev,
        [emoji]: Math.max(0, (prev[emoji] || 0) - 1)
      }));
      setLocalUserReactions(prev => prev.filter(e => e !== emoji));
    } else {
      setLocalReactions(prev => ({
        ...prev,
        [emoji]: (prev[emoji] || 0) + 1
      }));
      setLocalUserReactions(prev => [...prev, emoji]);
    }

    const success = hasReacted 
      ? await onUnreact(postId, emoji)
      : await onReact(postId, emoji);

    if (!success) {
      // Revert on failure
      setLocalReactions(reactions);
      setLocalUserReactions(userReactions);
    }

    setTimeout(() => setAnimatingEmoji(null), 300);
  };

  return (
    <div className="flex flex-wrap gap-1.5">
      {EMOJIS.map((emoji) => {
        const count = localReactions[emoji] || 0;
        const hasReacted = localUserReactions.includes(emoji);
        const isAnimating = animatingEmoji === emoji;

        return (
          <button
            key={emoji}
            onClick={() => handleClick(emoji)}
            className={cn(
              "reaction-button",
              hasReacted && "active",
              isAnimating && "animate-[reaction-pop_0.3s_ease-out]"
            )}
            aria-label={`React with ${emoji}. ${count} reactions`}
          >
            <span className="text-base">{emoji}</span>
            {count > 0 && (
              <span className="text-xs font-medium text-muted-foreground">
                {count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
