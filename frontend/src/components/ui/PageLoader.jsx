import { motion, AnimatePresence } from 'framer-motion'

export default function PageLoader({ show }) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="fixed inset-0 z-[99999] flex items-center justify-center bg-dark-900"
        >
          {/* Cyber grid bg */}
          <div className="absolute inset-0 cyber-grid opacity-40" />

          <div className="relative z-10 text-center">
            {/* Logo */}
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="mb-8"
            >
              <div className="w-20 h-20 rounded-xl border border-neon-blue/50 flex items-center justify-center mx-auto mb-4 bg-dark-800/80"
                style={{ boxShadow: '0 0 40px rgba(0,212,255,0.2)' }}>
                <span className="font-display text-2xl font-black text-neon-blue">CX</span>
              </div>
              <div className="font-display text-lg font-black tracking-widest text-white">
                CREAVIX<span className="text-neon-blue">.</span>WORLD
              </div>
            </motion.div>

            {/* Progress bar */}
            <div className="w-48 h-px bg-dark-600 rounded-full overflow-hidden mx-auto">
              <motion.div
                initial={{ width: '0%' }}
                animate={{ width: '100%' }}
                transition={{ duration: 1.2, ease: 'easeInOut' }}
                className="h-full bg-gradient-to-r from-neon-blue via-neon-purple to-neon-pink"
              />
            </div>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="font-mono text-xs text-neon-blue/50 tracking-[0.4em] uppercase mt-4"
            >
              Loading...
            </motion.p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
