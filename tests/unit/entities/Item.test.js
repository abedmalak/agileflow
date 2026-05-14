import { describe, it, expect, vi, beforeEach } from 'vitest'

const mockQuery = {
  select: vi.fn().mockReturnThis(),
  insert: vi.fn().mockReturnThis(),
  update: vi.fn().mockReturnThis(),
  delete: vi.fn().mockReturnThis(),
  eq: vi.fn().mockReturnThis(),
  order: vi.fn().mockReturnThis(),
  limit: vi.fn().mockReturnThis(),
  single: vi.fn().mockReturnThis(),
}

vi.mock('@/api/supabaseClient', () => ({
  supabase: {
    from: vi.fn(() => mockQuery),
    auth: {
      getSession: vi.fn().mockResolvedValue({
        data: { session: { user: { id: 'user-1' } } },
      }),
      onAuthStateChange: vi.fn(),
    },
  },
}))

import { Item } from '@/api/entities/Item'
import { supabase } from '@/api/supabaseClient'

beforeEach(() => {
  vi.clearAllMocks()

  mockQuery.select.mockReturnValue(mockQuery)
  mockQuery.insert.mockReturnValue(mockQuery)
  mockQuery.update.mockReturnValue(mockQuery)
  mockQuery.delete.mockReturnValue(mockQuery)
  mockQuery.eq.mockReturnValue(mockQuery)
  mockQuery.order.mockReturnValue(mockQuery)
  mockQuery.limit.mockReturnValue(mockQuery)
  mockQuery.single.mockReturnValue(mockQuery)

  mockQuery.order.mockResolvedValue({ data: [], error: null })
  mockQuery.single.mockResolvedValue({ data: { id: '1', title: 'Test Item' }, error: null })

  supabase.auth.getSession.mockResolvedValue({
    data: { session: { user: { id: 'user-1' } } },
  })
})

