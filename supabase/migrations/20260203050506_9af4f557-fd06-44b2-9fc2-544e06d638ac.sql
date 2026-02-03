-- Create reactions table for multi-emoji support
CREATE TABLE public.reactions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  post_id UUID NOT NULL REFERENCES public.posts(id) ON DELETE CASCADE,
  emoji TEXT NOT NULL CHECK (emoji IN ('❤️', '😂', '🔥', '😮', '😢', '👏')),
  user_fingerprint TEXT NOT NULL, -- Anonymous user identifier (browser fingerprint)
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(post_id, emoji, user_fingerprint)
);

-- Enable RLS
ALTER TABLE public.reactions ENABLE ROW LEVEL SECURITY;

-- Anyone can view reactions
CREATE POLICY "Anyone can view reactions"
ON public.reactions
FOR SELECT
USING (true);

-- Anyone can add reactions
CREATE POLICY "Anyone can add reactions"
ON public.reactions
FOR INSERT
WITH CHECK (true);

-- Anyone can remove their own reactions
CREATE POLICY "Anyone can remove their own reactions"
ON public.reactions
FOR DELETE
USING (true);

-- Add index for performance
CREATE INDEX idx_reactions_post_id ON public.reactions(post_id);
CREATE INDEX idx_reactions_emoji ON public.reactions(post_id, emoji);

-- Enable realtime for reactions
ALTER PUBLICATION supabase_realtime ADD TABLE public.reactions;