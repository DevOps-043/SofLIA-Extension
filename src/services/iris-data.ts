/**
 * IRIS Data Service
 * Handles CRUD operations for the IRIS project management system.
 * LIA can read and write teams, projects, issues, cycles, etc.
 */

import {
  irisSupa,
  isIrisConfigured,
  IrisTeam,
  IrisProject,
  IrisProjectMember,
  IrisMilestone,
  IrisIssue,
  IrisIssueComment,
  IrisCycle,
  IrisLabel,
  IrisPriority,
  IrisStatus,
  IrisProjectUpdate,
  IrisNotification,
  IrisTeamMember,
  IrisAccountUser,
} from '../lib/iris-client';

// ==========================================
// TEAMS
// ==========================================

/** Get all teams */
export async function getTeams(): Promise<IrisTeam[]> {
  if (!irisSupa || !isIrisConfigured()) return [];
  const { data, error } = await irisSupa
    .from('teams')
    .select('*')
    .eq('status', 'active')
    .order('name');
  if (error) { console.error('IRIS: getTeams error', error); return []; }
  return data || [];
}

/** Get a team by ID */
export async function getTeamById(teamId: string): Promise<IrisTeam | null> {
  if (!irisSupa || !isIrisConfigured()) return null;
  const { data, error } = await irisSupa
    .from('teams')
    .select('*')
    .eq('team_id', teamId)
    .single();
  if (error) { console.error('IRIS: getTeamById error', error); return null; }
  return data;
}

/** Get team members */
export async function getTeamMembers(teamId: string): Promise<IrisTeamMember[]> {
  if (!irisSupa || !isIrisConfigured()) return [];
  const { data, error } = await irisSupa
    .from('team_members')
    .select('*')
    .eq('team_id', teamId)
    .eq('is_active', true);
  if (error) { console.error('IRIS: getTeamMembers error', error); return []; }
  return data || [];
}

// ==========================================
// PROJECTS
// ==========================================

/** Get projects, optionally by team */
export async function getProjects(teamId?: string): Promise<IrisProject[]> {
  if (!irisSupa || !isIrisConfigured()) return [];
  let query = irisSupa
    .from('pm_projects')
    .select('*')
    .order('updated_at', { ascending: false });
  if (teamId) query = query.eq('team_id', teamId);
  const { data, error } = await query;
  if (error) { console.error('IRIS: getProjects error', error); return []; }
  return data || [];
}

/** Get a project by ID */
export async function getProjectById(projectId: string): Promise<IrisProject | null> {
  if (!irisSupa || !isIrisConfigured()) return null;
  const { data, error } = await irisSupa
    .from('pm_projects')
    .select('*')
    .eq('project_id', projectId)
    .single();
  if (error) { console.error('IRIS: getProjectById error', error); return null; }
  return data;
}

/** Create a new project */
export async function createProject(project: Partial<IrisProject>): Promise<IrisProject | null> {
  if (!irisSupa || !isIrisConfigured()) return null;
  const { data, error } = await irisSupa
    .from('pm_projects')
    .insert(project)
    .select()
    .single();
  if (error) { console.error('IRIS: createProject error', error); return null; }
  return data;
}

/** Update a project */
export async function updateProject(projectId: string, updates: Partial<IrisProject>): Promise<IrisProject | null> {
  if (!irisSupa || !isIrisConfigured()) return null;
  const { data, error } = await irisSupa
    .from('pm_projects')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('project_id', projectId)
    .select()
    .single();
  if (error) { console.error('IRIS: updateProject error', error); return null; }
  return data;
}

/** Get project members */
export async function getProjectMembers(projectId: string): Promise<IrisProjectMember[]> {
  if (!irisSupa || !isIrisConfigured()) return [];
  const { data, error } = await irisSupa
    .from('pm_project_members')
    .select('*')
    .eq('project_id', projectId);
  if (error) { console.error('IRIS: getProjectMembers error', error); return []; }
  return data || [];
}

/** Get project updates */
export async function getProjectUpdates(projectId: string): Promise<IrisProjectUpdate[]> {
  if (!irisSupa || !isIrisConfigured()) return [];
  const { data, error } = await irisSupa
    .from('pm_project_updates')
    .select('*')
    .eq('project_id', projectId)
    .order('created_at', { ascending: false })
    .limit(10);
  if (error) { console.error('IRIS: getProjectUpdates error', error); return []; }
  return data || [];
}

// ==========================================
// MILESTONES
// ==========================================

/** Get milestones for a project */
export async function getMilestones(projectId: string): Promise<IrisMilestone[]> {
  if (!irisSupa || !isIrisConfigured()) return [];
  const { data, error } = await irisSupa
    .from('pm_milestones')
    .select('*')
    .eq('project_id', projectId)
    .order('sort_order');
  if (error) { console.error('IRIS: getMilestones error', error); return []; }
  return data || [];
}

