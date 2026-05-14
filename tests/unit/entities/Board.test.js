import { describe, it, expect, vi, beforeEach } from 'vitest'

// Build chainable mock query — each call returns the same object so chaining works
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

import { Board } from '@/api/entities/Board'
import { supabase } from '@/api/supabaseClient'

beforeEach(() => {
  vi.clearAllMocks()

  // Reset default resolved values — tests override as needed
  // By default the terminal call in the chain resolves successfully
  mockQuery.select.mockReturnValue(mockQuery)
  mockQuery.insert.mockReturnValue(mockQuery)
  mockQuery.update.mockReturnValue(mockQuery)
  mockQuery.delete.mockReturnValue(mockQuery)
  mockQuery.eq.mockReturnValue(mockQuery)
  mockQuery.order.mockReturnValue(mockQuery)
  mockQuery.limit.mockReturnValue(mockQuery)
  mockQuery.single.mockReturnValue(mockQuery)

  // Default: order resolves to a list (used by list/filter)
  mockQuery.order.mockResolvedValue({ data: [], error: null })
  // Default: single resolves to a single record
  mockQuery.single.mockResolvedValue({ data: { id: '1', title: 'Test Board' }, error: null })
  // Default: delete resolves successfully
  mockQuery.eq.mockReturnValue(mockQuery)

  supabase.auth.getSession.mockResolvedValue({
    data: { session: { user: { id: 'user-1' } } },
  })
})

