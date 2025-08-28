// 'use client'

// import { useEffect, useState } from 'react'
// import { useParams } from 'next/navigation'
// import { supabase } from '@/lib/supabaseClient'

// export default function AssignmentDetailsPage() {
//   const { id } = useParams()
//   const [assignment, setAssignment] = useState<any>(null)
//   const [loading, setLoading] = useState(true)
//   const [error, setError] = useState<string | null>(null)

//   useEffect(() => {
//     async function load() {
//       setLoading(true)
//       try {
//         const { data, error } = await supabase
//           .from('assignments')
//           .select(`
//             id,
//             title,
//             description,
//             created_at,
//             deadline,
//             is_done,
//             file_path,
//             file_name,
//             tutors:profiles!assignments_tutor_id_fkey ( full_name )
//           `)
//           .eq('id', id)
//           .single()

//         if (error) throw error
//         setAssignment(data)
//       } catch (err: any) {
//         setError(err.message)
//       } finally {
//         setLoading(false)
//       }
//     }
//     if (id) load()
//   }, [id])

//   async function getSignedUrl(filePath: string) {
//     const res = await fetch(`/api/signed-url?filePath=${encodeURIComponent(filePath)}&expires=900`)
//     const json = await res.json()
//     return json.publicUrl
//   }

//   if (loading) return <div className="p-6">Loading assignment...</div>
//   if (error) return <div className="p-6 text-red-600">{error}</div>
//   if (!assignment) return <div className="p-6">Not found</div>

//   return (
//     <div className="p-6 space-y-3">
//       <h1 className="text-2xl font-semibold">{assignment.title}</h1>
//       <div className="text-gray-600">From: {assignment?.tutors?.full_name ?? '—'} ({assignment.tutor_id})</div>
//       <div className="text-gray-700">Description: {assignment.description}</div>
//       <div className="text-sm text-gray-500">Assigned: {new Date(assignment.created_at).toLocaleString()}</div>

//       {assignment.deadline && (
//         <div className="text-red-600">Deadline: {new Date(assignment.deadline).toLocaleString()}</div>
//       )}

//       {assignment.file_path && (
//         <button
//           onClick={async () => {
//             const url = await getSignedUrl(assignment.file_path)
//             window.open(url, '_blank')
//           }}
//           className="mt-2 px-3 py-1 border rounded text-sm"
//         >
//           Download File ({assignment.file_name ?? 'file'})
//         </button>
//       )}

//       {assignment.is_done ? (
//         <div className="text-green-600 font-medium">✅ Completed</div>
//       ) : (
//         <div className="text-yellow-600">Not completed yet</div>
//       )}
//     </div>
//   )
// }
// 'use client'

// import { useEffect, useState } from 'react'
// import { useParams } from 'next/navigation'
// import { supabase } from '@/lib/supabaseClient'

// export default function AssignmentDetailsPage() {
//   const { id } = useParams()
//   const [assignment, setAssignment] = useState<any>(null)
//   const [loading, setLoading] = useState(true)
//   const [error, setError] = useState<string | null>(null)

//   useEffect(() => {
//     async function load() {
//       setLoading(true)
//       try {
//         const { data, error } = await supabase
//           .from('assignments')
//           .select(`
//             id,
//             title,
//             description,
//             created_at,
//             deadline,
//             is_done,
//             file_path,
//             file_name,
//             tutor_id,
//             tutors:profiles!assignments_tutor_id_fkey ( full_name )
//           `)
//           .eq('id', id)
//           .single()

//         if (error) throw error
//         setAssignment(data)
//       } catch (err: any) {
//         setError(err.message)
//       } finally {
//         setLoading(false)
//       }
//     }
//     if (id) load()
//   }, [id])

//   async function getSignedUrl(filePath: string) {
//     const res = await fetch(`/api/signed-url?filePath=${encodeURIComponent(filePath)}&expires=900`)
//     const json = await res.json()
//     return json.publicUrl
//   }

//   if (loading) return <div className="p-6">Loading assignment...</div>
//   if (error) return <div className="p-6 text-red-600">{error}</div>
//   if (!assignment) return <div className="p-6">Not found</div>

//   return (
//     <div className="p-6 space-y-3">
//       <h1 className="text-2xl font-semibold">{assignment.title}</h1>
//       <div className="text-gray-600">
//         From: {assignment?.tutors?.full_name ?? '—'} ({assignment.tutor_id})
//       </div>
//       <div className="text-gray-700">Description: {assignment.description}</div>
//       <div className="text-sm text-gray-500">
//         Assigned: {new Date(assignment.created_at).toLocaleString()}
//       </div>

//       {assignment.deadline && (
//         <div className="text-red-600">
//           Deadline: {new Date(assignment.deadline).toLocaleString()}
//         </div>
//       )}

//       {assignment.file_path && (
//         <button
//           onClick={async () => {
//             const url = await getSignedUrl(assignment.file_path)
//             window.open(url, '_blank')
//           }}
//           className="mt-2 px-3 py-1 border rounded text-sm"
//         >
//           Download File ({assignment.file_name ?? 'file'})
//         </button>
//       )}

//       {assignment.is_done ? (
//         <div className="text-green-600 font-medium">✅ Completed</div>
//       ) : (
//         <div className="text-yellow-600">Not completed yet</div>
//       )}
//     </div>
//   )
// }




'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'
import Link from 'next/link'
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Download, Calendar, Clock } from 'lucide-react'
import { motion } from 'framer-motion'

