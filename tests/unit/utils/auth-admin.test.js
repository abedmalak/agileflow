import { beforeEach, describe, expect, test, vi } from 'vitest'

const rpc = vi.fn()

vi.mock('@/api/supabaseClient', () => ({
  supabase: {
    rpc,
  },
}))

const {
  ADMIN_AUTH_EMAIL_LOOKUP_EMPTY_MESSAGE,
  ADMIN_AUTH_EMAIL_LOOKUP_MISSING_MESSAGE,
  getAdminAuthEmail,
  isMissingAdminAuthEmailLookupError,
} = await import('@/lib/auth-admin')

describe('admin auth email helpers', () => {
  beforeEach(() => {
    rpc.mockReset()
  })

  test('detects missing rpc deployment errors', () => {
    expect(
      isMissingAdminAuthEmailLookupError({
        code: 'PGRST202',
        message: 'Could not find the function public.admin_get_auth_email(target_user_id)',
      })
    ).toBe(true)
    expect(isMissingAdminAuthEmailLookupError({ message: 'permission denied' })).toBe(false)
  })

  test('returns the canonical auth email for admin resets', async () => {
    rpc.mockResolvedValueOnce({ data: '  USER@Example.com ', error: null })

    await expect(getAdminAuthEmail('user-id')).resolves.toBe('user@example.com')
    expect(rpc).toHaveBeenCalledWith('admin_get_auth_email', { target_user_id: 'user-id' })
  })

  test('throws a friendly error when the rpc is missing', async () => {
    rpc.mockResolvedValueOnce({
      data: null,
      error: { code: 'PGRST202', message: 'Could not find the function public.admin_get_auth_email(target_user_id)' },
    })

    await expect(getAdminAuthEmail('user-id')).rejects.toThrow(ADMIN_AUTH_EMAIL_LOOKUP_MISSING_MESSAGE)
  })

  test('throws when auth email lookup returns nothing', async () => {
    rpc.mockResolvedValueOnce({ data: null, error: null })

    await expect(getAdminAuthEmail('user-id')).rejects.toThrow(ADMIN_AUTH_EMAIL_LOOKUP_EMPTY_MESSAGE)
  })
})
