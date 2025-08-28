// 'use client'
// import { useEffect, useState } from 'react'
// import { supabase } from '@/lib/supabaseClient'

// export default function AdminSessionsPage() {
//   const [sessions, setSessions] = useState<any[]>([])
//   const [loading, setLoading] = useState(true)
//   const [tutors, setTutors] = useState<any[]>([])
//   const [students, setStudents] = useState<any[]>([])
//   const [form, setForm] = useState({ tutor_id:'', student_id:'', start_time:'', end_time:'', notes:'' })
//   const [saving, setSaving] = useState(false)

//   useEffect(() => {
//     loadAll()
//   }, [])

//   async function loadAll() {
//     setLoading(true)
//     try {
//       const [{ data: sData }, { data: tutorsData }, { data: studentsData }] = await Promise.all([
//         supabase.from('sessions').select('*').order('created_at', { ascending: false }).limit(200),
//         supabase.from('profiles').select('id, full_name').eq('role', 'tutor').order('full_name'),
//         supabase.from('profiles').select('id, full_name').eq('role', 'student').order('full_name'),
//       ])
//       setSessions(sData || [])
//       setTutors(tutorsData || [])
//       setStudents(studentsData || [])
//     } catch (err) {
//       console.error('Load error', err)
//     } finally {
//       setLoading(false)
//     }
//   }

//   function validateForm() {
//     const missing: string[] = []
//     if (!form.tutor_id) missing.push('tutor')
//     if (!form.student_id) missing.push('student')
//     if (!form.start_time) missing.push('start time')
//     return missing
//   }

//   async function create() {
//     const missing = validateForm()
//     if (missing.length) {
//       return alert('Missing: ' + missing.join(', '))
//     }

//     setSaving(true)
//     try {
//       const { error } = await supabase.from('sessions').insert({
//         tutor_id: form.tutor_id,
//         student_id: form.student_id,
//         start_time: new Date(form.start_time).toISOString(),
//         end_time: form.end_time ? new Date(form.end_time).toISOString() : null,
//         notes: form.notes || null
//       })
//       if (error) {
//         alert('Create failed: ' + error.message)
//       } else {
//         setForm({ tutor_id:'', student_id:'', start_time:'', end_time:'', notes:'' })
//         await loadAll()
//       }
//     } catch (e) {
//       console.error(e)
//       alert('Create failed')
//     } finally {
//       setSaving(false)
//     }
//   }

//   async function updateStatus(id:number, status:string) {
//     const { error } = await supabase.from('sessions').update({ status }).eq('id', id)
//     if (error) return alert('Update failed: ' + error.message)
//     loadAll()
//   }

//   return (
//     <div className="space-y-4">
//       <h1 className="text-2xl font-bold">Admin — Sessions</h1>

//       <div className="border rounded p-4 space-y-3">
//         <h3 className="font-semibold">Create session</h3>
//         <div className="grid grid-cols-1 sm:grid-cols-4 gap-2">
//           <select value={form.tutor_id} onChange={e=>setForm({...form, tutor_id: e.target.value})} className="border rounded px-3 py-2">
//             <option value="">Select tutor</option>
//             {tutors.map(t => <option key={t.id} value={t.id}>{t.full_name || t.id.slice(0,8)}</option>)}
//           </select>

//           <select value={form.student_id} onChange={e=>setForm({...form, student_id: e.target.value})} className="border rounded px-3 py-2">
//             <option value="">Select student</option>
//             {students.map(s => <option key={s.id} value={s.id}>{s.full_name || s.id.slice(0,8)}</option>)}
//           </select>

//           <input type="datetime-local" placeholder="Start time" value={form.start_time} onChange={e=>setForm({...form, start_time: e.target.value})} className="border rounded px-3 py-2"/>
//           <input type="datetime-local" placeholder="End time (optional)" value={form.end_time} onChange={e=>setForm({...form, end_time: e.target.value})} className="border rounded px-3 py-2"/>
//         </div>

//         <textarea placeholder="Notes" value={form.notes} onChange={e=>setForm({...form, notes:e.target.value})} className="w-full border rounded px-3 py-2"/>
//         <div><button onClick={create} className="px-3 py-2 bg-blue-600 text-white rounded" disabled={saving}>{saving ? 'Creating...' : 'Create'}</button></div>
//       </div>