describe('Board entity', () => {
  describe('Board.list()', () => {
    it('calls supabase.from("boards") with default sort', async () => {
      mockQuery.order.mockResolvedValue({ data: [{ id: '1' }], error: null })

      const result = await Board.list()

      expect(supabase.from).toHaveBeenCalledWith('boards')
      expect(mockQuery.select).toHaveBeenCalledWith('*')
      expect(mockQuery.eq).toHaveBeenCalledWith('user_id', 'user-1')
      // Default sort: created_date descending
      expect(mockQuery.order).toHaveBeenCalledWith('created_date', { ascending: false })
      expect(result).toEqual([{ id: '1' }])
    })

    it('applies ascending sort when field has no dash prefix', async () => {
      mockQuery.order.mockResolvedValue({ data: [], error: null })

      await Board.list('title')

      expect(mockQuery.order).toHaveBeenCalledWith('title', { ascending: true })
    })

    it('applies descending sort when field has dash prefix', async () => {
      mockQuery.order.mockResolvedValue({ data: [], error: null })

      await Board.list('-updated_date')

      expect(mockQuery.order).toHaveBeenCalledWith('updated_date', { ascending: false })
    })

    it('applies limit when provided', async () => {
      // order must return the chainable mock (not a resolved value) so .limit() works
      mockQuery.order.mockReturnValue(mockQuery)
      mockQuery.limit.mockResolvedValue({ data: [], error: null })

      await Board.list(null, 5)

      expect(mockQuery.limit).toHaveBeenCalledWith(5)
    })

    it('throws when supabase returns an error', async () => {
      mockQuery.order.mockResolvedValue({ data: null, error: { message: 'DB error' } })

      await expect(Board.list()).rejects.toEqual({ message: 'DB error' })
    })
  })

  describe('Board.get()', () => {
    it('fetches a single board by id', async () => {
      mockQuery.single.mockResolvedValue({
        data: { id: 'board-123', title: 'My Board' },
        error: null,
      })

      const result = await Board.get('board-123')

      expect(supabase.from).toHaveBeenCalledWith('boards')
      expect(mockQuery.eq).toHaveBeenCalledWith('id', 'board-123')
      expect(mockQuery.single).toHaveBeenCalled()
      expect(result).toEqual({ id: 'board-123', title: 'My Board' })
    })

    it('throws when board not found', async () => {
      mockQuery.single.mockResolvedValue({
        data: null,
        error: { message: 'Row not found', code: 'PGRST116' },
      })

      await expect(Board.get('nonexistent')).rejects.toEqual({
        message: 'Row not found',
        code: 'PGRST116',
      })
    })
  })

  describe('Board.create()', () => {
    it('injects user_id from authenticated user', async () => {
      mockQuery.single.mockResolvedValue({
        data: { id: 'new-1', title: 'New Board', user_id: 'user-1' },
        error: null,
      })

      await Board.create({ title: 'New Board', color: '#0073EA' })

      expect(mockQuery.insert).toHaveBeenCalledWith({
        title: 'New Board',
        color: '#0073EA',
        user_id: 'user-1',
      })
      expect(mockQuery.select).toHaveBeenCalled()
      expect(mockQuery.single).toHaveBeenCalled()
    })

    it('returns the created board data', async () => {
      const created = { id: 'new-1', title: 'New Board', user_id: 'user-1' }
      mockQuery.single.mockResolvedValue({ data: created, error: null })

      const result = await Board.create({ title: 'New Board' })

      expect(result).toEqual(created)
    })

    it('throws when user is not authenticated', async () => {
      supabase.auth.getSession.mockResolvedValue({
        data: { session: null },
      })

      await expect(Board.create({ title: 'Test' })).rejects.toThrow('Authentication required')
    })

    it('throws when supabase insert fails', async () => {
      mockQuery.single.mockResolvedValue({
        data: null,
        error: { message: 'Insert failed' },
      })

      await expect(Board.create({ title: 'Test' })).rejects.toEqual({
        message: 'Insert failed',
      })
    })
  })

  describe('Board.update()', () => {
    it('calls update with correct id and data', async () => {
      mockQuery.single.mockResolvedValue({
        data: { id: 'board-1', title: 'Updated' },
        error: null,
      })

      const result = await Board.update('board-1', { title: 'Updated' })

      expect(supabase.from).toHaveBeenCalledWith('boards')
      expect(mockQuery.update).toHaveBeenCalledWith({ title: 'Updated' })
      expect(mockQuery.eq).toHaveBeenCalledWith('id', 'board-1')
      expect(result).toEqual({ id: 'board-1', title: 'Updated' })
    })

    it('throws on update error', async () => {
      mockQuery.single.mockResolvedValue({
        data: null,
        error: { message: 'Update failed' },
      })

      await expect(Board.update('board-1', { title: 'X' })).rejects.toEqual({
        message: 'Update failed',
      })
    })
  })

  describe('Board.delete()', () => {
    it('calls delete with correct id', async () => {
      mockQuery.eq.mockResolvedValue({ error: null })

      await Board.delete('board-1')

      expect(supabase.from).toHaveBeenCalledWith('boards')
      expect(mockQuery.delete).toHaveBeenCalled()
      expect(mockQuery.eq).toHaveBeenCalledWith('id', 'board-1')
    })

    it('throws on delete error', async () => {
      mockQuery.eq.mockResolvedValue({ error: { message: 'Delete failed' } })

      await expect(Board.delete('board-1')).rejects.toEqual({
        message: 'Delete failed',
      })
    })
  })

  describe('Board.filter()', () => {
    it('applies filter key-value pairs as eq calls', async () => {
      mockQuery.order.mockResolvedValue({ data: [{ id: '1' }], error: null })

      await Board.filter({ visibility: 'private', color: '#0073EA' })

      expect(supabase.from).toHaveBeenCalledWith('boards')
      expect(mockQuery.select).toHaveBeenCalledWith('*')
      expect(mockQuery.eq).toHaveBeenCalledWith('visibility', 'private')
      expect(mockQuery.eq).toHaveBeenCalledWith('color', '#0073EA')
    })

    it('applies sort field to filtered results', async () => {
      mockQuery.order.mockResolvedValue({ data: [], error: null })

      await Board.filter({ visibility: 'public' }, '-title')

      expect(mockQuery.order).toHaveBeenCalledWith('title', { ascending: false })
    })

    it('uses default sort when none provided', async () => {
      mockQuery.order.mockResolvedValue({ data: [], error: null })

      await Board.filter({ visibility: 'public' })

      expect(mockQuery.order).toHaveBeenCalledWith('created_date', { ascending: false })
    })
  })
})
