import {
  PASSWORD_RESET_REQUEST_SUCCESS_MESSAGE,
  normalizePasswordResetEmail,
} from '@/lib/password-reset-delivery'

export async function requestPasswordResetEmail(email) {
  const normalizedEmail = normalizePasswordResetEmail(email)
  if (!normalizedEmail) {
    throw new Error('A valid email address is required')
  }

  const response = await fetch('/api/auth/request-password-reset', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email: normalizedEmail }),
  })

  const payload = await response.json().catch(() => ({}))
  if (!response.ok) {
    throw new Error(payload.error || 'Failed to send password reset email')
  }

  return {
    ...payload,
    message: payload.message || PASSWORD_RESET_REQUEST_SUCCESS_MESSAGE,
  }
}
