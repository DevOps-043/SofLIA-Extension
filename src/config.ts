
export const GOOGLE_API_KEY = "22312";

// Model Configurations - User specified models
export const MODELS = {
  PRIMARY: "gemini-3-flash",  // Modelo principal con Google Search
  FALLBACK: "gemini-3-pro",  // Fallback estable
  COMPUTER_USE: "gemini-2.0-flash-exp",  // Para acciones [ACTION:...]
  IMAGE_GENERATION: "gemini-2.5-flash-image",
  DEEP_RESEARCH: "deep-research-pro-preview",
  LIVE: "	gemini-2.5-flash-native-audio-preview-12-2025",
};

// Live API URL
export const LIVE_API_URL = "wss://generativelanguage.googleapis.com/ws/google.ai.generativelanguage.v1alpha.GenerativeService/BidiGenerateContent";
