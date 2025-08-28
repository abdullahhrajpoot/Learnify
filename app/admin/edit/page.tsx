
'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from '@/components/ui/input'
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { motion } from "framer-motion"
import { Edit, Users, BookOpen, Shield, Sparkles, Search, RefreshCw, Eye, Phone, Calendar, User, Trash2, Save, X, Plus, Filter, ArrowRight, CheckCircle, AlertCircle, Loader2 } from "lucide-react"

type Role = 'admin' | 'tutor' | 'student' | 'guardian'

type Profile = {
  id: string
  full_name: string | null
  role: Role
  phone?: string | null
  created_at?: string | null
  email?: string | null
}

type Subject = {
  id: number
  name: string
  created_at?: string | null
}

export default function AdminEditPage() {
  const [activeTab, setActiveTab] = useState<'users' | 'subjects'>('users')
  const [rows, setRows] = useState<Profile[]>([])
  const [subjects, setSubjects] = useState<Subject[]>([])
  const [loadingUsers, setLoadingUsers] = useState(true)
  const [loadingSubjects, setLoadingSubjects] = useState(true)
  const [editId, setEditId] = useState<string | null>(null)
  const [form, setForm] = useState<Partial<Profile>>({})
  const [savingUser, setSavingUser] = useState(false)
  const [search, setSearch] = useState('')
  const [roleFilter, setRoleFilter] = useState<'all' | Role>('all')
  const [subjSaving, setSubjSaving] = useState(false)
  const [subjEditId, setSubjEditId] = useState<number | null>(null)
  const [subjFormName, setSubjFormName] = useState('')
  const [newSubject, setNewSubject] = useState('')

  useEffect(() => {
    loadUsers()
    loadSubjects()
  }, [])

  async function loadUsers() {
    setLoadingUsers(true)
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, full_name, role, phone, created_at, email')
        .order('created_at', { ascending: false })
        .limit(200)

      if (!error && data) {
        setRows(data)
      } else {
        console.error('Error loading users:', error)
        setRows([])
      }
    } catch (err) {
      console.error('Error loading users:', err)
      setRows([])
    } finally {
      setLoadingUsers(false)
    }
  }

  async function loadSubjects() {
    setLoadingSubjects(true)
    try {
      const { data, error } = await supabase
        .from('subjects')
        .select('*')
        .order('name')

      if (error) {
        console.error('Error loading subjects:', error)
        setSubjects([])
        return
      }

      setSubjects(data || [])
    } catch (err) {
      console.error('Error loading subjects:', err)
      setSubjects([])
    } finally {
      setLoadingSubjects(false)
    }
  }

  function startEditUser(r: Profile) {
    setEditId(r.id)
    setForm({ full_name: r.full_name ?? '', phone: r.phone ?? '', role: r.role })
  }

  function cancelEditUser() {
    setEditId(null)
    setForm({})
  }

  async function saveEditUser() {
    if (!editId) return
    setSavingUser(true)

    const payload: Partial<Profile> = {
      full_name: (form.full_name || '').trim(),
      role: form.role,
    }

    if (form.phone) payload.phone = form.phone.trim()

    try {
      const { error } = await supabase
        .from('profiles')
        .update(payload)
        .eq('id', editId)

      if (error) {
        console.error('Error updating user:', error)
        alert('Failed to update user')
        return
      }

      setRows(prev => prev.map(r => 
        r.id === editId 
          ? { ...r, ...payload }
          : r
      ))

      setEditId(null)
      setForm({})
    } catch (err) {
      console.error('Error updating user:', err)
      alert('Failed to update user')
    } finally {
      setSavingUser(false)
    }
  }

  async function addSubject() {
    if (!newSubject.trim()) return
    setSubjSaving(true)

    try {
      const { data, error } = await supabase
        .from('subjects')
        .insert([{ name: newSubject.trim() }])
        .select()

      if (error) {
        console.error('Error adding subject:', error)
        alert('Failed to add subject')
        return
      }

      setSubjects(prev => [...prev, ...(data || [])])
      setNewSubject('')
    } catch (err) {
      console.error('Error adding subject:', err)
      alert('Failed to add subject')
    } finally {
      setSubjSaving(false)
    }
  }

  function startEditSubject(s: Subject) {
    setSubjEditId(s.id)
    setSubjFormName(s.name)
  }

  function cancelEditSubject() {
    setSubjEditId(null)
    setSubjFormName('')
  }

  async function saveEditSubject() {
    if (!subjEditId || !subjFormName.trim()) return
    setSubjSaving(true)

    try {
      const { error } = await supabase
        .from('subjects')
        .update({ name: subjFormName.trim() })
        .eq('id', subjEditId)

      if (error) {
        console.error('Error updating subject:', error)
        alert('Failed to update subject')
        return
      }

      setSubjects(prev => prev.map(s => 
        s.id === subjEditId 
          ? { ...s, name: subjFormName.trim() }
          : s
      ))

      setSubjEditId(null)
      setSubjFormName('')
    } catch (err) {
      console.error('Error updating subject:', err)
      alert('Failed to update subject')
    } finally {
      setSubjSaving(false)
    }
  }

  async function deleteSubject(id: number) {
    if (!confirm('Are you sure you want to delete this subject? This action is permanent and cannot be undone.')) return

    try {
      const { error } = await supabase
        .from('subjects')
        .delete()
        .eq('id', id)

      if (error) {
        console.error('Error deleting subject:', error)
        alert('Failed to delete subject')
        return
      }

      setSubjects(prev => prev.filter(s => s.id !== id))
    } catch (err) {
      console.error('Error deleting subject:', err)
      alert('Failed to delete subject')
    }
  }

  const filteredRows = rows.filter(r => {
    if (roleFilter !== 'all' && r.role !== roleFilter) return false
    if (search.trim()) {
      const searchLower = search.toLowerCase()
      return r.full_name?.toLowerCase().includes(searchLower) ||
             r.phone?.toLowerCase().includes(searchLower) ||
             r.email?.toLowerCase().includes(searchLower)
    }
    return true
  })

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

  const roleColor = (role: string) => {
    switch (role) {
      case 'admin': return 'bg-red-100 text-red-800 border-red-200'
      case 'tutor': return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'student': return 'bg-green-100 text-green-800 border-green-200'
      case 'guardian': return 'bg-purple-100 text-purple-800 border-purple-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
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
          <div className="p-3 bg-gradient-to-r from-ocean-primary/20 to-ocean-secondary/20 rounded-xl">
            <Edit className="w-8 h-8 text-ocean-primary" />
          </div>
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-ocean-primary to-ocean-secondary bg-clip-text text-transparent">
              Edit & Manage
            </h1>
            <p className="text-ocean-secondary/80 text-sm sm:text-base">
              Update user profiles and subjects with precision
            </p>
          </div>
          <div className="ml-auto flex items-center gap-2">
            <div className="p-2 bg-ocean-accent/10 rounded-lg">
              <Sparkles className="w-5 h-5 text-ocean-accent" />
            </div>
            <div className="hidden sm:flex items-center gap-1 text-xs text-ocean-secondary/60">
              <CheckCircle className="w-3 h-3" />
              <span>Live Updates</span>
            </div>
          </div>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div variants={itemVariants}>
            <Card className="ocean-gradient-card shadow-lg border-0 overflow-hidden relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <CardContent className="p-6 relative z-10">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl">
                    <Users className="w-6 h-6 text-white" />
                  </div>
                  <Badge className="bg-blue-100 text-blue-800 border-blue-200">
                    {rows.length}
                  </Badge>
                </div>
                <div className="text-2xl font-bold text-ocean-primary mb-1">Total Users</div>
                <div className="text-sm text-ocean-secondary/70">Active accounts</div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={itemVariants}>
            <Card className="ocean-gradient-card shadow-lg border-0 overflow-hidden relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-teal-500/20 to-emerald-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <CardContent className="p-6 relative z-10">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-gradient-to-r from-teal-500 to-emerald-500 rounded-xl">
                    <BookOpen className="w-6 h-6 text-white" />
                  </div>
                  <Badge className="bg-green-100 text-green-800 border-green-200">
                    {subjects.length}
                  </Badge>
                </div>
                <div className="text-2xl font-bold text-ocean-primary mb-1">Subjects</div>
                <div className="text-sm text-ocean-secondary/70">Available courses</div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={itemVariants}>
            <Card className="ocean-gradient-card shadow-lg border-0 overflow-hidden relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-pink-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <CardContent className="p-6 relative z-10">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl">
                    <Filter className="w-6 h-6 text-white" />
                  </div>
                  <Badge className="bg-purple-100 text-purple-800 border-purple-200">
                    {roleFilter === 'all' ? 'All' : roleFilter}
                  </Badge>
                </div>
                <div className="text-2xl font-bold text-ocean-primary mb-1">Filter</div>
                <div className="text-sm text-ocean-secondary/70">Current view</div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={itemVariants}>
            <Card className="ocean-gradient-card shadow-lg border-0 overflow-hidden relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-orange-500/20 to-red-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <CardContent className="p-6 relative z-10">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl">
                    <Edit className="w-6 h-6 text-white" />
                  </div>
                  <Badge className="bg-orange-100 text-orange-800 border-orange-200">
                    {editId ? 'Editing' : 'Ready'}
                  </Badge>
                </div>
                <div className="text-2xl font-bold text-ocean-primary mb-1">Status</div>
                <div className="text-sm text-ocean-secondary/70">Edit mode</div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>

        {/* Tab Navigation */}
        <motion.div
          className="flex space-x-1 bg-white/50 backdrop-blur-sm rounded-xl p-1 mb-8 shadow-lg"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <button
            onClick={() => setActiveTab('users')}
            className={`flex-1 sm:flex-none flex items-center gap-2 px-6 py-4 rounded-lg text-sm font-medium transition-all duration-300 ${
              activeTab === 'users'
                ? 'ocean-gradient text-white shadow-lg transform scale-105'
                : 'text-ocean-secondary hover:text-ocean-primary hover:bg-white/50 hover:scale-105'
            }`}
          >
            <Users className="w-5 h-5" />
            <span className="hidden sm:inline">Users</span>
            <Badge className={`ml-auto ${activeTab === 'users' ? 'bg-white/20 text-white' : 'bg-ocean-primary/10 text-ocean-primary'}`}>
              {rows.length}
            </Badge>
          </button>
          <button
            onClick={() => setActiveTab('subjects')}
            className={`flex-1 sm:flex-none flex items-center gap-2 px-6 py-4 rounded-lg text-sm font-medium transition-all duration-300 ${
              activeTab === 'subjects'
                ? 'ocean-gradient text-white shadow-lg transform scale-105'
                : 'text-ocean-secondary hover:text-ocean-primary hover:bg-white/50 hover:scale-105'
            }`}
          >
            <BookOpen className="w-5 h-5" />
            <span className="hidden sm:inline">Subjects</span>
            <Badge className={`ml-auto ${activeTab === 'subjects' ? 'bg-white/20 text-white' : 'bg-ocean-primary/10 text-ocean-primary'}`}>
              {subjects.length}
            </Badge>
          </button>
        </motion.div>

        {/* USERS */}
        {activeTab === 'users' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="space-y-6"
          >
            {/* Search and Filter */}
            <Card className="ocean-gradient-card shadow-lg border-0">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-ocean-primary">
                  <Search className="w-5 h-5" />
                  Search & Filter Users
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-ocean-secondary/60" />
                    <Input
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      placeholder="Search by name, phone, or email..."
                      className="pl-10 border-ocean-primary/20 focus:border-ocean-primary bg-white/80 backdrop-blur-sm h-12 text-base"
                    />
                  </div>
                  <select
                    value={roleFilter}
                    onChange={(e) => setRoleFilter(e.target.value as 'all' | Role)}
                    className="px-4 py-3 border border-ocean-primary/20 rounded-lg bg-white/80 backdrop-blur-sm text-ocean-primary focus:border-ocean-primary focus:outline-none h-12 text-base"
                  >
                    <option value="all">All Roles</option>
                    <option value="admin">Admin</option>
                    <option value="tutor">Tutor</option>
                    <option value="student">Student</option>
                    <option value="guardian">Guardian</option>
                  </select>
                  <Button
                    onClick={loadUsers}
                    variant="outline"
                    className="bg-white/80 backdrop-blur-sm border-ocean-primary/20 text-ocean-primary hover:bg-ocean-primary/5 h-12 px-6"
                  >
                    <RefreshCw className="w-5 h-5" />
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Users List */}
            {loadingUsers ? (
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="grid gap-4"
              >
                {[...Array(5)].map((_, i) => (
                  <motion.div key={i} variants={itemVariants}>
                    <Card className="ocean-gradient-card shadow-lg border-0">
                      <CardContent className="p-6">
                        <div className="animate-pulse">
                          <div className="h-6 bg-white/20 rounded w-1/3 mb-3"></div>
                          <div className="h-4 bg-white/20 rounded w-1/4 mb-2"></div>
                          <div className="h-4 bg-white/20 rounded w-1/2"></div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="grid gap-4"
              >
                {filteredRows.length === 0 && (
                  <motion.div variants={itemVariants}>
                    <Card className="ocean-gradient-card shadow-lg border-0">
                      <CardContent className="p-12 text-center">
                        <div className="w-20 h-20 bg-gradient-to-r from-ocean-primary/20 to-ocean-secondary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                          <Users className="w-10 h-10 text-ocean-secondary/60" />
                        </div>
                        <h3 className="text-xl font-semibold text-ocean-primary mb-2">No users found</h3>
                        <p className="text-ocean-secondary/60 mb-4">Try adjusting your search or filters</p>
                        <Button
                          onClick={() => { setSearch(''); setRoleFilter('all'); }}
                          variant="outline"
                          className="bg-white/80 backdrop-blur-sm border-ocean-primary/20 text-ocean-primary hover:bg-ocean-primary/5"
                        >
                          <RefreshCw className="w-4 h-4 mr-2" />
                          Clear Filters
                        </Button>
                      </CardContent>
                    </Card>
                  </motion.div>
                )}
                {filteredRows.map((r, index) => (
                  <motion.div
                    key={r.id}
                    variants={itemVariants}
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Card className="ocean-gradient-card shadow-lg border-0 overflow-hidden group">
                      <CardContent className="p-6">
                        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                          {editId === r.id ? (
                            <div className="flex flex-col sm:flex-row gap-3 sm:items-center w-full">
                              <Input
                                className="flex-1 border-ocean-primary/20 focus:border-ocean-primary bg-white/80 backdrop-blur-sm h-12"
                                value={form.full_name || ''}
                                onChange={(e) => setForm(prev => ({ ...prev, full_name: e.target.value }))}
                                placeholder="Full name"
                              />
                              <Input
                                className="flex-1 border-ocean-primary/20 focus:border-ocean-primary bg-white/80 backdrop-blur-sm h-12"
                                value={form.phone || ''}
                                onChange={(e) => setForm(prev => ({ ...prev, phone: e.target.value }))}
                                placeholder="Phone"
                              />
                              <select
                                value={form.role || ''}
                                onChange={(e) => setForm(prev => ({ ...prev, role: e.target.value as Role }))}
                                className="px-4 py-3 border border-ocean-primary/20 rounded-lg bg-white/80 backdrop-blur-sm text-ocean-primary focus:border-ocean-primary focus:outline-none h-12"
                              >
                                <option value="admin">Admin</option>
                                <option value="tutor">Tutor</option>
                                <option value="student">Student</option>
                                <option value="guardian">Guardian</option>
                              </select>
                              <div className="flex gap-2">
                                <Button
                                  onClick={saveEditUser}
                                  disabled={savingUser}
                                  className="ocean-gradient text-white shadow-lg hover:shadow-xl h-12 px-6"
                                >
                                  {savingUser ? (
                                    <div className="flex items-center gap-2">
                                      <Loader2 className="w-4 h-4 animate-spin" />
                                      Saving...
                                    </div>
                                  ) : (
                                    <div className="flex items-center gap-2">
                                      <Save className="w-4 h-4" />
                                      Save
                                    </div>
                                  )}
                                </Button>
                                <Button 
                                  variant="outline" 
                                  onClick={cancelEditUser}
                                  className="bg-white/80 backdrop-blur-sm border-ocean-primary/20 text-ocean-primary hover:bg-ocean-primary/5 h-12 px-4"
                                >
                                  <X className="w-4 h-4" />
                                </Button>
                              </div>
                            </div>
                          ) : (
                            <>
                              <div className="flex-1">
                                <div className="flex items-center gap-3 mb-3">
                                  <div className="w-12 h-12 bg-gradient-to-r from-ocean-primary/20 to-ocean-secondary/20 rounded-xl flex items-center justify-center">
                                    <User className="w-6 h-6 text-ocean-primary" />
                                  </div>
                                  <div>
                                    <h3 className="text-lg font-semibold text-ocean-primary">{r.full_name || 'Unnamed User'}</h3>
                                    <div className="flex items-center gap-2 mt-1">
                                      <Badge className={roleColor(r.role)}>
                                        {r.role}
                                      </Badge>
                                      <div className="flex items-center gap-1 text-sm text-ocean-secondary/70">
                                        <Shield className="w-3 h-3" />
                                        {r.id.slice(0,8)}...
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <div className="flex items-center gap-4 text-sm text-ocean-secondary/70">
                                  {r.phone && (
                                    <div className="flex items-center gap-1">
                                      <Phone className="w-3 h-3" />
                                      {r.phone}
                                    </div>
                                  )}
                                  {r.created_at && (
                                    <div className="flex items-center gap-1">
                                      <Calendar className="w-3 h-3" />
                                      {new Date(r.created_at).toLocaleDateString()}
                                    </div>
                                  )}
                                </div>
                              </div>
                              <div className="flex gap-2">
                                <Button 
                                  variant="outline" 
                                  size="sm" 
                                  onClick={()=>startEditUser(r)}
                                  className="bg-white/80 backdrop-blur-sm border-ocean-primary/20 text-ocean-primary hover:bg-ocean-primary/5 h-10 px-4"
                                >
                                  <Edit className="w-4 h-4 mr-2" />
                                  Edit
                                </Button>
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  className="bg-white/80 backdrop-blur-sm border-ocean-accent/20 text-ocean-accent hover:bg-ocean-accent/5 h-10 px-4"
                                >
                                  <Eye className="w-4 h-4 mr-2" />
                                  View
                                </Button>
                              </div>
                            </>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </motion.div>
        )}

        {/* SUBJECTS */}
        {activeTab === 'subjects' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="space-y-6"
          >
            {/* Add Subject Form */}
            <Card className="ocean-gradient-card shadow-lg border-0">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-ocean-primary">
                  <Plus className="w-5 h-5" />
                  Add New Subject
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="flex flex-col sm:flex-row gap-3">
                  <Input 
                    value={newSubject} 
                    onChange={e=>setNewSubject(e.target.value)} 
                    placeholder="Enter subject name..." 
                    className="flex-1 border-ocean-primary/20 focus:border-ocean-primary bg-white/80 backdrop-blur-sm h-12 text-base"
                    onKeyPress={(e) => e.key === 'Enter' && addSubject()}
                  />
                  <Button 
                    onClick={addSubject} 
                    disabled={subjSaving || !newSubject.trim()}
                    className="ocean-gradient text-white shadow-lg hover:shadow-xl h-12 px-6"
                  >
                    {subjSaving ? (
                      <div className="flex items-center gap-2">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Adding...
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <Plus className="w-4 h-4" />
                        Add Subject
                      </div>
                    )}
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={loadSubjects}
                    className="bg-white/80 backdrop-blur-sm border-ocean-primary/20 text-ocean-primary hover:bg-ocean-primary/5 h-12 px-4"
                  >
                    <RefreshCw className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Subjects List */}
            {loadingSubjects ? (
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="grid gap-4"
              >
                {[...Array(5)].map((_, i) => (
                  <motion.div key={i} variants={itemVariants}>
                    <Card className="ocean-gradient-card shadow-lg border-0">
                      <CardContent className="p-6">
                        <div className="animate-pulse">
                          <div className="h-6 bg-white/20 rounded w-1/3 mb-3"></div>
                          <div className="h-4 bg-white/20 rounded w-1/4"></div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="grid gap-4"
              >
                {subjects.length === 0 && (
                  <motion.div variants={itemVariants}>
                    <Card className="ocean-gradient-card shadow-lg border-0">
                      <CardContent className="p-12 text-center">
                        <div className="w-20 h-20 bg-gradient-to-r from-ocean-primary/20 to-ocean-secondary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                          <BookOpen className="w-10 h-10 text-ocean-secondary/60" />
                        </div>
                        <h3 className="text-xl font-semibold text-ocean-primary mb-2">No subjects yet</h3>
                        <p className="text-ocean-secondary/60 mb-4">Add your first subject above to get started</p>
                        <Button
                          onClick={() => setNewSubject('Sample Subject')}
                          variant="outline"
                          className="bg-white/80 backdrop-blur-sm border-ocean-primary/20 text-ocean-primary hover:bg-ocean-primary/5"
                        >
                          <Plus className="w-4 h-4 mr-2" />
                          Add Sample
                        </Button>
                      </CardContent>
                    </Card>
                  </motion.div>
                )}
                {subjects.map((s, index) => (
                  <motion.div 
                    key={s.id} 
                    variants={itemVariants}
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Card className="ocean-gradient-card shadow-lg border-0 overflow-hidden group">
                      <CardContent className="p-6">
                        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                          {subjEditId === s.id ? (
                            <div className="flex flex-col sm:flex-row gap-3 sm:items-center w-full">
                              <Input 
                                className="flex-1 border-ocean-primary/20 focus:border-ocean-primary bg-white/80 backdrop-blur-sm h-12" 
                                value={subjFormName} 
                                onChange={e=>setSubjFormName(e.target.value)}
                                placeholder="Subject name"
                              />
                              <div className="flex gap-2">
                                <Button
                                  onClick={saveEditSubject}
                                  disabled={subjSaving}
                                  className="ocean-gradient text-white shadow-lg hover:shadow-xl h-12 px-6"
                                >
                                  {subjSaving ? (
                                    <div className="flex items-center gap-2">
                                      <Loader2 className="w-4 h-4 animate-spin" />
                                      Saving...
                                    </div>
                                  ) : (
                                    <div className="flex items-center gap-2">
                                      <Save className="w-4 h-4" />
                                      Save
                                    </div>
                                  )}
                                </Button>
                                <Button 
                                  variant="outline" 
                                  onClick={cancelEditSubject}
                                  className="bg-white/80 backdrop-blur-sm border-ocean-primary/20 text-ocean-primary hover:bg-ocean-primary/5 h-12 px-4"
                                >
                                  <X className="w-4 h-4" />
                                </Button>
                              </div>
                            </div>
                          ) : (
                            <>
                              <div className="flex-1">
                                <div className="flex items-center gap-3 mb-3">
                                  <div className="w-12 h-12 bg-gradient-to-r from-ocean-primary/20 to-ocean-secondary/20 rounded-xl flex items-center justify-center">
                                    <BookOpen className="w-6 h-6 text-ocean-primary" />
                                  </div>
                                  <div>
                                    <h3 className="text-lg font-semibold text-ocean-primary">{s.name}</h3>
                                    <div className="flex items-center gap-2 mt-1">
                                      <Badge className="bg-ocean-accent/10 text-ocean-accent border-ocean-accent/20">
                                        Subject ID: #{s.id}
                                      </Badge>
                                      {s.created_at && (
                                        <div className="flex items-center gap-1 text-sm text-ocean-secondary/70">
                                          <Calendar className="w-3 h-3" />
                                          {new Date(s.created_at).toLocaleDateString()}
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <div className="flex gap-2">
                                <Button 
                                  variant="outline" 
                                  size="sm" 
                                  onClick={()=>startEditSubject(s)}
                                  className="bg-white/80 backdrop-blur-sm border-ocean-primary/20 text-ocean-primary hover:bg-ocean-primary/5 h-10 px-4"
                                >
                                  <Edit className="w-4 h-4 mr-2" />
                                  Edit
                                </Button>
                                <Button 
                                  variant="outline" 
                                  size="sm" 
                                  onClick={()=>deleteSubject(s.id)}
                                  className="bg-red-50 border-red-200 text-red-600 hover:bg-red-100 h-10 px-4"
                                >
                                  <Trash2 className="w-4 h-4 mr-2" />
                                  Delete
                                </Button>
                              </div>
                            </>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </motion.div>
        )}
      </div>
    </div>
  )
}
