import { supabase } from '../supabaseClient';

async function getAuthUser() {
  const { data: { session } } = await supabase.auth.getSession();
  return session?.user || null;
}

export const Notification = {
  async list(limit = 50) {
    const user = await getAuthUser();
    if (!user) throw new Error('Authentication required');
    let query = supabase
      .from('notifications')
      .select('*')
      .eq('user_id', user.id)
      .order('created_date', { ascending: false });
    if (limit) query = query.limit(limit);
    const { data, error } = await query;
    if (error) throw error;
    return data;
  },

  async unreadCount() {
    const user = await getAuthUser();
    if (!user) return 0;
    const { count, error } = await supabase
      .from('notifications')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id)
      .eq('is_read', false);
    if (error) throw error;
    return count || 0;
  },

  async markAsRead(id) {
    const { data, error } = await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async markAllAsRead() {
    const user = await getAuthUser();
    const { error } = await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('user_id', user.id)
      .eq('is_read', false);
    if (error) throw error;
  },

  async create(notificationData) {
    const user = await getAuthUser();
    const { data, error } = await supabase
      .from('notifications')
      .insert({ ...notificationData, user_id: user.id })
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async delete(id) {
    const { error } = await supabase.from('notifications').delete().eq('id', id);
    if (error) throw error;
  },

  async deleteAll() {
    const user = await getAuthUser();
    const { error } = await supabase
      .from('notifications')
      .delete()
      .eq('user_id', user.id);
    if (error) throw error;
  }
};
