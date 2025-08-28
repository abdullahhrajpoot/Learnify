'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabaseClient'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { motion } from 'framer-motion'
import { Calendar, Clock, User, BookOpen, Sparkles, Eye, Edit, Play, CheckCircle, AlertCircle } from 'lucide-react'

export default function TutorSessionsPage() {
  const [sessions, setSessions] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchSessions = async () => {
      setLoading(true)
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        setSessions([])
        setLoading(false)
        return
      }

      // ✅ Fetch sessions only for students assigned to this tutor
      const { data, error } = await supabase
        .from('sessions')
        .select(`
          id,
          start_time,
          end_time,
          notes,
          student_id,
          students:profiles!sessions_student_id_fkey ( full_name )
        `)
        .in(
          'student_id',
          (await supabase
            .from('tutor_assignments')
            .select('student_id')
            .eq('tutor_id', user.id)).data?.map(r => r.student_id) ?? []
        )

      if (error) {
        console.error(error)
      } else {
        setSessions(data || [])
      }

      setLoading(false)
    }

    fetchSessions()
  }, [])

  if (loading) {
    return (
      <div className="p-6 animate-pulse">
        <div className="h-6 w-48 bg-gray-200 rounded mb-4"></div>
        <div className="space-y-3">
          <div className="h-24 bg-gray-200 rounded"></div>
          <div className="h-24 bg-gray-200 rounded"></div>
        </div>
      </div>
    )
  }

  if (!sessions.length) {
    return <p className="p-6 text-gray-600">No sessions assigned to your students yet.</p>
  }

  return (
    <div className="min-h-screen ocean-gradient-light">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-2xl sm:text-3xl font-semibold mb-6 text-gray-900">My Students’ Sessions</h1>

      <ul className="space-y-4">
        {sessions.map((session: any) => {
          const start = session?.start_time
            ? new Date(session.start_time).toLocaleString(undefined, {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                timeZoneName: 'short',
              })
            : '—'

          const end = session?.end_time
            ? new Date(session.end_time).toLocaleString(undefined, {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                timeZoneName: 'short',
              })
            : '—'

          return (
            <li
              key={session.id}
              className="rounded-xl border bg-white p-4 shadow-sm hover:shadow-md transition"
            >
              <p className="text-lg font-semibold text-gray-900 break-words">
                {session.notes || 'No notes provided'}
              </p>

              <p className="mt-1 text-sm text-gray-700">
                <span className="font-medium">Student:</span>{' '}
                {session?.students?.full_name ?? '—'}
              </p>

              <div className="mt-2 space-y-1 text-sm text-gray-700">
                <p>
                  <span className="font-medium">Starts:</span>{' '}
                  <time dateTime={session.start_time}>{start}</time>
                </p>
                <p>
                  <span className="font-medium">Ends:</span>{' '}
                  <time dateTime={session.end_time}>{end}</time>
                </p>
              </div>

              {/* ✅ Actions */}
              <div className="mt-4 flex gap-3">
                <Link
                  href={`/tutor/sessions/${session.id}`}
                  className="px-3 py-1.5 text-sm rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition"
                >
                  View
                </Link>
                <Link
                  href={`/tutor/sessions/${session.id}/edit`}
                  className="px-3 py-1.5 text-sm rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 transition"
                >
                  Edit
                </Link>
              </div>
            </li>
          )
        })}
      </ul>
      </div>
    </div>
  )
}
