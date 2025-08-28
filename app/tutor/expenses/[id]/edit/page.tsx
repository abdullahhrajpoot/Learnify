// // app/tutor/expenses/[id]/edit/page.tsx
// 'use client'

// import React, { useEffect, useState } from 'react'
// import { useParams, useRouter } from 'next/navigation'
// import { supabase } from '@/lib/supabaseClient'

// export default function EditExpensePage() {
//   const params = useParams()
//   const router = useRouter()
//   const id = params?.id
//   const [expense, setExpense] = useState<any>(null)
//   const [loading, setLoading] = useState(true)
//   const [saving, setSaving] = useState(false)
//   const [error, setError] = useState<string | null>(null)

//   useEffect(() => {
//     if (!id) return
//     let mounted = true
//     async function load() {
//       setLoading(true)
//       try {
//         const { data, error } = await supabase.from('expenses').select('*').eq('id', id).single()
//         if (error) throw error
//         if (mounted) setExpense(data)
//       } catch (err: any) {
//         setError(err.message || 'Failed to load expense')
//       } finally {
//         setLoading(false)
//       }
//     }
//     load()
//     return () => { mounted = false }
//   }, [id])

//   async function save() {
//     if (!expense) return
//     setSaving(true)
//     setError(null)
//     try {
//       const { error } = await supabase.from('expenses').update({
//         student_id: expense.student_id,
//         amount: parseFloat(expense.amount),
//         currency: expense.currency,
//         description: expense.description
//       }).eq('id', id)
//       if (error) throw error
//       router.push('/tutor/expenses')
//     } catch (err: any) {
//       setError(err.message || 'Failed to update expense')
//     } finally {
//       setSaving(false)
//     }
//   }

//   if (loading) return <div className="p-6">Loading...</div>
//   if (!expense) return <div className="p-6">Expense not found</div>

//   return (
//     <div className="p-6 max-w-xl">
//       <h1 className="text-2xl font-semibold mb-4">Edit Expense</h1>

//       <div className="space-y-4">
//         <div>
//           <label className="block text-sm font-medium">Amount</label>
//           <input value={expense.amount} onChange={(e) => setExpense({...expense, amount: e.target.value})} className="mt-1 block w-full p-2 border rounded" />
//         </div>

//         <div>
//           <label className="block text-sm font-medium">Currency</label>
//           <input value={expense.currency} onChange={(e) => setExpense({...expense, currency: e.target.value})} className="mt-1 block w-full p-2 border rounded" />
//         </div>

//         <div>
//           <label className="block text-sm font-medium">Description</label>
//           <textarea value={expense.description ?? ''} onChange={(e) => setExpense({...expense, description: e.target.value})} className="mt-1 block w-full p-2 border rounded" />
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

export default function EditExpensePage() {
  const params = useParams()
  const router = useRouter()
  const id = params?.id
  const [expense, setExpense] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!id) return
    let mounted = true
    async function load() {
      setLoading(true)
      try {
        const { data, error } = await supabase.from('expenses').select('*').eq('id', id).single()
        if (error) throw error
        if (mounted) setExpense(data)
      } catch (err: any) {
        setError(err.message || 'Failed to load expense')
      } finally {
        setLoading(false)
      }
    }
    load()
    return () => { mounted = false }
  }, [id])

  async function save() {
    if (!expense) return
    setSaving(true)
    setError(null)
    try {
      const { error } = await supabase.from('expenses').update({
        student_id: expense.student_id,
        amount: parseFloat(expense.amount),
        currency: expense.currency,
        description: expense.description
      }).eq('id', id)
      if (error) throw error
      router.push('/tutor/expenses')
    } catch (err: any) {
      setError(err.message || 'Failed to update expense')
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <div className="p-6">Loading...</div>
  if (!expense) return <div className="p-6">Expense not found</div>

  return (
    <div className="p-6 max-w-xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>✏️ Edit Expense</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Amount</Label>
            <Input value={expense.amount} onChange={(e) => setExpense({ ...expense, amount: e.target.value })} />
          </div>

          <div>
            <Label>Currency</Label>
            <Input value={expense.currency} onChange={(e) => setExpense({ ...expense, currency: e.target.value })} />
          </div>

          <div>
            <Label>Description</Label>
            <Textarea value={expense.description ?? ''} onChange={(e) => setExpense({ ...expense, description: e.target.value })} />
          </div>

          {error && <div className="text-red-600">{error}</div>}

          <Button disabled={saving} onClick={save} className="w-full">
            {saving ? 'Saving...' : 'Save Changes'}
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
