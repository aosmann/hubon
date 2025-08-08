import { NextResponse } from "next/server"
import { supabaseService } from "@/lib/supabase-server"

// Lightweight API to list published templates
export async function GET() {
  try {
    const supabase = supabaseService()
    const { data, error } = await supabase
      .from("templates")
      .select("slug, title, category, ratios")
      .eq("published", true)
      .order("title")

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
    return NextResponse.json(data ?? [])
  } catch (e: any) {
    return NextResponse.json({ error: e?.message ?? "Internal error" }, { status: 500 })
  }
}
