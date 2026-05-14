-- Safe schema - handles existing tables, adds missing columns
-- Run this in Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- TABLES (IF NOT EXISTS)
-- ============================================================

CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  email TEXT,
  avatar TEXT,
  role TEXT DEFAULT 'member',
  theme TEXT DEFAULT 'light',
  settings JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.boards (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  color TEXT DEFAULT '#0073EA',
  icon TEXT DEFAULT '📋',
  visibility TEXT DEFAULT 'private',
  columns JSONB DEFAULT '[]'::jsonb,
  groups JSONB DEFAULT '[]'::jsonb,
  settings JSONB DEFAULT '{}'::jsonb,
  created_date TIMESTAMPTZ DEFAULT NOW(),
  updated_date TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  board_id UUID REFERENCES public.boards(id) ON DELETE CASCADE NOT NULL,
  group_id TEXT,
  title TEXT NOT NULL,
  description TEXT,
  data JSONB DEFAULT '{}'::jsonb,
  order_index INTEGER DEFAULT 0,
  created_date TIMESTAMPTZ DEFAULT NOW(),
  updated_date TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.calendar_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  start_date TIMESTAMPTZ NOT NULL,
  end_date TIMESTAMPTZ,
  color TEXT DEFAULT '#0073EA',
  event_type TEXT DEFAULT 'other',
  location TEXT,
  attendees JSONB DEFAULT '[]'::jsonb,
  all_day BOOLEAN DEFAULT false,
  created_date TIMESTAMPTZ DEFAULT NOW(),
  updated_date TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.user_stories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  priority TEXT DEFAULT 'medium',
  status TEXT DEFAULT 'backlog',
  story_points INTEGER DEFAULT 0,
  sprint_id UUID,
  board_id UUID REFERENCES public.boards(id) ON DELETE SET NULL,
  assigned_to TEXT,
  acceptance_criteria JSONB DEFAULT '[]'::jsonb,
  created_date TIMESTAMPTZ DEFAULT NOW(),
  updated_date TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.sprints (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  board_id UUID REFERENCES public.boards(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  goal TEXT,
  start_date DATE,
  end_date DATE,
  status TEXT DEFAULT 'planning',
  capacity INTEGER DEFAULT 40,
  committed_points INTEGER DEFAULT 0,
  completed_points INTEGER DEFAULT 0,
  velocity INTEGER DEFAULT 0,
  created_date TIMESTAMPTZ DEFAULT NOW(),
  updated_date TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  message TEXT,
  type TEXT DEFAULT 'info',
  is_read BOOLEAN DEFAULT false,
  link TEXT,
  created_date TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.team_members (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  board_id UUID REFERENCES public.boards(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role TEXT DEFAULT 'editor',
  invited_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_date TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(board_id, user_id)
);

CREATE TABLE IF NOT EXISTS public.user_preferences (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  email_notifications BOOLEAN DEFAULT true,
  in_app_notifications BOOLEAN DEFAULT true,
  due_date_reminders BOOLEAN DEFAULT true,
  due_date_reminder_hours INTEGER DEFAULT 24,
  sprint_update_notifications BOOLEAN DEFAULT true,
  sprint_update_frequency TEXT DEFAULT 'daily',
  mention_notifications BOOLEAN DEFAULT true,
  assignment_notifications BOOLEAN DEFAULT true,
  default_board_view TEXT DEFAULT 'table',
  items_per_page INTEGER DEFAULT 25,
  show_completed_items BOOLEAN DEFAULT true,
  compact_mode BOOLEAN DEFAULT false,
  timezone TEXT DEFAULT 'UTC',
  work_start_hour INTEGER DEFAULT 9,
  work_end_hour INTEGER DEFAULT 17,
  work_days JSONB DEFAULT '[1,2,3,4,5]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.activity_log (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  action TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id UUID,
  entity_title TEXT,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- ADD MISSING COLUMNS to existing tables (safe - skips if exists)
-- ============================================================

DO $$ BEGIN
  -- profiles
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='profiles' AND column_name='role') THEN
    ALTER TABLE public.profiles ADD COLUMN role TEXT DEFAULT 'member';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='profiles' AND column_name='theme') THEN
    ALTER TABLE public.profiles ADD COLUMN theme TEXT DEFAULT 'light';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='profiles' AND column_name='settings') THEN
    ALTER TABLE public.profiles ADD COLUMN settings JSONB DEFAULT '{}'::jsonb;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='profiles' AND column_name='avatar') THEN
    ALTER TABLE public.profiles ADD COLUMN avatar TEXT;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='profiles' AND column_name='updated_at') THEN
    ALTER TABLE public.profiles ADD COLUMN updated_at TIMESTAMPTZ DEFAULT NOW();
  END IF;

  -- boards
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='boards' AND column_name='icon') THEN
    ALTER TABLE public.boards ADD COLUMN icon TEXT DEFAULT '📋';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='boards' AND column_name='columns') THEN
    ALTER TABLE public.boards ADD COLUMN columns JSONB DEFAULT '[]'::jsonb;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='boards' AND column_name='groups') THEN
    ALTER TABLE public.boards ADD COLUMN groups JSONB DEFAULT '[]'::jsonb;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='boards' AND column_name='settings') THEN
    ALTER TABLE public.boards ADD COLUMN settings JSONB DEFAULT '{}'::jsonb;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='boards' AND column_name='color') THEN
    ALTER TABLE public.boards ADD COLUMN color TEXT DEFAULT '#0073EA';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='boards' AND column_name='description') THEN
    ALTER TABLE public.boards ADD COLUMN description TEXT;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='boards' AND column_name='visibility') THEN
    ALTER TABLE public.boards ADD COLUMN visibility TEXT DEFAULT 'private';
  END IF;

  -- items
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='items' AND column_name='description') THEN
    ALTER TABLE public.items ADD COLUMN description TEXT;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='items' AND column_name='data') THEN
    ALTER TABLE public.items ADD COLUMN data JSONB DEFAULT '{}'::jsonb;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='items' AND column_name='order_index') THEN
    ALTER TABLE public.items ADD COLUMN order_index INTEGER DEFAULT 0;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='items' AND column_name='group_id') THEN
    ALTER TABLE public.items ADD COLUMN group_id TEXT;
  END IF;

  -- calendar_events
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='calendar_events' AND column_name='location') THEN
    ALTER TABLE public.calendar_events ADD COLUMN location TEXT;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='calendar_events' AND column_name='attendees') THEN
    ALTER TABLE public.calendar_events ADD COLUMN attendees JSONB DEFAULT '[]'::jsonb;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='calendar_events' AND column_name='all_day') THEN
    ALTER TABLE public.calendar_events ADD COLUMN all_day BOOLEAN DEFAULT false;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='calendar_events' AND column_name='event_type') THEN
    ALTER TABLE public.calendar_events ADD COLUMN event_type TEXT DEFAULT 'other';
  END IF;

  -- user_stories
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='user_stories' AND column_name='acceptance_criteria') THEN
    ALTER TABLE public.user_stories ADD COLUMN acceptance_criteria JSONB DEFAULT '[]'::jsonb;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='user_stories' AND column_name='assigned_to') THEN
    ALTER TABLE public.user_stories ADD COLUMN assigned_to TEXT;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='user_stories' AND column_name='board_id') THEN
    ALTER TABLE public.user_stories ADD COLUMN board_id UUID REFERENCES public.boards(id) ON DELETE SET NULL;
  END IF;

  -- sprints
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='sprints' AND column_name='board_id') THEN
    ALTER TABLE public.sprints ADD COLUMN board_id UUID REFERENCES public.boards(id) ON DELETE SET NULL;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='sprints' AND column_name='goal') THEN
    ALTER TABLE public.sprints ADD COLUMN goal TEXT;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='sprints' AND column_name='capacity') THEN
    ALTER TABLE public.sprints ADD COLUMN capacity INTEGER DEFAULT 40;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='sprints' AND column_name='committed_points') THEN
    ALTER TABLE public.sprints ADD COLUMN committed_points INTEGER DEFAULT 0;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='sprints' AND column_name='completed_points') THEN
    ALTER TABLE public.sprints ADD COLUMN completed_points INTEGER DEFAULT 0;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='sprints' AND column_name='velocity') THEN
    ALTER TABLE public.sprints ADD COLUMN velocity INTEGER DEFAULT 0;
  END IF;

  -- notifications
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='notifications' AND column_name='link') THEN
    ALTER TABLE public.notifications ADD COLUMN link TEXT;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='notifications' AND column_name='is_read') THEN
    ALTER TABLE public.notifications ADD COLUMN is_read BOOLEAN DEFAULT false;
  END IF;

  -- team_members
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='team_members' AND column_name='invited_by') THEN
    ALTER TABLE public.team_members ADD COLUMN invited_by UUID REFERENCES auth.users(id) ON DELETE SET NULL;
  END IF;
