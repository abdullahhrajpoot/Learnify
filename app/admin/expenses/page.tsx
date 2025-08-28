'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { motion } from 'framer-motion'
import { DollarSign, Plus, Trash2, Sparkles, User, Calendar, AlertCircle, TrendingUp } from 'lucide-react'

export default function AdminExpensesPage() {
  const [rows, setRows] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState({ student_id:'', amount:'', description:'' })
  const [saving, setSaving] = useState(false)
  const [success, setSuccess] = useState(false)

  useEffect(() => { load() }, [])
  
  const load = async () => {
    setLoading(true)
    const { data } = await supabase.from('expenses').select('*').order('created_at', { ascending: false }).limit(200)
    setRows(data || [])
    setLoading(false)
  }

  const create = async () => {
    if (!form.amount) return alert('amount required')
    setSaving(true)
    const { error } = await supabase.from('expenses').insert({
      student_id: form.student_id || null,
      amount: parseFloat(form.amount),
      description: form.description || null
    })
    setSaving(false)
    if (error) {
      alert('Failed to create expense: ' + error.message)
      return
    }
    setForm({ student_id:'', amount:'', description:'' })
    setSuccess(true)
    setTimeout(() => setSuccess(false), 3000)
    load()
  }

  const remove = async (id:number) => {
    if (!confirm('Are you sure you want to delete this expense? This action cannot be undone.')) return
    const { error } = await supabase.from('expenses').delete().eq('id', id)
    if (error) {
      alert('Failed to delete expense: ' + error.message)
      return
    }
    load()
  }

  const totalExpenses = rows.reduce((sum, row) => sum + (row.amount || 0), 0)
  const averageExpense = rows.length > 0 ? totalExpenses / rows.length : 0

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
              Admin — Expenses
            </h1>
            <p className="text-ocean-secondary/80 text-sm sm:text-base">
              Manage platform expenses and financial records
            </p>
          </div>
          <Sparkles className="w-6 h-6 text-ocean-accent ml-auto" />
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8"
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
                  <p className="text-2xl font-bold text-ocean-primary">{rows.length}</p>
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
                  <AlertCircle className="w-6 h-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Create Expense Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card className="ocean-gradient-card shadow-lg border-0 mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-ocean-primary">
                <Plus className="w-5 h-5" />
                Create New Expense
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-ocean-primary">Student ID (Optional)</label>
                  <Input 
                    placeholder="Student ID" 
                    value={form.student_id} 
                    onChange={e=>setForm({...form, student_id:e.target.value})} 
                    className="border-ocean-primary/20 focus:border-ocean-primary bg-white/80 backdrop-blur-sm"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-ocean-primary">Amount *</label>
                  <Input 
                    placeholder="0.00" 
                    value={form.amount} 
                    onChange={e=>setForm({...form, amount:e.target.value})} 
                    className="border-ocean-primary/20 focus:border-ocean-primary bg-white/80 backdrop-blur-sm"
                    type="number"
                    step="0.01"
                    min="0"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-ocean-primary">Description</label>
                  <Input 
                    placeholder="Expense description" 
                    value={form.description} 
                    onChange={e=>setForm({...form, description:e.target.value})} 
                    className="border-ocean-primary/20 focus:border-ocean-primary bg-white/80 backdrop-blur-sm"
                  />
                </div>
              </div>
              
              {success && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg mb-4"
                >
                  <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                  <span className="text-green-800 font-medium">Expense created successfully!</span>
                </motion.div>
              )}

              <Button 
                onClick={create} 
                disabled={saving || !form.amount}
                className="ocean-gradient text-white shadow-lg hover:shadow-xl"
              >
                {saving ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Creating...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Plus className="w-4 h-4" />
                    Create Expense
                  </div>
                )}
              </Button>
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
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <Card key={i} className="ocean-gradient-card shadow-lg border-0">
                  <CardContent className="p-6">
                    <div className="animate-pulse">
                      <div className="h-4 bg-white/20 rounded w-1/3 mb-2"></div>
                      <div className="h-3 bg-white/20 rounded w-1/2 mb-2"></div>
                      <div className="h-3 bg-white/20 rounded w-2/3"></div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {rows.length === 0 ? (
                <Card className="ocean-gradient-card shadow-lg border-0 col-span-full">
                  <CardContent className="p-12 text-center">
                    <DollarSign className="w-16 h-16 text-ocean-secondary/40 mx-auto mb-4" />
                    <p className="text-ocean-secondary/60 text-lg">No expenses recorded</p>
                    <p className="text-ocean-secondary/40 text-sm">Create your first expense above</p>
                  </CardContent>
                </Card>
              ) : (
                rows.map((r, index) => (
                  <motion.div 
                    key={r.id} 
                    variants={itemVariants}
                    whileHover={{scale:1.02, y:-2}}
                  >
                    <Card className="ocean-gradient-card shadow-lg border-0 overflow-hidden">
                      <CardContent className="p-6">
                        <div className="flex flex-col h-full">
                          <div className="flex-1 space-y-3">
                            <div className="flex items-center justify-between">
                              <Badge variant="secondary" className="bg-ocean-secondary/10 text-ocean-secondary border-ocean-secondary/20">
                                #{r.id}
                              </Badge>
                              <div className="text-lg font-bold text-ocean-primary">
                                ${r.amount?.toFixed(2) || '0.00'}
                              </div>
                            </div>
                            
                            <div className="space-y-2">
                              <div className="flex items-center gap-2 text-sm text-ocean-secondary/70">
                                <User className="w-3 h-3" />
                                {r.student_id || 'General'}
                              </div>
                              <div className="text-sm text-ocean-primary font-medium">
                                {r.description || 'No description'}
                              </div>
                              <div className="flex items-center gap-2 text-xs text-ocean-secondary/60">
                                <Calendar className="w-3 h-3" />
                                {new Date(r.created_at).toLocaleDateString()}
                              </div>
                            </div>
                          </div>
                          
                          <div className="mt-4 pt-4 border-t border-ocean-primary/10">
                            <Button 
                              variant="destructive" 
                              onClick={()=>remove(r.id)}
                              className="w-full bg-red-500 hover:bg-red-600 text-white"
                            >
                              <Trash2 className="w-4 h-4 mr-2" />
                              Delete
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))
              )}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  )
}
