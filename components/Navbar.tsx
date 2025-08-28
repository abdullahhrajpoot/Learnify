"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Menu, X, Home, Info, Phone, LogIn, UserPlus, GraduationCap, Users, BookOpen, Shield } from "lucide-react";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="fixed w-full bg-white/80 backdrop-blur-md shadow-sm z-50">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 text-2xl font-extrabold text-blue-600">
          <GraduationCap className="w-7 h-7 text-blue-600" />
          Learnify
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-8">
          <Link href="/" className="flex items-center gap-2 text-gray-700 hover:text-blue-600 transition">
            <Home className="w-5 h-5" /> Home
          </Link>
          <Link href="/about" className="flex items-center gap-2 text-gray-700 hover:text-blue-600 transition">
            <Info className="w-5 h-5" /> About
          </Link>
          <Link href="/contact" className="flex items-center gap-2 text-gray-700 hover:text-blue-600 transition">
            <Phone className="w-5 h-5" /> Contact
          </Link>
          <div className="flex items-center gap-4 ml-6">
            <Link
              href="/login"
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-blue-600 border border-blue-600 hover:bg-blue-50 transition"
            >
              <LogIn className="w-5 h-5" /> Sign In
            </Link>
            <Link
              href="/signup"
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition shadow"
            >
              <UserPlus className="w-5 h-5" /> Sign Up
            </Link>
          </div>
        </div>

        {/* Mobile Menu Toggle */}
        <button className="md:hidden text-gray-700" onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Dropdown */}
      {menuOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="md:hidden bg-white border-t shadow px-6 py-4 space-y-4"
        >
          <Link
            href="/"
            className="flex items-center gap-2 text-gray-700 hover:text-blue-600 transition"
            onClick={() => setMenuOpen(false)}
          >
            <Home className="w-5 h-5" /> Home
          </Link>
          <Link
            href="/about"
            className="flex items-center gap-2 text-gray-700 hover:text-blue-600 transition"
            onClick={() => setMenuOpen(false)}
          >
            <Info className="w-5 h-5" /> About
          </Link>
          <Link
            href="/contact"
            className="flex items-center gap-2 text-gray-700 hover:text-blue-600 transition"
            onClick={() => setMenuOpen(false)}
          >
            <Phone className="w-5 h-5" /> Contact
          </Link>
          <div className="flex flex-col gap-3 pt-2">
            <Link
              href="/login"
              className="flex items-center justify-center gap-2 w-full px-4 py-2 rounded-lg text-blue-600 border border-blue-600 hover:bg-blue-50 transition"
              onClick={() => setMenuOpen(false)}
            >
              <LogIn className="w-5 h-5" /> Sign In
            </Link>
            <Link
              href="/signup"
              className="flex items-center justify-center gap-2 w-full px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition shadow"
              onClick={() => setMenuOpen(false)}
            >
              <UserPlus className="w-5 h-5" /> Sign Up
            </Link>
          </div>
        </motion.div>
      )}
    </nav>
  );
}
