// app/api/admin/delete-user/route.ts
import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(req: Request) {
  try {
    const { userId } = await req.json() as { userId: string }
    if (!userId) return NextResponse.json({ error: 'userId required' }, { status: 400 })

    // Delete from auth (service role)
    const { error: delErr } = await supabaseAdmin.auth.admin.deleteUser(userId)
    if (delErr) return NextResponse.json({ error: delErr.message }, { status: 400 })

    // Also attempt to remove profile record (if exists)
    await supabaseAdmin.from('profiles').delete().eq('id', userId)

    return NextResponse.json({ ok: true })
  } catch (e: any) {
    return NextResponse.json({ error: e.message || 'Server error' }, { status: 500 })
  }
}
