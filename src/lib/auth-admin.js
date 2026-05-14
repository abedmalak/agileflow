import { supabase } from '@/api/supabaseClient'

export const ADMIN_AUTH_EMAIL_LOOKUP_MISSING_MESSAGE =
  'The admin reset-email lookup is not deployed yet. Run the latest Supabase auth email migration and try again.'

export const ADMIN_AUTH_EMAIL_LOOKUP_EMPTY_MESSAGE =
  "Couldn't find this user's current sign-in email in Supabase Auth. Run the auth email sync SQL and try again."

export function isMissingAdminAuthEmailLookupError(error) {
  const message = error?.message?.toLowerCase?.() ?? ''

  return (
    error?.code === 'PGRST202' ||
    error?.code === '42883' ||
    message.includes('admin_get_auth_email')
  )
}

export async function getAdminAuthEmail(targetUserId) {
  const { data, error } = await supabase.rpc('admin_get_auth_email', {
    target_user_id: targetUserId,
  })

  if (error) {
    if (isMissingAdminAuthEmailLookupError(error)) {
      throw new Error(ADMIN_AUTH_EMAIL_LOOKUP_MISSING_MESSAGE)
    }

    throw error
  }

  const normalizedEmail = typeof data === 'string' ? data.trim().toLowerCase() : ''
  if (!normalizedEmail) {
    throw new Error(ADMIN_AUTH_EMAIL_LOOKUP_EMPTY_MESSAGE)
  }

  return normalizedEmail
}
