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

function normalizeValue(value) {
  return typeof value === 'string' ? value.trim().toLowerCase() : '';
}

function matchesCandidate(value, candidates) {
  if (typeof value === 'string') {
    return candidates.has(normalizeValue(value));
  }

  if (Array.isArray(value)) {
    return value.some((entry) => matchesCandidate(entry, candidates));
  }

  if (value && typeof value === 'object') {
    return Object.values(value).some((entry) => matchesCandidate(entry, candidates));
  }

  return false;
}

function getBoardAssigneeKeys(columns) {
  if (!Array.isArray(columns)) {
    return ['owner'];
  }

  const peopleKeys = columns
    .filter((column) => column?.type === 'people' || column?.type === 'person')
    .map((column) => column.id)
    .filter(Boolean);

  return ['owner', ...peopleKeys];
}

export default async function handler(request, response) {
  if (request.method !== 'POST') {
    response.setHeader('Allow', 'POST');
    return sendJson(response, 405, { error: 'Method not allowed' });
  }

  const supabaseUrl = process.env.VITE_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    return sendJson(response, 500, { error: 'Server is missing Supabase configuration' });
  }

  const authHeader = request.headers.authorization || '';
  const accessToken = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : '';
  if (!accessToken) {
    return sendJson(response, 401, { error: 'Missing access token' });
  }

  const { userId } = parseRequestBody(request.body);
  if (!userId || typeof userId !== 'string') {
    return sendJson(response, 400, { error: 'A valid user ID is required' });
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
    return sendJson(response, 401, { error: 'Unable to verify the current user' });
  }

  if (!isSuperAdminEmail(requester.email)) {
    return sendJson(response, 403, { error: 'Only the super admin can delete accounts' });
  }

  if (requester.id === userId) {
    return sendJson(response, 400, { error: 'You cannot delete your own account' });
  }

  const { data: targetData, error: targetError } = await adminSupabase.auth.admin.getUserById(userId);
  if (targetError || !targetData.user) {
    return sendJson(response, 404, { error: 'User not found' });
  }

  if (isSuperAdminEmail(targetData.user.email)) {
    return sendJson(response, 400, { error: 'The super admin account cannot be deleted' });
  }

  const { data: targetProfile } = await adminSupabase
    .from('profiles')
    .select('full_name, email')
    .eq('id', userId)
    .maybeSingle();

  const assignmentCandidates = new Set(
    [
      userId,
      targetData.user.email,
      targetProfile?.email,
      targetProfile?.full_name,
      targetData.user.user_metadata?.full_name,
      targetData.user.user_metadata?.name,
    ]
      .map(normalizeValue)
      .filter(Boolean)
  );

  let deletedAssignedItems = 0;
  let deletedAssignedStories = 0;

  const [{ data: boards }, { data: items }, { data: stories }] = await Promise.all([
    adminSupabase.from('boards').select('id, columns'),
    adminSupabase.from('items').select('id, board_id, data'),
    adminSupabase.from('user_stories').select('id, assigned_to'),
  ]);

  const boardAssigneeKeys = new Map(
    (boards || []).map((board) => [board.id, getBoardAssigneeKeys(board.columns)])
  );

  const assignedItemIds = (items || [])
    .filter((item) => {
      const data = item?.data && typeof item.data === 'object' ? item.data : {};
      const assigneeKeys = boardAssigneeKeys.get(item.board_id) || ['owner'];
      return assigneeKeys.some((key) => matchesCandidate(data[key], assignmentCandidates));
    })
    .map((item) => item.id);

  if (assignedItemIds.length > 0) {
    const { error: deleteItemsError } = await adminSupabase
      .from('items')
      .delete()
      .in('id', assignedItemIds);

    if (deleteItemsError) {
      return sendJson(response, 500, { error: deleteItemsError.message || 'Failed to delete assigned tasks' });
    }

    deletedAssignedItems = assignedItemIds.length;
  }

  const assignedStoryIds = (stories || [])
    .filter((story) => matchesCandidate(story.assigned_to, assignmentCandidates))
    .map((story) => story.id);

  if (assignedStoryIds.length > 0) {
    const { error: deleteStoriesError } = await adminSupabase
      .from('user_stories')
      .delete()
      .in('id', assignedStoryIds);

    if (deleteStoriesError) {
      return sendJson(response, 500, { error: deleteStoriesError.message || 'Failed to delete assigned backlog stories' });
    }

    deletedAssignedStories = assignedStoryIds.length;
  }

  const { error: deleteError } = await adminSupabase.auth.admin.deleteUser(userId);
  if (deleteError) {
    return sendJson(response, 500, { error: deleteError.message || 'Failed to delete user' });
  }

  return sendJson(response, 200, {
    success: true,
    userId,
    deletedAssignedItems,
    deletedAssignedStories,
  });
}
