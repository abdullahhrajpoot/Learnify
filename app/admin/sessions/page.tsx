'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { motion } from 'framer-motion'
import { Calendar, Clock, User, GraduationCap, Sparkles, Play, CheckCircle, XCircle, AlertCircle } from 'lucide-react'

export default function AdminSessionsPage() {
  const [sessions, setSessions] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(()=>{ load() }, [])
  const load = async () => {
    setLoading(true)
    const { data } = await supabase.from('sessions').select('*').order('start_time', { ascending: false })
    setSessions(data || [])
    setLoading(false)
  }

  const statusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-500'
      case 'pending': return 'bg-yellow-500'
      case 'cancelled': return 'bg-red-500'
      default: return 'bg-gray-400'
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
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="w-4 h-4" />
      case 'pending': return <AlertCircle className="w-4 h-4" />
      case 'cancelled': return <XCircle className="w-4 h-4" />
      default: return <Play className="w-4 h-4" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-500'
      case 'pending': return 'bg-yellow-500'
      case 'cancelled': return 'bg-red-500'
      default: return 'bg-gray-400'
    }
  }

  const totalSessions = sessions.length
  const completedSessions = sessions.filter(s => s.status === 'completed').length
  const pendingSessions = sessions.filter(s => s.status === 'pending').length

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
            <Calendar className="w-8 h-8 text-ocean-primary" />
          </div>
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold text-ocean-primary">
              Admin — Sessions
            </h1>
            <p className="text-ocean-secondary/80 text-sm sm:text-base">
              Monitor and manage learning sessions
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
                  <p className="text-sm text-ocean-secondary/70">Total Sessions</p>
                  <p className="text-2xl font-bold text-ocean-primary">{totalSessions}</p>
                </div>
                <div className="p-3 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg">
                  <Calendar className="w-6 h-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="ocean-gradient-card shadow-lg border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-ocean-secondary/70">Completed</p>
                  <p className="text-2xl font-bold text-ocean-primary">{completedSessions}</p>
                </div>
                <div className="p-3 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg">
                  <CheckCircle className="w-6 h-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="ocean-gradient-card shadow-lg border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-ocean-secondary/70">Pending</p>
                  <p className="text-2xl font-bold text-ocean-primary">{pendingSessions}</p>
                </div>
                <div className="p-3 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-lg">
                  <AlertCircle className="w-6 h-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Sessions List */}
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
                      <div className="h-3 bg-white/20 rounded w-1/4 mb-2"></div>
                      <div className="h-3 bg-white/20 rounded w-1/2"></div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {sessions.length === 0 ? (
                <Card className="ocean-gradient-card shadow-lg border-0 col-span-full">
                  <CardContent className="p-12 text-center">
                    <Calendar className="w-16 h-16 text-ocean-secondary/40 mx-auto mb-4" />
                    <p className="text-ocean-secondary/60 text-lg">No sessions found</p>
                    <p className="text-ocean-secondary/40 text-sm">Sessions will appear here when created</p>
                  </CardContent>
                </Card>
              ) : (
                sessions.sort((a,b)=>new Date(b.start_time).getTime() - new Date(a.start_time).getTime()).map((s, index) => (
                  <motion.div 
                    key={s.id} 
                    variants={itemVariants}
                    whileHover={{scale:1.02, y:-2}}
                  >
                    <Card className="ocean-gradient-card shadow-lg border-0 overflow-hidden">
                      <CardContent className="p-6">
                        <div className="flex flex-col h-full">
                          <div className="flex-1 space-y-3">
                            <div className="flex items-center justify-between">
                              <div className="text-lg font-bold text-ocean-primary">#{s.id}</div>
                              <Badge className={`${getStatusColor(s.status)} text-white flex items-center gap-1`}>
                                {getStatusIcon(s.status)}
                                {s.status}
                              </Badge>
                            </div>
                            
                            <div className="space-y-2">
                              <div className="flex items-center gap-2 text-sm text-ocean-secondary/70">
                                <GraduationCap className="w-3 h-3" />
                                {s.tutor_id}
                              </div>
                              <div className="flex items-center gap-2 text-sm text-ocean-secondary/70">
                                <User className="w-3 h-3" />
                                {s.student_id}
                              </div>
                              <div className="flex items-center gap-2 text-xs text-ocean-secondary/60">
                                <Clock className="w-3 h-3" />
                                {new Date(s.start_time).toLocaleDateString()}
                              </div>
                              <div className="text-xs text-ocean-secondary/60">
                                {new Date(s.start_time).toLocaleTimeString()}
                              </div>
                            </div>
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
