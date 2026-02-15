/**
 * SIGNAL DETECTOR SERVICE
 * Fase 3 v0 - Proactive Intelligence Signals
 *
 * Detects project risks automatically:
 * - Silence Risk: project without client interaction for N days
 * - Predict Delay: milestone with high probability of delay
 *
 * Signals are stored as notifications (category='signal') with
 * evidence metadata for explainability.
 */

import {
  irisSupa,
  isIrisConfigured,
  type IrisProject,
  type IrisMilestone,
  type IrisIssue,
  type IrisNotification,
} from '../lib/iris-client';

import {
  getProjects,
  getProjectUpdates,
  getMilestones,
  getIssues,
  getNotificationPreferences,
} from './iris-data';

// ==========================================
// TYPES
// ==========================================

export interface SignalEvidence {
  signal_type: 'silence_risk' | 'predict_delay';
  severity: 'red' | 'amber';
  confidence: number;
  evidence: Record<string, any>;
  recommended_actions: string[];
  dedupe_key: string;
}

export interface SignalCheckResult {
  signals_created: number;
  signals_skipped: number;
  errors: string[];
}

// ==========================================
// SILENCE RISK DETECTION
// ==========================================

/**
 * Detect silence risk for a project.
 * Checks days since last project update (pm_project_updates).
 * Amber: >=7 days, Red: >=14 days.
 * Only applies to active projects.
 */
export async function detectSilenceRisk(project: IrisProject): Promise<SignalEvidence | null> {
  // Only check active projects
  if (!['active', 'on_hold'].includes(project.project_status)) return null;

  const updates = await getProjectUpdates(project.project_id);

  // Calculate days since last meaningful touchpoint
  const now = Date.now();
  let lastTouchpoint: number | null = null;

  if (updates.length > 0) {
    lastTouchpoint = new Date(updates[0].created_at).getTime();
  }

  // Fallback: use project updated_at if no updates exist
  if (!lastTouchpoint) {
    lastTouchpoint = new Date(project.updated_at).getTime();
  }

  const daysSinceLastTouch = (now - lastTouchpoint) / (1000 * 60 * 60 * 24);

  // Determine severity
  let severity: 'red' | 'amber' | null = null;
  if (daysSinceLastTouch >= 14) {
    severity = 'red';
  } else if (daysSinceLastTouch >= 7) {
    severity = 'amber';
  }

  if (!severity) return null;

  // Check for overdue client-dependent issues (enhances red signals)
  let overdueClientIssues = 0;
  if (severity === 'red') {
    const issues = await getIssues({ projectId: project.project_id, limit: 50 });
    overdueClientIssues = issues.filter(i =>
      i.due_date && new Date(i.due_date).getTime() < now && !i.completed_at
    ).length;
  }

  const today = new Date().toISOString().split('T')[0];

  return {
    signal_type: 'silence_risk',
    severity,
    confidence: severity === 'red' ? 0.90 : 0.75,
    evidence: {
      project_name: project.project_name,
      project_key: project.project_key,
      project_status: project.project_status,
      days_since_last_update: Math.floor(daysSinceLastTouch),
      last_update_date: lastTouchpoint ? new Date(lastTouchpoint).toISOString().split('T')[0] : null,
      overdue_client_issues: overdueClientIssues,
      health_status: project.health_status,
    },
    recommended_actions: [
      'Programar reunión de seguimiento con cliente',
      'Crear update público de progreso del proyecto',
      ...(overdueClientIssues > 0 ? ['Revisar issues vencidas dependientes del cliente'] : []),
    ],
    dedupe_key: `silence_risk_${project.project_id}_${today}`,
  };
}

// ==========================================
// PREDICT DELAY DETECTION
// ==========================================

/**
 * Detect delay risk for a milestone.
 * Checks blocked issues, overdue issues, completion % vs time remaining.
 * Red: blocked>2 OR >30% overdue OR <7days+<50% complete
 * Amber: blocked>0 OR >10% overdue OR <14days+<70% complete
 */
