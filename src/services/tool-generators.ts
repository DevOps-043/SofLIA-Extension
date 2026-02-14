/**
 * Tool Generators Service
 * Handles productivity tool generation: PDFs, diagrams, documents
 * Uses Gemini AI for content generation + jspdf/mermaid for output
 */

import { GOOGLE_API_KEY, MODELS } from '../config';

// ==========================================
// TYPES
// ==========================================

export type GeneratorId =
  | 'pdf-report'
  | 'prd-generator'
  | 'user-stories'
  | 'sow-generator'
  | 'meeting-minutes'
  | 'project-plan'
  | 'email-composer'
  | 'presentation-outline'
  | 'proposal-generator'
  | 'checklist-sop'
  | 'swot-analysis'
  | 'okr-generator'
  | 'test-cases'
  | 'changelog'
  | 'bpmn-diagram'
  | 'sequence-diagram'
  | 'flow-diagram'
  | 'mindmap'
  | 'er-diagram'
  | 'gantt-chart'
  | 'class-diagram';

export interface GeneratorField {
  id: string;
  label: string;
  type: 'text' | 'textarea' | 'select';
  placeholder: string;
  required: boolean;
  options?: { value: string; label: string }[];
}

export interface GeneratorConfig {
  id: GeneratorId;
  name: string;
  description: string;
  icon: string;
  outputType: 'document' | 'diagram';
  fields: GeneratorField[];
  systemPrompt: string;
}

export interface GeneratedOutput {
  type: 'markdown' | 'mermaid';
  content: string;
  title: string;
}

// ==========================================
// GENERATOR CONFIGURATIONS
// ==========================================

