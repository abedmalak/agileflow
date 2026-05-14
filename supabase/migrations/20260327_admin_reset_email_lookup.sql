-- Keep profile emails aligned with Auth and let admins resolve canonical reset targets.

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

UPDATE public.profiles AS profile
SET email = auth_user.email,
    updated_at = NOW()
FROM auth.users AS auth_user
WHERE profile.id = auth_user.id
  AND profile.email IS DISTINCT FROM auth_user.email;

CREATE OR REPLACE FUNCTION public.admin_get_auth_email(target_user_id UUID)
RETURNS TEXT
LANGUAGE sql
SECURITY DEFINER
STABLE
SET search_path = public, auth
AS $$
  SELECT lower(trim(auth_user.email))
  FROM auth.users AS auth_user
  WHERE auth_user.id = target_user_id
    AND EXISTS (
      SELECT 1
      FROM public.profiles AS current_profile
      WHERE current_profile.id = auth.uid()
        AND current_profile.role = 'admin'
    );
$$;

REVOKE ALL ON FUNCTION public.admin_get_auth_email(UUID) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.admin_get_auth_email(UUID) TO authenticated, service_role;
