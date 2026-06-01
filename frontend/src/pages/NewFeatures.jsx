import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'
import {
  RiNotification3Line, RiSearchLine, RiMoonLine, RiSunLine,
  RiShareLine, RiBookmarkLine, RiTimerLine, RiBarChart2Line,
  RiTeamLine, RiSecurePaymentLine, RiGlobalLine, RiCodeBoxLine,
  RiCheckLine, RiArrowRightLine, RiSparklingLine
} from 'react-icons/ri'

// ── 1. Dark/Light Mode Toggle Demo ──────────────────────────────────────────
function ThemeToggleDemo() {
  const [dark, setDark] = useState(true)
  return (
    <div className="p-5 rounded-xl space-y-4" style={{
      background: dark ? 'rgba(6,10,20,0.9)' : 'rgba(240,248,255,0.95)',
      border: `1px solid ${dark ? 'rgba(0,212,255,0.2)' : 'rgba(0,100,200,0.2)'}`,
      transition: 'all 0.4s ease'
    }}>
      <div className="flex items-center justify-between">
        <span className="font-display text-xs font-bold" style={{ color: dark ? '#00d4ff' : '#0066cc' }}>
          THEME PREVIEW
        </span>
        <button onClick={() => setDark(!dark)}
          className="w-12 h-6 rounded-full flex items-center px-1 transition-all duration-300 relative"
          style={{ background: dark ? 'rgba(0,212,255,0.3)' : 'rgba(0,100,200,0.3)' }}>
          <motion.div animate={{ x: dark ? 0 : 24 }}
            className="w-4 h-4 rounded-full flex items-center justify-center"
            style={{ background: dark ? '#00d4ff' : '#0066cc' }}>
            {dark ? <RiMoonLine size={10} className="text-dark-900" /> : <RiSunLine size={10} className="text-white" />}
          </motion.div>
        </button>
      </div>
      <p className="font-body text-xs" style={{ color: dark ? '#94a3b8' : '#334155' }}>
        Toggle between dark cyberpunk and clean light mode.
      </p>
    </div>
  )
}

