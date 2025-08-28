"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { motion } from "framer-motion";
import {
  BookOpen,
  GraduationCap,
  CalendarCheck,
  DollarSign,
  Wallet,
  Home,
  LogOut,
  Menu,
  X,
  Sparkles,
  Users
} from "lucide-react";
import { useState } from "react";

export default function TutorNav() {
  const router = useRouter();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push("/");
  }

  const items = [
    { href: "/tutor/dashboard", label: "Dashboard", Icon: Home, color: "text-ocean-primary" },
    { href: "/tutor/students", label: "Students", Icon: GraduationCap, color: "text-ocean-secondary" },
    { href: "/tutor/sessions", label: "Sessions", Icon: CalendarCheck, color: "text-ocean-accent" },
    { href: "/tutor/assignments", label: "Assignments", Icon: BookOpen, color: "text-purple-600" },
    { href: "/tutor/expenses", label: "Expenses", Icon: Wallet, color: "text-emerald-600" },
    { href: "/", label: "Site", Icon: Users, color: "text-gray-600" },
  ];

  const isActive = (href: string) => pathname === href;

  return (
    <nav className="w-full">
      {/* Desktop Navigation */}
      <div className="hidden md:flex items-center justify-between w-full px-6 py-4 bg-white/80 backdrop-blur-md rounded-xl shadow-sm border border-ocean-primary/10">
        {/* Logo and Brand */}
        <div className="flex items-center gap-3">
          <motion.div
            whileHover={{ rotate: 360 }}
            transition={{ duration: 0.6 }}
            className="p-2 rounded-lg ocean-gradient shadow-md"
          >
            <BookOpen className="w-6 h-6 text-white" />
          </motion.div>
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold bg-gradient-to-r from-green-500 to-green-800 bg-clip-text text-transparent">
              Tutor Portal
            </span>
            <Sparkles className="w-4 h-4 text-ocean-accent" />
          </div>
        </div>

        {/* Navigation Links */}
        <div className="flex items-center gap-1">
          {items.map((item) => {
            const Icon = item.Icon;
            const active = isActive(item.href);
            return (
              <motion.div
                key={item.href}
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.98 }}
                className="relative"
              >
                <Link
                  href={item.href}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 group ${
                    active
                      ? 'bg-ocean-primary text-white shadow-md'
                      : 'text-gray-700 hover:text-ocean-primary hover:bg-ocean-primary/5'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${active ? 'text-white' : item.color}`} />
                  <span className="font-medium">{item.label}</span>
                  {active && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute inset-0 bg-ocean-primary rounded-lg -z-10"
                      initial={false}
                      transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    />
                  )}
                </Link>
              </motion.div>
            );
          })}
        </div>

        {/* Logout Button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleLogout}
          className="flex items-center gap-2 px-4 py-2 text-red-600 border border-red-200 rounded-lg hover:bg-red-50 hover:border-red-300 transition-all duration-200"
        >
          <LogOut className="w-4 h-4" />
          <span className="font-medium">Logout</span>
        </motion.button>
      </div>

      {/* Mobile Navigation */}
      <div className="md:hidden">
        {/* Mobile Header */}
        <div className="flex items-center justify-between px-4 py-3 bg-white/90 backdrop-blur-md rounded-lg shadow-sm border border-ocean-primary/10">
          <div className="flex items-center gap-2">
            <motion.div
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.6 }}
              className="p-1.5 rounded-lg ocean-gradient shadow-sm"
            >
              <BookOpen className="w-5 h-5 text-white" />
            </motion.div>
            <span className="text-base font-bold bg-gradient-to-r from-ocean-primary to-ocean-secondary bg-clip-text text-transparent">
              Tutor
            </span>
          </div>

          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-gray-600 hover:text-ocean-primary transition-colors"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </motion.button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mt-2 bg-white/95 backdrop-blur-md rounded-lg shadow-lg border border-ocean-primary/10 overflow-hidden"
          >
            <div className="p-2 space-y-1">
              {items.map((item) => {
                const Icon = item.Icon;
                const active = isActive(item.href);
                return (
                  <motion.div
                    key={item.href}
                    whileHover={{ x: 4 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Link
                      href={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                        active
                          ? 'bg-ocean-primary text-white shadow-sm'
                          : 'text-gray-700 hover:text-ocean-primary hover:bg-ocean-primary/5'
                      }`}
                    >
                      <Icon className={`w-4 h-4 ${active ? 'text-white' : item.color}`} />
                      <span className="font-medium">{item.label}</span>
                      {active && (
                        <motion.div
                          layoutId="mobileActiveTab"
                          className="absolute left-0 top-0 bottom-0 w-1 bg-white rounded-r"
                          initial={false}
                          transition={{ type: "spring", stiffness: 500, damping: 30 }}
                        />
                      )}
                    </Link>
                  </motion.div>
                );
              })}
            </div>

            {/* Mobile Logout */}
            <div className="border-t border-ocean-primary/10 p-2">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  handleLogout();
                  setMobileMenuOpen(false);
                }}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 text-red-600 border border-red-200 rounded-lg hover:bg-red-50 hover:border-red-300 transition-all duration-200"
              >
                <LogOut className="w-4 h-4" />
                <span className="font-medium">Logout</span>
              </motion.button>
            </div>
          </motion.div>
        )}
      </div>
    </nav>
  );
}
