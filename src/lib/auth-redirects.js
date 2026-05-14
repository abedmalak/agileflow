const CONFIGURED_APP_URL =
  typeof __APP_URL__ !== 'undefined' && __APP_URL__ ? __APP_URL__ : ''

export function normalizeAppUrl(value) {
  if (!value) return ''

  const trimmed = value.trim().replace(/\/+$/, '')
  if (!trimmed) return ''

  return /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`
}

export function getAppBaseUrl(explicitBaseUrl) {
  const normalizedExplicitBaseUrl = normalizeAppUrl(explicitBaseUrl)
  if (normalizedExplicitBaseUrl) return normalizedExplicitBaseUrl

  const normalizedConfiguredUrl = normalizeAppUrl(CONFIGURED_APP_URL)
  if (normalizedConfiguredUrl) return normalizedConfiguredUrl

  if (typeof window !== 'undefined' && window.location?.origin) {
    return window.location.origin
  }

  return ''
}

export function buildAppUrl(path = '/', explicitBaseUrl) {
  const baseUrl = getAppBaseUrl(explicitBaseUrl)
  if (!baseUrl) return path

  const normalizedPath = path.startsWith('/') ? path.slice(1) : path
  return new URL(normalizedPath, `${baseUrl}/`).toString()
}

export function getLoginUrl() {
  return buildAppUrl('/login')
}

export function getEmailVerificationRedirectUrl() {
  return buildAppUrl('/login?verified=true')
}

export function getPasswordResetRedirectUrl() {
  return buildAppUrl('/login?reset=true')
}

export function getPostLoginRedirectUrl() {
  return buildAppUrl('/')
}

export function isResetPasswordRecovery(search = '', hash = '') {
  const searchParams = new URLSearchParams(search.startsWith('?') ? search.slice(1) : search)
  if (searchParams.get('reset') === 'true') {
    return true
  }

  const hashParams = new URLSearchParams(hash.startsWith('#') ? hash.slice(1) : hash)
  return hashParams.get('type') === 'recovery'
}
