-- Auth email helpers for signup validation and profile sync

CREATE OR REPLACE FUNCTION public.email_exists(check_email TEXT)
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
STABLE
SET search_path = public, auth
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM auth.users
    WHERE email IS NOT NULL
      AND lower(email) = lower(trim(check_email))
  );
$$;

REVOKE ALL ON FUNCTION public.email_exists(TEXT) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.email_exists(TEXT) TO anon, authenticated, service_role;

CREATE OR REPLACE FUNCTION public.sync_profile_email_from_auth()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, auth
AS $$
BEGIN
  UPDATE public.profiles
  SET email = NEW.email,
      updated_at = NOW()
  WHERE id = NEW.id
    AND email IS DISTINCT FROM NEW.email;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_email_updated ON auth.users;
CREATE TRIGGER on_auth_user_email_updated
  AFTER UPDATE OF email ON auth.users
  FOR EACH ROW
  WHEN (OLD.email IS DISTINCT FROM NEW.email)
  EXECUTE FUNCTION public.sync_profile_email_from_auth();
