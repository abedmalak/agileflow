export const RECOVERY_SESSION_MISSING_MESSAGE =
  'Your password reset session is missing or expired. Request a new reset email and open the newest link.'

function wait(delayMs) {
  return new Promise((resolve) => {
    setTimeout(resolve, delayMs)
  })
}

export async function waitForActiveSession(
  getSession,
  { attempts = 12, delayMs = 250 } = {}
) {
  let lastError = null

  for (let attempt = 0; attempt < attempts; attempt += 1) {
    const { data, error } = await getSession()
    const session = data?.session ?? null

    if (session?.user) {
      return session
    }

    if (error) {
      lastError = error
    }

    if (attempt < attempts - 1 && delayMs > 0) {
      await wait(delayMs)
    }
  }

  if (lastError) {
    throw lastError
  }

  return null
}

export function isMissingAuthSessionError(error) {
  const message = error?.message?.toLowerCase?.() ?? ''
  return message.includes('auth session missing') || message.includes('session missing')
}
