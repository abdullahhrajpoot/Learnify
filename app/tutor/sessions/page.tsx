// // app/tutor/dashboard/sessions/page.tsx
// 'use client'

// import React, { useEffect, useState } from 'react'
// import Link from 'next/link'
// import { supabase } from '@/lib/supabaseClient'

// type SessionRow = {
//   id: number
//   tutor_id: string
//   student_id: string
//   start_time: string | null
//   end_time: string | null
//   status?: string | null
//   notes?: string | null
// }

// export default function TutorSessionsPage() {
//   const [sessions, setSessions] = useState<SessionRow[]>([])
//   const [loading, setLoading] = useState(true)
//   const [error, setError] = useState<string | null>(null)

//   useEffect(() => {
//     let mounted = true
//     async function load() {
//       setLoading(true)
//       setError(null)
//       try {
//         const {
//           data: { user },
//           error: userErr
//         } = await supabase.auth.getUser()
//         if (userErr) throw userErr
//         if (!user) {
//           setSessions([])
//           setLoading(false)
//           return
//         }

//         const { data, error } = await supabase
//           .from('sessions')
//           .select('*')
//           .eq('tutor_id', user.id)
//           .order('start_time', { ascending: false })

//         if (error) throw error
//         if (mounted) setSessions(data ?? [])
//       } catch (err: any) {
//         setError(err.message || 'Failed to load sessions')
//       } finally {
//         setLoading(false)
//       }
//     }
//     load()
//     return () => { mounted = false }
//   }, [])

//   return (
//     <div className="p-6">
//       <div className="flex justify-between items-center mb-4">
//         <h1 className="text-2xl font-semibold">My Sessions</h1>
//         <Link href="/tutor/dashboard/sessions/new" className="px-3 py-2 bg-slate-800 text-white rounded">Add Session</Link>
//       </div>

//       {loading && <div>Loading sessions...</div>}
//       {error && <div className="text-red-600">{error}</div>}

//       {!loading && sessions.length === 0 && <div>No sessions yet.</div>}

//       <div className="space-y-3">
//         {sessions.map((s) => (
//           <div key={s.id} className="p-3 border rounded">
//             <div className="flex justify-between">
//               <div>
//                 <div className="font-medium">Student ID: {s.student_id}</div>
//                 <div className="text-sm text-gray-600">Start: {s.start_time ? new Date(s.start_time).toLocaleString() : '—'}</div>
//                 <div className="text-sm text-gray-600">End: {s.end_time ? new Date(s.end_time).toLocaleString() : '—'}</div>
//                 <div className="text-sm text-gray-600">Status: {s.status ?? '—'}</div>
//               </div>
//               <div className="flex flex-col gap-2">
//                 <Link href={`/tutor/dashboard/sessions/${s.id}/edit`} className="px-2 py-1 border rounded">Edit</Link>
//               </div>
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   )
// }




// 'use client'

// import { useEffect, useState } from 'react'
// import { supabase } from '@/lib/supabaseClient'

// export default function TutorSessionsPage() {
//   const [sessions, setSessions] = useState<any[]>([])
//   const [loading, setLoading] = useState(true)

//   useEffect(() => {
//     const fetchSessions = async () => {
//       setLoading(true)
//       const {
//         data: { user },
//       } = await supabase.auth.getUser()

//       if (!user) {
//         setSessions([])
//         setLoading(false)
//         return
//       }

//       // ✅ Fetch sessions only for students assigned to this tutor
//       const { data, error } = await supabase
//         .from('sessions')
//         .select(`
//           id,
//           start_time,
//           end_time,
//           notes,
//           student_id,
//           students:profiles!sessions_student_id_fkey ( full_name )
//         `)
//         .in(
//           'student_id',
//           (await supabase
//             .from('tutor_assignments')
//             .select('student_id')
//             .eq('tutor_id', user.id)).data?.map(r => r.student_id) ?? []
//         )
       

//       if (error) {
//         console.error(error)
//       } else {
//         setSessions(data || [])
//       }

//       setLoading(false)
//     }

//     fetchSessions()
//   }, [supabase])

//   if (loading) return <p>Loading...</p>

//   if (!sessions.length) return <p>No sessions assigned to your students yet.</p>

//   return (
//     <div className="p-6">
//       <h1 className="text-2xl font-semibold mb-6">My Students’ Sessions</h1>
  
//       <ul className="space-y-4">
//         {sessions.map((session: any) => {
//           const start =
//             session?.start_time
//               ? new Date(session.start_time).toLocaleString(undefined, {
//                   weekday: "long",
//                   year: "numeric",
//                   month: "long",
//                   day: "numeric",
//                   hour: "2-digit",
//                   minute: "2-digit",
//                   timeZoneName: "short",
//                 })
//               : "—";
  
