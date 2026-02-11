import { createClient } from '@supabase/supabase-js';
import { IRIS_SUPABASE } from '../config';

// Chrome Extension storage adapter (shared pattern)
const chromeStorageAdapter = {
  getItem: async (key: string): Promise<string | null> => {
    return new Promise((resolve) => {
      if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local) {
        chrome.storage.local.get([key], (result) => {
          resolve(result[key] || null);
        });
      } else {
        resolve(localStorage.getItem(key));
      }
    });
  },
  setItem: async (key: string, value: string): Promise<void> => {
    return new Promise((resolve) => {
      if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local) {
        chrome.storage.local.set({ [key]: value }, () => resolve());
      } else {
        localStorage.setItem(key, value);
        resolve();
      }
    });
  },
  removeItem: async (key: string): Promise<void> => {
    return new Promise((resolve) => {
      if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local) {
        chrome.storage.local.remove([key], () => resolve());
      } else {
        localStorage.removeItem(key);
        resolve();
      }
    });
  },
};

// Validate URL helper
const isValidUrl = (url: string) => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

// IRIS Supabase Client
const irisUrl = isValidUrl(IRIS_SUPABASE.URL) ? IRIS_SUPABASE.URL : '';
const irisKey = IRIS_SUPABASE.ANON_KEY || '';

export const irisSupa = irisUrl && irisKey
  ? createClient(irisUrl, irisKey, {
      auth: {
        storage: chromeStorageAdapter,
        storageKey: 'iris-auth-token',
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: false,
      },
    })
  : null;

// Helper to check if IRIS is configured
export const isIrisConfigured = () => {
  return (
    IRIS_SUPABASE.URL !== '' &&
    IRIS_SUPABASE.ANON_KEY !== '' &&
    isValidUrl(IRIS_SUPABASE.URL)
  );
};

// ============================================
// IRIS Types (based on IRIS.sql schema)
// ============================================

export interface IrisTeam {
  team_id: string;
  name: string;
  slug: string;
  description?: string;
  avatar_url?: string;
  color?: string;
  status: 'active' | 'archived' | 'suspended';
  visibility: 'public' | 'private' | 'internal';
  owner_id: string;
  max_members?: number;
  settings?: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface IrisTeamMember {
  member_id: string;
  team_id: string;
  user_id: string;
  role: 'owner' | 'admin' | 'moderator' | 'member' | 'viewer';
  joined_at: string;
  invited_by?: string;
  is_active: boolean;
  last_activity_at?: string;
  created_at: string;
  updated_at: string;
}

export interface IrisProject {
  project_id: string;
  project_key: string;
  project_name: string;
  project_description?: string;
  icon_name?: string;
  icon_color?: string;
  cover_image_url?: string;
  project_status: 'planning' | 'active' | 'on_hold' | 'completed' | 'cancelled' | 'archived';
  health_status: 'on_track' | 'at_risk' | 'off_track' | 'none';
  priority_level: 'urgent' | 'high' | 'medium' | 'low' | 'none';
  completion_percentage: number;
  start_date?: string;
  target_date?: string;
  actual_end_date?: string;
  team_id?: string;
  lead_user_id?: string;
  created_by_user_id: string;
  is_public: boolean;
  is_template: boolean;
  metadata?: Record<string, any>;
  tags?: string[];
  created_at: string;
  updated_at: string;
  archived_at?: string;
}

export interface IrisProjectMember {
  member_id: string;
  project_id: string;
  user_id: string;
  project_role: 'owner' | 'admin' | 'member' | 'viewer' | 'guest';
  can_edit: boolean;
  can_delete: boolean;
  can_manage_members: boolean;
  can_manage_settings: boolean;
  notification_preference?: 'all' | 'mentions' | 'important' | 'none';
  joined_at: string;
  invited_by_user_id?: string;
}

export interface IrisMilestone {
  milestone_id: string;
  project_id: string;
  milestone_name: string;
  milestone_description?: string;
  milestone_status: 'pending' | 'in_progress' | 'completed' | 'missed' | 'cancelled';
  target_date: string;
  completed_date?: string;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface IrisIssue {
  issue_id: string;
  team_id: string;
  issue_number: number;
  title: string;
  description?: string;
  description_html?: string;
  status_id: string;
  priority_id?: string;
  project_id?: string;
  cycle_id?: string;
  parent_issue_id?: string;
  assignee_id?: string;
  creator_id: string;
  due_date?: string;
  started_at?: string;
  completed_at?: string;
  cancelled_at?: string;
  estimate_points?: number;
  estimate_hours?: number;
  time_spent_minutes?: number;
  sort_order?: number;
  url_slug?: string;
  external_links?: any[];
  created_at: string;
  updated_at: string;
  archived_at?: string;
  // Joined fields
  status?: IrisStatus;
  priority?: IrisPriority;
}

export interface IrisIssueComment {
  comment_id: string;
  issue_id: string;
  parent_comment_id?: string;
  body: string;
  body_html?: string;
  author_id: string;
  reactions?: Record<string, any>;
  edited_at?: string;
  created_at: string;
  updated_at: string;
  deleted_at?: string;
}

export interface IrisCycle {
  cycle_id: string;
  team_id: string;
  name: string;
  description?: string;
  number?: number;
  start_date: string;
  end_date: string;
  status: 'upcoming' | 'current' | 'completed';
  scope_total?: number;
  scope_completed?: number;
  created_by?: string;
  created_at: string;
  updated_at: string;
}

export interface IrisLabel {
  label_id: string;
  team_id: string;
  name: string;
  description?: string;
  color: string;
  created_by?: string;
  created_at: string;
  updated_at: string;
}

export interface IrisPriority {
  priority_id: string;
  name: string;
  level: number;
  color: string;
  icon?: string;
  created_at: string;
}

export interface IrisStatus {
  status_id: string;
  team_id: string;
  name: string;
  description?: string;
  color?: string;
  icon?: string;
  status_type: 'backlog' | 'todo' | 'in_progress' | 'in_review' | 'done' | 'cancelled';
  position: number;
  is_default: boolean;
  is_closed: boolean;
  created_at: string;
  updated_at: string;
}

export interface IrisProjectUpdate {
  update_id: string;
  project_id: string;
  author_user_id: string;
  update_title?: string;
  update_content: string;
  update_type: 'general' | 'status' | 'milestone' | 'blocker' | 'decision' | 'celebration';
  health_status_snapshot?: string;
  completion_percentage_snapshot?: number;
  is_pinned: boolean;
  created_at: string;
  updated_at: string;
  edited_at?: string;
}

export interface IrisNotification {
  notification_id: string;
  recipient_id: string;
  actor_id?: string;
  title: string;
  message?: string;
  type?: string;
  category?: string;
  entity_id?: string;
  link?: string;
  is_read: boolean;
  read_at?: string;
  created_at: string;
}

export interface IrisAccountUser {
  user_id: string;
  first_name: string;
  last_name_paternal: string;
  last_name_maternal?: string;
  display_name?: string;
  username: string;
  email: string;
  permission_level: 'super_admin' | 'admin' | 'manager' | 'user' | 'viewer' | 'guest';
  company_role?: string;
  department?: string;
  account_status: 'active' | 'inactive' | 'suspended' | 'pending_verification' | 'deleted';
  avatar_url?: string;
  phone_number?: string;
  timezone?: string;
  locale?: string;
  last_login_at?: string;
  last_activity_at?: string;
  created_at: string;
  updated_at: string;
}
