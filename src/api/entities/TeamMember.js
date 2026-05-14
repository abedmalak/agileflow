import { supabase } from '../supabaseClient';

async function getAuthUser() {
  const { data: { session } } = await supabase.auth.getSession();
  return session?.user || null;
}

export const TeamMember = {
  async listByBoard(boardId) {
    const { data: members, error } = await supabase
      .from('team_members')
      .select('*')
      .eq('board_id', boardId)
      .order('created_date', { ascending: true });
    if (error) throw error;
    if (!members || members.length === 0) return [];

    const userIds = [...new Set(members.map((m) => m.user_id))];
    const { data: profiles, error: profilesError } = await supabase
      .from('profiles')
      .select('id, full_name, email, avatar, role')
      .in('id', userIds);
    if (profilesError) throw profilesError;

    const profileMap = {};
    (profiles || []).forEach((p) => {
      profileMap[p.id] = p;
    });

    return members.map((m) => ({
      ...m,
      profile: profileMap[m.user_id] || null,
    }));
  },

  async add(boardId, userId, role = 'editor') {
    const user = await getAuthUser();
    const { data, error } = await supabase
      .from('team_members')
      .insert({ board_id: boardId, user_id: userId, role, invited_by: user.id })
      .select('*')
      .single();
    if (error) throw error;

    const { data: profile } = await supabase
      .from('profiles')
      .select('id, full_name, email, avatar, role')
      .eq('id', userId)
      .single();

    return { ...data, profile: profile || null };
  },

  async updateRole(id, role) {
    const { data, error } = await supabase
      .from('team_members')
      .update({ role })
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async remove(id) {
    const { error } = await supabase.from('team_members').delete().eq('id', id);
    if (error) throw error;
  }
};
