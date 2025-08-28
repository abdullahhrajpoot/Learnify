import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(req: Request) {
  try {
    const { email, password, full_name, role } = await req.json() as {
      email: string, password: string, full_name: string, role: 'tutor'|'student'|'guardian'|'admin'
    }

    if (!email || !password || !full_name || !role) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
    }

    // 1) Create auth user (confirmed, with role in metadata)
    const { data: created, error: createErr } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { role }
    })
    if (createErr || !created.user) {
      return NextResponse.json({ error: createErr?.message || 'Create failed' }, { status: 400 })
    }

    const userId = created.user.id

    // 2) Ensure profile exists & set role + name (your insert trigger should create the row)
    const { error: upErr } = await supabaseAdmin
      .from('profiles')
      .update({ role, full_name })
      .eq('id', userId)

    if (upErr) {
      return NextResponse.json({ error: upErr.message }, { status: 400 })
    }

    return NextResponse.json({ ok: true, userId })
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || 'Server error' }, { status: 500 })
  }
}

