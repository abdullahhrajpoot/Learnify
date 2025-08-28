// 'use client'

// import React, { useEffect, useState } from 'react'
// import { useRouter } from 'next/navigation'
// import { supabase } from '@/lib/supabaseClient'

// export default function NewAssignmentPage() {
//   const [students, setStudents] = useState<any[]>([])
//   const [title, setTitle] = useState('')
//   const [description, setDescription] = useState('')
//   const [studentId, setStudentId] = useState<string | undefined>()
//   const [loading, setLoading] = useState(true)
//   const [saving, setSaving] = useState(false)
//   const [error, setError] = useState<string | null>(null)
//   const router = useRouter()

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
//           setStudents([])
//           setLoading(false)
//           return
//         }

//         // Fetch students assigned to this tutor
//         const { data: ta, error: taErr } = await supabase
//           .from('tutor_assignments')
//           .select('student_id')
//           .eq('tutor_id', user.id)

//         if (taErr) throw taErr

//         const ids = (ta ?? []).map((r: any) => r.student_id)

//         if (ids.length === 0) {
//           setStudents([])
//           setLoading(false)
//           return
//         }

//         const { data: profiles, error: profilesErr } = await supabase
//           .from('profiles')
//           .select('id, full_name')
//           .in('id', ids)

//         if (profilesErr) throw profilesErr
//         if (mounted) setStudents(profiles ?? [])
//       } catch (err: any) {
//         setError(err.message || 'Failed to load students')
//       } finally {
//         setLoading(false)
//       }
//     }

//     load()
//     return () => { mounted = false }
//   }, [])

//   async function create() {
//     setSaving(true)
//     setError(null)
//     try {
//       const {
//         data: { user },
//         error: userErr
//       } = await supabase.auth.getUser()
//       if (userErr) throw userErr
//       if (!user) throw new Error('Not authenticated')

//       if (!studentId) {
//         throw new Error('Please select a student')
//       }
//       if (!title.trim()) {
//         throw new Error('Title is required')
//       }

//       const { error } = await supabase.from('assignments').insert([{
//         title: title.trim(),
//         description: description.trim() || null,
//         tutor_id: user.id,
//         student_id: studentId
//       }])
//       if (error) throw error

//       router.push('/tutor/assignments')
//     } catch (err: any) {
//       setError(err.message || 'Failed to create assignment')
//     } finally {
//       setSaving(false)
//     }
//   }

//   return (
//     <div className="p-6 max-w-xl">
//       <h1 className="text-2xl font-semibold mb-4">New Assignment</h1>

//       {loading && <div>Loading students...</div>}
//       {error && <div className="text-red-600 mb-3">{error}</div>}

//       <div className="space-y-4">
//         <div>
//           <label className="block text-sm font-medium">Student</label>
//           <select
//             value={studentId}
//             onChange={(e) => setStudentId(e.target.value)}
//             className="mt-1 block w-full p-2 border rounded"
//           >
//             <option value="">Select student</option>
//             {students.map((s) => (
//               <option key={s.id} value={s.id}>{s.full_name ?? s.id}</option>
//             ))}
//           </select>
//         </div>

//         <div>
//           <label className="block text-sm font-medium">Title</label>
//           <input value={title} onChange={(e) => setTitle(e.target.value)} className="mt-1 block w-full p-2 border rounded" />
//         </div>

//         <div>
//           <label className="block text-sm font-medium">Description</label>
//           <textarea value={description} onChange={(e) => setDescription(e.target.value)} className="mt-1 block w-full p-2 border rounded" />
//         </div>

//         <div>
//           <button disabled={saving} onClick={create} className="px-4 py-2 bg-slate-800 text-white rounded">
//             {saving ? 'Creating...' : 'Create Assignment'}
//           </button>
//         </div>
//       </div>
//     </div>
//   )
// }







// 'use client'

// import React, { useEffect, useState } from 'react'
// import { useRouter } from 'next/navigation'
// import { supabase } from '@/lib/supabaseClient'

// export default function NewAssignmentPage() {
//   const [students, setStudents] = useState<any[]>([])
//   const [title, setTitle] = useState('')
//   const [description, setDescription] = useState('')
//   const [studentId, setStudentId] = useState<string | undefined>()
//   const [file, setFile] = useState<File | null>(null)
//   const [loading, setLoading] = useState(true)
//   const [saving, setSaving] = useState(false)
//   const [error, setError] = useState<string | null>(null)
//   const [deadline , setDeadline] = useState<string>("");
//   const router = useRouter()

