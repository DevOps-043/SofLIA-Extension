## Resumen ejecutivo (máx. 12 líneas)

- **Qué cambia en Fase 3:** SofLIA pasa de _“mostrar el estado”_ (Fase 2) a _“interpretar + anticipar + proponer”_ usando señales explicables derivadas de **eventos de reunión** (Calendar/Meet → meeting_instance → outcomes) + tareas/proyectos (Project Hub) + espejo Odoo.
- **Qué NO es Fase 3 (anti-scope):** no es un “autopiloto”, no es un nuevo CRM/ERP, no sustituye PM humano, no manda correos al cliente sin revisión, no mueve etapas comerciales, no factura.
- **Beneficio esperado (lenguaje negocio):** menos sorpresas con cliente, menos proyectos “rojos” tardíos, menos deals estancados, mejor foco del equipo (priorización basada en riesgo/valor), y **cobro por hitos más defendible** (evidencia + gates).
- **Mecánica central:** “Detecta → Datos → Acción” con gobernanza por niveles (Insight / Recomendación / Automatización reversible) y **humano-en-el-loop** para todo lo externo.

---

## 2) “Fase 3 v0” (MVP) — elegir 2–3 señales de alto valor

### Selección (2–3) y por qué

1. **Silence Risk (cliente)**

- **Impacto:** reduce fricción y escalaciones sorpresa; protege renovación y cobro por etapas.
- **Esfuerzo de datos:** bajo-medio (Calendar/Meet + meeting_sessions + updates).
- **Riesgo de confianza:** bajo (explicable con “no hubo interacción / no hubo update / acciones vencidas”).
- **Por qué ahora:** ya existe captura de reuniones en SofLIA Agent (`meeting_sessions`, `meeting_transcripts`). SofLIA AGENT - CLAUDE

2. **Predict Delay (hitos/proyecto)** _(heurístico, no “ML glam”)_

- **Impacto:** evita retrasos y re-trabajo; mejora margen.
- **Esfuerzo de datos:** medio (milestones + issues + tiempos + stage_durations). Project Hub ya tiene `pm_milestones`, `task_issues` y `pm_project_progress_history`. Project Hub - Readme CLAUDE
- **Riesgo de confianza:** medio (hay que explicar factores y degradadores).

3. **Stalled Deals (comercial) + Next-Step recomendado**

- **Impacto:** ventas: reduce aging y aumenta win-rate por disciplina.
- **Esfuerzo de datos:** medio (Odoo + Calendar: “no hay next meeting”).
- **Riesgo de confianza:** bajo-medio (explicable con “etapa cambió + sin next step calendarizado X días”).

---

### 2.1 Señal 1 — **Silence Risk**

- **Definición:** “Cuenta/proyecto sin interacción significativa con cliente por N días” _y_ sin update público de avance.
- **Umbral v0:**
  - **Ámbar:** 7 días sin meeting/correo marcado + sin `pm_project_updates` relevante
  - **Rojo:** 14 días + acciones cliente-dependientes vencidas
- **Factores explicables (links a evidencia):**
  - último evento Calendar/Meet asociado
  - última minuta/resumen (`meeting_sessions.summary`) SofLIA AGENT - CLAUDE
  - acciones vencidas (`task_issues` con due_date < hoy, status != done) Project Hub - Readme CLAUDE
- **Output:**
  - Nivel 1: alerta “Silence Risk” con evidencia enlazada
  - Nivel 2: recomendación con **draft** de agenda para “Verificación de progreso” + 3 bullets de recap (no se envía sin aprobación)

**Confidence score (v0):** Alto si hay mapeo confiable account↔project↔calendar; Medio si el mapeo es manual.

---

### 2.2 Señal 2 — **Predict Delay (heurístico)**

- **Definición:** “Milestone con probabilidad alta de retraso” según carga + edad de issues + dependencia externa.
- **Umbral v0 (explicable):**
  - **Rojo:** (issues bloqueados > 2) OR (≥30% issues del milestone vencidos) OR (no progreso en `pm_project_progress_history` 7 días) Project Hub - Readme CLAUDE
  - **Ámbar:** tendencia negativa 2 ciclos seguidos (sube WIP, baja throughput)
