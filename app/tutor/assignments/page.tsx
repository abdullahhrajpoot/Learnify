// 'use client'

// import React, { useEffect, useState } from 'react'
// import Link from 'next/link'
// import { supabase } from '@/lib/supabaseClient'

// export default function TutorAssignmentsPage() {
//   const [assignments, setAssignments] = useState<any[]>([])
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
//           setAssignments([])
//           setLoading(false)
//           return
//         }

//         const { data, error } = await supabase
//           .from('assignments')
//           .select(`
//             id,
//             title,
//             description,
//             created_at,
//             student_id,
//             students:profiles!assignments_student_id_fkey ( full_name )
//           `)
//           .eq('tutor_id', user.id)
//           .order('created_at', { ascending: false })

//         if (error) throw error
//         if (mounted) setAssignments(data ?? [])
//       } catch (err: any) {
//         setError(err.message || 'Failed to load assignments')
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
//         <h1 className="text-2xl font-semibold">My Assignments</h1>
//         <Link href="/tutor/assignments/new" className="px-3 py-2 bg-slate-800 text-white rounded">Create Assignment</Link>
//       </div>

//       {loading && <div>Loading assignments...</div>}
//       {error && <div className="text-red-600">{error}</div>}

//       {!loading && assignments.length === 0 && <div>No assignments yet.</div>}

//       <div className="space-y-3">
//         {assignments.map((a) => (
//           <div key={a.id} className="p-3 border rounded">
//             <div className="flex justify-between">
//               <div>
//                 <div className="font-medium">Title: {a.title}</div>
//                 <div className="text-sm text-gray-600">Student: {a?.students?.full_name ?? a.student_id}</div>
//                 <div className="text-sm text-gray-600">Desc: {a.description}</div>
//                 <div className="text-xs text-gray-500">Created: {new Date(a.created_at).toLocaleString()}</div>
//               </div>
//               <div className="flex flex-col gap-2">
//                 <Link href={`/tutor/assignments/${a.id}/edit`} className="px-2 py-1 border rounded">Edit</Link>
//               </div>
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   )
// }




// 'use client'

// import React, { useEffect, useState } from 'react'
// import Link from 'next/link'
// import { supabase } from '@/lib/supabaseClient'

// export default function TutorAssignmentsPage() {
//   const [assignments, setAssignments] = useState<any[]>([])
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
//           setAssignments([])
//           setLoading(false)
//           return
//         }

//         const { data, error } = await supabase
//           .from('assignments')
//           .select(`
//             id,
//             title,
//             description,
//             created_at,
//             file_path,
//             file_name,
//             student_id,
//             students:profiles!assignments_student_id_fkey ( full_name )
//           `)
//           .eq('tutor_id', user.id)
//           .order('created_at', { ascending: false })

//         if (error) throw error
//         if (mounted) setAssignments(data ?? [])
//       } catch (err: any) {
//         setError(err.message || 'Failed to load assignments')
//       } finally {
//         setLoading(false)
//       }
//     }

//     load()
//     return () => { mounted = false }
//   }, [])

//   async function getSignedUrl(filePath: string) {
//     try {
//       const res = await fetch(`/api/signed-url?filePath=${encodeURIComponent(filePath)}&expires=900`) // 15 min
//       const json = await res.json()
//       if (json.publicUrl) return json.publicUrl
//       throw new Error(json.error || 'Failed to get signed url')
//     } catch (err: any) {
//       console.error(err)
//       throw err
//     }
//   }

//   return (
//     <div className="p-6">
//       <div className="flex justify-between items-center mb-4">
//         <h1 className="text-2xl font-semibold">My Assignments</h1>
//         <Link href="/tutor/assignments/new" className="px-3 py-2 bg-slate-800 text-white rounded">Create Assignment</Link>
//       </div>

//       {loading && <div>Loading assignments...</div>}
//       {error && <div className="text-red-600">{error}</div>}

//       {!loading && assignments.length === 0 && <div>No assignments yet.</div>}

