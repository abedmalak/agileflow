import {
  PASSWORD_RESET_REQUEST_SUCCESS_MESSAGE,
  buildPasswordResetEmailContent,
  buildServerPasswordResetRedirectUrl,
  normalizePasswordResetEmail,
  shouldUseResendPasswordResetFallback,
} from '@/lib/password-reset-delivery'

describe('password reset delivery helpers', () => {
  test('normalizes email addresses', () => {
    expect(normalizePasswordResetEmail('  USER@Example.com ')).toBe('user@example.com')
  })

  test('builds the production reset redirect url', () => {
    expect(buildServerPasswordResetRedirectUrl('agileflow-one.vercel.app')).toBe(
      'https://agileflow-one.vercel.app/login?reset=true'
    )
  })

  test('flags rate-limit errors for resend fallback', () => {
    expect(
      shouldUseResendPasswordResetFallback({ code: 'over_email_send_rate_limit', status: 429 })
    ).toBe(true)
    expect(
      shouldUseResendPasswordResetFallback({ message: 'email address not authorized' })
    ).toBe(true)
    expect(
      shouldUseResendPasswordResetFallback({ message: 'Invalid login credentials', status: 400 })
    ).toBe(false)
  })

  test('builds reset email content with the link', () => {
    const content = buildPasswordResetEmailContent({
      appName: 'AgileFlow',
      appUrl: 'https://agileflow-one.vercel.app',
      recipientName: 'Maria',
      resetUrl: 'https://example.com/reset',
    })

    expect(content.subject).toContain('AgileFlow')
    expect(content.text).toContain('https://example.com/reset')
    expect(content.html).toContain('Reset Password')
  })

  test('keeps the public success message generic', () => {
    expect(PASSWORD_RESET_REQUEST_SUCCESS_MESSAGE).toContain('If an account with that email exists')
  })
})
