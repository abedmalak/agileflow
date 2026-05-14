# AgileFlow Production Deployment Checklist

This document lists everything **you** need to do manually to get AgileFlow working in production. These are steps that cannot be automated from code alone.

---

## 1. Supabase Project Setup

### 1.1 Create Project
- [ ] Go to [supabase.com](https://supabase.com) and create a free project
- [ ] Note your **Project URL** and **Anon Key** from Settings > API

### 1.2 Run Database Schema
- [ ] Go to SQL Editor in your Supabase Dashboard
- [ ] Paste and run the contents of `supabase/schema.sql`
- [ ] Verify all tables were created: `profiles`, `boards`, `items`, `calendar_events`, `user_stories`, `sprints`, `notifications`, `team_members`
- [ ] Verify RLS policies are enabled (check each table in Table Editor > Policies)
- [ ] Verify the `handle_new_user` trigger was created (Database > Triggers)

### 1.3 Enable Email Auth
- [ ] Go to Authentication > Providers > Email
- [ ] Ensure "Enable Email Signup" is ON
- [ ] Optionally disable "Confirm Email" for dev/testing (keep it ON for production)

---

## 2. Google OAuth Setup

### 2.1 Google Cloud Console
- [ ] Go to [console.cloud.google.com](https://console.cloud.google.com)
- [ ] Create a new project (or use existing)
- [ ] Go to APIs & Services > Credentials
- [ ] Click "Create Credentials" > "OAuth 2.0 Client ID"
- [ ] Application type: **Web application**
- [ ] Add Authorized redirect URI: `https://<YOUR_SUPABASE_PROJECT_REF>.supabase.co/auth/v1/callback`
  - Find your project ref in Supabase > Settings > General
- [ ] Copy the **Client ID** and **Client Secret**

### 2.2 Supabase Configuration
- [ ] Go to Supabase Dashboard > Authentication > Providers > Google
- [ ] Toggle Google provider ON
- [ ] Paste your Google **Client ID** and **Client Secret**
- [ ] Save

---

## 3. GitHub OAuth Setup

### 3.1 GitHub Developer Settings
- [ ] Go to [github.com/settings/developers](https://github.com/settings/developers)
- [ ] Click "New OAuth App"
- [ ] Set Homepage URL to your app URL (e.g., `https://your-app.vercel.app`)
- [ ] Set Authorization callback URL to: `https://<YOUR_SUPABASE_PROJECT_REF>.supabase.co/auth/v1/callback`
- [ ] Copy the **Client ID** and **Client Secret**

### 3.2 Supabase Configuration
- [ ] Go to Supabase Dashboard > Authentication > Providers > GitHub
- [ ] Toggle GitHub provider ON
- [ ] Paste your GitHub **Client ID** and **Client Secret**
- [ ] Save

---

## 4. Supabase Auth URLs

### 4.1 Configure Redirect URLs
- [ ] Go to Supabase Dashboard > Authentication > URL Configuration
- [ ] Set **Site URL** to: `https://agileflow-one.vercel.app`
- [ ] Add **Redirect URLs** (all of these must be in the allowlist):
  - `https://agileflow-one.vercel.app/`
  - `https://agileflow-one.vercel.app/login`
  - `https://agileflow-one.vercel.app/login?verified=true`
  - `https://agileflow-one.vercel.app/login?reset=true`
  - `http://localhost:5173/`
  - `http://localhost:5173/login`
  - `http://localhost:5173/login?verified=true`
  - `http://localhost:5173/login?reset=true`

---

## 5. OpenRouter AI Setup

### 5.1 Get API Key
- [ ] Go to [openrouter.ai](https://openrouter.ai)
- [ ] Create an account and generate an API key
- [ ] **Important**: The API key is exposed client-side (via `VITE_` prefix). For production:
  - Option A: Use free-tier models only and set usage limits in OpenRouter dashboard
  - Option B (Recommended): Create a Supabase Edge Function to proxy LLM calls server-side

### 5.2 Set Usage Limits (if using client-side key)
- [ ] Go to OpenRouter Dashboard > Settings
- [ ] Set a monthly spending limit (e.g., $5/month) to prevent abuse
- [ ] Enable rate limiting per IP if available

---

## 6. Environment Variables

### 6.1 Local Development (.env.local)
Create `.env.local` in the project root:
```
VITE_SUPABASE_URL=https://<your-project-ref>.supabase.co
VITE_SUPABASE_ANON_KEY=<your-anon-key>
VITE_OPENROUTER_API_KEY=<your-openrouter-api-key>
VITE_APP_URL=https://agileflow-one.vercel.app
```

### 6.2 Vercel Production
- [ ] Go to your Vercel project > Settings > Environment Variables
- [ ] Add the same four variables for the **Production** environment
- [ ] Redeploy after adding variables
- [ ] Set `VITE_APP_URL` to your public production domain so auth emails never use a preview/protected Vercel URL

---

## 7. Vercel Deployment

### 7.1 Connect Repository
- [ ] Go to [vercel.com](https://vercel.com) and import the `abedmalak/agileflow` repo
- [ ] Framework: Vite (auto-detected)
- [ ] Build command: `npm run build` (auto-detected)
- [ ] Output directory: `dist` (auto-detected)

### 7.2 Custom Domain (Optional)
- [ ] Go to Vercel project > Settings > Domains
- [ ] Add your custom domain
- [ ] Update Supabase redirect URLs to include your custom domain

---

## 8. Post-Deployment Verification

### 8.1 Auth Flow
- [ ] Test email/password signup (first user gets admin role)
- [ ] Test email/password login
- [ ] Test Google OAuth login
- [ ] Test GitHub OAuth login
- [ ] Test password reset flow (check email delivery)
- [ ] Verify first user has admin role in Supabase > Table Editor > profiles

### 8.2 Core Features
- [ ] Create a board and add tasks
- [ ] Test drag-and-drop in Kanban view
- [ ] Test calendar event creation
- [ ] Test backlog story creation
- [ ] Test AI Assistant (should respond with project context)
- [ ] Test global search (Cmd+K)
- [ ] Test notifications
- [ ] Test settings save (theme, preferences)

### 8.3 Admin Panel
- [ ] Navigate to /Admin (only visible for admin role users)
- [ ] Verify user list loads
- [ ] Test role change for another user

### 8.4 Dark Mode
- [ ] Toggle dark mode in Settings > Preferences
- [ ] Verify all pages render correctly in dark mode

---

## 9. Known Limitations & Future Work

### Client-Side API Key
The OpenRouter API key is exposed in the browser bundle. For a real production app, proxy through Supabase Edge Functions:
```sql
-- Example: Create an edge function at /functions/v1/ai
-- that forwards requests to OpenRouter with the key server-side
```

### Email Delivery
Supabase free tier uses their built-in email service which has rate limits. For production:
- [ ] Consider setting up a custom SMTP provider (Resend, SendGrid, etc.)
- [ ] Go to Supabase > Settings > Auth > SMTP Settings to configure

### Rate Limiting
There's no application-level rate limiting. Consider:
- [ ] Enabling Supabase rate limiting in project settings
- [ ] Adding a CDN/WAF (Cloudflare) in front of your app

---

## Quick Reference

| Service | Dashboard URL |
|---------|--------------|
| Supabase | https://supabase.com/dashboard |
| Vercel | https://vercel.com/dashboard |
| OpenRouter | https://openrouter.ai/dashboard |
| Google Cloud | https://console.cloud.google.com |
| GitHub OAuth | https://github.com/settings/developers |
