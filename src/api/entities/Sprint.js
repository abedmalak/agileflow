import { supabase } from '../supabaseClient';

async function getAuthUser() {
  const { data: { session } } = await supabase.auth.getSession();
  return session?.user || null;
}

function parseSortField(sortField) {
  if (!sortField) return { column: 'created_date', ascending: false };
  const ascending = !sortField.startsWith('-');
  const column = sortField.replace(/^-/, '');
  return { column, ascending };
}

export const Sprint = {
  async list(sortField, limit) {
    const user = await getAuthUser();
    if (!user) throw new Error('Authentication required');
    const { column, ascending } = parseSortField(sortField);
    let query = supabase.from('sprints').select('*').eq('user_id', user.id).order(column, { ascending });
    if (limit) query = query.limit(limit);
    const { data, error } = await query;
    if (error) throw error;
    return data;
  },

  async get(id) {
    const { data, error } = await supabase.from('sprints').select('*').eq('id', id).single();
    if (error) throw error;
    return data;
  },

  async filter(filters, sortField) {
    const user = await getAuthUser();
    if (!user) throw new Error('Authentication required');
    const { column, ascending } = parseSortField(sortField);
    let query = supabase.from('sprints').select('*').eq('user_id', user.id);
    Object.entries(filters).forEach(([key, value]) => {
      query = query.eq(key, value);
    });
    query = query.order(column, { ascending });
    const { data, error } = await query;
    if (error) throw error;
    return data;
  },

  async create(sprintData) {
    const user = await getAuthUser();
    const { data, error } = await supabase.from('sprints').insert({ ...sprintData, user_id: user.id }).select().single();
    if (error) throw error;
    return data;
  },

  async update(id, updates) {
    const { data, error } = await supabase.from('sprints').update(updates).eq('id', id).select().single();
    if (error) throw error;
    return data;
  },

  async delete(id) {
    const { error } = await supabase.from('sprints').delete().eq('id', id);
    if (error) throw error;
  }
};
