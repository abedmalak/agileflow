import { createClient } from '@supabase/supabase-js';
import { isSuperAdminEmail } from '../../src/lib/admin-config.js';

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

function normalizeEmail(value) {
  return typeof value === 'string' ? value.trim().toLowerCase() : '';
}

async function getAuthorizedAdmin(request) {
  const supabaseUrl = process.env.VITE_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    return { error: { status: 500, message: 'Server is missing Supabase configuration' } };
  }

  const authHeader = request.headers.authorization || '';
  const accessToken = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : '';
  if (!accessToken) {
    return { error: { status: 401, message: 'Missing access token' } };
  }

  const adminSupabase = createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });

  const {
    data: { user: requester },
    error: requesterError,
  } = await adminSupabase.auth.getUser(accessToken);

  if (requesterError || !requester) {
    return { error: { status: 401, message: 'Unable to verify the current user' } };
  }

  if (!isSuperAdminEmail(requester.email)) {
    return { error: { status: 403, message: 'Only the super admin can manage users' } };
  }

  return { adminSupabase, requester };
}

export default async function handler(request, response) {
  if (request.method !== 'POST') {
    response.setHeader('Allow', 'POST');
    return sendJson(response, 405, { error: 'Method not allowed' });
  }

  const { adminSupabase, error } = await getAuthorizedAdmin(request);
  if (error) {
    return sendJson(response, error.status, { error: error.message });
  }

  const { userId, email } = parseRequestBody(request.body);
  const normalizedEmail = normalizeEmail(email);

  if (!userId || typeof userId !== 'string') {
    return sendJson(response, 400, { error: 'A valid user ID is required' });
  }

  if (!normalizedEmail) {
    return sendJson(response, 400, { error: 'A valid email address is required' });
  }

  try {
    const { data: targetData, error: targetError } = await adminSupabase.auth.admin.getUserById(userId);
    if (targetError || !targetData.user) {
      return sendJson(response, 404, { error: 'User not found' });
    }

    const { data: updatedUser, error: updateError } = await adminSupabase.auth.admin.updateUserById(userId, {
      email: normalizedEmail,
      email_confirm: true,
    });

    if (updateError) {
      return sendJson(response, 400, { error: updateError.message || 'Failed to update sign-in email' });
    }

    const { error: profileError } = await adminSupabase
      .from('profiles')
      .update({
        email: normalizedEmail,
        updated_at: new Date().toISOString(),
      })
      .eq('id', userId);

    if (profileError) {
      return sendJson(response, 500, {
        error: profileError.message || 'Updated Auth email, but failed to sync the profile email',
      });
    }

    return sendJson(response, 200, {
      success: true,
      userId,
      email: normalizeEmail(updatedUser?.user?.email) || normalizedEmail,
    });
  } catch (handlerError) {
    return sendJson(response, 500, { error: handlerError.message || 'Failed to update user email' });
  }
}
