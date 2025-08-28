// app/api/signed-url/route.ts
import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  throw new Error('Missing supabase env vars on server for signed url route')
}

const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)

export async function GET(req: Request) {
  try {
    const url = new URL(req.url)
    const filePath = url.searchParams.get('filePath')
    const seconds = Number(url.searchParams.get('expires') ?? '3600') // default 1 hour

    if (!filePath) return NextResponse.json({ error: 'filePath required' }, { status: 400 })

    const { data, error } = await supabaseAdmin
      .storage
      .from('assignments')
      .createSignedUrl(filePath, seconds)

    if (error) {
      console.error('signed url error', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ publicUrl: data.signedUrl })
  } catch (err: any) {
    console.error(err)
    return NextResponse.json({ error: err.message || 'Server error' }, { status: 500 })
  }
}
