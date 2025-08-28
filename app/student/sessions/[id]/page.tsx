// 'use client'

// import { useEffect, useState } from 'react'
// import { useParams, useRouter } from 'next/navigation'
// import { supabase } from '@/lib/supabaseClient'

// export default function StudentSessionDetailPage() {
//   const { id } = useParams()
//   const router = useRouter()
//   const [session, setSession] = useState<any | null>(null)
//   const [loading, setLoading] = useState(true)

//   useEffect(() => {
//     async function fetchSession() {
//       if (!id) return

//       const { data: { user } } = await supabase.auth.getUser()
//       if (!user) {
//         router.push('/login')
//         return
//       }

//       // ✅ Fetch session only if it belongs to logged-in student
//       const { data, error } = await supabase
//         .from('sessions')
//         .select(`
//           id,
//           start_time,
//           end_time,
//           notes,
//           tutor_id,
//           tutor:profiles!sessions_tutor_id_fkey ( full_name ),
//           created_by
//         `)
//         .eq('id', id)
//         .eq('student_id', user.id)
//         .single()

//       if (error) {
//         console.error(error)
//         setSession(null)
//       } else {
//         setSession(data)
//       }

//       setLoading(false)
//     }

//     fetchSession()
//   }, [id])

//   if (loading) return <p className="p-6">Loading session...</p>
//   if (!session) return <p className="p-6">Session not found or not accessible.</p>

//   const start = session?.start_time
//     ? new Date(session.start_time).toLocaleString()
//     : '—'
//   const end = session?.end_time
//     ? new Date(session.end_time).toLocaleString()
//     : '—'

//   return (
//     <div className="p-6">
//       <button
//         onClick={() => router.back()}
//         className="mb-4 text-sm text-blue-600 hover:underline"
//       >
//         ← Back
//       </button>

//       <h1 className="text-2xl font-semibold mb-4">Session Details</h1>

//       <div className="rounded-xl border bg-white p-6 shadow-sm space-y-3">
//         <p className="text-lg font-semibold text-gray-900">
//           {session.notes || 'No notes provided'}
//         </p>
//         <p className="text-sm text-gray-700">
//           <span className="font-medium">Tutor:</span>{' '}
//           {session?.tutors?.full_name ?? '—'} ({session.tutor_id})
//         </p>
//         <p className="text-sm text-gray-700">
//           <span className="font-medium">Starts:</span> {start}
//         </p>
//         <p className="text-sm text-gray-700">
//           <span className="font-medium">Ends:</span> {end}
//         </p>
//         <p className="text-sm text-gray-700">
//           <span className="font-medium">Created by:</span>{' '}
//           {session.created_by === session.tutor?.id ? 'Tutor' : 'Admin'}
//         </p>
//       </div>
//     </div>
//   )
// }



'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'
import { Loader2, Calendar, Clock, User, ArrowLeft, Shield } from 'lucide-react'

export default function StudentSessionDetailPage() {
  const { id } = useParams()
  const router = useRouter()
  const [session, setSession] = useState<any | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchSession() {
      if (!id) return

      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/login')
        return
      }

      const { data, error } = await supabase
        .from('sessions')
        .select(`
          id,
          start_time,
          end_time,
          notes,
          tutor_id,
          tutor:profiles!sessions_tutor_id_fkey ( full_name ),
          created_by
        `)
        .eq('id', id)
        .eq('student_id', user.id)
        .single()

      if (error) {
        console.error(error)
        setSession(null)
      } else {
        setSession(data)
      }

      setLoading(false)
    }

    fetchSession()
  }, [id, router])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-500">
        <Loader2 className="animate-spin mr-2" /> Loading session...
      </div>
    )
  }

  if (!session) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-500">
        Session not found or not accessible.
      </div>
    )
  }

  const start = session?.start_time
    ? new Date(session.start_time).toLocaleString()
    : '—'
  const end = session?.end_time
    ? new Date(session.end_time).toLocaleString()
    : '—'

  return (
    <div className="p-6 max-w-3xl mx-auto">
      {/* Back Button */}
      <button
        onClick={() => router.back()}
        className="mb-6 flex items-center text-sm font-medium text-indigo-600 hover:text-indigo-800 transition"
      >
        <ArrowLeft className="w-4 h-4 mr-1" /> Back
      </button>

      <h1 className="text-3xl font-bold mb-6 text-gray-900">📖 Session Details</h1>

      <div className="rounded-2xl border bg-white p-8 shadow-md space-y-5">
        <p className="text-xl font-semibold text-gray-900">
          {session.notes || 'No notes provided'}
        </p>

        <div className="flex items-center text-sm text-gray-700">
          <User className="w-4 h-4 mr-2 text-indigo-500" />
          <span className="font-medium">Tutor:</span>
          <span className="ml-1">
            {session?.tutors?.full_name ?? '—'} ({session.tutor_id})
          </span>
        </div>

        <div className="flex items-center text-sm text-gray-700">
          <Calendar className="w-4 h-4 mr-2 text-green-500" />
          <span className="font-medium">Starts:</span>
          <span className="ml-1">{start}</span>
        </div>

        <div className="flex items-center text-sm text-gray-700">
          <Clock className="w-4 h-4 mr-2 text-red-500" />
          <span className="font-medium">Ends:</span>
          <span className="ml-1">{end}</span>
        </div>

        <div className="flex items-center text-sm text-gray-700">
          <Shield className="w-4 h-4 mr-2 text-purple-500" />
          <span className="font-medium">Created by:</span>
          <span className="ml-1">
            {session.created_by === session.tutor?.id ? 'Tutor' : 'Admin'}
          </span>
        </div>
      </div>
    </div>
  )
}
