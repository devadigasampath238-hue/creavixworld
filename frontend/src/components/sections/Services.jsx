import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef } from 'react'
import {
  RiLayout2Line,
  RiPenNibLine,
  RiBrushLine,
  RiBuildingLine,
  RiGlobalLine,
  RiShoppingCart2Line,
  RiDashboardLine,
  RiCodeBoxLine
} from 'react-icons/ri'

const services = [
  { icon: RiLayout2Line, title: 'Web Design', desc: 'Stunning, conversion-optimized websites that captivate and convert your audience.', color: 'neon-blue', glow: '#00d4ff' },
  { icon: RiPenNibLine, title: 'UI/UX Design', desc: 'Intuitive interfaces crafted for seamless user journeys and maximum engagement.', color: 'neon-cyan', glow: '#00fff5' },
  { icon: RiBrushLine, title: 'Branding', desc: 'Powerful brand identities that resonate, differentiate, and leave lasting impressions.', color: 'neon-purple', glow: '#9d4edd' },
  { icon: RiBuildingLine, title: 'Business Websites', desc: 'Professional corporate sites that establish credibility and drive growth.', color: 'neon-pink', glow: '#ff006e' },
  { icon: RiGlobalLine, title: 'Portfolio Websites', desc: 'Showcase your work with stunning presentation sites that win clients.', color: 'neon-blue', glow: '#00d4ff' },
  { icon: RiShoppingCart2Line, title: 'E-commerce', desc: 'Full-featured online stores that deliver exceptional shopping experiences.', color: 'neon-cyan', glow: '#00fff5' },
  { icon: RiDashboardLine, title: 'Admin Dashboards', desc: 'Powerful management interfaces with real-time data visualization and control.', color: 'neon-purple', glow: '#9d4edd' },
  { icon: RiCodeBoxLine, title: 'Custom Web Apps', desc: 'Bespoke web applications built to solve your unique business challenges.', color: 'neon-pink', glow: '#ff006e' },
]

const cardVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0 }
}

export default function Services() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <section id="services" className="py-32 relative" ref={ref}>
      <div className="absolute inset-0 cyber-grid opacity-5" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-20"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <span className="text-neon-cyan text-sm font-mono tracking-widest uppercase mb-4 block">
            — What We Do —
          </span>
          <h2 className="text-4xl md:text-6xl font-black mb-6">
            <span className="gradient-text">Our Services</span>
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            We craft digital experiences that push boundaries and deliver results beyond expectations.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service, index) => (
            <motion.div
              key={index}
              variants={cardVariants}
              initial="hidden"
              animate={isInView ? 'visible' : 'hidden'}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ y: -10, scale: 1.02 }}
              className="glass-card p-6 rounded-2xl group cursor-pointer relative overflow-hidden"
            >
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-500 rounded-2xl"
                style={{ background: `radial-gradient(circle at center, ${service.glow}, transparent)` }}
              />
              <div
                className="w-14 h-14 rounded-xl flex items-center justify-center mb-4 relative"
                style={{ background: `${service.glow}20`, border: `1px solid ${service.glow}40` }}
              >
                <service.icon
                  className="text-2xl"
                  style={{ color: service.glow }}
                />
              </div>
              <h3 className="text-white font-bold text-lg mb-2 group-hover:text-neon-cyan transition-colors">
                {service.title}
              </h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                {service.desc}
              </p>
              <div
                className="mt-4 h-px w-0 group-hover:w-full transition-all duration-500"
                style={{ background: `linear-gradient(to right, ${service.glow}, transparent)` }}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}