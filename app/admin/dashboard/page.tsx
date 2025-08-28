"use client"
import Link from "next/link"
import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabaseClient"
import { Card, CardContent } from "@/components/ui/card"
import { Users, GraduationCap, UserSquare2, Book, Shield, Sparkles, Waves, Plus, Edit, Trash2, Link as LinkIcon, DollarSign, Calendar } from "lucide-react"
import { motion } from "framer-motion"
import { Skeleton } from "@/components/ui/skeleton"

export default function AdminDashboardPage() {
  const [counts, setCounts] = useState({
    tutors: 0,
    students: 0,
    guardians: 0,
    subjects: 0,
  })
  const [loading, setLoading] = useState(true)

  async function loadCounts() {
    const [
      { data: tutors },
      { data: students },
      { data: guardians },
      { data: subjects },
    ] = await Promise.all([
      supabase.from("profiles").select("id", { count: "exact" }).eq("role", "tutor"),
      supabase.from("profiles").select("id", { count: "exact" }).eq("role", "student"),
      supabase.from("profiles").select("id", { count: "exact" }).eq("role", "guardian"),
      supabase.from("subjects").select("id", { count: "exact" }),
    ])
    setCounts({
      tutors: tutors?.length ?? 0,
      students: students?.length ?? 0,
      guardians: guardians?.length ?? 0,
      subjects: subjects?.length ?? 0,
    })
    setLoading(false)
  }

  useEffect(() => {
    loadCounts()
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
          <div className="p-2 bg-ocean-primary/10 rounded-lg">
            <Shield className="w-8 h-8 text-ocean-primary" />
          </div>
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold text-ocean-primary">
              Admin Dashboard
            </h1>
            <p className="text-ocean-secondary/80 text-sm sm:text-base">
              Manage your educational platform
            </p>
          </div>
          <Sparkles className="w-6 h-6 text-ocean-accent ml-auto" />
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {loading ? (
            <>
              <Skeleton className="h-32 w-full rounded-2xl" />
              <Skeleton className="h-32 w-full rounded-2xl" />
              <Skeleton className="h-32 w-full rounded-2xl" />
              <Skeleton className="h-32 w-full rounded-2xl" />
            </>
          ) : (
            <>
              <StatCard
                icon={<GraduationCap className="w-8 h-8" />}
                title="Tutors"
                value={counts.tutors}
                href="/admin/add?tab=tutors"
                gradient="from-blue-500 to-cyan-500"
                bgGradient="from-blue-500/20 to-cyan-500/20"
                itemVariants={itemVariants}
              />
              <StatCard
                icon={<Users className="w-8 h-8" />}
                title="Students"
                value={counts.students}
                href="/admin/add?tab=students"
                gradient="from-teal-500 to-emerald-500"
                bgGradient="from-teal-500/20 to-emerald-500/20"
                itemVariants={itemVariants}
              />
              <StatCard
                icon={<UserSquare2 className="w-8 h-8" />}
                title="Guardians"
                value={counts.guardians}
                href="/admin/add?tab=guardians"
                gradient="from-emerald-500 to-green-500"
                bgGradient="from-emerald-500/20 to-green-500/20"
                itemVariants={itemVariants}
              />
              <StatCard
                icon={<Book className="w-8 h-8" />}
                title="Subjects"
                value={counts.subjects}
                href="/admin/add?tab=subjects"
                gradient="from-cyan-500 to-blue-500"
                bgGradient="from-cyan-500/20 to-blue-500/20"
                itemVariants={itemVariants}
              />
            </>
          )}
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          className="grid grid-cols-1 lg:grid-cols-2 gap-8"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Quick Links */}
          <motion.div variants={itemVariants}>
            <Card className="ocean-gradient-card shadow-lg border-0">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-ocean-primary/10 rounded-lg">
                    <LinkIcon className="w-6 h-6 text-ocean-primary" />
                  </div>
                  <h3 className="text-xl font-semibold text-ocean-primary">Quick Actions</h3>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {loading ? (
                    <>
                      <Skeleton className="h-12 w-full rounded-xl" />
                      <Skeleton className="h-12 w-full rounded-xl" />
                      <Skeleton className="h-12 w-full rounded-xl" />
                      <Skeleton className="h-12 w-full rounded-xl" />
                      <Skeleton className="h-12 w-full rounded-xl" />
                      <Skeleton className="h-12 w-full rounded-xl" />
                    </>
                  ) : (
                    <>
                      <QuickAction
                        href="/admin/add"
                        label="Add"
                        icon={<Plus className="w-4 h-4" />}
                        gradient="from-blue-600 to-blue-700"
                      />
                      <QuickAction
                        href="/admin/edit"
                        label="Edit"
                        icon={<Edit className="w-4 h-4" />}
                        gradient="from-yellow-700 to-yellow-800"
                      />
                      <QuickAction
                        href="/admin/remove"
                        label="Remove"
                        icon={<Trash2 className="w-4 h-4" />}
                        gradient="from-red-500 to-red-600"
                      />
                      <QuickAction
                        href="/admin/assign"
                        label="Assign"
                        icon={<LinkIcon className="w-4 h-4" />}
                        gradient="from-green-500 to-emerald-500"
                      />
                      <QuickAction
                        href="/admin/expenses"
                        label="Expenses"
                        icon={<DollarSign className="w-4 h-4" />}
                        gradient="from-yellow-500 to-orange-500"
                      />
                      <QuickAction
                        href="/admin/sessions"
                        label="Sessions"
                        icon={<Calendar className="w-4 h-4" />}
                        gradient="from-purple-500 to-pink-500"
                      />
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Activity Section */}
          <motion.div variants={itemVariants}>
            <Card className="ocean-gradient-card shadow-lg border-0">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-ocean-accent/10 rounded-lg">
                    <Waves className="w-6 h-6 text-ocean-accent" />
                  </div>
                  <h3 className="text-xl font-semibold text-ocean-primary">Recent Activity</h3>
                </div>
                {loading ? (
                  <div className="space-y-3">
                    <Skeleton className="h-4 w-full rounded" />
                    <Skeleton className="h-4 w-3/4 rounded" />
                    <Skeleton className="h-4 w-1/2 rounded" />
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 p-3 bg-white/50 rounded-lg">
                      <div className="w-2 h-2 bg-ocean-primary rounded-full"></div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-ocean-primary">New tutor registered</p>
                        <p className="text-xs text-ocean-secondary/70">2 minutes ago</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-white/50 rounded-lg">
                      <div className="w-2 h-2 bg-ocean-secondary rounded-full"></div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-ocean-primary">Session completed</p>
                        <p className="text-xs text-ocean-secondary/70">15 minutes ago</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-white/50 rounded-lg">
                      <div className="w-2 h-2 bg-ocean-accent rounded-full"></div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-ocean-primary">New assignment created</p>
                        <p className="text-xs text-ocean-secondary/70">1 hour ago</p>
                      </div>
                    </div>
                    <div className="text-center pt-4">
                      <p className="text-sm text-ocean-secondary/60">
                        More activity will appear here as the platform grows
                      </p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}

function StatCard({
  icon,
  title,
  value,
  href,
  gradient,
  bgGradient,
  itemVariants,
}: {
  icon: React.ReactNode
  title: string
  value: number
  href?: string
  gradient: string
  bgGradient: string
  itemVariants: any
}) {
  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -5 }}
      whileTap={{ scale: 0.98 }}
      variants={itemVariants}
    >
      <Card className={`ocean-gradient-card shadow-lg border-0 overflow-hidden relative`}>
        <div className={`absolute inset-0 ${bgGradient} opacity-50`}></div>
        <CardContent className="p-6 relative z-10">
          <div className="flex items-center justify-between mb-4">
            <div className={`p-3 rounded-xl bg-gradient-to-r ${gradient}`}>
              <div className="text-white">{icon}</div>
            </div>
            {href && (
              <Link
                href={href}
                className="text-xs text-ocean-primary hover:text-ocean-secondary transition-colors"
              >
                Manage →
              </Link>
            )}
          </div>
          <div className="text-3xl font-bold text-ocean-primary mb-1">{value}</div>
          <div className="text-sm text-ocean-secondary/80 font-medium">{title}</div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

function QuickAction({ 
  href, 
  label, 
  icon, 
  gradient 
}: { 
  href: string
  label: string
  icon: React.ReactNode
  gradient: string
}) {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <Link
        href={href}
        className={`
          flex items-center gap-2 px-4 py-3 rounded-xl text-white text-sm font-medium
          bg-gradient-to-r ${gradient} shadow-md hover:shadow-lg
          transition-all duration-200 ease-in-out
        `}
      >
        {icon}
        <span>{label}</span>
      </Link>
    </motion.div>
  )
}