// ── 2. Live Search Demo ──────────────────────────────────────────────────────
function SearchDemo() {
  const [query, setQuery] = useState('')
  const items = ['Web Design', 'UI/UX Design', 'AI Chatbot', 'E-commerce', 'Dashboard', 'Branding', 'Mobile App', 'SEO Optimization']
  const filtered = query ? items.filter(i => i.toLowerCase().includes(query.toLowerCase())) : []

  return (
    <div className="space-y-3">
      <div className="relative">
        <RiSearchLine className="absolute left-4 top-1/2 -translate-y-1/2 text-neon-blue/60 z-10" size={16} />
        <input value={query} onChange={e => setQuery(e.target.value)}
          placeholder="Search services..."
          className="cyber-input pl-11 text-sm" />
      </div>
      <AnimatePresence>
        {filtered.length > 0 && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className="rounded-xl overflow-hidden" style={{ border: '1px solid rgba(0,212,255,0.15)' }}>
            {filtered.map((item, i) => (
              <motion.div key={item} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className="px-4 py-2.5 flex items-center gap-3 hover:bg-neon-blue/5 transition-colors cursor-pointer"
                style={{ borderBottom: i < filtered.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none' }}>
                <RiSparklingLine size={14} className="text-neon-blue" />
                <span className="font-body text-sm text-slate-300">{item}</span>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
      {query && filtered.length === 0 && (
        <p className="font-body text-xs text-slate-500 text-center py-2">No results for "{query}"</p>
      )}
    </div>
  )
}

// ── 3. Progress Tracker Demo ─────────────────────────────────────────────────
function ProgressDemo() {
  const steps = [
    { label: 'Request Submitted', done: true },
    { label: 'Under Review', done: true },
    { label: 'In Progress', done: false, active: true },
    { label: 'Completed', done: false },
    { label: 'Delivered', done: false },
  ]
  return (
    <div className="space-y-3">
      {steps.map((step, i) => (
        <div key={step.label} className="flex items-center gap-3">
          <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 transition-all ${
            step.done ? 'bg-green-500/20 border border-green-500/50' :
            step.active ? 'border-2 border-neon-blue' : 'bg-dark-700 border border-slate-700'
          }`}>
            {step.done ? <RiCheckLine size={12} className="text-green-400" /> :
             step.active ? <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 1, repeat: Infinity }}
               className="w-2 h-2 rounded-full bg-neon-blue" /> :
             <div className="w-1.5 h-1.5 rounded-full bg-slate-600" />}
          </div>
          <div className="flex-1">
            <span className={`font-body text-sm ${step.done ? 'text-green-400' : step.active ? 'text-neon-blue' : 'text-slate-500'}`}>
              {step.label}
            </span>
          </div>
          {step.active && (
            <span className="font-mono text-xs text-neon-blue animate-pulse">Active</span>
          )}
        </div>
      ))}
    </div>
  )
}

// ── Feature Cards ────────────────────────────────────────────────────────────
const features = [
  {
    icon: RiMoonLine,
    title: 'Dark / Light Mode',
    desc: 'Toggle between cyberpunk dark mode and clean light mode across the entire site.',
    color: '#9d4edd',
    demo: <ThemeToggleDemo />,
    tag: 'UI Enhancement',
  },
  {
    icon: RiSearchLine,
    title: 'Live Search',
    desc: 'Real-time search across services, portfolio, and blog posts with instant results.',
    color: '#00d4ff',
    demo: <SearchDemo />,
    tag: 'UX Feature',
  },
  {
    icon: RiTimerLine,
    title: 'Project Progress Tracker',
    desc: 'Visual step-by-step tracker showing exactly where your project stands.',
    color: '#22c55e',
    demo: <ProgressDemo />,
    tag: 'Dashboard',
  },
  {
    icon: RiNotification3Line,
    title: 'Push Notifications',
    desc: 'Real-time browser notifications for project updates, messages, and status changes.',
    color: '#ff006e',
    demo: null,
    tag: 'Coming Soon',
  },
  {
    icon: RiBarChart2Line,
    title: 'Analytics Dashboard',
    desc: 'Track website visitors, conversion rates, and project ROI with beautiful charts.',
    color: '#f59e0b',
    demo: null,
    tag: 'Pro Feature',
  },
  {
    icon: RiShareLine,
    title: 'Social Sharing',
    desc: 'Share portfolio items and testimonials directly to social media platforms.',
    color: '#00fff5',
    demo: null,
    tag: 'Marketing',
  },
  {
    icon: RiBookmarkLine,
    title: 'Saved Items',
    desc: 'Users can bookmark services and portfolio items to reference later.',
    color: '#7b2fff',
    demo: null,
    tag: 'UX Feature',
  },
  {
    icon: RiTeamLine,
    title: 'Team Collaboration',
    desc: 'Multiple admin accounts with role-based permissions and activity logs.',
    color: '#00d4ff',
    demo: null,
    tag: 'Enterprise',
  },
  {
    icon: RiSecurePaymentLine,
    title: 'Payment Integration',
    desc: 'Accept project deposits via Stripe, Razorpay, or PayPal directly on the site.',
    color: '#22c55e',
    demo: null,
    tag: 'Revenue',
  },
  {
    icon: RiGlobalLine,
    title: 'Multi-language',
    desc: 'Auto-translate the site into multiple languages for global clients.',
    color: '#9d4edd',
    demo: null,
    tag: 'Global',
  },
  {
    icon: RiCodeBoxLine,
    title: 'API Webhooks',
    desc: 'Connect to Slack, Discord, or email when new projects are submitted.',
    color: '#ff006e',
    demo: null,
    tag: 'Integration',
  },
  {
    icon: RiSparklingLine,
    title: 'AI Content Generator',
    desc: 'Auto-generate project proposals, email replies, and service descriptions with AI.',
    color: '#00d4ff',
    demo: null,
    tag: 'AI Feature',
  },
]

export default function NewFeatures() {
  const [activeDemo, setActiveDemo] = useState(null)

  return (
    <div className="min-h-screen bg-dark-900 relative overflow-hidden">
      <div className="absolute inset-0 cyber-grid opacity-30" />
      <div className="absolute inset-0" style={{
        background: 'radial-gradient(ellipse 80% 50% at 50% 20%, rgba(0,212,255,0.05) 0%, transparent 60%)'
      }} />

      {/* Navbar */}
      <nav className="relative z-10 flex items-center justify-between px-6 py-5 max-w-7xl mx-auto">
        <Link to="/" className="inline-flex items-center gap-3">
          <div className="w-9 h-9 rounded border border-neon-blue/50 flex items-center justify-center bg-dark-800">
            <span className="font-display text-xs font-bold text-neon-blue">CX</span>
          </div>
          <span className="font-display text-sm font-bold text-white tracking-widest">
            CREAVIX<span className="text-neon-blue">.</span>WORLD
          </span>
        </Link>
        <Link to="/" className="btn-primary text-xs py-2 px-5">← Back Home</Link>
      </nav>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        {/* Hero */}
        <div className="text-center py-16">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="inline-flex items-center gap-3 mb-5">
            <div className="w-6 h-px bg-neon-blue" />
            <span className="font-mono text-xs text-neon-blue tracking-widest uppercase">Roadmap & Features</span>
            <div className="w-6 h-px bg-neon-blue" />
          </motion.div>
          <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="font-display text-4xl sm:text-5xl lg:text-6xl font-black text-white mb-4">
            New <span className="gradient-text-primary">Features</span>
          </motion.h1>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
            className="font-body text-slate-400 text-lg max-w-2xl mx-auto">
            Upcoming enhancements and features you can add to your CREAVIX WORLD platform.
            Click any card to see a live demo.
          </motion.p>
        </div>

        {/* Feature grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((f, i) => {
            const Icon = f.icon
            const isActive = activeDemo === i
            return (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06 }}
                className="rounded-2xl overflow-hidden cursor-pointer group"
                style={{
                  background: 'linear-gradient(135deg, rgba(10,16,32,0.8), rgba(6,10,20,0.95))',
                  border: `1px solid ${isActive ? f.color + '50' : f.color + '15'}`,
                  boxShadow: isActive ? `0 0 30px ${f.color}15` : 'none',
                  transition: 'all 0.3s ease',
                }}
                onClick={() => f.demo && setActiveDemo(isActive ? null : i)}
              >
                <div className="p-6">
                  {/* Top row */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-11 h-11 rounded-xl flex items-center justify-center"
                      style={{ background: `${f.color}12`, border: `1px solid ${f.color}30` }}>
                      <Icon size={22} style={{ color: f.color }} />
                    </div>
                    <span className="font-mono text-xs px-2.5 py-1 rounded-full"
                      style={{ background: `${f.color}10`, color: f.color, border: `1px solid ${f.color}25` }}>
                      {f.tag}
                    </span>
                  </div>

                  <h3 className="font-display text-sm font-bold text-white mb-2 group-hover:text-neon-blue transition-colors">
                    {f.title}
                  </h3>
                  <p className="font-body text-sm text-slate-400 leading-relaxed mb-4">{f.desc}</p>

                  {f.demo && (
                    <button className="flex items-center gap-1.5 font-mono text-xs transition-all"
                      style={{ color: f.color }}>
                      {isActive ? 'Hide Demo' : 'View Demo'}
                      <RiArrowRightLine size={12} className={`transition-transform ${isActive ? 'rotate-90' : ''}`} />
                    </button>
                  )}
                </div>

                {/* Demo area */}
                <AnimatePresence>
                  {isActive && f.demo && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="px-6 pb-6"
                      style={{ borderTop: `1px solid ${f.color}15` }}
                      onClick={e => e.stopPropagation()}
                    >
                      <div className="pt-4">
                        {f.demo}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )
          })}
        </div>

        {/* CTA */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }}
          className="text-center mt-16 glass rounded-2xl p-10" style={{ border: '1px solid rgba(0,212,255,0.15)' }}>
          <h2 className="font-display text-2xl font-bold text-white mb-3">
            Want a feature added to your site?
          </h2>
          <p className="font-body text-slate-400 mb-6">
            Submit a project request and we'll implement any of these features for you.
          </p>
          <Link to="/submit-project" className="btn-glow inline-flex items-center gap-2">
            Request a Feature <RiArrowRightLine size={16} />
          </Link>
        </motion.div>
      </div>
    </div>
  )
}
