"use client"

import { motion } from "framer-motion"

export default function Loader() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <motion.div
        className="flex flex-col items-center space-y-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        {/* Spinning Circle */}
        <motion.div
          className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"
        />
        
        {/* Pulse Bars */}
        <div className="flex gap-2">
          {[1, 2, 3].map((i) => (
            <motion.div
              key={i}
              className="w-3 h-6 bg-purple-500 rounded"
              animate={{ scaleY: [1, 1.5, 1] }}
              transition={{ repeat: Infinity, duration: 0.6, delay: i * 0.2 }}
            />
          ))}
        </div>

        <p className="text-gray-600 font-semibold tracking-wide">
          Loading, please wait...
        </p>
      </motion.div>
    </div>
  )
}