- **Factores explicables:**
  - ratio vencidas / total milestone
  - bloqueos repetidos (labels/status/history) Project Hub - Readme CLAUDE
  - carga por usuario (issues asignadas activas)
- **Output:**
  - Nivel 1: alerta “Delay Risk”
  - Nivel 2: recomendación: re-secuenciar 1–2 issues, pedir decisión de alcance, o agendar “asunto único” (decision meeting)

**Confidence score (v0):** Medio (mejora cuando tengamos `stage_durations` y datos de ciclos).

---

### 2.3 Señal 3 — **Stalled Deals**

- **Definición:** “Oportunidad en etapa activa sin next step calendarizado y sin interacción reciente.”
- **Umbral v0:** 5–7 días sin next meeting desde último cambio de etapa.
- **Factores explicables:** etapa Odoo, último evento Calendar asociado, ausencia de siguiente evento.
- **Output:**
  - Nivel 1: alerta
  - Nivel 2: draft de 2 opciones de next step (diagnóstico / revisión propuesta) + agenda mínima.

**Confidence score (v0):** Medio (depende del mapeo Odoo↔Calendar).

---

## 3) Catálogo de señales (top 10) con plantilla estándar

> Plantilla: Detecta | Datos mínimos | Frecuencia | Acción (Nivel 1/2/3) | Explainability | Confidence + degradadores

1. **Project Health (overall)**

- Detecta: combinación ponderada de retraso + riesgos + acciones vencidas
- Datos: `pm_projects.health_status`, milestones, issues, risks (nuevo), updates
- Frecuencia: diario
- Acción: N1 dashboard + N2 “top 3 intervenciones”
- Explainability: score breakdown + links
- Conf: Medio; degrada si faltan due_dates o owners

2. **Predict Delay** _(MVP)_

- (ya definido)

3. **Silence Risk** _(MVP)_

- (ya definido)

4. **Scope/Alignment Drift**

- Detecta: decisiones recientes contradicen SOW/hitos; muchas “new requests” en comentarios
- Datos: decision_log (nuevo), meeting summaries, issue history/comments
- Frecuencia: evento (post-reunión) + diario
- Acción: N1 insight; N2 sugerir “re-charter / change control meeting”
- Explainability: citas a resumen + issue diffs
- Conf: Bajo–Medio; degrada si no etiquetan requests

5. **Client Friction Signal**

- Detecta: tono/keywords de fricción en minutas + retrasos en aprobaciones del cliente
- Datos: meeting summaries + action_items + vencidas dependientes cliente
- Frecuencia: post-reunión
- Acción: N1 alerta; N2 draft de “reset call” (no enviar)
- Explainability: snippets + links
- Conf: Bajo–Medio; degrada por NLP ruidoso

6. **Bottlenecks (workflow)**

- Detecta: acumulación en un status / cycle; throughput cae
- Datos: `task_issue_history`, `task_cycles`, statuses Project Hub - Readme CLAUDE
- Frecuencia: diario
- Acción: N1 insight; N2 recomendación de WIP limit / re-asignación
- Conf: Medio

7. **Capacity Stress**

- Detecta: usuarios con demasiadas issues activas + demasiadas reuniones + vencidas
- Datos: issues por assignee + calendar load (nuevo view) Project Hub - Readme CLAUDE
- Frecuencia: diario
- Acción: N1 alerta; N2 recomendación de re-balance
- Conf: Medio; degrada si no hay due_dates

8. **Action Hygiene (acciones vencidas)**

- Detecta: tasa de vencidas sube; owners faltantes
- Datos: `task_issues` + history Project Hub - Readme CLAUDE
- Frecuencia: 6h o diario
- Acción: N1 alerta; N3 reversible: crear “reminder notification” interno (no cliente)
- Explainability: lista top 5 con links
- Conf: Alto

