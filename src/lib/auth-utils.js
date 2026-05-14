export const DUPLICATE_ACCOUNT_MESSAGE =
  'An account with this email already exists. Log in or reset your password.'

export function isDuplicateSignupError(error) {
  const message = error?.message?.toLowerCase() || ''
  return message.includes('user already registered')
}

export function isDuplicateSignupResponse(data) {
  const identities = data?.user?.identities
  return !data?.session && Array.isArray(identities) && identities.length === 0
}

export function getSignupError(error, data) {
  if (isDuplicateSignupError(error) || isDuplicateSignupResponse(data)) {
    return new Error(DUPLICATE_ACCOUNT_MESSAGE)
  }

  return error ?? null
}

export function getAuthCallbackError(search = '', hash = '') {
  const searchParams = new URLSearchParams(search.startsWith('?') ? search.slice(1) : search)
  const hashParams = new URLSearchParams(hash.startsWith('#') ? hash.slice(1) : hash)

  const errorCode = hashParams.get('error_code') || searchParams.get('error_code')
  const errorDescription =
    hashParams.get('error_description') ||
    searchParams.get('error_description') ||
    hashParams.get('error') ||
    searchParams.get('error')

  if (!errorCode && !errorDescription) {
    return null
  }

  if (errorCode === 'otp_expired') {
    return 'This link has expired. Request a new one and try again.'
  }

  if (!errorDescription) {
    return 'Authentication failed. Please try again.'
  }

  const normalizedDescription = errorDescription.replace(/\+/g, ' ').trim()
  return normalizedDescription.charAt(0).toUpperCase() + normalizedDescription.slice(1)
}
