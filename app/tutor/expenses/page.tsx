// // app/tutor/expenses/page.tsx
// 'use client'

// import React, { useEffect, useState } from 'react'
// import Link from 'next/link'
// import { supabase } from '@/lib/supabaseClient'

// export default function TutorExpensesPage() {
//   const [expenses, setExpenses] = useState<any[]>([])
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
//           setExpenses([])
//           setLoading(false)
//           return
//         }

//         const { data, error } = await supabase
//           .from('expenses')
//           .select('*')
//           .eq('created_by', user.id)
//           .order('created_at', { ascending: false })

//         if (error) throw error
//         if (mounted) setExpenses(data ?? [])
//       } catch (err: any) {
//         setError(err.message || 'Failed to load expenses')
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
//         <h1 className="text-2xl font-semibold">My Expenses</h1>
//         <Link href="/tutor/expenses/new" className="px-3 py-2 bg-slate-800 text-white rounded">Add Expense</Link>
//       </div>

//       {loading && <div>Loading expenses...</div>}
//       {error && <div className="text-red-600">{error}</div>}

//       {!loading && expenses.length === 0 && <div>No expenses yet.</div>}

//       <div className="space-y-3">
//         {expenses.map((e) => (
//           <div key={e.id} className="p-3 border rounded">
//             <div className="flex justify-between">
//               <div>
//                 <div className="font-medium">Student: {e.student_id}</div>
//                 <div className="text-sm text-gray-600">{e.amount} {e.currency}</div>
//                 <div className="text-sm text-gray-600">Desc: {e.description}</div>
//               </div>
//               <div className="flex flex-col gap-2">
//                 <Link href={`/tutor/expenses/${e.id}/edit`} className="px-2 py-1 border rounded">Edit</Link>
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
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
// import { Button } from "@/components/ui/button"
// import { Skeleton } from "@/components/ui/skeleton"
// import { Badge } from "@/components/ui/badge"

// export default function TutorExpensesPage() {
//   const [expenses, setExpenses] = useState<any[]>([])
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
//           setExpenses([])
//           setLoading(false)
//           return
//         }

//         const { data, error } = await supabase
//           .from('expenses')
//           .select('*')
//           .eq('created_by', user.id)
//           .order('created_at', { ascending: false })

//         if (error) throw error
//         if (mounted) setExpenses(data ?? [])
//       } catch (err: any) {
//         setError(err.message || 'Failed to load expenses')
//       } finally {
//         setLoading(false)
//       }
//     }

//     load()
//     return () => { mounted = false }
//   }, [])

//   return (
//     <div className="p-6">
//       <div className="flex justify-between items-center mb-6">
//         <h1 className="text-2xl font-bold">💰 My Expenses</h1>
//         <Link href="/tutor/expenses/new">
//           <Button>Add Expense</Button>
//         </Link>
//       </div>

//       {loading && (
//         <div className="space-y-3">
//           <Skeleton className="h-20 w-full rounded-xl" />
//           <Skeleton className="h-20 w-full rounded-xl" />
//         </div>
//       )}

//       {error && <div className="text-red-600">{error}</div>}

//       {!loading && expenses.length === 0 && (
//         <Card className="p-6 text-center text-gray-500">
//           No expenses yet. Add your first one!
//         </Card>
//       )}

//       <div className="grid gap-4">
//         {expenses.map((e) => (
//           <Card key={e.id} className="hover:shadow-lg transition">
//             <CardHeader>
//               <CardTitle className="flex justify-between items-center">
//                 <span>Student: {e.student_id}</span>
//                 <Badge variant="secondary">{e.currency} {e.amount}</Badge>
//               </CardTitle>
//             </CardHeader>
//             <CardContent className="flex justify-between items-center">
//               <p className="text-sm text-gray-600">{e.description || "No description"}</p>
//               <Link href={`/tutor/expenses/${e.id}/edit`}>
//                 <Button variant="outline" size="sm">Edit</Button>
//               </Link>
//             </CardContent>
//           </Card>
//         ))}
//       </div>
//     </div>
//   )
// }



// app/tutor/expenses/page.tsx
'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabaseClient'
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { motion } from 'framer-motion'
import { DollarSign, Plus, Sparkles, User, Calendar, TrendingUp, Edit } from 'lucide-react'

