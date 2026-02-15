# SofLIA Extension - Project Documentation

## Overview

SofLIA Extension is a Chrome extension that serves as an AI-powered productivity assistant. It integrates with Google's Gemini models and multiple Supabase backends to provide:

- **Real-time chat** with AI using text and voice
- **Meeting transcription** for Google Meet with speaker detection
- **Web Agent** - Autonomous browser control with observe-act-verify loop
- **IRIS Project Hub** - Full project management (teams, projects, issues, cycles)
- **Tool Library** - Public/private prompt marketplace with AI document & diagram generators
- **Deep Research** mode with Google Search grounding
- **Image generation** and analysis
- **Maps integration** with location-based queries
- **Prompt Optimizer** for ChatGPT, Claude, and Gemini
- **SOFIA Auth** - Organization-level authentication

## Tech Stack

- **Frontend**: React 18 + TypeScript
- **Build**: Vite
- **Backend**: 4 Supabase instances (Lia local, SOFIA auth, Content Generator, IRIS project management)
- **AI**: Google Gemini API (2.5/3.0 models)
- **Diagrams**: Mermaid.js
- **PDF**: jsPDF
- **Maps**: Leaflet + React-Leaflet
- **Markdown**: react-markdown + remark-gfm
- **Animations**: Framer Motion
- **Manifest**: Chrome Extension Manifest V3

## Project Structure

```
src/
├── popup/                         # Main extension popup UI
│   ├── App.tsx                   # Main application component
│   ├── SettingsModal.tsx         # User settings (API keys, preferences)
│   ├── FeedbackModal.tsx         # Feedback collection
│   └── main.tsx                  # Popup entry point
├── sidepanel/                     # Chrome side panel UI
│   ├── App.tsx                   # Side panel application
│   └── main.tsx                  # Side panel entry point
├── components/
│   ├── MeetingPanel.tsx          # Meeting transcription UI
│   ├── MapViewer.tsx             # Google Maps integration (Leaflet)
│   ├── Auth.tsx                  # Authentication component
│   ├── ProjectHub.tsx            # IRIS project dashboard with chat input
│   ├── ProjectContextModal.tsx   # Project context configuration
│   ├── ProjectSuggestionModal.tsx # AI project suggestions
│   ├── ToolLibrary.tsx           # Public/private tool marketplace UI
│   ├── ToolEditorModal.tsx       # Create/edit private tools
│   └── ToolGeneratorModal.tsx    # AI document/diagram generator UI
├── services/
│   ├── gemini.ts                 # Core Gemini API service (chat, streaming)
│   ├── live-api.ts               # Live API WebSocket for voice
│   ├── web-agent.ts              # Autonomous browser control agent
│   ├── meet-detector.ts          # Google Meet CC activation & caption detection
│   ├── meet-transcription.ts     # MutationObserver-based caption reading
│   ├── meeting-storage.ts        # Supabase meeting data persistence
│   ├── speech-to-text.ts         # Google Cloud STT with speaker diarization
│   ├── iris-data.ts              # IRIS CRUD (teams, projects, issues, cycles)
│   ├── iris-actions.ts           # Parse & execute :::IRIS_ACTION::: blocks from Gemini
│   ├── tools.ts                  # Tool Library CRUD (public & private tools)
│   ├── tool-generators.ts        # AI document/diagram generation + PDF/Mermaid export
│   ├── api-keys.ts               # API key management (user/system, Supabase-stored)
│   ├── sofia-auth.ts             # SOFIA custom authentication service
│   └── tabs.ts                   # Tab content extraction utility
├── content/
│   └── index.ts                  # Content script (DOM interaction, accessibility tree, web agent actions)
├── background/
│   └── index.ts                  # Service worker (screenshot capture, message routing)
├── contexts/
│   └── AuthContext.tsx            # Authentication state provider
├── lib/
│   ├── supabase.ts               # Lia Supabase client (local data)
│   ├── sofia-client.ts           # SOFIA + Content Gen Supabase clients
│   └── iris-client.ts            # IRIS Supabase client + all IRIS types
├── prompts/
│   ├── index.ts                  # Barrel file - all prompt exports
│   ├── chat.ts                   # Primary chat prompt + deep research + analysis
│   ├── computer-use.ts           # Web agent system prompt + tool definitions
│   ├── prompt-optimizer.ts       # Prompt optimization for ChatGPT/Claude/Gemini
│   ├── security.ts               # Anti-jailbreak, phishing detection, sensitive domains
│   ├── training-cases.ts         # Training cases for web agent
│   └── utils.ts                  # Template prompts (transcription, image gen, summaries)
└── config.ts                     # API keys, model config, Supabase URLs
```

