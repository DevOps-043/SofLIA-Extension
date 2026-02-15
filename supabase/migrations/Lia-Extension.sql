-- WARNING: This schema is for context only and is not meant to be run.
-- Table order and constraints may not be valid for execution.

CREATE TABLE public.api_keys (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  user_id uuid,
  provider text NOT NULL CHECK (provider = ANY (ARRAY['google'::text, 'openai'::text])),
  api_key text NOT NULL,
  is_system_default boolean DEFAULT false,
  is_active boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT api_keys_pkey PRIMARY KEY (id),
  CONSTRAINT api_keys_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id)
);
CREATE TABLE public.conversations (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  title text DEFAULT 'Nueva conversación'::text,
  mode text DEFAULT 'chat'::text,
  is_pinned boolean DEFAULT false,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  folder_id uuid,
  CONSTRAINT conversations_pkey PRIMARY KEY (id),
  CONSTRAINT conversations_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id),
  CONSTRAINT conversations_folder_id_fkey FOREIGN KEY (folder_id) REFERENCES public.folders(id)
);
CREATE TABLE public.folders (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  name text NOT NULL,
  description text,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT folders_pkey PRIMARY KEY (id),
  CONSTRAINT folders_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id)
);
CREATE TABLE public.meeting_action_items (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  session_id uuid NOT NULL,
  description text NOT NULL,
  assignee text,
  due_date date,
  status text DEFAULT 'pending'::text CHECK (status = ANY (ARRAY['pending'::text, 'in_progress'::text, 'completed'::text])),
  source_segment_id uuid,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT meeting_action_items_pkey PRIMARY KEY (id),
  CONSTRAINT meeting_action_items_session_id_fkey FOREIGN KEY (session_id) REFERENCES public.meeting_sessions(id),
  CONSTRAINT meeting_action_items_source_segment_id_fkey FOREIGN KEY (source_segment_id) REFERENCES public.transcript_segments(id)
);
CREATE TABLE public.meeting_exports (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  session_id uuid NOT NULL,
  export_type text DEFAULT 'pdf'::text CHECK (export_type = ANY (ARRAY['pdf'::text, 'txt'::text, 'docx'::text])),
  include_transcript boolean DEFAULT true,
  include_summary boolean DEFAULT true,
  include_action_items boolean DEFAULT true,
  file_url text,
  file_size_bytes integer,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT meeting_exports_pkey PRIMARY KEY (id),
  CONSTRAINT meeting_exports_session_id_fkey FOREIGN KEY (session_id) REFERENCES public.meeting_sessions(id)
);
CREATE TABLE public.meeting_sessions (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  user_id uuid NOT NULL,
  platform text NOT NULL CHECK (platform = ANY (ARRAY['google-meet'::text, 'zoom'::text])),
  title text,
  meeting_url text,
  start_time timestamp with time zone NOT NULL DEFAULT now(),
  end_time timestamp with time zone,
  duration_seconds integer,
  participants jsonb DEFAULT '[]'::jsonb,
  participant_count integer DEFAULT 1,
  summary text,
  summary_type text CHECK (summary_type = ANY (ARRAY['short'::text, 'detailed'::text, 'action_items'::text, 'executive'::text])),
  detected_language text DEFAULT 'es'::text CHECK (detected_language = ANY (ARRAY['es'::text, 'en'::text, 'pt'::text])),
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT meeting_sessions_pkey PRIMARY KEY (id),
  CONSTRAINT meeting_sessions_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id)
);
CREATE TABLE public.message_feedback (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  message_content text,
  model_used text,
  rating integer,
  feedback_type text,
  reason_category text,
  feedback_text text,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT message_feedback_pkey PRIMARY KEY (id),
  CONSTRAINT message_feedback_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id)
);
CREATE TABLE public.messages (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  conversation_id uuid NOT NULL,
  user_id uuid NOT NULL,
  role text NOT NULL CHECK (role = ANY (ARRAY['user'::text, 'model'::text])),
  content text,
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT messages_pkey PRIMARY KEY (id),
  CONSTRAINT messages_conversation_id_fkey FOREIGN KEY (conversation_id) REFERENCES public.conversations(id),
  CONSTRAINT messages_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id)
);
CREATE TABLE public.profiles (
  id uuid NOT NULL,
  email text,
  full_name text,
  avatar_url text,
  plan_type text DEFAULT 'free'::text,
  created_at timestamp with time zone DEFAULT now(),
  first_name text,
  last_name_p text,
  last_name_m text,
  phone text,
  nationality text,
  username text UNIQUE,
  preferred_primary_model text DEFAULT 'gemini-2.0-flash'::text,
  preferred_fallback_model text DEFAULT 'gemini-1.5-flash'::text,
  CONSTRAINT profiles_pkey PRIMARY KEY (id),
  CONSTRAINT profiles_id_fkey FOREIGN KEY (id) REFERENCES auth.users(id)
);
CREATE TABLE public.tools (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  author_id uuid,
  name text NOT NULL,
  description text NOT NULL,
  icon text DEFAULT '🔧'::text,
  category USER-DEFINED NOT NULL,
  system_prompt text NOT NULL,
  starter_prompts jsonb DEFAULT '[]'::jsonb,
  status USER-DEFINED DEFAULT 'pending'::tool_status,
  reviewed_by uuid,
  reviewed_at timestamp with time zone,
  rejection_reason text,
  usage_count integer DEFAULT 0,
  is_featured boolean DEFAULT false,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT tools_pkey PRIMARY KEY (id),
  CONSTRAINT tools_author_id_fkey FOREIGN KEY (author_id) REFERENCES auth.users(id),
  CONSTRAINT tools_reviewed_by_fkey FOREIGN KEY (reviewed_by) REFERENCES auth.users(id)
);
CREATE TABLE public.transcript_segments (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  session_id uuid NOT NULL,
  timestamp timestamp with time zone NOT NULL,
  relative_time_ms integer,
  speaker text,
  text text NOT NULL,
  is_lia_response boolean DEFAULT false,
  is_lia_invocation boolean DEFAULT false,
  language text DEFAULT 'es'::text,
  confidence double precision,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT transcript_segments_pkey PRIMARY KEY (id),
  CONSTRAINT transcript_segments_session_id_fkey FOREIGN KEY (session_id) REFERENCES public.meeting_sessions(id)
);
CREATE TABLE public.user_ai_settings (
  user_id uuid NOT NULL,
  primary_model text NOT NULL DEFAULT 'gemini-2.0-flash'::text,
  fallback_model text NOT NULL DEFAULT 'gemini-1.5-flash'::text,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  nickname text,
  occupation text,
  about_user text,
  tone_style text DEFAULT 'Profesional'::text,
  char_emojis text DEFAULT 'Auto'::text,
  custom_instructions text,
  thinking_mode text DEFAULT 'minimal'::text,
  CONSTRAINT user_ai_settings_pkey PRIMARY KEY (user_id),
  CONSTRAINT user_ai_settings_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id)
);
CREATE TABLE public.user_favorite_tools (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  tool_id uuid NOT NULL,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT user_favorite_tools_pkey PRIMARY KEY (id),
  CONSTRAINT user_favorite_tools_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id),
  CONSTRAINT user_favorite_tools_tool_id_fkey FOREIGN KEY (tool_id) REFERENCES public.tools(id)
);
CREATE TABLE public.user_tools (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  name text NOT NULL,
  description text,
  icon text DEFAULT '⚙️'::text,
  category USER-DEFINED,
  system_prompt text NOT NULL,
  starter_prompts jsonb DEFAULT '[]'::jsonb,
  is_favorite boolean DEFAULT false,
  usage_count integer DEFAULT 0,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT user_tools_pkey PRIMARY KEY (id),
  CONSTRAINT user_tools_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id)
);