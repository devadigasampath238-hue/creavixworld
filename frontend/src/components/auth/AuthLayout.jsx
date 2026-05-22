import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'

export default function AuthLayout({ children, title, subtitle }) {
  return (
    <div className="min-h-screen bg-dark-900 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 cyber-grid opacity-40" />
      <div className="absolute inset-0" style={{
        background: 'radial-gradient(ellipse 60% 60% at 50% 40%, rgba(0,212,255,0.06) 0%, rgba(157,78,221,0.04) 50%, transparent 70%)'
      }} />

      {/* Corner brackets */}
      <div className="absolute top-6 left-6 w-12 h-12 border-l-2 border-t-2 border-neon-blue/30" />
      <div className="absolute top-6 right-6 w-12 h-12 border-r-2 border-t-2 border-neon-purple/30" />
      <div className="absolute bottom-6 left-6 w-12 h-12 border-l-2 border-b-2 border-neon-pink/30" />
      <div className="absolute bottom-6 right-6 w-12 h-12 border-r-2 border-b-2 border-neon-cyan/30" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 w-full max-w-md"
      >
        {/* Logo — sits above the card, completely separate */}
        <div className="text-center mb-6">
          <Link to="/" className="inline-flex items-center justify-center gap-3 group">
            <div className="w-11 h-11 rounded-lg border border-neon-blue/50 flex items-center justify-center bg-dark-800 group-hover:shadow-neon-blue transition-all flex-shrink-0">
              <span className="font-display text-sm font-bold text-neon-blue">CX</span>
            </div>
            <span className="font-display text-lg font-bold tracking-widest text-white">
              CREAVIX<span className="text-neon-blue">.</span>WORLD
            </span>
          </Link>
        </div>

        {/* Card — title and form inside */}
        <div className="glass rounded-2xl p-8" style={{ border: '1px solid rgba(0,212,255,0.15)' }}>
          {/* Title inside card, separated from logo */}
          <div className="text-center mb-7">
            <div className="w-16 h-px bg-gradient-to-r from-transparent via-neon-blue to-transparent mx-auto mb-5" />
            <h1 className="font-display text-xl font-bold text-white mb-2">{title}</h1>
            {subtitle && (
              <p className="font-body text-sm text-slate-400 leading-relaxed">{subtitle}</p>
            )}
          </div>
          {children}
        </div>

        {/* Back to home link */}
        <div className="text-center mt-5">
          <Link to="/" className="font-body text-xs text-slate-600 hover:text-neon-blue transition-colors tracking-wide">
            ← Back to Homepage
          </Link>
        </div>
      </motion.div>
    </div>
  )
}