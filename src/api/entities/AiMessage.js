import { supabase } from '@/api/supabaseClient';

export const AiMessage = {
  async listBySession(sessionId) {
    const { data, error } = await supabase
      .from('ai_messages')
      .select('*')
      .eq('session_id', sessionId)
      .order('created_at', { ascending: true });
    if (error) throw error;
    return data || [];
  },

  async create(sessionId, role, content, model = null) {
    const { data, error } = await supabase
      .from('ai_messages')
      .insert({ session_id: sessionId, role, content, model })
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async deleteAfter(sessionId, messageId) {
    const { data: refMsg } = await supabase
      .from('ai_messages')
      .select('created_at')
      .eq('id', messageId)
      .single();
    if (!refMsg) return;
    const { error } = await supabase
      .from('ai_messages')
      .delete()
      .eq('session_id', sessionId)
      .gt('created_at', refMsg.created_at);
    if (error) throw error;
  },
};