import { Category, CATEGORY_EMOJIS } from '@/types/post';
import { cn } from '@/lib/utils';

interface FilterBarProps {
  currentFilter: Category | 'all';
  onFilterChange: (filter: Category | 'all') => void;
}

const filters: (Category | 'all')[] = ['all', 'Humor', 'Confession', 'Idea', 'Motivation'];

export function FilterBar({ currentFilter, onFilterChange }: FilterBarProps) {
  return (
    <div className="flex flex-wrap justify-center gap-2 my-8 animate-fade-in delay-300">
      {filters.map((filter) => (
        <button
          key={filter}
          onClick={() => onFilterChange(filter)}
          className={cn(
            "px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200",
            "border border-border",
            currentFilter === filter
              ? "bg-primary text-primary-foreground border-primary"
              : "bg-card text-foreground hover:bg-secondary"
          )}
        >
          {filter === 'all' ? '✨ All' : `${CATEGORY_EMOJIS[filter]} ${filter}`}
        </button>
      ))}
    </div>
  );
}