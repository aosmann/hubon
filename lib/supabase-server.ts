import { createClient } from "@supabase/supabase-js"

export function supabaseService() {
  const url = process.env.SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !key) {
    throw new Error("Supabase Service Role env vars are missing")
  }
  return createClient(url, key, { auth: { persistSession: false } })
}
