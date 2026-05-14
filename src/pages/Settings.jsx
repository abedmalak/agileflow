import React, { useState, useEffect } from 'react';
import { usePermissions } from "@/hooks/usePermissions";
import { User as UserService } from "@/api/entities/User";
import { supabase } from "@/api/supabaseClient";
import { useTheme } from "@/components/utils/ThemeProvider";
import { useToast } from "@/components/ui/use-toast";
import { showErrorToast } from "@/lib/error-utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Settings as SettingsIcon,
  User,
  Bell,
  Shield,
  Palette,
  Save,
  CheckCircle2,
  LogOut,
  AlertCircle,
  RefreshCw
} from "lucide-react";
import { motion } from "framer-motion";
import InfoTooltip from "@/components/common/InfoTooltip";
import ModuleHelp from "@/components/common/ModuleHelp";

export default function SettingsPage() {
  const { toast } = useToast();
  const { canEditOwnProfile } = usePermissions();
  const { theme: currentTheme, setTheme: updateTheme } = useTheme();
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const [settings, setSettings] = useState({
    full_name: '',
    email: '',
    job_title: '',
    department: '',
    description: '',
    skills: [],
    email_notifications: true,
    task_assignments: true,
    mentions: true,
    due_date_reminders: true,
    sprint_updates: true,
    daily_digest: false,
    theme: 'light',
    language: 'en',
    timezone: 'UTC',
    date_format: 'MM/DD/YYYY',
    week_start: 'sunday',
    profile_visibility: 'team',
    show_email: true,
    activity_tracking: true
  });

  useEffect(() => {
    loadUserSettings();
  }, []);

  useEffect(() => {
    if (currentTheme && settings.theme !== currentTheme) {
      setSettings(prev => ({ ...prev, theme: currentTheme }));
    }
  }, [currentTheme]);

  const loadUserSettings = async () => {
    setIsLoading(true);
    setLoadError(false);
    try {
      const userData = await UserService.me();
      setUser(userData);

      const s = userData.settings || {};
      setSettings({
        full_name: userData.full_name || '',
        email: userData.email || '',
        job_title: userData.job_title || s.job_title || '',
        department: userData.department || s.department || '',
        description: userData.description || '',
        skills: Array.isArray(userData.skills) ? userData.skills : [],
        email_notifications: s.email_notifications !== false,
        task_assignments: s.task_assignments !== false,
        mentions: s.mentions !== false,
        due_date_reminders: s.due_date_reminders !== false,
        sprint_updates: s.sprint_updates !== false,
        daily_digest: s.daily_digest || false,
        theme: userData.theme || currentTheme || 'light',
        language: s.language || 'en',
        timezone: s.timezone || 'UTC',
        date_format: s.date_format || 'MM/DD/YYYY',
        week_start: s.week_start || 'sunday',
        profile_visibility: s.profile_visibility || 'team',
        show_email: s.show_email !== false,
        activity_tracking: s.activity_tracking !== false
      });
    } catch (error) {
      console.error('Error loading user settings:', error);
      setLoadError(true);
    }
    setIsLoading(false);
  };

  const handleSaveSettings = async () => {
    setIsSaving(true);
    setSaveSuccess(false);

    try {
      await UserService.updateMe({
        full_name: settings.full_name,
        theme: settings.theme,
        job_title: settings.job_title,
        department: settings.department,
        description: settings.description,
        skills: settings.skills,
        settings: {
          email_notifications: settings.email_notifications,
          task_assignments: settings.task_assignments,
          mentions: settings.mentions,
          due_date_reminders: settings.due_date_reminders,
          sprint_updates: settings.sprint_updates,
          daily_digest: settings.daily_digest,
          language: settings.language,
          timezone: settings.timezone,
          date_format: settings.date_format,
          week_start: settings.week_start,
          profile_visibility: settings.profile_visibility,
          show_email: settings.show_email,
          activity_tracking: settings.activity_tracking,
        }
      });

      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
      await loadUserSettings();
    } catch (error) {
      console.error('Error saving settings:', error);
      showErrorToast(toast, "Save failed", error);
    }

    setIsSaving(false);
  };

  const handleThemeChange = (value) => {
    setSettings(prev => ({ ...prev, theme: value }));
    updateTheme(value);
  };

  const handleLogout = () => {
    if (supabase) {
      supabase.auth.signOut();
    } else {
      window.location.href = '/login';
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center justify-center py-12">
          <div className="w-8 h-8 border-2 border-muted-foreground border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-muted-foreground mt-3">Loading settings...</p>
        </div>
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4 text-center">
          <AlertCircle className="w-10 h-10 text-muted-foreground" />
          <h2 className="text-lg font-semibold text-foreground">Failed to load settings</h2>
          <p className="text-sm text-muted-foreground">There was a problem fetching your account data.</p>
          <div className="flex gap-3">
            <Button variant="outline" onClick={loadUserSettings}>
              <RefreshCw className="w-4 h-4 mr-2" />
              Try again
            </Button>
            <Button variant="ghost" onClick={handleLogout}>
              <LogOut className="w-4 h-4 mr-2" />
              Sign out
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const userInitials = settings.full_name
    ?.split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase() || 'U';

  return (
    <div className="min-h-screen bg-background p-6 transition-colors duration-200">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center">
              <SettingsIcon className="w-5 h-5 text-foreground" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-foreground">Settings</h1>
              <p className="text-muted-foreground mt-1">Manage your account and preferences</p>
            </div>
            <ModuleHelp moduleKey="settings" />
          </div>
        </div>

        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList>
            <TooltipProvider delayDuration={300}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <TabsTrigger value="profile" className="flex items-center gap-2">
                    <User className="w-4 h-4" />
                    Profile
                  </TabsTrigger>
                </TooltipTrigger>
                <TooltipContent side="bottom" className="text-xs max-w-xs z-[300]">
                  Your name, avatar, job title, department, and bio
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <TooltipProvider delayDuration={300}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <TabsTrigger value="notifications" className="flex items-center gap-2">
                    <Bell className="w-4 h-4" />
                    Notifications
                  </TabsTrigger>
                </TooltipTrigger>
                <TooltipContent side="bottom" className="text-xs max-w-xs z-[300]">
                  Control which email and in-app alerts you receive
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <TooltipProvider delayDuration={300}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <TabsTrigger value="preferences" className="flex items-center gap-2">
                    <Palette className="w-4 h-4" />
                    Preferences
                  </TabsTrigger>
                </TooltipTrigger>
                <TooltipContent side="bottom" className="text-xs max-w-xs z-[300]">
                  Theme, timezone, date format, and calendar options
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <TooltipProvider delayDuration={300}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <TabsTrigger value="privacy" className="flex items-center gap-2">
                    <Shield className="w-4 h-4" />
                    Privacy
                  </TabsTrigger>
                </TooltipTrigger>
                <TooltipContent side="bottom" className="text-xs max-w-xs z-[300]">
                  Profile visibility, email display, and activity tracking
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </TabsList>

          {/* Profile Tab */}
          <TabsContent value="profile">
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
              <div className="border border-border bg-card rounded-lg p-6 space-y-4">
                <div>
                  <h2 className="text-lg font-semibold text-foreground">Profile Information</h2>
                  <p className="text-sm text-muted-foreground">Update your personal information and profile details</p>
                </div>

                <div className="flex items-center gap-6">
                  <Avatar className="w-20 h-20">
                    <AvatarFallback className="text-xl font-bold bg-muted text-foreground">
                      {userInitials}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-semibold text-lg text-foreground">{settings.full_name || 'User'}</h3>
                    <p className="text-muted-foreground">{settings.email}</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      Role: <span className="font-medium capitalize">{user?.role || 'User'}</span>
                    </p>
                  </div>
                </div>

                <Separator />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <div className="flex items-center gap-1.5">
                      <Label htmlFor="full_name">Full Name</Label>
                      <InfoTooltip text="Your display name visible to team members" />
                    </div>
                    <Input
                      id="full_name"
                      value={settings.full_name}
                      onChange={(e) => setSettings(prev => ({ ...prev, full_name: e.target.value }))}
                      placeholder="Enter your full name"
                      disabled={!canEditOwnProfile}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      value={settings.email}
                      disabled
                      className="bg-muted"
                    />
                    <p className="text-xs text-muted-foreground">Email cannot be changed</p>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-1.5">
                      <Label htmlFor="job_title">Job Title</Label>
                      <InfoTooltip text="Your role title, visible to team members" />
                    </div>
                    <Input
                      id="job_title"
                      value={settings.job_title}
                      onChange={(e) => setSettings(prev => ({ ...prev, job_title: e.target.value }))}
                      placeholder="e.g., Product Manager"
                      disabled={!canEditOwnProfile}
                    />
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-1.5">
                      <Label htmlFor="department">Department</Label>
                      <InfoTooltip text="The department or team you belong to" />
                    </div>
                    <Input
                      id="department"
                      value={settings.department}
                      onChange={(e) => setSettings(prev => ({ ...prev, department: e.target.value }))}
                      placeholder="e.g., Engineering"
                      disabled={!canEditOwnProfile}
                    />
                  </div>
                </div>

                <Separator />

                <div className="space-y-6">
                  <div className="space-y-2">
                    <div className="flex items-center gap-1.5">
                      <Label htmlFor="description">About You</Label>
                      <InfoTooltip text="A short bio visible on your profile" />
                    </div>
                    <textarea
                      id="description"
                      value={settings.description || ""}
                      onChange={(e) => setSettings(prev => ({ ...prev, description: e.target.value }))}
                      placeholder="Tell your team about yourself, your experience, and what you're working on..."
                      className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                      rows={3}
                      disabled={!canEditOwnProfile}
                    />
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-1.5">
                      <Label htmlFor="skills">Skills</Label>
                      <InfoTooltip text="Comma-separated list of your skills. Used by the AI to suggest task assignments." />
                    </div>
                    <Input
                      id="skills"
                      value={Array.isArray(settings.skills) ? settings.skills.join(", ") : (settings.skills || "")}
                      onChange={(e) => setSettings(prev => ({ ...prev, skills: e.target.value.split(",").map(s => s.trim()).filter(Boolean) }))}
                      placeholder="e.g. React, Project Management, UX Design"
                      disabled={!canEditOwnProfile}
                    />
                    <p className="text-xs text-muted-foreground">Comma-separated list of your skills</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </TabsContent>

          {/* Notifications Tab */}
          <TabsContent value="notifications">
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
              <div className="border border-border bg-card rounded-lg p-6 space-y-4">
                <div>
                  <h2 className="text-lg font-semibold text-foreground">Notification Preferences</h2>
                  <p className="text-sm text-muted-foreground">Choose what notifications you want to receive</p>
                </div>

                <div className="space-y-4">
                  {[
                    { id: 'email_notifications', label: 'Email Notifications', desc: 'Receive email notifications for updates', tooltip: 'Receive email alerts for important updates' },
                    { id: 'task_assignments',    label: 'Task Assignments',    desc: 'Get notified when tasks are assigned to you', tooltip: 'Get notified when someone assigns a task to you' },
                    { id: 'mentions',            label: 'Mentions',            desc: 'Get notified when someone mentions you', tooltip: 'Get notified when someone @mentions you in a comment' },
                    { id: 'due_date_reminders',  label: 'Due Date Reminders',  desc: 'Receive reminders for upcoming due dates', tooltip: 'Reminders before a task\'s due date' },
                    { id: 'sprint_updates',      label: 'Sprint Updates',      desc: 'Get notified about sprint changes and updates', tooltip: 'Notifications about sprint starts, ends, and status changes' },
                    { id: 'daily_digest',        label: 'Daily Digest',        desc: 'Receive a daily summary of your tasks', tooltip: 'A daily summary email of all activity across your boards' },
                  ].map((item, i) => (
                    <React.Fragment key={item.id}>
                      {i > 0 && <Separator />}
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="flex items-center gap-1.5">
                            <Label htmlFor={item.id} className="text-base text-foreground">{item.label}</Label>
                            <InfoTooltip text={item.tooltip} />
                          </div>
                          <p className="text-sm text-muted-foreground">{item.desc}</p>
                        </div>
                        <Switch
                          id={item.id}
                          checked={settings[item.id]}
                          onCheckedChange={(checked) => setSettings(prev => ({ ...prev, [item.id]: checked }))}
                        />
                      </div>
                    </React.Fragment>
                  ))}
                </div>
              </div>
            </motion.div>
          </TabsContent>

          {/* Preferences Tab */}
          <TabsContent value="preferences">
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
              <div className="border border-border bg-card rounded-lg p-6 space-y-4">
                <div>
                  <h2 className="text-lg font-semibold text-foreground">Display Preferences</h2>
                  <p className="text-sm text-muted-foreground">Customize how the application looks and feels</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <div className="flex items-center gap-1.5">
                      <Label htmlFor="theme">Theme</Label>
                      <InfoTooltip text="Choose light, dark, or auto (follows your system setting)" />
                    </div>
                    <Select value={settings.theme} onValueChange={handleThemeChange}>
                      <SelectTrigger id="theme">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="light">Light</SelectItem>
                        <SelectItem value="dark">Dark</SelectItem>
                        <SelectItem value="auto">Auto (System)</SelectItem>
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-muted-foreground">Theme changes apply immediately</p>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-1.5">
                      <Label htmlFor="timezone">Timezone</Label>
                      <InfoTooltip text="Used for calendar events and due date calculations" />
                    </div>
                    <Select
                      value={settings.timezone}
                      onValueChange={(value) => setSettings(prev => ({ ...prev, timezone: value }))}
                    >
                      <SelectTrigger id="timezone">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="UTC">UTC</SelectItem>
                        <SelectItem value="America/New_York">Eastern Time</SelectItem>
                        <SelectItem value="America/Chicago">Central Time</SelectItem>
                        <SelectItem value="America/Los_Angeles">Pacific Time</SelectItem>
                        <SelectItem value="Europe/London">London</SelectItem>
                        <SelectItem value="Europe/Paris">Paris</SelectItem>
                        <SelectItem value="Asia/Tokyo">Tokyo</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-1.5">
                      <Label htmlFor="date_format">Date Format</Label>
                      <InfoTooltip text="How dates appear throughout the app (e.g., 03/27/2026 vs 27 Mar 2026)" />
                    </div>
                    <Select
                      value={settings.date_format}
                      onValueChange={(value) => setSettings(prev => ({ ...prev, date_format: value }))}
                    >
                      <SelectTrigger id="date_format">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="MM/DD/YYYY">MM/DD/YYYY</SelectItem>
                        <SelectItem value="DD/MM/YYYY">DD/MM/YYYY</SelectItem>
                        <SelectItem value="YYYY-MM-DD">YYYY-MM-DD</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-1.5">
                      <Label htmlFor="week_start">Week Starts On</Label>
                      <InfoTooltip text="Sets whether your calendar starts on Sunday or Monday" />
                    </div>
                    <Select
                      value={settings.week_start}
                      onValueChange={(value) => setSettings(prev => ({ ...prev, week_start: value }))}
                    >
                      <SelectTrigger id="week_start">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="sunday">Sunday</SelectItem>
                        <SelectItem value="monday">Monday</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </motion.div>
          </TabsContent>

          {/* Privacy Tab */}
          <TabsContent value="privacy">
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
              <div className="border border-border bg-card rounded-lg p-6 space-y-4">
                <div>
                  <h2 className="text-lg font-semibold text-foreground">Privacy & Security</h2>
                  <p className="text-sm text-muted-foreground">Manage your privacy and security settings</p>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-1.5">
                      <Label htmlFor="profile_visibility">Profile Visibility</Label>
                      <InfoTooltip text="Public = visible to everyone. Team = visible to your team only. Private = visible only to you and admins." />
                    </div>
                    <Select
                      value={settings.profile_visibility}
                      onValueChange={(value) => setSettings(prev => ({ ...prev, profile_visibility: value }))}
                    >
                      <SelectTrigger id="profile_visibility">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="public">Public - Anyone can see</SelectItem>
                        <SelectItem value="team">Team Only - Only team members</SelectItem>
                        <SelectItem value="private">Private - Only me</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-1.5">
                        <Label htmlFor="show_email" className="text-base text-foreground">Show Email Address</Label>
                        <InfoTooltip text="Whether your email address is visible to other team members" />
                      </div>
                      <p className="text-sm text-muted-foreground">Allow others to see your email address</p>
                    </div>
                    <Switch
                      id="show_email"
                      checked={settings.show_email}
                      onCheckedChange={(checked) => setSettings(prev => ({ ...prev, show_email: checked }))}
                    />
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-1.5">
                        <Label htmlFor="activity_tracking" className="text-base text-foreground">Activity Tracking</Label>
                        <InfoTooltip text="Allow the platform to track your activity for analytics and daily digest features" />
                      </div>
                      <p className="text-sm text-muted-foreground">Allow tracking of your activity for analytics</p>
                    </div>
                    <Switch
                      id="activity_tracking"
                      checked={settings.activity_tracking}
                      onCheckedChange={(checked) => setSettings(prev => ({ ...prev, activity_tracking: checked }))}
                    />
                  </div>
                </div>

                <Separator />

                <div className="border border-red-200 bg-red-50 dark:bg-red-950 dark:border-red-800 rounded-lg p-4">
                  <h3 className="text-red-900 dark:text-red-300 font-semibold mb-2">Danger Zone</h3>
                  <p className="text-sm text-red-700 dark:text-red-400 mb-4">These actions cannot be undone</p>
                  <Button
                    variant="destructive"
                    onClick={handleLogout}
                    className="flex items-center gap-2"
                  >
                    <LogOut className="w-4 h-4" />
                    Log Out
                  </Button>
                </div>
              </div>
            </motion.div>
          </TabsContent>
        </Tabs>

        {/* Save Button */}
        <div className="fixed bottom-6 right-6 z-50">
          <Button
            onClick={handleSaveSettings}
            disabled={isSaving || !canEditOwnProfile}
            variant={saveSuccess ? "default" : "default"}
            className="rounded-full h-14 px-8 shadow-sm font-medium"
          >
            {isSaving ? (
              <>
                <div className="w-4 h-4 border-2 border-background border-t-transparent rounded-full animate-spin mr-2" />
                Saving...
              </>
            ) : saveSuccess ? (
              <>
                <CheckCircle2 className="w-5 h-5 mr-2" />
                Saved!
              </>
            ) : (
              <>
                <Save className="w-5 h-5 mr-2" />
                Save Changes
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
