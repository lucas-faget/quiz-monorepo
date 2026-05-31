import { createClient } from "@supabase/supabase-js";

export function createSupabase(env: { SUPABASE_URL: string; SUPABASE_SECRET_KEY: string }) {
    return createClient(env.SUPABASE_URL, env.SUPABASE_SECRET_KEY);
}
