import { NextResponse } from "next/server"
import { supabaseService } from "@/lib/supabase-server"
import bcrypt from "bcryptjs"

export async function POST(req: Request) {
  try {
    const { name, email, password } = (await req.json()) as {
      name: string
      email: string
      password: string
    }
    if (!name || !email || !password) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 })
    }

    const supabase = supabaseService()

    // Ensure no duplicate email
    const { data: existing, error: selErr } = await supabase
      .from("users")
      .select("id")
      .eq("email", email)
      .maybeSingle()

    if (selErr) {
      return NextResponse.json({ error: selErr.message }, { status: 500 })
    }
    if (existing) {
      return NextResponse.json({ error: "Email already in use" }, { status: 409 })
    }

    // Create user row
    const { data: userRow, error: insErr } = await supabase
      .from("users")
      .insert({ name, email })
      .select("id")
      .single()

    if (insErr || !userRow) {
      return NextResponse.json({ error: insErr?.message ?? "Failed to create user" }, { status: 500 })
    }

    // Store password hash
    const hash = await bcrypt.hash(password, 10)
    const { error: credErr } = await supabase.from("credentials").insert({
      user_id: userRow.id,
      password_hash: hash,
    })

    if (credErr) {
      // Rollback user if credentials failed
      await supabase.from("users").delete().eq("id", userRow.id)
      return NextResponse.json({ error: credErr.message }, { status: 500 })
    }

    return NextResponse.json({ ok: true })
  } catch (e: any) {
    return NextResponse.json({ error: e?.message ?? "Internal error" }, { status: 500 })
  }
}
