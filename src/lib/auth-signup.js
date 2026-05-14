import { supabase } from '@/api/supabaseClient'

export const DUPLICATE_ACCOUNT_MESSAGE =
  'An account with this email already exists. Log in instead or use Forgot password.'

const DUPLICATE_SIGNUP_CODES = new Set(['email_exists'])
const DUPLICATE_SIGNUP_MESSAGES = ['already registered', 'already exists', 'email exists']
const MISSING_FUNCTION_MESSAGES = ['Could not find the function', 'function public.email_exists']

export function normalizeEmailAddress(email) {
  return email.trim().toLowerCase()
}

export function isDuplicateSignupError(error) {
  if (!error) return false

  if (error.code && DUPLICATE_SIGNUP_CODES.has(error.code)) {
    return true
  }

  const message = error.message?.toLowerCase?.() || ''
  return DUPLICATE_SIGNUP_MESSAGES.some((pattern) => message.includes(pattern))
}

export function isMissingEmailExistsFunctionError(error) {
  if (!error) return false

  if (error.code === '42883' || error.code === 'PGRST202') {
    return true
  }

  const message = error.message || ''
  return MISSING_FUNCTION_MESSAGES.some((pattern) => message.includes(pattern))
}

export async function checkEmailExists(email) {
  const normalizedEmail = normalizeEmailAddress(email)
  if (!normalizedEmail) return false

  const { data, error } = await supabase.rpc('email_exists', {
    check_email: normalizedEmail,
  })

  if (error) {
    if (isMissingEmailExistsFunctionError(error)) {
      return null
    }

    throw error
  }

  return Boolean(data)
}
