// src/api/entities/Item.js
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

export const Item = {
  async list(sortField, limit) {
    const { column, ascending } = parseSortField(sortField);
    let query = supabase.from('items').select('*').order(column, { ascending });
    if (limit) query = query.limit(limit);
    const { data, error } = await query;
    if (error) throw error;
    return data;
  },

  async get(id) {
    const { data, error } = await supabase.from('items').select('*').eq('id', id).single();
    if (error) throw error;
    return data;
  },

  async filter(filters, sortField) {
    const { column, ascending } = parseSortField(sortField);
    let query = supabase.from('items').select('*');
    Object.entries(filters).forEach(([key, value]) => {
      query = query.eq(key, value);
    });
    query = query.order(column, { ascending });
    const { data, error } = await query;
    if (error) throw error;
    return data;
  },

  async create(itemData) {
    const user = await getAuthUser();
    if (!user) throw new Error('Authentication required');
    const { data, error } = await supabase.from('items').insert(itemData).select().single();
    if (error) throw error;
    return data;
  },

  async update(id, updates) {
    const { data, error } = await supabase.from('items').update(updates).eq('id', id).select().single();
    if (error) throw error;
    return data;
  },

  async delete(id) {
    const { error } = await supabase.from('items').delete().eq('id', id);
    if (error) throw error;
  }
};
