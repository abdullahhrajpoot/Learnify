// // // app/tutor/sessions/new/page.tsx
// // 'use client'

// // import React, { useEffect, useState } from 'react'
// // import { useRouter, useSearchParams } from 'next/navigation'
// // import { supabase } from '@/lib/supabaseClient'

// // export default function NewSessionPage() {
// //   const router = useRouter()
// //   const searchParams = useSearchParams()
// //   const presetStudent = searchParams?.get('studentId') ?? undefined

// //   const [students, setStudents] = useState<any[]>([])
// //   const [studentId, setStudentId] = useState<string | undefined>(presetStudent)
// //   const [startTime, setStartTime] = useState('')
// //   const [endTime, setEndTime] = useState('')
// //   const [notes, setNotes] = useState('')
// //   const [loading, setLoading] = useState(false)
// //   const [error, setError] = useState<string | null>(null)

// //   useEffect(() => {
// //     async function loadAssignedStudents() {
// //       const {
// //         data: { user }
// //       } = await supabase.auth.getUser()
// //       if (!user) return
// //       const { data: assignments } = await supabase
// //         .from('tutor_assignments')
// //         .select('student_id')
// //         .eq('tutor_id', user.id)

// //       const studentIds = (assignments ?? []).map((a: any) => a.student_id)
// //       if (studentIds.length === 0) {
// //         setStudents([])
// //         return
// //       }
// //       const { data: profiles } = await supabase
// //         .from('profiles')
// //         .select('id, full_name')
// //         .in('id', studentIds)
// //       setStudents(profiles ?? [])
// //       if (!studentId && profiles && profiles.length) setStudentId(profiles[0].id)
// //     }

// //     loadAssignedStudents()
// //   }, [])

// //   async function handleSubmit(e: React.FormEvent) {
// //     e.preventDefault()
// //     setLoading(true)
// //     setError(null)
// //     try {
// //       const {
// //         data: { user },
// //         error: userErr
// //       } = await supabase.auth.getUser()
// //       if (userErr) throw userErr
// //       if (!user) throw new Error('Not authenticated')

// //       const payload = {
// //         tutor_id: user.id,
// //         student_id: studentId,
// //         start_time: startTime ? new Date(startTime).toISOString() : null,
// //         end_time: endTime ? new Date(endTime).toISOString() : null,
// //         notes,
// //         created_by: user.id
// //       }

// //       const { error } = await supabase.from('sessions').insert(payload)
// //       if (error) throw error
// //       router.push('/tutor/dashboard/sessions')
// //     } catch (err: any) {
// //       setError(err.message || 'Failed to create session')
// //     } finally {
// //       setLoading(false)
// //     }
// //   }

// //   return (
// //     <div className="p-6">
// //       <h1 className="text-2xl font-semibold mb-4">Log New Session</h1>

// //       <form onSubmit={handleSubmit} className="max-w-xl space-y-4">
// //         <div>
// //           <label className="block text-sm font-medium">Student</label>
// //           <select value={studentId} onChange={(e) => setStudentId(e.target.value)} className="mt-1 block w-full p-2 border rounded">
// //             <option value="">Select student</option>
// //             {students.map((s) => (
// //               <option key={s.id} value={s.id}>{s.full_name ?? s.id}</option>
// //             ))}
// //           </select>
// //         </div>

// //         <div>
// //           <label className="block text-sm font-medium">Start time</label>
// //           <input type="datetime-local" value={startTime} onChange={(e) => setStartTime(e.target.value)} className="mt-1 block w-full p-2 border rounded" />
// //         </div>

// //         <div>
// //           <label className="block text-sm font-medium">End time</label>
// //           <input type="datetime-local" value={endTime} onChange={(e) => setEndTime(e.target.value)} className="mt-1 block w-full p-2 border rounded" />
// //         </div>

// //         <div>
// //           <label className="block text-sm font-medium">Notes</label>
// //           <textarea value={notes} onChange={(e) => setNotes(e.target.value)} className="mt-1 block w-full p-2 border rounded" />
// //         </div>

// //         {error && <div className="text-red-600">{error}</div>}

// //         <div>
// //           <button type="submit" disabled={loading} className="px-4 py-2 bg-slate-800 text-white rounded">
// //             {loading ? 'Saving...' : 'Save Session'}
// //           </button>
// //         </div>
// //       </form>
// //     </div>
// //   )
// // }





// 'use client'

// import { useState } from 'react'
// import { useRouter } from 'next/navigation'
// import { supabase } from '@/lib/supabaseClient'
// import Link from 'next/link'

// export default function NewSessionPage() {
//   const router = useRouter()
//   const [form, setForm] = useState({
//     student_id: '',
//     start_time: '',
//     end_time: '',
//     notes: '',
//   })
//   const [saving, setSaving] = useState(false)

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
//     setForm({ ...form, [e.target.name]: e.target.value })
//   }

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault()
//     setSaving(true)

