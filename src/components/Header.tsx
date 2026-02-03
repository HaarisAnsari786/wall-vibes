import { Sparkles } from 'lucide-react';

export function Header() {
  return (
    <header className="py-8 md:py-12 text-center animate-slide-up">
      <div className="flex items-center justify-center gap-2 mb-3">
        <Sparkles className="w-6 h-6 text-primary" />
        <span className="text-sm font-medium text-primary uppercase tracking-wider">
          Digital Expression Wall
        </span>
      </div>
      
      <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-4">
        Share Your Thoughts
      </h1>
      
      <p className="text-lg text-muted-foreground max-w-xl mx-auto">
        A space to express yourself anonymously. Post ideas, confessions, humor, or motivation.
      </p>
    </header>
  );
}