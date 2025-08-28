// // app/tutor/expenses/new/page.tsx
// 'use client'

// import React, { useEffect, useState } from 'react'
// import { useRouter } from 'next/navigation'
// import { supabase } from '@/lib/supabaseClient'

// export default function NewExpensePage() {
//   const router = useRouter()
//   const [students, setStudents] = useState<any[]>([])
//   const [studentId, setStudentId] = useState<string | undefined>()
//   const [amount, setAmount] = useState('')
//   const [currency, setCurrency] = useState('PKR')
//   const [description, setDescription] = useState('')
//   const [loading, setLoading] = useState(false)
//   const [error, setError] = useState<string | null>(null)

//   useEffect(() => {
//     async function loadAssignedStudents() {
//       const {
//         data: { user }
//       } = await supabase.auth.getUser()
//       if (!user) return
//       const { data: assignments } = await supabase
//         .from('tutor_assignments')
//         .select('student_id')
//         .eq('tutor_id', user.id)

//       const studentIds = (assignments ?? []).map((a: any) => a.student_id)
//       if (studentIds.length === 0) { setStudents([]); return }
//       const { data: profiles } = await supabase
//         .from('profiles')
//         .select('id, full_name')
//         .in('id', studentIds)
//       setStudents(profiles ?? [])
//       if (profiles && profiles.length) setStudentId(profiles[0].id)
//     }
//     loadAssignedStudents()
//   }, [])

//   async function handleSubmit(e: React.FormEvent) {
//     e.preventDefault()
//     setLoading(true)
//     setError(null)
//     try {
//       const {
//         data: { user },
//         error: userErr
//       } = await supabase.auth.getUser()
//       if (userErr) throw userErr
//       if (!user) throw new Error('Not authenticated')

//       const payload = {
//         student_id: studentId,
//         amount: amount ? parseFloat(amount) : 0,
//         currency,
//         description,
//         created_by: user.id
//       }

//       const { data , error } = await supabase.from('expenses').insert(payload).select('*')
//       console.log("Inserting expense with:", {
//         student_id: studentId,
//         tutor_id: user.id,
//         amount,
//         description,
//       });
      
//       if (error) throw error
//       router.push('/tutor/expenses')
//     } catch (err: any) {
//       setError(err.message || 'Failed to create expense')
//     } finally {
//       setLoading(false)
//     }
//   }

//   return (
//     <div className="p-6 max-w-xl">
//       <h1 className="text-2xl font-semibold mb-4">New Expense</h1>

//       <form onSubmit={handleSubmit} className="space-y-4">
//         <div>
//           <label className="block text-sm font-medium">Student</label>
//           <select value={studentId} onChange={(e) => setStudentId(e.target.value)} className="mt-1 block w-full p-2 border rounded">
//             <option value="">Select student</option>
//             {students.map((s) => <option key={s.id} value={s.id}>{s.full_name ?? s.id}</option>)}
//           </select>
//         </div>

//         <div>
//           <label className="block text-sm font-medium">Amount</label>
//           <input value={amount} onChange={(e) => setAmount(e.target.value)} className="mt-1 block w-full p-2 border rounded" />
//         </div>

//         <div>
//           <label className="block text-sm font-medium">Currency</label>
//           <input value={currency} onChange={(e) => setCurrency(e.target.value)} className="mt-1 block w-full p-2 border rounded" />
//         </div>

//         <div>
//           <label className="block text-sm font-medium">Description</label>
//           <textarea value={description} onChange={(e) => setDescription(e.target.value)} className="mt-1 block w-full p-2 border rounded" />
//         </div>

//         {error && <div className="text-red-600">{error}</div>}


//         <div>
//           <button type="submit" disabled={loading} className="px-4 py-2 bg-slate-800 text-white rounded">
//             {loading ? 'Saving...' : 'Save Expense'}
//           </button>
//         </div>
//       </form>
//     </div>
//   )
// }






'use client'

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function NewExpensePage() {
  const router = useRouter()
  const [students, setStudents] = useState<any[]>([])
  const [studentId, setStudentId] = useState<string | undefined>()
  const [amount, setAmount] = useState('')
  const [currency, setCurrency] = useState('PKR')
  const [description, setDescription] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function loadAssignedStudents() {
      const {
        data: { user }
      } = await supabase.auth.getUser()
      if (!user) return
      const { data: assignments } = await supabase
        .from('tutor_assignments')
        .select('student_id')
        .eq('tutor_id', user.id)

      const studentIds = (assignments ?? []).map((a: any) => a.student_id)
      if (studentIds.length === 0) { setStudents([]); return }
      const { data: profiles } = await supabase
        .from('profiles')
        .select('id, full_name')
        .in('id', studentIds)
      setStudents(profiles ?? [])
      if (profiles && profiles.length) setStudentId(profiles[0].id)
    }
    loadAssignedStudents()
  }, [])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      const {
        data: { user },
        error: userErr
      } = await supabase.auth.getUser()
      if (userErr) throw userErr
      if (!user) throw new Error('Not authenticated')

      const payload = {
        student_id: studentId,
        amount: amount ? parseFloat(amount) : 0,
        currency,
        description,
        created_by: user.id
      }

      const { error } = await supabase.from('expenses').insert(payload)
      if (error) throw error
      router.push('/tutor/expenses')
    } catch (err: any) {
      setError(err.message || 'Failed to create expense')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-6 max-w-xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>➕ New Expense</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label>Student</Label>
              <Select value={studentId} onValueChange={setStudentId}>
                <SelectTrigger>
                  <SelectValue placeholder="Select student" />
                </SelectTrigger>
                <SelectContent>
                  {students.map((s) => (
                    <SelectItem key={s.id} value={s.id}>{s.full_name ?? s.id}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Amount</Label>
              <Input value={amount} onChange={(e) => setAmount(e.target.value)} />
            </div>

            <div>
              <Label>Currency</Label>
              <Input value={currency} onChange={(e) => setCurrency(e.target.value)} />
            </div>

            <div>
              <Label>Description</Label>
              <Textarea value={description} onChange={(e) => setDescription(e.target.value)} />
            </div>

            {error && <div className="text-red-600">{error}</div>}

            <Button type="submit" disabled={loading} className="w-full">
              {loading ? 'Saving...' : 'Save Expense'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
