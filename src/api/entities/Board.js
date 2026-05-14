import { supabase } from '../supabaseClient';

const BOARD_COLUMNS = [
  'title', 'description', 'color', 'icon', 'columns', 'groups',
  'settings', 'visibility', 'user_id'
];

function parseSortField(sortField) {
  if (!sortField) return { column: 'created_date', ascending: false };
  const ascending = !sortField.startsWith('-');
  const column = sortField.replace(/^-/, '');
  return { column, ascending };
}

function pickValidColumns(data) {
  const cleaned = {};
  for (const key of BOARD_COLUMNS) {
    if (key in data) cleaned[key] = data[key];
  }
  return cleaned;
}

async function getAuthUser() {
  const { data: { session } } = await supabase.auth.getSession();
  return session?.user || null;
}

export const Board = {
  async list(sortField, limit) {
    const user = await getAuthUser();
    if (!user) throw new Error('Authentication required');
    const { column, ascending } = parseSortField(sortField);
    let query = supabase.from('boards').select('*').eq('user_id', user.id).order(column, { ascending });
    if (limit) query = query.limit(limit);
    const { data, error } = await query;
    if (error) throw error;
    return data || [];
  },

  async get(id) {
    const { data, error } = await supabase.from('boards').select('*').eq('id', id).single();
    if (error) throw error;
    return data;
  },

  async filter(filters, sortField) {
    const { column, ascending } = parseSortField(sortField);
    let query = supabase.from('boards').select('*');
    Object.entries(filters).forEach(([key, value]) => {
      query = query.eq(key, value);
    });
    query = query.order(column, { ascending });
    const { data, error } = await query;
    if (error) throw error;
    return data || [];
  },

  async create(boardData) {
    const user = await getAuthUser();
    if (!user) throw new Error('Authentication required');
    const cleaned = pickValidColumns({ ...boardData, user_id: user.id });
    const { data, error } = await supabase.from('boards').insert(cleaned).select().single();
    if (error) throw error;
    return data;
  },

  async update(id, updates) {
    const cleaned = pickValidColumns(updates);
    const { data, error } = await supabase.from('boards').update(cleaned).eq('id', id).select().single();
    if (error) throw error;
    return data;
  },

  async delete(id) {
    const { error } = await supabase.from('boards').delete().eq('id', id);
    if (error) throw error;
  }
};
