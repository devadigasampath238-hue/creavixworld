import { useEffect, useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'

const stats = [
  { label: 'Projects Completed', value: 50, suffix: '+', color: '#00d4ff' },
  { label: 'Happy Clients', value: 40, suffix: '+', color: '#9d4edd' },
  { label: 'Countries Served', value: 8, suffix: '+', color: '#ff006e' },
  { label: 'Years Experience', value: 3, suffix: '+', color: '#22c55e' },
]

function Counter({ value, suffix, color }) {
  const [count, setCount] = useState(0)
  const ref = useRef(null)
  const inView = useInView(ref, { once: true })

  useEffect(() => {
    if (!inView) return
    const duration = 2000
    const steps = 60
    const increment = value / steps
    let current = 0
    const timer = setInterval(() => {
      current += increment
      if (current >= value) {
        setCount(value)
        clearInterval(timer)
      } else {
        setCount(Math.floor(current))
      }
    }, duration / steps)
    return () => clearInterval(timer)
  }, [inView, value])

  return (
    <span ref={ref} style={{ color, fontFamily: 'Orbitron, monospace' }}>
      {count}{suffix}
    </span>
  )
}

export default function TrustSection() {
  return (
    <section className="py-24 px-4 bg-[#030508]">
      <div className="max-w-5xl mx-auto">

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <p className="text-[#00d4ff] font-mono text-sm tracking-widest mb-4">BY THE NUMBERS</p>
          <h2 className="text-4xl md:text-5xl font-black text-white" style={{ fontFamily: 'Orbitron, monospace' }}>
            Trusted Worldwide
          </h2>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="p-8 rounded-2xl text-center"
              style={{
                background: `linear-gradient(135deg, ${stat.color}10, transparent)`,
                border: `1px solid ${stat.color}20`,
              }}
            >
              <p className="text-5xl font-black mb-2">
                <Counter value={stat.value} suffix={stat.suffix} color={stat.color} />
              </p>
              <p className="text-slate-400 text-sm font-mono">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}