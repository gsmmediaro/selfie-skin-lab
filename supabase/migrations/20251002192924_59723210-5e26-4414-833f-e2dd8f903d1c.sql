-- Create helper function to increment achievement count
CREATE OR REPLACE FUNCTION public.increment_total_achievements(user_id uuid)
RETURNS void
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  UPDATE public.user_stats 
  SET total_achievements = total_achievements + 1
  WHERE user_stats.user_id = increment_total_achievements.user_id;
$$;

-- Add comment
COMMENT ON FUNCTION public.increment_total_achievements IS 'Helper function to increment total achievements count for a user';