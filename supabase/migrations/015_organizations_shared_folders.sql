-- =============================================
-- Migration: Organization Shared Folders Support
-- =============================================
-- Adds organization awareness to LIA Supabase so that
-- users in the same org (from SOFIA) can share folders and chats.

-- 1. Bridge table: maps LIA auth.users to SOFIA organization IDs
-- Synced on every login from SOFIA context
CREATE TABLE IF NOT EXISTS public.user_organizations (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  organization_id text NOT NULL,
  role text DEFAULT 'member' CHECK (role IN ('owner', 'admin', 'member')),
  synced_at timestamptz DEFAULT now(),
  UNIQUE(user_id, organization_id)
);

ALTER TABLE public.user_organizations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage own org mappings"
  ON public.user_organizations FOR ALL
  USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_user_organizations_user ON public.user_organizations(user_id);
CREATE INDEX IF NOT EXISTS idx_user_organizations_org ON public.user_organizations(organization_id);

-- 2. Add organization columns to folders
ALTER TABLE public.folders
  ADD COLUMN IF NOT EXISTS organization_id text,
  ADD COLUMN IF NOT EXISTS is_shared boolean DEFAULT false,
  ADD COLUMN IF NOT EXISTS shared_by text;

CREATE INDEX IF NOT EXISTS idx_folders_org_shared ON public.folders(organization_id, is_shared)
  WHERE is_shared = true;

-- 3. Update RLS on folders: allow viewing shared org folders
DROP POLICY IF EXISTS "Users can view own folders" ON public.folders;

CREATE POLICY "Users can view own and shared folders"
  ON public.folders FOR SELECT
  USING (
    auth.uid() = user_id
    OR (
      is_shared = true
      AND organization_id IN (
        SELECT organization_id FROM public.user_organizations
        WHERE user_id = auth.uid()
      )
    )
  );

-- INSERT/UPDATE/DELETE remain owner-only (existing policies stay)

-- 4. Update RLS on conversations: allow reading chats in shared folders
DROP POLICY IF EXISTS "Users can CRUD only their own conversations" ON public.conversations;

-- SELECT: own + shared folder conversations
CREATE POLICY "Users can view own and shared conversations"
  ON public.conversations FOR SELECT
  USING (
    auth.uid() = user_id
    OR (
      folder_id IS NOT NULL
      AND folder_id IN (
        SELECT id FROM public.folders
        WHERE is_shared = true
        AND organization_id IN (
          SELECT organization_id FROM public.user_organizations
          WHERE user_id = auth.uid()
        )
      )
    )
  );

-- INSERT/UPDATE/DELETE: own only
CREATE POLICY "Users can create own conversations"
  ON public.conversations FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own conversations"
  ON public.conversations FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own conversations"
  ON public.conversations FOR DELETE
  USING (auth.uid() = user_id);

-- 5. Update RLS on messages: allow reading messages in shared conversations
DROP POLICY IF EXISTS "Users can CRUD only their own messages" ON public.messages;

-- SELECT: own + messages in shared folder conversations
CREATE POLICY "Users can view own and shared messages"
  ON public.messages FOR SELECT
  USING (
    auth.uid() = user_id
    OR (
      conversation_id IN (
        SELECT c.id FROM public.conversations c
        WHERE c.folder_id IS NOT NULL
        AND c.folder_id IN (
          SELECT f.id FROM public.folders f
          WHERE f.is_shared = true
          AND f.organization_id IN (
            SELECT uo.organization_id FROM public.user_organizations uo
            WHERE uo.user_id = auth.uid()
          )
        )
      )
    )
  );

-- INSERT/UPDATE/DELETE: own only
CREATE POLICY "Users can create own messages"
  ON public.messages FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own messages"
  ON public.messages FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own messages"
  ON public.messages FOR DELETE
  USING (auth.uid() = user_id);

-- Comments
COMMENT ON TABLE public.user_organizations IS 'Bridge table syncing SOFIA org memberships to LIA for RLS';
COMMENT ON COLUMN public.folders.organization_id IS 'SOFIA organization UUID (text, cross-DB reference)';
COMMENT ON COLUMN public.folders.is_shared IS 'Whether this folder is shared with the organization';
COMMENT ON COLUMN public.folders.shared_by IS 'SOFIA user_id of who shared this folder';