export default function AssignmentDetailsPage() {
  const { id } = useParams()
  const [assignment, setAssignment] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function load() {
      setLoading(true)
      try {
        const { data, error } = await supabase
          .from('assignments')
          .select(`
            id,
            title,
            description,
            created_at,
            deadline,
            is_done,
            file_path,
            file_name,
            tutor_id,
            tutors:profiles!assignments_tutor_id_fkey ( full_name )
          `)
          .eq('id', id)
          .single()

        if (error) throw error
        setAssignment(data)
      } catch (err: any) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    if (id) load()
  }, [id])

  async function getSignedUrl(filePath: string) {
    const res = await fetch(`/api/signed-url?filePath=${encodeURIComponent(filePath)}&expires=900`)
    const json = await res.json()
    return json.publicUrl
  }

  if (loading)
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-3 max-w-4xl">
          <div className="h-8 w-1/3 bg-gray-200 rounded" />
          <div className="h-4 w-2/3 bg-gray-200 rounded" />
          <div className="h-48 bg-gray-100 rounded" />
        </div>
      </div>
    )

  if (error) return <div className="p-6 text-red-600">{error}</div>
  if (!assignment) return <div className="p-6">Not found</div>

  // deadline helpers (UI only)
  const deadlineDate = assignment.deadline ? new Date(assignment.deadline) : null
  const now = new Date()
  const msPerDay = 1000 * 60 * 60 * 24
  const daysLeft = deadlineDate ? Math.ceil((deadlineDate.getTime() - now.getTime()) / msPerDay) : null

  // decide pill styling
  let deadlineClass = 'bg-green-600 text-white'
  let deadlineLabel = ''
  if (deadlineDate) {
    if (daysLeft! < 0) {
      deadlineClass = 'bg-red-600 text-white'
      deadlineLabel = `Overdue · ${Math.abs(daysLeft!)} day${Math.abs(daysLeft!) === 1 ? '' : 's'} ago`
    } else if (daysLeft! <= 2) {
      deadlineClass = 'bg-amber-600 text-black'
      deadlineLabel = `Due in ${daysLeft} day${daysLeft === 1 ? '' : 's'}`
    } else if (daysLeft! <= 7) {
      deadlineClass = 'bg-orange-500 text-white'
      deadlineLabel = `Due in ${daysLeft} days`
    } else {
      deadlineClass = 'bg-emerald-600 text-white'
      deadlineLabel = `Due in ${daysLeft} days`
    }
  }

  return (
    <div className="p-6 flex justify-center">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-4xl">
        <Card className="shadow-md">
          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
              {/* Deadline pill — prominent and colorful */}
              <div className="flex items-center gap-3">
                {deadlineDate ? (
                  <div className={`px-3 py-2 rounded-lg flex items-center gap-2 ${deadlineClass} shadow-sm`}>
                    <Calendar className="w-5 h-5" />
                    <div className="text-sm font-medium leading-tight">
                      <div>{deadlineDate.toLocaleString()}</div>
                      <div className="text-xs opacity-90">{deadlineLabel}</div>
                    </div>
                  </div>
                ) : (
                  <Badge className="bg-gray-100 text-gray-700">No deadline</Badge>
                )}
              </div>

              {/* Title + tutor */}
              <CardTitle className="flex-1 text-left">
                <div className="text-2xl font-semibold">{assignment.title}</div>
                <div className="text-sm text-gray-500 mt-1">
                  From: {assignment?.tutors?.full_name ?? '—'} {assignment.tutor_id ? `(${assignment.tutor_id})` : ''}
                </div>
              </CardTitle>

              {/* Status badges on the right */}
              <div className="flex flex-col items-end gap-2">
                {assignment.is_done ? (
                  <Badge className="flex items-center gap-1 bg-green-100 text-green-800">Completed</Badge>
                ) : (
                  <Badge className="flex items-center gap-1 bg-amber-100 text-amber-800">Pending</Badge>
                )}
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-4">
            <div className="text-sm text-gray-700">{assignment.description}</div>

            <div className="flex items-center gap-4 text-sm text-gray-500">
              <div><Clock className="w-4 h-4 inline-block mr-1" /> Assigned: {new Date(assignment.created_at).toLocaleString()}</div>
              <div>ID: <span className="font-mono">{assignment.id}</span></div>
            </div>

            {assignment.file_path && (
              <div>
                <Button
                  variant="outline"
                  onClick={async () => {
                    try {
                      const url = await getSignedUrl(assignment.file_path)
                      window.open(url, '_blank')
                    } catch {
                      alert('Failed to get file')
                    }
                  }}
                  className="flex items-center gap-2"
                >
                  <Download className="w-4 h-4" /> Download {assignment.file_name ?? 'file'}
                </Button>
              </div>
            )}
          </CardContent>

          <CardFooter className="flex justify-between items-center">
            <div className="text-sm text-gray-500">
              {assignment.is_done ? <span className="text-green-600 font-medium">✅ Completed</span> : <span className="text-yellow-600">Not completed yet</span>}
            </div>
            <div className="flex gap-2">
              {!assignment.is_done && (
                <Button
                  size="sm"
                  onClick={async () => {
                    // keep the same logic as original app (no RLS changes)
                    try {
                      const { error } = await supabase.from('assignments').update({ is_done: true }).eq('id', assignment.id)
                      if (error) throw error
                      setAssignment({ ...assignment, is_done: true })
                    } catch (err) {
                      console.error(err)
                      alert('Failed to mark as done')
                    }
                  }}
                >
                  Mark as done
                </Button>
              )}
              <Link href="/student/assignments">
                <Button variant="outline" size="sm">Back to list</Button>
              </Link>
            </div>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  )
}
