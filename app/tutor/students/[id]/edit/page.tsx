'use client'

import React, { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { motion } from "framer-motion"
import { User, Phone, Calendar, Shield, Sparkles, Edit, ArrowLeft, Save, X, Loader2, AlertCircle, CheckCircle, GraduationCap, Mail, MapPin } from "lucide-react"

type Profile = {
  id: string
  full_name?: string | null
  phone?: string | null
  role?: string | null
  created_at?: string | null
  email?: string | null
}

export default function EditStudentPage() {
  const params = useParams()
  const router = useRouter()
  const id = params?.id
  const [student, setStudent] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    if (!id) return
    let mounted = true
    async function load() {
      setLoading(true)
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) throw new Error('Not authenticated')

        const { data: assign } = await supabase
          .from('tutor_assignments')
          .select('*')
          .eq('tutor_id', user.id)
          .eq('student_id', id)
          .single()
        if (!assign) throw new Error('You are not assigned to this student')

        const { data: profile, error } = await supabase
          .from('profiles')
          .select('id, full_name, phone, role, created_at, email')
          .eq('id', id)
          .single()
        if (error) throw error
        if (mounted) setStudent(profile)
      } catch (err: any) {
        setError(err.message || 'Failed to load')
      } finally {
        setLoading(false)
      }
    }
    load()
    return () => { mounted = false }
  }, [id])

  async function save() {
    if (!student) return
    setSaving(true)
    setError(null)
    setSuccess(false)
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: student.full_name?.trim() || null,
          phone: student.phone?.trim() || null
        })
        .eq('id', id)

      if (error) throw error
      setSuccess(true)
      setTimeout(() => {
        router.push(`/tutor/students/${id}`)
      }, 1500)
    } catch (err: any) {
      setError(err.message || 'Failed to save')
    } finally {
      setSaving(false)
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

  if (loading) {
    return (
      <div className="min-h-screen ocean-gradient-light">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
          <Skeleton className="h-96 rounded-xl" />
        </div>
      </div>
    )
  }

  if (error && !student) {
    return (
      <div className="min-h-screen ocean-gradient-light">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
              <Edit className="w-8 h-8 text-ocean-primary" />
            </div>
            <div className="flex-1">
              <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-ocean-primary to-ocean-secondary bg-clip-text text-transparent">
                Edit Student
              </h1>
              <p className="text-ocean-secondary/80 text-sm sm:text-base">
                Update student information and details
              </p>
            </div>
            <div className="flex items-center gap-2">
              <div className="p-2 bg-ocean-accent/10 rounded-lg">
                <Sparkles className="w-5 h-5 text-ocean-accent" />
              </div>
              <Badge className="bg-ocean-primary/10 text-ocean-primary border-ocean-primary/20">
                Editing
              </Badge>
            </div>
          </motion.div>

          {/* Success Message */}
          {success && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6"
            >
              <Alert className="ocean-gradient-card border-green-200 bg-green-50/50">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <AlertDescription className="text-green-800">
                  Student information updated successfully! Redirecting...
                </AlertDescription>
              </Alert>
            </motion.div>
          )}

          {/* Error Message */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6"
            >
              <Alert variant="destructive" className="ocean-gradient-card border-red-200">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription className="text-red-800">{error}</AlertDescription>
              </Alert>
            </motion.div>
          )}

          {/* Student Info Card */}
          <motion.div variants={itemVariants} className="mb-8">
            <Card className="ocean-gradient-card shadow-lg border-0">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-ocean-primary">
                  <GraduationCap className="w-5 h-5" />
                  Current Student Information
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="flex items-center gap-4 mb-6">
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
              </CardContent>
            </Card>
          </motion.div>

          {/* Edit Form */}
          <motion.div variants={itemVariants}>
            <Card className="ocean-gradient-card shadow-lg border-0">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-ocean-primary">
                  <Edit className="w-5 h-5" />
                  Edit Information
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="full_name" className="text-ocean-primary font-medium">
                      Full Name
                    </Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-ocean-secondary/60" />
                      <Input
                        id="full_name"
                        value={student.full_name ?? ''}
                        onChange={(e) => setStudent({ ...student, full_name: e.target.value })}
                        placeholder="Enter student's full name"
                        className="pl-10 border-ocean-primary/20 focus:border-ocean-primary bg-white/80 backdrop-blur-sm h-12 text-base"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone" className="text-ocean-primary font-medium">
                      Phone Number
                    </Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-ocean-secondary/60" />
                      <Input
                        id="phone"
                        value={student.phone ?? ''}
                        onChange={(e) => setStudent({ ...student, phone: e.target.value })}
                        placeholder="Enter phone number"
                        className="pl-10 border-ocean-primary/20 focus:border-ocean-primary bg-white/80 backdrop-blur-sm h-12 text-base"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-ocean-primary font-medium">
                      Email Address
                    </Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-ocean-secondary/60" />
                      <Input
                        id="email"
                        value={student.email ?? ''}
                        onChange={(e) => setStudent({ ...student, email: e.target.value })}
                        placeholder="Enter email address"
                        type="email"
                        className="pl-10 border-ocean-primary/20 focus:border-ocean-primary bg-white/80 backdrop-blur-sm h-12 text-base"
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="p-6 pt-0">
                <div className="flex flex-col sm:flex-row gap-3 w-full">
                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="flex-1">
                    <Button
                      onClick={save}
                      disabled={saving || success}
                      className="w-full ocean-gradient text-white shadow-lg hover:shadow-xl h-12"
                    >
                      {saving ? (
                        <div className="flex items-center gap-2">
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Saving...
                        </div>
                      ) : success ? (
                        <div className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4" />
                          Saved!
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <Save className="w-4 h-4" />
                          Save Changes
                        </div>
                      )}
                    </Button>
                  </motion.div>
                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Button
                      variant="outline"
                      onClick={() => router.back()}
                      disabled={saving}
                      className="w-full sm:w-auto bg-white/80 backdrop-blur-sm border-ocean-primary/20 text-ocean-primary hover:bg-ocean-primary/5 h-12 px-6"
                    >
                      <X className="w-4 h-4 mr-2" />
                      Cancel
                    </Button>
                  </motion.div>
                </div>
              </CardFooter>
            </Card>
          </motion.div>

          {/* Additional Info */}
          <motion.div
            variants={itemVariants}
            className="mt-6"
          >
            <Card className="ocean-gradient-card shadow-lg border-0">
              <CardContent className="p-6">
                <div className="text-center">
                  <div className="w-12 h-12 bg-gradient-to-r from-ocean-accent/20 to-ocean-secondary/20 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Shield className="w-6 h-6 text-ocean-accent" />
                  </div>
                  <h3 className="text-lg font-semibold text-ocean-primary mb-2">Security Note</h3>
                  <p className="text-ocean-secondary/70 text-sm">
                    Only basic information can be edited. Contact an administrator for role changes or other modifications.
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}
