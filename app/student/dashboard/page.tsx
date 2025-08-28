'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { 
  Clock, 
  BookOpen, 
  User, 
  Calendar,
  TrendingUp,
  Award,
  Target,
  Sparkles,
  ArrowRight,
  CheckCircle,
  AlertCircle,
  Waves
} from 'lucide-react'

export default function StudentDashboard() {
  const [profile, setProfile] = useState<any>(null)
  const [nextSession, setNextSession] = useState<any>(null)

  const [sessionsTotal, setSessionsTotal] = useState<number>(0)
  const [sessionsUpcoming, setSessionsUpcoming] = useState<number>(0)
  const [sessionsPast, setSessionsPast] = useState<number>(0)

  const [assignmentsTotal, setAssignmentsTotal] = useState<number>(0)
  const [assignmentsCompleted, setAssignmentsCompleted] = useState<number>(0)
  const [assignmentsPending, setAssignmentsPending] = useState<number>(0)

  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadData() {
      setLoading(true)
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser()

        if (!user) {
          setLoading(false)
          return
        }

        const userId = user.id
        const now = new Date().toISOString()

        // profile + next session
        const profilePromise = supabase
          .from('profiles')
          .select('full_name, email')
          .eq('id', userId)
          .single()

        const nextSessionPromise = supabase
          .from('sessions')
          .select('id, start_time, notes')
          .eq('student_id', userId)
          .gte('start_time', now)
          .order('start_time', { ascending: true })
          .limit(1)

        // sessions counts
        const sessionsTotalPromise = supabase
          .from('sessions')
          .select('*', { count: 'exact', head: true })
          .eq('student_id', userId)

        const sessionsUpcomingPromise = supabase
          .from('sessions')
          .select('*', { count: 'exact', head: true })
          .eq('student_id', userId)
          .gte('start_time', now)

        // assignments counts
        const assignmentsTotalPromise = supabase
          .from('assignments')
          .select('*', { count: 'exact', head: true })
          .eq('student_id', userId)

        const assignmentsCompletedPromise = supabase
          .from('assignments')
          .select('*', { count: 'exact', head: true })
          .eq('student_id', userId)
          .is('is_done', true)

        const [
          profileRes,
          nextSessionRes,
          sessionsTotalRes,
          sessionsUpcomingRes,
          assignmentsTotalRes,
          assignmentsCompletedRes,
        ] = await Promise.all([
          profilePromise,
          nextSessionPromise,
          sessionsTotalPromise,
          sessionsUpcomingPromise,
          assignmentsTotalPromise,
          assignmentsCompletedPromise,
        ])

        // profile
        if (!profileRes.error) setProfile(profileRes.data)

        // next session
        setNextSession(nextSessionRes.data?.[0] ?? null)

        // sessions
        const sTotal = sessionsTotalRes.count ?? 0
        const sUpcoming = sessionsUpcomingRes.count ?? 0
        setSessionsTotal(sTotal)
        setSessionsUpcoming(sUpcoming)
        setSessionsPast(Math.max(0, sTotal - sUpcoming))

        // assignments
        const aTotal = assignmentsTotalRes.count ?? 0
        const aCompleted = assignmentsCompletedRes.count ?? 0
        setAssignmentsTotal(aTotal)
        setAssignmentsCompleted(aCompleted)
        setAssignmentsPending(Math.max(0, aTotal - aCompleted))
      } catch (err) {
        console.error('Dashboard load error', err)
      } finally {
        setLoading(false)
      }
    }

    loadData()
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

  const statsCards = [
    {
      title: "Total Sessions",
      value: sessionsTotal,
      icon: Clock,
      color: "from-ocean-primary to-cyan-500",
      bgColor: "bg-gradient-to-br from-ocean-primary/10 to-cyan-500/10",
      borderColor: "border-ocean-primary/20",
      link: "/student/sessions",
      linkText: "View Sessions",
      details: `Upcoming: ${sessionsUpcoming} • Past: ${sessionsPast}`
    },
    {
      title: "Pending Assignments",
      value: assignmentsPending,
      icon: BookOpen,
      color: "from-ocean-secondary to-emerald-500",
      bgColor: "bg-gradient-to-br from-ocean-secondary/10 to-emerald-500/10",
      borderColor: "border-ocean-secondary/20",
      link: "/student/assignments",
      linkText: "View Assignments",
      details: `Completed: ${assignmentsCompleted} of ${assignmentsTotal}`
    },
    {
      title: "Profile Status",
      value: profile?.full_name ? "Active" : "Setup Required",
      icon: User,
      color: "from-purple-500 to-pink-500",
      bgColor: "bg-gradient-to-br from-purple-500/10 to-pink-500/10",
      borderColor: "border-purple-500/20",
      link: "/student/profile",
      linkText: "View Profile",
      details: profile?.email || "Email not set"
    }
  ];

  return (
    <div className="min-h-screen ocean-gradient-light">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-8"
        >
          {/* Header Section */}
          <motion.div variants={itemVariants} className="text-center sm:text-left">
            {/* <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 backdrop-blur-sm border border-ocean-primary/20 text-ocean-primary text-sm font-medium mb-4">
              <Waves className="w-4 h-4" />
              <span>Student Dashboard</span>
            </div> */}
            
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-2">
              Welcome back{profile?.full_name ? `, ${profile.full_name}` : ''} 👋
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl">
              Here's your learning overview with sessions, assignments, and progress tracking.
            </p>
          </motion.div>

          {/* Stats Grid */}
          <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {statsCards.map((card, index) => {
              const Icon = card.icon;
              return (
                <motion.div
                  key={card.title}
                  whileHover={{ y: -4, scale: 1.02 }}
                  className="group relative"
                >
                  <div className={`absolute inset-0 ${card.bgColor} rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-300`} />
                  <div className={`relative p-6 ocean-gradient-card rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border ${card.borderColor}`}>
                    <div className="flex items-start justify-between mb-4">
                      <div className={`p-3 rounded-xl bg-gradient-to-br ${card.color} shadow-lg`}>
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      <Sparkles className="w-5 h-5 text-ocean-accent opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                    
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{card.title}</h3>
                    
                    {loading ? (
                      <div className="space-y-2 animate-pulse">
                        <div className="h-8 w-20 bg-gray-200 rounded" />
                        <div className="h-4 w-32 bg-gray-200 rounded" />
                      </div>
                    ) : (
                      <>
                        <div className="text-3xl font-bold text-gray-900 mb-2">{card.value}</div>
                        <p className="text-sm text-gray-600 mb-4">{card.details}</p>
                        <Link
                          href={card.link}
                          className="inline-flex items-center gap-2 text-ocean-primary hover:text-ocean-secondary font-semibold transition-colors duration-200 group/link"
                        >
                          <span>{card.linkText}</span>
                          <ArrowRight className="w-4 h-4 group-hover/link:translate-x-1 transition-transform" />
                        </Link>
                      </>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </motion.div>

          {/* Next Session Section */}
          <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Next Session Card */}
            <div className="ocean-gradient-card rounded-2xl shadow-lg p-6 border border-ocean-primary/10">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-lg bg-gradient-to-br from-ocean-accent to-cyan-500 shadow-md">
                  <Calendar className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-xl font-bold text-gray-900">Next Session</h2>
              </div>
              
              {loading ? (
                <div className="space-y-3 animate-pulse">
                  <div className="h-6 w-48 bg-gray-200 rounded" />
                  <div className="h-4 w-72 bg-gray-200 rounded" />
                </div>
              ) : nextSession ? (
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-ocean-secondary" />
                    <span className="text-lg font-semibold text-gray-900">
                      {new Date(nextSession.start_time).toLocaleDateString('en-US', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-gray-500" />
                    <span className="text-gray-600">
                      {new Date(nextSession.start_time).toLocaleTimeString('en-US', {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                  </div>
                  <p className="text-gray-600 bg-gray-50 p-3 rounded-lg">
                    {nextSession.notes || 'No additional notes for this session.'}
                  </p>
                  <Link
                    href={`/student/sessions/${nextSession.id}`}
                    className="inline-flex items-center gap-2 text-ocean-primary hover:text-ocean-secondary font-semibold transition-colors duration-200"
                  >
                    <span>View session details</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              ) : (
                <div className="text-center py-8">
                  <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-500 font-medium">No upcoming sessions</p>
                  <p className="text-sm text-gray-400 mt-1">Check back later for new sessions</p>
                </div>
              )}
            </div>

            {/* Quick Actions Card */}
            <div className="ocean-gradient-card rounded-2xl shadow-lg p-6 border border-ocean-primary/10">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 rounded-lg bg-gradient-to-br from-ocean-secondary to-emerald-500 shadow-md">
                  <Target className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-xl font-bold text-gray-900">Quick Actions</h2>
              </div>
              
              <div className="space-y-3">
                <Link
                  href="/student/ai-tutor"
                  className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-ocean-primary/5 to-ocean-secondary/5 hover:from-ocean-primary/10 hover:to-ocean-secondary/10 transition-all duration-200 group"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-gradient-to-br from-blue-600 to-blue-800">
                      <Sparkles className="w-4 h-4 text-white" />
                    </div>
                    <span className="font-medium text-gray-900">AI Tutor Chat</span>
                  </div>
                  <ArrowRight className="w-4 h-4 text-ocean-primary group-hover:translate-x-1 transition-transform" />
                </Link>
                
                <Link
                  href="/student/assignments"
                  className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-ocean-secondary/5 to-emerald-500/5 hover:from-ocean-secondary/10 hover:to-emerald-500/10 transition-all duration-200 group"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-gradient-to-br from-emerald-300 to-emerald-500">
                      <BookOpen className="w-4 h-4 text-white" />
                    </div>
                    <span className="font-medium text-gray-900">View Assignments</span>
                  </div>
                  <ArrowRight className="w-4 h-4 text-ocean-secondary group-hover:translate-x-1 transition-transform" />
                </Link>
                
                <Link
                  href="/student/profile"
                  className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-purple-500/5 to-pink-500/5 hover:from-purple-500/10 hover:to-pink-500/10 transition-all duration-200 group"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500">
                      <User className="w-4 h-4 text-white" />
                    </div>
                    <span className="font-medium text-gray-900">Update Profile</span>
                  </div>
                  <ArrowRight className="w-4 h-4 text-purple-500 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}

