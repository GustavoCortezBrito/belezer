import "server-only";
import { createClient } from "@supabase/supabase-js";
import { supabaseEnv } from "@/lib/env";

/** Cliente com service role: as tabelas têm RLS sem políticas e só o servidor as acessa. */
export function criarSupabase() {
  const env = supabaseEnv();
  if (!env) return null;
  return createClient(env.url, env.chave, { auth: { persistSession: false } });
}
