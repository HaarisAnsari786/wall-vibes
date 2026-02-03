import { useState, useEffect, useRef } from 'react';
import { Send } from 'lucide-react';
import { Category, CATEGORY_EMOJIS, MOOD_EMOJIS, MoodEmoji } from '@/types/post';
import { cn } from '@/lib/utils';

interface HeroInputProps {
  onSubmit: (message: string, category: Category) => Promise<boolean>;
}

const PLACEHOLDERS = [
  "What's on your mind today?",
  "Share a thought with the world...",
  "Got something to confess?",
  "Any bright ideas lately?",
];

export function HeroInput({ onSubmit }: HeroInputProps) {
  const [message, setMessage] = useState('');
  const [category, setCategory] = useState<Category>('Idea');
  const [selectedMood, setSelectedMood] = useState<MoodEmoji | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [typedPlaceholder, setTypedPlaceholder] = useState('');
  const [isLifted, setIsLifted] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Typewriter effect for placeholder
  useEffect(() => {
    const placeholder = PLACEHOLDERS[Math.floor(Math.random() * PLACEHOLDERS.length)];
    let index = 0;
    
    const interval = setInterval(() => {
      if (index <= placeholder.length) {
        setTypedPlaceholder(placeholder.slice(0, index));
        index++;
      } else {
        clearInterval(interval);
      }
    }, 50);

    return () => clearInterval(interval);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || isSubmitting) return;

    setIsSubmitting(true);
    setIsLifted(true);

    const fullMessage = selectedMood ? `${selectedMood} ${message}` : message;
    const success = await onSubmit(fullMessage, category);

    if (success) {
      setMessage('');
      setSelectedMood(null);
    }

    setTimeout(() => {
      setIsSubmitting(false);
      setIsLifted(false);
    }, 500);
  };

  const maxLength = 280;
  const charCount = message.length;
  const charPercentage = (charCount / maxLength) * 100;

  return (
    <form 
      onSubmit={handleSubmit}
      className={cn(
        "solid-card p-6 md:p-8 max-w-2xl mx-auto animate-slide-up",
        isLifted && "transform -translate-y-2"
      )}
      style={{
        transition: 'transform 0.3s ease-out, box-shadow 0.3s ease-out',
        boxShadow: isLifted 
          ? 'var(--shadow-glow), var(--shadow-card-hover)'
          : 'var(--shadow-card)'
      }}
    >
      {/* Header */}
      <h2 className="font-heading text-xl md:text-2xl font-semibold text-foreground mb-6">
        Share Your Thought
      </h2>

      {/* Textarea */}
      <div className="relative mb-4">
        <textarea
          ref={textareaRef}
          value={message}
          onChange={(e) => setMessage(e.target.value.slice(0, maxLength))}
          placeholder={typedPlaceholder || "What's on your mind?"}
          rows={4}
          className="w-full px-4 py-3 rounded-xl bg-secondary/50 border border-border 
                     text-foreground placeholder:text-muted-foreground
                     focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary
                     resize-none transition-all"
        />
        
        {/* Character counter ring */}
        <div className="absolute bottom-3 right-3 flex items-center gap-2">
          <svg className="w-8 h-8 -rotate-90" viewBox="0 0 36 36">
            <circle
              cx="18"
              cy="18"
              r="15"
              fill="none"
              stroke="hsl(var(--border))"
              strokeWidth="3"
            />
            <circle
              cx="18"
              cy="18"
              r="15"
              fill="none"
              stroke={charPercentage > 90 ? 'hsl(var(--destructive))' : 'hsl(var(--primary))'}
              strokeWidth="3"
              strokeDasharray={`${charPercentage} 100`}
              strokeLinecap="round"
              className="transition-all duration-300"
            />
          </svg>
          <span className={cn(
            "text-xs font-medium",
            charPercentage > 90 ? "text-destructive" : "text-muted-foreground"
          )}>
            {charCount}/{maxLength}
          </span>
        </div>
      </div>

      {/* Mood selector */}
      <div className="mb-4">
        <label className="text-sm font-medium text-muted-foreground mb-2 block">
          How are you feeling?
        </label>
        <div className="flex flex-wrap gap-2">
          {MOOD_EMOJIS.map((emoji) => (
            <button
              key={emoji}
              type="button"
              onClick={() => setSelectedMood(selectedMood === emoji ? null : emoji)}
              className={cn(
                "w-10 h-10 rounded-xl flex items-center justify-center text-xl",
                "border border-border transition-all duration-200",
                selectedMood === emoji 
                  ? "bg-primary/20 border-primary scale-110" 
                  : "bg-secondary/50 hover:bg-secondary hover:scale-105"
              )}
            >
              {emoji}
            </button>
          ))}
        </div>
      </div>

      {/* Category selector */}
      <div className="mb-6">
        <label className="text-sm font-medium text-muted-foreground mb-2 block">
          Category
        </label>
        <div className="flex flex-wrap gap-2">
          {(Object.keys(CATEGORY_EMOJIS) as Category[]).map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setCategory(cat)}
              className={cn(
                "px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200",
                "border border-border",
                category === cat 
                  ? "bg-primary text-primary-foreground border-primary" 
                  : "bg-secondary/50 text-foreground hover:bg-secondary"
              )}
            >
              {CATEGORY_EMOJIS[cat]} {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Submit button */}
      <button
        type="submit"
        disabled={!message.trim() || isSubmitting}
        className={cn(
          "btn-premium w-full flex items-center justify-center gap-2",
          "disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
        )}
      >
        <Send className={cn(
          "w-5 h-5 transition-transform",
          isSubmitting && "animate-pulse"
        )} />
        <span>{isSubmitting ? 'Posting...' : 'Share Thought'}</span>
      </button>
    </form>
  );
}
