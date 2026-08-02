-- 1. Replace always-true insert policy on contact_messages with validated checks
DROP POLICY IF EXISTS contact_anyone_insert ON public.contact_messages;

CREATE POLICY contact_anyone_insert
ON public.contact_messages
FOR INSERT
TO anon, authenticated
WITH CHECK (
  handled = false
  AND length(btrim(name)) BETWEEN 1 AND 120
  AND length(email) <= 200
  AND email ~ '^[^@\s]+@[^@\s]+\.[^@\s]+$'
  AND (subject IS NULL OR length(subject) <= 200)
  AND length(btrim(message)) BETWEEN 5 AND 5000
);

-- 2. Remove the anon-callable SECURITY DEFINER view counter (handled server-side now)
DROP FUNCTION IF EXISTS public.increment_post_views(text);

-- 3. Restrict the admin role check to signed-in users only (required by RLS policies)
REVOKE ALL ON FUNCTION public.has_role(uuid, public.app_role) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.has_role(uuid, public.app_role) FROM anon;
GRANT EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) TO authenticated;
GRANT EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) TO service_role;