//       <div className="border rounded">
//         <div className="p-3 font-semibold border-b">Sessions</div>
//         {loading ? <div className="p-3">Loading sessions...</div> : sessions.length === 0 ? <div className="p-3">No sessions</div> : sessions.map(s => (
//           <div key={s.id} className="p-3 flex items-center justify-between">
//             <div>
//               <div className="font-medium">#{s.id} • {s.status}</div>
//               <div className="text-sm text-gray-600">Tutor: {s.tutor_id} • Student: {s.student_id}</div>
//               <div className="text-xs text-gray-500">{new Date(s.start_time).toLocaleString()} - {s.end_time ? new Date(s.end_time).toLocaleString() : '—'}</div>
//             </div>
//             <div className="flex gap-2">
//               {s.status !== 'accepted' && <button onClick={()=>updateStatus(s.id, 'accepted')} className="px-2 py-1 bg-green-600 text-white rounded">Accept</button>}
//               {s.status !== 'declined' && <button onClick={()=>updateStatus(s.id, 'declined')} className="px-2 py-1 bg-red-600 text-white rounded">Decline</button>}
//               {s.status !== 'completed' && <button onClick={()=>updateStatus(s.id, 'completed')} className="px-2 py-1 bg-gray-100 rounded">Mark Completed</button>}
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   )
// }





// 'use client'
// import { useEffect, useState } from 'react'
// import { supabase } from '@/lib/supabaseClient'
// import { Card } from "@/components/ui/card"
// import { motion } from "framer-motion"

// export default function AdminSessionsPage() {
//   const [sessions, setSessions] = useState<any[]>([])
//   const [loading, setLoading] = useState(true)
//   const [tutors, setTutors] = useState<any[]>([])
//   const [students, setStudents] = useState<any[]>([])
//   const [form, setForm] = useState({ tutor_id:'', student_id:'', start_time:'', end_time:'', notes:'' })
//   const [saving, setSaving] = useState(false)

//   useEffect(() => { loadAll() }, [])

//   async function loadAll() {
//     setLoading(true)
//     const [{ data: sData }, { data: tutorsData }, { data: studentsData }] = await Promise.all([
//       supabase.from('sessions').select('*').order('created_at', { ascending: false }).limit(200),
//       supabase.from('profiles').select('id, full_name').eq('role', 'tutor').order('full_name'),
//       supabase.from('profiles').select('id, full_name').eq('role', 'student').order('full_name'),
//     ])
//     setSessions(sData || [])
//     setTutors(tutorsData || [])
//     setStudents(studentsData || [])
//     setLoading(false)
//   }

//   async function create() {
//     if (!form.tutor_id || !form.student_id || !form.start_time) {
//       return alert("Please fill required fields")
//     }
//     setSaving(true)
//     const { error } = await supabase.from('sessions').insert({
//       tutor_id: form.tutor_id,
//       student_id: form.student_id,
//       start_time: new Date(form.start_time).toISOString(),
//       end_time: form.end_time ? new Date(form.end_time).toISOString() : null,
//       notes: form.notes || null
//     })
//     if (!error) {
//       setForm({ tutor_id:'', student_id:'', start_time:'', end_time:'', notes:'' })
//       await loadAll()
//     }
//     setSaving(false)
//   }

//   async function updateStatus(id:number, status:string) {
//     const { error } = await supabase.from('sessions').update({ status }).eq('id', id)
//     if (!error) loadAll()
//   }

//   return (
//     <div className="space-y-6">
//       <motion.h1
//         className="text-3xl font-bold text-purple-700"
//         initial={{ opacity: 0, y: -20 }}
//         animate={{ opacity: 1, y: 0 }}
//       >
//         Admin — Sessions
//       </motion.h1>

//       {/* Create Form */}
//       <Card className="p-6 space-y-3">
//         <h3 className="font-semibold text-lg">Create Session</h3>
//         <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
//           <select value={form.tutor_id} onChange={e=>setForm({...form, tutor_id: e.target.value})} className="border rounded-lg px-3 py-2">
//             <option value="">Select tutor</option>
//             {tutors.map(t => <option key={t.id} value={t.id}>{t.full_name || t.id.slice(0,8)}</option>)}
//           </select>
//           <select value={form.student_id} onChange={e=>setForm({...form, student_id: e.target.value})} className="border rounded-lg px-3 py-2">
//             <option value="">Select student</option>
//             {students.map(s => <option key={s.id} value={s.id}>{s.full_name || s.id.slice(0,8)}</option>)}
//           </select>
//           <input type="datetime-local" value={form.start_time} onChange={e=>setForm({...form, start_time:e.target.value})} className="border rounded-lg px-3 py-2"/>
//           <input type="datetime-local" value={form.end_time} onChange={e=>setForm({...form, end_time:e.target.value})} className="border rounded-lg px-3 py-2"/>
//         </div>
//         <textarea placeholder="Notes" value={form.notes} onChange={e=>setForm({...form, notes:e.target.value})} className="w-full border rounded-lg px-3 py-2"/>
//         <button onClick={create} disabled={saving} className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition">
//           {saving ? 'Creating...' : 'Create'}
//         </button>
//       </Card>