//       <div className="space-y-3">
//         {assignments.map((a) => (
//           <div key={a.id} className="p-3 border rounded">
//             <div className="flex justify-between">
//               <div className="max-w-[70%]">
//                 <div className="font-medium">Title: {a.title}</div>
//                 <div className="text-sm text-gray-600">Student: {a?.students?.full_name ?? a.student_id}</div>
//                 <div className="text-sm text-gray-600">Desc: {a.description}</div>
//                 <div className="text-xs text-gray-500">Created: {new Date(a.created_at).toLocaleString()}</div>
//               </div>

//               <div className="flex flex-col gap-2 items-end">
//                 {a.file_path ? (
//                   <a
//                     className="text-sm px-2 py-1 border rounded cursor-pointer"
//                     onClick={async (e) => {
//                       e.preventDefault()
//                       try {
//                         const url = await getSignedUrl(a.file_path)
//                         window.open(url, '_blank')
//                       } catch {
//                         alert('Failed to get file')
//                       }
//                     }}
//                   >
//                     Download
//                   </a>
//                 ) : (
//                   <div className="text-sm text-gray-500">No file</div>
//                 )}
//                 <Link href={`/tutor/assignments/${a.id}/edit`} className="px-2 py-1 border rounded">Edit</Link>
//               </div>
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   )
// }




"use client"

import React, { useEffect, useState } from "react"
import Link from "next/link"
import { supabase } from "@/lib/supabaseClient"
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { motion } from "framer-motion"

export default function TutorAssignmentsPage() {
  const [assignments, setAssignments] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let mounted = true
    async function load() {
      setLoading(true)
      setError(null)
      try {
        const { data: { user }, error: userErr } = await supabase.auth.getUser()
        if (userErr) throw userErr
        if (!user) {
          setAssignments([])
          setLoading(false)
          return
        }

        const { data, error } = await supabase
          .from("assignments")
          .select(`
            id,
            title,
            description,
            created_at,
            file_path,
            student_id,
            profiles!assignments_student_id_fkey ( full_name )
          `)
          .eq("tutor_id", user.id)
          .order("created_at", { ascending: false })

        if (error) throw error
        if (mounted) setAssignments(data ?? [])
      } catch (err: any) {
        setError(err.message || "Failed to load assignments")
      } finally {
        setLoading(false)
      }
    }

    load()
    return () => { mounted = false }
  }, [])

  async function getSignedUrl(filePath: string) {
    try {
      const res = await fetch(`/api/signed-url?filePath=${encodeURIComponent(filePath)}&expires=900`)
      const json = await res.json()
      if (json.publicUrl) return json.publicUrl
      throw new Error(json.error || "Failed to get signed url")
    } catch (err: any) {
      console.error(err)
      throw err
    }
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-semibold">My Assignments</h1>
        <Link href="/tutor/assignments/new">
          <Button>Create Assignment</Button>
        </Link>
      </div>

      {loading && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(3)].map((_, i) => (
            <Card key={i}>
              <CardHeader><Skeleton className="h-6 w-2/3" /></CardHeader>
              <CardContent>
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-1/2" />
              </CardContent>
              <CardFooter><Skeleton className="h-8 w-20" /></CardFooter>
            </Card>
          ))}
        </div>
      )}

      {error && <div className="text-red-600">{error}</div>}
      {!loading && assignments.length === 0 && <div>No assignments yet.</div>}

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {assignments.map((a) => (
          <motion.div key={a.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <Card className="hover:shadow-md transition">
              <CardHeader>
                <CardTitle className="flex justify-between items-center">
                  {a.title}
                  <Badge variant="secondary">{a.profiles?.full_name ?? a.student_id}</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <p className="text-sm text-gray-600">{a.description}</p>
                <p className="text-xs text-gray-500">
                  Created: {new Date(a.created_at).toLocaleString()}
                </p>
              </CardContent>
              <CardFooter className="flex gap-2">
                {a.file_path ? (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={async () => {
                      try {
                        const url = await getSignedUrl(a.file_path)
                        window.open(url, "_blank")
                      } catch {
                        alert("Failed to get file")
                      }
                    }}
                  >
                    Download
                  </Button>
                ) : (
                  <span className="text-xs text-gray-500">No file</span>
                )}
                <Link href={`/tutor/assignments/${a.id}/edit`}>
                  <Button size="sm">Edit</Button>
                </Link>
              </CardFooter>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
