import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { resolveAppMode, AppMode } from './appMode';

const rawUrl = import.meta.env.VITE_SUPABASE_URL;
const rawAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const rawDemoFlag = import.meta.env.VITE_DEMO_MODE;

export const currentAppMode: AppMode = resolveAppMode({
  url: rawUrl,
  anonKey: rawAnonKey,
  demoFlag: rawDemoFlag,
});

export const supabase: SupabaseClient | null = currentAppMode === 'real'
  ? createClient(rawUrl!, rawAnonKey!, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    })
  : null;

export const isSupabaseConfigured = (): boolean => {
  return currentAppMode === 'real';
};
