import { createClient } from '@supabase/supabase-js';
import { isSuperAdminEmail } from '../../src/lib/admin-config.js';

function sendJson(response, status, body) {
  response.status(status).setHeader('Content-Type', 'application/json');
  response.end(JSON.stringify(body));
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

async function listAllAuthUsers(adminSupabase) {
  const users = [];
  let page = 1;

  while (true) {
    const {
      data: { users: pageUsers = [] } = {},
      error,
    } = await adminSupabase.auth.admin.listUsers({ page, perPage: 1000 });

    if (error) {
      throw error;
    }

    users.push(...pageUsers);

    if (pageUsers.length < 1000) {
      break;
    }

    page += 1;
  }

  return users;
}

export default async function handler(request, response) {
  if (request.method !== 'GET') {
    response.setHeader('Allow', 'GET');
    return sendJson(response, 405, { error: 'Method not allowed' });
  }

  const { adminSupabase, error } = await getAuthorizedAdmin(request);
  if (error) {
    return sendJson(response, error.status, { error: error.message });
  }

  try {
    const [authUsers, { data: profiles, error: profilesError }] = await Promise.all([
      listAllAuthUsers(adminSupabase),
      adminSupabase.from('profiles').select('*'),
    ]);

    if (profilesError) {
      throw profilesError;
    }

    const authUsersById = new Map(authUsers.map((user) => [user.id, user]));

    const mergedUsers = (profiles || [])
      .map((profile) => {
        const authUser = authUsersById.get(profile.id) || null;
        const authEmail = normalizeEmail(authUser?.email);
        const profileEmail = normalizeEmail(profile.email);
        const effectiveEmail = authEmail || profileEmail;

        return {
          ...profile,
          email: effectiveEmail || profile.email || '',
          auth_email: authEmail || null,
          profile_email: profileEmail || null,
          email_mismatch: Boolean(authEmail && profileEmail && authEmail !== profileEmail),
          last_sign_in_at: authUser?.last_sign_in_at || null,
          auth_created_at: authUser?.created_at || null,
          email_confirmed_at: authUser?.email_confirmed_at || null,
        };
      })
      .sort((left, right) => {
        const leftDate = new Date(left.created_at || left.auth_created_at || 0).getTime();
        const rightDate = new Date(right.created_at || right.auth_created_at || 0).getTime();
        return rightDate - leftDate;
      });

    return sendJson(response, 200, { users: mergedUsers });
  } catch (handlerError) {
    return sendJson(response, 500, { error: handlerError.message || 'Failed to load users' });
  }
}
