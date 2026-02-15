# 🔷 SOFLIA Agent (Alpha)

![Version](https://img.shields.io/badge/version-1.2.0-blue.svg?style=flat-square)
![React](https://img.shields.io/badge/React-18.0-61DAFB.svg?style=flat-square&logo=react)
![Gemini](https://img.shields.io/badge/AI-Gemini%20Multimodal-8E75B2.svg?style=flat-square&logo=google-gemini)
![Live API](https://img.shields.io/badge/Live-Enabled-red.svg?style=flat-square&logo=youtube-live)
![Supabase](https://img.shields.io/badge/Supabase-Database-3ECF8E.svg?style=flat-square&logo=supabase)
![Chrome Extension](https://img.shields.io/badge/Platform-Chrome%20Extension-4285F4.svg?style=flat-square&logo=google-chrome)

> **Asistente de Desarrollo & Curaduría Potenciado por IA**
> _"Más que un chat: Una IA viva, conectada, contextual y proactiva."_

---

## 📖 Índice

1. [Visión y Filosofía](#-visión-y-filosofía)
2. [Capacidades Core](#-capacidades-core)
   - [Multimodal Live API](#-multimodal-live-api)
   - [Agentic Computer Use](#-agentic-computer-use-beta)
   - [Deep Research Agent](#-deep-research-agent)
   - [Meeting Intelligence](#-meeting-intelligence)
3. [Ecosistema de Productividad](#-ecosistema-de-productividad)
   - [Project Hub & Gestión](#-project-hub--gestión)
   - [Suite de Herramientas IA](#-suite-de-herramientas-ia)
4. [Motor de Contexto](#-motor-de-contexto)
   - [Inyección de Memoria](#-inyección-de-memoria)
   - [Estándares de Nomenclatura](#-estándares-de-nomenclatura)
5. [Arquitectura Técnica](#-arquitectura-técnica)
   - [Modelo de Datos (Project Hub)](#-modelo-de-datos-project-hub)
   - [Estructura del Proyecto](#-estructura-del-proyecto)
6. [Guía de Instalación](#-guía-de-instalación)
7. [Configuración](#-configuración)
8. [Design System: SOFIA](#-design-system-sofia)

---

## 🔮 Visión y Filosofía

**SOFLIA Agent** (anteriormente Lia) no es simplemente otra extensión de chat. Representa una evolución hacia la **"Mentoría Aumentada"**. Diseñada para desarrolladores, creadores de contenido y estrategas, SOFLIA actúa como un par intelectual que vive en tu navegador.

A diferencia de los asistentes tradicionales que son reactivos (esperan tu input), SOFLIA es:

- **Contextual**: Entiende en qué proyecto estás trabajando gracias a su sistema de carpetas y memoria.
- **Conectada**: Tiene acceso real a la web, mapas y herramientas de sistema.
- **Multimodal**: Puede ver tu pantalla, escuchar tu voz y hablar contigo en tiempo real.
- **Agéntica**: Puede tomar control del navegador para navegar, hacer clic y escribir por ti cuando es necesario.

---

## 🌟 Capacidades Core

### ⚡ Multimodal Live API

El corazón de la experiencia "viva" de SOFLIA es su integración con la **Gemini Multimodal Live API** a través de WebSockets.

#### Características Principales:

- **Latencia Ultra-Baja**: Comunicación bidireccional casi instantánea.
- **Interrupción Natural (Voice Activity Detection)**: Puedes interrumpir a SOFLIA mientras habla, y ella se detendrá y escuchará, igual que en una llamada humana.
- **Manejo de Sesiones**: Sistema inteligente que gestiona la ventana de contexto de 15 minutos.
- **Personalidad Sonora**: Utiliza la voz `Aoede` para ofrecer un tono profesional y empático.

### 🖥️ Agentic Computer Use (Beta)

SOFLIA puede interactuar directamente con las páginas web que visitas, actuando como un operador humano.

#### ¿Cómo funciona?

1. **Análisis del DOM**: El content script inyecta un analizador que mapea elementos interactivos.
2. **Accessibility Tree**: Genera un árbol simplificado con IDs únicos (`data-lia-ref`).
3. **Set-of-Marks (SoM)**: Visualmente, superpone etiquetas naranjas con IDs sobre los elementos.
4. **Ejecución de Acciones**: Simula `click`, `type`, `scroll`, `hover` nativamente.

> **Caso de Uso**: "Entra a Amazon, busca 'Teclado mecánico', filtra por 4 estrellas y dime cuál es el más barato."

### 🔬 Deep Research Agent

Para preguntas complejas que requieren profundidad, SOFLIA activa su modo de **Investigación Profunda**.

#### Flujo de Trabajo:

1. **Agente Dedicado**: Cambia al modelo `deep-research-pro` (o simulación avanzada).
2. **Iteración**: Genera plan, ejecuta búsquedas paralelas, sintetiza fuentes.
3. **Reporte Estructurado**: Entrega un artefacto final con resumen ejecutivo, análisis detallado y fuentes citadas.

### 🎙️ Meeting Intelligence

SOFLIA se integra nativamente en **Google Meet** para ser tu secretaria de reuniones perfecta. Detecta URLs de Meet, activa subtítulos invisibles para capturar el diálogo y genera minutas o respuestas en tiempo real.

---

## 🚀 Ecosistema de Productividad

### 📂 Project Hub & Gestión

Hemos evolucionado de un simple chat a un **Sistema de Gestión de Proyectos Completo**. El nuevo esquema de base de datos (`pROJECT-hUB.sql`) soporta:

- **Workspaces & Teams**: Organización jerárquica para múltiples equipos.
- **Proyectos (PM)**: Gestión con estados, fechas clave y leads.
- **Issues & Tareas**: Sistema completo de tracking con ciclos, prioridades y asignaciones.
- **Vistas Personalizadas**: Kanban, Lista, Timeline.

### 🛠️ Suite de Herramientas IA

Incorpora **25+ Herramientas Especializadas** (`seed_productivity_tools.sql`) divididas en 5 categorías de alto impacto:

| Categoría         | Herramientas Clave                                                        |
| ----------------- | ------------------------------------------------------------------------- |
| **Productividad** | Consultor Agile/Scrum, Sprint Planning, Retrospectivas, Roadmap Generator |
| **Documentación** | Generador de Contratos, Políticas, Reportes Ejecutivos, Doc. Técnica      |
| **Análisis**      | Analista de Competencia, Business Model Canvas, PESTEL, Evaluador de KPIs |
| **Comunicación**  | Redactor de Prensa, Social Media Manager, Asistente de Negociación        |
| **Desarrollo**    | Code Reviewer, Arquitecto de Software, Diseñador de APIs, DevOps          |

Cada herramienta viene con un **System Prompt** optimizado por expertos y **Starter Prompts** para uso inmediato.

---

## 🧠 Motor de Contexto

### 🧠 Inyección de Memoria

Cuando chateas dentro de un proyecto (ej. "Lanzamiento Q3"), SOFLIA recupera automáticamente los resúmenes y decisiones de otros chats en ese contexto e inyecta esta información en el prompt, eliminando la necesidad de repetir contexto.

### 🏷️ Estándares de Nomenclatura

Utilizamos el sistema **SOFIA-STD-101** para nomenclatura de proyectos:

| Categoría       | Prefijo | Uso                          | Ejemplo              |
| --------------- | ------- | ---------------------------- | -------------------- |
| **Estrategia**  | `EST-`  | Planes a largo plazo, visión | `EST-Roadmap2026`    |
| **Operación**   | `OPS-`  | Procesos diarios, reportes   | `OPS-ReporteMensual` |
| **Análisis**    | `ANA-`  | Investigación, benchmarks    | `ANA-Competencia`    |
| **Creatividad** | `CRE-`  | Copy, diseño, ideación       | `CRE-CampanaNavidad` |
| **Desarrollo**  | `DEV-`  | Código, arquitectura         | `DEV-RefactorAPI`    |

---

## 🏗️ Arquitectura Técnica

### 🛠 Stack Tecnológico

- **Frontend**: React 18, TypeScript, Vite.
- **Estilos**: Tailwind CSS + Variables CSS (Sistema SOFIA).
- **Extension Framework**: Chrome Manifest V3.
- **Backend**: Supabase (PostgreSQL).
- **IA**: Google Gemini API (REST + WebSocket).

### 🗄️ Modelo de Datos (Project Hub)

El esquema de base de datos ha sido rediseñado para soportar aplicaciones de nivel empresarial. Archivos clave en `/supabase`:

1.  **`pROJECT-hUB.sql`**: Define `workspaces`, `teams`, `projects`, `tasks`, `issues`.
2.  **`seed_productivity_tools.sql`**: Pobla la tabla `tools` con los 25 agentes especializados.
3.  **`Lia-Extension.sql`**: Esquema base de la extensión (chats, mensajes, usuarios).

### 📂 Estructura del Proyecto

```text
src/
├── background/         # Service Workers (Manejo de eventos Chrome)
├── components/         # UI: ProjectHub, Chat, ToolsLibrary
├── content/            # Scripts inyectados (Web Agent, Meet)
├── lib/                # Clientes Supabase (Multi-tenant config)
├── prompts/            # System Prompts & Tool Definitions
├── services/           # Lógica de negocio (Gemini, Live API, Audio)
└── types/              # Definiciones TypeScript (DB Schema)
```

---

## 🚀 Guía de Instalación

### Prerrequisitos

- Node.js 18+
- Proyecto de Supabase
- Google Cloud API Key (Gemini)

### 1. Clonar y Dependencias

```bash
git clone https://github.com/tu-usuario/SofLIA-Extension.git
cd SofLIA-Extension
npm install
```

### 2. Configuración (.env)

Crea `.env` basado en `.env.example`:

```env
VITE_SUPABASE_URL=...
VITE_SUPABASE_ANON_KEY=...
VITE_GEMINI_API_KEY=...
VITE_LIVE_API_URL=wss://generativelanguage.googleapis.com/ws/google.ai.generativelanguage.v1beta.GenerativeService.BidiGenerateContent
```

### 3. Base de Datos (SQL Editor)

Ejecuta los scripts en este orden en Supabase:

1.  `Lia-Extension.sql` (Base)
2.  `pROJECT-hUB.sql` (Gestión de Proyectos)
3.  `seed_productivity_tools.sql` (Herramientas)

### 4. Compilación y Build

```bash
npm run build
# Genera la carpeta /dist lista para subir a Chrome
```

### 5. Empaquetado (Producción)

Para subir a Chrome Web Store, crea el .zip **solo con el contenido de dist**:

```powershell
cd dist
Compress-Archive -Path '.\*' -DestinationPath '..\SofLIA-Extension.zip' -Force
```

---

## 🎨 Design System: SOFIA

Nuestro lenguaje visual utiliza **Glassmorphism**, tipografía `Inter`, y una paleta de colores `Deep Blue` (`#0A2540`) con acentos `Cyan Vivid` (`#00D4B3`). Mantiene una estética profesional, limpia y futurista.

---

**Desarrollado por Fernando Suarez** | Software Propietario Alpha
_Documentación actualizada: 13 de Febrero de 2026_
