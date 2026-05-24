import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { HiHome, HiArrowLeft } from 'react-icons/hi'
import { useEffect, useState } from 'react'

export default function NotFound() {
  const [count, setCount] = useState(10)

  useEffect(() => {
    document.title = '404 — Page Not Found | CREAVIX WORLD'
    const t = setInterval(() => setCount(c => c - 1), 1000)
    return () => clearInterval(t)
  }, [])

  useEffect(() => {
    if (count === 0) window.location.href = '/'
  }, [count])

  return (
    <div className="min-h-screen bg-dark-900 flex items-center justify-center relative overflow-hidden px-4">
      {/* Cyber grid */}
      <div className="absolute inset-0 cyber-grid opacity-30" />

      {/* Glowing orbs */}
      <motion.div
        animate={{ scale: [1, 1.3, 1], opacity: [0.2, 0.5, 0.2] }}
        transition={{ duration: 6, repeat: Infinity }}
        className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(0,212,255,0.08) 0%, transparent 70%)' }}
      />
      <motion.div
        animate={{ scale: [1, 1.2, 1], opacity: [0.15, 0.4, 0.15] }}
        transition={{ duration: 8, repeat: Infinity, delay: 2 }}
        className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(157,78,221,0.1) 0%, transparent 70%)' }}
      />

      <div className="relative z-10 text-center max-w-2xl mx-auto">
        {/* 404 glitch text */}
        <motion.div
          initial={{ opacity: 0, y: -40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-6"
        >
          <div className="font-display font-black text-[120px] sm:text-[180px] leading-none select-none relative"
            style={{
              background: 'linear-gradient(135deg, #00d4ff, #9d4edd, #ff006e)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              filter: 'drop-shadow(0 0 30px rgba(0,212,255,0.3))',
            }}
          >
            404
          </div>
        </motion.div>

        {/* Corner decorations */}
        <div className="absolute top-0 left-0 w-16 h-16 border-l-2 border-t-2 border-neon-blue/40" />
        <div className="absolute top-0 right-0 w-16 h-16 border-r-2 border-t-2 border-neon-purple/40" />
        <div className="absolute bottom-0 left-0 w-16 h-16 border-l-2 border-b-2 border-neon-pink/40" />
        <div className="absolute bottom-0 right-0 w-16 h-16 border-r-2 border-b-2 border-neon-cyan/40" />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          <div className="inline-flex items-center gap-2 mb-4">
            <div className="w-2 h-2 rounded-full bg-neon-pink animate-pulse" />
            <span className="font-mono text-xs text-neon-pink tracking-widest uppercase">Page Not Found</span>
            <div className="w-2 h-2 rounded-full bg-neon-pink animate-pulse" />
          </div>

          <h2 className="font-display text-2xl sm:text-3xl font-bold text-white mb-4">
            Lost in the <span className="gradient-text-primary">Digital Void</span>
          </h2>

          <p className="font-body text-slate-400 mb-8 leading-relaxed">
            The page you're looking for doesn't exist or has been moved.
            <br />
            Redirecting to home in <span className="text-neon-blue font-bold">{count}s</span>...
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/" className="btn-glow flex items-center gap-2 group">
              <HiHome size={18} />
              Back to Home
            </Link>
            <button onClick={() => window.history.back()} className="btn-primary flex items-center gap-2">
              <HiArrowLeft size={18} />
              Go Back
            </button>
          </div>
        </motion.div>

        {/* Glitch lines */}
        <motion.div
          animate={{ opacity: [0, 1, 0], scaleX: [0, 1, 0] }}
          transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
          className="absolute top-1/2 left-0 right-0 h-px bg-neon-blue/30 pointer-events-none"
        />
      </div>
    </div>
  )
}