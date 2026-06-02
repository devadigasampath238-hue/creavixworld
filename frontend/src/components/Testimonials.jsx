import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { HiStar } from 'react-icons/hi'

const testimonials = [
  {
    name: 'Rahul Sharma',
    role: 'CEO, TechStart India',
    avatar: 'RS',
    rating: 5,
    text: 'CREAVIX WORLD transformed our digital presence completely. Our conversion rate increased by 40% within the first month. The cyberpunk aesthetic perfectly matched our brand vision.',
    color: '#00d4ff',
  },
  {
    name: 'Priya Nair',
    role: 'Founder, StyleCraft',
    avatar: 'PN',
    rating: 5,
    text: 'Absolutely blown away by the quality. They delivered a stunning e-commerce platform that felt like something from the future. Sales doubled in 60 days.',
    color: '#9d4edd',
  },
  {
    name: 'Arjun Patel',
    role: 'CTO, DataFlow Systems',
    avatar: 'AP',
    rating: 5,
    text: 'The team at CREAVIX WORLD is exceptional. They built our SaaS dashboard with incredible attention to detail. Best investment we made this year.',
    color: '#ff006e',
  },
  {
    name: 'Sneha Reddy',
    role: 'Marketing Director, GrowthLabs',
    avatar: 'SR',
    rating: 5,
    text: 'From concept to launch in just 6 weeks. The AI chat assistant they integrated has handled 70% of our customer queries automatically. Phenomenal work.',
    color: '#22c55e',
  },
  {
    name: 'Vikram Singh',
    role: 'Founder, NexaFintech',
    avatar: 'VS',
    rating: 5,
    text: 'Working with CREAVIX WORLD was a game changer. Our app has been featured in 3 publications since launch. The quality speaks for itself.',
    color: '#f59e0b',
  },
]

export default function Testimonials() {
  const [current, setCurrent] = useState(0)
  const [auto, setAuto] = useState(true)

  useEffect(() => {
    if (!auto) return
    const timer = setInterval(() => {
      setCurrent(prev => (prev + 1) % testimonials.length)
    }, 4000)
    return () => clearInterval(timer)
  }, [auto])

  return (
    <section className="py-24 px-4 bg-[#030508] overflow-hidden">
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <p className="text-[#00d4ff] font-mono text-sm tracking-widest mb-4">CLIENT TESTIMONIALS</p>
          <h2 className="text-4xl md:text-5xl font-black text-white" style={{ fontFamily: 'Orbitron, monospace' }}>
            What Clients Say
          </h2>
        </motion.div>

        {/* Main Testimonial */}
        <div
          className="relative"
          onMouseEnter={() => setAuto(false)}
          onMouseLeave={() => setAuto(true)}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={current}
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -30, scale: 0.95 }}
              transition={{ duration: 0.4 }}
              className="bg-white/5 border border-white/10 rounded-3xl p-8 md:p-12 text-center mb-8"
            >
              {/* Stars */}
              <div className="flex justify-center gap-1 mb-6">
                {Array(testimonials[current].rating).fill(0).map((_, i) => (
                  <HiStar key={i} className="text-[#f59e0b]" size={20} />
                ))}
              </div>

              {/* Quote */}
              <p className="text-white text-lg md:text-xl leading-relaxed mb-8 max-w-3xl mx-auto">
                "{testimonials[current].text}"
              </p>

              {/* Author */}
              <div className="flex items-center justify-center gap-4">
                <div
                  className="w-14 h-14 rounded-full flex items-center justify-center text-black font-black text-lg"
                  style={{ background: `linear-gradient(135deg, ${testimonials[current].color}, #030508)` }}
                >
                  {testimonials[current].avatar}
                </div>
                <div className="text-left">
                  <p className="text-white font-bold">{testimonials[current].name}</p>
                  <p className="text-slate-400 text-sm">{testimonials[current].role}</p>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Dots */}
          <div className="flex justify-center gap-2">
            {testimonials.map((_, i) => (
              <button
                key={i}
                onClick={() => { setCurrent(i); setAuto(false) }}
                className={`rounded-full transition-all duration-300 ${
                  i === current ? 'w-8 h-2 bg-[#00d4ff]' : 'w-2 h-2 bg-white/20 hover:bg-white/40'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Mini Cards */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mt-12">
          {testimonials.map((t, i) => (
            <motion.button
              key={i}
              onClick={() => { setCurrent(i); setAuto(false) }}
              whileHover={{ scale: 1.05 }}
              className={`p-3 rounded-xl border text-center transition-all ${
                i === current
                  ? 'border-[#00d4ff]/50 bg-[#00d4ff]/10'
                  : 'border-white/10 bg-white/5 hover:border-white/20'
              }`}
            >
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-black mx-auto mb-1"
                style={{ background: `linear-gradient(135deg, ${t.color}40, transparent)`, border: `1px solid ${t.color}40` }}
              >
                {t.avatar}
              </div>
              <p className="text-white text-xs font-medium truncate">{t.name.split(' ')[0]}</p>
            </motion.button>
          ))}
        </div>
      </div>
    </section>
  )
}