//           const end =
//             session?.end_time
//               ? new Date(session.end_time).toLocaleString(undefined, {
//                   weekday: "long",
//                   year: "numeric",
//                   month: "long",
//                   day: "numeric",
//                   hour: "2-digit",
//                   minute: "2-digit",
//                   timeZoneName: "short",
//                 })
//               : "—";
  
//           return (
//             <li
//               key={session.id}
//               className="rounded-xl border bg-white p-4 shadow-sm hover:shadow transition"
//             >
//               <p className="text-lg font-semibold text-gray-900">
//                 {session.notes || "No notes provided"}
//               </p>
  
//               <p className="mt-1 text-sm text-gray-700">
//                 <span className="font-medium">Student:</span>{" "}
//                 {session?.students?.full_name ?? "—"}
//               </p>
  
//               <div className="mt-2 space-y-1 text-sm text-gray-700">
//                 <p>
//                   <span className="font-medium">Starts:</span>{" "}
//                   <time dateTime={session.start_time}>{start}</time>
//                 </p>
//                 <p>
//                   <span className="font-medium">Ends:</span>{" "}
//                   <time dateTime={session.end_time}>{end}</time>
//                 </p>
//               </div>
//             </li>
//           );
//         })}
//       </ul>
//     </div>
//   );
  
  
// }






'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabaseClient'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { motion } from 'framer-motion'
import { Calendar, Clock, User, BookOpen, Sparkles, Eye, Edit, Play, CheckCircle, AlertCircle } from 'lucide-react'

export default function TutorSessionsPage() {
  const [sessions, setSessions] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchSessions = async () => {
      setLoading(true)
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        setSessions([])
        setLoading(false)
        return
      }

      // ✅ Fetch sessions only for students assigned to this tutor
      const { data, error } = await supabase
        .from('sessions')
        .select(`
          id,
          start_time,
          end_time,
          notes,
          student_id,
          students:profiles!sessions_student_id_fkey ( full_name )
        `)
        .in(
          'student_id',
          (await supabase
            .from('tutor_assignments')
            .select('student_id')
            .eq('tutor_id', user.id)).data?.map(r => r.student_id) ?? []
        )

      if (error) {
        console.error(error)
      } else {
        setSessions(data || [])
      }

      setLoading(false)
    }

    fetchSessions()
  }, [])

  if (loading) {
    return (
      <div className="p-6 animate-pulse">
        <div className="h-6 w-48 bg-gray-200 rounded mb-4"></div>
        <div className="space-y-3">
          <div className="h-24 bg-gray-200 rounded"></div>
          <div className="h-24 bg-gray-200 rounded"></div>
        </div>
      </div>
    )
  }

  if (!sessions.length) {
    return <p className="p-6 text-gray-600">No sessions assigned to your students yet.</p>
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-6 text-gray-900">My Students’ Sessions</h1>

      <ul className="space-y-4">
        {sessions.map((session: any) => {
          const start = session?.start_time
            ? new Date(session.start_time).toLocaleString(undefined, {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                timeZoneName: 'short',
              })
            : '—'

          const end = session?.end_time
            ? new Date(session.end_time).toLocaleString(undefined, {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                timeZoneName: 'short',
              })
            : '—'

          return (
            <li
              key={session.id}
              className="rounded-xl border bg-white p-4 shadow-sm hover:shadow-md transition"
            >
              <p className="text-lg font-semibold text-gray-900">
                {session.notes || 'No notes provided'}
              </p>

              <p className="mt-1 text-sm text-gray-700">
                <span className="font-medium">Student:</span>{' '}
                {session?.students?.full_name ?? '—'}
              </p>

              <div className="mt-2 space-y-1 text-sm text-gray-700">
                <p>
                  <span className="font-medium">Starts:</span>{' '}
                  <time dateTime={session.start_time}>{start}</time>
                </p>
                <p>
                  <span className="font-medium">Ends:</span>{' '}
                  <time dateTime={session.end_time}>{end}</time>
                </p>
              </div>

              {/* ✅ Actions */}
              <div className="mt-4 flex gap-3">
                <Link
                  href={`/tutor/sessions/${session.id}`}
                  className="px-3 py-1.5 text-sm rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition"
                >
                  View
                </Link>
                <Link
                  href={`/tutor/sessions/${session.id}/edit`}
                  className="px-3 py-1.5 text-sm rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 transition"
                >
                  Edit
                </Link>
              </div>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
