-- AI Chat Sessions
CREATE TABLE IF NOT EXISTS ai_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT,
  model TEXT DEFAULT 'fast',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_ai_sessions_user ON ai_sessions(user_id, updated_at DESC);

ALTER TABLE ai_sessions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage own sessions" ON ai_sessions
  FOR ALL USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- AI Chat Messages
CREATE TABLE IF NOT EXISTS ai_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID NOT NULL REFERENCES ai_sessions(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant', 'system')),
  content TEXT NOT NULL DEFAULT '',
  model TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_ai_messages_session ON ai_messages(session_id, created_at);

ALTER TABLE ai_messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage own messages" ON ai_messages
  FOR ALL USING (
    EXISTS (SELECT 1 FROM ai_sessions WHERE ai_sessions.id = ai_messages.session_id AND ai_sessions.user_id = auth.uid())
  )
  WITH CHECK (
    EXISTS (SELECT 1 FROM ai_sessions WHERE ai_sessions.id = ai_messages.session_id AND ai_sessions.user_id = auth.uid())
  );
