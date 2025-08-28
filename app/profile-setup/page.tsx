"use client"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { supabase } from "@/lib/supabaseClient"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { motion } from "framer-motion"
import Link from "next/link"
import { ArrowLeft, Sparkles } from "lucide-react"

export default function ProfileSetupPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const role = (searchParams.get("role") || "student") as "admin" | "tutor" | "guardian" | "student"

  const [fullName, setFullName] = useState("")
  const [phone, setPhone] = useState("")
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState("")

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage("")

    const { data: { user }, error: userError } = await supabase.auth.getUser()
    if (userError || !user) {
      setMessage("Not logged in!")
      setLoading(false)
      return
    }

    // Update existing profile row (no insert → avoids PK conflicts)
    const { error } = await supabase
      .from("profiles")
      .update({
        full_name: fullName || null,
        phone: phone || null,
      })
      .eq("id", user.id)

    if (error) {
      setMessage("Failed to save profile: " + error.message)
      setLoading(false)
      return
    }

    // Mark onboarding complete in auth metadata
    await supabase.auth.updateUser({ data: { onboarded: true } })

    setLoading(false)
    router.push(`/${role}/dashboard`)
  }

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

      <div className="relative z-10 w-full max-w-lg mx-auto py-16">
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
            <CardContent className="p-6 sm:p-8">
              <div className="text-center mb-6">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 backdrop-blur-sm border border-ocean-primary/20 text-ocean-primary text-sm font-medium mb-4">
                  <Sparkles className="w-4 h-4" />
                  Finish Onboarding
                </div>
                <h1 className="text-3xl font-bold text-gray-900 mb-1">Complete Your Profile</h1>
                <p className="text-sm text-gray-600">We’ll personalize your dashboard for your role.</p>
              </div>

              <form onSubmit={handleSaveProfile} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="full-name">Full Name</Label>
                  <Input
                    id="full-name"
                    placeholder="John Doe"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="bg-white/80 backdrop-blur-sm"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone (optional)</Label>
                  <Input
                    id="phone"
                    placeholder="+92 300 1234567"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="bg-white/80 backdrop-blur-sm"
                  />
                </div>
                <Button type="submit" disabled={loading} className="w-full rounded-xl py-3 ocean-gradient text-white shadow-lg hover:shadow-xl">
                  {loading ? "Saving..." : "Save & Continue"}
                </Button>
              </form>

              {message && <p className="text-center text-sm text-red-500 mt-4">{message}</p>}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
