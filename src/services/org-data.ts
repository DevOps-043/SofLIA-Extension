/**
 * Organization Data Service
 *
 * Bridges SOFIA (organizations, members, roles) with LIA (conversations, folders).
 * - Reads org data from SOFIA Supabase (sofiaSupa)
 * - Manages shared folders in LIA Supabase (supabase)
 * - Syncs org memberships to LIA's user_organizations table for RLS
 */

import { sofiaSupa, SofiaOrganizationUser } from '../lib/sofia-client';
import { supabase } from '../lib/supabase';

// ============================================
// Types
// ============================================

export interface OrgMember {
  id: string;
  user_id: string;
  organization_id: string;
  role: 'owner' | 'admin' | 'member';
  status: string;
  job_title?: string;
  team_id?: string;
  user?: {
    id: string;
    username: string;
    email: string;
    first_name?: string;
    last_name?: string;
    display_name?: string;
    profile_picture_url?: string;
  };
}

export interface SharedFolder {
  id: string;
  user_id: string;
  name: string;
  description?: string;
  organization_id: string;
  is_shared: boolean;
  shared_by?: string;
  created_at?: string;
  updated_at?: string;
}

// ============================================
// Helpers
// ============================================

/** Check if user is admin or owner in a given org */
export function isOrgAdmin(
  memberships: SofiaOrganizationUser[],
  orgId: string
): boolean {
  const membership = memberships.find(m => m.organization_id === orgId);
  return membership?.role === 'owner' || membership?.role === 'admin';
}

// ============================================
// SOFIA Queries (read-only from SOFIA Supabase)
// ============================================

/** Fetch active members of an organization with user details */
export async function getOrgMembers(organizationId: string): Promise<OrgMember[]> {
  if (!sofiaSupa) return [];

  try {
    const { data, error } = await sofiaSupa
      .from('organization_users')
      .select(`
        id,
        user_id,
        organization_id,
        role,
        status,
        job_title,
        team_id,
        users (
          id,
          username,
          email,
          first_name,
          last_name,
          display_name,
          profile_picture_url
        )
      `)
      .eq('organization_id', organizationId)
      .eq('status', 'active');

    if (error) {
      console.error('org-data: Error fetching org members:', error);
      return [];
    }

    return (data || []).map((m: any) => ({
      id: m.id,
      user_id: m.user_id,
      organization_id: m.organization_id,
      role: m.role,
      status: m.status,
      job_title: m.job_title,
      team_id: m.team_id,
      user: m.users || undefined,
    }));
  } catch (err) {
    console.error('org-data: Exception fetching org members:', err);
    return [];
  }
}

// ============================================
// LIA Queries (user_organizations sync + shared folders)
// ============================================

/**
 * Sync user's SOFIA org memberships to LIA's user_organizations table.
 * Called on every login/session restore so RLS policies work.
 */
export async function syncUserOrganizations(
  liaUserId: string,
  memberships: SofiaOrganizationUser[]
): Promise<void> {
  if (!liaUserId || !memberships.length) return;

  try {
    // Build upsert rows
    const rows = memberships
      .filter(m => m.status === 'active')
      .map(m => ({
        user_id: liaUserId,
        organization_id: m.organization_id,
        role: m.role,
        synced_at: new Date().toISOString(),
      }));

    if (rows.length === 0) return;

    const { error } = await supabase
      .from('user_organizations')
      .upsert(rows, { onConflict: 'user_id,organization_id' });

    if (error) {
      console.error('org-data: Error syncing user_organizations:', error);
    } else {
      console.log(`org-data: Synced ${rows.length} org memberships for user`);
    }

    // Clean up stale memberships (orgs user is no longer part of)
    const activeOrgIds = rows.map(r => r.organization_id);
    const { error: cleanError } = await supabase
      .from('user_organizations')
      .delete()
      .eq('user_id', liaUserId)
      .not('organization_id', 'in', `(${activeOrgIds.join(',')})`);

    if (cleanError) {
      console.warn('org-data: Error cleaning stale org memberships:', cleanError);
    }
  } catch (err) {
    console.error('org-data: Exception syncing user_organizations:', err);
  }
}

/**
 * Create a shared folder for the organization.
 * Only admins/owners should call this (enforced in UI).
 */
export async function createSharedFolder(
  userId: string,
  organizationId: string,
  name: string,
  description?: string
): Promise<SharedFolder | null> {
  try {
    const { data, error } = await supabase
      .from('folders')
      .insert({
        user_id: userId,
        name,
        description: description || null,
        organization_id: organizationId,
        is_shared: true,
        shared_by: userId,
      })
      .select()
      .single();

    if (error) {
      console.error('org-data: Error creating shared folder:', error);
      return null;
    }

    return data as SharedFolder;
  } catch (err) {
    console.error('org-data: Exception creating shared folder:', err);
    return null;
  }
}

/**
 * Share an existing personal folder with the organization.
 * Only the folder owner (who is admin/owner) can do this.
 */
export async function shareExistingFolder(
  folderId: string,
  organizationId: string,
  sharedByUserId: string
): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('folders')
      .update({
        organization_id: organizationId,
        is_shared: true,
        shared_by: sharedByUserId,
      })
      .eq('id', folderId);

    if (error) {
      console.error('org-data: Error sharing folder:', error);
      return false;
    }

    return true;
  } catch (err) {
    console.error('org-data: Exception sharing folder:', err);
    return false;
  }
}

/**
 * Unshare a folder (make it personal again).
 * Only the folder owner can do this.
 */
export async function unshareFolder(folderId: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('folders')
      .update({
        organization_id: null,
        is_shared: false,
        shared_by: null,
      })
      .eq('id', folderId);

    if (error) {
      console.error('org-data: Error unsharing folder:', error);
      return false;
    }

    return true;
  } catch (err) {
    console.error('org-data: Exception unsharing folder:', err);
    return false;
  }
}

/**
 * Get all shared folders for an organization.
 * RLS handles access control (user must be in user_organizations).
 */
export async function getSharedFolders(organizationId: string): Promise<SharedFolder[]> {
  try {
    const { data, error } = await supabase
      .from('folders')
      .select('*')
      .eq('organization_id', organizationId)
      .eq('is_shared', true)
      .order('created_at', { ascending: true });

    if (error) {
      console.error('org-data: Error fetching shared folders:', error);
      return [];
    }

    return (data || []) as SharedFolder[];
  } catch (err) {
    console.error('org-data: Exception fetching shared folders:', err);
    return [];
  }
}
