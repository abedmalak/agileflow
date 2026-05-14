export const PASSWORD_RESET_REQUEST_SUCCESS_MESSAGE =
  'If an account with that email exists, a password reset link has been sent.'

export function normalizePasswordResetEmail(value) {
  return typeof value === 'string' ? value.trim().toLowerCase() : ''
}

export function normalizePasswordResetAppUrl(value) {
  if (!value) return ''

  const trimmed = String(value).trim().replace(/\/+$/, '')
  if (!trimmed) return ''

  return /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`
}

export function buildServerPasswordResetRedirectUrl(appUrl) {
  const baseUrl = normalizePasswordResetAppUrl(appUrl)
  if (!baseUrl) {
    return '/login?reset=true'
  }

  return new URL('/login?reset=true', `${baseUrl}/`).toString()
}

export function shouldUseResendPasswordResetFallback(error) {
  const code = error?.code ?? ''
  const message = error?.message?.toLowerCase?.() ?? ''
  const status = Number(error?.status ?? 0)

  return (
    code === 'over_email_send_rate_limit' ||
    code === 'email_address_not_authorized' ||
    status === 429 ||
    message.includes('rate limit') ||
    message.includes('not authorized')
  )
}

export function buildPasswordResetEmailContent({
  appName = 'AgileFlow',
  appUrl,
  recipientName,
  resetUrl,
}) {
  const safeAppUrl = normalizePasswordResetAppUrl(appUrl)
  const safeRecipientName = recipientName?.trim() || 'there'
  const safeResetUrl = resetUrl

  return {
    subject: `${appName} password reset`,
    text: `Hi ${safeRecipientName},

We received a request to reset your ${appName} password.

Use the secure link below to choose a new password:
${safeResetUrl}

If you did not request this, you can ignore this email.

${safeAppUrl ? `${appName}: ${safeAppUrl}` : appName}
`,
    html: `
      <div style="background:#f5f7fb;padding:32px 16px;font-family:Arial,Helvetica,sans-serif;color:#111827;">
        <div style="max-width:560px;margin:0 auto;background:#ffffff;border-radius:16px;padding:32px;border:1px solid #e5e7eb;">
          <p style="margin:0 0 12px;font-size:16px;line-height:1.5;">Hi ${safeRecipientName},</p>
          <p style="margin:0 0 16px;font-size:16px;line-height:1.6;">
            We received a request to reset your ${appName} password.
          </p>
          <p style="margin:0 0 24px;font-size:16px;line-height:1.6;">
            Use the secure link below to choose a new password:
          </p>
          <p style="margin:0 0 24px;">
            <a
              href="${safeResetUrl}"
              style="display:inline-block;background:#111827;color:#ffffff;text-decoration:none;padding:12px 18px;border-radius:10px;font-weight:600;"
            >
              Reset Password
            </a>
          </p>
          <p style="margin:0 0 16px;font-size:14px;line-height:1.6;color:#4b5563;">
            If the button does not work, copy and paste this link into your browser:
          </p>
          <p style="margin:0 0 24px;font-size:13px;line-height:1.7;word-break:break-all;color:#2563eb;">
            <a href="${safeResetUrl}" style="color:#2563eb;">${safeResetUrl}</a>
          </p>
          <p style="margin:0;font-size:14px;line-height:1.6;color:#4b5563;">
            If you did not request this, you can ignore this email.
          </p>
          ${safeAppUrl ? `<p style="margin:24px 0 0;font-size:14px;line-height:1.6;color:#4b5563;">${appName}: <a href="${safeAppUrl}" style="color:#2563eb;">${safeAppUrl}</a></p>` : ''}
        </div>
      </div>
    `,
  }
}
