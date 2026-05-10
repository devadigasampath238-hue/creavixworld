import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { FaStar, FaQuoteLeft } from 'react-icons/fa'

const testimonials = [
  {
    name: 'Sarah Chen',
    role: 'CEO, TechVentures Inc.',
    text: 'CREAVIX WORLD completely transformed our online presence. The website they built exceeded every expectation. Pure artistry combined with flawless functionality.',
    rating: 5,
    avatar: 'SC',
    color: '#00d4ff',
  },
  {
    name: 'Marcus Williams',
    role: 'Founder, NexaStartup',
    text: 'Working with this team was an absolute game-changer. The attention to detail, the cinematic animations, and the overall execution was world-class. Highly recommend.',
    rating: 5,
    avatar: 'MW',
    color: '#9d4edd',
  },
  {
    name: 'Priya Sharma',
    role: 'Creative Director, StudioX',
    text: 'My portfolio website is now a magnet for clients. CREAVIX delivered a stunning, unique design that perfectly represents my brand. Revenue doubled since launch.',
    rating: 5,
    avatar: 'PS',
    color: '#ff006e',
  },
]

export default function Testimonials() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true })

  return (
    <section className="relative py-24 lg:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16" ref={ref}>
          <motion.div
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            className="inline-flex items-center gap-3 mb-4"
          >
            <div className="w-6 h-px bg-neon-pink" />
            <span className="font-mono text-xs text-neon-pink tracking-widest uppercase">Testimonials</span>
            <div className="w-6 h-px bg-neon-pink" />
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.1 }}
            className="font-display text-3xl sm:text-4xl font-bold text-white"
          >
            Client <span className="gradient-text-fire">Stories</span>
          </motion.h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 40 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.15 + i * 0.12 }}
              className="glass rounded-xl p-6 group hover:-translate-y-2 transition-all duration-400"
              style={{ borderColor: `${t.color}20` }}
            >
              <FaQuoteLeft className="mb-4 opacity-30" style={{ color: t.color }} size={20} />
              <p className="font-body text-sm text-slate-300 leading-relaxed mb-6">{t.text}</p>
              <div className="flex items-center gap-1 mb-4">
                {[...Array(t.rating)].map((_, j) => (
                  <FaStar key={j} size={12} style={{ color: t.color }} />
                ))}
              </div>
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center font-display text-xs font-bold"
                  style={{ background: `${t.color}20`, border: `1px solid ${t.color}40`, color: t.color }}
                >
                  {t.avatar}
                </div>
                <div>
                  <div className="font-body text-sm font-semibold text-white">{t.name}</div>
                  <div className="font-body text-xs text-slate-500">{t.role}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