## Configuration

### Environment Variables (.env)

```env
# Google AI
VITE_GOOGLE_API_KEY=your_google_api_key

# Lia Supabase (local data: conversations, meetings, tools)
VITE_SUPABASE_URL=your_lia_supabase_url
VITE_SUPABASE_ANON_KEY=your_lia_supabase_key

# SOFIA Supabase (auth + organizations/teams)
VITE_SOFIA_SUPABASE_URL=your_sofia_supabase_url
VITE_SOFIA_SUPABASE_ANON_KEY=your_sofia_supabase_key

# Content Generator Supabase
VITE_CONTENT_GEN_SUPABASE_URL=your_content_gen_url
VITE_CONTENT_GEN_SUPABASE_ANON_KEY=your_content_gen_key

# IRIS Project Management Supabase
VITE_IRIS_SUPABASE_URL=your_iris_supabase_url
VITE_IRIS_SUPABASE_ANON_KEY=your_iris_supabase_key
```

### Model Configuration (config.ts)

```typescript
export const MODELS = {
  PRIMARY: "gemini-3-flash-preview",      // Main chat model
  FALLBACK: "gemini-2.5-flash",           // Stable fallback
  WEB_AGENT: "gemini-3-flash-preview",    // Browser control (Computer Use)
  IMAGE_GENERATION: "gemini-2.5-flash-image",
  DEEP_RESEARCH: "deep-research-pro-preview-12-2025",
  LIVE: "gemini-2.5-flash-native-audio-preview-12-2025", // Voice/Audio WebSocket
  TRANSCRIPTION: "gemini-2.5-flash",      // Audio transcription
  PRO: "gemini-3-pro-preview",            // Complex reasoning / Prompt Engineering
  MAPS: "gemini-2.5-flash",              // Maps grounding (not available in Gemini 3)
};
```

## Key Features

### 1. Web Agent (Browser Control)

Autonomous browser control using Gemini function calling with an observe-act-verify loop. Captures screenshots + accessibility tree, sends to Gemini, executes returned tool calls.

**Architecture** (`web-agent.ts`):
```
1. Get active tab → ensure content script
2. OBSERVE: Capture accessibility tree + screenshot
3. THINK: Send to Gemini with conversation history
4. ACT: Execute function calls (click, type, navigate, etc.)
5. VERIFY: Feed results back to Gemini → loop
```

**Available Tools**: `click_element`, `type_text`, `scroll_page`, `press_key`, `navigate`, `go_back`, `wait_and_observe`, `select_option`, `hover_element`, `open_new_tab`, `switch_tab`, `list_tabs`, `task_complete`, `task_failed`

**Key Files:**
- `web-agent.ts` - Main agent loop (observe-act-verify)
- `prompts/computer-use.ts` - System prompt + tool definitions
- `content/index.ts` - Accessibility tree builder + action executor

### 2. IRIS Project Hub

Full project management integration via IRIS Supabase. Lia can read and write teams, projects, issues, cycles, milestones.

**How it works:**
- `iris-data.ts` detects project-related keywords in user messages (`needsIrisData()`)
- `buildIrisContext()` fetches teams, projects, issues, statuses, priorities
- Context is injected into the Gemini prompt
- Gemini responds with `:::IRIS_ACTION:::` blocks for write operations
- `iris-actions.ts` parses and executes these action blocks

**Supported Actions**: `create_project`, `update_project`, `create_issue`, `update_issue`, `add_comment`, `create_cycle`, `create_milestone`

