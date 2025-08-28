// // app/tutor/sessions/[id]/edit/page.tsx
// 'use client'

// import React, { useEffect, useState } from 'react'
// import { useRouter, useParams } from 'next/navigation'
// import { supabase } from '@/lib/supabaseClient'

// export default function EditSessionPage() {
//   const params = useParams()
//   const router = useRouter()
//   const id = params?.id
//   const [session, setSession] = useState<any>(null)
//   const [loading, setLoading] = useState(true)
//   const [saving, setSaving] = useState(false)
//   const [error, setError] = useState<string | null>(null)

//   useEffect(() => {
//     if (!id) return
//     let mounted = true
//     async function load() {
//       setLoading(true)
//       try {
//         const { data, error } = await supabase.from('sessions').select('*').eq('id', id).single()
//         if (error) throw error
//         if (mounted) setSession(data)
//       } catch (err: any) {
//         setError(err.message || 'Failed to load session')
//       } finally {
//         setLoading(false)
//       }
//     }
//     load()
//     return () => { mounted = false }
//   }, [id])

//   async function save() {
//     if (!session) return
//     setSaving(true)
//     setError(null)
//     try {
//       const { error } = await supabase.from('sessions').update({
//         start_time: session.start_time,
//         end_time: session.end_time,
//         notes: session.notes,
//         status: session.status
//       }).eq('id', id)
//       if (error) throw error
//       router.push('/tutor/dashboard/sessions')
//     } catch (err: any) {
//       setError(err.message || 'Failed to update session')
//     } finally {
//       setSaving(false)
//     }
//   }

//   if (loading) return <div className="p-6">Loading...</div>
//   if (!session) return <div className="p-6">Session not found.</div>

//   return (
//     <div className="p-6 max-w-xl">
//       <h1 className="text-2xl font-semibold mb-4">Edit Session</h1>

//       <div className="space-y-4">
//         <div>
//           <label className="block text-sm font-medium">Start</label>
//           <input type="datetime-local" value={session.start_time ? new Date(session.start_time).toISOString().slice(0,16) : ''} onChange={(e) => setSession({...session, start_time: e.target.value ? new Date(e.target.value).toISOString() : null})} className="mt-1 block w-full p-2 border rounded" />
//         </div>

//         <div>
//           <label className="block text-sm font-medium">End</label>
//           <input type="datetime-local" value={session.end_time ? new Date(session.end_time).toISOString().slice(0,16) : ''} onChange={(e) => setSession({...session, end_time: e.target.value ? new Date(e.target.value).toISOString() : null})} className="mt-1 block w-full p-2 border rounded" />
//         </div>

//         <div>
//           <label className="block text-sm font-medium">Notes</label>
//           <textarea value={session.notes ?? ''} onChange={(e) => setSession({...session, notes: e.target.value})} className="mt-1 block w-full p-2 border rounded" />
//         </div>

//         <div>
//           <label className="block text-sm font-medium">Status</label>
//           <select value={session.status ?? ''} onChange={(e) => setSession({...session, status: e.target.value})} className="mt-1 block w-full p-2 border rounded">
//             <option value="">--</option>
//             <option value="pending">pending</option>
//             <option value="completed">completed</option>
//             <option value="cancelled">cancelled</option>
//           </select>
//         </div>

//         {error && <div className="text-red-600">{error}</div>}

//         <div>
//           <button disabled={saving} onClick={save} className="px-4 py-2 bg-slate-800 text-white rounded">{saving ? 'Saving...' : 'Save'}</button>
//         </div>
//       </div>
//     </div>
//   )
// }





'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'
import Link from 'next/link'

export default function EditSessionPage() {
  const { id } = useParams()
  const router = useRouter()
  const [session, setSession] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState({
    start_time: '',
    end_time: '',
    notes: '',
  })
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    const fetchSession = async () => {
      setLoading(true)
      const { data, error } = await supabase
        .from('sessions')
        .select('id, start_time, end_time, notes')
        .eq('id', id)
        .single()

      if (!error && data) {
        setSession(data)
        setForm({
          start_time: data.start_time || '',
          end_time: data.end_time || '',
          notes: data.notes || '',
        })
      }
      setLoading(false)
    }
    if (id) fetchSession()
  }, [id])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    const { error } = await supabase
      .from('sessions')
      .update({
        start_time: form.start_time,
        end_time: form.end_time,
        notes: form.notes,
      })
      .eq('id', id)

    setSaving(false)

    if (!error) router.push(`/tutor/sessions/${id}`)
  }

  if (loading) {
    return (
      <div className="p-6 animate-pulse">
        <div className="h-6 w-40 bg-gray-200 rounded mb-4"></div>
        <div className="h-40 bg-gray-200 rounded"></div>
      </div>
    )
  }

  return (
    <div className="p-6">
      <div className="rounded-xl border bg-white p-6 shadow-md max-w-2xl">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Edit Session</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Start Time</label>
            <input
              type="datetime-local"
              name="start_time"
              value={form.start_time}
              onChange={handleChange}
              className="w-full rounded-lg border-gray-300 shadow-sm focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">End Time</label>
            <input
              type="datetime-local"
              name="end_time"
              value={form.end_time}
              onChange={handleChange}
              className="w-full rounded-lg border-gray-300 shadow-sm focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Notes</label>
            <textarea
              name="notes"
              value={form.notes}
              onChange={handleChange}
              rows={4}
              className="w-full rounded-lg border-gray-300 shadow-sm focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <div className="flex gap-3">
            <button
              type="submit"
              disabled={saving}
              className="px-4 py-2 rounded-lg bg-purple-600 text-white text-sm font-medium hover:bg-purple-700 transition"
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
            <Link
              href={`/tutor/sessions/${id}`}
              className="px-4 py-2 rounded-lg bg-gray-200 text-gray-800 text-sm font-medium hover:bg-gray-300 transition"
            >
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  )
}
