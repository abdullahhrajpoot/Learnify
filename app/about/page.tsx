"use client";
import Navbar from "@/components/Navbar";
import { motion } from "framer-motion";
import { Users, BookOpen, GraduationCap, Shield, Sparkles, Waves, Target, Award, Clock, TrendingUp, CheckCircle, Heart, Star, Zap, Globe, Rocket } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function AboutPage() {
  const features = [
    {
      title: "Students",
      description: "Track your assignments, sessions, and progress all in one place with personalized learning paths.",
      icon: GraduationCap,
      gradient: "from-blue-500 to-cyan-500",
      bgGradient: "from-blue-500/20 to-cyan-500/20",
      color: "text-blue-600",
      badge: "Learning"
    },
    {
      title: "Tutors",
      description: "Manage sessions, provide guidance, and track student progress with comprehensive tools.",
      icon: BookOpen,
      gradient: "from-teal-500 to-emerald-500",
      bgGradient: "from-teal-500/20 to-emerald-500/20",
      color: "text-teal-600",
      badge: "Teaching"
    },
    {
      title: "Guardians",
      description: "Stay updated on your child's progress and upcoming sessions with real-time notifications.",
      icon: Users,
      gradient: "from-purple-500 to-pink-500",
      bgGradient: "from-purple-500/20 to-pink-500/20",
      color: "text-purple-600",
      badge: "Monitoring"
    },
    {
      title: "Admins",
      description: "Manage all users, assignments, sessions, and platform analytics with powerful insights.",
      icon: Shield,
      gradient: "from-orange-500 to-red-500",
      bgGradient: "from-orange-500/20 to-red-500/20",
      color: "text-orange-600",
      badge: "Management"
    },
  ];

  const stats = [
    { number: "1000+", label: "Active Students", icon: GraduationCap },
    { number: "50+", label: "Expert Tutors", icon: BookOpen },
    { number: "500+", label: "Happy Guardians", icon: Users },
    { number: "24/7", label: "Support Available", icon: Shield },
  ];

  const highlights = [
    {
      title: "Personalized Learning",
      description: "AI-powered recommendations and adaptive learning paths for every student.",
      icon: Target,
      color: "text-blue-600"
    },
    {
      title: "Real-time Progress",
      description: "Track learning milestones and achievements with detailed analytics.",
      icon: TrendingUp,
      color: "text-green-600"
    },
    {
      title: "Secure Platform",
      description: "Enterprise-grade security to protect student data and privacy.",
      icon: Shield,
      color: "text-purple-600"
    },
    {
      title: "24/7 Support",
      description: "Round-the-clock assistance for students, tutors, and guardians.",
      icon: Clock,
      color: "text-orange-600"
    },
  ];

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
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <>
      <Navbar/>
      <div className="min-h-screen ocean-gradient-light">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {/* Hero Section */}
            <motion.div
              variants={itemVariants}
              className="text-center mb-16 mt-20"
            >
              {/* <div className="flex items-center justify-center gap-3 mb-6">
                <div className="p-4 bg-gradient-to-r from-ocean-primary/20 to-ocean-secondary/20 rounded-2xl">
                  <Waves className="w-12 h-12 text-ocean-primary" />
                </div>
                <div className="p-2 bg-ocean-accent/10 rounded-lg">
                  <Sparkles className="w-6 h-6 text-ocean-accent" />
                </div>
              </div> */}
              <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-cyan-500 to-cyan-500 bg-clip-text text-transparent">
                About <span className="text-ocean-accent">Learnify</span>
              </h1>
              <p className="text-xl md:text-2xl text-ocean-secondary/80 mb-8 max-w-4xl mx-auto leading-relaxed">
                Learnify connects students, tutors, guardians, and admins in a seamless, intuitive learning platform. 
                Everything you need to manage learning, schedules, and progress — all under one roof.
              </p>
              <div className="flex items-center justify-center gap-2">
                <Badge className="bg-ocean-primary/10 text-ocean-primary border-ocean-primary/20 px-4 py-2 text-base">
                  <Star className="w-4 h-4 mr-2" />
                  Trusted by 1000+ Users
                </Badge>
                <Badge className="bg-ocean-accent/10 text-ocean-accent border-ocean-accent/20 px-4 py-2 text-base">
                  <Award className="w-4 h-4 mr-2" />
                  Award Winning
                </Badge>
              </div>
            </motion.div>

            {/* Stats Section */}
            <motion.div
              variants={itemVariants}
              className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16"
            >
              {stats.map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <motion.div
                    key={stat.label}
                    whileHover={{ scale: 1.05, y: -5 }}
                    className="text-center"
                  >
                    <Card className="ocean-gradient-card shadow-lg border-0 overflow-hidden relative group">
                      <div className="absolute inset-0 bg-gradient-to-r from-ocean-primary/10 to-ocean-secondary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      <CardContent className="p-6 relative z-10">
                        <div className="p-3 bg-gradient-to-r from-ocean-primary to-ocean-secondary rounded-xl w-fit mx-auto mb-4">
                          <Icon className="w-8 h-8 text-white" />
                        </div>
                        <div className="text-3xl md:text-4xl font-bold text-ocean-primary mb-2">
                          {stat.number}
                        </div>
                        <div className="text-ocean-secondary/70 text-sm md:text-base">
                          {stat.label}
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </motion.div>

            {/* Features Section */}
            <motion.div
              variants={itemVariants}
              className="mb-16"
            >
              <div className="text-center mb-12">
                <h2 className="text-4xl md:text-5xl font-bold text-ocean-primary mb-4">
                  Platform Features
                </h2>
                <p className="text-xl text-ocean-secondary/70 max-w-3xl mx-auto">
                  Discover how Learnify empowers every member of the learning ecosystem
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {features.map((f, i) => {
                  const Icon = f.icon;
                  return (
                    <motion.div
                      key={f.title}
                      whileHover={{ scale: 1.05, y: -10 }}
                      initial={{ opacity: 0, y: 50 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.1, duration: 0.5 }}
                      className="group"
                    >
                      <Card className="ocean-gradient-card shadow-lg border-0 overflow-hidden relative h-full">
                        <div className={`absolute inset-0 bg-gradient-to-r ${f.bgGradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}></div>
                        <CardContent className="p-8 relative z-10 text-center">
                          <div className={`p-4 bg-gradient-to-r ${f.gradient} rounded-2xl w-fit mx-auto mb-6`}>
                            <Icon className="w-10 h-10 text-white" />
                          </div>
                          <Badge className={`bg-${f.color.replace('text-', '')}/10 text-${f.color.replace('text-', '')} border-${f.color.replace('text-', '')}/20 mb-4`}>
                            {f.badge}
                          </Badge>
                          <h3 className="text-2xl font-bold text-ocean-primary mb-4">{f.title}</h3>
                          <p className="text-ocean-secondary/70 leading-relaxed">{f.description}</p>
                        </CardContent>
                      </Card>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>

            {/* Highlights Section */}
            <motion.div
              variants={itemVariants}
              className="mb-16"
            >
              <div className="text-center mb-12">
                <h2 className="text-4xl md:text-5xl font-bold text-ocean-primary mb-4">
                  Why Choose Learnify?
                </h2>
                <p className="text-xl text-ocean-secondary/70 max-w-3xl mx-auto">
                  Experience the future of education management with cutting-edge features
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {highlights.map((highlight, index) => {
                  const Icon = highlight.icon;
                  return (
                    <motion.div
                      key={highlight.title}
                      whileHover={{ scale: 1.02, x: 5 }}
                      initial={{ opacity: 0, x: -50 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1, duration: 0.5 }}
                    >
                      <Card className="ocean-gradient-card shadow-lg border-0 overflow-hidden">
                        <CardContent className="p-8">
                          <div className="flex items-start gap-4">
                            <div className={`p-3 bg-${highlight.color.replace('text-', '')}/10 rounded-xl`}>
                              <Icon className={`w-8 h-8 ${highlight.color}`} />
                            </div>
                            <div className="flex-1">
                              <h3 className="text-xl font-bold text-ocean-primary mb-3">{highlight.title}</h3>
                              <p className="text-ocean-secondary/70 leading-relaxed">{highlight.description}</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>

            {/* Mission Statement */}
            <motion.div
              variants={itemVariants}
              className="text-center"
            >
              <Card className="ocean-gradient-card shadow-lg border-0 overflow-hidden relative">
                <div className="absolute inset-0 bg-gradient-to-r from-ocean-primary/5 to-ocean-secondary/5"></div>
                <CardContent className="p-12 relative z-10">
                  <div className="flex items-center justify-center gap-3 mb-6">
                    <Heart className="w-8 h-8 text-red-500" />
                    <Rocket className="w-8 h-8 text-ocean-accent" />
                    <Globe className="w-8 h-8 text-ocean-primary" />
                  </div>
                  <h2 className="text-3xl md:text-4xl font-bold text-ocean-primary mb-6">
                    Our Mission
                  </h2>
                  <p className="text-xl text-ocean-secondary/70 max-w-4xl mx-auto leading-relaxed mb-8">
                    To revolutionize education by creating a seamless, intelligent platform that empowers students to learn, 
                    tutors to teach, guardians to support, and administrators to manage — all while fostering a love for 
                    lifelong learning in a secure, collaborative environment.
                  </p>
                  <div className="flex items-center justify-center gap-4">
                    <Badge className="bg-ocean-primary/10 text-ocean-primary border-ocean-primary/20 px-4 py-2 text-base">
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Innovation
                    </Badge>
                    <Badge className="bg-ocean-accent/10 text-ocean-accent border-ocean-accent/20 px-4 py-2 text-base">
                      <Zap className="w-4 h-4 mr-2" />
                      Excellence
                    </Badge>
                    <Badge className="bg-ocean-secondary/10 text-ocean-secondary border-ocean-secondary/20 px-4 py-2 text-base">
                      <Star className="w-4 h-4 mr-2" />
                      Quality
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </>
  );
}
