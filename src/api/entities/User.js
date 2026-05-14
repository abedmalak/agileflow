import { supabase } from '../supabaseClient';

async function getAuthUser() {
  const { data: { session } } = await supabase.auth.getSession();
  return session?.user || null;
}

function sanitizeProfileUpdates(updates = {}) {
  const sanitized = { ...updates };
  delete sanitized.email;
  return sanitized;
}

export const User = {
  async me() {
    const user = await getAuthUser();
    if (!user) throw new Error('Not authenticated');
    const { data: profile, error } = await supabase.from('profiles').select('*').eq('id', user.id).single();
    if (error) throw error;
    return { ...profile, email: user.email };
  },

  async updateMe(updates) {
    const user = await getAuthUser();
    const { data, error } = await supabase
      .from('profiles')
      .update(sanitizeProfileUpdates(updates))
      .eq('id', user.id)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async listAll() {
    const { data, error } = await supabase.from('profiles').select('*').order('created_at', { ascending: false });
    if (error) throw error;
    return data;
  },

  async getById(id) {
    const { data, error } = await supabase.from('profiles').select('*').eq('id', id).single();
    if (error) throw error;
    return data;
  },

  async updateUser(id, updates) {
    const { data, error } = await supabase
      .from('profiles')
      .update(sanitizeProfileUpdates(updates))
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async search(query) {
    const sanitized = query.replace(/[%_\\]/g, '\\$&');
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .or(`full_name.ilike.%${sanitized}%,email.ilike.%${sanitized}%`)
      .limit(20);
    if (error) throw error;
    return data;
  }
};
