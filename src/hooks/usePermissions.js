import { useMemo } from 'react';
import { useAuth } from '@/lib/AuthContext';
import { isSuperAdminEmail } from '@/lib/admin-config';

// Role hierarchy: higher number = more permissions
const ROLE_LEVEL = {
  viewer: 0,
  member: 1,
  admin: 2,
};

export function usePermissions() {
  const { user } = useAuth();

  return useMemo(() => {
    const role = user?.role || 'viewer';
    const level = ROLE_LEVEL[role] ?? 0;
    const isSuperAdmin = isSuperAdminEmail(user?.email);

    return {
      role,
      isSuperAdmin,
      isAdmin: level >= ROLE_LEVEL.admin,
      isMember: level >= ROLE_LEVEL.member,
      isViewer: level === ROLE_LEVEL.viewer,

      // Content permissions
      canCreateBoard: level >= ROLE_LEVEL.member,
      canEditBoard: level >= ROLE_LEVEL.member,
      canDeleteBoard: level >= ROLE_LEVEL.admin,

      canCreateItem: level >= ROLE_LEVEL.member,
      canEditItem: level >= ROLE_LEVEL.member,
      canDeleteItem: level >= ROLE_LEVEL.member,
      canDragItem: level >= ROLE_LEVEL.member,

      canCreateSprint: level >= ROLE_LEVEL.member,
      canEditSprint: level >= ROLE_LEVEL.member,

      canCreateEvent: level >= ROLE_LEVEL.member,
      canEditEvent: level >= ROLE_LEVEL.member,

      // Profile permissions
      canEditOwnProfile: level >= ROLE_LEVEL.member,

      // Admin permissions
      canManageUsers: isSuperAdmin,
      canResetPasswords: isSuperAdmin,
      canInviteMembers: isSuperAdmin,
      canChangeRoles: isSuperAdmin,
    };
  }, [user?.role, user?.email]);
}