**Key Files:**
- `lib/iris-client.ts` - Supabase client + all TypeScript interfaces
- `services/iris-data.ts` - CRUD operations + context builder
- `services/iris-actions.ts` - Action block parser & executor
- `components/ProjectHub.tsx` - Dashboard UI

### 3. Tool Library & Generators

Marketplace for AI-powered productivity tools with public (curated) and private (user-created) tools.

**Tool Types:**
- **Prompt Tools** - Pre-configured system prompts for specific tasks
- **Generator Tools** - AI-powered document & diagram generators

**Document Generators**: PDF reports, PRDs, user stories, SOW, meeting minutes, project plans, emails, presentations, proposals, checklists/SOPs, SWOT analysis, OKRs, test cases, changelogs

**Diagram Generators** (Mermaid.js): BPMN, sequence, flow, mindmap, ER, Gantt, class diagrams

**Export Formats**: PDF (jsPDF), Markdown, SVG, PNG

**Key Files:**
- `services/tools.ts` - Tool CRUD (public & private)
- `services/tool-generators.ts` - Generator configs + AI generation + export
- `components/ToolLibrary.tsx` - Marketplace UI
- `components/ToolGeneratorModal.tsx` - Generator form UI

### 4. Meeting Transcription (Google Meet)

Real-time caption reading and transcription from Google Meet.

**Flow:**
```
1. Content script detects Google Meet
2. CC/subtitle button activated via broad selector scan or 'c' key fallback
3. Caption containers found via aria-live="polite"/"assertive", role="region/log/status"
4. MutationObserver reads captions with 1.5s debounce
5. Speaker detected from DOM (participant tiles, speaking indicators)
6. Transcription displayed in MeetingPanel UI
```

**Important Notes:**
- NEVER hide captions with display:none/visibility:hidden/height:0 (use clip-path+opacity)
- Google Meet stops updating captions if container dimensions change
- CC button selectors must be broad (aria-label, data-tooltip, material icons, toolbar scan)

**Key Files:**
- `services/meet-detector.ts` - CC activation, button/caption container finding
- `services/meet-transcription.ts` - MutationObserver-based caption reading
- `components/MeetingPanel.tsx` - Transcription UI

### 5. SOFIA Authentication

Custom authentication via the SOFIA platform (not Supabase Auth).

**Flow:**
```
1. User enters email/username + password
2. RPC call to SOFIA's authenticate_user function
3. Fetch user profile (organizations, teams, memberships)
4. Store session in chrome.storage (24h expiry)
5. Provide pseudo-session for Supabase compatibility
```

**Key Files:**
- `lib/sofia-client.ts` - SOFIA + Content Gen Supabase clients
- `services/sofia-auth.ts` - SofiaAuthService class

### 6. Live Voice Chat

Real-time voice conversation using WebSocket connection.

**Flow:**
```
1. User clicks microphone button
2. WebSocket connects to Gemini Live API
3. Audio captured from user microphone
4. PCM audio (16kHz) sent via WebSocket
5. Lia responds with text + audio
6. Audio played back via AudioContext (24kHz)
```

### 7. Prompt System (prompts/)

Modular prompt architecture organized by domain:

| File | Purpose |
|------|---------|
| `chat.ts` | Primary chat prompt, deep research, context cleaning |
| `computer-use.ts` | Web agent system prompt + function calling tool definitions |
| `prompt-optimizer.ts` | Optimize prompts for ChatGPT, Claude, Gemini |
| `security.ts` | Anti-jailbreak, phishing detection, sensitive domain blocking |
| `training-cases.ts` | Training examples for web agent |
| `utils.ts` | Templates for transcription, image gen, summaries, translations |
| `index.ts` | Barrel file re-exporting all prompts |

### 8. API Key Management

Supabase-stored API keys with user/system fallback mechanism.

- Each user can have their own API key per provider
- System default key used as fallback
- 5-minute in-memory cache to reduce DB calls
- Key validation against provider APIs

## Database Schema

### Lia Supabase (local data)

**conversations**: id, user_id, title, messages, created_at, updated_at, folder_id