//     const { data, error } = await supabase.from('sessions').insert([form]).select().single()

//     setSaving(false)
//     if (!error && data) {
//       router.push(`/tutor/sessions/${data.id}`)
//     }
//   }

//   return (
//     <div className="p-6">
//       <div className="rounded-xl border bg-white p-6 shadow-md max-w-2xl">
//         <h1 className="text-2xl font-bold text-gray-900 mb-6">New Session</h1>

//         <form onSubmit={handleSubmit} className="space-y-4">
//           <div>
//             <label className="block text-sm font-medium mb-1">Student ID</label>
//             <input
//               type="text"
//               name="student_id"
//               value={form.student_id}
//               onChange={handleChange}
//               className="w-full rounded-lg border-gray-300 shadow-sm focus:ring-2 focus:ring-purple-500"
//               placeholder="Enter student ID"
//             />
//           </div>

//           <div>
//             <label className="block text-sm font-medium mb-1">Start Time</label>
//             <input
//               type="datetime-local"
//               name="start_time"
//               value={form.start_time}
//               onChange={handleChange}
//               className="w-full rounded-lg border-gray-300 shadow-sm focus:ring-2 focus:ring-purple-500"
//             />
//           </div>

//           <div>
//             <label className="block text-sm font-medium mb-1">End Time</label>
//             <input
//               type="datetime-local"
//               name="end_time"
//               value={form.end_time}
//               onChange={handleChange}
//               className="w-full rounded-lg border-gray-300 shadow-sm focus:ring-2 focus:ring-purple-500"
//             />
//           </div>

//           <div>
//             <label className="block text-sm font-medium mb-1">Notes</label>
//             <textarea
//               name="notes"
//               value={form.notes}
//               onChange={handleChange}
//               rows={4}
//               className="w-full rounded-lg border-gray-300 shadow-sm focus:ring-2 focus:ring-purple-500"
//               placeholder="Enter any notes..."
//             />
//           </div>

//           <div className="flex gap-3">
//             <button
//               type="submit"
//               disabled={saving}
//               className="px-4 py-2 rounded-lg bg-purple-600 text-white text-sm font-medium hover:bg-purple-700 transition"
//             >
//               {saving ? 'Creating...' : 'Create Session'}
//             </button>
//             <Link
//               href="/tutor/sessions"
//               className="px-4 py-2 rounded-lg bg-gray-200 text-gray-800 text-sm font-medium hover:bg-gray-300 transition"
//             >
//               Cancel
//             </Link>
//           </div>
//         </form>
//       </div>
//     </div>
//   )
// }



'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'
import Link from 'next/link'

export default function NewSessionPage() {
  const router = useRouter()
  const [form, setForm] = useState({
    student_id: '',
    start_time: '',
    end_time: '',
    notes: '',
  })
  const [saving, setSaving] = useState(false)
  const [students, setStudents] = useState<any[]>([])
  const [loadingStudents, setLoadingStudents] = useState(true)

  useEffect(() => {
    const fetchStudents = async () => {
      setLoadingStudents(true)
      const { data, error } = await supabase
        .from('profiles')
        .select('id, full_name')
        .eq('role', 'student') // ✅ only students

      if (!error && data) {
        setStudents(data)
      }
      setLoadingStudents(false)
    }
    fetchStudents()
  }, [])

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    const { data, error } = await supabase.from('sessions').insert([form]).select().single()

    setSaving(false)
    if (!error && data) {
      router.push(`/tutor/sessions/${data.id}`)
    }
  }

  return (
    <div className="p-6">
      <div className="rounded-xl border bg-white p-6 shadow-md max-w-2xl">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">New Session</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Student</label>
            <select
              name="student_id"
              value={form.student_id}
              onChange={handleChange}
              className="w-full rounded-lg border-gray-300 shadow-sm focus:ring-2 focus:ring-purple-500"
              disabled={loadingStudents}
            >
              <option value="">
                {loadingStudents ? 'Loading students...' : 'Select a student'}
              </option>
              {students.map((student) => (
                <option key={student.id} value={student.id}>
                  {student.full_name || 'Unnamed'} (ID: {student.id})
                </option>
              ))}
            </select>
          </div>

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
              placeholder="Enter any notes..."
            />
          </div>

          <div className="flex gap-3">
            <button
              type="submit"
              disabled={saving}
              className="px-4 py-2 rounded-lg bg-purple-600 text-white text-sm font-medium hover:bg-purple-700 transition"
            >
              {saving ? 'Creating...' : 'Create Session'}
            </button>
            <Link
              href="/tutor/sessions"
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
