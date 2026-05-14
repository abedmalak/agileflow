import {
  normalizeAppUrl,
  buildAppUrl,
  isResetPasswordRecovery,
} from '@/lib/auth-redirects'

describe('auth redirects', () => {
  test('normalizes hostnames into https urls', () => {
    expect(normalizeAppUrl('agileflow-one.vercel.app/')).toBe('https://agileflow-one.vercel.app')
  })

  test('builds reset links from an explicit app url', () => {
    expect(buildAppUrl('/login?reset=true', 'https://agileflow-one.vercel.app/')).toBe(
      'https://agileflow-one.vercel.app/login?reset=true'
    )
  })

  test('detects reset mode from the query string', () => {
    expect(isResetPasswordRecovery('?reset=true')).toBe(true)
  })

  test('detects recovery mode from the auth hash', () => {
    expect(isResetPasswordRecovery('', '#type=recovery&access_token=token')).toBe(true)
  })
})
