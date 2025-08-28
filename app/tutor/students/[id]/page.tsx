'use client'

import React, { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { motion } from "framer-motion"
import { User, Phone, Calendar, Shield, Sparkles, Eye, Edit, BookOpen, ArrowLeft, Users, GraduationCap, Clock, MapPin, Mail, CheckCircle, AlertCircle, Loader2 } from "lucide-react"

type Profile = {
  id: string
  full_name?: string | null
  phone?: string | null
  role?: string | null
  created_at?: string | null
  email?: string | null
}

export default function StudentDetailPage() {
  const params = useParams()
  const id = params?.id
  const router = useRouter()
  const [student, setStudent] = useState<Profile | null>(null)
  const [guardian, setGuardian] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [stats, setStats] = useState({
    totalSessions: 0,
    completedSessions: 0,
    totalHours: 0
  })

  useEffect(() => {
    if (!id) return
    let mounted = true
    async function load() {
      setLoading(true)
      setError(null)
      try {
        // Confirm the tutor is assigned to this student (security client-side check too)
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) throw new Error('Not authenticated')

        const { data: assign } = await supabase
          .from('tutor_assignments')
          .select('*')
          .eq('tutor_id', user.id)
          .eq('student_id', id)
          .single()

        if (!assign) {
          throw new Error('You are not assigned to this student')
        }

        // fetch student profile
        const { data: studentProfile, error: studentErr } = await supabase
          .from('profiles')
          .select('id, full_name, phone, role, created_at, email')
          .eq('id', id)
          .single()
        if (studentErr) throw studentErr
        if (mounted) setStudent(studentProfile)

        // Load session stats for this student
        const { data: sessions } = await supabase
          .from('sessions')
          .select('status, duration')
          .eq('tutor_id', user.id)
          .eq('student_id', id)

        const totalSessions = sessions?.length || 0
        const completedSessions = sessions?.filter(s => s.status === 'completed').length || 0
        const totalHours = sessions?.reduce((acc, s) => acc + (s.duration || 0), 0) || 0

        if (mounted) {
          setStats({
            totalSessions,
            completedSessions,
            totalHours
          })
        }

        // find guardian: if you have a mapping table or guardian_id on profiles, adjust accordingly.
        // Here we will query profiles where role='guardian' and assume existence of a student_guardians table would be better.
        // Try to find guardian via student_guardians if exists; fall back to null
        const { data: studentGuardians } = await supabase
          .from('student_guardians')
          .select('guardian_id')
          .eq('student_id', id)
        if (studentGuardians && studentGuardians.length > 0) {
          const guardianId = studentGuardians[0].guardian_id
          const { data: g } = await supabase.from('profiles').select('id, full_name, phone, email').eq('id', guardianId).single()
          if (g && mounted) setGuardian(g)
        } else {
          // fallback: attempt to find any guardian with role guardian and phone similar? (not ideal)
          // We'll leave guardian null if no mapping table
          if (mounted) setGuardian(null)
        }
      } catch (err: any) {
        setError(err.message || 'Failed to load student')
      } finally {
        setLoading(false)
      }
    }
    load()
    return () => { mounted = false }
  }, [id])

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

  if (loading) {
    return (
      <div className="min-h-screen ocean-gradient-light">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-3 mb-8"
          >
            <Skeleton className="w-12 h-12 rounded-xl" />
            <div className="space-y-2">
              <Skeleton className="h-8 w-64" />
              <Skeleton className="h-4 w-48" />
            </div>
          </motion.div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Skeleton className="h-32 rounded-xl" />
            <Skeleton className="h-32 rounded-xl" />
            <Skeleton className="h-32 rounded-xl" />
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen ocean-gradient-light">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-3 mb-8"
          >
            <div className="p-3 bg-gradient-to-r from-red-500/20 to-red-600/20 rounded-xl">
              <AlertCircle className="w-8 h-8 text-red-500" />
            </div>
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold text-red-500">Error</h1>
              <p className="text-red-400/80 text-sm sm:text-base">Something went wrong</p>
            </div>
          </motion.div>
          <Alert variant="destructive" className="ocean-gradient-card border-red-200">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="text-red-800">{error}</AlertDescription>
          </Alert>
        </div>
      </div>
    )
  }

  if (!student) {
    return (
      <div className="min-h-screen ocean-gradient-light">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-3 mb-8"
          >
            <div className="p-3 bg-gradient-to-r from-orange-500/20 to-orange-600/20 rounded-xl">
              <User className="w-8 h-8 text-orange-500" />
            </div>
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold text-orange-500">Student Not Found</h1>
              <p className="text-orange-400/80 text-sm sm:text-base">The requested student could not be found</p>
            </div>
          </motion.div>
          <Alert className="ocean-gradient-card border-orange-200">
            <AlertCircle className="h-4 w-4 text-orange-600" />
            <AlertDescription className="text-orange-800">Student not found in the system.</AlertDescription>
          </Alert>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen ocean-gradient-light">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Header */}
          <motion.div
            variants={itemVariants}
            className="flex items-center gap-3 mb-8"
          >
            <Button
              variant="outline"
              size="sm"
              onClick={() => router.back()}
              className="bg-white/80 backdrop-blur-sm border-ocean-primary/20 text-ocean-primary hover:bg-ocean-primary/5"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <div className="p-3 bg-gradient-to-r from-ocean-primary/20 to-ocean-secondary/20 rounded-xl">
              <User className="w-8 h-8 text-ocean-primary" />
            </div>
            <div className="flex-1">
              <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-ocean-primary to-ocean-secondary bg-clip-text text-transparent">
                {student.full_name || 'Unnamed Student'}
              </h1>
              <p className="text-ocean-secondary/80 text-sm sm:text-base">
                Student Profile & Details
              </p>
            </div>
            <div className="flex items-center gap-2">
              <div className="p-2 bg-ocean-accent/10 rounded-lg">
                <Sparkles className="w-5 h-5 text-ocean-accent" />
              </div>
              <Badge className="bg-ocean-primary/10 text-ocean-primary border-ocean-primary/20">
                Active Student
              </Badge>
            </div>
          </motion.div>

          {/* Stats Cards */}
          <motion.div
            variants={itemVariants}
            className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8"
          >
            <Card className="ocean-gradient-card shadow-lg border-0 overflow-hidden relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <CardContent className="p-6 relative z-10">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl">
                    <BookOpen className="w-6 h-6 text-white" />
                  </div>
                  <Badge className="bg-blue-100 text-blue-800 border-blue-200">
                    {stats.totalSessions}
                  </Badge>
                </div>
                <div className="text-2xl font-bold text-ocean-primary mb-1">Total Sessions</div>
                <div className="text-sm text-ocean-secondary/70">All time sessions</div>
              </CardContent>
            </Card>

            <Card className="ocean-gradient-card shadow-lg border-0 overflow-hidden relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-green-500/20 to-emerald-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <CardContent className="p-6 relative z-10">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl">
                    <CheckCircle className="w-6 h-6 text-white" />
                  </div>
                  <Badge className="bg-green-100 text-green-800 border-green-200">
                    {stats.completedSessions}
                  </Badge>
                </div>
                <div className="text-2xl font-bold text-ocean-primary mb-1">Completed</div>
                <div className="text-sm text-ocean-secondary/70">Finished sessions</div>
              </CardContent>
            </Card>

            <Card className="ocean-gradient-card shadow-lg border-0 overflow-hidden relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-pink-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <CardContent className="p-6 relative z-10">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl">
                    <Clock className="w-6 h-6 text-white" />
                  </div>
                  <Badge className="bg-purple-100 text-purple-800 border-purple-200">
                    {stats.totalHours}h
                  </Badge>
                </div>
                <div className="text-2xl font-bold text-ocean-primary mb-1">Total Hours</div>
                <div className="text-sm text-ocean-secondary/70">Teaching time</div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Student Details */}
          <motion.div
            variants={itemVariants}
            className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8"
          >
            <Card className="ocean-gradient-card shadow-lg border-0 lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-ocean-primary">
                  <GraduationCap className="w-5 h-5" />
                  Student Information
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-gradient-to-r from-ocean-primary to-ocean-secondary rounded-xl flex items-center justify-center text-white font-bold text-xl">
                      {(student.full_name || 'S').charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-ocean-primary mb-1">
                        {student.full_name || 'Unnamed Student'}
                      </h3>
                      <div className="flex items-center gap-2">
                        <Badge className="bg-ocean-secondary/10 text-ocean-secondary border-ocean-secondary/20">
                          Student
                        </Badge>
                        <div className="flex items-center gap-1 text-sm text-ocean-secondary/70">
                          <Shield className="w-3 h-3" />
                          ID: {student.id.slice(0,8)}...
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex items-center gap-3 p-4 bg-white/50 backdrop-blur-sm rounded-lg">
                      <div className="p-2 bg-ocean-primary/10 rounded-lg">
                        <Phone className="w-4 h-4 text-ocean-primary" />
                      </div>
                      <div>
                        <div className="text-sm text-ocean-secondary/60">Phone</div>
                        <div className="font-medium text-ocean-primary">
                          {student.phone || 'Not provided'}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 p-4 bg-white/50 backdrop-blur-sm rounded-lg">
                      <div className="p-2 bg-ocean-primary/10 rounded-lg">
                        <Mail className="w-4 h-4 text-ocean-primary" />
                      </div>
                      <div>
                        <div className="text-sm text-ocean-secondary/60">Email</div>
                        <div className="font-medium text-ocean-primary">
                          {student.email || 'Not provided'}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 p-4 bg-white/50 backdrop-blur-sm rounded-lg">
                      <div className="p-2 bg-ocean-primary/10 rounded-lg">
                        <Calendar className="w-4 h-4 text-ocean-primary" />
                      </div>
                      <div>
                        <div className="text-sm text-ocean-secondary/60">Joined</div>
                        <div className="font-medium text-ocean-primary">
                          {student.created_at ? new Date(student.created_at).toLocaleDateString() : 'Unknown'}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 p-4 bg-white/50 backdrop-blur-sm rounded-lg">
                      <div className="p-2 bg-ocean-primary/10 rounded-lg">
                        <MapPin className="w-4 h-4 text-ocean-primary" />
                      </div>
                      <div>
                        <div className="text-sm text-ocean-secondary/60">Status</div>
                        <div className="font-medium text-ocean-primary">Active</div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Guardian Information */}
            <Card className="ocean-gradient-card shadow-lg border-0">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-ocean-primary">
                  <Users className="w-5 h-5" />
                  Guardian Information
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                {!guardian ? (
                  <div className="text-center py-8">
                    <Users className="w-12 h-12 text-ocean-secondary/40 mx-auto mb-3" />
                    <p className="text-ocean-secondary/60 text-sm">No guardian linked</p>
                    <p className="text-ocean-secondary/40 text-xs">Guardian information not available</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gradient-to-r from-ocean-accent to-ocean-secondary rounded-lg flex items-center justify-center text-white font-bold">
                        {(guardian.full_name || 'G').charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <h4 className="font-semibold text-ocean-primary">
                          {guardian.full_name || 'Unnamed Guardian'}
                        </h4>
                        <Badge className="bg-ocean-accent/10 text-ocean-accent border-ocean-accent/20">
                          Guardian
                        </Badge>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center gap-2 text-sm text-ocean-secondary/70">
                        <Phone className="w-3 h-3" />
                        {guardian.phone || 'No phone'}
                      </div>
                      {guardian.email && (
                        <div className="flex items-center gap-2 text-sm text-ocean-secondary/70">
                          <Mail className="w-3 h-3" />
                          {guardian.email}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            variants={itemVariants}
            className="flex flex-wrap gap-3"
          >
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button asChild className="ocean-gradient text-white shadow-lg">
                <Link href={`/tutor/students/${student.id}/edit`}>
                  <Edit className="w-4 h-4 mr-2" />
                  Edit Student
                </Link>
              </Button>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button asChild variant="outline" className="bg-white/80 backdrop-blur-sm border-ocean-primary/20 text-ocean-primary hover:bg-ocean-primary/5">
                <Link href={`/tutor/sessions/new?studentId=${student.id}`}>
                  <BookOpen className="w-4 h-4 mr-2" />
                  Log Hours
                </Link>
              </Button>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button asChild variant="outline" className="bg-white/80 backdrop-blur-sm border-ocean-accent/20 text-ocean-accent hover:bg-ocean-accent/5">
                <Link href={`/tutor/sessions?studentId=${student.id}`}>
                  <Eye className="w-4 h-4 mr-2" />
                  View Sessions
                </Link>
              </Button>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}