const GENERATOR_CONFIGS: Record<string, GeneratorConfig> = {
  // ---- DOCUMENT GENERATORS ----
  'pdf-report': {
    id: 'pdf-report',
    name: 'Generador de Informes PDF',
    description: 'Crea informes profesionales en PDF',
    icon: '📄',
    outputType: 'document',
    fields: [
      { id: 'title', label: 'Título del informe', type: 'text', placeholder: 'Ej: Informe de ventas Q4 2025', required: true },
      { id: 'context', label: 'Contexto y datos', type: 'textarea', placeholder: 'Describe el contexto, datos principales, métricas...', required: true },
      { id: 'sections', label: 'Secciones deseadas', type: 'textarea', placeholder: 'Ej: Resumen ejecutivo, análisis de datos, conclusiones...', required: false },
    ],
    systemPrompt: 'Genera un informe profesional y estructurado en formato Markdown con headers, tablas de datos, bullet points y conclusiones. Usa formato profesional con secciones claras. El informe debe ser detallado y listo para presentar.',
  },
  'prd-generator': {
    id: 'prd-generator',
    name: 'Generador de PRDs',
    description: 'Product Requirement Documents completos',
    icon: '📋',
    outputType: 'document',
    fields: [
      { id: 'product', label: 'Nombre del producto/feature', type: 'text', placeholder: 'Ej: Sistema de notificaciones push', required: true },
      { id: 'problem', label: 'Problema que resuelve', type: 'textarea', placeholder: 'Describe el problema o necesidad del usuario...', required: true },
      { id: 'audience', label: 'Audiencia objetivo', type: 'text', placeholder: 'Ej: Usuarios empresariales B2B', required: false },
      { id: 'scope', label: 'Alcance y limitaciones', type: 'textarea', placeholder: 'Qué incluye y qué NO incluye...', required: false },
    ],
    systemPrompt: 'Genera un PRD (Product Requirements Document) completo y profesional en Markdown. Incluye: 1) Resumen Ejecutivo, 2) Problema, 3) Objetivos y métricas de éxito, 4) Audiencia, 5) User Stories con criterios de aceptación, 6) Requisitos funcionales y no funcionales, 7) Wireframes (descripción textual), 8) Dependencias, 9) Timeline estimado, 10) Riesgos. Sé detallado y profesional.',
  },
  'user-stories': {
    id: 'user-stories',
    name: 'Generador de User Stories',
    description: 'Historias de usuario con criterios de aceptación',
    icon: '👤',
    outputType: 'document',
    fields: [
      { id: 'feature', label: 'Feature o módulo', type: 'text', placeholder: 'Ej: Módulo de autenticación', required: true },
      { id: 'details', label: 'Detalles del feature', type: 'textarea', placeholder: 'Describe la funcionalidad esperada...', required: true },
      { id: 'personas', label: 'Tipos de usuario', type: 'text', placeholder: 'Ej: Admin, Usuario registrado, Visitante', required: false },
    ],
    systemPrompt: 'Genera user stories en formato estándar: "Como [tipo de usuario], quiero [acción] para [beneficio]". Para cada story incluye: prioridad (Alta/Media/Baja), estimación en story points, criterios de aceptación detallados, y notas técnicas. Agrupa por épicas si corresponde. Formato Markdown.',
  },
  'sow-generator': {
    id: 'sow-generator',
    name: 'Generador de SOW',
    description: 'Statement of Work profesional',
    icon: '📑',
    outputType: 'document',
    fields: [
      { id: 'project', label: 'Nombre del proyecto', type: 'text', placeholder: 'Ej: Rediseño de plataforma web', required: true },
      { id: 'description', label: 'Descripción del trabajo', type: 'textarea', placeholder: 'Describe el alcance del trabajo...', required: true },
      { id: 'client', label: 'Cliente/Organización', type: 'text', placeholder: 'Nombre del cliente', required: false },
      { id: 'duration', label: 'Duración estimada', type: 'text', placeholder: 'Ej: 3 meses', required: false },
    ],
    systemPrompt: 'Genera un Statement of Work (SOW) profesional en Markdown. Incluye: 1) Introducción y contexto, 2) Alcance del trabajo, 3) Entregables específicos con fechas, 4) Cronograma y fases, 5) Recursos requeridos, 6) Supuestos y restricciones, 7) Criterios de aceptación, 8) Términos y condiciones. Formato profesional y detallado.',
  },
  'meeting-minutes': {
    id: 'meeting-minutes',
    name: 'Generador de Actas de Reunión',
    description: 'Actas estructuradas de reuniones',
    icon: '📝',
    outputType: 'document',
    fields: [
      { id: 'meeting_type', label: 'Tipo de reunión', type: 'text', placeholder: 'Ej: Sprint Planning, Kick-off, Standup', required: true },
      { id: 'participants', label: 'Participantes', type: 'text', placeholder: 'Ej: Juan, María, Carlos', required: false },
      { id: 'topics', label: 'Temas tratados / Notas', type: 'textarea', placeholder: 'Lista de temas discutidos, decisiones, pendientes...', required: true },
    ],
    systemPrompt: 'Genera un acta de reunión profesional en Markdown. Incluye: 1) Encabezado (fecha, hora, tipo, asistentes), 2) Agenda, 3) Puntos discutidos con detalle, 4) Decisiones tomadas, 5) Tareas asignadas (con responsable y fecha), 6) Próximos pasos, 7) Próxima reunión. Formato claro y accionable.',
  },
  'project-plan': {
    id: 'project-plan',
    name: 'Generador de Planes de Proyecto',
    description: 'Planes de proyecto con fases y hitos',
    icon: '📅',
    outputType: 'document',
    fields: [
      { id: 'project_name', label: 'Nombre del proyecto', type: 'text', placeholder: 'Ej: Migración a la nube', required: true },
      { id: 'objectives', label: 'Objetivos del proyecto', type: 'textarea', placeholder: 'Describe los objetivos principales...', required: true },
      { id: 'team_size', label: 'Tamaño del equipo', type: 'text', placeholder: 'Ej: 5 personas', required: false },
      { id: 'timeline', label: 'Timeline esperado', type: 'text', placeholder: 'Ej: 6 meses', required: false },
    ],
    systemPrompt: 'Genera un plan de proyecto detallado en Markdown. Incluye: 1) Resumen ejecutivo, 2) Objetivos SMART, 3) Alcance, 4) Fases del proyecto con entregables, 5) Cronograma con hitos, 6) Recursos y roles, 7) Presupuesto estimado, 8) Plan de comunicación, 9) Gestión de riesgos con mitigación, 10) Criterios de éxito. Formato profesional.',
  },
  'email-composer': {
    id: 'email-composer',
    name: 'Generador de Emails Profesionales',
    description: 'Redacta emails profesionales',
    icon: '✉️',
    outputType: 'document',
    fields: [
      { id: 'purpose', label: 'Propósito del email', type: 'select', placeholder: '', required: true, options: [
        { value: 'proposal', label: 'Propuesta comercial' },
        { value: 'followup', label: 'Seguimiento' },
        { value: 'apology', label: 'Disculpa profesional' },
        { value: 'introduction', label: 'Presentación' },
        { value: 'request', label: 'Solicitud' },
        { value: 'thank_you', label: 'Agradecimiento' },
        { value: 'other', label: 'Otro' },
      ]},
      { id: 'context', label: 'Contexto', type: 'textarea', placeholder: 'Describe la situación y qué quieres comunicar...', required: true },
      { id: 'recipient', label: 'Destinatario', type: 'text', placeholder: 'Ej: Cliente potencial, Jefe de área', required: false },
      { id: 'tone', label: 'Tono', type: 'select', placeholder: '', required: false, options: [
        { value: 'formal', label: 'Formal' },
        { value: 'semiformal', label: 'Semi-formal' },
        { value: 'friendly', label: 'Amigable' },
      ]},
    ],
    systemPrompt: 'Redacta un email profesional en Markdown. Incluye: Asunto sugerido, saludo, cuerpo con párrafos bien estructurados, call-to-action claro, y despedida. El tono debe ser apropiado para el contexto. Proporciona 2-3 variantes del email.',
  },
  'presentation-outline': {
    id: 'presentation-outline',
    name: 'Generador de Presentaciones',
    description: 'Outlines completos de presentaciones',
    icon: '🎬',
    outputType: 'document',
    fields: [
      { id: 'topic', label: 'Tema de la presentación', type: 'text', placeholder: 'Ej: Resultados Q4 2025', required: true },
      { id: 'audience', label: 'Audiencia', type: 'text', placeholder: 'Ej: Directivos, Inversores, Equipo técnico', required: true },
      { id: 'duration', label: 'Duración', type: 'select', placeholder: '', required: false, options: [
        { value: '5min', label: '5 minutos' },
        { value: '10min', label: '10 minutos' },
        { value: '15min', label: '15 minutos' },
        { value: '30min', label: '30 minutos' },
        { value: '60min', label: '1 hora' },
      ]},
      { id: 'key_points', label: 'Puntos clave', type: 'textarea', placeholder: 'Lista los puntos principales a cubrir...', required: false },
    ],
    systemPrompt: 'Genera la estructura completa de una presentación en Markdown. Para cada slide incluye: número, título, bullet points clave, notas del presentador, y sugerencias visuales. Incluye slide de apertura, agenda, contenido, conclusiones y Q&A. Adapta el número de slides a la duración.',
  },
  'proposal-generator': {
    id: 'proposal-generator',
    name: 'Generador de Propuestas',
    description: 'Propuestas comerciales profesionales',
    icon: '🤝',
    outputType: 'document',
    fields: [
      { id: 'service', label: 'Servicio/Producto', type: 'text', placeholder: 'Ej: Desarrollo de app móvil', required: true },
      { id: 'client_need', label: 'Necesidad del cliente', type: 'textarea', placeholder: 'Describe qué necesita el cliente...', required: true },
      { id: 'company', label: 'Tu empresa', type: 'text', placeholder: 'Nombre de tu empresa', required: false },
    ],
    systemPrompt: 'Genera una propuesta comercial profesional en Markdown. Incluye: 1) Portada, 2) Resumen ejecutivo, 3) Entendimiento del problema, 4) Solución propuesta, 5) Metodología, 6) Alcance y entregables, 7) Cronograma, 8) Equipo, 9) Inversión/Precios (usar tabla con rangos), 10) Garantías, 11) Próximos pasos. Tono profesional y persuasivo.',
  },
  'checklist-sop': {
    id: 'checklist-sop',
    name: 'Generador de Checklists/SOPs',
    description: 'Procedimientos operativos estándar',
    icon: '✅',
    outputType: 'document',
    fields: [
      { id: 'process', label: 'Proceso', type: 'text', placeholder: 'Ej: Deploy a producción', required: true },
      { id: 'details', label: 'Detalles del proceso', type: 'textarea', placeholder: 'Describe los pasos conocidos, herramientas usadas...', required: true },
      { id: 'type', label: 'Tipo', type: 'select', placeholder: '', required: false, options: [
        { value: 'checklist', label: 'Checklist' },
        { value: 'sop', label: 'SOP (Procedimiento)' },
      ]},
    ],
    systemPrompt: 'Genera un checklist o SOP detallado en Markdown. Incluye: 1) Objetivo del proceso, 2) Alcance, 3) Prerrequisitos, 4) Pasos detallados con checkboxes, 5) Puntos de verificación, 6) Errores comunes y soluciones, 7) Contactos de escalamiento. Usa formato claro con checkboxes markdown.',
  },
  'swot-analysis': {
    id: 'swot-analysis',
    name: 'Análisis FODA/SWOT',
    description: 'Análisis estratégico FODA completo',
    icon: '🔍',
    outputType: 'document',
    fields: [
      { id: 'subject', label: 'Sujeto del análisis', type: 'text', placeholder: 'Ej: Startup de fintech, Producto X', required: true },
      { id: 'context', label: 'Contexto e industria', type: 'textarea', placeholder: 'Describe la situación actual, mercado, competencia...', required: true },
    ],
    systemPrompt: 'Genera un análisis FODA/SWOT completo en Markdown. Organiza en 4 cuadrantes con tabla: Fortalezas (internos positivos), Debilidades (internos negativos), Oportunidades (externos positivos), Amenazas (externos negativos). Para cada punto incluye descripción detallada. Agrega sección de estrategias cruzadas (FO, FA, DO, DA) y plan de acción. Usa tablas markdown para la matriz.',
  },
  'okr-generator': {
    id: 'okr-generator',
    name: 'Generador de OKRs',
    description: 'Objectives and Key Results profesionales',
    icon: '🎯',
    outputType: 'document',
    fields: [
      { id: 'team', label: 'Equipo/Departamento', type: 'text', placeholder: 'Ej: Equipo de Ingeniería', required: true },
      { id: 'period', label: 'Período', type: 'select', placeholder: '', required: true, options: [
        { value: 'q1', label: 'Q1' }, { value: 'q2', label: 'Q2' },
        { value: 'q3', label: 'Q3' }, { value: 'q4', label: 'Q4' },
        { value: 'annual', label: 'Anual' },
      ]},
      { id: 'focus', label: 'Áreas de enfoque', type: 'textarea', placeholder: 'Describe las prioridades y metas principales...', required: true },
    ],
    systemPrompt: 'Genera OKRs profesionales en Markdown. Para cada Objetivo incluye: descripción clara, 3-5 Key Results medibles con métricas específicas, iniciativas/acciones para lograrlos, y owner sugerido. Incluye 3-5 objetivos. Usa el formato: "O1: [Objetivo]" → "KR1.1: [Key Result con métrica]". Agrega sección de alineamiento y dependencias.',
  },
  'test-cases': {
    id: 'test-cases',
    name: 'Generador de Casos de Prueba',
    description: 'Test cases detallados',
    icon: '🧪',
    outputType: 'document',
    fields: [
      { id: 'feature', label: 'Feature a probar', type: 'text', placeholder: 'Ej: Login con OAuth', required: true },
      { id: 'requirements', label: 'Requisitos funcionales', type: 'textarea', placeholder: 'Describe los requisitos que deben probarse...', required: true },
      { id: 'test_type', label: 'Tipo de prueba', type: 'select', placeholder: '', required: false, options: [
        { value: 'functional', label: 'Funcional' },
        { value: 'integration', label: 'Integración' },
        { value: 'e2e', label: 'End-to-End' },
        { value: 'regression', label: 'Regresión' },
      ]},
    ],
    systemPrompt: 'Genera casos de prueba detallados en Markdown. Para cada test case incluye: ID, título, prioridad, precondiciones, datos de prueba, pasos detallados (numerados), resultado esperado, y resultado real (vacío para llenar). Incluye casos positivos, negativos y edge cases. Usa tablas markdown para organizar.',
  },
  'changelog': {
    id: 'changelog',
    name: 'Generador de Changelog',
    description: 'Release notes y changelogs profesionales',
    icon: '📦',
    outputType: 'document',
    fields: [
      { id: 'version', label: 'Versión', type: 'text', placeholder: 'Ej: v2.1.0', required: true },
      { id: 'changes', label: 'Lista de cambios', type: 'textarea', placeholder: 'Lista los cambios realizados, bugs corregidos, features nuevas...', required: true },
      { id: 'audience', label: 'Audiencia', type: 'select', placeholder: '', required: false, options: [
        { value: 'technical', label: 'Técnica (desarrolladores)' },
        { value: 'business', label: 'Negocio (clientes)' },
        { value: 'mixed', label: 'Mixta' },
      ]},
    ],
    systemPrompt: 'Genera un changelog/release notes profesional en Markdown siguiendo la convención Keep a Changelog. Categoriza en: ✨ Added (nuevas features), 🔄 Changed (cambios), 🐛 Fixed (bugs), 🗑️ Deprecated, 🔒 Security. Incluye resumen ejecutivo, breaking changes si aplican, y instrucciones de migración. Formato claro y escaneable.',
  },

  // ---- DIAGRAM GENERATORS ----
  'bpmn-diagram': {
    id: 'bpmn-diagram',
    name: 'Diagrama BPMN',
    description: 'Diagramas de procesos de negocio',
    icon: '🔀',
    outputType: 'diagram',
    fields: [
      { id: 'process', label: 'Proceso a diagramar', type: 'text', placeholder: 'Ej: Proceso de aprobación de compras', required: true },
      { id: 'details', label: 'Detalles del proceso', type: 'textarea', placeholder: 'Describe los pasos, roles, decisiones...', required: true },
      { id: 'actors', label: 'Actores/Roles', type: 'text', placeholder: 'Ej: Solicitante, Gerente, Finanzas', required: false },
    ],
    systemPrompt: 'Genera ÚNICAMENTE un diagrama en formato Mermaid (flowchart) que represente un proceso de negocio BPMN. Usa subgraphs para swimlanes de cada actor/rol. Incluye nodos de inicio (círculo), decisiones (diamante), actividades (rectángulo) y fin (doble círculo). Usa la sintaxis correcta de Mermaid flowchart TD. NO incluyas explicación, SOLO el código Mermaid. Comienza directamente con ```mermaid',
  },
  'sequence-diagram': {
    id: 'sequence-diagram',
    name: 'Diagrama de Secuencia',
    description: 'Diagramas de secuencia UML',
    icon: '⬇️',
    outputType: 'diagram',
    fields: [
      { id: 'interaction', label: 'Interacción a diagramar', type: 'text', placeholder: 'Ej: Flujo de autenticación OAuth2', required: true },
      { id: 'components', label: 'Componentes/Actores', type: 'text', placeholder: 'Ej: Browser, API, Auth Server, DB', required: true },
      { id: 'details', label: 'Detalles de la interacción', type: 'textarea', placeholder: 'Describe los pasos de la interacción...', required: false },
    ],
    systemPrompt: 'Genera ÚNICAMENTE un diagrama de secuencia en formato Mermaid. Usa la sintaxis sequenceDiagram. Incluye participantes, mensajes (->>, -->>), notas, loops, alt/else, y activaciones cuando corresponda. NO incluyas explicación, SOLO el código Mermaid. Comienza directamente con ```mermaid',
  },
  'flow-diagram': {
    id: 'flow-diagram',
    name: 'Diagrama de Flujo',
    description: 'Diagramas de flujo para procesos y algoritmos',
    icon: '📊',
    outputType: 'diagram',
    fields: [
      { id: 'process', label: 'Proceso o algoritmo', type: 'text', placeholder: 'Ej: Algoritmo de recomendación', required: true },
      { id: 'details', label: 'Descripción detallada', type: 'textarea', placeholder: 'Describe los pasos, decisiones, condiciones...', required: true },
    ],
    systemPrompt: 'Genera ÚNICAMENTE un diagrama de flujo en formato Mermaid (flowchart TD). Usa nodos rectangulares para procesos, diamantes para decisiones, y bordes redondeados para inicio/fin. Conecta con flechas etiquetadas Sí/No en decisiones. NO incluyas explicación, SOLO el código Mermaid. Comienza directamente con ```mermaid',
  },
  'mindmap': {
    id: 'mindmap',
    name: 'Mapa Mental',
    description: 'Mapas mentales y conceptuales',
    icon: '🧠',
    outputType: 'diagram',
    fields: [
      { id: 'topic', label: 'Tema central', type: 'text', placeholder: 'Ej: Estrategia de marketing digital', required: true },
      { id: 'subtopics', label: 'Subtemas o áreas', type: 'textarea', placeholder: 'Lista las ramas principales que quieres explorar...', required: false },
    ],
    systemPrompt: 'Genera ÚNICAMENTE un mapa mental en formato Mermaid (mindmap). El nodo raíz debe ser el tema central, con 4-6 ramas principales y 2-4 sub-ramas cada una. Usa la sintaxis correcta de mindmap de Mermaid. NO incluyas explicación, SOLO el código Mermaid. Comienza directamente con ```mermaid',
  },
  'er-diagram': {
    id: 'er-diagram',
    name: 'Diagrama ER',
    description: 'Diagramas Entidad-Relación para bases de datos',
    icon: '🗄️',
    outputType: 'diagram',
    fields: [
      { id: 'system', label: 'Sistema/Dominio', type: 'text', placeholder: 'Ej: E-commerce, Sistema de inventario', required: true },
      { id: 'entities', label: 'Entidades principales', type: 'textarea', placeholder: 'Lista las entidades y sus atributos principales...', required: true },
    ],
    systemPrompt: 'Genera ÚNICAMENTE un diagrama Entidad-Relación en formato Mermaid (erDiagram). Incluye entidades con sus atributos (PK, FK, tipos), relaciones con cardinalidad (||--o{, }|--|{, etc.). NO incluyas explicación, SOLO el código Mermaid. Comienza directamente con ```mermaid',
  },
  'gantt-chart': {
    id: 'gantt-chart',
    name: 'Diagrama de Gantt',
    description: 'Planificación temporal de proyectos',
    icon: '📈',
    outputType: 'diagram',
    fields: [
      { id: 'project', label: 'Proyecto', type: 'text', placeholder: 'Ej: Desarrollo de App Móvil', required: true },
      { id: 'phases', label: 'Fases y tareas', type: 'textarea', placeholder: 'Lista las fases, tareas, duraciones estimadas...', required: true },
      { id: 'start_date', label: 'Fecha de inicio', type: 'text', placeholder: 'Ej: 2026-01-15', required: false },
    ],
    systemPrompt: 'Genera ÚNICAMENTE un diagrama de Gantt en formato Mermaid (gantt). Incluye título, formato de fechas, secciones para cada fase del proyecto, tareas con duraciones reales, dependencias entre tareas, y hitos. Usa fechas y duraciones realistas. NO incluyas explicación, SOLO el código Mermaid. Comienza directamente con ```mermaid',
  },
  'class-diagram': {
    id: 'class-diagram',
    name: 'Diagrama de Clases',
    description: 'Diagramas de clases UML',
    icon: '🏗️',
    outputType: 'diagram',
    fields: [
      { id: 'system', label: 'Sistema/Módulo', type: 'text', placeholder: 'Ej: Sistema de pagos', required: true },
      { id: 'details', label: 'Clases y relaciones', type: 'textarea', placeholder: 'Describe las clases principales, sus atributos y métodos...', required: true },
    ],
    systemPrompt: 'Genera ÚNICAMENTE un diagrama de clases en formato Mermaid (classDiagram). Incluye clases con atributos (tipos), métodos (visibilidad +/-/#), relaciones (herencia, composición, agregación, asociación) con cardinalidad. NO incluyas explicación, SOLO el código Mermaid. Comienza directamente con ```mermaid',
  },
};

