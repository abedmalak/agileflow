import React, { useState, useMemo } from 'react';
import { User as UserService } from '@/api/entities/User';
import { deleteUserAccount, listManagedUsers, updateManagedUserEmail } from '@/api/admin';
import { supabase } from '@/api/supabaseClient';
import { useAuth } from '@/lib/AuthContext';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useToast } from "@/components/ui/use-toast";
import { showErrorToast } from "@/lib/error-utils";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { cn } from '@/lib/utils';
import { isSuperAdminEmail } from '@/lib/admin-config';
import {
  Shield,
  Users,
  Search,
  UserCog,
  Crown,
  Activity,
  Edit2,
  AlertTriangle,
  UserPlus,
  KeyRound,
  Copy,
  Check,
  MoreHorizontal,
  Trash2,
  MailWarning,
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import InfoTooltip from "@/components/common/InfoTooltip";
import ModuleHelp from "@/components/common/ModuleHelp";
import { usePermissions } from "@/hooks/usePermissions";
import { getLoginUrl } from '@/lib/auth-redirects';
import { requestPasswordResetEmail } from '@/api/password-reset';

const AVATAR_COLORS = [
  'bg-blue-600 text-white',
  'bg-emerald-600 text-white',
  'bg-violet-600 text-white',
  'bg-amber-600 text-white',
  'bg-rose-600 text-white',
  'bg-cyan-600 text-white',
  'bg-indigo-600 text-white',
  'bg-pink-600 text-white',
  'bg-teal-600 text-white',
  'bg-orange-600 text-white',
];

function getAvatarColor(name) {
  if (!name) return 'bg-muted text-muted-foreground';
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
}

function getInitials(name) {
  if (!name) return 'U';
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
}

function formatDate(dateStr) {
  if (!dateStr) return '-';
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now - date;
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

const ROLE_CONFIG = {
  admin: {
    label: 'Admin',
    color: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
    desc: 'Full system access, manage users and settings',
  },
  member: {
    label: 'Member',
    color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
    desc: 'Create boards, manage own content',
  },
  viewer: {
    label: 'Viewer',
    color: 'bg-muted text-muted-foreground',
    desc: 'View shared boards only',
  },
};

export default function AdminPage() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { user: currentUser } = useAuth();

  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [editingUser, setEditingUser] = useState(null);
  const [inviteOpen, setInviteOpen] = useState(false);
  const [resetPasswordUser, setResetPasswordUser] = useState(null);
  const [deleteUserTarget, setDeleteUserTarget] = useState(null);

  const { canManageUsers } = usePermissions();

  const { data: users = [], isLoading } = useQuery({
    queryKey: ['admin-users'],
    queryFn: () => listManagedUsers(),
    enabled: canManageUsers,
  });

  const updateUserMutation = useMutation({
    mutationFn: async ({ id, updates, authEmail }) => {
      const emailChanged =
        typeof authEmail === 'string' &&
        authEmail.trim().toLowerCase() !== (updates.currentEmail || '').trim().toLowerCase();

      if (emailChanged) {
        await updateManagedUserEmail(id, authEmail);
      }

      const profileUpdates = { ...updates };
      delete profileUpdates.currentEmail;

      return UserService.updateUser(id, profileUpdates);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      toast({ title: 'User updated', description: 'Profile and sign-in email changes have been saved.' });
    },
    onError: (error) => {
      showErrorToast(toast, 'Failed to update user', error);
    },
  });

  const resetPasswordMutation = useMutation({
    mutationFn: async (authEmail) => {
      const result = await requestPasswordResetEmail(authEmail);
      return {
        authEmail,
        delivery: result.delivery || 'unknown',
      };
    },
    onSuccess: ({ authEmail, delivery }) => {
      toast({
        title: 'Password reset requested',
        description: delivery === 'resend'
          ? `Resend delivered the password reset email for ${authEmail}.`
          : `Password reset email requested for ${authEmail}.`,
      });
      setResetPasswordUser(null);
    },
    onError: (error) => {
      showErrorToast(toast, 'Failed to send reset email', error);
    },
  });

  const deleteUserMutation = useMutation({
    mutationFn: deleteUserAccount,
    onSuccess: (data, deletedUserId) => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      if (editingUser?.id === deletedUserId) {
        setEditingUser(null);
      }
      if (resetPasswordUser?.id === deletedUserId) {
        setResetPasswordUser(null);
      }
      setDeleteUserTarget(null);
      toast({
        title: 'User deleted',
        description: `${data?.deletedAssignedItems || 0} assigned task(s) and ${data?.deletedAssignedStories || 0} assigned backlog stor${(data?.deletedAssignedStories || 0) === 1 ? 'y' : 'ies'} were deleted before the account was removed.`,
      });
    },
    onError: (error) => {
      showErrorToast(toast, 'Failed to delete user account', error);
    },
  });

  const filteredUsers = useMemo(() => {
    let result = users;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(u =>
        u.full_name?.toLowerCase().includes(q) ||
        u.email?.toLowerCase().includes(q) ||
        u.job_title?.toLowerCase().includes(q) ||
        u.department?.toLowerCase().includes(q)
      );
    }
    if (roleFilter !== 'all') {
      result = result.filter(u => (u.role || 'member') === roleFilter);
    }
    return result;
  }, [users, searchQuery, roleFilter]);

  const stats = useMemo(() => {
    const now = new Date();
    return {
      total: users.length,
      admins: users.filter(u => u.role === 'admin').length,
      members: users.filter(u => u.role === 'member' || !u.role).length,
      activeRecently: users.filter(u => {
        if (!u.updated_at) return false;
        const diff = now - new Date(u.updated_at);
        return diff < 7 * 24 * 60 * 60 * 1000;
      }).length,
    };
  }, [users]);

  if (!canManageUsers) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6">
        <Card className="max-w-md w-full border border-border bg-card">
          <CardContent className="pt-6 text-center">
            <AlertTriangle className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-foreground mb-2">Access Denied</h2>
            <p className="text-muted-foreground">
              You need administrator privileges to access this page.
              Contact your admin to request access.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center justify-center py-12">
          <div className="w-8 h-8 border-2 border-muted-foreground border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-muted-foreground mt-3">Loading team members...</p>
        </div>
      </div>
    );
  }

  const statCards = [
    { label: 'Total Members', value: stats.total, icon: Users, tooltip: 'All registered users in your workspace' },
    { label: 'Admins', value: stats.admins, icon: Crown, tooltip: 'Users with full system access including user management' },
    { label: 'Members', value: stats.members, icon: UserCog, tooltip: 'Users who can create and edit boards and tasks' },
    { label: 'Active This Week', value: stats.activeRecently, icon: Activity, tooltip: 'Users who have logged in or performed an action recently' },
  ];

  return (
    <div className="min-h-screen bg-background p-6 transition-colors duration-200">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-start justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center">
              <Shield className="w-5 h-5 text-foreground" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">Team Management</h1>
              <p className="text-sm text-muted-foreground">Manage team members, roles, and permissions</p>
            </div>
            <ModuleHelp moduleKey="admin" />
          </div>
          <TooltipProvider delayDuration={300}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button onClick={() => setInviteOpen(true)} className="gap-2">
                  <UserPlus className="w-4 h-4" />
                  Invite Member
                </Button>
              </TooltipTrigger>
              <TooltipContent side="bottom" className="text-xs max-w-xs z-[300]">
                Generate a sign-up link to invite new team members to your workspace
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {statCards.map((stat) => (
            <Card key={stat.label} className="border border-border bg-card">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-1">
                      <p className="text-xs text-muted-foreground">{stat.label}</p>
                      <InfoTooltip text={stat.tooltip} />
                    </div>
                    <p className="text-2xl font-bold text-foreground mt-0.5">{stat.value}</p>
                  </div>
                  <div className="w-9 h-9 bg-muted rounded-lg flex items-center justify-center">
                    <stat.icon className="w-4 h-4 text-muted-foreground" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* User List */}
        <Card className="border border-border bg-card">
          <CardHeader className="pb-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <CardTitle className="text-foreground text-base">Team Members</CardTitle>
                <CardDescription>{filteredUsers.length} of {users.length} members</CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <TooltipProvider delayDuration={300}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          placeholder="Search by name, email, or title..."
                          className="pl-9 w-64"
                        />
                      </div>
                    </TooltipTrigger>
                    <TooltipContent side="bottom" className="text-xs max-w-xs z-[300]">
                      Find users by name, email, or job title
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                <TooltipProvider delayDuration={300}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div>
                        <Select value={roleFilter} onValueChange={setRoleFilter}>
                          <SelectTrigger className="w-32">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All roles</SelectItem>
                            <SelectItem value="admin">Admin</SelectItem>
                            <SelectItem value="member">Member</SelectItem>
                            <SelectItem value="viewer">Viewer</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent side="bottom" className="text-xs max-w-xs z-[300]">
                      Show only users with a specific role
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-y border-border bg-muted/50">
                    <th className="text-left py-2.5 px-4 text-xs font-medium text-muted-foreground uppercase tracking-wider">User</th>
                    <th className="text-left py-2.5 px-4 text-xs font-medium text-muted-foreground uppercase tracking-wider hidden md:table-cell">
                      <span className="inline-flex items-center gap-1">
                        Role
                        <InfoTooltip text="Admin = full access. Member = create and edit. Viewer = read-only." />
                      </span>
                    </th>
                    <th className="text-left py-2.5 px-4 text-xs font-medium text-muted-foreground uppercase tracking-wider hidden lg:table-cell">Department</th>
                    <th className="text-left py-2.5 px-4 text-xs font-medium text-muted-foreground uppercase tracking-wider hidden lg:table-cell">Last Active</th>
                    <th className="text-left py-2.5 px-4 text-xs font-medium text-muted-foreground uppercase tracking-wider hidden sm:table-cell">Joined</th>
                    <th className="text-right py-2.5 px-4 text-xs font-medium text-muted-foreground uppercase tracking-wider w-12"></th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((u) => {
                    const role = u.role || 'member';
                    const roleConfig = ROLE_CONFIG[role] || ROLE_CONFIG.member;
                    const isCurrentUser = u.id === currentUser?.id;
                    const isProtectedUser = isCurrentUser || isSuperAdminEmail(u.email);
                    const isActiveDate = u.last_sign_in_at || u.updated_at;
                    const isActive = isActiveDate && (new Date() - new Date(isActiveDate)) < 24 * 60 * 60 * 1000;

                    return (
                      <tr
                        key={u.id}
                        className="border-b border-border hover:bg-muted/30 transition-colors cursor-pointer"
                        onClick={() => setEditingUser(u)}
                      >
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-3">
                            <div className="relative">
                              <div className={cn(
                                "w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0",
                                getAvatarColor(u.full_name)
                              )}>
                                <span className="font-semibold text-xs">{getInitials(u.full_name)}</span>
                              </div>
                              {isActive && (
                                <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 border-2 border-card rounded-full" />
                              )}
                            </div>
                            <div className="min-w-0">
                              <div className="flex items-center gap-1.5">
                                <span className="font-medium text-sm text-foreground truncate">
                                  {u.full_name || 'Unnamed User'}
                                </span>
                                {isCurrentUser && (
                                  <Badge variant="outline" className="text-[10px] px-1.5 py-0">you</Badge>
                                )}
                              </div>
                              <p className="text-xs text-muted-foreground truncate">{u.email}</p>
                              {u.email_mismatch && (
                                <p className="text-[11px] text-amber-600 dark:text-amber-400 inline-flex items-center gap-1 mt-0.5">
                                  <MailWarning className="w-3 h-3 shrink-0" />
                                  Profile email was out of sync with Auth and has been corrected for admin actions.
                                </p>
                              )}
                              {u.job_title && (
                                <p className="text-xs text-muted-foreground truncate md:hidden">{u.job_title}</p>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-4 hidden md:table-cell">
                          <Badge variant="secondary" className={cn('text-xs', roleConfig.color)}>
                            {roleConfig.label}
                          </Badge>
                        </td>
                        <td className="py-3 px-4 hidden lg:table-cell">
                          <span className="text-sm text-muted-foreground">
                            {u.department || '-'}
                          </span>
                          {u.job_title && (
                            <p className="text-xs text-muted-foreground">{u.job_title}</p>
                          )}
                        </td>
                        <td className="py-3 px-4 hidden lg:table-cell">
                          <span className="text-sm text-muted-foreground">
                            {formatDate(u.last_sign_in_at || u.updated_at)}
                          </span>
                        </td>
                        <td className="py-3 px-4 hidden sm:table-cell">
                          <span className="text-sm text-muted-foreground">
                            {formatDate(u.created_at)}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <DropdownMenu>
                            <TooltipProvider delayDuration={300}>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                      <MoreHorizontal className="w-4 h-4" />
                                    </Button>
                                  </DropdownMenuTrigger>
                                </TooltipTrigger>
                                <TooltipContent side="left" className="text-xs max-w-xs z-[300]">
                                  Manage this user — edit role, reset password, or delete the account
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={(e) => { e.stopPropagation(); setEditingUser(u); }}>
                                <Edit2 className="w-4 h-4 mr-2" />
                                Edit User
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={(e) => { e.stopPropagation(); setResetPasswordUser(u); }}
                                disabled={isCurrentUser}
                              >
                                <KeyRound className="w-4 h-4 mr-2" />
                                Reset Password
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={(e) => { e.stopPropagation(); setDeleteUserTarget(u); }}
                                disabled={isProtectedUser}
                                className="text-destructive focus:text-destructive"
                              >
                                <Trash2 className="w-4 h-4 mr-2" />
                                Delete Account
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              {filteredUsers.length === 0 && (
                <div className="text-center py-12 text-muted-foreground">
                  <Users className="w-10 h-10 mx-auto mb-3 opacity-40" />
                  <p className="text-sm">No users found matching your search.</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Project Advisors */}
      <div className="max-w-6xl mx-auto mt-6 px-6">
        <Card>
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-foreground text-base">Project Advisors</CardTitle>
                <CardDescription>Capstone project supervisors</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { name: 'Prof. Dr. Gül Temur', email: 'gul.temur@bau.edu.tr', role: 'Management Engineering', title: 'Professor & Advisor' },
                { name: 'Dr. Derya Bodur', email: 'derya.bodur@bau.edu.tr', role: 'Software Engineering', title: 'Advisor' },
              ].map((advisor) => (
                <div key={advisor.email} className="flex items-center gap-4 p-4 rounded-lg border border-border bg-card hover:bg-accent/30 transition-colors">
                  <div className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold flex-shrink-0",
                    "bg-violet-600 text-white"
                  )}>
                    {advisor.name.split(' ').filter(w => w.length > 2).slice(0, 2).map(w => w[0]).join('')}
                  </div>
                  <div className="min-w-0">
                    <p className="font-medium text-foreground text-sm">{advisor.name}</p>
                    <p className="text-xs text-muted-foreground truncate">{advisor.email}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="outline" className="text-xs">{advisor.title}</Badge>
                      <span className="text-xs text-muted-foreground">{advisor.role}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Edit User Dialog */}
      {editingUser && (
        <EditUserDialog
          user={editingUser}
          isCurrentUser={editingUser.id === currentUser?.id}
          onClose={() => setEditingUser(null)}
          onSave={({ updates, authEmail }) => {
            updateUserMutation.mutate(
              { id: editingUser.id, updates, authEmail },
              { onSuccess: () => setEditingUser(null) }
            );
          }}
          isSaving={updateUserMutation.isPending}
        />
      )}

      {/* Invite Dialog */}
      <InviteDialog open={inviteOpen} onClose={() => setInviteOpen(false)} />

      {/* Reset Password Confirmation */}
      <Dialog open={!!resetPasswordUser} onOpenChange={() => setResetPasswordUser(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Reset Password</DialogTitle>
            <DialogDescription>
              Send a password reset email for <span className="font-medium text-foreground">{resetPasswordUser?.full_name || resetPasswordUser?.email}</span>?
            </DialogDescription>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            We&apos;ll send the reset link to this user&apos;s current sign-in email in Supabase Auth. Their current password will remain active until they complete the reset.
          </p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setResetPasswordUser(null)}>
              Cancel
            </Button>
            <Button
              onClick={() => resetPasswordMutation.mutate(resetPasswordUser?.email)}
              disabled={resetPasswordMutation.isPending}
            >
              {resetPasswordMutation.isPending ? 'Sending...' : 'Send Reset Email'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog
        open={!!deleteUserTarget}
        onOpenChange={(open) => {
          if (!open && !deleteUserMutation.isPending) {
            setDeleteUserTarget(null);
          }
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete account permanently?</AlertDialogTitle>
            <AlertDialogDescription>
              {deleteUserTarget ? (
                <>
                  <span className="font-medium text-foreground">{deleteUserTarget.full_name || deleteUserTarget.email}</span>
                  {' '}will be removed from authentication, and tasks currently assigned to this user will be deleted first.
                </>
              ) : (
                'This user account will be permanently removed.'
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="text-sm text-muted-foreground">
            This cannot be undone. Assigned board tasks and backlog stories are removed before the auth account is deleted. Active sessions may remain valid until their current access token expires.
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleteUserMutation.isPending}>Cancel</AlertDialogCancel>
            <Button
              variant="destructive"
              onClick={() => deleteUserMutation.mutate(deleteUserTarget?.id)}
              disabled={deleteUserMutation.isPending}
            >
              {deleteUserMutation.isPending ? 'Deleting...' : 'Delete Account'}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

function EditUserDialog({ user, isCurrentUser, onClose, onSave, isSaving }) {
  const [form, setForm] = useState({
    full_name: user.full_name || '',
    email: user.email || '',
    job_title: user.job_title || '',
    department: user.department || '',
    description: user.description || '',
    skills: Array.isArray(user.skills) ? user.skills.join(', ') : (user.skills || ''),
    role: user.role || 'member',
  });

  const handleChange = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    const updates = {
      full_name: form.full_name.trim(),
      currentEmail: user.email || '',
      job_title: form.job_title.trim(),
      department: form.department.trim(),
      description: form.description.trim(),
      skills: form.skills.split(',').map(s => s.trim()).filter(Boolean),
      role: form.role,
    };
    onSave({ updates, authEmail: form.email.trim() });
  };

  const role = form.role;
  const roleConfig = ROLE_CONFIG[role] || ROLE_CONFIG.member;

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <div className={cn(
              "w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0",
              getAvatarColor(user.full_name)
            )}>
              <span className="font-semibold text-sm">{getInitials(user.full_name)}</span>
            </div>
            <div>
              <span className="text-base">{user.full_name || 'Unnamed User'}</span>
              <p className="text-sm font-normal text-muted-foreground">{user.email}</p>
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="edit-name">Full Name</Label>
              <Input
                id="edit-name"
                value={form.full_name}
                onChange={(e) => handleChange('full_name', e.target.value)}
                placeholder="Full name"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="edit-email">Email</Label>
              <Input
                id="edit-email"
                type="email"
                value={form.email}
                onChange={(e) => handleChange('email', e.target.value)}
                placeholder="user@example.com"
                className="bg-muted/40"
              />
              <p className="text-xs text-muted-foreground">
                This updates the user&apos;s real sign-in email in Supabase Auth and syncs the profile email to match.
              </p>
              {user.email_mismatch && user.profile_email && (
                <p className="text-xs text-amber-600 dark:text-amber-400">
                  Previous profile email mismatch detected. Profile had <span className="font-medium">{user.profile_email}</span>, but Auth uses <span className="font-medium">{user.email}</span>.
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <div className="flex items-center gap-1.5">
                <Label htmlFor="edit-role">Role</Label>
                <InfoTooltip text="Admin = full access to everything. Member = can create and edit. Viewer = read-only access." />
              </div>
              <Select value={form.role} onValueChange={(val) => handleChange('role', val)} disabled={isCurrentUser}>
                <SelectTrigger id="edit-role">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="member">Member</SelectItem>
                  <SelectItem value="viewer">Viewer</SelectItem>
                </SelectContent>
              </Select>
              {isCurrentUser && (
                <p className="text-xs text-muted-foreground">You cannot change your own role.</p>
              )}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="edit-dept">Department</Label>
              <Input
                id="edit-dept"
                value={form.department}
                onChange={(e) => handleChange('department', e.target.value)}
                placeholder="e.g. Engineering"
              />
            </div>
          </div>

          <div className="rounded-md bg-muted/50 p-3 text-xs text-muted-foreground">
            <span className="font-medium text-foreground">{roleConfig.label}:</span> {roleConfig.desc}
          </div>

          <Separator />

          <div className="space-y-1.5">
            <Label htmlFor="edit-title">Job Title</Label>
            <Input
              id="edit-title"
              value={form.job_title}
              onChange={(e) => handleChange('job_title', e.target.value)}
              placeholder="e.g. Product Manager"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="edit-desc">Bio</Label>
            <Textarea
              id="edit-desc"
              value={form.description}
              onChange={(e) => handleChange('description', e.target.value)}
              placeholder="Short description about this team member"
              rows={3}
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="edit-skills">Skills</Label>
            <Input
              id="edit-skills"
              value={form.skills}
              onChange={(e) => handleChange('skills', e.target.value)}
              placeholder="React, TypeScript, Project Management"
            />
            <p className="text-xs text-muted-foreground">Comma-separated list</p>
          </div>

          <div className="text-xs text-muted-foreground flex items-center gap-4">
            <span>Joined {formatDate(user.created_at)}</span>
            <span>Last active {formatDate(user.updated_at)}</span>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={isSaving}>
            {isSaving ? 'Saving...' : 'Save Changes'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function InviteDialog({ open, onClose }) {
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteName, setInviteName] = useState('');
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const signupUrl = getLoginUrl();

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(signupUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      const input = document.createElement('input');
      input.value = signupUrl;
      document.body.appendChild(input);
      input.select();
      document.execCommand('copy');
      document.body.removeChild(input);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleSendInvite = async () => {
    if (!inviteEmail.trim()) return;
    setSending(true);
    try {
      const { error } = await supabase.auth.signInWithOtp({
        email: inviteEmail.trim(),
        options: {
          data: { full_name: inviteName.trim() || undefined },
          emailRedirectTo: getLoginUrl(),
        },
      });
      if (error) throw error;
      setSent(true);
      toast({ title: 'Invite sent', description: `Magic link sent to ${inviteEmail.trim()}` });
      setTimeout(() => {
        setSent(false);
        setInviteEmail('');
        setInviteName('');
      }, 3000);
    } catch (err) {
      showErrorToast(toast, 'Failed to send invite', err);
    } finally {
      setSending(false);
    }
  };

  const handleClose = () => {
    setInviteEmail('');
    setInviteName('');
    setSent(false);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <UserPlus className="w-5 h-5" />
            Invite Team Member
          </DialogTitle>
          <DialogDescription>
            Send an email invite or share the sign-up link directly.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          {/* Email invite */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Send Email Invite</Label>
            <div className="space-y-2">
              <Input
                type="email"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
                placeholder="colleague@example.com"
                onKeyDown={(e) => e.key === 'Enter' && handleSendInvite()}
              />
              <Input
                value={inviteName}
                onChange={(e) => setInviteName(e.target.value)}
                placeholder="Full name (optional)"
              />
              <Button
                onClick={handleSendInvite}
                disabled={!inviteEmail.trim() || sending || sent}
                className="w-full gap-2"
              >
                {sent ? (
                  <><Check className="w-4 h-4" /> Invite Sent</>
                ) : sending ? (
                  'Sending...'
                ) : (
                  <><UserPlus className="w-4 h-4" /> Send Invite</>
                )}
              </Button>
            </div>
          </div>

          <div className="relative">
            <Separator />
            <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-background px-2 text-xs text-muted-foreground">or</span>
          </div>

          {/* Copy link */}
          <div className="space-y-1.5">
            <Label className="text-sm font-medium">Share Sign-up Link</Label>
            <div className="flex items-center gap-2">
              <Input
                value={signupUrl}
                readOnly
                className="bg-muted text-sm font-mono"
              />
              <Button variant="outline" size="sm" onClick={handleCopy} className="flex-shrink-0 gap-1.5">
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                {copied ? 'Copied' : 'Copy'}
              </Button>
            </div>
          </div>

          <div className="rounded-md bg-muted/50 p-3 text-sm text-muted-foreground space-y-2">
            <p className="font-medium text-foreground text-xs uppercase tracking-wider">How it works</p>
            <ul className="text-xs space-y-1">
              <li>1. Enter their email and click Send Invite, or share the link</li>
              <li>2. They'll receive a magic link to set up their account</li>
              <li>3. New users are assigned the <span className="font-medium">Member</span> role by default</li>
              <li>4. You can change their role from this admin panel</li>
            </ul>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
