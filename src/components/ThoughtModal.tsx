import { useEffect } from 'react';
import { X } from 'lucide-react';
import { Post, CATEGORY_EMOJIS, CATEGORY_BADGE_CLASSES, Emoji } from '@/types/post';
import { EmojiReactions } from './EmojiReactions';
import { formatDistanceToNow } from 'date-fns';
import { cn } from '@/lib/utils';

interface ThoughtModalProps {
  post: Post;
  reactions: Record<Emoji, number>;
  userReactions: Emoji[];
  onReact: (postId: string, emoji: Emoji) => Promise<boolean>;
  onUnreact: (postId: string, emoji: Emoji) => Promise<boolean>;
  onClose: () => void;
}

export function ThoughtModal({ 
  post, 
  reactions, 
  userReactions, 
  onReact, 
  onUnreact,
  onClose 
}: ThoughtModalProps) {
  const timeAgo = formatDistanceToNow(new Date(post.created_at), { addSuffix: true });
  const totalReactions = Object.values(reactions).reduce((sum, count) => sum + count, 0);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleEsc);
    document.body.style.overflow = 'hidden';
    
    return () => {
      document.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = 'auto';
    };
  }, [onClose]);

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      {/* Backdrop - subtle dim, no blur */}
      <div className="absolute inset-0 bg-background/80 animate-fade-in" />
      
      {/* Modal */}
      <div 
        onClick={(e) => e.stopPropagation()}
        className={cn(
          "relative z-10 w-full max-w-lg rounded-2xl p-6 animate-scale-in",
          post.color
        )}
        style={{
          boxShadow: '0 24px 64px -16px hsl(0 0% 0% / 0.6)'
        }}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-background/20 hover:bg-background/40 transition-colors"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Category badge */}
        <div className={cn(
          "inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-sm font-semibold mb-4",
          CATEGORY_BADGE_CLASSES[post.category]
        )}>
          <span>{CATEGORY_EMOJIS[post.category]}</span>
          <span>{post.category}</span>
        </div>

        {/* Message */}
        <p className="text-lg leading-relaxed text-foreground mb-6">
          {post.message}
        </p>

        {/* Emoji Reactions */}
        <div className="mb-4">
          <h4 className="text-sm font-medium text-muted-foreground mb-2">Reactions</h4>
          <EmojiReactions
            postId={post.id}
            reactions={reactions}
            userReactions={userReactions}
            onReact={onReact}
            onUnreact={onUnreact}
          />
        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-border/50 text-sm text-muted-foreground">
          {totalReactions > 0 && `${totalReactions} reactions • `}
          Posted {timeAgo}
        </div>
      </div>
    </div>
  );
}
