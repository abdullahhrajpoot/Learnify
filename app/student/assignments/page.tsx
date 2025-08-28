'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabaseClient'
import { motion } from 'framer-motion'
import { 
  BookOpen, 
  Download, 
  CheckCircle, 
  Clock, 
  User, 
  Calendar,
  FileText,
  Sparkles,
  ArrowRight,
  AlertCircle,
  Check,
  XCircle,
  Waves
} from 'lucide-react'

export default function StudentAssignmentsPage() {
  const [assignments, setAssignments] = useState<any[]>([])
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
          setAssignments([])
          setLoading(false)
          return
        }

        const { data, error } = await supabase
          .from('assignments')
          .select(`
            id,
            title,
            description,
            created_at,
            deadline,
            is_done,
            file_path,
            file_name,
            tutor_id,
            tutors:profiles!assignments_tutor_id_fkey ( full_name )
          `)
          .eq('student_id', user.id)
          .order('created_at', { ascending: false })

        if (error) throw error
        if (mounted) setAssignments(data ?? [])
      } catch (err: any) {
        setError(err.message || 'Failed to load assignments')
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
      throw new Error(json.error || 'Failed to get signed url')
    } catch (err: any) {
      console.error(err)
      throw err
    }
  }

  async function markAsDone(id: string) {
    try {
      const { error } = await supabase
        .from('assignments')
        .update({ is_done: true })
        .eq('id', id)

      if (error) throw error
      setAssignments((prev) =>
        prev.map((a) => (a.id === id ? { ...a, is_done: true } : a))
      )
    } catch (err) {
      console.error(err)
      alert('Failed to mark as done')
    }
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5
      }
    }
  };

  const stats = {
    total: assignments.length,
    completed: assignments.filter(a => a.is_done).length,
    pending: assignments.filter(a => !a.is_done).length,
    overdue: assignments.filter(a => a.deadline && new Date(a.deadline) < new Date() && !a.is_done).length
  };

  return (
    <div className="min-h-screen ocean-gradient-light">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-8"
        >
          {/* Header */}
          <motion.div variants={itemVariants} className="text-center sm:text-left">
            {/* <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 backdrop-blur-sm border border-ocean-primary/20 text-ocean-primary text-sm font-medium mb-4">
              <Waves className="w-4 h-4" />
              <span>Student Dashboard</span>
            </div> */}
            
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
              My Assignments
            </h1>
            <p className="text-lg text-gray-600">
              Track your learning progress and manage your assignments
            </p>
          </motion.div>

          {/* Stats Cards */}
          <motion.div variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="ocean-gradient-card rounded-xl p-6 border border-ocean-primary/10 shadow-lg">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 rounded-lg bg-gradient-to-br from-ocean-primary to-cyan-500 shadow-md">
                  <BookOpen className="w-5 h-5 text-white" />
                </div>
                <span className="text-sm font-medium text-gray-600">Total</span>
              </div>
              <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
            </div>

            <div className="ocean-gradient-card rounded-xl p-6 border border-ocean-secondary/10 shadow-lg">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 rounded-lg bg-gradient-to-br from-ocean-secondary to-emerald-500 shadow-md">
                  <CheckCircle className="w-5 h-5 text-white" />
                </div>
                <span className="text-sm font-medium text-gray-600">Completed</span>
              </div>
              <div className="text-2xl font-bold text-gray-900">{stats.completed}</div>
            </div>

            <div className="ocean-gradient-card rounded-xl p-6 border border-ocean-accent/10 shadow-lg">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 rounded-lg bg-gradient-to-br from-ocean-accent to-blue-500 shadow-md">
                  <Clock className="w-5 h-5 text-white" />
                </div>
                <span className="text-sm font-medium text-gray-600">Pending</span>
              </div>
              <div className="text-2xl font-bold text-gray-900">{stats.pending}</div>
            </div>

            <div className="ocean-gradient-card rounded-xl p-6 border border-red-500/10 shadow-lg">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 rounded-lg bg-gradient-to-br from-red-500 to-pink-500 shadow-md">
                  <AlertCircle className="w-5 h-5 text-white" />
                </div>
                <span className="text-sm font-medium text-gray-600">Overdue</span>
              </div>
              <div className="text-2xl font-bold text-gray-900">{stats.overdue}</div>
            </div>
          </motion.div>

          {/* Loading State */}
          {loading && (
            <motion.div variants={itemVariants} className="grid gap-6">
              {[1, 2, 3].map(i => (
                <div key={i} className="ocean-gradient-card rounded-xl p-6 animate-pulse">
                  <div className="h-6 w-1/3 bg-gray-200 rounded mb-4"></div>
                  <div className="h-4 w-1/4 bg-gray-200 rounded mb-3"></div>
                  <div className="h-3 w-full bg-gray-100 rounded mb-4"></div>
                  <div className="flex gap-2">
                    <div className="h-8 w-20 bg-gray-200 rounded"></div>
                    <div className="h-8 w-24 bg-gray-200 rounded"></div>
                  </div>
                </div>
              ))}
            </motion.div>
          )}

          {/* Error State */}
          {error && (
            <motion.div variants={itemVariants} className="ocean-gradient-card rounded-xl p-6 border border-red-200 bg-red-50">
              <div className="flex items-center gap-3 text-red-600">
                <XCircle className="w-5 h-5" />
                <span className="font-medium">{error}</span>
              </div>
            </motion.div>
          )}

          {/* Empty State */}
          {!loading && assignments.length === 0 && (
            <motion.div variants={itemVariants} className="ocean-gradient-card rounded-xl p-12 text-center">
              <div className="flex items-center justify-center mb-4">
                <div className="p-3 rounded-full bg-gradient-to-br from-ocean-primary to-ocean-secondary shadow-lg">
                  <BookOpen className="w-8 h-8 text-white" />
                </div>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No Assignments Yet</h3>
              <p className="text-gray-600">Your tutors will assign work here when ready.</p>
            </motion.div>
          )}

          {/* Assignments List */}
          {!loading && assignments.length > 0 && (
            <motion.div variants={itemVariants} className="grid gap-6">
              {assignments.map((assignment, index) => (
                <motion.div
                  key={assignment.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -4, scale: 1.02 }}
                  className="group relative"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-ocean-primary/5 to-ocean-secondary/5 rounded-xl blur-xl group-hover:blur-2xl transition-all duration-300" />
                  <div className="relative ocean-gradient-card rounded-xl p-6 border border-ocean-primary/10 shadow-lg hover:shadow-xl transition-all duration-300">
                    <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
                      {/* Left Content */}
                      <div className="flex-1 space-y-4">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <Link 
                              href={`/student/assignments/${assignment.id}`}
                              className="text-xl font-bold text-gray-900 hover:text-ocean-primary transition-colors duration-200 group/link break-words"
                            >
                              <span className="group-hover/link:underline">{assignment.title}</span>
                              <ArrowRight className="w-4 h-4 inline ml-2 opacity-0 group-hover/link:opacity-100 transition-opacity" />
                            </Link>
                            
                            <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                              <div className="flex items-center gap-1">
                                <User className="w-4 h-4" />
                                <span>{assignment?.tutors?.full_name ?? 'Unknown Tutor'}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Calendar className="w-4 h-4" />
                                <span>Assigned {new Date(assignment.created_at).toLocaleDateString()}</span>
                              </div>
                            </div>
                          </div>

                          {/* Status Badge */}
                          <div className="flex items-center gap-2">
                            {assignment.deadline && (
                              <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                                new Date(assignment.deadline) < new Date() && !assignment.is_done
                                  ? 'bg-red-100 text-red-700'
                                  : 'bg-blue-100 text-blue-700'
                              }`}>
                                <Clock className="w-3 h-3 inline mr-1" />
                                {new Date(assignment.deadline).toLocaleDateString()}
                              </div>
                            )}
                            
                            {assignment.is_done ? (
                              <div className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                                <Check className="w-3 h-3 inline mr-1" />
                                Completed
                              </div>
                            ) : (
                              <div className="px-3 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-700">
                                Pending
                              </div>
                            )}
                          </div>
                        </div>

                        <p className="text-gray-700 leading-relaxed break-words">{assignment.description}</p>
                      </div>

                      {/* Right Actions */}
                      <div className="flex flex-col gap-3 lg:items-end">
                        {assignment.file_path && (
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={async () => {
                              try {
                                const url = await getSignedUrl(assignment.file_path)
                                window.open(url, '_blank')
                              } catch {
                                alert('Failed to download file')
                              }
                            }}
                            className="flex items-center gap-2 px-4 py-2 bg-ocean-primary text-white rounded-lg hover:bg-ocean-primary/90 transition-colors duration-200 shadow-md hover:shadow-lg"
                          >
                            <Download className="w-4 h-4" />
                            <span className="truncate max-w-[12rem]">{assignment.file_name ?? 'Download File'}</span>
                          </motion.button>
                        )}

                        <div className="flex gap-2">
                          {!assignment.is_done ? (
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => markAsDone(assignment.id)}
                              className="flex items-center gap-2 px-4 py-2 bg-ocean-secondary text-white rounded-lg hover:bg-ocean-secondary/90 transition-colors duration-200 shadow-md hover:shadow-lg"
                            >
                              <Check className="w-4 h-4" />
                              Mark Complete
                            </motion.button>
                          ) : (
                            <div className="flex items-center gap-2 px-4 py-2 bg-green-100 text-green-700 rounded-lg">
                              <Check className="w-4 h-4" />
                              <span className="font-medium">Completed</span>
                            </div>
                          )}

                          <Link href={`/student/assignments/${assignment.id}`}>
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              className="flex items-center gap-2 px-4 py-2 border border-ocean-primary text-ocean-primary rounded-lg hover:bg-ocean-primary hover:text-black transition-all duration-200"
                            >
                              <FileText className="w-4 h-4" />
                              View Details
                            </motion.button>
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  )
}
