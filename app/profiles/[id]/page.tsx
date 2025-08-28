// app/profiles/[id]/page.tsx
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export default async function ProfilePage({ params }: { params: { id: string } }) {
  const supabase = createServerComponentClient({ cookies })
  const { data: { session } } = await supabase.auth.getSession()

  if (!session) redirect('/login')

  const profileId = params.id
  // server-side auth: only admin or owner can view
  const { data: me } = await supabase.from('profiles').select('role').eq('id', session.user.id).single()
  if (!me) redirect('/')

  if (me.role !== 'admin' && session.user.id !== profileId) {
    // not allowed
    redirect('/')
  }

  // Fetch profile
  const [{ data: profile }, { data: tutorAssignments }, { data: sessions }, { data: expenses }] = await Promise.all([
    supabase.from('profiles').select('*').eq('id', profileId).single(),
    supabase.from('tutor_assignments').select('tutor_id, student_id').or(`tutor_id.eq.${profileId},student_id.eq.${profileId}`),
    supabase.from('sessions').select('*').or(`tutor_id.eq.${profileId},student_id.eq.${profileId}`).order('start_time', { ascending: false }).limit(200),
    supabase.from('expenses').select('*').eq('student_id', profileId).order('created_at', { ascending: false }).limit(200)
  ])

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Profile — {profile?.full_name || profileId}</h1>
      <div className="mt-4 space-y-4">
        <section className="border rounded p-4">
          <h3 className="font-semibold">Details</h3>
          <div className="text-sm text-gray-700">Role: {profile?.role}</div>
          <div className="text-sm text-gray-700">Phone: {profile?.phone || '—'}</div>
          <div className="text-sm text-gray-700">Joined: {profile?.created_at ? new Date(profile.created_at).toLocaleString() : '—'}</div>
        </section>

        <section className="border rounded p-4">
          <h3 className="font-semibold">Assignments (tutor/student)</h3>
          <pre>{JSON.stringify(tutorAssignments || [], null, 2)}</pre>
        </section>

        <section className="border rounded p-4">
          <h3 className="font-semibold">Sessions</h3>
          <ul className="space-y-2">
            {(sessions || []).map((s:any)=>(
              <li key={s.id} className="text-sm">
                #{s.id} • {s.status} • {new Date(s.start_time).toLocaleString()} • Tutor: {s.tutor_id} • Student: {s.student_id}
              </li>
            ))}
          </ul>
        </section>

        <section className="border rounded p-4">
          <h3 className="font-semibold">Expenses</h3>
          <ul className="space-y-2">
            {(expenses || []).map((e:any)=>(
              <li key={e.id} className="text-sm">
                #{e.id} • {e.amount} • {e.description}
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  )
}