9. **Stalled Deals** _(MVP opcional)_

- (ya definido)

10. **Meeting Effectiveness Drop**

- Detecta: reuniones sin cierre (sin actions/decisions) repetidas; o ratings bajos (si se implementa)
- Datos: meeting_outcomes count + meeting template compliance (nuevo) + notifications
- Frecuencia: semanal
- Acción: N1 insight; N2 coaching playbook
- Conf: Medio; degrada si outcomes no se capturan

---

## 4) Modelo de datos mínimo en Supabase (solo lo necesario)

### 4.1 Tablas/vistas imprescindibles (v0)

**A) Eventos & trazabilidad**

- `activity_log` _(nuevo, core)_
  - `id`, `ts`, `workspace_id`, `source_system`, `event_type`, `entity_type`, `entity_id`, `correlation_id`, `metadata_json`, `links[]`
- `orchestration_ledger` _(nuevo, core)_
  - `run_id`, `ts_start/ts_end`, `agent_name`, `trigger`, `status`, `dedupe_key`, `correlation_id`, `inputs_hash`, `outputs_hash`, `error`, `metrics_json`

**B) Reuniones (reusar SofLIA Agent)**

- `meeting_sessions` (existente) + `meeting_transcripts` (existente) SofLIA AGENT - CLAUDE
- `meetings` _(nuevo “meeting_instance”)_
  - `meeting_id`, `calendar_event_id`, `account_id`, `project_id`, `meeting_model`, `purpose`, `desired_outcomes`, `status`, `start/end`, `links[]`
  - - `session_id` (FK opcional a `meeting_sessions`)

**C) Outcomes**

- `meeting_outcomes` _(nuevo)_
  - `outcome_id`, `meeting_id`, `type` (action/decision/risk), `payload_json`, `owner_id`, `due_date`, `severity`, `approval_status`, `approved_by`, `approved_at`, `evidence_links[]`
- `alert_queue` _(nuevo, read/write)_
  - `alert_id`, `signal_key`, `workspace_id`, `account_id`, `project_id`, `severity`, `confidence`, `dedupe_key`, `status` (open/ack/dismissed/resolved), `quiet_until`, `explainability_json`, `evidence_links[]`, `recommended_actions_json`, `created_at`

**D) Read models (materializados)**

- `project_health_metrics` _(view/materialized)_
- `client_health_metrics` _(view/materialized)_
- `workload_by_user` _(view)_
- `stage_durations` _(table o view)_
- `delay_risk_predictions` _(table, v0 heurístico)_

**E) Integración con Project Hub (ya existe)**

- `pm_projects`, `pm_milestones`, `pm_project_updates`, `task_issues`, `task_issue_history`, `notifications`

### 4.2 Campos clave: dedupe, quiet hours, severidad

- `dedupe_key = hash(signal_key + entity_id + window)`
- `quiet_hours`: política por workspace (ej. 20:00–08:00) aplicada vía `quiet_until` en `alert_queue`
- `severity`: info/warn/critical (o 1–5)

### 4.3 correlation_id e idempotencia

- `correlation_id = hash(source_system + source_event_id + event_type + version)`
- Toda escritura por agente se protege con:
  - `upsert` por `dedupe_key` (alertas)
  - `unique(correlation_id)` (eventos/ledger)

### 4.4 Qué se materializa como read models

- `project_health_metrics` (para tablero ejecutivo)
- `client_health_metrics` (para “Client Snapshot”)
- `alert_queue` (centro de control operativo)

---

## 5) Diseño de agentes (4 agentes) con especificación técnica-operativa

> Nota práctica: ya tienen capacidad de escribir en Project Hub vía acciones (IRIS actions) y esquema de proyectos/issues. SofLIA AGENT - CLAUDE
>
> Además existe sistema de notificaciones (`notifications`, `sendNotification`). Project Hub - Readme CLAUDE

### 5.1 Agente 1 — **Riesgo de Proyecto**

