// "use client"

// import { useEffect, useState } from "react"
// import { supabase } from "@/lib/supabaseClient"
// import { useRouter } from "next/navigation"

// export default function RoleSelectorPage() {
//   const router = useRouter()
//   const [loading, setLoading] = useState(true)
//   const [role, setRole] = useState("guardian") // default
//   const [userId, setUserId] = useState<string | null>(null)

//   useEffect(() => {
//     async function fetchProfile() {
//       const { data: { user } } = await supabase.auth.getUser()
//       if (!user) {
//         router.push("/login")
//         return
//       }
//       setUserId(user.id)

//       const { data, error } = await supabase
//         .from("profiles")
//         .select("role")
//         .eq("id", user.id)
//         .single()

//       if (error) console.error(error)
//       else if (data && data.role !== "guardian") {
//         // Already set → skip
//         router.push(`/${data.role}/dashboard`)
//         return
//       }

//       setLoading(false)
//     }
//     fetchProfile()
//   }, [router])

//   async function updateRole(newRole: string) {
//     if (!userId) return
//     const { error } = await supabase
//       .from("profiles")
//       .update({ role: newRole })
//       .eq("id", userId)

//     if (error) console.error(error)
//     else {
//       await supabase.auth.updateUser({ data: { onboarded: true } })
//       router.push(`/${newRole}/dashboard`)
//     }
//   }

//   if (loading) return <p>Loading...</p>

//   return (
//     <div className="flex flex-col items-center gap-4 mt-20">
//       <h1 className="text-xl font-bold">Select Your Role</h1>
//       {["admin", "tutor", "guardian", "student"].map(r => (
//         <button
//           key={r}
//           onClick={() => updateRole(r)}
//           className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
//         >
//           {r.charAt(0).toUpperCase() + r.slice(1)}
//         </button>
//       ))}
//     </div>
//   )
// }





"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabaseClient"
import { useRouter } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import Loader from "@/components/ui/loader"
import { GraduationCap, Shield, Users, User, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"

type Role = "admin" | "tutor" | "guardian" | "student"

const ROLE_META: Record<Role, { label: string; icon: any; hint: string }> = {
  admin:   { label: "Admin",   icon: Shield,        hint: "Manage the entire platform" },
  tutor:   { label: "Tutor",   icon: GraduationCap, hint: "Teach and manage sessions" },
  guardian:{ label: "Guardian",icon: Users,         hint: "Track your student’s progress" },
  student: { label: "Student", icon: User,          hint: "Attend sessions & view results" },
}

export default function RoleSelectorPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [userId, setUserId] = useState<string | null>(null)
  const [selected, setSelected] = useState<Role>("student")
  const [existingRole, setExistingRole] = useState<Role | null>(null)
  const [isOnboarded, setIsOnboarded] = useState(false)

  useEffect(() => {
    async function init() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push("/login")
        return
      }
      setUserId(user.id)
      setIsOnboarded(user.user_metadata?.onboarded === true)

      const { data, error } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single()

      if (error) {
        console.error("profiles fetch error:", error)
      } else if (data?.role) {
        // If DB has a default role, show it as preselected but DO NOT redirect.
        setExistingRole(data.role as Role)
        setSelected(data.role as Role)
      }

      // If the user truly finished onboarding in the past, then redirect.
      // Otherwise, stay here to let them confirm.
      if (user.user_metadata?.onboarded === true && data?.role) {
        router.push(`/${data.role}/dashboard`)
        return
      }

      setLoading(false)
    }
    init()
  }, [router])

  async function handleContinue() {
    if (!userId) return
    // Persist the chosen role (even if it already existed, we lock it in)
    const { error } = await supabase
      .from("profiles")
      .update({ role: selected })
      .eq("id", userId)

    if (error) {
      console.error("update role error:", error)
      return
    }
    // Go to profile setup to finish onboarding
    router.push(`/profile-setup?role=${selected}`)
  }

  if (loading) return <Loader/>

  return (
    <div className="min-h-screen ocean-gradient-light relative overflow-hidden px-4">
      {/* Background Decorations */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-ocean-primary/10 to-ocean-secondary/10 rounded-full blur-3xl"
        />
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-ocean-accent/10 to-ocean-primary/10 rounded-full blur-3xl"
        />
      </div>

      <div className="relative z-10 w-full max-w-3xl mx-auto py-16">
        {/* Back */}
        <div className="mb-6">
          <Link href="/" className="inline-flex items-center gap-2 text-ocean-primary hover:text-ocean-secondary transition-colors">
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm">Back to home</span>
          </Link>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="ocean-gradient-card rounded-2xl shadow-xl border border-ocean-primary/10"
        >
          <Card className="w-full shadow-none border-0 bg-transparent">
            <CardContent className="p-6 sm:p-10">
              <div className="flex items-center justify-between mb-4">
                <h1 className="text-3xl font-bold text-gray-900">Select Your Role</h1>
                {existingRole && !isOnboarded && (
                  <Badge variant="secondary" className="capitalize">
                    Suggested: {existingRole}
                  </Badge>
                )}
              </div>
              <p className="text-sm text-gray-600 mb-8">
                Choose how you want to use Learnify. Confirm to proceed with onboarding.
              </p>

              <RadioGroup
                value={selected}
                onValueChange={(v: Role) => setSelected(v)}
                className="grid grid-cols-1 sm:grid-cols-2 gap-4"
              >
                {(Object.keys(ROLE_META) as Role[]).map((r) => {
                  const Icon = ROLE_META[r].icon
                  const active = selected === r
                  return (
                    <Label
                      key={r}
                      htmlFor={`role-${r}`}
                      className={`ocean-border rounded-xl p-4 cursor-pointer transition shadow-sm hover:ocean-shadow-hover flex gap-3 items-start bg-white/80 backdrop-blur-sm border
                        ${active ? "border-ocean-primary bg-white" : "border-ocean-primary/20"}`}
                    >
                      <div className="pt-1">
                        <RadioGroupItem id={`role-${r}`} value={r} />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <Icon className="h-5 w-5 text-ocean-primary" />
                          <span className="font-semibold capitalize">{ROLE_META[r].label}</span>
                        </div>
                        <p className="text-xs text-gray-600 mt-1">{ROLE_META[r].hint}</p>
                      </div>
                    </Label>
                  )
                })}
              </RadioGroup>

              <div className="mt-8 flex justify-end">
                <Button className="rounded-xl px-6 ocean-gradient text-white shadow-lg hover:shadow-xl" onClick={handleContinue}>
                  Continue
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}

