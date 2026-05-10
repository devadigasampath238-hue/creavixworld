import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'

export default function AuthLayout({ children, title, subtitle }) {
  return (
    <div className="min-h-screen bg-dark-900 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 cyber-grid opacity-40" />
      <div className="absolute inset-0"
        style={{ background: 'radial-gradient(ellipse 60% 60% at 50% 40%, rgba(0,212,255,0.06) 0%, rgba(157,78,221,0.04) 50%, transparent 70%)' }}
      />

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
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-3 group mb-4">
            <div className="w-10 h-10 rounded border border-neon-blue/50 flex items-center justify-center bg-dark-800 group-hover:shadow-neon-blue transition-all">
              <span className="font-display text-xs font-bold text-neon-blue">CX</span>
            </div>
            <span className="font-display text-base font-bold tracking-widest text-white">
              CREAVIX<span className="text-neon-blue">.</span>WORLD
            </span>
          </Link>
          <h1 className="font-display text-2xl font-bold text-white mt-2">{title}</h1>
          {subtitle && <p className="font-body text-sm text-slate-400 mt-2">{subtitle}</p>}
        </div>

        {/* Card */}
        <div className="glass rounded-2xl p-8" style={{ border: '1px solid rgba(0,212,255,0.15)' }}>
          {children}
        </div>
      </motion.div>
    </div>
  )
}
