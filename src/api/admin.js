import { supabase } from './supabaseClient';

async function getAdminAccessToken() {
  const { data, error } = await supabase.auth.getSession();
  if (error) {
    throw error;
  }

  const accessToken = data.session?.access_token;
  if (!accessToken) {
    throw new Error('Authentication required');
  }

  return accessToken;
}

export async function deleteUserAccount(userId) {
  if (!userId) {
    throw new Error('User ID is required');
  }

  const accessToken = await getAdminAccessToken();

  const response = await fetch('/api/admin/delete-user', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({ userId }),
  });

  const payload = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(payload.error || 'Failed to delete user account');
  }

  return payload;
}

export async function listManagedUsers() {
  const accessToken = await getAdminAccessToken();

  const response = await fetch('/api/admin/list-users', {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  const payload = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(payload.error || 'Failed to load users');
  }

  return payload.users || [];
}

export async function updateManagedUserEmail(userId, email) {
  if (!userId) {
    throw new Error('User ID is required');
  }

  const accessToken = await getAdminAccessToken();

  const response = await fetch('/api/admin/update-user-email', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({ userId, email }),
  });

  const payload = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(payload.error || 'Failed to update sign-in email');
  }

  return payload;
}
