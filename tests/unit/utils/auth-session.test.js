import { describe, expect, test, vi } from 'vitest'

import {
  RECOVERY_SESSION_MISSING_MESSAGE,
  isMissingAuthSessionError,
  waitForActiveSession,
} from '@/lib/auth-session'

describe('auth session helpers', () => {
  test('waits until a recovery session becomes available', async () => {
    const session = { user: { id: 'user-123' } }
    const getSession = vi
      .fn()
      .mockResolvedValueOnce({ data: { session: null }, error: null })
      .mockResolvedValueOnce({ data: { session }, error: null })

    await expect(waitForActiveSession(getSession, { attempts: 2, delayMs: 0 })).resolves.toBe(session)
    expect(getSession).toHaveBeenCalledTimes(2)
  })

  test('returns null when no session is created after all attempts', async () => {
    const getSession = vi.fn().mockResolvedValue({ data: { session: null }, error: null })

    await expect(waitForActiveSession(getSession, { attempts: 3, delayMs: 0 })).resolves.toBeNull()
    expect(getSession).toHaveBeenCalledTimes(3)
  })

  test('rethrows the last auth error if session checks fail', async () => {
    const error = new Error('Auth session missing')
    const getSession = vi.fn().mockResolvedValue({ data: { session: null }, error })

    await expect(waitForActiveSession(getSession, { attempts: 2, delayMs: 0 })).rejects.toBe(error)
  })

  test('detects missing auth session errors by message', () => {
    expect(isMissingAuthSessionError({ message: 'Auth session missing' })).toBe(true)
    expect(isMissingAuthSessionError({ message: 'Token expired' })).toBe(false)
  })

  test('keeps the recovery-session message stable', () => {
    expect(RECOVERY_SESSION_MISSING_MESSAGE).toContain('missing or expired')
  })
})
