import { TrendingUp } from 'lucide-react';
import { Post, Emoji } from '@/types/post';

interface TrendingSectionProps {
  posts: Post[];
  reactions: Record<string, Record<Emoji, number>>;
}

export function TrendingSection({ posts, reactions }: TrendingSectionProps) {
  if (posts.length === 0) return null;

  return (
    <section className="my-8 animate-fade-in delay-200">
      <div className="flex items-center gap-2 mb-4">
        <TrendingUp className="w-5 h-5 text-accent" />
        <h2 className="font-heading text-lg font-semibold text-foreground">
          Trending Now
        </h2>
      </div>

      <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
        {posts.slice(0, 5).map((post, index) => {
          const postReactions = reactions[post.id] || {};
          const totalReactions = Object.values(postReactions).reduce((sum: number, count: number) => sum + count, 0);
          
          return (
            <div
              key={post.id}
              className="flex-shrink-0 w-64 p-4 rounded-xl bg-card border border-border
                         hover:bg-secondary/50 transition-all duration-200 cursor-pointer"
            >
              <div className="flex items-start gap-2 mb-2">
                <span className="text-xl font-bold text-primary">#{index + 1}</span>
                <p className="text-sm text-foreground line-clamp-2">{post.message}</p>
              </div>
              <div className="text-xs text-muted-foreground">
                {(totalReactions as number) > 0 ? `${totalReactions} reactions` : `${post.likes} likes`}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}