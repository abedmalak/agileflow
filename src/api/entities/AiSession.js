import { supabase } from '@/api/supabaseClient';

export const AiSession = {
  async list(limit = 50) {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) return [];
    const { data, error } = await supabase
      .from('ai_sessions')
      .select('*')
      .eq('user_id', session.user.id)
      .order('updated_at', { ascending: false })
      .limit(limit);
    if (error) throw error;
    return data || [];
  },

  async create(title, model = 'fast') {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) throw new Error('Not authenticated');
    const { data, error } = await supabase
      .from('ai_sessions')
      .insert({ user_id: session.user.id, title, model })
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async update(id, updates) {
    const { data, error } = await supabase
      .from('ai_sessions')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async delete(id) {
    const { error } = await supabase.from('ai_sessions').delete().eq('id', id);
    if (error) throw error;
  },
};