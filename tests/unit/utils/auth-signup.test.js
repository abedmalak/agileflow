import { beforeEach, describe, expect, test, vi } from 'vitest'

const rpc = vi.fn()

vi.mock('@/api/supabaseClient', () => ({
  supabase: {
    rpc,
  },
}))

const {
  DUPLICATE_ACCOUNT_MESSAGE,
  checkEmailExists,
  isDuplicateSignupError,
  isMissingEmailExistsFunctionError,
  normalizeEmailAddress,
} = await import('@/lib/auth-signup')

describe('auth signup helpers', () => {
  beforeEach(() => {
    rpc.mockReset()
  })

  test('normalizes email addresses before signup checks', () => {
    expect(normalizeEmailAddress('  USER@Example.com ')).toBe('user@example.com')
  })

  test('detects duplicate signup errors by code and message', () => {
    expect(isDuplicateSignupError({ code: 'email_exists' })).toBe(true)
    expect(isDuplicateSignupError({ message: 'User already registered' })).toBe(true)
    expect(isDuplicateSignupError({ message: 'Something else failed' })).toBe(false)
  })

  test('detects missing rpc function errors for graceful fallback', () => {
    expect(isMissingEmailExistsFunctionError({ code: '42883' })).toBe(true)
    expect(
      isMissingEmailExistsFunctionError({ message: 'Could not find the function public.email_exists(check_email)' })
    ).toBe(true)
    expect(isMissingEmailExistsFunctionError({ message: 'permission denied' })).toBe(false)
  })

  test('returns boolean duplicate status from the rpc response', async () => {
    rpc.mockResolvedValueOnce({ data: true, error: null })
    await expect(checkEmailExists('user@example.com')).resolves.toBe(true)
    expect(rpc).toHaveBeenCalledWith('email_exists', { check_email: 'user@example.com' })
  })

  test('falls back cleanly when the rpc is not deployed yet', async () => {
    rpc.mockResolvedValueOnce({
      data: null,
      error: { code: 'PGRST202', message: 'Could not find the function public.email_exists(check_email)' },
    })

    await expect(checkEmailExists('user@example.com')).resolves.toBeNull()
  })

  test('keeps the duplicate account message stable', () => {
    expect(DUPLICATE_ACCOUNT_MESSAGE).toContain('already exists')
  })
})
