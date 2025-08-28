"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import { useState } from "react";
import { 
  Menu, 
  X, 
  Home, 
  Info, 
  Phone, 
  LogIn, 
  UserPlus, 
  GraduationCap, 
  Users, 
  BookOpen, 
  Shield,
  Sparkles,
  ArrowRight,
  Waves
} from "lucide-react";

export default function HomePage() {
  const [menuOpen, setMenuOpen] = useState(false);

  const roles = [
    { name: "Admin", icon: Shield, link: "/login", description: "System management and oversight", color: "from-red-500 to-pink-500" },
    { name: "Tutor", icon: BookOpen, link: "/login", description: "Teaching and session management", color: "from-blue-500 to-cyan-500" },
    { name: "Student", icon: GraduationCap, link: "/login", description: "Learning and assignments", color: "from-green-500 to-emerald-500" },
    { name: "Guardian", icon: Users, link: "/login", description: "Progress monitoring", color: "from-purple-500 to-violet-500" },
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
    <div className="min-h-screen flex flex-col">
      {/* Navbar */}
      <nav className="fixed w-full bg-white/80 backdrop-blur-md shadow-sm z-50 border-b border-ocean-primary/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 text-2xl font-extrabold text-ocean-primary group">
            <motion.div
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.6 }}
            >
              <GraduationCap className="w-8 h-8 text-ocean-primary" />
            </motion.div>
            <span className="bg-gradient-to-r from-ocean-primary to-ocean-secondary bg-clip-text text-ocean-primary">
              Learnify
            </span>
            <Sparkles className="w-5 h-5 text-ocean-accent opacity-0 group-hover:opacity-100 transition-opacity" />
          </Link>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-6">
            <Link href="/" className="flex items-center gap-2 text-gray-700 hover:text-ocean-primary transition-colors duration-200">
              <Home className="w-5 h-5" /> 
              <span>Home</span>
            </Link>
            <Link href="/about" className="flex items-center gap-2 text-gray-700 hover:text-ocean-primary transition-colors duration-200">
              <Info className="w-5 h-5" /> 
              <span>About</span>
            </Link>
            <Link href="/contact" className="flex items-center gap-2 text-gray-700 hover:text-ocean-primary transition-colors duration-200">
              <Phone className="w-5 h-5" /> 
              <span>Contact</span>
            </Link>
            <div className="flex items-center gap-3 ml-6">
              <Link
                href="/login"
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-ocean-primary border border-ocean-primary hover:bg-ocean-primary hover:text-white transition-all duration-200 shadow-sm hover:shadow-md"
              >
                <LogIn className="w-4 h-4" /> 
                <span>Sign In</span>
              </Link>
              <Link
                href="/signup"
                className="flex items-center gap-2 px-4 py-2 rounded-lg ocean-gradient text-white hover:shadow-lg transition-all duration-200 shadow-md"
              >
                <UserPlus className="w-4 h-4" /> 
                <span>Sign Up</span>
              </Link>
            </div>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            className="md:hidden text-gray-700 hover:text-ocean-primary transition-colors"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Dropdown */}
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="md:hidden bg-white/95 backdrop-blur-md border-t border-ocean-primary/10 shadow-lg px-4 py-4 space-y-3"
          >
            <Link
              href="/"
              className="flex items-center gap-3 text-gray-700 hover:text-ocean-primary transition-colors p-2 rounded-lg hover:bg-ocean-primary/5"
              onClick={() => setMenuOpen(false)}
            >
              <Home className="w-5 h-5" /> 
              <span>Home</span>
            </Link>
            <Link
              href="/about"
              className="flex items-center gap-3 text-gray-700 hover:text-ocean-primary transition-colors p-2 rounded-lg hover:bg-ocean-primary/5"
              onClick={() => setMenuOpen(false)}
            >
              <Info className="w-5 h-5" /> 
              <span>About</span>
            </Link>
            <Link
              href="/contact"
              className="flex items-center gap-3 text-gray-700 hover:text-ocean-primary transition-colors p-2 rounded-lg hover:bg-ocean-primary/5"
              onClick={() => setMenuOpen(false)}
            >
              <Phone className="w-5 h-5" /> 
              <span>Contact</span>
            </Link>
            <div className="flex flex-col gap-3 pt-3 border-t border-ocean-primary/10">
              <Link
                href="/login"
                className="flex items-center justify-center gap-2 w-full px-4 py-3 rounded-lg text-ocean-primary border border-ocean-primary hover:bg-ocean-primary hover:text-white transition-all duration-200"
                onClick={() => setMenuOpen(false)}
              >
                <LogIn className="w-4 h-4" /> 
                <span>Sign In</span>
              </Link>
              <Link
                href="/signup"
                className="flex items-center justify-center gap-2 w-full px-4 py-3 rounded-lg ocean-gradient text-white hover:shadow-lg transition-all duration-200 shadow-md"
                onClick={() => setMenuOpen(false)}
              >
                <UserPlus className="w-4 h-4" /> 
                <span>Sign Up</span>
              </Link>
            </div>
          </motion.div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center text-center py-32 px-4 sm:px-6 ocean-gradient-light relative overflow-hidden">
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

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="relative z-10 max-w-4xl mx-auto"
        >
          {/* <motion.div variants={itemVariants} className="mb-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 backdrop-blur-sm border border-ocean-primary/20 text-black-500 text-sm font-medium mb-6">
              <Waves className="w-4 h-4" />
              <span>Welcome to Learnify</span>
            </div>
          </motion.div> */}

          <motion.h1
            variants={itemVariants}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight mt-15"
          >
            Welcome to{" "}
            <span className="bg-gradient-to-r from-ocean-primary via-ocean-secondary to-ocean-accent bg-clip-text text-ocean-primary">
              Learnify
            </span>
          </motion.h1>

          <motion.p
            variants={itemVariants}
            className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto mb-8 leading-relaxed"
          >
            Your comprehensive platform for students, tutors, guardians, and admins. 
            
          </motion.p>

          <motion.div
            variants={itemVariants}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <Link
              href="/login"
              className="group flex items-center gap-2 px-8 py-4 ocean-gradient text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            >
              <span className="font-semibold">Get Started</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="/about"
              className="group flex items-center gap-2 px-8 py-4 border-2 border-ocean-primary text-ocean-primary rounded-xl hover:bg-ocean-primary hover:text-white transition-all duration-300 transform hover:scale-105"
            >
              <span className="font-semibold">Learn More</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
        </motion.div>
      </section>

      {/* Roles Section */}
      <section className="py-20 px-4 sm:px-6 bg-white/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-gray-900">
              Choose Your Role
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Select your role and explore the tailored experience designed just for you.
            </p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {roles.map((role, i) => {
              const Icon = role.icon;
              return (
                <motion.div
                  key={role.name}
                  variants={itemVariants}
                  whileHover={{ y: -8, scale: 1.02 }}
                  className="group relative"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-ocean-primary/5 to-ocean-secondary/5 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-300" />
                  <div className="relative p-8 ocean-gradient-card rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-ocean-primary/10">
                    <div className="flex flex-col items-center text-center gap-4">
                      <div className={`p-4 rounded-full bg-gradient-to-br ${role.color} shadow-lg group-hover:shadow-xl transition-all duration-300`}>
                        <Icon className="w-8 h-8 text-white" />
                      </div>
                      <h3 className="text-xl font-bold text-gray-900">{role.name} Portal</h3>
                      <p className="text-gray-600 text-sm leading-relaxed">
                        {role.description}
                      </p>
                      <Link
                        href={role.link}
                        className="flex items-center gap-2 text-ocean-primary hover:text-ocean-secondary font-semibold transition-colors duration-200 group/link"
                      >
                        <span>Go to {role.name}</span>
                        <ArrowRight className="w-4 h-4 group-hover/link:translate-x-1 transition-transform" />
                      </Link>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>
    </div>
  );
}