export default function TutorExpensesPage() {
  const [expenses, setExpenses] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let mounted = true
    async function load() {
      setLoading(true)
      setError(null)
      try {
        const {
          data: { user },
          error: userErr
        } = await supabase.auth.getUser()
        if (userErr) throw userErr
        if (!user) {
          setExpenses([])
          setLoading(false)
          return
        }

        // 1. Get expenses
        const { data: expensesData, error: expErr } = await supabase
          .from('expenses')
          .select('*')
          .eq('created_by', user.id)
          .order('created_at', { ascending: false })

        if (expErr) throw expErr
        if (!expensesData || expensesData.length === 0) {
          if (mounted) setExpenses([])
          setLoading(false)
          return
        }

        // 2. Collect unique student_ids
        const studentIds = [...new Set(expensesData.map((e) => e.student_id))]

        // 3. Fetch profiles
        const { data: profilesData, error: profilesErr } = await supabase
          .from('profiles')
          .select('id, full_name')
          .in('id', studentIds)

        if (profilesErr) throw profilesErr

        const profilesMap: Record<string, string> = {}
        profilesData?.forEach((p) => {
          profilesMap[p.id] = p.full_name
        })

        // 4. Merge student names into expenses
        const merged = expensesData.map((e) => ({
          ...e,
          studentName: profilesMap[e.student_id] || e.student_id,
        }))

        if (mounted) setExpenses(merged)
      } catch (err: any) {
        setError(err.message || 'Failed to load expenses')
      } finally {
        setLoading(false)
      }
    }

    load()
    return () => { mounted = false }
  }, [])

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  }

  const totalExpenses = expenses.reduce((sum, e) => sum + (e.amount || 0), 0)
  const averageExpense = expenses.length > 0 ? totalExpenses / expenses.length : 0

  return (
    <div className="min-h-screen ocean-gradient-light">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          className="flex items-center gap-3 mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="p-2 bg-ocean-primary/10 rounded-lg">
            <DollarSign className="w-8 h-8 text-ocean-primary" />
          </div>
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold text-ocean-primary">
              My Expenses
            </h1>
            <p className="text-ocean-secondary/80 text-sm sm:text-base">
              Track and manage your teaching expenses
            </p>
          </div>
          <Sparkles className="w-6 h-6 text-ocean-accent ml-auto" />
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Card className="ocean-gradient-card shadow-lg border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-ocean-secondary/70">Total Expenses</p>
                  <p className="text-2xl font-bold text-ocean-primary">${totalExpenses.toFixed(2)}</p>
                </div>
                <div className="p-3 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg">
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="ocean-gradient-card shadow-lg border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-ocean-secondary/70">Total Records</p>
                  <p className="text-2xl font-bold text-ocean-primary">{expenses.length}</p>
                </div>
                <div className="p-3 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg">
                  <DollarSign className="w-6 h-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="ocean-gradient-card shadow-lg border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-ocean-secondary/70">Average Expense</p>
                  <p className="text-2xl font-bold text-ocean-primary">${averageExpense.toFixed(2)}</p>
                </div>
                <div className="p-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg">
                  <Calendar className="w-6 h-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mb-8"
        >
          <Card className="ocean-gradient-card shadow-lg border-0">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-ocean-primary">
                <Plus className="w-5 h-5" />
                Quick Actions
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button asChild className="ocean-gradient text-white shadow-lg">
                  <Link href="/tutor/expenses/new">
                    <Plus className="w-4 h-4 mr-2" />
                    Add New Expense
                  </Link>
                </Button>
              </motion.div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Expenses List */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {loading ? (
            <div className="grid gap-6">
              {[...Array(5)].map((_, i) => (
                <Card key={i} className="ocean-gradient-card shadow-lg border-0">
                  <CardContent className="p-6">
                    <div className="animate-pulse">
                      <div className="h-4 bg-white/20 rounded w-1/3 mb-2"></div>
                      <div className="h-3 bg-white/20 rounded w-1/4 mb-2"></div>
                      <div className="h-3 bg-white/20 rounded w-1/2"></div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : error ? (
            <Card className="ocean-gradient-card shadow-lg border-0">
              <CardContent className="p-6">
                <div className="text-center text-red-600">
                  <p className="font-medium">Error loading expenses</p>
                  <p className="text-sm">{error}</p>
                </div>
              </CardContent>
            </Card>
          ) : expenses.length === 0 ? (
            <Card className="ocean-gradient-card shadow-lg border-0">
              <CardContent className="p-12 text-center">
                <DollarSign className="w-16 h-16 text-ocean-secondary/40 mx-auto mb-4" />
                <p className="text-ocean-secondary/60 text-lg">No expenses recorded</p>
                <p className="text-ocean-secondary/40 text-sm">Add your first expense to get started</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-6">
              {expenses.map((e, index) => (
                <motion.div
                  key={e.id}
                  variants={itemVariants}
                  whileHover={{scale:1.02, y:-2}}
                >
                  <Card className="ocean-gradient-card shadow-lg border-0 overflow-hidden">
                    <CardContent className="p-6">
                      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-gradient-to-r from-ocean-primary to-ocean-secondary rounded-lg flex items-center justify-center text-white font-bold text-lg">
                            {(e.studentName || 'E').charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <div className="font-semibold text-ocean-primary text-lg">
                              {e.studentName || 'Unknown Student'}
                            </div>
                            <div className="flex items-center gap-4 text-sm text-ocean-secondary/70">
                              <div className="flex items-center gap-1">
                                <User className="w-3 h-3" />
                                {e.student_id}
                              </div>
                              <div className="flex items-center gap-1">
                                <Calendar className="w-3 h-3" />
                                {e.created_at ? new Date(e.created_at).toLocaleDateString() : '—'}
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-4">
                          <div className="text-right">
                            <Badge variant="secondary" className="bg-ocean-secondary/10 text-ocean-secondary border-ocean-secondary/20 text-lg px-3 py-1">
                              ${e.amount?.toFixed(2) || '0.00'}
                            </Badge>
                            <div className="text-sm text-ocean-secondary/70 mt-1">
                              {e.description || "No description"}
                            </div>
                          </div>
                          
                          <Button asChild variant="outline" size="sm" className="bg-white/80 backdrop-blur-sm border-ocean-primary/20 text-ocean-primary hover:bg-ocean-primary/5">
                            <Link href={`/tutor/expenses/${e.id}/edit`}>
                              <Edit className="w-4 h-4 mr-1" />
                              Edit
                            </Link>
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  )
}
