import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { HiCheck, HiArrowRight } from 'react-icons/hi'
import { Link } from 'react-router-dom'

const plans = [
  {
    name: 'Starter',
    price: '$499',
    period: 'one-time',
    desc: 'Perfect for small businesses and personal brands getting started online.',
    color: '#00d4ff',
    gradient: 'from-neon-blue/10 to-transparent',
    features: [
      '5-Page Website',
      'Responsive Design',
      'Basic SEO Setup',
      'Contact Form',
      '2 Revision Rounds',
      '30-Day Support',
      'Fast Delivery (7 days)',
    ],
    featured: false,
  },
  {
    name: 'Business',
    price: '$1,299',
    period: 'one-time',
    desc: 'For growing businesses that need a powerful online presence with advanced features.',
    color: '#9d4edd',
    gradient: 'from-neon-purple/10 to-transparent',
    features: [
      '10-Page Website',
      'Custom UI/UX Design',
      'Advanced SEO',
      'CMS Integration',
      'E-commerce Ready',
      'Admin Dashboard',
      '5 Revision Rounds',
      '90-Day Support',
      'Fast Delivery (14 days)',
    ],
    featured: true,
  },
  {
    name: 'Premium',
    price: '$2,999',
    period: 'one-time',
    desc: 'Enterprise-grade solution for businesses demanding the absolute best.',
    color: '#ff006e',
    gradient: 'from-neon-pink/10 to-transparent',
    features: [
      'Unlimited Pages',
      'Custom Web Application',
      'Full-Stack Development',
      'Database Integration',
      'JWT Authentication',
      'Admin Panel',
      'API Development',
      'Unlimited Revisions',
      '6-Month Support',
      'Priority Delivery',
    ],
    featured: false,
  },
]

export default function Pricing() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true })

  return (
    <section id="pricing" className="relative py-24 lg:py-32">
      <div className="absolute inset-0 opacity-20"
        style={{ background: 'radial-gradient(ellipse 60% 50% at 20% 50%, rgba(0,212,255,0.1) 0%, transparent 70%)' }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16" ref={ref}>
          <motion.div
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            className="inline-flex items-center gap-3 mb-4"
          >
            <div className="w-6 h-px bg-neon-cyan" />
            <span className="font-mono text-xs text-neon-cyan tracking-widest uppercase">Investment</span>
            <div className="w-6 h-px bg-neon-cyan" />
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.1 }}
            className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4"
          >
            Simple <span className="gradient-text-primary">Pricing</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ delay: 0.2 }}
            className="font-body text-slate-400 max-w-xl mx-auto"
          >
            Transparent pricing with no hidden fees. Choose the package that fits your vision.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {plans.map((plan, i) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 50 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.15 + i * 0.12, duration: 0.7 }}
              className={`pricing-card relative p-8 ${plan.featured ? 'lg:-mt-4 lg:mb-[-16px]' : ''}`}
              style={{
                border: `1px solid ${plan.color}${plan.featured ? '60' : '20'}`,
                boxShadow: plan.featured ? `0 0 40px ${plan.color}20, 0 0 80px ${plan.color}10` : 'none',
              }}
            >
              {plan.featured && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <span className="font-mono text-xs font-bold px-4 py-1.5 rounded-full"
                    style={{ background: plan.color, color: '#000' }}>
                    MOST POPULAR
                  </span>
                </div>
              )}

              {/* Header */}
              <div className="mb-6">
                <span className="font-mono text-xs tracking-widest uppercase mb-3 block" style={{ color: plan.color }}>
                  {plan.name} Package
                </span>
                <div className="flex items-end gap-2 mb-3">
                  <span className="font-display text-4xl font-black text-white">{plan.price}</span>
                  <span className="font-body text-sm text-slate-500 mb-1">{plan.period}</span>
                </div>
                <p className="font-body text-sm text-slate-400 leading-relaxed">{plan.desc}</p>
              </div>

              {/* Divider */}
              <div className="h-px mb-6" style={{ background: `linear-gradient(90deg, ${plan.color}40, transparent)` }} />

              {/* Features */}
              <ul className="space-y-3 mb-8">
                {plan.features.map(feat => (
                  <li key={feat} className="flex items-center gap-3 font-body text-sm text-slate-300">
                    <div className="w-5 h-5 rounded flex items-center justify-center flex-shrink-0"
                      style={{ background: `${plan.color}15`, border: `1px solid ${plan.color}30` }}>
                      <HiCheck size={12} style={{ color: plan.color }} />
                    </div>
                    {feat}
                  </li>
                ))}
              </ul>

              {/* CTA */}
              <Link
                to="/signup"
                className="flex items-center justify-center gap-2 w-full py-3 rounded font-display text-xs font-semibold tracking-widest uppercase transition-all duration-300"
                style={plan.featured ? {
                  background: `linear-gradient(135deg, ${plan.color}, #7b2fff)`,
                  color: '#000',
                  boxShadow: `0 0 20px ${plan.color}40`,
                } : {
                  border: `1px solid ${plan.color}50`,
                  color: plan.color,
                  background: `${plan.color}08`,
                }}
                onMouseEnter={e => {
                  if (!plan.featured) e.currentTarget.style.boxShadow = `0 0 20px ${plan.color}30`
                }}
                onMouseLeave={e => {
                  if (!plan.featured) e.currentTarget.style.boxShadow = 'none'
                }}
              >
                Get Started
                <HiArrowRight size={14} />
              </Link>
            </motion.div>
          ))}
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.6 }}
          className="text-center font-body text-xs text-slate-500 mt-8"
        >
          Need a custom solution?{' '}
          <a href="#contact" className="text-neon-blue hover:underline">Contact us</a> for a tailored quote.
        </motion.p>
      </div>
    </section>
  )
}
