import { createClient } from '@supabase/supabase-js';
import { Resend } from 'resend';
import {
  PASSWORD_RESET_REQUEST_SUCCESS_MESSAGE,
  buildPasswordResetEmailContent,
  buildServerPasswordResetRedirectUrl,
  normalizePasswordResetAppUrl,
  normalizePasswordResetEmail,
  shouldUseResendPasswordResetFallback,
} from '../../src/lib/password-reset-delivery.js';

function sendJson(response, status, body) {
  response.status(status).setHeader('Content-Type', 'application/json');
  response.end(JSON.stringify(body));
}

function parseRequestBody(body) {
  if (!body) return {};
  if (typeof body === 'string') {
    try {
      return JSON.parse(body);
    } catch {
      return {};
    }
  }
  return body;
}

function createSupabaseClient(url, key) {
  return createClient(url, key, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}

export default async function handler(request, response) {
  if (request.method !== 'POST') {
    response.setHeader('Allow', 'POST');
    return sendJson(response, 405, { error: 'Method not allowed' });
  }

  const { email } = parseRequestBody(request.body);
  const normalizedEmail = normalizePasswordResetEmail(email);
  if (!normalizedEmail) {
    return sendJson(response, 400, { error: 'A valid email address is required' });
  }

  const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
  const anonKey =
    process.env.VITE_SUPABASE_ANON_KEY ||
    process.env.SUPABASE_ANON_KEY ||
    process.env.SUPABASE_PUBLISHABLE_KEY;
  const serviceRoleKey =
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.SUPABASE_SECRET_KEY;
  const appUrl = normalizePasswordResetAppUrl(
    process.env.VITE_APP_URL || process.env.VERCEL_PROJECT_PRODUCTION_URL || ''
  );
  const redirectTo = buildServerPasswordResetRedirectUrl(appUrl);

  if (!supabaseUrl || !anonKey || !serviceRoleKey) {
    return sendJson(response, 500, { error: 'Server is missing password reset configuration' });
  }

  const publicSupabase = createSupabaseClient(supabaseUrl, anonKey);
  const { error: resetError } = await publicSupabase.auth.resetPasswordForEmail(normalizedEmail, {
    redirectTo,
  });

  if (!resetError) {
    return sendJson(response, 200, {
      success: true,
      delivery: 'supabase',
      message: PASSWORD_RESET_REQUEST_SUCCESS_MESSAGE,
    });
  }

  if (!shouldUseResendPasswordResetFallback(resetError)) {
    return sendJson(response, 400, {
      error: resetError.message || 'Failed to send password reset email',
    });
  }

  const resendApiKey = process.env.RESEND_API_KEY;
  if (!resendApiKey) {
    return sendJson(response, 429, {
      error: 'Password reset emails are temporarily rate-limited, and the Resend fallback is not configured.',
    });
  }

  const adminSupabase = createSupabaseClient(supabaseUrl, serviceRoleKey);
  const { data: authUsers, error: authLookupError } = await adminSupabase.auth.admin.listUsers({
    page: 1,
    perPage: 1000,
  });

  if (authLookupError) {
    return sendJson(response, 500, {
      error: authLookupError.message || 'Failed to prepare the password reset email',
    });
  }

  const matchedUser = authUsers.users?.find(
    (user) => normalizePasswordResetEmail(user.email) === normalizedEmail
  );

  const { data: linkData, error: linkError } = await adminSupabase.auth.admin.generateLink({
    type: 'recovery',
    email: normalizedEmail,
    options: { redirectTo },
  });

  if (linkError?.code === 'user_not_found') {
    return sendJson(response, 200, {
      success: true,
      delivery: 'suppressed',
      message: PASSWORD_RESET_REQUEST_SUCCESS_MESSAGE,
    });
  }

  if (linkError) {
    return sendJson(response, 500, {
      error: linkError.message || 'Failed to prepare the password reset email',
    });
  }

  const actionLink = linkData?.properties?.action_link;
  if (!actionLink) {
    return sendJson(response, 500, {
      error: 'Supabase did not return a password reset link',
    });
  }

  const resend = new Resend(resendApiKey);
  const emailContent = buildPasswordResetEmailContent({
    appName: 'AgileFlow',
    appUrl,
    recipientName:
      matchedUser?.user_metadata?.full_name ||
      matchedUser?.user_metadata?.name ||
      'there',
    resetUrl: actionLink,
  });

  const { data: resendData, error: resendError } = await resend.emails.send({
    from: process.env.RESEND_FROM_EMAIL || 'AgileFlow <onboarding@resend.dev>',
    to: normalizedEmail,
    subject: emailContent.subject,
    html: emailContent.html,
    text: emailContent.text,
    replyTo: process.env.RESEND_REPLY_TO || undefined,
  });

  if (resendError) {
    const resendMessage = resendError.message || 'Resend failed to send the password reset email';
    const isTestingModeRestriction =
      resendMessage.includes('testing emails to your own email address') ||
      resendMessage.includes('verify a domain at resend.com/domains');

    return sendJson(response, 502, {
      error: isTestingModeRestriction
        ? 'Resend fallback is configured, but your Resend account is still in testing mode. Verify a sending domain in Resend and set RESEND_FROM_EMAIL to that domain to deliver reset emails to other recipients.'
        : resendMessage,
    });
  }

  return sendJson(response, 200, {
    success: true,
    delivery: 'resend',
    message: PASSWORD_RESET_REQUEST_SUCCESS_MESSAGE,
    messageId: resendData?.id || null,
  });
}
