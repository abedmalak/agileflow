-- Fix infinite recursion in RLS policies
-- The boards and team_members policies reference each other, causing infinite loops.
-- This script creates SECURITY DEFINER helper functions that bypass RLS for cross-table checks.
-- Run this in Supabase SQL Editor.

-- ============================================================
-- HELPER FUNCTIONS (bypass RLS for cross-table lookups)
-- ============================================================

-- Check if a user is the owner of a board (bypasses RLS on boards)
CREATE OR REPLACE FUNCTION public.is_board_owner(board_id UUID, user_id UUID)
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.boards b
    WHERE b.id = board_id AND b.user_id = user_id
  );
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- Get all board IDs a user owns (bypasses RLS on boards)
CREATE OR REPLACE FUNCTION public.get_owned_board_ids(uid UUID)
RETURNS SETOF UUID AS $$
  SELECT id FROM public.boards WHERE user_id = uid;
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- Get all board IDs a user is a team member of (bypasses RLS on team_members)
CREATE OR REPLACE FUNCTION public.get_team_board_ids(uid UUID)
RETURNS SETOF UUID AS $$
  SELECT board_id FROM public.team_members WHERE user_id = uid;
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- Get team member role for a specific board (bypasses RLS on team_members)
CREATE OR REPLACE FUNCTION public.get_team_role(bid UUID, uid UUID)
RETURNS TEXT AS $$
  SELECT role FROM public.team_members WHERE board_id = bid AND user_id = uid LIMIT 1;
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- Check if user can access a board (owner OR team member)
CREATE OR REPLACE FUNCTION public.can_access_board(bid UUID, uid UUID)
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.boards WHERE id = bid AND user_id = uid
  ) OR EXISTS (
    SELECT 1 FROM public.team_members WHERE board_id = bid AND user_id = uid
  );
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- Check if user can edit a board (owner OR editor/owner role in team)
CREATE OR REPLACE FUNCTION public.can_edit_board(bid UUID, uid UUID)
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.boards WHERE id = bid AND user_id = uid
  ) OR EXISTS (
    SELECT 1 FROM public.team_members WHERE board_id = bid AND user_id = uid AND role IN ('owner', 'editor')
  );
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- ============================================================
-- DROP OLD POLICIES (the ones causing recursion)
-- ============================================================

-- Boards
DROP POLICY IF EXISTS "Users can view own boards" ON public.boards;
DROP POLICY IF EXISTS "Users can create boards" ON public.boards;
DROP POLICY IF EXISTS "Users can update own boards" ON public.boards;
DROP POLICY IF EXISTS "Users can delete own boards" ON public.boards;

-- Items
DROP POLICY IF EXISTS "Users can view items on accessible boards" ON public.items;
DROP POLICY IF EXISTS "Users can create items on accessible boards" ON public.items;
DROP POLICY IF EXISTS "Users can update items on accessible boards" ON public.items;
DROP POLICY IF EXISTS "Users can delete items on accessible boards" ON public.items;

-- Team Members
DROP POLICY IF EXISTS "Team members can view board teams" ON public.team_members;
DROP POLICY IF EXISTS "Board owners can manage team members" ON public.team_members;
DROP POLICY IF EXISTS "Board owners can update team members" ON public.team_members;
DROP POLICY IF EXISTS "Board owners can delete team members" ON public.team_members;

-- ============================================================
-- NEW POLICIES (no recursion — use helper functions)
-- ============================================================

-- Boards: user owns it OR is a team member
CREATE POLICY "boards_select" ON public.boards FOR SELECT USING (
  auth.uid() = user_id OR id IN (SELECT public.get_team_board_ids(auth.uid()))
);
CREATE POLICY "boards_insert" ON public.boards FOR INSERT WITH CHECK (
  auth.uid() = user_id
);
CREATE POLICY "boards_update" ON public.boards FOR UPDATE USING (
  auth.uid() = user_id OR public.get_team_role(id, auth.uid()) IN ('owner', 'editor')
);
CREATE POLICY "boards_delete" ON public.boards FOR DELETE USING (
  auth.uid() = user_id
);

-- Items: user has access to the parent board
CREATE POLICY "items_select" ON public.items FOR SELECT USING (
  public.can_access_board(board_id, auth.uid())
);
CREATE POLICY "items_insert" ON public.items FOR INSERT WITH CHECK (
  public.can_edit_board(board_id, auth.uid())
);
CREATE POLICY "items_update" ON public.items FOR UPDATE USING (
  public.can_edit_board(board_id, auth.uid())
);
CREATE POLICY "items_delete" ON public.items FOR DELETE USING (
  public.can_edit_board(board_id, auth.uid())
);

-- Team Members: user is on the team OR owns the board
CREATE POLICY "team_members_select" ON public.team_members FOR SELECT USING (
  user_id = auth.uid() OR public.is_board_owner(board_id, auth.uid())
);
CREATE POLICY "team_members_insert" ON public.team_members FOR INSERT WITH CHECK (
  public.is_board_owner(board_id, auth.uid())
);
CREATE POLICY "team_members_update" ON public.team_members FOR UPDATE USING (
  public.is_board_owner(board_id, auth.uid())
);
CREATE POLICY "team_members_delete" ON public.team_members FOR DELETE USING (
  public.is_board_owner(board_id, auth.uid())
);
