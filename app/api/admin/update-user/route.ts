// server-side, use SUPABASE_SERVICE_ROLE_KEY
import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseAdmin = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { userId, full_name, phone, role } = body as { userId:string, full_name?:string, phone?:string, role?:string }

    if (!userId) return NextResponse.json({ error: 'userId required' }, { status: 400 })

    // 1) Update profiles
    const { error: upErr } = await supabaseAdmin
      .from('profiles')
      .update({ full_name, phone, role })
      .eq('id', userId)

    if (upErr) return NextResponse.json({ error: upErr.message }, { status: 400 })

    // 2) Update auth user metadata so session.user.user_metadata.role matches
    const { error: metaErr } = await supabaseAdmin.auth.admin.updateUserById(userId, {
      user_metadata: { role }
    })

    if (metaErr) return NextResponse.json({ error: metaErr.message }, { status: 400 })

    return NextResponse.json({ ok: true })
  } catch (e:any) {
    return NextResponse.json({ error: e.message || 'Server error' }, { status: 500 })
  }
}
