import { supabase } from '../supabaseClient';

async function getAuthUser() {
  const { data: { session } } = await supabase.auth.getSession();
  return session?.user || null;
}

export const ActivityLog = {
  async list(limit = 50) {
    const user = await getAuthUser();
    if (!user) throw new Error('Authentication required');
    const { data, error } = await supabase
      .from('activity_log')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(limit);
    if (error) throw error;
    return data;
  },

  async log(action, entityType, entityId, entityTitle, metadata = {}) {
    const user = await getAuthUser();
    if (!user) throw new Error('Authentication required');
    const { data, error } = await supabase
      .from('activity_log')
      .insert({
        user_id: user.id,
        action,
        entity_type: entityType,
        entity_id: entityId,
        entity_title: entityTitle,
        metadata
      })
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async filterByEntity(entityType, entityId) {
    const user = await getAuthUser();
    if (!user) throw new Error('Authentication required');
    const { data, error } = await supabase
      .from('activity_log')
      .select('*')
      .eq('user_id', user.id)
      .eq('entity_type', entityType)
      .eq('entity_id', entityId)
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data;
  }
};
