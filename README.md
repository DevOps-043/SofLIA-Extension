# 🔷 SOFLIA Agent (Alpha)

![Version](https://img.shields.io/badge/version-1.1.0-blue.svg?style=flat-square)
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
3. [Motor de Contexto & Proyectos](#-motor-de-contexto--proyectos)
   - [Centro de Comando](#-centro-de-comando)
   - [Inyección de Memoria](#-inyección-de-memoria)
   - [Estándares de Nomenclatura](#-estándares-de-nomenclatura)
4. [Arquitectura Técnica](#-arquitectura-técnica)
   - [Stack Tecnológico](#-stack-tecnológico)
   - [Estructura del Proyecto](#-estructura-del-proyecto)
   - [Servicios Clave](#-servicios-clave)
5. [Guía de Instalación](#-guía-de-instalación)
6. [Configuración](#-configuración)
7. [Solución de Problemas](#-solución-de-problemas)
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
- **Manejo de Sesiones**: Sistema inteligente que gestiona la ventana de contexto de 15 minutos, auto-reconectando silenciosamente si la sesión expira.
- **Personalidad Sonora**: Utiliza la voz `Aoede` (predefinida por Google) para ofrecer un tono profesional, calmado y empático.

#### Implementación Técnica:

- Usa `src/services/live-api.ts` para manejar el stream de audio PCM a 24kHz.
- Implementa `AudioContext` nativo del navegador para reproducción sin lag.
- Utiliza **Offscreen Documents** para capturar el micrófono en segundo plano, superando las limitaciones de Manifest V3.

---

### 🖥️ Agentic Computer Use (Beta)

SOFLIA puede interactuar directamente con las páginas web que visitas, actuando como un operador humano.

#### ¿Cómo funciona?

1. **Análisis del DOM**: El content script (`content/index.ts`) inyecta un analizador que mapea todos los elementos interactivos de la página.
2. **Accessibility Tree**: Genera un árbol simplificado de la página, asignando un ID único (`data-lia-ref`) a cada botón, input o enlace importante.
3. **Set-of-Marks (SoM)**: Visualmente, superpone etiquetas naranjas con IDs sobre los elementos, permitiendo que el modelo de visión "vea" exactamente dónde hacer clic.
4. **Ejecución de Acciones**:
   - `click`: Simula clics humanos (mousedown, mouseup, click).
   - `type`: Escribe en campos de texto, compatible con React/Vue (dispara eventos sintéticos).
   - `scroll`: Desplaza la página inteligente para encontrar información.
   - `hover`: Simula el movimiento del mouse para revelar menús.

> **Caso de Uso**: "Entra a Amazon, busca 'Teclado mecánico', filtra por 4 estrellas y dime cuál es el más barato."

---

### 🔬 Deep Research Agent

Para preguntas complejas que requieren más que una simple búsqueda en Google, SOFLIA activa su modo de **Investigación Profunda**.

#### Flujo de Trabajo:

1. **Detección de Intención**: El sistema analiza si tu prompt requiere profundidad (palabras clave como "investiga a fondo", "analiza el mercado").
2. **Agente Dedicado**: Cambia al modelo `deep-research-pro` (o simulación avanzada).
3. **Iteración**:
   - Genera un plan de investigación.
   - Ejecuta múltiples búsquedas paralelas.
   - Lee y sintetiza contenidos de diversas fuentes.
4. **Reporte Estructurado**: Entrega un artefacto final con:
   - Resumen Ejecutivo.
   - Análisis Detallado.
   - Fuentes Citadas.
   - Datos y Estadísticas.

**Fallback Inteligente**: Si el modelo Pro no está disponible, el sistema degrada elegantemente a `gemini-2.5-flash` con Grounding de Google Search, manteniendo la calidad alta.

---

### 🎙️ Meeting Intelligence

SOFLIA se integra nativamente en **Google Meet** para ser tu secretaria de reuniones perfecta.

#### Funcionalidades:

- **Auto-Detección**: Detecta automáticamente cuando entras a una URL de `meet.google.com`.
- **Transcripción en Tiempo Real**:
  - Activa los subtítulos (Closed Captions) de Meet automáticamente.
  - **Captura Invisible**: Oculta visualmente los subtítulos nativos (CSS injection) para no molestar, mientras lee el stream de texto internamente.
  - Identifica hablantes y tiempos.
- **Asistencia en Vivo**:
  - Puedes preguntarle a SOFLIA durante la reunión: "¿Qué acaba de decir Juan sobre el presupuesto?".
  - Genera minutas y action items al finalizar.

---

## 🧠 Motor de Contexto & Proyectos

La gran diferenciación de SOFLIA es que **no olvida**.

### 📂 Centro de Comando

Hemos reemplazado la lista plana de chats por un **Project Hub** visual.

- **Grid View**: Visualización de tarjetas para tus chats y recursos.
- **Interacción Directa**: No necesitas "entrar" a un chat para verlo. Puedes previsualizar, renombrar o mover conversaciones desde el hub.
- **Gestión de Archivos**: Adjunta documentos de contexto a nivel de proyecto, disponibles para todos los chats de esa carpeta.

### 🧠 Inyección de Memoria

Cuando chateas dentro de una carpeta (ej. "Lanzamiento Q3"), SOFLIA:

1. Recupera automáticamente los resúmenes y decisiones clave de _otros_ chats en esa misma carpeta.
2. Inyecta este contexto en el `System Prompt` de forma transparente.
3. Resultado: No tienes que repetirle "Recuerda que nuestro target son PyMEs", porque ya lo sabe del chat de la semana pasada.

### 🏷️ Estándares de Nomenclatura

Para mantener el orden, el sistema sugiere y valida nombres de proyectos bajo el estándar **SOFIA-STD-101**:

#### Estructura: `[CATEGORIA]-[NombreDescriptivo]`

| Categoría       | Prefijo | Uso                          | Ejemplo              |
| --------------- | ------- | ---------------------------- | -------------------- |
| **Estrategia**  | `EST-`  | Planes a largo plazo, visión | `EST-Roadmap2026`    |
| **Operación**   | `OPS-`  | Procesos diarios, reportes   | `OPS-ReporteMensual` |
| **Análisis**    | `ANA-`  | Investigación, benchmarks    | `ANA-Competencia`    |
| **Creatividad** | `CRE-`  | Copy, diseño, ideación       | `CRE-CampanaNavidad` |
| **Aprendizaje** | `APR-`  | Tutoriales, cursos           | `APR-CursoReact`     |
| **Desarrollo**  | `DEV-`  | Código, arquitectura         | `DEV-RefactorAPI`    |

---

## 🏗️ Arquitectura Técnica

### 🛠 Stack Tecnológico

- **Frontend**: React 18, TypeScript, Vite.
- **Estilos**: Tailwind CSS + Variables CSS (Sistema SOFIA).
- **Extension Framework**: Chrome Manifest V3.
- **Backend / BaaS**: Supabase (PostgreSQL para persistencia).
- **IA**: Google Gemini API (REST + WebSocket).
- **Audio**: Web Audio API + AudioWorklets.

### 📂 Estructura del Proyecto

```text
src/
├── background/         # Service Workers (Manejo de eventos Chrome)
│   ├── index.ts        # Entry point del background
│   └── offscreen.html  # Documento para captura de audio (Workaround V3)
├── components/         # Componentes UI (React)
│   ├── Cortex/         # Layout principal del "Centro de Comando"
│   ├── Chat/           # Lógica de chat y renderizado de mensajes
│   └── SOJ/            # Componentes del sistema de diseño SOFIA
├── content/            # Scripts inyectados en páginas web
│   ├── index.ts        # Lógica principal (Web Agent, Meet, Selection Popup)
│   └── styles.css      # Estilos inyectados
├── lib/
│   └── supabase.ts     # Cliente DB con adaptador de almacenamiento Chrome
├── popups/             # Interfaz principal de la extensión
│   └── App.tsx
├── prompts/            # Ingeniería de Prompts
│   ├── chat.ts         # System Prompts principales
│   ├── computer-use.ts # Definiciones de herramientas de navegación
│   └── utils.ts
├── services/           # Lógica de negocio y APIs
│   ├── gemini.ts       # Cliente principal de IA (Text/Vision/Tools)
│   ├── live-api.ts     # Cliente WebSocket para Audio/Voz
│   ├── audio/          # Procesadores de audio
│   └── meet-*.ts       # Lógica específica de Google Meet
└── types/              # Definiciones de TypeScript
```

### 🔑 Servicios Clave

#### `services/gemini.ts`

Maneja la lógica compleja de selección de modelos. Implementa "Thinking Config" para modelos que soportan cadena de pensamiento (Gemini 2.5/3.0). Incluye la lógica de **Deep Analysis Detection**: si detecta palabras clave de análisis profundo, cambia el `systemInstruction` por uno mucho más riguroso (ver línea 382).

#### `services/live-api.ts`

Una clase `LiveClient` robusta que maneja el ciclo de vida de la conexión WebSocket.

- **Buffer Management**: Sistema de cola (`audioQueue`) para asegurar reproducción suave del audio recibido.
- **AudioContext Health**: Reinicia el contexto de audio en periodos de silencio para evitar glitches de memoria.

#### `services/supabase.ts`

Adapta el cliente de Supabase para funcionar en una extensión. Reemplaza `localStorage` con `chrome.storage.local` para que la sesión del usuario persista incluso si cierra el navegador completamente.

---

## 🚀 Guía de Instalación

### Prerrequisitos

- Node.js 18+
- Cuenta de Google Cloud (para Gemini API)
- Proyecto de Supabase
- Navegador basado en Chromium (Chrome, Edge, Brave)

### 1. Clonar y Preparar

```bash
git clone https://github.com/tu-usuario/Is-Extension.git
cd Lia-Extension
npm install
```

### 2. Configuración de Variables

Crea un archivo `.env` en la raíz basada en `.env.example`:

```env
# Supabase Configuration
VITE_SUPABASE_URL=https://tu-proyecto.supabase.co
VITE_SUPABASE_ANON_KEY=tu-anon-key-publica

# Gemini API (AI Studio / Vertex AI)
VITE_GEMINI_API_KEY=tu-api-key-gemini

# Live API Endpoint (Generalmente fijo)
VITE_LIVE_API_URL=wss://generativelanguage.googleapis.com/ws/google.ai.generativelanguage.v1beta.GenerativeService.BidiGenerateContent

# Optional: Sofia Platform Integration
VITE_SOFIA_SUPABASE_URL=...
```

### 3. Base de Datos

Ejecuta los scripts SQL ubicados en la carpeta `/supabase` en el Editor SQL de tu dashboard de Supabase:

1. `users.sql`: Tabla de perfiles.
2. `folders.sql`: Tablas para carpetas y proyectos.
3. `conversations.sql`: Historial de chats.

### 4. Compilación

```bash
# Para desarrollo (watch mode)
npm run dev

# Para producción (genera carpeta /dist)
npm run build
```

### 5. Cargar en Chrome

1. Abre `chrome://extensions/`
2. Activa el "Modo de desarrollador" (esquina superior derecha).
3. Clic en "Cargar descomprimida" (Load unpacked).
4. Selecciona la carpeta `dist` generada en el paso anterior.
5. ¡Listo! Verás el icono de SOFLIA en tu barra de herramientas.

---

## 🔧 Solución de Problemas

### Error: "WebSocket connection failed"

- **Causa**: Tu API Key no tiene habilitada la API "Generative Language API" en Google Cloud Console.
- **Solución**: Ve a la consola de Google Cloud > APIs & Services > Habilitar API > Busca "Generative Language API".

### Error: "Audio capture failed"

- **Causa**: El navegador bloqueó el acceso al micrófono.
- **Solución**:
  1. Haz clic derecho en el icono de la extensión > Opciones (si existe) o abre la extensión.
  2. Asegúrate de conceder permisos de micrófono cuando el navegador lo solicite.
  3. Verifica que no tengas otra extensión capturando audio exclusivamente.

### El mapa no aparece

- **Causa**: El modelo no detectó la intención geográfica.
- **Solución**: Sé explícito. Usa palabras como "muéstrame en el mapa", "¿dónde queda?", "ubicación de...".
- **Nota**: El sistema usa `gemini-2.5-flash` para mapas, ya que es más estable con tool-calling que las versiones preview.

### Computer Use no hace clic

- **Causa**: La página tiene iFrames o Shadow DOM complejos que bloquean el content script.
- **Solución**: Actualmente en Beta. Intenta hacer scroll manual para que el elemento sea visible antes de pedir la acción.

---

## 🎨 Design System: SOFIA

Nuestro lenguaje visual es una parte crítica de la identidad del agente.

- **Colores Primarios**:
  - `Deep Blue`: `#0A2540` (Fondos, Paneles)
  - `Cyan Vivid`: `#00D4B3` (Acentos, Botones, Estados activos)
  - `Text Light`: `#E2E8F0` (Lecturabilidad)

- **Tipografía**:
  - Familia: `Inter` o `SF Pro Display`.
  - Escala: Títulos claros, cuerpos de texto con alto interlineado (1.6) para lectura cómoda.

- **Componentes**:
  - **Glassmorphism**: Uso extensivo de `backdrop-filter: blur(12px)` con bordes semitransparentes.
  - **Animaciones**: Transiciones suaves (200-300ms cubic-bezier). El chat usa una animación de "typewriter" para simular el pensamiento humano.

---

## 📜 Licencia y Créditos

Desarrollado por **Fernando Suarez**.
Este proyecto es software propietario en fase Alpha.

---

_Documentación actualizada automáticamente el 07 de Febrero de 2026._