// ==========================================
// PUBLIC API
// ==========================================

/**
 * Get generator config by ID
 */
export function getGeneratorConfig(generatorId: string): GeneratorConfig | null {
  return GENERATOR_CONFIGS[generatorId] || null;
}

/**
 * Get all generator configs
 */
export function getAllGeneratorConfigs(): GeneratorConfig[] {
  return Object.values(GENERATOR_CONFIGS);
}

/**
 * Generate content using AI (Gemini) based on generator config and user input
 */
export async function generateContent(
  generatorId: string,
  inputs: Record<string, string>
): Promise<GeneratedOutput> {
  const config = GENERATOR_CONFIGS[generatorId];
  if (!config) throw new Error(`Generator "${generatorId}" not found`);

  // Build the user prompt from inputs
  const inputText = config.fields
    .filter(f => inputs[f.id])
    .map(f => `**${f.label}**: ${inputs[f.id]}`)
    .join('\n');

  const userPrompt = `Basándote en la siguiente información:\n\n${inputText}\n\nGenera el contenido solicitado.`;

  // Call Gemini API
  const response = await callGeminiAPI(config.systemPrompt, userPrompt);

  // Parse the response
  if (config.outputType === 'diagram') {
    const mermaidCode = extractMermaidCode(response);
    return {
      type: 'mermaid',
      content: mermaidCode,
      title: inputs[config.fields[0].id] || config.name,
    };
  }

  return {
    type: 'markdown',
    content: response,
    title: inputs[config.fields[0].id] || config.name,
  };
}