**meeting_sessions**: id, user_id, platform, title, start_time, end_time, participants, detected_language, metadata, summary, action_items

**meeting_transcripts**: id, session_id, speaker, text, timestamp, relative_time_ms, is_lia_response, is_lia_invocation

**tools**: id, author_id, name, description, icon, category, system_prompt, starter_prompts, status (pending/approved/rejected), tool_type (prompt/tool), generator_id, output_formats, usage_count, is_featured

**user_tools**: id, user_id, name, description, icon, category, system_prompt, starter_prompts, is_favorite, usage_count

**user_favorite_tools**: id, user_id, tool_id

**api_keys**: id, user_id, provider, api_key, is_system_default, is_active

### SOFIA Supabase (auth + orgs)

**users**: id, username, email, first_name, last_name, display_name, cargo_rol, profile_picture_url

**organizations**: id, name, slug, subscription_plan, subscription_status, brand_color_primary

**organization_users**: id, organization_id, user_id, role, status, job_title, team_id

**organization_teams**: id, organization_id, zone_id, name, is_active

### IRIS Supabase (project management)

**teams**: team_id, name, slug, status, visibility, owner_id

**team_members**: member_id, team_id, user_id, role, is_active

**pm_projects**: project_id, project_key, project_name, project_status, health_status, priority_level, completion_percentage, team_id

**pm_project_members**: member_id, project_id, user_id, project_role, permissions

**pm_milestones**: milestone_id, project_id, milestone_name, milestone_status, target_date, sort_order

**task_issues**: issue_id, team_id, issue_number, title, description, status_id, priority_id, project_id, cycle_id, assignee_id

**task_issue_comments**: comment_id, issue_id, body, author_id

**task_cycles**: cycle_id, team_id, name, start_date, end_date, status

**task_statuses**: status_id, team_id, name, status_type, position, is_default

**task_priorities**: priority_id, name, level, color

**task_labels**: label_id, team_id, name, color

**notifications**: notification_id, recipient_id, title, message, type, is_read

**account_users**: user_id, first_name, last_name_paternal, username, email, permission_level, account_status

## Development

### Build Commands

```bash
npm run build    # Production build (tsc && vite build)
npm run dev      # Development with watch
```

### Loading Extension

1. Build the project
2. Open `chrome://extensions/`
3. Enable "Developer mode"
4. Click "Load unpacked"
5. Select the `dist` folder

## Architecture Notes

### Message Flow
```
Content Script ←→ Background (service worker) ←→ Popup/SidePanel
                                                 ↕
                                            Gemini API
                                            Supabase (x4)
```

### Web Agent Action Flow
```
User Request → Gemini (function calling) → Content Script (DOM action) → Screenshot → Gemini → ...loop
```

### IRIS Action Flow
```
User Message → needsIrisData() → buildIrisContext() → Gemini prompt
Gemini Response → hasIrisActions() → parseIrisActions() → executeAllIrisActions() → Supabase IRIS
```

### Supabase Clients
| Client | Purpose | Storage Key |
|--------|---------|-------------|
| `supabase` (lib/supabase.ts) | Local data | `sb-auth-token` |
| `sofiaSupa` (lib/sofia-client.ts) | Auth + orgs | `sofia-auth-token` |
| `contentGenSupa` (lib/sofia-client.ts) | Content gen | `content-gen-auth-token` |
| `irisSupa` (lib/iris-client.ts) | Project mgmt | `iris-auth-token` |

## Known Limitations

1. **Speaker Detection**: DOM selectors may break with Google Meet UI updates
2. **Live API Session**: 15-minute timeout requires reconnection
3. **Web Agent**: Cannot interact with chrome://, chrome-extension://, or about: pages
4. **Web Agent**: Max 50 steps per task, 3 consecutive errors trigger stop
5. **Maps Grounding**: Not available in Gemini 3, must use Gemini 2.5
6. **SOFIA Auth**: Sessions expire after 24 hours (no auto-refresh without Supabase Auth)
7. **Caption Hiding**: Must use clip-path+opacity, never display:none/visibility:hidden
