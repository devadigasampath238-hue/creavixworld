import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { HiArrowUp } from 'react-icons/hi'

export default function ScrollToTop() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 400)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const scrollUp = () => window.scrollTo({ top: 0, behavior: 'smooth' })

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          initial={{ opacity: 0, scale: 0.5, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.5, y: 20 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={scrollUp}
          className="fixed bottom-24 right-6 z-40 w-11 h-11 rounded-full flex items-center justify-center shadow-lg"
          style={{
            background: 'linear-gradient(135deg, rgba(0,212,255,0.15), rgba(157,78,221,0.15))',
            border: '1px solid rgba(0,212,255,0.4)',
            boxShadow: '0 0 20px rgba(0,212,255,0.2)',
          }}
          aria-label="Scroll to top"
        >
          <HiArrowUp size={18} className="text-neon-blue" />
        </motion.button>
      )}
    </AnimatePresence>
  )
}