END $$;

-- Foreign key from user_stories to sprints
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'fk_user_stories_sprint') THEN
    ALTER TABLE public.user_stories
      ADD CONSTRAINT fk_user_stories_sprint
      FOREIGN KEY (sprint_id) REFERENCES public.sprints(id) ON DELETE SET NULL;
  END IF;
END $$;

-- ============================================================
-- HELPER FUNCTIONS (bypass RLS for cross-table lookups)
-- ============================================================

CREATE OR REPLACE FUNCTION public.is_board_owner(board_id UUID, user_id UUID)
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.boards b WHERE b.id = board_id AND b.user_id = user_id
  );
$$ LANGUAGE sql SECURITY DEFINER STABLE;

CREATE OR REPLACE FUNCTION public.get_team_board_ids(uid UUID)
RETURNS SETOF UUID AS $$
  SELECT board_id FROM public.team_members WHERE user_id = uid;
$$ LANGUAGE sql SECURITY DEFINER STABLE;

CREATE OR REPLACE FUNCTION public.get_team_role(bid UUID, uid UUID)
RETURNS TEXT AS $$
  SELECT role FROM public.team_members WHERE board_id = bid AND user_id = uid LIMIT 1;
$$ LANGUAGE sql SECURITY DEFINER STABLE;

CREATE OR REPLACE FUNCTION public.can_access_board(bid UUID, uid UUID)
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.boards WHERE id = bid AND user_id = uid
  ) OR EXISTS (
    SELECT 1 FROM public.team_members WHERE board_id = bid AND user_id = uid
  );