//   useEffect(() => {
//     let mounted = true
//     async function load() {
//       setLoading(true)
//       try {
//         const {
//           data: { user },
//           error: userErr
//         } = await supabase.auth.getUser()
//         if (userErr) throw userErr
//         if (!user) {
//           setStudents([])
//           setLoading(false)
//           return
//         }

//         // get tutor's assigned students
//         const { data: ta, error: taErr } = await supabase
//           .from('tutor_assignments')
//           .select('student_id')
//           .eq('tutor_id', user.id)

//         if (taErr) throw taErr

//         const ids = (ta ?? []).map((r: any) => r.student_id)
//         if (ids.length === 0) {
//           setStudents([])
//           setLoading(false)
//           return
//         }

//         const { data: profiles, error: profilesErr } = await supabase
//           .from('profiles')
//           .select('id, full_name')
//           .in('id', ids)

//         if (profilesErr) throw profilesErr
//         if (mounted) setStudents(profiles ?? [])
//       } catch (err: any) {
//         setError(err.message || 'Failed to load students')
//       } finally {
//         setLoading(false)
//       }
//     }

//     load()
//     return () => { mounted = false }
//   }, [])

//   async function uploadFile(tutorId: string) {
//     if (!file) return null
//     // build path: tutorId/timestamp-filename
//     const safeName = `${Date.now()}-${file.name.replace(/\s+/g, '_')}`
//     const path = `${tutorId}/${safeName}`

//     const { error: uploadErr } = await supabase.storage
//       .from('assignments')
//       .upload(path, file, {
//         cacheControl: '3600',
//         upsert: false,
//       })

//     if (uploadErr) throw uploadErr
//     return path
//   }

//   async function create() {
//     setSaving(true)
//     setError(null)
//     try {
//       const {
//         data: { user },
//         error: userErr
//       } = await supabase.auth.getUser()
//       if (userErr) throw userErr
//       if (!user) throw new Error('Not authenticated')
//       if (!studentId) throw new Error('Please select a student')
//       if (!title.trim()) throw new Error('Title is required')

//       // 1. upload file (if any)
//       let filePath = null
//       let fileName = null
//       let fileType = null
//       let fileSize = null

//       if (file) {
//         const uploadedPath = await uploadFile(user.id)
//         filePath = uploadedPath
//         fileName = file.name
//         fileType = file.type
//         fileSize = file.size
//       }

//       // 2. insert assignment
//       const { error } = await supabase.from('assignments').insert([{
//         title: title.trim(),
//         description: description.trim() || null,
//         tutor_id: user.id,
//         student_id: studentId,
//         file_path: filePath,
//         file_name: fileName,
//         file_type: fileType,
//         file_size: fileSize,
//         deadline: deadline ? new Date(deadline).toISOString() : null
//       }])

//       if (error) throw error
//       router.push('/tutor/assignments')
//     } catch (err: any) {
//       setError(err.message || 'Failed to create assignment')
//     } finally {
//       setSaving(false)
//     }
//   }

//   return (
//     <div className="p-6 max-w-2xl">
//       <h1 className="text-2xl font-semibold mb-4">New Assignment</h1>

//       {loading && <div>Loading students...</div>}
//       {error && <div className="text-red-600 mb-3">{error}</div>}

//       <div className="space-y-4">
//         <div>
//           <label className="block text-sm font-medium">Student</label>
//           <select value={studentId} onChange={(e) => setStudentId(e.target.value)} className="mt-1 block w-full p-2 border rounded">
//             <option value="">Select student</option>
//             {students.map((s) => (
//               <option key={s.id} value={s.id}>{s.full_name ?? s.id}</option>
//             ))}
//           </select>
//         </div>

//         <div>
//           <label className="block text-sm font-medium">Title</label>
//           <input value={title} onChange={(e) => setTitle(e.target.value)} className="mt-1 block w-full p-2 border rounded" />
//         </div>

//         <div>
//           <label className="block text-sm font-medium">Description</label>
//           <textarea value={description} onChange={(e) => setDescription(e.target.value)} className="mt-1 block w-full p-2 border rounded" />
//         </div>

