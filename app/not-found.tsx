'use client'

import { motion } from "framer-motion"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  Home, 
  ArrowLeft, 
  Search, 
  MapPin, 
  Sparkles, 
  Waves, 
  AlertTriangle, 
  Compass, 
  Navigation, 
  Globe,
  BookOpen,
  Users,
  GraduationCap,
  Shield
} from "lucide-react"

export default function NotFound() {
  const quickLinks = [
    { name: "Home", href: "/", icon: Home, color: "from-blue-500 to-cyan-500" },
    { name: "About", href: "/about", icon: BookOpen, color: "from-teal-500 to-emerald-500" },
    { name: "Contact", href: "/contact", icon: Users, color: "from-purple-500 to-pink-500" },
    { name: "Login", href: "/login", icon: Shield, color: "from-orange-500 to-red-500" },
  ]

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
              <div className="p-4 bg-gradient-to-r from-red-500/20 to-orange-500/20 rounded-2xl">
                <AlertTriangle className="w-12 h-12 text-red-500" />
              </div>
              <div className="p-2 bg-ocean-accent/10 rounded-lg">
                <Sparkles className="w-6 h-6 text-ocean-accent" />
              </div>
            </div>
            <h1 className="text-6xl md:text-8xl font-bold mb-6 bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent">
              404
            </h1>
            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-ocean-primary to-ocean-secondary bg-clip-text text-transparent">
              Page Not Found
            </h2>
            <p className="text-xl md:text-2xl text-ocean-secondary/80 mb-8 max-w-3xl mx-auto leading-relaxed">
              Oops! It looks like you've ventured into uncharted territory. 
              The page you're looking for doesn't exist or has been moved.
            </p>
            <div className="flex items-center justify-center gap-2">
              <Badge className="bg-red-500/10 text-red-600 border-red-500/20 px-4 py-2 text-base">
                <Compass className="w-4 h-4 mr-2" />
                Lost in Space
              </Badge>
              <Badge className="bg-ocean-accent/10 text-ocean-accent border-ocean-accent/20 px-4 py-2 text-base">
                <Navigation className="w-4 h-4 mr-2" />
                Need Directions
              </Badge>
            </div>
          </motion.div>

          {/* Main Content */}
          <motion.div
            variants={itemVariants}
            className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16"
          >
            {/* Left Side - Error Details */}
            <Card className="ocean-gradient-card shadow-lg border-0 overflow-hidden">
              <CardContent className="p-8">
                <div className="text-center mb-8">
                  <div className="w-20 h-20 bg-gradient-to-r from-red-500/20 to-orange-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <MapPin className="w-10 h-10 text-red-500" />
                  </div>
                  <h3 className="text-2xl font-bold text-ocean-primary mb-4">
                    What Happened?
                  </h3>
                  <p className="text-ocean-secondary/70 leading-relaxed">
                    The page you're looking for might have been moved, deleted, or you entered the wrong URL. 
                    Don't worry, we're here to help you get back on track!
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-3 p-4 bg-white/50 backdrop-blur-sm rounded-lg">
                    <div className="p-2 bg-blue-500/10 rounded-lg">
                      <Search className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <div className="font-medium text-ocean-primary">Check the URL</div>
                      <div className="text-sm text-ocean-secondary/70">Make sure the address is spelled correctly</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-4 bg-white/50 backdrop-blur-sm rounded-lg">
                    <div className="p-2 bg-green-500/10 rounded-lg">
                      <ArrowLeft className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <div className="font-medium text-ocean-primary">Go Back</div>
                      <div className="text-sm text-ocean-secondary/70">Use your browser's back button</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-4 bg-white/50 backdrop-blur-sm rounded-lg">
                    <div className="p-2 bg-purple-500/10 rounded-lg">
                      <Home className="w-5 h-5 text-purple-600" />
                    </div>
                    <div>
                      <div className="font-medium text-ocean-primary">Start Over</div>
                      <div className="text-sm text-ocean-secondary/70">Navigate from the homepage</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Right Side - Quick Navigation */}
            <Card className="ocean-gradient-card shadow-lg border-0 overflow-hidden">
              <CardContent className="p-8">
                <div className="text-center mb-8">
                  <div className="w-20 h-20 bg-gradient-to-r from-ocean-primary/20 to-ocean-secondary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Globe className="w-10 h-10 text-ocean-primary" />
                  </div>
                  <h3 className="text-2xl font-bold text-ocean-primary mb-4">
                    Quick Navigation
                  </h3>
                  <p className="text-ocean-secondary/70 leading-relaxed">
                    Here are some popular pages to help you get started. 
                    Choose where you'd like to go next!
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {quickLinks.map((link, index) => {
                    const Icon = link.icon
                    return (
                      <motion.div
                        key={link.name}
                        whileHover={{ scale: 1.05, y: -5 }}
                        whileTap={{ scale: 0.95 }}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1, duration: 0.3 }}
                      >
                        <Link href={link.href}>
                          <Card className="ocean-gradient-card shadow-lg border-0 overflow-hidden relative group cursor-pointer">
                            <div className={`absolute inset-0 bg-gradient-to-r ${link.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}></div>
                            <CardContent className="p-6 relative z-10 text-center">
                              <div className={`p-3 bg-gradient-to-r ${link.color} rounded-xl w-fit mx-auto mb-4`}>
                                <Icon className="w-6 h-6 text-white" />
                              </div>
                              <h4 className="font-semibold text-ocean-primary">{link.name}</h4>
                            </CardContent>
                          </Card>
                        </Link>
                      </motion.div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            variants={itemVariants}
            className="text-center space-y-6"
          >
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button asChild className="ocean-gradient text-white shadow-lg hover:shadow-xl h-12 px-8 text-lg">
                  <Link href="/">
                    <Home className="w-5 h-5 mr-2" />
                    Go Home
                  </Link>
                </Button>
              </motion.div>
              
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button 
                  variant="outline" 
                  onClick={() => window.history.back()}
                  className="bg-white/80 backdrop-blur-sm border-ocean-primary/20 text-ocean-primary hover:bg-ocean-primary/5 h-12 px-8 text-lg"
                >
                  <ArrowLeft className="w-5 h-5 mr-2" />
                  Go Back
                </Button>
              </motion.div>
            </div>

            {/* <div className="flex items-center justify-center gap-2">
              <Badge className="bg-ocean-primary/10 text-ocean-primary border-ocean-primary/20 px-4 py-2 text-base">
                <Waves className="w-4 h-4 mr-2" />
                Ocean Breeze Theme
              </Badge>
              <Badge className="bg-ocean-accent/10 text-ocean-accent border-ocean-accent/20 px-4 py-2 text-base">
                <Sparkles className="w-4 h-4 mr-2" />
                Beautiful Design
              </Badge>
            </div> */}
          </motion.div>

          {/* Footer Message */}
          <motion.div
            variants={itemVariants}
            className="mt-16 text-center"
          >
            <Card className="ocean-gradient-card shadow-lg border-0 overflow-hidden relative">
              <div className="absolute inset-0 bg-gradient-to-r from-ocean-accent/5 to-ocean-secondary/5"></div>
              <CardContent className="p-8 relative z-10">
                <h3 className="text-2xl font-bold text-ocean-primary mb-4">
                  Need Help?
                </h3>
                <p className="text-ocean-secondary/70 text-lg max-w-2xl mx-auto leading-relaxed mb-6">
                  If you're still having trouble finding what you're looking for, 
                  feel free to contact our support team. We're here to help!
                </p>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button asChild variant="outline" className="bg-white/80 backdrop-blur-sm border-ocean-accent/20 text-ocean-accent hover:bg-ocean-accent/5 h-12 px-8 text-lg">
                    <Link href="/contact">
                      <Users className="w-5 h-5 mr-2" />
                      Contact Support
                    </Link>
                  </Button>
                </motion.div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}