// ==========================================
// GEMINI API CALL
// ==========================================

async function callGeminiAPI(systemPrompt: string, userPrompt: string): Promise<string> {
  const model = MODELS.PRIMARY;
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${GOOGLE_API_KEY}`;

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      system_instruction: { parts: [{ text: systemPrompt }] },
      contents: [{ role: 'user', parts: [{ text: userPrompt }] }],
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 8192,
      },
    }),
  });

  if (!response.ok) {
    const err = await response.text();
    console.error('Gemini API error:', err);
    throw new Error('Error al generar contenido con AI');
  }

  const data = await response.json();
  const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) throw new Error('No se recibió contenido del modelo');

  return text;
}

// ==========================================
// MERMAID HELPERS
// ==========================================

/**
 * Extract Mermaid code from AI response (strips markdown fences)
 */
function extractMermaidCode(text: string): string {
  // Try to extract from ```mermaid ... ``` block
  const mermaidMatch = text.match(/```mermaid\s*\n([\s\S]*?)```/);
  if (mermaidMatch) return mermaidMatch[1].trim();

  // Try to extract from ``` ... ``` block
  const codeMatch = text.match(/```\s*\n([\s\S]*?)```/);
  if (codeMatch) return codeMatch[1].trim();

  // Return as-is (might already be raw mermaid)
  return text.trim();
}

/**
 * Render Mermaid diagram to SVG string
 */
export async function renderMermaidToSvg(code: string): Promise<string> {
  const mermaid = (await import('mermaid')).default;
  
  mermaid.initialize({
    startOnLoad: false,
    theme: 'dark',
    themeVariables: {
      primaryColor: '#00D4B3',
      primaryTextColor: '#FFFFFF',
      primaryBorderColor: '#00D4B3',
      lineColor: '#6C757D',
      secondaryColor: '#1E2329',
      tertiaryColor: '#0F1419',
      background: '#0A0D12',
      mainBkg: '#1E2329',
      nodeBorder: '#00D4B3',
      clusterBkg: '#1E2329',
      clusterBorder: '#6C757D',
      titleColor: '#FFFFFF',
      edgeLabelBackground: '#1E2329',
    },
    flowchart: { curve: 'basis', padding: 20 },
    sequence: { mirrorActors: false, bottomMarginAdj: 10 },
  });

  const id = `mermaid-${Date.now()}`;
  const { svg } = await mermaid.render(id, code);
  return svg;
}

// ==========================================
// EXPORT HELPERS
// ==========================================

/**
 * Export markdown content as PDF using jspdf
 */
export async function exportToPdf(content: string, title: string): Promise<void> {
  const { jsPDF } = await import('jspdf');
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });

  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 20;
  const maxWidth = pageWidth - margin * 2;
  let yPos = 25;

  // Title
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.text(title, margin, yPos);
  yPos += 12;

  // Date
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(128);
  doc.text(`Generado: ${new Date().toLocaleDateString('es-MX', { year: 'numeric', month: 'long', day: 'numeric' })}`, margin, yPos);
  yPos += 10;
  doc.setTextColor(0);

  // Divider
  doc.setDrawColor(200);
  doc.line(margin, yPos, pageWidth - margin, yPos);
  yPos += 8;

  // Process markdown content line by line
  const lines = content.split('\n');
  
  for (const line of lines) {
    // Check for page overflow
    if (yPos > doc.internal.pageSize.getHeight() - 20) {
      doc.addPage();
      yPos = 20;
    }

    const trimmed = line.trim();

    if (trimmed.startsWith('# ')) {
      yPos += 4;
      doc.setFontSize(16);
      doc.setFont('helvetica', 'bold');
      const headerText = trimmed.replace(/^#+ /, '');
      doc.text(headerText, margin, yPos);
      yPos += 8;
    } else if (trimmed.startsWith('## ')) {
      yPos += 3;
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      const headerText = trimmed.replace(/^#+ /, '');
      doc.text(headerText, margin, yPos);
      yPos += 7;
    } else if (trimmed.startsWith('### ')) {
      yPos += 2;
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      const headerText = trimmed.replace(/^#+ /, '');
      doc.text(headerText, margin, yPos);
      yPos += 6;
    } else if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      const bulletText = `• ${trimmed.replace(/^[-*] /, '')}`;
      const splitLines = doc.splitTextToSize(bulletText, maxWidth - 5);
      for (const sl of splitLines) {
        if (yPos > doc.internal.pageSize.getHeight() - 20) {
          doc.addPage();
          yPos = 20;
        }
        doc.text(sl, margin + 5, yPos);
        yPos += 5;
      }
    } else if (trimmed.startsWith('|')) {
      // Table row - render as plain text with monospace
      doc.setFontSize(8);
      doc.setFont('courier', 'normal');
      const tableText = trimmed.replace(/\|/g, ' | ').trim();
      doc.text(tableText, margin, yPos);
      yPos += 4;
    } else if (trimmed === '') {
      yPos += 3;
    } else {
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      const cleanText = trimmed.replace(/\*\*/g, '').replace(/`/g, '');
      const splitLines = doc.splitTextToSize(cleanText, maxWidth);
      for (const sl of splitLines) {
        if (yPos > doc.internal.pageSize.getHeight() - 20) {
          doc.addPage();
          yPos = 20;
        }
        doc.text(sl, margin, yPos);
        yPos += 5;
      }
    }
  }

  // Footer
  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(128);
    doc.text(
      `Página ${i} de ${totalPages} — Generado con SofLIA`,
      pageWidth / 2,
      doc.internal.pageSize.getHeight() - 10,
      { align: 'center' }
    );
  }

  doc.save(`${title.replace(/[^a-zA-Z0-9áéíóúñÁÉÍÓÚÑ ]/g, '_')}.pdf`);
}

