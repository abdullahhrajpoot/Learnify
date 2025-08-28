// 'use client'

// import React, { useEffect, useState } from 'react'
// import { useParams, useRouter } from 'next/navigation'
// import { supabase } from '@/lib/supabaseClient'

// export default function EditAssignmentPage() {
//   const params = useParams()
//   const router = useRouter()
//   const id = params?.id
//   const [assignment, setAssignment] = useState<any>(null)
//   const [loading, setLoading] = useState(true)
//   const [saving, setSaving] = useState(false)
//   const [error, setError] = useState<string | null>(null)

//   useEffect(() => {
//     if (!id) return
//     let mounted = true
//     async function load() {
//       setLoading(true)
//       try {
//         const { data, error } = await supabase
//           .from('assignments')
//           .select('*')
//           .eq('id', id)
//           .single()
//         if (error) throw error
//         if (mounted) setAssignment(data)
//       } catch (err: any) {
//         setError(err.message || 'Failed to load assignment')
//       } finally {
//         setLoading(false)
//       }
//     }
//     load()
//     return () => { mounted = false }
//   }, [id])

//   async function save() {
//     if (!assignment) return
//     setSaving(true)
//     setError(null)
//     try {
//       const { error } = await supabase.from('assignments').update({
//         title: assignment.title,
//         description: assignment.description
//       }).eq('id', id)
//       if (error) throw error
//       router.push('/tutor/assignments')
//     } catch (err: any) {
//       setError(err.message || 'Failed to update assignment')
//     } finally {
//       setSaving(false)
//     }
//   }

//   if (loading) return <div className="p-6">Loading...</div>
//   if (!assignment) return <div className="p-6">Assignment not found</div>

//   return (
//     <div className="p-6 max-w-xl">
//       <h1 className="text-2xl font-semibold mb-4">Edit Assignment</h1>

//       <div className="space-y-4">
//         <div>
//           <label className="block text-sm font-medium">Title</label>
//           <input value={assignment.title} onChange={(e) => setAssignment({...assignment, title: e.target.value})} className="mt-1 block w-full p-2 border rounded" />
//         </div>

//         <div>
//           <label className="block text-sm font-medium">Description</label>
//           <textarea value={assignment.description ?? ''} onChange={(e) => setAssignment({...assignment, description: e.target.value})} className="mt-1 block w-full p-2 border rounded" />
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

import React, { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Loader2 } from 'lucide-react'

export default function EditAssignmentPage() {
  const params = useParams()
  const router = useRouter()
  const id = params?.id
  const [assignment, setAssignment] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!id) return
    let mounted = true
    async function load() {
      setLoading(true)
      try {
        const { data, error } = await supabase
          .from('assignments')
          .select('*')
          .eq('id', id)
          .single()
        if (error) throw error
        if (mounted) setAssignment(data)
      } catch (err: any) {
        setError(err.message || 'Failed to load assignment')
      } finally {
        setLoading(false)
      }
    }
    load()
    return () => { mounted = false }
  }, [id])

  async function save() {
    if (!assignment) return
    setSaving(true)
    setError(null)
    try {
      const { error } = await supabase
        .from('assignments')
        .update({
          title: assignment.title,
          description: assignment.description
        })
        .eq('id', id)
      if (error) throw error
      router.push('/tutor/assignments')
    } catch (err: any) {
      setError(err.message || 'Failed to update assignment')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64 text-gray-600">
        <Loader2 className="animate-spin mr-2" /> Loading...
      </div>
    )
  }

  if (!assignment) {
    return <div className="p-6 text-gray-600">Assignment not found</div>
  }

  return (
    <div className="p-6 max-w-xl mx-auto">
      <Card className="shadow-md border rounded-2xl">
        <CardHeader>
          <CardTitle className="text-xl font-semibold">Edit Assignment</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Title</label>
              <Input
                value={assignment.title}
                onChange={(e) =>
                  setAssignment({ ...assignment, title: e.target.value })
                }
                placeholder="Enter assignment title"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Description</label>
              <Textarea
                value={assignment.description ?? ''}
                onChange={(e) =>
                  setAssignment({ ...assignment, description: e.target.value })
                }
                placeholder="Enter assignment description"
                rows={4}
              />
            </div>

            {error && (
              <div className="text-sm text-red-600 bg-red-50 p-2 rounded-md">
                {error}
              </div>
            )}

            <div className="flex justify-end">
              <Button onClick={save} disabled={saving}>
                {saving ? (
                  <>
                    <Loader2 className="animate-spin mr-2 h-4 w-4" />
                    Saving...
                  </>
                ) : (
                  'Save Changes'
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