//         <div>
//           <label className="block text-sm font-medium">File (optional)</label>
//           <input type="file" onChange={(e) => setFile(e.target.files ? e.target.files[0] : null)} className="mt-1 block w-full" />
//           <div className="text-xs text-gray-500 mt-1">PDF, DOCX, images allowed — size limits enforced by Supabase storage plan.</div>
//         </div>
//         <div>
//   <label className="block text-sm font-medium">Deadline</label>
//   <input
//     type="datetime-local"
//     value={deadline}
//     onChange={(e) => setDeadline(e.target.value)}
//     className="mt-1 block w-full p-2 border rounded"
//   />
// </div>


//         <div>
//           <button disabled={saving} onClick={create} className="px-4 py-2 bg-slate-800 text-white rounded">
//             {saving ? 'Creating...' : 'Create Assignment'}
//           </button>
//         </div>
//       </div>
//     </div>
//   )
// }





// // app/tutor/assignments/new/page.tsx
// "use client";

// import { useState } from "react";
// import { useRouter } from "next/navigation";
// import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

// export default function NewAssignmentPage() {
//   const supabase = createClientComponentClient();
//   const router = useRouter();

//   const [students, setStudents] = useState<any[]>([]);
//   const [studentId, setStudentId] = useState("");
//   const [title, setTitle] = useState("");
//   const [description, setDescription] = useState("");
//   const [file, setFile] = useState<File | null>(null);
//   const [loading, setLoading] = useState(false);

//   // Load tutor's assigned students
//   useState(() => {
//     const loadStudents = async () => {
//       const {
//         data: { user },
//       } = await supabase.auth.getUser();

//       if (!user) return;

//       const { data, error } = await supabase
//         .from("tutor_assignments")
//         .select("student:profiles(id, name)")
//         .eq("tutor_id", user.id);

//       if (error) {
//         console.error(error);
//       } else {
//         setStudents(data.map((d: any) => d.student));
//       }
//     };
//     loadStudents();
//   });

//   async function handleSubmit(e: React.FormEvent) {
//     e.preventDefault();
//     setLoading(true);

//     const {
//       data: { user },
//     } = await supabase.auth.getUser();
//     if (!user) return;

//     let filePath = null;
//     let fileMeta: any = {};

//     if (file) {
//       // Upload to Supabase storage
//       filePath = `${user.id}/${Date.now()}-${file.name}`;
//       const { error: uploadError } = await supabase.storage
//         .from("assignments")
//         .upload(filePath, file, {
//           contentType: file.type,
//         });

//       if (uploadError) {
//         console.error(uploadError);
//         setLoading(false);
//         return;
//       }

//       fileMeta = {
//         file_path: filePath,
//         file_name: file.name,
//         file_type: file.type,
//         file_size: file.size,
//       };
//     }

//     // Insert row into assignments table
//     const { error: insertError } = await supabase.from("assignments").insert({
//       tutor_id: user.id,
//       student_id: studentId,
//       title,
//       description,
//       ...fileMeta,
//     });

//     if (insertError) {
//       console.error(insertError.message);
//       alert("Insert failed: " + insertError.message);
//     } else {
//       alert("Assignment created!");
//       router.push("/tutor/assignments");
//     }

//     setLoading(false);
//   }

//   return (
//     <div className="max-w-xl mx-auto mt-10">
//       <h1 className="text-2xl font-bold mb-4">New Assignment</h1>
//       <form onSubmit={handleSubmit} className="space-y-4">
//         <select
//           className="w-full border p-2 rounded"
//           value={studentId}
//           onChange={(e) => setStudentId(e.target.value)}
//           required
//         >
//           <option value="">Select Student</option>
//           {students.map((s) => (
//             <option key={s.id} value={s.id}>
//               {s.name}
//             </option>
//           ))}
//         </select>

//         <input
//           type="text"
//           placeholder="Title"
//           className="w-full border p-2 rounded"
//           value={title}
//           onChange={(e) => setTitle(e.target.value)}
//           required
//         />

//         <textarea
//           placeholder="Description"
//           className="w-full border p-2 rounded"
//           value={description}
//           onChange={(e) => setDescription(e.target.value)}
//         />

//         <input
//           type="file"
//           accept=".pdf,.doc,.docx,.txt"
//           onChange={(e) => setFile(e.target.files?.[0] || null)}
//         />

//         <button
//           type="submit"
//           className="bg-blue-600 text-white px-4 py-2 rounded"
//           disabled={loading}
//         >
//           {loading ? "Creating..." : "Create Assignment"}
//         </button>
//       </form>
//     </div>
//   );
// }




"use client"

