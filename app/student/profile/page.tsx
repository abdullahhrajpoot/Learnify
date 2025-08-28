// 'use client'

// import { useEffect, useState } from 'react'
// import { supabase } from '@/lib/supabaseClient'
// import Link from 'next/link'

// export default function StudentProfilePage() {
//   const [profile, setProfile] = useState<any>(null)
//   const [loading, setLoading] = useState(true)

//   useEffect(() => {
//     const fetchProfile = async () => {
//       setLoading(true)
//       const {
//         data: { user },
//       } = await supabase.auth.getUser()

//       if (!user) {
//         setProfile(null)
//         setLoading(false)
//         return
//       }

//       const { data, error } = await supabase
//         .from('profiles')
//         .select('id, full_name, email, phone, role, created_at')
//         .eq('id', user.id)
//         .single()

//       if (error) {
//         console.error(error)
//         setProfile(null)
//       } else {
//         setProfile(data)
//       }
//       setLoading(false)
//     }

//     fetchProfile()
//   }, [])

//   if (loading) return <p className="p-6">Loading...</p>
//   if (!profile) return <p className="p-6">No profile found.</p>

//   return (
//     <div className="p-6 max-w-lg mx-auto">
//       <h1 className="text-2xl font-semibold mb-4">My Profile</h1>

//       <div className="space-y-2 bg-white shadow rounded p-4">
//         <p><span className="font-medium">Name:</span> {profile.full_name}</p>
//         <p><span className="font-medium">Email:</span> {profile.email}</p>
//         <p><span className="font-medium">Phone:</span> {profile.phone ?? '—'}</p>
//         <p><span className="font-medium">Role:</span> {profile.role}</p>
//         <p className="text-sm text-gray-500">
//           Joined {new Date(profile.created_at).toLocaleDateString()}
//         </p>
//       </div>

//       <div className="mt-4">
//         <Link
//           href="/student/profile/edit"
//           className="px-4 py-2 bg-slate-800 text-white rounded"
//         >
//           Edit Profile
//         </Link>
//       </div>
//     </div>
//   )
// }





'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { User, Mail, Phone, Calendar } from 'lucide-react'
import { motion } from 'framer-motion'

export default function StudentProfilePage() {
  const [profile, setProfile] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true)
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        setProfile(null)
        setLoading(false)
        return
      }

      const { data, error } = await supabase
        .from('profiles')
        .select('id, full_name, email, phone, role, created_at')
        .eq('id', user.id)
        .single()

      if (error) {
        console.error(error)
        setProfile(null)
      } else {
        setProfile(data)
      }
      setLoading(false)
    }

    fetchProfile()
  }, [])

  if (loading)
    return (
      <div className="p-6 max-w-4xl mx-auto">
        <div className="animate-pulse space-y-4">
          <div className="h-8 w-1/3 bg-gray-200 rounded" />
          <div className="h-40 bg-gray-200 rounded" />
        </div>
      </div>
    )

  if (!profile) return <p className="p-6">No profile found.</p>

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <motion.div initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-bold mb-4">My Profile</h1>
      </motion.div>

      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <User className="w-6 h-6 text-slate-700" />
            <div>
              <div className="text-lg font-semibold">{profile.full_name ?? 'Unnamed'}</div>
              <div className="text-sm text-gray-500">ID: <span className="font-mono text-xs">{profile.id}</span></div>
            </div>
          </CardTitle>
        </CardHeader>

        <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-gray-700">
              <Mail className="w-4 h-4 text-slate-500" />
              <div><strong>Email:</strong> <span className="ml-1 text-gray-600">{profile.email}</span></div>
            </div>

            <div className="flex items-center gap-2 text-sm text-gray-700">
              <Phone className="w-4 h-4 text-slate-500" />
              <div><strong>Phone:</strong> <span className="ml-1 text-gray-600">{profile.phone ?? '—'}</span></div>
            </div>

            <div className="flex items-center gap-2 text-sm text-gray-700">
              <Calendar className="w-4 h-4 text-slate-500" />
              <div>
                <strong>Joined:</strong> <span className="ml-1 text-gray-600">{profile.created_at ? new Date(profile.created_at).toLocaleDateString() : '—'}</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col justify-between">
            <div>
              <div className="text-sm text-gray-500">Role</div>
              <div className="text-base font-medium mt-1">{profile.role}</div>
            </div>

            <div className="mt-4 flex gap-2">
              <Link href="/student/profile/edit">
                <Button size="sm">Edit Profile</Button>
              </Link>
              <Link href="/student/sessions">
                <Button variant="outline" size="sm">My Sessions</Button>
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
