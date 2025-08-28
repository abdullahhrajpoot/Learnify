// 'use client'

// import { useEffect, useState } from 'react'
// import { useRouter } from 'next/navigation'
// import { supabase } from '@/lib/supabaseClient'

// export default function EditStudentProfilePage() {
//   const router = useRouter()
//   const [email, setEmail] = useState('')
//   const [phone, setPhone] = useState('')
//   const [loading, setLoading] = useState(true)
//   const [error, setError] = useState<string | null>(null)

//   useEffect(() => {
//     const fetchProfile = async () => {
//       setLoading(true)
//       const {
//         data: { user }
//       } = await supabase.auth.getUser()

//       if (!user) {
//         setLoading(false)
//         return
//       }

//       const { data, error } = await supabase
//         .from('profiles')
//         .select('email, phone')
//         .eq('id', user.id)
//         .single()

//       if (error) {
//         console.error(error)
//       } else if (data) {
//         setEmail(data.email || '')
//         setPhone(data.phone || '')
//       }
//       setLoading(false)
//     }

//     fetchProfile()
//   }, [])

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault()
//     setLoading(true)
//     setError(null)

//     try {
//       const {
//         data: { user }
//       } = await supabase.auth.getUser()
//       if (!user) throw new Error('Not authenticated')

//       const { error } = await supabase
//         .from('profiles')
//         .update({ email, phone })
//         .eq('id', user.id)

//       if (error) throw error

//       router.push('/student/profile')
//     } catch (err: any) {
//       setError(err.message)
//     } finally {
//       setLoading(false)
//     }
//   }

//   if (loading) return <p className="p-6">Loading...</p>

//   return (
//     <div className="p-6 max-w-lg mx-auto">
//       <h1 className="text-2xl font-semibold mb-4">Edit Profile</h1>

//       <form onSubmit={handleSubmit} className="space-y-4">
//         <div>
//           <label className="block text-sm font-medium">Email</label>
//           <input
//             type="email"
//             value={email}
//             onChange={(e) => setEmail(e.target.value)}
//             className="mt-1 block w-full p-2 border rounded"
//           />
//         </div>

//         <div>
//           <label className="block text-sm font-medium">Phone</label>
//           <input
//             type="text"
//             value={phone}
//             onChange={(e) => setPhone(e.target.value)}
//             className="mt-1 block w-full p-2 border rounded"
//           />
//         </div>

//         {error && <p className="text-red-600">{error}</p>}

//         <button
//           type="submit"
//           disabled={loading}
//           className="px-4 py-2 bg-slate-800 text-white rounded"
//         >
//           {loading ? 'Saving...' : 'Save Changes'}
//         </button>
//       </form>
//     </div>
//   )
// }





'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { motion } from 'framer-motion'

export default function EditStudentProfilePage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true)
      const {
        data: { user }
      } = await supabase.auth.getUser()

      if (!user) {
        setLoading(false)
        return
      }

      const { data, error } = await supabase
        .from('profiles')
        .select('email, phone')
        .eq('id', user.id)
        .single()

      if (error) {
        console.error(error)
      } else if (data) {
        setEmail(data.email || '')
        setPhone(data.phone || '')
      }
      setLoading(false)
    }

    fetchProfile()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError(null)

    try {
      const {
        data: { user }
      } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated')

      const { error } = await supabase
        .from('profiles')
        .update({ email, phone })
        .eq('id', user.id)

      if (error) throw error

      router.push('/student/profile')
    } catch (err: any) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  if (loading)
    return (
      <div className="p-6 max-w-lg mx-auto">
        <div className="animate-pulse space-y-4">
          <div className="h-8 w-48 bg-gray-200 rounded" />
          <div className="h-6 w-full bg-gray-200 rounded" />
        </div>
      </div>
    )

  return (
    <div className="p-6 max-w-lg mx-auto">
      <motion.div initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-semibold mb-4">Edit Profile</h1>
      </motion.div>

      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle>Contact</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium">Email</label>
              <Input type="email" value={email} onChange={(e: any) => setEmail(e.target.value)} className="mt-1" />
            </div>

            <div>
              <label className="block text-sm font-medium">Phone</label>
              <Input type="text" value={phone} onChange={(e: any) => setPhone(e.target.value)} className="mt-1" />
            </div>

            {error && <p className="text-red-600">{error}</p>}

            <div className="flex gap-2">
              <Button type="submit" disabled={saving}>{saving ? 'Saving...' : 'Save Changes'}</Button>
              <Button variant="outline" onClick={() => router.back()}>Cancel</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