import React, { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabaseClient"
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { motion } from "framer-motion"

export default function NewAssignmentPage() {
  const [students, setStudents] = useState<any[]>([])
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [studentId, setStudentId] = useState<string | undefined>()
  const [file, setFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [deadline, setDeadline] = useState<string>("")
  const router = useRouter()

  useEffect(() => {
    let mounted = true
    async function load() {
      setLoading(true)
      try {
        const { data: { user }, error: userErr } = await supabase.auth.getUser()
        if (userErr) throw userErr
        if (!user) {
          setStudents([])
          setLoading(false)
          return
        }

        const { data: ta, error: taErr } = await supabase
          .from("tutor_assignments")
          .select("student_id")
          .eq("tutor_id", user.id)

        if (taErr) throw taErr

        const ids = (ta ?? []).map((r: any) => r.student_id)
        if (ids.length === 0) {
          setStudents([])
          setLoading(false)
          return
        }

        const { data: profiles, error: profilesErr } = await supabase
          .from("profiles")
          .select("id, full_name")
          .in("id", ids)

        if (profilesErr) throw profilesErr
        if (mounted) setStudents(profiles ?? [])
      } catch (err: any) {
        setError(err.message || "Failed to load students")
      } finally {
        setLoading(false)
      }
    }

    load()
    return () => {
      mounted = false
    }
  }, [])

  async function uploadFile(tutorId: string) {
    if (!file) return null
    const safeName = `${Date.now()}-${file.name.replace(/\s+/g, "_")}`
    const path = `${tutorId}/${safeName}`

    const { error: uploadErr } = await supabase.storage
      .from("assignments")
      .upload(path, file, {
        cacheControl: "3600",
        upsert: false,
      })

    if (uploadErr) throw uploadErr
    return path
  }

  async function create() {
    setSaving(true)
    setError(null)
    try {
      const { data: { user }, error: userErr } = await supabase.auth.getUser()
      if (userErr) throw userErr
      if (!user) throw new Error("Not authenticated")
      if (!studentId) throw new Error("Please select a student")
      if (!title.trim()) throw new Error("Title is required")

      let filePath = null
      let fileName = null
      let fileType = null
      let fileSize = null

      if (file) {
        const uploadedPath = await uploadFile(user.id)
        filePath = uploadedPath
        fileName = file.name
        fileType = file.type
        fileSize = file.size
      }

      const { error } = await supabase.from("assignments").insert([
        {
          title: title.trim(),
          description: description.trim() || null,
          tutor_id: user.id,
          student_id: studentId,
          file_path: filePath,
          file_name: fileName,
          file_type: fileType,
          file_size: fileSize,
          deadline: deadline ? new Date(deadline).toISOString() : null,
        },
      ])

      if (error) throw error
      router.push("/tutor/assignments")
    } catch (err: any) {
      setError(err.message || "Failed to create assignment")
    } finally {
      setSaving(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-6 max-w-2xl mx-auto"
    >
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-semibold">New Assignment</CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          {loading && <p className="text-gray-500 text-sm">Loading students...</p>}
          {error && <p className="text-red-600 text-sm">{error}</p>}

          {/* Student Select */}
          <div className="space-y-1">
            <Label>Student</Label>
            <Select onValueChange={setStudentId} value={studentId}>
              <SelectTrigger>
                <SelectValue placeholder="Select student" />
              </SelectTrigger>
              <SelectContent>
                {students.map((s) => (
                  <SelectItem key={s.id} value={s.id}>
                    {s.full_name ?? s.id}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Title */}
          <div className="space-y-1">
            <Label>Title</Label>
            <Input value={title} onChange={(e) => setTitle(e.target.value)} />
          </div>

          {/* Description */}
          <div className="space-y-1">
            <Label>Description</Label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
            />
          </div>

          {/* File Upload */}
          <div className="space-y-1">
            <Label>File (optional)</Label>
            <Input
              type="file"
              onChange={(e) => setFile(e.target.files ? e.target.files[0] : null)}
            />
            <p className="text-xs text-gray-500">
              PDF, DOCX, images allowed — limits based on Supabase storage plan.
            </p>
          </div>

          {/* Deadline */}
          <div className="space-y-1">
            <Label>Deadline</Label>
            <Input
              type="datetime-local"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
            />
          </div>
        </CardContent>

        <CardFooter>
          <Button
            onClick={create}
            disabled={saving}
            className="w-full"
          >
            {saving ? "Creating..." : "Create Assignment"}
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  )
}
