'use client'

import { motion } from "framer-motion"
import { 
  Sparkles, 
  Waves, 
  Loader2, 
  BookOpen, 
  Users, 
  GraduationCap, 
  Shield,
  Globe,
  Heart,
  Star
} from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export default function LoadingPage() {
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

  const pulseVariants = {
    pulse: {
      scale: [1, 1.1, 1],
      opacity: [0.5, 1, 0.5],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  }

  return (
    <div className="min-h-screen ocean-gradient-light">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Header */}
          <motion.div
            variants={itemVariants}
            className="text-center mb-16 mt-20"
          >
            <div className="flex items-center justify-center gap-3 mb-6">
              <motion.div 
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className="p-4 bg-gradient-to-r from-ocean-primary/20 to-ocean-secondary/20 rounded-2xl"
              >
                <Waves className="w-12 h-12 text-ocean-primary" />
              </motion.div>
              <motion.div 
                animate="pulse"
                // variants={pulseVariants}
                className="p-2 bg-ocean-accent/10 rounded-lg"
              >
                <Sparkles className="w-6 h-6 text-ocean-accent" />
              </motion.div>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-ocean-primary to-ocean-secondary bg-clip-text text-transparent">
              Loading Learnify
            </h1>
            <p className="text-xl md:text-2xl text-ocean-secondary/80 mb-8 max-w-3xl mx-auto leading-relaxed">
              Preparing your educational experience with care and precision...
            </p>
            <div className="flex items-center justify-center gap-2">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              >
                <Loader2 className="w-6 h-6 text-ocean-primary" />
              </motion.div>
              <span className="text-ocean-primary font-medium">Loading...</span>
            </div>
          </motion.div>

          {/* Loading Animation */}
          <motion.div
            variants={itemVariants}
            className="flex justify-center mb-16"
          >
            <div className="relative">
              <motion.div
                animate={{ 
                  scale: [1, 1.2, 1],
                  rotate: [0, 180, 360]
                }}
                transition={{ 
                  duration: 3, 
                  repeat: Infinity, 
                  ease: "easeInOut" 
                }}
                className="w-32 h-32 bg-gradient-to-r from-ocean-primary to-ocean-secondary rounded-full flex items-center justify-center"
              >
                <motion.div
                  animate={{ 
                    scale: [1, 0.8, 1],
                    opacity: [1, 0.5, 1]
                  }}
                  transition={{ 
                    duration: 2, 
                    repeat: Infinity, 
                    ease: "easeInOut",
                    delay: 0.5
                  }}
                  className="w-20 h-20 bg-white rounded-full flex items-center justify-center"
                >
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  >
                    <Globe className="w-10 h-10 text-ocean-primary" />
                  </motion.div>
                </motion.div>
              </motion.div>
              
              {/* Orbiting Elements */}
              {[0, 1, 2, 3].map((index) => (
                <motion.div
                  key={index}
                  animate={{ 
                    rotate: 360,
                    scale: [1, 1.1, 1]
                  }}
                  transition={{ 
                    duration: 4, 
                    repeat: Infinity, 
                    ease: "linear",
                    delay: index * 0.5
                  }}
                  style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: `translate(-50%, -50%) rotate(${index * 90}deg) translateY(-60px)`,
                  }}
                >
                  <div className="w-4 h-4 bg-gradient-to-r from-ocean-accent to-ocean-secondary rounded-full" />
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Skeleton Loading Cards */}
          <motion.div
            variants={itemVariants}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16"
          >
            {[
              { icon: GraduationCap, title: "Students", color: "from-blue-500 to-cyan-500" },
              { icon: BookOpen, title: "Tutors", color: "from-teal-500 to-emerald-500" },
              { icon: Users, title: "Guardians", color: "from-purple-500 to-pink-500" },
              { icon: Shield, title: "Admins", color: "from-orange-500 to-red-500" },
            ].map((item, index) => {
              const Icon = item.icon
              return (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                >
                  <Card className="ocean-gradient-card shadow-lg border-0 overflow-hidden relative group">
                    <div className={`absolute inset-0 bg-gradient-to-r ${item.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}></div>
                    <CardContent className="p-6 relative z-10">
                      <div className="flex items-center justify-between mb-4">
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                          className={`p-3 bg-gradient-to-r ${item.color} rounded-xl`}
                        >
                          <Icon className="w-6 h-6 text-white" />
                        </motion.div>
                        <Skeleton className="w-12 h-6 rounded-full" />
                      </div>
                      <Skeleton className="h-6 w-24 mb-2" />
                      <Skeleton className="h-4 w-32" />
                    </CardContent>
                  </Card>
                </motion.div>
              )
            })}
          </motion.div>

          {/* Progress Indicators */}
          <motion.div
            variants={itemVariants}
            className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16"
          >
            {[
              { title: "Initializing", progress: 85, color: "from-blue-500 to-cyan-500" },
              { title: "Loading Data", progress: 65, color: "from-teal-500 to-emerald-500" },
              { title: "Finalizing", progress: 45, color: "from-purple-500 to-pink-500" },
            ].map((item, index) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.2, duration: 0.5 }}
              >
                <Card className="ocean-gradient-card shadow-lg border-0 overflow-hidden">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-ocean-primary">{item.title}</h3>
                      <span className="text-ocean-secondary/70 text-sm">{item.progress}%</span>
                    </div>
                    <div className="w-full bg-white/20 rounded-full h-2 mb-2">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${item.progress}%` }}
                        transition={{ duration: 2, delay: index * 0.3 }}
                        className={`h-2 bg-gradient-to-r ${item.color} rounded-full`}
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <motion.div
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 1, repeat: Infinity, delay: index * 0.2 }}
                        className="w-2 h-2 bg-ocean-accent rounded-full"
                      />
                      <span className="text-ocean-secondary/70 text-sm">Processing...</span>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>

          {/* Loading Message */}
          <motion.div
            variants={itemVariants}
            className="text-center"
          >
            <Card className="ocean-gradient-card shadow-lg border-0 overflow-hidden relative">
              <div className="absolute inset-0 bg-gradient-to-r from-ocean-accent/5 to-ocean-secondary/5"></div>
              <CardContent className="p-8 relative z-10">
                <div className="flex items-center justify-center gap-3 mb-4">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  >
                    <Heart className="w-6 h-6 text-red-500" />
                  </motion.div>
                  <motion.div
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                  >
                    <Star className="w-6 h-6 text-ocean-accent" />
                  </motion.div>
                  <motion.div
                    animate={{ rotate: -360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  >
                    <Sparkles className="w-6 h-6 text-ocean-primary" />
                  </motion.div>
                </div>
                <h3 className="text-2xl font-bold text-ocean-primary mb-4">
                  Almost There!
                </h3>
                <p className="text-ocean-secondary/70 text-lg max-w-2xl mx-auto leading-relaxed">
                  We're carefully preparing your personalized learning environment. 
                  This will only take a moment...
                </p>
                <div className="mt-6 flex items-center justify-center gap-2">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  >
                    <Loader2 className="w-5 h-5 text-ocean-primary" />
                  </motion.div>
                  <span className="text-ocean-primary font-medium">Please wait</span>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}