export async function detectPredictDelay(
  milestone: IrisMilestone,
  projectIssues: IrisIssue[]
): Promise<SignalEvidence | null> {
  // Skip completed/cancelled milestones
  if (['completed', 'cancelled'].includes(milestone.milestone_status)) return null;

  // Skip milestones without target date
  if (!milestone.target_date) return null;

  const now = Date.now();
  const targetDate = new Date(milestone.target_date).getTime();
  const daysUntilTarget = (targetDate - now) / (1000 * 60 * 60 * 24);

  // Skip milestones far in the future (>60 days)
  if (daysUntilTarget > 60) return null;

  const totalIssues = projectIssues.length;
  if (totalIssues === 0) return null;

  // Count blocked issues (status_type includes common blocked patterns)
  const blockedIssues = projectIssues.filter(i => {
    const statusType = (i as any).status?.status_type;
    const statusName = ((i as any).status?.name || '').toLowerCase();
    return statusType === 'cancelled' || statusName.includes('block') || statusName.includes('bloq');
  });

  // Count overdue issues (have due_date, past due, not completed)
  const overdueIssues = projectIssues.filter(i =>
    i.due_date && new Date(i.due_date).getTime() < now && !i.completed_at
  );

  // Count completed issues
  const completedIssues = projectIssues.filter(i => {
    const statusType = (i as any).status?.status_type;
    return statusType === 'done';
  });
  const completionPct = completedIssues.length / totalIssues;

  // Determine severity
  let severity: 'red' | 'amber' | null = null;

  const overdueRatio = overdueIssues.length / totalIssues;

  // Red conditions
  if (
    blockedIssues.length > 2 ||
    overdueRatio > 0.3 ||
    (daysUntilTarget < 7 && completionPct < 0.5)
  ) {
    severity = 'red';
  }
  // Amber conditions
  else if (
    blockedIssues.length > 0 ||
    overdueRatio > 0.1 ||
    (daysUntilTarget < 14 && completionPct < 0.7)
  ) {
    severity = 'amber';
  }

  if (!severity) return null;

  const today = new Date().toISOString().split('T')[0];

  return {
    signal_type: 'predict_delay',
    severity,
    confidence: severity === 'red' ? 0.85 : 0.70,
    evidence: {
      milestone_name: milestone.milestone_name,
      target_date: milestone.target_date,
      days_until_target: Math.floor(daysUntilTarget),
      blocked_issues_count: blockedIssues.length,
      overdue_issues_count: overdueIssues.length,
      total_issues: totalIssues,
      completed_issues: completedIssues.length,
      completion_percentage: Math.floor(completionPct * 100),
      overdue_ratio: Math.floor(overdueRatio * 100),
    },
    recommended_actions: [
      ...(blockedIssues.length > 0 ? ['Revisar y desbloquear issues bloqueadas'] : []),
      ...(overdueIssues.length > 0 ? ['Priorizar issues vencidas del milestone'] : []),
      ...(daysUntilTarget < 14 ? ['Evaluar ajustar fecha objetivo del milestone'] : []),
      'Reasignar recursos si es necesario',
    ],
    dedupe_key: `predict_delay_${milestone.milestone_id}_${today}`,
  };
}

// ==========================================
// SIGNAL NOTIFICATION CREATION (with dedup)
// ==========================================

/**
 * Create a signal notification, skipping if one already exists today
 * for the same entity and signal type.
 */
export async function createSignalNotification(
  userId: string,
  entityId: string,
  signal: SignalEvidence
): Promise<boolean> {
  if (!irisSupa || !isIrisConfigured()) return false;

  const today = new Date().toISOString().split('T')[0];

  // Deduplication: check if signal already exists today
  const { data: existing } = await irisSupa
    .from('notifications')
    .select('notification_id')
    .eq('recipient_id', userId)
    .eq('category', 'signal')
    .eq('type', signal.signal_type)
    .eq('entity_id', entityId)
    .gte('created_at', today)
    .limit(1);

  if (existing && existing.length > 0) {
    return false; // Already exists, skip
  }

  const severityEmoji = signal.severity === 'red' ? '🔴' : '🟡';
  const title = signal.signal_type === 'silence_risk'
    ? `${severityEmoji} Riesgo de Silencio: ${signal.evidence.project_name || 'Proyecto'}`
    : `${severityEmoji} Riesgo de Retraso: ${signal.evidence.milestone_name || 'Milestone'}`;

  const message = signal.signal_type === 'silence_risk'
    ? `Sin actualización en ${signal.evidence.days_since_last_update} días${signal.evidence.overdue_client_issues > 0 ? ` + ${signal.evidence.overdue_client_issues} issues vencidas` : ''}`
    : `${signal.evidence.blocked_issues_count} bloqueadas, ${signal.evidence.overdue_issues_count} vencidas de ${signal.evidence.total_issues} (${signal.evidence.completion_percentage}% completado)`;

  const { error } = await irisSupa.from('notifications').insert({
    recipient_id: userId,
    title,
    message,
    type: signal.signal_type,
    category: 'signal',
    entity_id: entityId,
    metadata: signal,
    is_read: false,
  });

  if (error) {
    console.error('Signal: createSignalNotification error', error);
    return false;
  }
  return true;
}

