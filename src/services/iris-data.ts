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
  IrisNotificationPreferences,
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

/** Get notification preferences for a user */
export async function getNotificationPreferences(userId: string): Promise<IrisNotificationPreferences | null> {
  if (!irisSupa || !isIrisConfigured()) return null;
  const { data, error } = await irisSupa
    .from('user_notification_preferences')
    .select('soflia_enabled, soflia_issues, soflia_projects, soflia_team_updates, soflia_mentions, soflia_reminders, soflia_signals')
    .eq('user_id', userId)
    .single();
  if (error) { console.error('IRIS: getNotificationPreferences error', error); return null; }
  return data;
}

/** Get filtered notifications respecting user preferences */
export async function getFilteredNotifications(userId: string): Promise<IrisNotification[]> {
  if (!irisSupa || !isIrisConfigured()) return [];

  // First check preferences
  const prefs = await getNotificationPreferences(userId);
  if (!prefs || !prefs.soflia_enabled) return [];

  // Fetch unread notifications
  const notifications = await getUnreadNotifications(userId);

  // Filter by category preferences
  return notifications.filter(n => {
    switch (n.category) {
      case 'task': return prefs.soflia_issues;
      case 'project': return prefs.soflia_projects;
      case 'team': return prefs.soflia_team_updates;
      case 'comment': return prefs.soflia_mentions;
      case 'reminder': return prefs.soflia_reminders;
      case 'signal': return prefs.soflia_signals !== false;
      case 'system': return true;
      default: return true;
    }
  });
}

/** Mark a single notification as read */
export async function markNotificationAsRead(notificationId: string): Promise<boolean> {
  if (!irisSupa || !isIrisConfigured()) return false;
  const { error } = await irisSupa
    .from('notifications')
    .update({ is_read: true })
    .eq('notification_id', notificationId);
  if (error) { console.error('IRIS: markNotificationAsRead error', error); return false; }
  return true;
}

