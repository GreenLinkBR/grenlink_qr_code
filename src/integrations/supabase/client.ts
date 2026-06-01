import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://rpozkliqyaxxurvsksml.supabase.co";
const SUPABASE_PUBLISHABLE_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJwb3prbGlxeWF4eHVydnNrc21sIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODAzMjgzODcsImV4cCI6MjA5NTkwNDM4N30.XTskm3KMrcggrZ01s_FFf3lprl9x9WV0WkL-eC0CWCg";

export const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    storage: typeof window !== "undefined" ? window.localStorage : undefined,
  },
});