/** Create a milestone */
export async function createMilestone(milestone: Partial<IrisMilestone>): Promise<IrisMilestone | null> {
  if (!irisSupa || !isIrisConfigured()) return null;
  const { data, error } = await irisSupa
    .from('pm_milestones')
    .insert(milestone)
    .select()
    .single();
  if (error) { console.error('IRIS: createMilestone error', error); return null; }
  return data;
}

// ==========================================
// ISSUES
// ==========================================

/** Get issues, optionally filtered by team, project, or cycle */
export async function getIssues(filters?: {
  teamId?: string;
  projectId?: string;
  cycleId?: string;
  assigneeId?: string;
  statusType?: string;
  limit?: number;
}): Promise<IrisIssue[]> {
  if (!irisSupa || !isIrisConfigured()) return [];
  let query = irisSupa
    .from('task_issues')
    .select('*, status:task_statuses(*), priority:task_priorities(*)')
    .is('archived_at', null)
    .order('updated_at', { ascending: false });

  if (filters?.teamId) query = query.eq('team_id', filters.teamId);
  if (filters?.projectId) query = query.eq('project_id', filters.projectId);
  if (filters?.cycleId) query = query.eq('cycle_id', filters.cycleId);
  if (filters?.assigneeId) query = query.eq('assignee_id', filters.assigneeId);
  if (filters?.limit) query = query.limit(filters.limit);
  else query = query.limit(50);

  const { data, error } = await query;
  if (error) { console.error('IRIS: getIssues error', error); return []; }
  return data || [];
}

/** Get a single issue by ID */
export async function getIssueById(issueId: string): Promise<IrisIssue | null> {
  if (!irisSupa || !isIrisConfigured()) return null;
  const { data, error } = await irisSupa
    .from('task_issues')
    .select('*, status:task_statuses(*), priority:task_priorities(*)')
    .eq('issue_id', issueId)
    .single();
  if (error) { console.error('IRIS: getIssueById error', error); return null; }
  return data;
}

/** Create a new issue */
export async function createIssue(issue: Partial<IrisIssue>): Promise<IrisIssue | null> {
  if (!irisSupa || !isIrisConfigured()) return null;
  const { data, error } = await irisSupa
    .from('task_issues')
    .insert(issue)
    .select()
    .single();
  if (error) { console.error('IRIS: createIssue error', error); return null; }
  return data;
}

/** Update an issue */
export async function updateIssue(issueId: string, updates: Partial<IrisIssue>): Promise<IrisIssue | null> {
  if (!irisSupa || !isIrisConfigured()) return null;
  const { data, error } = await irisSupa
    .from('task_issues')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('issue_id', issueId)
    .select()
    .single();
  if (error) { console.error('IRIS: updateIssue error', error); return null; }
  return data;
}

/** Get comments for an issue */
export async function getIssueComments(issueId: string): Promise<IrisIssueComment[]> {
  if (!irisSupa || !isIrisConfigured()) return [];
  const { data, error } = await irisSupa
    .from('task_issue_comments')
    .select('*')
    .eq('issue_id', issueId)
    .is('deleted_at', null)
    .order('created_at');
  if (error) { console.error('IRIS: getIssueComments error', error); return []; }
  return data || [];
}

/** Add a comment to an issue */
export async function addIssueComment(comment: Partial<IrisIssueComment>): Promise<IrisIssueComment | null> {
  if (!irisSupa || !isIrisConfigured()) return null;
  const { data, error } = await irisSupa
    .from('task_issue_comments')
    .insert(comment)
    .select()
    .single();
  if (error) { console.error('IRIS: addIssueComment error', error); return null; }
  return data;
}

// ==========================================
// CYCLES
// ==========================================

/** Get cycles for a team */
export async function getCycles(teamId: string): Promise<IrisCycle[]> {
  if (!irisSupa || !isIrisConfigured()) return [];
  const { data, error } = await irisSupa
    .from('task_cycles')
    .select('*')
    .eq('team_id', teamId)
    .order('start_date', { ascending: false });
  if (error) { console.error('IRIS: getCycles error', error); return []; }
  return data || [];
}

/** Create a cycle */
export async function createCycle(cycle: Partial<IrisCycle>): Promise<IrisCycle | null> {
  if (!irisSupa || !isIrisConfigured()) return null;
  const { data, error } = await irisSupa
    .from('task_cycles')
    .insert(cycle)
    .select()
    .single();
  if (error) { console.error('IRIS: createCycle error', error); return null; }
  return data;
}

// ==========================================
// LABELS, PRIORITIES, STATUSES
// ==========================================

/** Get labels for a team */
export async function getLabels(teamId: string): Promise<IrisLabel[]> {
  if (!irisSupa || !isIrisConfigured()) return [];
  const { data, error } = await irisSupa
    .from('task_labels')
    .select('*')
    .eq('team_id', teamId)
    .order('name');
  if (error) { console.error('IRIS: getLabels error', error); return []; }
  return data || [];
}

