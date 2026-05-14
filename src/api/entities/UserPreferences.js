import { supabase } from '../supabaseClient';

async function getAuthUser() {
  const { data: { session } } = await supabase.auth.getSession();
  return session?.user || null;
}

export const UserPreferences = {
  async get() {
    const user = await getAuthUser();
    if (!user) throw new Error('Authentication required');
    const { data, error } = await supabase
      .from('user_preferences')
      .select('*')
      .eq('user_id', user.id)
      .single();
    if (error && error.code === 'PGRST116') {
      // No preferences yet - create defaults
      return this.create({});
    }
    if (error) throw error;
    return data;
  },

  async create(prefs) {
    const user = await getAuthUser();
    if (!user) throw new Error('Authentication required');
    const { data, error } = await supabase
      .from('user_preferences')
      .insert({ ...prefs, user_id: user.id })
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async update(updates) {
    const user = await getAuthUser();
    if (!user) throw new Error('Authentication required');
    const { data, error } = await supabase
      .from('user_preferences')
      .update(updates)
      .eq('user_id', user.id)
      .select()
      .single();
    if (error) throw error;
    return data;
  }
};
