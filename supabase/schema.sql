-- supabase/schema.sql
-- Run this in Supabase SQL Editor to create all tables

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users profile table (extends Supabase auth.users)
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  email TEXT,
  avatar TEXT,
  role TEXT DEFAULT 'member' CHECK (role IN ('admin', 'member', 'viewer')),
  theme TEXT DEFAULT 'light',
  settings JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Boards table
CREATE TABLE public.boards (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  color TEXT DEFAULT '#0073EA',
  icon TEXT DEFAULT '📋',
  columns JSONB DEFAULT '[]'::jsonb,
  groups JSONB DEFAULT '[]'::jsonb,
  settings JSONB DEFAULT '{}'::jsonb,
  created_date TIMESTAMPTZ DEFAULT NOW(),
  updated_date TIMESTAMPTZ DEFAULT NOW()
);

-- Items table (tasks within boards)
CREATE TABLE public.items (
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

-- Calendar Events table
CREATE TABLE public.calendar_events (
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
  reminder_minutes INTEGER DEFAULT 15,
  created_date TIMESTAMPTZ DEFAULT NOW(),
  updated_date TIMESTAMPTZ DEFAULT NOW()
);

-- User Stories table (backlog)
CREATE TABLE public.user_stories (
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

-- Sprints table
CREATE TABLE public.sprints (
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

-- Notifications table
CREATE TABLE public.notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  message TEXT,
  type TEXT DEFAULT 'info' CHECK (type IN ('info', 'success', 'warning', 'error', 'task', 'mention', 'sprint')),
  is_read BOOLEAN DEFAULT false,
  link TEXT,
  created_date TIMESTAMPTZ DEFAULT NOW()
);

-- Team members table (for board sharing)
CREATE TABLE public.team_members (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  board_id UUID REFERENCES public.boards(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role TEXT DEFAULT 'editor' CHECK (role IN ('owner', 'editor', 'viewer')),
  invited_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_date TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(board_id, user_id)
);

-- Add foreign key from user_stories to sprints
ALTER TABLE public.user_stories
  ADD CONSTRAINT fk_user_stories_sprint
  FOREIGN KEY (sprint_id) REFERENCES public.sprints(id) ON DELETE SET NULL;

-- Row Level Security (RLS) policies
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.boards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.calendar_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_stories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sprints ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.team_members ENABLE ROW LEVEL SECURITY;

-- Profiles: users can read any profile (for team features), update their own
CREATE POLICY "Users can view any profile" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- Admins can update any profile
CREATE POLICY "Admins can update any profile" ON public.profiles FOR UPDATE USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Boards: users can view own boards + boards they're team members of
CREATE POLICY "Users can view own boards" ON public.boards FOR SELECT USING (
  auth.uid() = user_id OR
  id IN (SELECT board_id FROM public.team_members WHERE user_id = auth.uid())
);
CREATE POLICY "Users can create boards" ON public.boards FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own boards" ON public.boards FOR UPDATE USING (
  auth.uid() = user_id OR
  id IN (SELECT board_id FROM public.team_members WHERE user_id = auth.uid() AND role IN ('owner', 'editor'))
);
CREATE POLICY "Users can delete own boards" ON public.boards FOR DELETE USING (auth.uid() = user_id);

-- Items: users can CRUD items on boards they have access to
CREATE POLICY "Users can view items on accessible boards" ON public.items FOR SELECT USING (
  board_id IN (
    SELECT id FROM public.boards WHERE user_id = auth.uid()
    UNION
    SELECT board_id FROM public.team_members WHERE user_id = auth.uid()
  )
);
CREATE POLICY "Users can create items on accessible boards" ON public.items FOR INSERT WITH CHECK (
  board_id IN (
    SELECT id FROM public.boards WHERE user_id = auth.uid()
    UNION
    SELECT board_id FROM public.team_members WHERE user_id = auth.uid() AND role IN ('owner', 'editor')
  )
);
CREATE POLICY "Users can update items on accessible boards" ON public.items FOR UPDATE USING (
  board_id IN (
    SELECT id FROM public.boards WHERE user_id = auth.uid()
    UNION
    SELECT board_id FROM public.team_members WHERE user_id = auth.uid() AND role IN ('owner', 'editor')
  )
);
CREATE POLICY "Users can delete items on accessible boards" ON public.items FOR DELETE USING (
  board_id IN (
    SELECT id FROM public.boards WHERE user_id = auth.uid()
    UNION
    SELECT board_id FROM public.team_members WHERE user_id = auth.uid() AND role IN ('owner', 'editor')
  )
);

-- Calendar Events: users can CRUD their own events
CREATE POLICY "Users can view own events" ON public.calendar_events FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create events" ON public.calendar_events FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own events" ON public.calendar_events FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own events" ON public.calendar_events FOR DELETE USING (auth.uid() = user_id);

-- User Stories: users can CRUD their own stories
CREATE POLICY "Users can view own stories" ON public.user_stories FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create stories" ON public.user_stories FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own stories" ON public.user_stories FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own stories" ON public.user_stories FOR DELETE USING (auth.uid() = user_id);

-- Sprints: users can CRUD their own sprints
CREATE POLICY "Users can view own sprints" ON public.sprints FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create sprints" ON public.sprints FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own sprints" ON public.sprints FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own sprints" ON public.sprints FOR DELETE USING (auth.uid() = user_id);

-- Notifications: users can only access their own notifications
CREATE POLICY "Users can view own notifications" ON public.notifications FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create notifications" ON public.notifications FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own notifications" ON public.notifications FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own notifications" ON public.notifications FOR DELETE USING (auth.uid() = user_id);

-- Team members: viewable by board owner and team members themselves
CREATE POLICY "Team members can view board teams" ON public.team_members FOR SELECT USING (
  user_id = auth.uid() OR
  board_id IN (SELECT id FROM public.boards WHERE user_id = auth.uid())
);
CREATE POLICY "Board owners can manage team members" ON public.team_members FOR INSERT WITH CHECK (
  board_id IN (SELECT id FROM public.boards WHERE user_id = auth.uid())
);
CREATE POLICY "Board owners can update team members" ON public.team_members FOR UPDATE USING (
  board_id IN (SELECT id FROM public.boards WHERE user_id = auth.uid())
);
CREATE POLICY "Board owners can delete team members" ON public.team_members FOR DELETE USING (
  board_id IN (SELECT id FROM public.boards WHERE user_id = auth.uid())
);

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

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

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

-- Auto-update updated_date timestamps
CREATE OR REPLACE FUNCTION public.update_updated_date()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_date = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_boards_updated_date BEFORE UPDATE ON public.boards FOR EACH ROW EXECUTE FUNCTION public.update_updated_date();
CREATE TRIGGER update_items_updated_date BEFORE UPDATE ON public.items FOR EACH ROW EXECUTE FUNCTION public.update_updated_date();
CREATE TRIGGER update_calendar_events_updated_date BEFORE UPDATE ON public.calendar_events FOR EACH ROW EXECUTE FUNCTION public.update_updated_date();
CREATE TRIGGER update_user_stories_updated_date BEFORE UPDATE ON public.user_stories FOR EACH ROW EXECUTE FUNCTION public.update_updated_date();
CREATE TRIGGER update_sprints_updated_date BEFORE UPDATE ON public.sprints FOR EACH ROW EXECUTE FUNCTION public.update_updated_date();
CREATE TRIGGER update_profiles_updated_date BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_date();

-- Create index for faster lookups
CREATE INDEX idx_items_board_id ON public.items(board_id);
CREATE INDEX idx_user_stories_sprint_id ON public.user_stories(sprint_id);
CREATE INDEX idx_user_stories_board_id ON public.user_stories(board_id);
CREATE INDEX idx_team_members_board_id ON public.team_members(board_id);
CREATE INDEX idx_team_members_user_id ON public.team_members(user_id);
CREATE INDEX idx_notifications_user_id ON public.notifications(user_id);
CREATE INDEX idx_notifications_is_read ON public.notifications(user_id, is_read);

-- Link team_members.user_id to profiles so PostgREST can resolve the join
ALTER TABLE public.team_members
  ADD CONSTRAINT fk_team_members_profile
  FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE;

-- Update team profiles with correct emails and details
-- Run this after users have signed up to set their profile data
-- Maria Alftaih: maria.alftaih@gmail.com
-- Abdul Rahman Malak: abdmalak@gmail.com
-- Khalid Hajjo Rifai: k.rifai2024@gmail.com
-- Mohammad Houjeirat: m.houjeirat@gmail.com
-- Advisors: Prof. Dr. Gül Temur (gul.temur@bau.edu.tr), Dr. Derya Bodur (derya.bodur@bau.edu.tr)
