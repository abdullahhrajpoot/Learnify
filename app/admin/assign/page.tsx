'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { motion } from 'framer-motion'
import { Link, Users, GraduationCap, UserSquare2, Sparkles, ArrowRight, Unlink, Plus } from 'lucide-react'

export default function AdminAssignPage() {
  const [tutors, setTutors] = useState<any[]>([])
  const [students, setStudents] = useState<any[]>([])
  const [guardians, setGuardians] = useState<any[]>([])
  const [tutorAssignments, setTutorAssignments] = useState<any[]>([])
  const [guardianAssignments, setGuardianAssignments] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedTutor, setSelectedTutor] = useState('')
  const [selectedStudent, setSelectedStudent] = useState('')
  const [selectedGuardian, setSelectedGuardian] = useState('')
  const [assignType, setAssignType] = useState<'tutor' | 'guardian'>('tutor')

  useEffect(() => { loadAll() }, [])

  async function loadAll() {
    setLoading(true)
    try {
      const [
        { data: tData },
        { data: sData },
        { data: gData },
        { data: taData },
        { data: gaData }
      ] = await Promise.all([
        supabase.from('profiles').select('id, full_name').eq('role', 'tutor'),
        supabase.from('profiles').select('id, full_name').eq('role', 'student'),
        supabase.from('profiles').select('id, full_name').eq('role', 'guardian'),
        supabase.from('tutor_assignments').select('tutor_id, student_id'),
        supabase.from('student_guardians').select('student_id, guardian_id, credits, created_at')
      ])

      setTutors(tData || [])
      setStudents(sData || [])
      setGuardians(gData || [])
      setTutorAssignments(taData || [])
      setGuardianAssignments(gaData || [])
    } finally {
      setLoading(false)
    }
  }

  function resolveName(id: string, type: 'tutor' | 'student' | 'guardian') {
    let list = type === 'tutor' ? tutors : type === 'student' ? students : guardians
    const found = list.find(p => p.id === id)
    return found?.full_name || id.slice(0, 8)
  }

  async function assign() {
    if (!selectedStudent) return alert('Select a student')
    if (assignType === 'tutor') {
      if (!selectedTutor) return alert('Select a tutor')
      const { error } = await supabase.from('tutor_assignments').insert({ tutor_id: selectedTutor, student_id: selectedStudent })
      if (error) return alert('Assign failed: ' + error.message)
      await loadAll()
      return
    }

    if (assignType === 'guardian') {
      if (!selectedGuardian) return alert('Select a guardian')
      const { error } = await supabase.from('student_guardians').insert({ student_id: selectedStudent, guardian_id: selectedGuardian })
      if (error) return alert('Assign failed: ' + error.message)
      await loadAll()
      return
    }
  }

  async function unassignTutor(tutor_id: string, student_id: string) {
    if (!confirm('Remove tutor assignment?')) return
    const { error } = await supabase.from('tutor_assignments').delete().match({ tutor_id, student_id })
    if (error) return alert('Remove failed: ' + error.message)
    await loadAll()
  }

  async function unassignGuardian(student_id: string, guardian_id: string) {
    if (!confirm('Remove guardian assignment?')) return
    const { error } = await supabase.from('student_guardians').delete().match({ student_id, guardian_id })
    if (error) return alert('Remove failed: ' + error.message)
    await loadAll()
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
            <Link className="w-8 h-8 text-ocean-primary" />
          </div>
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold text-ocean-primary">
              Admin — Assign
            </h1>
            <p className="text-ocean-secondary/80 text-sm sm:text-base">
              Manage tutor and guardian assignments
            </p>
          </div>
          <Sparkles className="w-6 h-6 text-ocean-accent ml-auto" />
        </motion.div>

        {/* Assignment Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Card className="ocean-gradient-card shadow-lg border-0">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-ocean-primary">
                <Plus className="w-5 h-5" />
                Create New Assignment
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-6">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    onClick={() => setAssignType('tutor')}
                    className={`px-4 py-2 rounded-xl font-medium transition-all ${
                      assignType === 'tutor' 
                        ? 'ocean-gradient text-white shadow-lg' 
                        : 'bg-white/80 backdrop-blur-sm border-ocean-primary/20 text-ocean-primary hover:bg-ocean-primary/5'
                    }`}
                  >
                    <GraduationCap className="w-4 h-4 mr-2" />
                    Assign → Tutor
                  </Button>
                </motion.div>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    onClick={() => setAssignType('guardian')}
                    className={`px-4 py-2 rounded-xl font-medium transition-all ${
                      assignType === 'guardian' 
                        ? 'ocean-gradient text-white shadow-lg' 
                        : 'bg-white/80 backdrop-blur-sm border-ocean-primary/20 text-ocean-primary hover:bg-ocean-primary/5'
                    }`}
                  >
                    <UserSquare2 className="w-4 h-4 mr-2" />
                    Assign → Guardian
                  </Button>
                </motion.div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-ocean-primary">Student</label>
                  <Select value={selectedStudent} onValueChange={(v) => setSelectedStudent(v)}>
                    <SelectTrigger className="border-ocean-primary/20 focus:border-ocean-primary bg-white/80 backdrop-blur-sm">
                      <SelectValue placeholder="Choose student" />
                    </SelectTrigger>
                    <SelectContent>
                      {students.map(s => <SelectItem key={s.id} value={s.id}>{s.full_name || s.id.slice(0, 8)}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-ocean-primary">
                    {assignType === 'tutor' ? 'Tutor' : 'Guardian'}
                  </label>
                  {assignType === 'tutor' ? (
                    <Select value={selectedTutor} onValueChange={setSelectedTutor}>
                      <SelectTrigger className="border-ocean-primary/20 focus:border-ocean-primary bg-white/80 backdrop-blur-sm">
                        <SelectValue placeholder="Choose tutor" />
                      </SelectTrigger>
                      <SelectContent>
                        {tutors.map(t => <SelectItem key={t.id} value={t.id}>{t.full_name || t.id.slice(0, 8)}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  ) : (
                    <Select value={selectedGuardian} onValueChange={setSelectedGuardian}>
                      <SelectTrigger className="border-ocean-primary/20 focus:border-ocean-primary bg-white/80 backdrop-blur-sm">
                        <SelectValue placeholder="Choose guardian" />
                      </SelectTrigger>
                      <SelectContent>
                        {guardians.map(g => <SelectItem key={g.id} value={g.id}>{g.full_name || g.id.slice(0, 8)}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-ocean-primary">Action</label>
                  <Button 
                    onClick={assign} 
                    className="w-full ocean-gradient text-white shadow-lg hover:shadow-xl"
                    disabled={loading || !selectedStudent || (assignType === 'tutor' ? !selectedTutor : !selectedGuardian)}
                  >
                    {loading ? (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        Loading…
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <ArrowRight className="w-4 h-4" />
                        Assign
                      </div>
                    )}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Assignments List */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <Card className="ocean-gradient-card shadow-lg border-0">
            <CardHeader>
              <CardTitle className="flex items-center justify-between text-ocean-primary">
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  Current Assignments
                </div>
                <Badge variant="secondary" className="bg-ocean-secondary/10 text-ocean-secondary border-ocean-secondary/20">
                  {tutorAssignments.length + guardianAssignments.length} total
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              {tutorAssignments.length === 0 && guardianAssignments.length === 0 ? (
                <div className="text-center py-12">
                  <Users className="w-16 h-16 text-ocean-secondary/40 mx-auto mb-4" />
                  <p className="text-ocean-secondary/60 text-lg">No assignments yet</p>
                  <p className="text-ocean-secondary/40 text-sm">Create your first assignment above</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Tutor Assignments */}
                  {tutorAssignments.length > 0 && (
                    <motion.div variants={itemVariants}>
                      <div className="flex items-center gap-2 mb-4">
                        <GraduationCap className="w-5 h-5 text-ocean-primary" />
                        <h3 className="font-semibold text-ocean-primary">Tutor Assignments</h3>
                        <Badge variant="secondary" className="bg-blue-500/10 text-blue-600 border-blue-500/20">
                          {tutorAssignments.length}
                        </Badge>
                      </div>
                      <div className="grid gap-3">
                        {tutorAssignments.map((a, index) => (
                          <motion.div
                            key={`t-${a.tutor_id}-${a.student_id}`}
                            initial={{opacity:0, y:20}}
                            animate={{opacity:1, y:0}}
                            transition={{ delay: index * 0.05 }}
                            whileHover={{scale:1.02, y:-2}}
                          >
                            <Card className="bg-white/50 backdrop-blur-sm border-ocean-primary/10">
                              <CardContent className="p-4">
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center text-white font-bold">
                                      {resolveName(a.tutor_id, 'tutor').charAt(0).toUpperCase()}
                                    </div>
                                    <div>
                                      <div className="font-medium text-ocean-primary">
                                        {resolveName(a.tutor_id, 'tutor')}
                                      </div>
                                      <div className="text-sm text-ocean-secondary/70">
                                        <ArrowRight className="w-3 h-3 inline mr-1" />
                                        {resolveName(a.student_id, 'student')}
                                      </div>
                                    </div>
                                  </div>
                                  <Button 
                                    variant="destructive" 
                                    size="sm" 
                                    onClick={() => unassignTutor(a.tutor_id, a.student_id)}
                                    className="bg-red-500 hover:bg-red-600 text-white"
                                  >
                                    <Unlink className="w-4 h-4 mr-1" />
                                    Unassign
                                  </Button>
                                </div>
                              </CardContent>
                            </Card>
                          </motion.div>
                        ))}
                      </div>
                    </motion.div>
                  )}

                  {/* Guardian Assignments */}
                  {guardianAssignments.length > 0 && (
                    <motion.div variants={itemVariants}>
                      <div className="flex items-center gap-2 mb-4">
                        <UserSquare2 className="w-5 h-5 text-ocean-primary" />
                        <h3 className="font-semibold text-ocean-primary">Guardian Assignments</h3>
                        <Badge variant="secondary" className="bg-green-500/10 text-green-600 border-green-500/20">
                          {guardianAssignments.length}
                        </Badge>
                      </div>
                      <div className="grid gap-3">
                        {guardianAssignments.map((a, index) => (
                          <motion.div
                            key={`g-${a.student_id}-${a.guardian_id}`}
                            initial={{opacity:0, y:20}}
                            animate={{opacity:1, y:0}}
                            transition={{ delay: index * 0.05 }}
                            whileHover={{scale:1.02, y:-2}}
                          >
                            <Card className="bg-white/50 backdrop-blur-sm border-ocean-primary/10">
                              <CardContent className="p-4">
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center text-white font-bold">
                                      {resolveName(a.guardian_id, 'guardian').charAt(0).toUpperCase()}
                                    </div>
                                    <div>
                                      <div className="font-medium text-ocean-primary">
                                        {resolveName(a.guardian_id, 'guardian')}
                                      </div>
                                      <div className="text-sm text-ocean-secondary/70">
                                        <ArrowRight className="w-3 h-3 inline mr-1" />
                                        {resolveName(a.student_id, 'student')}
                                      </div>
                                      <div className="text-xs text-ocean-secondary/60 mt-1">
                                        Credits: <Badge variant="secondary" className="bg-ocean-secondary/10 text-ocean-secondary border-ocean-secondary/20">
                                          {a.credits ?? 0}
                                        </Badge>
                                      </div>
                                    </div>
                                  </div>
                                  <Button 
                                    variant="destructive" 
                                    size="sm" 
                                    onClick={() => unassignGuardian(a.student_id, a.guardian_id)}
                                    className="bg-red-500 hover:bg-red-600 text-white"
                                  >
                                    <Unlink className="w-4 h-4 mr-1" />
                                    Unassign
                                  </Button>
                                </div>
                              </CardContent>
                            </Card>
                          </motion.div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