- **Trigger:** cron diario 08:00 + post-reunión (cuando llega `meeting_sessions.summary`) SofLIA AGENT - CLAUDE
- **Inputs:** `pm_projects`, `pm_milestones`, `task_issues`, `meeting_outcomes`, `project_health_metrics` Project Hub - Readme CLAUDE
- **Steps:**
  1. calcular heurísticos (vencidas, bloqueos, drift)
  2. generar alertas (dedupe)
  3. proponer intervención mínima (N2)
- **Outputs:** `alert_queue`, `delay_risk_predictions`, `notifications` internas Project Hub - Readme CLAUDE
- **Guardrails:** Nivel 3 solo acciones reversibles internas (crear issue “Risk Review”, sugerir reunión draft)
- **Observabilidad:** `orchestration_ledger.metrics_json` (n alerts, precision proxy, ack rate)

### 5.2 Agente 2 — **Seguimiento Comercial**

- **Trigger:** evento Odoo “stage changed” (webhook/poll) + cron diario
- **Inputs:** espejo Odoo (accounts/opps), Calendar events (mapeo), `meeting_sessions` SofLIA AGENT - CLAUDE
- **Steps:**
  1. detectar “stalled” por etapa+tiempo+sin next event
  2. proponer next-step + agenda mínima
  3. crear draft para Chat interno (no email)
- **Outputs:** `alert_queue` + draft message + (opcional) issue “Follow-up”
- **Guardrails:** NO mover etapas Odoo; NO enviar correo sin aprobación
- **Observabilidad:** aging por etapa, tasa de “resuelto” por alerta

### 5.3 Agente 3 — **Prioridades del Equipo**

- **Trigger:** diario + after weekly cadence (evento manual “weekly_closed”)
- **Inputs:** `task_issues`, `task_cycles`, `task_issue_history`, `workload_by_user`
- **Steps:**
  1. detectar sobrecarga / WIP / vencidas
  2. sugerir re-balance y top 3 prioridades (con evidencia)
- **Outputs:** `alert_queue` + recomendaciones + notificación interna Project Hub - Readme CLAUDE
- **Guardrails:** Nivel 3 reversible: crear “proposal” de re-asignación (no ejecutar sin aprobación)
- **Observabilidad:** reducción de WIP/vencidas, aceptación de sugerencias

### 5.4 Agente 4 — **Salud del Cliente**

- **Trigger:** post-reunión + diario
- **Inputs:** `meetings/meeting_sessions`, `pm_project_updates`, `actions`, `alert_queue`, `client_health_metrics`
- **Steps:**
  1. calcular “silence risk” + “friction hints”
  2. generar snapshot y recomendación mínima
- **Outputs:** `alert_queue` + `client_snapshot_draft` (nuevo)
- **Guardrails:** N2 produce **draft** , N3 solo “programar borrador de agenda” (no enviar nada)
- **Observabilidad:** reducción de silencios, menos escalaciones sorpresa

---

## 6) Gobernanza de automatización (control de riesgo)

### Niveles

- **Nivel 1 — Insight:** señal + evidencia + confianza. No crea tareas automáticamente.
- **Nivel 2 — Recomendación:** sugiere intervención mínima + **draft** (agenda, resumen, checklist) para aprobación.
- **Nivel 3 — Automatización reversible:** solo acciones internas reversibles:
  - crear issue “Risk Review” / “Follow-up”
  - crear notificación interna
  - proponer reunión como _draft_ (sin invitar cliente automáticamente)

### NO automatizar (explícito)

- Closed Won/Lost, cambios de etapa Odoo
- correos al cliente sin revisión
- cambios de alcance (scope)
- facturas, términos comerciales, pagos
- compromisos contractuales

### Anti-alert fatigue (mínimo viable)

- **Top 3 alertas/día por persona** (prioridad por severidad + confidence)
- `dedupe_key` por ventana (ej. 24h)
- `quiet_hours` + `quiet_until` (no notificar fuera de horario)
- regla: si una alerta fue **dismissed** 2 veces → subir umbral o degradar confianza

### Evidencia mínima