$$ LANGUAGE sql SECURITY DEFINER STABLE;

CREATE OR REPLACE FUNCTION public.can_edit_board(bid UUID, uid UUID)
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.boards WHERE id = bid AND user_id = uid
  ) OR EXISTS (
    SELECT 1 FROM public.team_members WHERE board_id = bid AND user_id = uid AND role IN ('owner', 'editor')
  );
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.boards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.calendar_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_stories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sprints ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activity_log ENABLE ROW LEVEL SECURITY;

-- Profiles
DROP POLICY IF EXISTS "Users can view any profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;
DROP POLICY IF EXISTS "Admins can update any profile" ON public.profiles;
CREATE POLICY "Users can view any profile" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Admins can update any profile" ON public.profiles FOR UPDATE USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Boards (uses helper functions to avoid recursion with team_members)
DROP POLICY IF EXISTS "Users can view own boards" ON public.boards;
DROP POLICY IF EXISTS "Users can create boards" ON public.boards;
DROP POLICY IF EXISTS "Users can update own boards" ON public.boards;
DROP POLICY IF EXISTS "Users can delete own boards" ON public.boards;
DROP POLICY IF EXISTS "boards_select" ON public.boards;
DROP POLICY IF EXISTS "boards_insert" ON public.boards;
DROP POLICY IF EXISTS "boards_update" ON public.boards;
DROP POLICY IF EXISTS "boards_delete" ON public.boards;
CREATE POLICY "boards_select" ON public.boards FOR SELECT USING (
  auth.uid() = user_id OR id IN (SELECT public.get_team_board_ids(auth.uid()))
);
CREATE POLICY "boards_insert" ON public.boards FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "boards_update" ON public.boards FOR UPDATE USING (
  auth.uid() = user_id OR public.get_team_role(id, auth.uid()) IN ('owner', 'editor')
);
CREATE POLICY "boards_delete" ON public.boards FOR DELETE USING (auth.uid() = user_id);

-- Items (uses helper functions to check board access)
DROP POLICY IF EXISTS "Users can view items on accessible boards" ON public.items;
DROP POLICY IF EXISTS "Users can create items on accessible boards" ON public.items;
DROP POLICY IF EXISTS "Users can update items on accessible boards" ON public.items;
DROP POLICY IF EXISTS "Users can delete items on accessible boards" ON public.items;
DROP POLICY IF EXISTS "items_select" ON public.items;
DROP POLICY IF EXISTS "items_insert" ON public.items;
DROP POLICY IF EXISTS "items_update" ON public.items;
DROP POLICY IF EXISTS "items_delete" ON public.items;
CREATE POLICY "items_select" ON public.items FOR SELECT USING (
  public.can_access_board(board_id, auth.uid())
);
CREATE POLICY "items_insert" ON public.items FOR INSERT WITH CHECK (
  public.can_edit_board(board_id, auth.uid())
);
CREATE POLICY "items_update" ON public.items FOR UPDATE USING (
  public.can_edit_board(board_id, auth.uid())
);
CREATE POLICY "items_delete" ON public.items FOR DELETE USING (
  public.can_edit_board(board_id, auth.uid())
);

