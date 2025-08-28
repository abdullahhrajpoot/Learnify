'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { motion } from 'framer-motion'
import { Plus, BookOpen, Users, GraduationCap, UserSquare2, Sparkles, Shield, CheckCircle, AlertCircle } from 'lucide-react'

export default function AdminAddPage() {
  const [tab, setTab] = useState<'subjects' | 'tutors' | 'students' | 'guardians'>('subjects')

  useEffect(() => {
    const qp = new URLSearchParams(window.location.search).get('tab')
    if (['tutors','students','guardians'].includes(qp || '')) setTab(qp as any)
  }, [])

  const tabs = [
    { id: 'subjects', label: 'Subjects', icon: <BookOpen className="w-4 h-4" /> },
    { id: 'tutors', label: 'Tutors', icon: <GraduationCap className="w-4 h-4" /> },
    { id: 'students', label: 'Students', icon: <Users className="w-4 h-4" /> },
    { id: 'guardians', label: 'Guardians', icon: <UserSquare2 className="w-4 h-4" /> }
  ]

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
            <Plus className="w-8 h-8 text-ocean-primary" />
          </div>
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold text-ocean-primary">
              Add / Create
            </h1>
            <p className="text-ocean-secondary/80 text-sm sm:text-base">
              Create new subjects and invite users
            </p>
          </div>
          <Sparkles className="w-6 h-6 text-ocean-accent ml-auto" />
        </motion.div>

        {/* Tab Navigation */}
        <motion.div
          className="flex flex-wrap gap-2 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          {tabs.map((tabItem) => (
            <motion.div
              key={tabItem.id}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                variant={tab === tabItem.id ? 'default' : 'outline'}
                onClick={() => setTab(tabItem.id as any)}
                className={`
                  ${tab === tabItem.id 
                    ? 'ocean-gradient text-white shadow-lg' 
                    : 'bg-white/80 backdrop-blur-sm border-ocean-primary/20 text-ocean-primary hover:bg-ocean-primary/5'
                  }
                  flex items-center gap-2 px-4 py-2 rounded-xl font-medium
                `}
              >
                {tabItem.icon}
                {tabItem.label}
              </Button>
            </motion.div>
          ))}
        </motion.div>

        {/* Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {tab === 'subjects' ? <AddSubject /> : <InviteRole role={tab === 'tutors' ? 'tutor' : tab === 'students' ? 'student' : 'guardian'} />}
        </motion.div>
      </div>
    </div>
  )
}

function AddSubject() {
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)
  const [list, setList] = useState<{ id:number, name:string }[]>([])
  const [success, setSuccess] = useState(false)

  const load = async () => {
    const { data } = await supabase.from('subjects').select('*').order('id')
    setList(data || [])
  }

  useEffect(() => { load() }, [])

  const add = async () => {
    if (!name.trim()) return
    setLoading(true)
    const { error } = await supabase.from('subjects').insert({ name: name.trim() })
    setLoading(false)
    if (error) return alert(error.message)
    setName('')
    setSuccess(true)
    setTimeout(() => setSuccess(false), 3000)
    load()
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Add Form */}
      <Card className="ocean-gradient-card shadow-lg border-0">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-ocean-primary">
            <BookOpen className="w-5 h-5" />
            Add New Subject
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-3">
            <Input 
              placeholder="Subject name" 
              value={name} 
              onChange={e => setName(e.target.value)}
              className="flex-1 border-ocean-primary/20 focus:border-ocean-primary bg-white/80 backdrop-blur-sm"
              onKeyPress={(e) => e.key === 'Enter' && add()}
            />
            <Button 
              onClick={add} 
              disabled={loading || !name.trim()}
              className="ocean-gradient text-white shadow-lg hover:shadow-xl"
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Adding...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Plus className="w-4 h-4" />
                  Add
                </div>
              )}
            </Button>
          </div>
          
          {success && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg"
            >
              <CheckCircle className="w-5 h-5 text-green-600" />
              <span className="text-green-800 font-medium">Subject added successfully!</span>
            </motion.div>
          )}
        </CardContent>
      </Card>

      {/* Subject List */}
      <Card className="ocean-gradient-card shadow-lg border-0">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-ocean-primary">
            <Shield className="w-5 h-5" />
            All Subjects ({list.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {list.length === 0 ? (
            <div className="text-center py-8 text-ocean-secondary/60">
              <BookOpen className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>No subjects added yet</p>
            </div>
          ) : (
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {list.map((subject, index) => (
                <motion.div
                  key={subject.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="flex items-center justify-between p-3 bg-white/50 backdrop-blur-sm rounded-lg hover:bg-white/70 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gradient-to-r from-ocean-primary to-ocean-secondary rounded-lg flex items-center justify-center text-white text-sm font-bold">
                      {subject.name.charAt(0).toUpperCase()}
                    </div>
                    <span className="font-medium text-ocean-primary">{subject.name}</span>
                  </div>
                  <Badge variant="secondary" className="bg-ocean-secondary/10 text-ocean-secondary border-ocean-secondary/20">
                    #{subject.id}
                  </Badge>
                </motion.div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

function InviteRole({ role }: { role:'tutor'|'student'|'guardian' }) {
  const [form, setForm] = useState({ email:'', password:'123456', full_name:'' })
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  const roleConfig = {
    tutor: { icon: <GraduationCap className="w-5 h-5" />, color: 'from-blue-500 to-cyan-500' },
    student: { icon: <Users className="w-5 h-5" />, color: 'from-teal-500 to-emerald-500' },
    guardian: { icon: <UserSquare2 className="w-5 h-5" />, color: 'from-emerald-500 to-green-500' }
  }

  const invite = async () => {
    if(!form.email || !form.full_name) {
      setError('Email and full name are required')
      return
    }
    setLoading(true)
    setError('')
    
    const res = await fetch('/api/admin/create-user', {
      method:'POST',
      headers:{ 'Content-Type':'application/json' },
      body: JSON.stringify({ ...form, role })
    })
    setLoading(false)
    
    if(!res.ok){
      const j = await res.json().catch(()=>({}))
      setError(j.error || 'Failed to create user')
      return
    }
    
    setSuccess(true)
    setForm({ email:'', password:'123456', full_name:'' })
    setTimeout(() => setSuccess(false), 3000)
  }

  return (
    <Card className="ocean-gradient-card shadow-lg border-0 max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-ocean-primary">
          <div className={`p-2 rounded-lg bg-gradient-to-r ${roleConfig[role].color} text-white`}>
            {roleConfig[role].icon}
          </div>
          Invite New {role.charAt(0).toUpperCase() + role.slice(1)}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-ocean-primary">Email</label>
            <Input 
              placeholder="user@example.com" 
              value={form.email} 
              onChange={e => setForm({...form, email: e.target.value})}
              className="border-ocean-primary/20 focus:border-ocean-primary bg-white/80 backdrop-blur-sm"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-ocean-primary">Password</label>
            <Input 
              placeholder="Password" 
              value={form.password} 
              onChange={e => setForm({...form, password: e.target.value})}
              className="border-ocean-primary/20 focus:border-ocean-primary bg-white/80 backdrop-blur-sm"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-ocean-primary">Full Name</label>
            <Input 
              placeholder="Full name" 
              value={form.full_name} 
              onChange={e => setForm({...form, full_name: e.target.value})}
              className="border-ocean-primary/20 focus:border-ocean-primary bg-white/80 backdrop-blur-sm"
            />
          </div>
        </div>

        {error && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg"
          >
            <AlertCircle className="w-5 h-5 text-red-600" />
            <span className="text-red-800 font-medium">{error}</span>
          </motion.div>
        )}

        {success && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg"
          >
            <CheckCircle className="w-5 h-5 text-green-600" />
            <span className="text-green-800 font-medium">User created successfully!</span>
          </motion.div>
        )}

        <Button 
          onClick={invite} 
          disabled={loading || !form.email || !form.full_name}
          className="w-full ocean-gradient text-white shadow-lg hover:shadow-xl"
        >
          {loading ? (
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              Creating...
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Create {role.charAt(0).toUpperCase() + role.slice(1)}
            </div>
          )}
        </Button>
      </CardContent>
    </Card>
  )
}
