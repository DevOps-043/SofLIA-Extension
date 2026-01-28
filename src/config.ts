
export const GOOGLE_API_KEY = "AIzaSyBzangmhQQpH331akjbdNvaFEDvpbEb2Q8";

// Model Configurations - User specified models
export const MODELS = {
  PRIMARY: "gemini-3-flash-preview",
  FALLBACK: "gemini-3-pro-preview", 
  COMPUTER_USE: "gemini-2.5-computer-use-preview-10-2025",
  IMAGE_GENERATION: "gemini-2.5-flash-image",
  DEEP_RESEARCH: "deep-research-pro-preview-12-2025",
  LIVE: "gemini-2.0-flash-exp",
};

// Live API URL
export const LIVE_API_URL = "wss://generativelanguage.googleapis.com/ws/google.ai.generativelanguage.v1alpha.GenerativeService/BidiGenerateContent";
