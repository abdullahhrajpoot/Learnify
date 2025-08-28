// app/page.tsx
'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function LandingPage() {
  const [profile, setProfile] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    async function fetchProfile() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        setLoading(false)
        return
      }
      const { data, error } = await supabase
        .from('profiles')
        .select('id, role, full_name')
        .eq('id', user.id)
        .single()
      if (!error && data) setProfile(data)
      setLoading(false)
    }
    fetchProfile()
  }, [])

  function handlePortalClick(role: string) {
    if (!profile) {
      router.push('/login')
      return
    }
    switch (role) {
      case 'admin':
        router.push('/admin/dashboard')
        break
      case 'tutor':
        router.push('/tutor/dashboard')
        break
      case 'guardian':
        router.push('/guardian/dashboard')
        break
      case 'student':
        router.push('/student/dashboard')
        break
      default:
        router.push('/')
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Navbar */}
      <header className="border-b bg-white sticky top-0 z-10">
        <div className="max-w-6xl mx-auto flex items-center justify-between p-4">
          <Link href="/" className="text-xl font-bold text-blue-600">EduPortal</Link>
          <nav className="flex gap-6 text-sm">
            <Link href="/" className="hover:text-blue-600">Home</Link>
            <Link href="#about" className="hover:text-blue-600">About</Link>
            <Link href="#contact" className="hover:text-blue-600">Contact</Link>
            {!profile && (
              <>
                <Link href="/login" className="hover:text-blue-600">Login</Link>
                <Link href="/signup" className="hover:text-blue-600">Signup</Link>
              </>
            )}
            {profile && (
              <span className="text-gray-600">Hi, {profile.full_name || 'User'} 👋</span>
            )}
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="flex-1 bg-gradient-to-r from-blue-50 to-indigo-50 py-20">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h1 className="text-4xl font-extrabold text-gray-900">
            Welcome to <span className="text-blue-600">EduPortal</span>
          </h1>
          <p className="mt-4 text-gray-600 text-lg">
            A unified platform for Students, Tutors, Guardians, and Admins.
          </p>
          <div className="mt-6 flex justify-center gap-4">
            <Link
              href="/signup"
              className="px-6 py-3 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700"
            >
              Get Started
            </Link>
            <Link
              href="/login"
              className="px-6 py-3 border border-gray-300 rounded-lg shadow hover:bg-gray-50"
            >
              Login
            </Link>
          </div>
        </div>
      </section>

      {/* Portals */}
      <section className="max-w-6xl mx-auto py-16 px-4">
        <h2 className="text-2xl font-bold text-center mb-8">Choose Your Portal</h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {['admin', 'tutor', 'guardian', 'student'].map((role) => (
            <button
              key={role}
              onClick={() => handlePortalClick(role)}
              className="p-6 border rounded-xl shadow-sm hover:shadow-md transition bg-white text-center"
            >
              <h3 className="text-xl font-semibold capitalize">{role}</h3>
              <p className="text-gray-500 text-sm mt-2">Go to {role} portal</p>
            </button>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-white py-4">
        <div className="max-w-6xl mx-auto text-center text-sm text-gray-500">
          © {new Date().getFullYear()} EduPortal. All rights reserved.
        </div>
      </footer>
    </div>
  )
}
