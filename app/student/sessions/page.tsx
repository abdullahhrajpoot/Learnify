'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabaseClient'
import { motion } from 'framer-motion'
import { 
  Calendar, 
  Clock, 
  User, 
  Play, 
  CheckCircle, 
  AlertCircle,
  Sparkles,
  ArrowRight,
  Waves,
  Loader2
} from 'lucide-react'

export default function StudentSessionsPage() {
  const [sessions, setSessions] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchSessions() {
      setLoading(true)
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        setSessions([])
        setLoading(false)
        return
      }

      const { data, error } = await supabase
        .from('sessions')
        .select(`
          id,
          start_time,
          end_time,
          notes,
          tutor:profiles!sessions_tutor_id_fkey ( full_name ),
          tutor_id,
          created_by
        `)
        .eq('student_id', user.id)
        .order('start_time', { ascending: false })

      if (error) console.error(error)
      else setSessions(data || [])
      setLoading(false)
    }

    fetchSessions()
  }, [])

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
    total: sessions.length,
    upcoming: sessions.filter(s => new Date(s.start_time) > new Date()).length,
    past: sessions.filter(s => new Date(s.start_time) < new Date()).length,
    today: sessions.filter(s => {
      const today = new Date().toDateString()
      const sessionDate = new Date(s.start_time).toDateString()
      return today === sessionDate
    }).length
  };

  const getSessionStatus = (startTime: string) => {
    const now = new Date()
    const start = new Date(startTime)
    const end = new Date(startTime)
    end.setHours(end.getHours() + 1) // Assuming 1 hour sessions

    if (now < start) return 'upcoming'
    if (now >= start && now <= end) return 'ongoing'
    return 'completed'
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'upcoming': return 'bg-blue-100 text-blue-700'
      case 'ongoing': return 'bg-green-100 text-green-700'
      case 'completed': return 'bg-gray-100 text-gray-700'
      default: return 'bg-gray-100 text-gray-700'
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'upcoming': return <Clock className="w-4 h-4" />
      case 'ongoing': return <Play className="w-4 h-4" />
      case 'completed': return <CheckCircle className="w-4 h-4" />
      default: return <AlertCircle className="w-4 h-4" />
    }
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
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 backdrop-blur-sm border border-ocean-primary/20 text-ocean-primary text-sm font-medium mb-4">
              <Waves className="w-4 h-4" />
              <span>Student Dashboard</span>
            </div>
            
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
              My Learning Sessions
            </h1>
            <p className="text-lg text-gray-600">
              Track your scheduled sessions and learning progress
            </p>
          </motion.div>

          {/* Stats Cards */}
          <motion.div variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="ocean-gradient-card rounded-xl p-6 border border-ocean-primary/10 shadow-lg">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 rounded-lg bg-gradient-to-br from-ocean-primary to-cyan-500 shadow-md">
                  <Calendar className="w-5 h-5 text-white" />
                </div>
                <span className="text-sm font-medium text-gray-600">Total</span>
              </div>
              <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
            </div>

            <div className="ocean-gradient-card rounded-xl p-6 border border-ocean-secondary/10 shadow-lg">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 rounded-lg bg-gradient-to-br from-ocean-secondary to-emerald-500 shadow-md">
                  <Clock className="w-5 h-5 text-white" />
                </div>
                <span className="text-sm font-medium text-gray-600">Upcoming</span>
              </div>
              <div className="text-2xl font-bold text-gray-900">{stats.upcoming}</div>
            </div>

            <div className="ocean-gradient-card rounded-xl p-6 border border-ocean-accent/10 shadow-lg">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 rounded-lg bg-gradient-to-br from-ocean-accent to-blue-500 shadow-md">
                  <CheckCircle className="w-5 h-5 text-white" />
                </div>
                <span className="text-sm font-medium text-gray-600">Completed</span>
              </div>
              <div className="text-2xl font-bold text-gray-900">{stats.past}</div>
            </div>

            <div className="ocean-gradient-card rounded-xl p-6 border border-purple-500/10 shadow-lg">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 shadow-md">
                  <Play className="w-5 h-5 text-white" />
                </div>
                <span className="text-sm font-medium text-gray-600">Today</span>
              </div>
              <div className="text-2xl font-bold text-gray-900">{stats.today}</div>
            </div>
          </motion.div>

          {/* Loading State */}
          {loading && (
            <motion.div variants={itemVariants} className="grid gap-6 md:grid-cols-2">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="ocean-gradient-card rounded-xl p-6 animate-pulse">
                  <div className="h-6 w-3/4 bg-gray-200 rounded mb-4"></div>
                  <div className="h-4 w-1/2 bg-gray-200 rounded mb-3"></div>
                  <div className="space-y-2">
                    <div className="h-3 w-full bg-gray-100 rounded"></div>
                    <div className="h-3 w-2/3 bg-gray-100 rounded"></div>
                  </div>
                </div>
              ))}
            </motion.div>
          )}

          {/* Empty State */}
          {!loading && sessions.length === 0 && (
            <motion.div variants={itemVariants} className="ocean-gradient-card rounded-xl p-12 text-center">
              <div className="flex items-center justify-center mb-4">
                <div className="p-3 rounded-full bg-gradient-to-br from-ocean-primary to-ocean-secondary shadow-lg">
                  <Calendar className="w-8 h-8 text-white" />
                </div>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No Sessions Yet</h3>
              <p className="text-gray-600">Your tutors will schedule sessions here when ready.</p>
            </motion.div>
          )}

          {/* Sessions List */}
          {!loading && sessions.length > 0 && (
            <motion.div variants={itemVariants} className="grid gap-6 md:grid-cols-2">
              {sessions.map((session, index) => {
                const start = session?.start_time
                  ? new Date(session.start_time).toLocaleString('en-US', {
                      weekday: 'short',
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })
                  : '—'
                const end = session?.end_time
                  ? new Date(session.end_time).toLocaleString('en-US', {
                      hour: '2-digit',
                      minute: '2-digit'
                    })
                  : '—'
                const status = getSessionStatus(session.start_time)

                return (
                  <motion.div
                    key={session.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ y: -4, scale: 1.02 }}
                    className="group relative"
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-ocean-primary/5 to-ocean-secondary/5 rounded-xl blur-xl group-hover:blur-2xl transition-all duration-300" />
                    <Link href={`/student/sessions/${session.id}`}>
                      <div className="relative ocean-gradient-card rounded-xl p-6 border border-ocean-primary/10 shadow-lg hover:shadow-xl transition-all duration-300">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1">
                            <h3 className="text-lg font-bold text-gray-900 group-hover:text-ocean-primary transition-colors duration-200 mb-2">
                              {session.notes || 'Learning Session'}
                            </h3>
                            
                            <div className="flex items-center gap-2 mb-3">
                              <User className="w-4 h-4 text-ocean-primary" />
                              <span className="text-sm text-gray-600">
                                <span className="font-medium">Tutor:</span>{' '}
                                {session?.tutor?.full_name ?? 'Unknown Tutor'}
                              </span>
                            </div>
                          </div>

                          <div className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${getStatusColor(status)}`}>
                            {getStatusIcon(status)}
                            <span className="capitalize">{status}</span>
                          </div>
                        </div>

                        <div className="space-y-3">
                          <div className="flex items-center gap-2 text-sm text-gray-700">
                            <Calendar className="w-4 h-4 text-ocean-secondary" />
                            <span className="font-medium">Start:</span>
                            <span>{start}</span>
                          </div>
                          
                          {session.end_time && (
                            <div className="flex items-center gap-2 text-sm text-gray-700">
                              <Clock className="w-4 h-4 text-ocean-accent" />
                              <span className="font-medium">End:</span>
                              <span>{end}</span>
                            </div>
                          )}
                        </div>

                        <div className="mt-4 flex items-center justify-between">
                          <div className="text-xs text-gray-500">
                            ID: <span className="font-mono">{session.id}</span>
                          </div>
                          <div className="flex items-center gap-1 text-ocean-primary opacity-0 group-hover:opacity-100 transition-opacity">
                            <span className="text-sm font-medium">View Details</span>
                            <ArrowRight className="w-4 h-4" />
                          </div>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                )
              })}
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  )
}