describe('Item entity', () => {
  describe('Item.list()', () => {
    it('calls supabase.from("items") with default sort', async () => {
      mockQuery.order.mockResolvedValue({
        data: [{ id: 'item-1', title: 'Task 1' }],
        error: null,
      })

      const result = await Item.list()

      expect(supabase.from).toHaveBeenCalledWith('items')
      expect(mockQuery.select).toHaveBeenCalledWith('*')
      expect(mockQuery.order).toHaveBeenCalledWith('created_date', { ascending: false })
      expect(result).toEqual([{ id: 'item-1', title: 'Task 1' }])
    })

    it('does not filter by user_id (unlike Board)', async () => {
      mockQuery.order.mockResolvedValue({ data: [], error: null })

      await Item.list()

      // Item.list does NOT call eq('user_id', ...) — it relies on RLS
      const eqCalls = mockQuery.eq.mock.calls
      const userIdFilter = eqCalls.find(([key]) => key === 'user_id')
      expect(userIdFilter).toBeUndefined()
    })

    it('applies ascending sort for plain field name', async () => {
      mockQuery.order.mockResolvedValue({ data: [], error: null })

      await Item.list('title')

      expect(mockQuery.order).toHaveBeenCalledWith('title', { ascending: true })
    })

    it('applies descending sort for dash-prefixed field', async () => {
      mockQuery.order.mockResolvedValue({ data: [], error: null })

      await Item.list('-priority')

      expect(mockQuery.order).toHaveBeenCalledWith('priority', { ascending: false })
    })

    it('applies limit when provided', async () => {
      // order must return the chainable mock (not a resolved value) so .limit() works
      mockQuery.order.mockReturnValue(mockQuery)
      mockQuery.limit.mockResolvedValue({ data: [], error: null })

      await Item.list(null, 10)

      expect(mockQuery.limit).toHaveBeenCalledWith(10)
    })

    it('does not call limit when not provided', async () => {
      mockQuery.order.mockResolvedValue({ data: [], error: null })

      await Item.list()

      expect(mockQuery.limit).not.toHaveBeenCalled()
    })

    it('throws on query error', async () => {
      mockQuery.order.mockResolvedValue({ data: null, error: { message: 'Query failed' } })

      await expect(Item.list()).rejects.toEqual({ message: 'Query failed' })
    })
  })

  describe('Item.get()', () => {
    it('fetches a single item by id', async () => {
      mockQuery.single.mockResolvedValue({
        data: { id: 'item-5', title: 'Task Five', board_id: 'board-1' },
        error: null,
      })

      const result = await Item.get('item-5')

      expect(supabase.from).toHaveBeenCalledWith('items')
      expect(mockQuery.select).toHaveBeenCalledWith('*')
      expect(mockQuery.eq).toHaveBeenCalledWith('id', 'item-5')
      expect(mockQuery.single).toHaveBeenCalled()
      expect(result).toEqual({ id: 'item-5', title: 'Task Five', board_id: 'board-1' })
    })

    it('throws when item is not found', async () => {
      mockQuery.single.mockResolvedValue({
        data: null,
        error: { message: 'Row not found', code: 'PGRST116' },
      })

      await expect(Item.get('nonexistent')).rejects.toEqual({
        message: 'Row not found',
        code: 'PGRST116',
      })
    })
  })

  describe('Item.create()', () => {
    it('inserts item data via supabase', async () => {
      const itemData = { title: 'New Task', board_id: 'board-1', status: 'Not Started' }
      mockQuery.single.mockResolvedValue({
        data: { id: 'item-new', ...itemData },
        error: null,
      })

      const result = await Item.create(itemData)

      expect(supabase.from).toHaveBeenCalledWith('items')
      expect(mockQuery.insert).toHaveBeenCalledWith(itemData)
      expect(mockQuery.select).toHaveBeenCalled()
      expect(mockQuery.single).toHaveBeenCalled()
      expect(result).toEqual({ id: 'item-new', ...itemData })
    })

    it('throws when user is not authenticated', async () => {
      supabase.auth.getSession.mockResolvedValue({
        data: { session: null },
      })

      await expect(Item.create({ title: 'Test' })).rejects.toThrow('Authentication required')
    })

    it('throws on insert error', async () => {
      mockQuery.single.mockResolvedValue({
        data: null,
        error: { message: 'Constraint violation' },
      })

      await expect(Item.create({ title: 'Test' })).rejects.toEqual({
        message: 'Constraint violation',
      })
    })
  })

  describe('Item.update()', () => {
    it('calls update with correct id and data', async () => {
      mockQuery.single.mockResolvedValue({
        data: { id: 'item-1', title: 'Updated Task', status: 'Done' },
        error: null,
      })

      const result = await Item.update('item-1', { title: 'Updated Task', status: 'Done' })

      expect(supabase.from).toHaveBeenCalledWith('items')
      expect(mockQuery.update).toHaveBeenCalledWith({ title: 'Updated Task', status: 'Done' })
      expect(mockQuery.eq).toHaveBeenCalledWith('id', 'item-1')
      expect(result).toEqual({ id: 'item-1', title: 'Updated Task', status: 'Done' })
    })

    it('throws on update error', async () => {
      mockQuery.single.mockResolvedValue({
        data: null,
        error: { message: 'Update failed' },
      })

      await expect(Item.update('item-1', { title: 'X' })).rejects.toEqual({
        message: 'Update failed',
      })
    })
  })

  describe('Item.delete()', () => {
    it('calls delete with correct id', async () => {
      mockQuery.eq.mockResolvedValue({ error: null })

      await Item.delete('item-1')

      expect(supabase.from).toHaveBeenCalledWith('items')
      expect(mockQuery.delete).toHaveBeenCalled()
      expect(mockQuery.eq).toHaveBeenCalledWith('id', 'item-1')
    })

    it('throws on delete error', async () => {
      mockQuery.eq.mockResolvedValue({ error: { message: 'FK constraint' } })

      await expect(Item.delete('item-1')).rejects.toEqual({
        message: 'FK constraint',
      })
    })
  })

  describe('Item.filter()', () => {
    it('applies filter key-value pairs as eq calls', async () => {
      mockQuery.order.mockResolvedValue({
        data: [{ id: '1', board_id: 'b1', status: 'Done' }],
        error: null,
      })

      await Item.filter({ board_id: 'b1', status: 'Done' })

      expect(supabase.from).toHaveBeenCalledWith('items')
      expect(mockQuery.eq).toHaveBeenCalledWith('board_id', 'b1')
      expect(mockQuery.eq).toHaveBeenCalledWith('status', 'Done')
    })

    it('applies sort field to filtered query', async () => {
      mockQuery.order.mockResolvedValue({ data: [], error: null })

      await Item.filter({ board_id: 'b1' }, 'title')

      expect(mockQuery.order).toHaveBeenCalledWith('title', { ascending: true })
    })

    it('uses default sort when none given', async () => {
      mockQuery.order.mockResolvedValue({ data: [], error: null })

      await Item.filter({ board_id: 'b1' })

      expect(mockQuery.order).toHaveBeenCalledWith('created_date', { ascending: false })
    })

    it('returns filtered data', async () => {
      const items = [{ id: '1' }, { id: '2' }]
      mockQuery.order.mockResolvedValue({ data: items, error: null })

      const result = await Item.filter({ board_id: 'b1' })

      expect(result).toEqual(items)
    })

    it('throws on filter error', async () => {
      mockQuery.order.mockResolvedValue({ data: null, error: { message: 'Filter failed' } })

      await expect(Item.filter({ board_id: 'b1' })).rejects.toEqual({
        message: 'Filter failed',
      })
    })
  })
})
