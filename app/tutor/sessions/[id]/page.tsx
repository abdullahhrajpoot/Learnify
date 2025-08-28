'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'
import Link from 'next/link'

export default function SessionDetailsPage() {
  const params = useParams()
  const { id } = params
  const [session, setSession] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchSession = async () => {
      setLoading(true)

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
        .eq('id', id)
        .single()

      if (error) {
        console.error(error)
      } else {
        setSession(data)
      }

      setLoading(false)
    }

    if (id) fetchSession()
  }, [id])

  if (loading) {
    return (
      <div className="p-6 animate-pulse">
        <div className="h-6 w-40 bg-gray-200 rounded mb-4"></div>
        <div className="h-32 bg-gray-200 rounded"></div>
      </div>
    )
  }

  if (!session) {
    return <p className="p-6 text-gray-600">Session not found.</p>
  }

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
    <div className="p-6">
      <div className="rounded-xl border bg-white p-6 shadow-md">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Session Details</h1>

        <div className="space-y-3 text-gray-700">
          <p>
            <span className="font-medium">Student:</span>{' '}
            {session?.students?.full_name ?? '—'}
          </p>

          <p>
            <span className="font-medium">Starts:</span>{' '}
            <time dateTime={session.start_time}>{start}</time>
          </p>

          <p>
            <span className="font-medium">Ends:</span>{' '}
            <time dateTime={session.end_time}>{end}</time>
          </p>

          <p>
            <span className="font-medium">Notes:</span>{' '}
            {session?.notes || 'No notes provided.'}
          </p>
        </div>

        {/* Actions */}
        <div className="mt-6 flex gap-3">
          <Link
            href={`/tutor/sessions/${session.id}/edit`}
            className="px-4 py-2 rounded-lg bg-emerald-600 text-white text-sm font-medium hover:bg-emerald-700 transition"
          >
            Edit Session
          </Link>
          <Link
            href="/tutor/sessions"
            className="px-4 py-2 rounded-lg bg-gray-200 text-gray-800 text-sm font-medium hover:bg-gray-300 transition"
          >
            Back
          </Link>
        </div>
      </div>
    </div>
  )
}