-- Calendar Events
DROP POLICY IF EXISTS "Users can view own events" ON public.calendar_events;
DROP POLICY IF EXISTS "Users can create events" ON public.calendar_events;
DROP POLICY IF EXISTS "Users can update own events" ON public.calendar_events;
DROP POLICY IF EXISTS "Users can delete own events" ON public.calendar_events;
CREATE POLICY "Users can view own events" ON public.calendar_events FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create events" ON public.calendar_events FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own events" ON public.calendar_events FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own events" ON public.calendar_events FOR DELETE USING (auth.uid() = user_id);

-- User Stories
DROP POLICY IF EXISTS "Users can view own stories" ON public.user_stories;
DROP POLICY IF EXISTS "Users can create stories" ON public.user_stories;
DROP POLICY IF EXISTS "Users can update own stories" ON public.user_stories;
DROP POLICY IF EXISTS "Users can delete own stories" ON public.user_stories;
CREATE POLICY "Users can view own stories" ON public.user_stories FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create stories" ON public.user_stories FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own stories" ON public.user_stories FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own stories" ON public.user_stories FOR DELETE USING (auth.uid() = user_id);

-- Sprints
DROP POLICY IF EXISTS "Users can view own sprints" ON public.sprints;
DROP POLICY IF EXISTS "Users can create sprints" ON public.sprints;
DROP POLICY IF EXISTS "Users can update own sprints" ON public.sprints;
DROP POLICY IF EXISTS "Users can delete own sprints" ON public.sprints;
CREATE POLICY "Users can view own sprints" ON public.sprints FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create sprints" ON public.sprints FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own sprints" ON public.sprints FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own sprints" ON public.sprints FOR DELETE USING (auth.uid() = user_id);

-- Notifications
DROP POLICY IF EXISTS "Users can view own notifications" ON public.notifications;
DROP POLICY IF EXISTS "Users can create notifications" ON public.notifications;
DROP POLICY IF EXISTS "Users can update own notifications" ON public.notifications;
DROP POLICY IF EXISTS "Users can delete own notifications" ON public.notifications;
CREATE POLICY "Users can view own notifications" ON public.notifications FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create notifications" ON public.notifications FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own notifications" ON public.notifications FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own notifications" ON public.notifications FOR DELETE USING (auth.uid() = user_id);

-- Team Members (uses helper functions to avoid recursion with boards)
DROP POLICY IF EXISTS "Team members can view board teams" ON public.team_members;
DROP POLICY IF EXISTS "Board owners can manage team members" ON public.team_members;
DROP POLICY IF EXISTS "Board owners can update team members" ON public.team_members;
DROP POLICY IF EXISTS "Board owners can delete team members" ON public.team_members;
DROP POLICY IF EXISTS "team_members_select" ON public.team_members;
DROP POLICY IF EXISTS "team_members_insert" ON public.team_members;
DROP POLICY IF EXISTS "team_members_update" ON public.team_members;
DROP POLICY IF EXISTS "team_members_delete" ON public.team_members;
CREATE POLICY "team_members_select" ON public.team_members FOR SELECT USING (
  user_id = auth.uid() OR public.is_board_owner(board_id, auth.uid())
);
CREATE POLICY "team_members_insert" ON public.team_members FOR INSERT WITH CHECK (
  public.is_board_owner(board_id, auth.uid())
);
CREATE POLICY "team_members_update" ON public.team_members FOR UPDATE USING (
  public.is_board_owner(board_id, auth.uid())
);
CREATE POLICY "team_members_delete" ON public.team_members FOR DELETE USING (
  public.is_board_owner(board_id, auth.uid())
);

-- User Preferences
DROP POLICY IF EXISTS "Users can view own preferences" ON public.user_preferences;
DROP POLICY IF EXISTS "Users can insert own preferences" ON public.user_preferences;
DROP POLICY IF EXISTS "Users can update own preferences" ON public.user_preferences;
DROP POLICY IF EXISTS "Users can delete own preferences" ON public.user_preferences;
CREATE POLICY "Users can view own preferences" ON public.user_preferences FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own preferences" ON public.user_preferences FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own preferences" ON public.user_preferences FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own preferences" ON public.user_preferences FOR DELETE USING (auth.uid() = user_id);

-- Activity Log
DROP POLICY IF EXISTS "Users can view own activity" ON public.activity_log;
DROP POLICY IF EXISTS "Users can create activity entries" ON public.activity_log;
CREATE POLICY "Users can view own activity" ON public.activity_log FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create activity entries" ON public.activity_log FOR INSERT WITH CHECK (auth.uid() = user_id);