// ==========================================
// MAIN SIGNAL CHECK ORCHESTRATOR
// ==========================================

/**
 * Run all signal checks for a specific user.
 * Gets user's projects, checks silence risk + predict delay for each.
 */
export async function runSignalChecksForUser(userId: string): Promise<SignalCheckResult> {
  const result: SignalCheckResult = { signals_created: 0, signals_skipped: 0, errors: [] };

  if (!irisSupa || !isIrisConfigured()) {
    result.errors.push('IRIS not configured');
    return result;
  }

  // Check user preferences
  const prefs = await getNotificationPreferences(userId);
  if (!prefs?.soflia_enabled) {
    result.errors.push('Notifications disabled for user');
    return result;
  }
  // Check if soflia_signals preference exists and is false
  if ((prefs as any).soflia_signals === false) {
    result.errors.push('Signals disabled for user');
    return result;
  }

  try {
    // Get projects where user is lead or member
    const projects = await getProjectsForUser(userId);
    console.log(`Signal: Checking ${projects.length} projects for user ${userId}`);

    for (const project of projects) {
      try {
        // 1. Silence Risk
        const silenceSignal = await detectSilenceRisk(project);
        if (silenceSignal) {
          const created = await createSignalNotification(userId, project.project_id, silenceSignal);
          if (created) result.signals_created++;
          else result.signals_skipped++;
        }

        // 2. Predict Delay (check all milestones)
        const milestones = await getMilestones(project.project_id);
        if (milestones.length > 0) {
          // Fetch project issues once for all milestones
          const projectIssues = await getIssues({ projectId: project.project_id, limit: 100 });

          for (const milestone of milestones) {
            const delaySignal = await detectPredictDelay(milestone, projectIssues);
            if (delaySignal) {
              const created = await createSignalNotification(userId, milestone.milestone_id, delaySignal);
              if (created) result.signals_created++;
              else result.signals_skipped++;
            }
          }
        }
      } catch (err) {
        const msg = `Error checking project ${project.project_id}: ${err instanceof Error ? err.message : 'Unknown'}`;
        console.error('Signal:', msg);
        result.errors.push(msg);
      }
    }
  } catch (err) {
    const msg = `Error in signal check: ${err instanceof Error ? err.message : 'Unknown'}`;
    console.error('Signal:', msg);
    result.errors.push(msg);
  }

  console.log('Signal: Check complete', result);
  return result;
}

// ==========================================
// HELPERS
// ==========================================

/**
 * Get projects where user is lead or member (active/planning/on_hold only).
 */
async function getProjectsForUser(userId: string): Promise<IrisProject[]> {
  if (!irisSupa || !isIrisConfigured()) return [];

  // Get project IDs where user is a member
  const { data: memberData } = await irisSupa
    .from('pm_project_members')
    .select('project_id')
    .eq('user_id', userId);

  const memberProjectIds = memberData?.map(m => m.project_id) || [];

  // Get all active projects
  const allProjects = await getProjects();

  // Filter: user is lead OR user is member
  return allProjects.filter(p =>
    ['planning', 'active', 'on_hold'].includes(p.project_status) &&
    (p.lead_user_id === userId || memberProjectIds.includes(p.project_id))
  );
}

/**
 * Get active (unread) signal notifications for a user.
 * Used to inject into Gemini context.
 */
export async function getActiveSignals(userId: string): Promise<IrisNotification[]> {
  if (!irisSupa || !isIrisConfigured()) return [];

  const { data, error } = await irisSupa
    .from('notifications')
    .select('*')
    .eq('recipient_id', userId)
    .eq('category', 'signal')
    .eq('is_read', false)
    .order('created_at', { ascending: false })
    .limit(10);

  if (error) {
    console.error('Signal: getActiveSignals error', error);
    return [];
  }
  return data || [];
}
