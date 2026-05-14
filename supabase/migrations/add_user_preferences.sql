-- User preferences table for per-user notification and display settings
CREATE TABLE public.user_preferences (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,

  -- Notification preferences
  email_notifications BOOLEAN DEFAULT true,
  in_app_notifications BOOLEAN DEFAULT true,
  due_date_reminders BOOLEAN DEFAULT true,
  due_date_reminder_hours INTEGER DEFAULT 24,  -- hours before due date to send reminder
  sprint_update_notifications BOOLEAN DEFAULT true,
  sprint_update_frequency TEXT DEFAULT 'daily' CHECK (sprint_update_frequency IN ('realtime', 'daily', 'weekly', 'never')),
  mention_notifications BOOLEAN DEFAULT true,
  assignment_notifications BOOLEAN DEFAULT true,

  -- Display preferences
  default_board_view TEXT DEFAULT 'table' CHECK (default_board_view IN ('table', 'kanban', 'timeline', 'calendar')),
  items_per_page INTEGER DEFAULT 25,
  show_completed_items BOOLEAN DEFAULT true,
  compact_mode BOOLEAN DEFAULT false,

  -- Working hours (for smart notifications)
  timezone TEXT DEFAULT 'UTC',
  work_start_hour INTEGER DEFAULT 9,
  work_end_hour INTEGER DEFAULT 17,
  work_days JSONB DEFAULT '[1,2,3,4,5]'::jsonb,  -- 0=Sun, 1=Mon...6=Sat

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS
ALTER TABLE public.user_preferences ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own preferences" ON public.user_preferences FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own preferences" ON public.user_preferences FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own preferences" ON public.user_preferences FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own preferences" ON public.user_preferences FOR DELETE USING (auth.uid() = user_id);

-- Auto-update timestamp trigger
CREATE TRIGGER update_user_preferences_updated_date BEFORE UPDATE ON public.user_preferences FOR EACH ROW EXECUTE FUNCTION public.update_updated_date();

-- Index
CREATE INDEX idx_user_preferences_user_id ON public.user_preferences(user_id);

-- Activity log table for tracking user actions (useful for analytics, audit trail)
CREATE TABLE public.activity_log (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  action TEXT NOT NULL,  -- 'created', 'updated', 'deleted', 'moved', 'assigned', 'commented'
  entity_type TEXT NOT NULL,  -- 'item', 'board', 'sprint', 'user_story'
  entity_id UUID,
  entity_title TEXT,
  metadata JSONB DEFAULT '{}'::jsonb,  -- extra context (old_status, new_status, etc.)
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.activity_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own activity" ON public.activity_log FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create activity entries" ON public.activity_log FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE INDEX idx_activity_log_user_id ON public.activity_log(user_id);
CREATE INDEX idx_activity_log_entity ON public.activity_log(entity_type, entity_id);
CREATE INDEX idx_activity_log_created_at ON public.activity_log(created_at);
