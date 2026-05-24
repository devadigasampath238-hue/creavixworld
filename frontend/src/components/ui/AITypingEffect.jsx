import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const PHRASES = [
  'AI Websites',
  'Smart Applications',
  'AI Chatbots',
  'Automation Systems',
  'Modern Web Experiences',
  'Intelligent Products',
  'AI Dashboards',
  'Voice Assistants',
]

export default function AITypingEffect() {
  const [index, setIndex] = useState(0)
  const [displayed, setDisplayed] = useState('')
  const [deleting, setDeleting] = useState(false)
  const [pause, setPause] = useState(false)

  useEffect(() => {
    if (pause) {
      const t = setTimeout(() => setPause(false), 1500)
      return () => clearTimeout(t)
    }

    const current = PHRASES[index]

    if (!deleting && displayed === current) {
      setPause(true)
      setTimeout(() => setDeleting(true), 1500)
      return
    }

    if (deleting && displayed === '') {
      setDeleting(false)
      setIndex(i => (i + 1) % PHRASES.length)
      return
    }

    const speed = deleting ? 40 : 80
    const t = setTimeout(() => {
      setDisplayed(prev =>
        deleting ? prev.slice(0, -1) : current.slice(0, prev.length + 1)
      )
    }, speed)

    return () => clearTimeout(t)
  }, [displayed, deleting, index, pause])

  return (
    <div className="flex items-center gap-3 flex-wrap justify-center lg:justify-start">
      <span className="font-display text-sm sm:text-base text-slate-400 tracking-widest uppercase">We build:</span>
      <div className="relative">
        <span className="font-display text-sm sm:text-base font-bold" style={{
          background: 'linear-gradient(135deg, #00d4ff, #9d4edd)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          minWidth: '200px',
          display: 'inline-block',
        }}>
          {displayed}
        </span>
        {/* Blinking cursor */}
        <motion.span
          animate={{ opacity: [1, 0, 1] }}
          transition={{ duration: 0.8, repeat: Infinity }}
          className="inline-block w-0.5 h-4 sm:h-5 bg-neon-blue ml-0.5 align-middle"
        />
      </div>
    </div>
  )
}
