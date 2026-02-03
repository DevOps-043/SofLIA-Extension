import { createClient } from '@supabase/supabase-js';
import { SUPABASE } from '../config';

// 1. Custom Storage Adapter for Chrome Extension
// Supabase needs a storage interface to persist the session.
// We use chrome.storage.local which is persistent across browser restarts.
const chromeStorageAdapter = {
  getItem: async (key: string): Promise<string | null> => {
    return new Promise((resolve) => {
      // Check if chrome.storage is available (might be undefined in some dev environments)
      if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local) {
        chrome.storage.local.get([key], (result) => {
          resolve(result[key] || null);
        });
      } else {
        // Fallback to localStorage for development
        resolve(localStorage.getItem(key));
      }
    });
  },
  setItem: async (key: string, value: string): Promise<void> => {
    return new Promise((resolve) => {
      if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local) {
        chrome.storage.local.set({ [key]: value }, () => resolve());
      } else {
        localStorage.setItem(key, value);
        resolve();
      }
    });
  },
  removeItem: async (key: string): Promise<void> => {
    return new Promise((resolve) => {
      if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local) {
        chrome.storage.local.remove([key], () => resolve());
      } else {
        localStorage.removeItem(key);
        resolve();
      }
    });
  },
};

// 2. Initialize Supabase Client
// Validate URL before creating client to prevent app crash
const isValidUrl = (url: string) => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

const supabaseUrl = isValidUrl(SUPABASE.URL) ? SUPABASE.URL : 'https://placeholder-project.supabase.co';
const supabaseKey = SUPABASE.ANON_KEY || 'placeholder-key';

if (!isValidUrl(SUPABASE.URL)) {
  console.warn('⚠️ Supabase URL is missing or invalid. Check your .env file.');
}

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    storage: chromeStorageAdapter,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

// Helper to check if Supabase is configured
export const isSupabaseConfigured = () => {
  return (
    SUPABASE.URL !== 'TU_SUPABASE_URL' && 
    SUPABASE.URL !== '' && 
    SUPABASE.ANON_KEY !== 'TU_SUPABASE_ANON_KEY'
  );
};