-- ============================================================
-- FUNCTIONS & TRIGGERS
-- ============================================================

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, email, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', ''),
    NEW.email,
    CASE
      WHEN NOT EXISTS (SELECT 1 FROM public.profiles) THEN 'admin'
      ELSE 'member'
    END
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.email_exists(check_email TEXT)
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1
    FROM auth.users
    WHERE email IS NOT NULL
      AND lower(email) = lower(trim(check_email))
  );
$$ LANGUAGE sql SECURITY DEFINER STABLE
SET search_path = public, auth;

REVOKE ALL ON FUNCTION public.email_exists(TEXT) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.email_exists(TEXT) TO anon, authenticated, service_role;

CREATE OR REPLACE FUNCTION public.sync_profile_email_from_auth()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.profiles
  SET email = NEW.email,
      updated_at = NOW()
  WHERE id = NEW.id
    AND email IS DISTINCT FROM NEW.email;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER
SET search_path = public, auth;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

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
RETURNS TEXT AS $$
  SELECT lower(trim(auth_user.email))
  FROM auth.users AS auth_user
  WHERE auth_user.id = target_user_id
    AND EXISTS (
      SELECT 1
      FROM public.profiles AS current_profile
      WHERE current_profile.id = auth.uid()
        AND current_profile.role = 'admin'
    );
$$ LANGUAGE sql SECURITY DEFINER STABLE
SET search_path = public, auth;

REVOKE ALL ON FUNCTION public.admin_get_auth_email(UUID) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.admin_get_auth_email(UUID) TO authenticated, service_role;

-- Auto-update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_date()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_date = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_boards_updated_date ON public.boards;
DROP TRIGGER IF EXISTS update_items_updated_date ON public.items;
DROP TRIGGER IF EXISTS update_calendar_events_updated_date ON public.calendar_events;
DROP TRIGGER IF EXISTS update_user_stories_updated_date ON public.user_stories;
DROP TRIGGER IF EXISTS update_sprints_updated_date ON public.sprints;
DROP TRIGGER IF EXISTS update_profiles_updated_date ON public.profiles;
DROP TRIGGER IF EXISTS update_user_preferences_updated_date ON public.user_preferences;

CREATE TRIGGER update_boards_updated_date BEFORE UPDATE ON public.boards FOR EACH ROW EXECUTE FUNCTION public.update_updated_date();
CREATE TRIGGER update_items_updated_date BEFORE UPDATE ON public.items FOR EACH ROW EXECUTE FUNCTION public.update_updated_date();
CREATE TRIGGER update_calendar_events_updated_date BEFORE UPDATE ON public.calendar_events FOR EACH ROW EXECUTE FUNCTION public.update_updated_date();
CREATE TRIGGER update_user_stories_updated_date BEFORE UPDATE ON public.user_stories FOR EACH ROW EXECUTE FUNCTION public.update_updated_date();
CREATE TRIGGER update_sprints_updated_date BEFORE UPDATE ON public.sprints FOR EACH ROW EXECUTE FUNCTION public.update_updated_date();
CREATE TRIGGER update_profiles_updated_date BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_date();
CREATE TRIGGER update_user_preferences_updated_date BEFORE UPDATE ON public.user_preferences FOR EACH ROW EXECUTE FUNCTION public.update_updated_date();

-- ============================================================
-- INDEXES
-- ============================================================

CREATE INDEX IF NOT EXISTS idx_items_board_id ON public.items(board_id);
CREATE INDEX IF NOT EXISTS idx_user_stories_sprint_id ON public.user_stories(sprint_id);
CREATE INDEX IF NOT EXISTS idx_user_stories_board_id ON public.user_stories(board_id);
CREATE INDEX IF NOT EXISTS idx_team_members_board_id ON public.team_members(board_id);
CREATE INDEX IF NOT EXISTS idx_team_members_user_id ON public.team_members(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON public.notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_is_read ON public.notifications(user_id, is_read);
CREATE INDEX IF NOT EXISTS idx_user_preferences_user_id ON public.user_preferences(user_id);
CREATE INDEX IF NOT EXISTS idx_activity_log_user_id ON public.activity_log(user_id);
CREATE INDEX IF NOT EXISTS idx_activity_log_entity ON public.activity_log(entity_type, entity_id);
CREATE INDEX IF NOT EXISTS idx_activity_log_created_at ON public.activity_log(created_at);