/** Get statuses for a team */
export async function getStatuses(teamId: string): Promise<IrisStatus[]> {
  if (!irisSupa || !isIrisConfigured()) return [];
  const { data, error } = await irisSupa
    .from('task_statuses')
    .select('*')
    .eq('team_id', teamId)
    .order('position');
  if (error) { console.error('IRIS: getStatuses error', error); return []; }
  return data || [];
}

/** Get all priorities */
export async function getPriorities(): Promise<IrisPriority[]> {
  if (!irisSupa || !isIrisConfigured()) return [];
  const { data, error } = await irisSupa
    .from('task_priorities')
    .select('*')
    .order('level');
  if (error) { console.error('IRIS: getPriorities error', error); return []; }
  return data || [];
}

// ==========================================
// NOTIFICATIONS
// ==========================================

/** Get unread notifications for a user */
export async function getUnreadNotifications(userId: string): Promise<IrisNotification[]> {
  if (!irisSupa || !isIrisConfigured()) return [];
  const { data, error } = await irisSupa
    .from('notifications')
    .select('*')
    .eq('recipient_id', userId)
    .eq('is_read', false)
    .order('created_at', { ascending: false })
    .limit(20);
  if (error) { console.error('IRIS: getNotifications error', error); return []; }
  return data || [];
}

// ==========================================
// USERS (Account Users)
// ==========================================

/** Get user by ID */
export async function getUserById(userId: string): Promise<IrisAccountUser | null> {
  if (!irisSupa || !isIrisConfigured()) return null;
  const { data, error } = await irisSupa
    .from('account_users')
    .select('*')
    .eq('user_id', userId)
    .single();
  if (error) { console.error('IRIS: getUserById error', error); return null; }
  return data;
}

/** Search users by name or email */
export async function searchUsers(query: string): Promise<IrisAccountUser[]> {
  if (!irisSupa || !isIrisConfigured()) return [];
  const { data, error } = await irisSupa
    .from('account_users')
    .select('user_id, first_name, last_name_paternal, last_name_maternal, display_name, username, email, avatar_url, company_role, department')
    .eq('account_status', 'active')
    .or(`first_name.ilike.%${query}%,last_name_paternal.ilike.%${query}%,username.ilike.%${query}%,email.ilike.%${query}%`)
    .limit(10);
  if (error) { console.error('IRIS: searchUsers error', error); return []; }
  return (data || []) as IrisAccountUser[];
}

// ==========================================
// CONTEXT BUILDER (for Gemini prompt injection)
// ==========================================

/**
 * Builds a context summary of the user's IRIS data for Gemini.
 * Fetches teams, recent projects, and recent issues to inject as context.
 */
export async function buildIrisContext(_userId?: string): Promise<string> {
  if (!irisSupa || !isIrisConfigured()) {
    return '';
  }

  try {
    const parts: string[] = [];
    parts.push('📋 DATOS DE IRIS (Gestión de Proyectos):');

    // Fetch teams
    const teams = await getTeams();
    if (teams.length > 0) {
      parts.push('\n## Equipos:');
      for (const team of teams.slice(0, 5)) {
        parts.push(`- **${team.name}** (${team.slug}) | Estado: ${team.status} | ID: ${team.team_id}`);
      }
    }

    // Fetch recent projects (across all teams)
    const projects = await getProjects();
    if (projects.length > 0) {
      parts.push('\n## Proyectos recientes:');
      for (const proj of projects.slice(0, 8)) {
        const statusEmoji = proj.project_status === 'active' ? '🟢' :
          proj.project_status === 'completed' ? '✅' :
          proj.project_status === 'on_hold' ? '🟡' :
          proj.project_status === 'planning' ? '📝' : '⚪';
        parts.push(`- ${statusEmoji} **${proj.project_name}** [${proj.project_key}] | Estado: ${proj.project_status} | Progreso: ${proj.completion_percentage}% | Prioridad: ${proj.priority_level} | ID: ${proj.project_id}`);
      }
    }

    // Fetch recent issues across teams (limit to most recent)
    if (teams.length > 0) {
      const issues = await getIssues({ teamId: teams[0].team_id, limit: 10 });
      if (issues.length > 0) {
        parts.push(`\n## Issues recientes (equipo: ${teams[0].name}):`);
        for (const issue of issues) {
          const statusName = issue.status?.name || 'Sin estado';
          const priorityName = issue.priority?.name || 'Sin prioridad';
          parts.push(`- #${issue.issue_number} **${issue.title}** | Estado: ${statusName} | Prioridad: ${priorityName} | ID: ${issue.issue_id}`);
        }
      }
    }

    if (parts.length <= 1) {
      return '📋 IRIS: No hay datos disponibles o IRIS no está configurado.';
    }

    return parts.join('\n');
  } catch (err) {
    console.error('IRIS: Error building context', err);
    return '';
  }
}