/**
 * Export markdown content as downloadable .md file
 */
export function exportToMarkdown(content: string, title: string): void {
  const blob = new Blob([content], { type: 'text/markdown' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${title.replace(/[^a-zA-Z0-9áéíóúñÁÉÍÓÚÑ ]/g, '_')}.md`;
  a.click();
  URL.revokeObjectURL(url);
}

/**
 * Export SVG string as downloadable file
 */
export function exportSvg(svgContent: string, title: string): void {
  const blob = new Blob([svgContent], { type: 'image/svg+xml' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${title.replace(/[^a-zA-Z0-9áéíóúñÁÉÍÓÚÑ ]/g, '_')}.svg`;
  a.click();
  URL.revokeObjectURL(url);
}

/**
 * Export SVG as PNG using canvas
 */
export function exportSvgAsPng(svgContent: string, title: string): void {
  const svgBlob = new Blob([svgContent], { type: 'image/svg+xml;charset=utf-8' });
  const url = URL.createObjectURL(svgBlob);
  const img = new Image();
  
  img.onload = () => {
    const canvas = document.createElement('canvas');
    const scale = 2; // High DPI
    canvas.width = img.width * scale;
    canvas.height = img.height * scale;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    ctx.scale(scale, scale);
    ctx.drawImage(img, 0, 0);
    
    canvas.toBlob((blob) => {
      if (!blob) return;
      const pngUrl = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = pngUrl;
      a.download = `${title.replace(/[^a-zA-Z0-9áéíóúñÁÉÍÓÚÑ ]/g, '_')}.png`;
      a.click();
      URL.revokeObjectURL(pngUrl);
    }, 'image/png');
    
    URL.revokeObjectURL(url);
  };
  
  img.src = url;
}
