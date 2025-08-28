"use client";
import { motion } from "framer-motion";
import { GraduationCap, Heart, Sparkles } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-gradient-to-r from-ocean-primary/10 via-ocean-secondary/10 to-ocean-accent/10 border-t border-ocean-primary/20 py-8 mt-auto w-full overflow-x-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 place-items-center text-center w-full">
          {/* Left */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center gap-3 justify-center"
          >
            {/* <div className="flex items-center gap-2">
              <motion.div
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.6 }}
                className="p-1.5 rounded-lg ocean-gradient shadow-sm"
              >
                <GraduationCap className="w-4 h-4 text-white" />
              </motion.div>
              <span className="text-lg font-bold bg-gradient-to-r from-cyan-500 to-cyan-500 bg-clip-text text-transparent">
                Learnify
              </span>
            </div> */}
            <span className="text-gray-600">•</span>
            <span className="text-sm text-gray-600">
              © {new Date().getFullYear()} Abdullah Hassan. All rights reserved.
            </span>
          </motion.div>

          {/* Center */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.5 }}
            className="flex items-center gap-2 text-sm text-gray-600 justify-center"
          >
            <span>Made</span>
            {/* <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
            >
              <Heart className="w-4 h-4 text-red-500" />
            </motion.div> */}
            <span>using Next.js</span>
            <Sparkles className="w-4 h-4 text-ocean-accent" />
          </motion.div>

          {/* Right */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="flex items-center gap-4 text-sm justify-center"
          >
            <span className="text-gray-600">Tutoring Management Platform</span>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded-full bg-ocean-primary"></div>
              <div className="w-3 h-3 rounded-full bg-ocean-secondary"></div>
              <div className="w-3 h-3 rounded-full bg-ocean-accent"></div>
            </div>
          </motion.div>
        </div>
      </div>
    </footer>
  );
}