//       {/* Sessions List */}
//       <Card>
//         <div className="p-4 font-semibold border-b">Sessions</div>
//         {loading ? (
//           <div className="p-4">Loading sessions...</div>
//         ) : sessions.length === 0 ? (
//           <div className="p-4 text-gray-500">No sessions found</div>
//         ) : (
//           <div className="divide-y">
//             {sessions.map(s => (
//               <motion.div
//                 key={s.id}
//                 className="p-4 flex items-center justify-between"
//                 initial={{ opacity: 0, y: 10 }}
//                 animate={{ opacity: 1, y: 0 }}
//               >
//                 <div>
//                   <div className="font-medium">#{s.id} • <span className={`px-2 py-1 rounded text-xs ${s.status === "accepted" ? "bg-green-100 text-green-700" : s.status === "declined" ? "bg-red-100 text-red-700" : "bg-gray-100 text-gray-600"}`}>{s.status || "pending"}</span></div>
//                   <div className="text-sm text-gray-600">Tutor: {s.tutor_id} • Student: {s.student_id}</div>
//                   <div className="text-xs text-gray-500">{new Date(s.start_time).toLocaleString()} - {s.end_time ? new Date(s.end_time).toLocaleString() : '—'}</div>
//                 </div>
//                 <div className="flex gap-2">
//                   {s.status !== 'accepted' && <button onClick={()=>updateStatus(s.id, 'accepted')} className="px-2 py-1 bg-green-600 text-white rounded">Accept</button>}
//                   {s.status !== 'declined' && <button onClick={()=>updateStatus(s.id, 'declined')} className="px-2 py-1 bg-red-600 text-white rounded">Decline</button>}
//                   {s.status !== 'completed' && <button onClick={()=>updateStatus(s.id, 'completed')} className="px-2 py-1 bg-gray-200 rounded">Mark Completed</button>}
//                 </div>
//               </motion.div>
//             ))}
//           </div>
//         )}
//       </Card>
//     </div>
//   )
// }






// 'use client'
// import { useEffect, useState } from 'react'
// import { supabase } from '@/lib/supabaseClient'
// import { motion } from 'framer-motion'
// import { Card } from "@/components/ui/card"
// import { Badge } from "@/components/ui/badge"

// export default function AdminSessionsPage() {
//   const [sessions, setSessions] = useState<any[]>([])
//   const [loading, setLoading] = useState(true)

//   useEffect(()=>{ load() }, [])
//   const load = async () => {
//     setLoading(true)
//     const { data } = await supabase.from('sessions').select('*').order('start_time', { ascending: false })
//     setSessions(data || [])
//     setLoading(false)
//   }

//   const statusColor = (status: string) => {
//     switch (status) {
//       case 'completed': return 'bg-green-500'
//       case 'pending': return 'bg-yellow-500'
//       case 'cancelled': return 'bg-red-500'
//       default: return 'bg-gray-400'
//     }
//   }

//   return (
//     <div className="p-6 space-y-6">
//       <h1 className="text-2xl font-bold">Sessions</h1>
//       {loading ? <div>Loading sessions...</div> : (
//         <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
//           {sessions.map(s => (
//             <motion.div key={s.id} initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} whileHover={{scale:1.02}}>
//               <Card className="p-4 flex flex-col gap-2">
//                 <div className="font-medium">Session #{s.id}</div>
//                 <Badge className={`${statusColor(s.status)} text-white w-fit`}>{s.status}</Badge>
//                 <div className="text-xs text-gray-500">{new Date(s.start_time).toLocaleString()}</div>
//                 <div className="text-xs">Tutor: {s.tutor_id}</div>
//                 <div className="text-xs">Student: {s.student_id}</div>
//               </Card>
//             </motion.div>
//           ))}
//         </div>
//       )}
//     </div>
//   )
// }





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
