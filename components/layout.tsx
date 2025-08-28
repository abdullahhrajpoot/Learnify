"use client";

import { ReactNode } from "react";
import Link from "next/link";
import { Home, Info, Phone, LogIn, UserPlus, BookOpen } from "lucide-react";

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Navbar */}
      <nav className="w-full bg-white shadow-md">
        <div className="max-w-6xl mx-auto flex justify-between items-center px-6 py-4">
          <Link href="/" className="flex items-center gap-2 text-blue-600 font-bold text-xl">
            <BookOpen className="w-6 h-6" />
            Learnify
          </Link>

          <div className="flex gap-6 items-center">
            <Link href="/" className="flex items-center gap-1 hover:text-blue-600 transition">
              <Home className="w-4 h-4" /> Home
            </Link>
            <Link href="/about" className="flex items-center gap-1 hover:text-blue-600 transition">
              <Info className="w-4 h-4" /> About
            </Link>
            <Link href="/contact" className="flex items-center gap-1 hover:text-blue-600 transition">
              <Phone className="w-4 h-4" /> Contact
            </Link>

            <Link href="/signup" className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 transition">
              Sign Up
            </Link>
            <Link href="/login" className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-100 transition">
              Log In
            </Link>
          </div>
        </div>
      </nav>

      {/* Page Content */}
      <main className="flex-1">{children}</main>
    </div>
  );
}
