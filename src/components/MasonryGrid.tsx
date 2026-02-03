import { useState } from 'react';
import { Loader2 } from 'lucide-react';
import { Post, Emoji } from '@/types/post';
import { ThoughtCard } from './ThoughtCard';
import { ThoughtModal } from './ThoughtModal';

// Default empty reaction record
const emptyReactions: Record<Emoji, number> = {
  '❤️': 0, '😂': 0, '🔥': 0, '😮': 0, '😢': 0, '👏': 0
};

interface MasonryGridProps {
  posts: Post[];
  loading: boolean;
  reactions: Record<string, Record<Emoji, number>>;
  userReactions: Record<string, Emoji[]>;
  onReact: (postId: string, emoji: Emoji) => Promise<boolean>;
  onUnreact: (postId: string, emoji: Emoji) => Promise<boolean>;
}

export function MasonryGrid({
  posts, 
  loading, 
  reactions,
  userReactions,
  onReact, 
  onUnreact 
}: MasonryGridProps) {
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
        <p className="mt-4 text-muted-foreground">Loading thoughts...</p>
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center animate-fade-in">
        <div className="text-6xl mb-4">💭</div>
        <h3 className="text-xl font-heading font-semibold text-foreground mb-2">
          No thoughts yet
        </h3>
        <p className="text-muted-foreground">Be the first to share!</p>
      </div>
    );
  }

  return (
    <>
      <div className="masonry-grid px-4 md:px-8">
        {posts.map((post, index) => (
          <ThoughtCard
            key={post.id}
            post={post}
            reactions={{ ...emptyReactions, ...(reactions[post.id] || {}) }}
            userReactions={userReactions[post.id] || []}
            onReact={onReact}
            onUnreact={onUnreact}
            onClick={() => setSelectedPost(post)}
            index={index}
          />
        ))}
      </div>

      {selectedPost && (
        <ThoughtModal
          post={selectedPost}
          reactions={{ ...emptyReactions, ...(reactions[selectedPost.id] || {}) }}
          userReactions={userReactions[selectedPost.id] || []}
          onReact={onReact}
          onUnreact={onUnreact}
          onClose={() => setSelectedPost(null)}
        />
      )}
    </>
  );
}