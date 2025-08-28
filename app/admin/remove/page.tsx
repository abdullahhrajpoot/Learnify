'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { motion } from 'framer-motion'
import { Trash2, Users, BookOpen, Shield, Sparkles, AlertTriangle, User, Calendar, Phone } from 'lucide-react'

export default function AdminRemovePage() {
  const [tab, setTab] = useState<'subjects'|'users'>('subjects')
  const [loading, setLoading] = useState(false)
  
  useEffect(() => {
    const qp = new URLSearchParams(window.location.search).get('tab')
    if (qp === 'users') setTab('users')
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
          <div className="p-2 bg-red-500/10 rounded-lg">
            <Trash2 className="w-8 h-8 text-red-500" />
          </div>
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold text-ocean-primary">
              Remove / Delete
            </h1>
            <p className="text-ocean-secondary/80 text-sm sm:text-base">
              Permanently remove users and subjects
            </p>
          </div>
          <Sparkles className="w-6 h-6 text-ocean-accent ml-auto" />
        </motion.div>

        {/* Warning Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Card className="bg-red-50 border-red-200 shadow-lg">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <AlertTriangle className="w-6 h-6 text-red-600" />
                <div>
                  <h3 className="font-semibold text-red-800">⚠️ Warning</h3>
                  <p className="text-red-700 text-sm">These actions are permanent and cannot be undone. Please proceed with caution.</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Tab Navigation */}
        <motion.div
          className="flex gap-2 mb-8 mt-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button 
              variant={tab==='subjects'?'default':'outline'} 
              onClick={()=>setTab('subjects')}
              className={`
                ${tab === 'subjects' 
                  ? 'bg-red-500 hover:bg-red-600 text-white shadow-lg' 
                  : 'bg-white/80 backdrop-blur-sm border-ocean-primary/20 text-ocean-primary hover:bg-ocean-primary/5'
                }
                flex items-center gap-2 px-4 py-2 rounded-xl font-medium
              `}
            >
              <BookOpen className="w-4 h-4" />
              Subjects
            </Button>
          </motion.div>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button 
              variant={tab==='users'?'default':'outline'} 
              onClick={()=>setTab('users')}
              className={`
                ${tab === 'users' 
                  ? 'bg-red-500 hover:bg-red-600 text-white shadow-lg' 
                  : 'bg-white/80 backdrop-blur-sm border-ocean-primary/20 text-ocean-primary hover:bg-ocean-primary/5'
                }
                flex items-center gap-2 px-4 py-2 rounded-xl font-medium
              `}
            >
              <Users className="w-4 h-4" />
              Users
            </Button>
          </motion.div>
        </motion.div>

        {/* Content */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {tab === 'subjects' ? <DeleteSubjects itemVariants={itemVariants} /> : <DeleteUsers itemVariants={itemVariants} />}
        </motion.div>
      </div>
    </div>
  )
}

function DeleteSubjects({ itemVariants }: { itemVariants: any }) {
  const [items, setItems] = useState<{id:number;name:string}[]>([])
  const [loading, setLoading] = useState(true)
  const [deleting, setDeleting] = useState<number | null>(null)
  
  useEffect(()=>{ load() }, [])
  
  const load = async () => {
    setLoading(true)
    const { data } = await supabase.from('subjects').select('*').order('id')
    setItems(data || [])
    setLoading(false)
  }
  
  const drop = async (id:number) => {
    if (!confirm('Are you sure you want to delete this subject? This action is permanent and cannot be undone.')) return
    setDeleting(id)
    const { error } = await supabase.from('subjects').delete().eq('id', id)
    if (error) {
      alert('Failed to delete subject: ' + error.message)
    }
    setDeleting(null)
    load()
  }

  return (
    <motion.div variants={itemVariants} className="space-y-4">
      {loading ? (
        <div className="grid gap-4">
          {[...Array(5)].map((_, i) => (
            <Card key={i} className="ocean-gradient-card shadow-lg border-0">
              <CardContent className="p-6">
                <div className="animate-pulse">
                  <div className="h-4 bg-white/20 rounded w-1/3 mb-2"></div>
                  <div className="h-3 bg-white/20 rounded w-1/4"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid gap-4">
          {items.length === 0 ? (
            <Card className="ocean-gradient-card shadow-lg border-0">
              <CardContent className="p-12 text-center">
                <BookOpen className="w-16 h-16 text-ocean-secondary/40 mx-auto mb-4" />
                <p className="text-ocean-secondary/60 text-lg">No subjects to delete</p>
                <p className="text-ocean-secondary/40 text-sm">All subjects are safe</p>
              </CardContent>
            </Card>
          ) : (
            items.map((s, index) => (
              <motion.div 
                key={s.id} 
                initial={{opacity:0, y:20}} 
                animate={{opacity:1, y:0}} 
                transition={{ delay: index * 0.05 }}
                whileHover={{scale:1.02, y:-2}}
              >
                <Card className="ocean-gradient-card shadow-lg border-0 overflow-hidden">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-red-600 rounded-lg flex items-center justify-center text-white font-bold text-lg">
                          {s.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div className="font-semibold text-ocean-primary text-lg">{s.name}</div>
                          <div className="text-sm text-ocean-secondary/70">Subject ID: #{s.id}</div>
                        </div>
                      </div>
                      <Button 
                        variant="destructive" 
                        onClick={()=>drop(s.id)}
                        disabled={deleting === s.id}
                        className="bg-red-500 hover:bg-red-600 text-white shadow-lg"
                      >
                        {deleting === s.id ? (
                          <div className="flex items-center gap-2">
                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                            Deleting...
                          </div>
                        ) : (
                          <div className="flex items-center gap-2">
                            <Trash2 className="w-4 h-4" />
                            Delete
                          </div>
                        )}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))
          )}
        </div>
      )}
    </motion.div>
  )
}

function DeleteUsers({ itemVariants }: { itemVariants: any }) {
  const [rows, setRows] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [deleting, setDeleting] = useState<string | null>(null)
  
  useEffect(()=>{ load() }, [])
  
  const load = async () => {
    setLoading(true)
    const { data } = await supabase.from('profiles').select('id, full_name, role, created_at, phone').order('created_at', { ascending: false })
    setRows(data || [])
    setLoading(false)
  }

  const roleColor = (role: string) => {
    switch (role) {
      case 'admin': return 'bg-green-500'
      case 'tutor': return 'bg-blue-500'
      case 'student': return 'bg-purple-500'
      case 'guardian': return 'bg-yellow-500'
      default: return 'bg-gray-400'
    }
  }

  const removeUser = async (id:string) => {
    if (!confirm('Are you sure you want to delete this user? This will permanently remove their account and all associated data. This action cannot be undone.')) return
    setDeleting(id)
    try {
      const res = await fetch('/api/admin/delete-user', {
        method: 'POST',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify({ userId: id })
      })
      if (!res.ok) {
        const error = await res.json().catch(()=>({}))
        alert('Failed to delete user: ' + (error.error || 'Unknown error'))
      }
    } catch (error) {
      alert('Failed to delete user: ' + error)
    }
    setDeleting(null)
    load()
  }

  return (
    <motion.div variants={itemVariants} className="space-y-4">
      {loading ? (
        <div className="grid gap-4">
          {[...Array(5)].map((_, i) => (
            <Card key={i} className="ocean-gradient-card shadow-lg border-0">
              <CardContent className="p-6">
                <div className="animate-pulse">
                  <div className="h-4 bg-white/20 rounded w-1/3 mb-2"></div>
                  <div className="h-3 bg-white/20 rounded w-1/4"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid gap-4">
          {rows.length === 0 ? (
            <Card className="ocean-gradient-card shadow-lg border-0">
              <CardContent className="p-12 text-center">
                <User className="w-16 h-16 text-ocean-secondary/40 mx-auto mb-4" />
                <p className="text-ocean-secondary/60 text-lg">No users to delete</p>
                <p className="text-ocean-secondary/40 text-sm">All users are safe</p>
              </CardContent>
            </Card>
          ) : (
            rows.map((r, index) => (
              <motion.div 
                key={r.id} 
                initial={{opacity:0, y:20}} 
                animate={{opacity:1, y:0}} 
                transition={{ delay: index * 0.05 }}
                whileHover={{scale:1.02, y:-2}}
              >
                <Card className="ocean-gradient-card shadow-lg border-0 overflow-hidden">
                  <CardContent className="p-6">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-red-600 rounded-lg flex items-center justify-center text-white font-bold text-lg">
                          {(r.full_name || 'U').charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div className="font-semibold text-ocean-primary text-lg">{r.full_name || '(no name)'}</div>
                          <div className="flex items-center gap-4 text-sm text-ocean-secondary/70 mt-1">
                            <div className="flex items-center gap-1">
                              <Shield className="w-3 h-3" />
                              {r.id.slice(0,8)}...
                            </div>
                            <Badge className={`${roleColor(r.role)} text-white`}>{r.role}</Badge>
                            <div className="flex items-center gap-1">
                              <Phone className="w-3 h-3" />
                              {r.phone || 'No phone'}
                            </div>
                            <div className="flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              {r.created_at ? new Date(r.created_at).toLocaleDateString() : '—'}
                            </div>
                          </div>
                        </div>
                      </div>
                      <Button 
                        variant="destructive" 
                        onClick={()=>removeUser(r.id)}
                        disabled={deleting === r.id}
                        className="bg-red-500 hover:bg-red-600 text-white shadow-lg"
                      >
                        {deleting === r.id ? (
                          <div className="flex items-center gap-2">
                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                            Deleting...
                          </div>
                        ) : (
                          <div className="flex items-center gap-2">
                            <Trash2 className="w-4 h-4" />
                            Delete User
                          </div>
                        )}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))
          )}
        </div>
      )}
    </motion.div>
  )
}