- sin evidencia enlazada → **solo Nivel 1** con confianza baja
- evidencia = links a: meeting summary/transcript, issues, milestones, update, evento calendar

---

## 7) Roadmap en 2 horizontes

### 6 semanas — “Fase 3 v0 operando”

**Hito 1 (semana 1–2): Data plumbing + mapping**

- Crear `meetings`, `meeting_outcomes`, `alert_queue`, `activity_log`, `orchestration_ledger`
- Mapeo mínimo: meeting_session ↔ project/account (manual + reglas)
- **Criterio de listo:** 80% de reuniones importantes se asocian a un project_id

**Hito 2 (semana 3–4): Señales MVP (2–3)**

- Implementar Silence Risk + Predict Delay heurístico (+ opcional Stalled Deals)
- UI: Alert Center + Evidence panel (links)
- **Criterio de listo:** alertas dedupe + explainability + ack/dismiss

**Hito 3 (semana 5–6): Agentes v0 + governance**

- 4 agentes corriendo con ledger + políticas de niveles
- Notificaciones internas usando sistema existente Project Hub - Readme CLAUDE
- **Criterio de listo:** 1) 70% de alertas reciben acción (ack + tarea o reunión) 2) cero automatizaciones externas

### 90 días — descriptiva → predictiva heurística → prescriptiva con playbooks

- **Mes 1:** robustecer data quality (due_dates, owners, etiquetas) + stage_durations
- **Mes 2:** calibrar thresholds por tipo de proyecto + “playbooks” por señal
- **Mes 3:** introducir scoring (no-ML o ML ligero) con monitoreo de precisión (proxy) + reducción de falsos positivos

---

## 8) Métricas de éxito (leading + lagging)

**Leading (señales de salud del sistema)**

- % reuniones con cierre (outcomes capturados y aprobados)
- tasa de acciones vencidas (↓)
- tiempo promedio de “ack” de alertas (↓)
- # silencios > 7 días por cliente (↓)
- WIP promedio por persona (↓) / balance de carga (↑)

**Lagging (resultado negocio)**

- proyectos “rojos” por sorpresa (↓)
- variación estimado vs real por hito (↓)
- aging comercial por etapa (↓)
- win-rate en deals con next-step calendarizado (↑)
- margen por proyecto (↑) / menos re-trabajo (↓)

---

## 9) Confirmado / Inferencia / Riesgos / Dato faltante (tabla compacta)

| Categoría         | Contenido                                                                                                                                                                                                                                                                                                     |
| ----------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Confirmado**    | SofLIA Agent ya captura reuniones y guarda `meeting_sessions`/`meeting_transcripts`con summary/action_items.SofLIA AGENT - CLAUDEProject Hub ya tiene `pm_projects`,`pm_milestones`,`task_issues`, history y sistema de `notifications`.                                                                      |
| **Inferencia**    | “Fase 3 v0” puede arrancar con heurísticos explicables (silence/delay/stalled) sin ML; los 4 agentes pueden operar escribiendo a `alert_queue`+ drafts + issues.                                                                                                                                              |
| **Riesgos**       | (1) mapeo Odoo↔Project↔Calendar incompleto → baja confianza; (2) alert fatigue si no hay dedupe/quiet hours; (3) sesgo/errores en extracción automática de outcomes; (4) permisos/ACL en Workspace/cliente.                                                                                                   |
| **Dato faltante** | Esquema exacto Odoo (eventos, etapas, IDs), política de costeo y tarifas internas, taxonomía de tipos de proyecto, reglas de “qué cuenta como interacción con cliente”, y definición de severidad por dominio (ventas/delivery). Impacto: reduce precisión/confianza y obliga a más humano-en-loop al inicio. |

---

Si lo conviertes a backlog mañana, el orden ganador es: **(1) Alert Center + ledger + dedupe, (2) Silence Risk, (3) Predict Delay, (4) Stalled Deals** , y luego recién “scoring” más sofisticado. Esto mantiene la confianza alta mientras el sistema aprende a no alucinar trabajo.