/** Mark all notifications as read for a user */
export async function markAllNotificationsAsRead(userId: string): Promise<boolean> {
  if (!irisSupa || !isIrisConfigured()) return false;
  const { error } = await irisSupa
    .from('notifications')
    .update({ is_read: true })
    .eq('recipient_id', userId)
    .eq('is_read', false);
  if (error) { console.error('IRIS: markAllNotificationsAsRead error', error); return false; }
  return true;
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
// KEYWORD DETECTION
// ==========================================

const IRIS_KEYWORDS = [
  'proyecto', 'proyectos', 'project', 'projects',
  'issue', 'issues', 'tarea', 'tareas', 'task', 'tasks',
  'equipo', 'equipos', 'team', 'teams',
  'sprint', 'ciclo', 'cycle',
  'milestone', 'hito',
  'pendiente', 'pendientes',
  'estado de', 'status',
  'prioridad', 'priority',
  'asignar', 'assignee',
  'checklist',
  'backlog', 'kanban',
  'project hub', 'iris',
  'crear proyecto', 'crear tarea', 'create project', 'create task',
  'actualizar', 'update',
  'miembros', 'members',
  'informe', 'reporte', 'report',
  'mis tareas', 'my tasks',
  'avance', 'progreso', 'progress',
];

/** Check if a user message likely needs IRIS data */
export function needsIrisData(message: string): boolean {
  const lower = message.toLowerCase();
  return IRIS_KEYWORDS.some(kw => lower.includes(kw));
}

// ==========================================
// CONTEXT BUILDER (for Gemini prompt injection)
// ==========================================

/**
 * Builds a context summary of the user's IRIS data for Gemini.
 * Fetches teams, projects, issues, statuses, priorities, and cycles.
 */
export async function buildIrisContext(_userId?: string): Promise<string> {
  if (!irisSupa || !isIrisConfigured()) {
    return '';
  }

  try {
    const parts: string[] = [];
    parts.push('=== DATOS DE IRIS (Project Hub) ===');
    if (_userId) {
      parts.push(`\n## Usuario actual: ID: ${_userId}`);
    }

    // Fetch teams
    const teams = await getTeams();
    if (teams.length > 0) {
      parts.push('\n## Equipos:');
      for (const team of teams.slice(0, 5)) {
        parts.push(`- ${team.name} (${team.slug}) | Estado: ${team.status} | ID: ${team.team_id}`);
      }
    }

    // Fetch statuses and priorities (needed for Gemini to reference valid IDs in actions)
    if (teams.length > 0) {
      const statuses = await getStatuses(teams[0].team_id);
      if (statuses.length > 0) {
        parts.push(`\n## Estados disponibles (equipo: ${teams[0].name}):`);
        for (const s of statuses) {
          parts.push(`- ${s.name} | Tipo: ${s.status_type || 'N/A'} | ID: ${s.status_id}`);
        }
      }
    }

    const priorities = await getPriorities();
    if (priorities.length > 0) {
      parts.push('\n## Prioridades disponibles:');
      for (const p of priorities) {
        parts.push(`- ${p.name} | Nivel: ${p.level} | ID: ${p.priority_id}`);
      }
    }

    // Fetch projects
    const projects = await getProjects();
    if (projects.length > 0) {
      parts.push('\n## Proyectos:');
      for (const proj of projects.slice(0, 10)) {
        parts.push(`- ${proj.project_name} [${proj.project_key}] | Estado: ${proj.project_status} | Progreso: ${proj.completion_percentage}% | Prioridad: ${proj.priority_level} | Team: ${proj.team_id} | ID: ${proj.project_id}`);
      }
    }

    // Fetch issues from all teams
    if (teams.length > 0) {
      let totalIssues = 0;
      for (const team of teams.slice(0, 3)) {
        if (totalIssues >= 50) break;
        const limit = Math.min(20, 50 - totalIssues);
        const issues = await getIssues({ teamId: team.team_id, limit });
        if (issues.length > 0) {
          parts.push(`\n## Issues (equipo: ${team.name}):`);
          for (const issue of issues) {
            const statusName = (issue as any).status?.name || 'Sin estado';
            const priorityName = (issue as any).priority?.name || 'Sin prioridad';
            const assignee = issue.assignee_id ? `Asignado: ${issue.assignee_id}` : 'Sin asignar';
            parts.push(`- #${issue.issue_number} ${issue.title} | Estado: ${statusName} | Prioridad: ${priorityName} | ${assignee} | Proyecto: ${issue.project_id || 'N/A'} | ID: ${issue.issue_id}`);
            totalIssues++;
          }
        }
      }
    }

    // Fetch active cycles
    if (teams.length > 0) {
      const cycles = await getCycles(teams[0].team_id);
      const activeCycles = cycles.filter(c => {
        const now = new Date();
        const start = c.start_date ? new Date(c.start_date) : null;
        const end = c.end_date ? new Date(c.end_date) : null;
        return start && end && start <= now && end >= now;
      });
      if (activeCycles.length > 0) {
        parts.push(`\n## Ciclos activos (equipo: ${teams[0].name}):`);
        for (const c of activeCycles) {
          parts.push(`- ${c.name} | ${c.start_date} - ${c.end_date} | ID: ${c.cycle_id}`);
        }
      }
    }

    // Inject active signals (Proactive Intelligence)
    if (_userId) {
      try {
        const { getActiveSignals } = await import('./signal-detector');
        const signals = await getActiveSignals(_userId);
        if (signals.length > 0) {
          parts.push('\n## 🚨 Señales Activas (Proactive Intelligence):');
          for (const signal of signals) {
            const meta = signal.metadata;
            if (!meta) continue;
            const sevLabel = meta.severity === 'red' ? '🔴 RED' : '🟡 AMBER';
            parts.push(`- [${sevLabel}] ${signal.title}`);
            parts.push(`  Tipo: ${meta.signal_type} | Confianza: ${Math.floor(meta.confidence * 100)}%`);
            parts.push(`  Evidencia: ${JSON.stringify(meta.evidence)}`);
            parts.push(`  Acciones recomendadas: ${meta.recommended_actions?.join(', ') || 'N/A'}`);
          }
        }
      } catch (e) {
        console.warn('IRIS: Could not load active signals for context', e);
      }
    }

    if (parts.length <= 1) {
      return '=== IRIS: No hay datos disponibles o IRIS no esta configurado. ===';
    }

    parts.push('\n=== FIN DATOS IRIS ===');
    return parts.join('\n');
  } catch (err) {
    console.error('IRIS: Error building context', err);
    return '';
  }
}

// ==========================================
// ACTION EXECUTOR
// ==========================================

export interface IrisActionRequest {
  type: string;
  id?: string;
  data?: Record<string, any>;
}

export interface IrisActionResult {
  success: boolean;
  data?: any;
  error?: string;
}

/** Get the next issue_number for a team */
async function getNextIssueNumber(teamId: string): Promise<number> {
  if (!irisSupa) return 1;
  const { data } = await irisSupa
    .from('task_issues')
    .select('issue_number')
    .eq('team_id', teamId)
    .order('issue_number', { ascending: false })
    .limit(1);
  return (data && data.length > 0) ? data[0].issue_number + 1 : 1;
}

/** Execute an IRIS action (create/update project, issue, etc.) */
export async function executeIrisAction(action: IrisActionRequest, userId?: string): Promise<IrisActionResult> {
  try {
    switch (action.type) {
      case 'create_project': {
        const data = { ...action.data };
        // Inject required created_by_user_id if not present
        if (!data.created_by_user_id && userId) {
          data.created_by_user_id = userId;
        }
        // Also set lead_user_id if user asked to be leader
        if (!data.lead_user_id && userId) {
          data.lead_user_id = userId;
        }
        const result = await createProject(data);
        return result
          ? { success: true, data: result }
          : { success: false, error: 'No se pudo crear el proyecto' };
      }
      case 'update_project': {
        if (!action.id) return { success: false, error: 'Se requiere ID del proyecto' };
        const result = await updateProject(action.id, action.data || {});
        return result
          ? { success: true, data: result }
          : { success: false, error: 'No se pudo actualizar el proyecto' };
      }
      case 'create_issue': {
        const data = { ...action.data };
        // Inject required creator_id if not present
        if (!data.creator_id && userId) {
          data.creator_id = userId;
        }
        // Generate issue_number if not present
        if (!data.issue_number && data.team_id) {
          data.issue_number = await getNextIssueNumber(data.team_id);
        }
        const result = await createIssue(data);
        return result
          ? { success: true, data: result }
          : { success: false, error: 'No se pudo crear la issue' };
      }
      case 'update_issue': {
        if (!action.id) return { success: false, error: 'Se requiere ID de la issue' };
        const result = await updateIssue(action.id, action.data || {});
        return result
          ? { success: true, data: result }
          : { success: false, error: 'No se pudo actualizar la issue' };
      }
      case 'add_comment': {
        const data = { ...action.data };
        // Inject required author_id if not present
        if (!data.author_id && userId) {
          data.author_id = userId;
        }
        // Map comment_text to body if needed
        if (data.comment_text && !data.body) {
          data.body = data.comment_text;
          delete data.comment_text;
        }
        const result = await addIssueComment(data);
        return result
          ? { success: true, data: result }
          : { success: false, error: 'No se pudo agregar el comentario' };
      }
      case 'create_cycle': {
        const result = await createCycle(action.data || {});
        return result
          ? { success: true, data: result }
          : { success: false, error: 'No se pudo crear el ciclo' };
      }
      case 'create_milestone': {
        const result = await createMilestone(action.data || {});
        return result
          ? { success: true, data: result }
          : { success: false, error: 'No se pudo crear el milestone' };
      }
      default:
        return { success: false, error: `Accion desconocida: ${action.type}` };
    }
  } catch (err) {
    console.error('IRIS: executeIrisAction error', err);
    return { success: false, error: err instanceof Error ? err.message : 'Error desconocido' };
  }
}
