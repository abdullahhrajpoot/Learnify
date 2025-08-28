'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Mail, Lock, Loader2, UserPlus, ArrowLeft, Waves, Sparkles, Github, Zap } from "lucide-react"

export default function SignUpPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')

    const { error } = await supabase.auth.signUp({ email, password })

    if (error) {
      setMessage(error.message)
      setLoading(false)
      return
    }

    setMessage('Check your email to confirm signup!')
    setLoading(false)
    router.push('/select-role')
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5
      }
    }
  };

  return (
    <div className="min-h-screen ocean-gradient-light relative overflow-hidden">
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

      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 sm:px-6">
        {/* Back Button */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="absolute top-8 left-4 sm:left-8"
        >
          <Link href="/" aria-label="Back to home" className="inline-block">
            <motion.div
              whileHover={{ x: -4 }}
              whileTap={{ scale: 0.98 }}
              className="inline-flex items-center gap-2 text-sm text-ocean-primary hover:text-ocean-secondary transition-colors duration-200"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Back to Learnify</span>
            </motion.div>
          </Link>
        </motion.div>

        {/* Main Content */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="w-full max-w-md"
        >
          {/* Header */}
          <motion.div variants={itemVariants} className="text-center mb-8">
            {/* <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 backdrop-blur-sm border border-ocean-primary/20 text-ocean-primary text-sm font-medium mb-6">
              <Waves className="w-4 h-4" />
              <span>Join Learnify</span>
            </div> */}
            
            <div className="flex items-center justify-center mb-4">
              <motion.div
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.6 }}
                className="p-3 rounded-full ocean-gradient shadow-lg"
              >
                <UserPlus className="w-8 h-8 text-white" />
              </motion.div>
            </div>
            
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
              Create Account
            </h1>
            <p className="text-gray-600">
              Join Learnify and start your learning journey 🚀
            </p>
          </motion.div>

          {/* Signup Card */}
          <motion.div
            variants={itemVariants}
            className="ocean-gradient-card rounded-2xl shadow-xl p-8 space-y-6"
          >
            <form onSubmit={handleSignUp} className="space-y-6">
              {/* Email */}
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium text-gray-700">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  <input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    required
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-ocean-primary focus:border-ocean-primary transition-all duration-200 bg-white/80 backdrop-blur-sm"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-medium text-gray-700">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  <input
                    id="password"
                    type="password"
                    placeholder="Create a password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    required
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-ocean-primary focus:border-ocean-primary transition-all duration-200 bg-white/80 backdrop-blur-sm"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <motion.button
                type="submit"
                disabled={loading}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full flex items-center justify-center gap-2 ocean-gradient text-white py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Creating account...</span>
                  </>
                ) : (
                  <>
                    <UserPlus className="w-5 h-5" />
                    <span>Create Account</span>
                  </>
                )}
              </motion.button>
            </form>

            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Or continue with</span>
              </div>
            </div>

            {/* OAuth Buttons */}
            <div className="flex gap-3">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => alert('OAuth not wired in UI stub')}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-3 border border-gray-300 rounded-xl hover:bg-gray-50 transition-all duration-200"
              >
                <Github className="w-4 h-4" />
                <span className="text-sm font-medium">GitHub</span>
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => alert('OAuth not wired in UI stub')}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-3 border border-gray-300 rounded-xl hover:bg-gray-50 transition-all duration-200"
              >
                <Zap className="w-4 h-4" />
                <span className="text-sm font-medium">Demo</span>
              </motion.button>
            </div>

            {/* Success/Error Message */}
            {message && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`p-4 rounded-xl text-sm text-center ${
                  message.includes('Check your email') 
                    ? 'bg-green-50 border border-green-200 text-green-600'
                    : 'bg-red-50 border border-red-200 text-red-600'
                }`}
              >
                {message}
              </motion.div>
            )}

            {/* Links */}
            <div className="text-center space-y-4">
              <div className="text-sm text-gray-600">
                Already have an account?{' '}
                <Link href="/login" className="text-ocean-primary hover:text-ocean-secondary font-semibold transition-colors duration-200">
                  Sign in here
                </Link>
              </div>
              
              <div className="flex items-center justify-center gap-2 text-xs text-gray-500">
                <Sparkles className="w-3 h-3" />
                <span>Experience the new Ocean Breeze interface</span>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}
