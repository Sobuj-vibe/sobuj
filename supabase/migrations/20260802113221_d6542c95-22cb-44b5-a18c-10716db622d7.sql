ALTER TABLE public.blog_posts ADD COLUMN IF NOT EXISTS views integer NOT NULL DEFAULT 0;

CREATE OR REPLACE FUNCTION public.increment_post_views(_slug text)
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  new_views integer;
BEGIN
  UPDATE public.blog_posts
     SET views = views + 1
   WHERE slug = _slug
     AND status = 'published'::content_status
  RETURNING views INTO new_views;
  RETURN COALESCE(new_views, 0);
END;
$$;

REVOKE ALL ON FUNCTION public.increment_post_views(text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.increment_post_views(text) TO anon, authenticated, service_role;