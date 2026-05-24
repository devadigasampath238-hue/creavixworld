import { useState, useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { RiSparklingLine, RiRobot2Line, RiTimeLine, RiMagicLine } from 'react-icons/ri'

// ─── AI Website Idea Generator ───────────────────────────────────────────────
function IdeaGenerator() {
  const [idea, setIdea] = useState('')
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)

  const suggestions = {
    restaurant: { rec: 'Online menu, reservation system, AI food recommender, loyalty program, mobile ordering', stack: 'React + Node.js + AI recommendations', time: '3–4 weeks' },
    gym: { rec: 'Workout tracker, AI coach chatbot, progress analytics, class booking, nutrition planner', stack: 'React Native + ML fitness models', time: '4–6 weeks' },
    shop: { rec: 'Product catalog, AI search, smart recommendations, cart + payments, inventory dashboard', stack: 'Next.js + Stripe + AI search', time: '4–5 weeks' },
    clinic: { rec: 'Appointment booking, patient portal, AI symptom checker, telemedicine, records management', stack: 'React + Node.js + AI diagnostics', time: '6–8 weeks' },
    school: { rec: 'Student portal, AI tutor chatbot, course management, progress tracking, parent dashboard', stack: 'React + LMS + AI assistant', time: '5–7 weeks' },
    default: { rec: 'Custom dashboard, AI chatbot assistant, analytics, mobile-first responsive UI, admin panel', stack: 'React + Node.js + AI integrations', time: '3–5 weeks' },
  }

  const generate = async () => {
    if (!idea.trim()) return
    setLoading(true)
    setResult(null)
    await new Promise(r => setTimeout(r, 1200))
    const lower = idea.toLowerCase()
    const key = Object.keys(suggestions).find(k => lower.includes(k)) || 'default'
    setResult(suggestions[key])
    setLoading(false)
  }

  return (
    <div className="glass rounded-2xl p-6" style={{ border: '1px solid rgba(0,212,255,0.15)' }}>
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'rgba(0,212,255,0.1)', border: '1px solid rgba(0,212,255,0.3)' }}>
          <RiMagicLine size={20} className="text-neon-blue" />
        </div>
        <div>
          <h3 className="font-display text-sm font-bold text-white">AI Idea Generator</h3>
          <p className="font-mono text-xs text-slate-500">Describe your business</p>
        </div>
      </div>

      <div className="flex gap-2 mb-4">
        <input value={idea} onChange={e => setIdea(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && generate()}
          placeholder="e.g. restaurant, gym, online shop..."
          className="cyber-input text-sm py-2 flex-1" />
        <motion.button whileTap={{ scale: 0.95 }} onClick={generate}
          className="btn-glow px-4 py-2 text-xs flex-shrink-0">
          {loading ? '...' : 'Generate'}
        </motion.button>
      </div>

      {loading && (
        <div className="flex items-center gap-3 p-4 rounded-xl" style={{ background: 'rgba(0,212,255,0.04)' }}>
          <div className="cyber-loader w-5 h-5 flex-shrink-0" style={{ width: 20, height: 20 }} />
          <span className="font-mono text-xs text-neon-blue animate-pulse">AI is analyzing your idea...</span>
        </div>
      )}

      {result && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
          className="space-y-3 p-4 rounded-xl" style={{ background: 'rgba(0,212,255,0.04)', border: '1px solid rgba(0,212,255,0.1)' }}>
          <div>
            <div className="font-mono text-xs text-neon-blue mb-1">✨ RECOMMENDED FEATURES</div>
            <p className="font-body text-sm text-slate-300">{result.rec}</p>
          </div>
          <div>
            <div className="font-mono text-xs text-neon-purple mb-1">⚡ TECH STACK</div>
            <p className="font-body text-sm text-slate-300">{result.stack}</p>
          </div>
          <div>
            <div className="font-mono text-xs text-neon-cyan mb-1">⏱ ESTIMATED TIME</div>
            <p className="font-body text-sm text-slate-300">{result.time}</p>
          </div>
        </motion.div>
      )}
    </div>
  )
}

// ─── AI Project Estimator ─────────────────────────────────────────────────────
function ProjectEstimator() {
  const [type, setType] = useState('')
  const [features, setFeatures] = useState([])
  const [timeline, setTimeline] = useState('')
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)

  const featureList = ['AI Chatbot', 'Payment Gateway', 'User Auth', 'Admin Dashboard', 'API Integration', 'Mobile App', 'Analytics', 'Multi-language']

  const toggleFeature = f => setFeatures(prev => prev.includes(f) ? prev.filter(x => x !== f) : [...prev, f])

  const estimate = async () => {
    if (!type || !timeline) return
    setLoading(true)
    await new Promise(r => setTimeout(r, 1000))
    const score = features.length + (type === 'Custom App' ? 3 : type === 'E-commerce' ? 2 : 1) + (timeline === '< 1 week' ? -1 : timeline === '> 2 months' ? 2 : 0)
    const complexity = score <= 2 ? 'Low' : score <= 5 ? 'Medium' : 'High'
    const weeks = score <= 2 ? '1–2 weeks' : score <= 5 ? '3–5 weeks' : '6–10 weeks'
    const range = score <= 2 ? '$499 – $799' : score <= 5 ? '$1,200 – $2,500' : '$3,000 – $8,000+'
    setResult({ complexity, weeks, range, score })
    setLoading(false)
  }

  const colors = { Low: '#22c55e', Medium: '#f59e0b', High: '#ff006e' }

  return (
    <div className="glass rounded-2xl p-6" style={{ border: '1px solid rgba(157,78,221,0.15)' }}>
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'rgba(157,78,221,0.1)', border: '1px solid rgba(157,78,221,0.3)' }}>
          <RiTimeLine size={20} className="text-neon-purple" />
        </div>
        <div>
          <h3 className="font-display text-sm font-bold text-white">AI Project Estimator</h3>
          <p className="font-mono text-xs text-slate-500">Get instant complexity estimate</p>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <label className="font-mono text-xs text-slate-400 block mb-2">Website Type</label>
          <select value={type} onChange={e => setType(e.target.value)} className="cyber-input text-sm py-2">
            <option value="">Select type...</option>
            {['Landing Page', 'Business Website', 'Portfolio', 'E-commerce', 'Custom App', 'SaaS Platform'].map(t => <option key={t}>{t}</option>)}
          </select>
        </div>

        <div>
          <label className="font-mono text-xs text-slate-400 block mb-2">Features needed</label>
          <div className="flex flex-wrap gap-2">
            {featureList.map(f => (
              <button key={f} onClick={() => toggleFeature(f)}
                className="font-mono text-xs px-3 py-1.5 rounded-full border transition-all"
                style={features.includes(f)
                  ? { background: 'rgba(157,78,221,0.15)', borderColor: '#9d4edd', color: '#9d4edd' }
                  : { background: 'transparent', borderColor: 'rgba(148,163,184,0.2)', color: 'rgba(148,163,184,0.6)' }
                }>
                {f}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="font-mono text-xs text-slate-400 block mb-2">Timeline</label>
          <select value={timeline} onChange={e => setTimeline(e.target.value)} className="cyber-input text-sm py-2">
            <option value="">Select timeline...</option>
            {['< 1 week', '1–2 weeks', '1 month', '2 months', '> 2 months'].map(t => <option key={t}>{t}</option>)}
          </select>
        </div>

        <motion.button whileTap={{ scale: 0.98 }} onClick={estimate}
          className="btn-glow w-full py-2.5 text-xs">
          {loading ? 'Calculating...' : '⚡ Estimate Project'}
        </motion.button>

        {result && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            className="p-4 rounded-xl space-y-3" style={{ background: 'rgba(157,78,221,0.04)', border: '1px solid rgba(157,78,221,0.15)' }}>
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs text-slate-400">Complexity</span>
              <span className="font-display text-sm font-bold px-3 py-1 rounded-full"
                style={{ background: `${colors[result.complexity]}15`, color: colors[result.complexity], border: `1px solid ${colors[result.complexity]}40` }}>
                {result.complexity}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs text-slate-400">Timeline</span>
              <span className="font-body text-sm text-white font-semibold">{result.weeks}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs text-slate-400">Budget Range</span>
              <span className="font-display text-sm text-neon-blue font-bold">{result.range}</span>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )
}

// ─── AI Feature Recommender ───────────────────────────────────────────────────
function FeatureRecommender() {
  const [selected, setSelected] = useState(null)
  const [result, setResult] = useState(null)

  const types = [
    { label: 'E-commerce', icon: '🛒' },
    { label: 'Portfolio', icon: '🎨' },
    { label: 'Startup', icon: '🚀' },
    { label: 'School System', icon: '🎓' },
    { label: 'Healthcare', icon: '🏥' },
    { label: 'Restaurant', icon: '🍽️' },
  ]

  const recommendations = {
    'E-commerce': ['AI Product Recommendations', 'Smart Search', 'Chatbot Support', 'Price Optimization AI', 'Fraud Detection', 'Inventory Forecasting'],
    'Portfolio': ['AI Project Descriptions', 'Smart Contact Form', 'Visitor Analytics AI', 'Auto-generated Case Studies', 'SEO AI Optimizer'],
    'Startup': ['AI Onboarding Flow', 'Smart Analytics Dashboard', 'AI Chatbot Support', 'Automated Email AI', 'User Behavior Analysis'],
    'School System': ['AI Tutor Chatbot', 'Smart Progress Tracking', 'Plagiarism Detector', 'Auto-grading AI', 'Personalized Learning Paths'],
    'Healthcare': ['AI Symptom Checker', 'Appointment Scheduler AI', 'Medical Records AI', 'Telemedicine Bot', 'Drug Interaction Checker'],
    'Restaurant': ['AI Menu Recommender', 'Smart Reservation System', 'Customer Sentiment Analysis', 'Inventory AI', 'Loyalty Program AI'],
  }

  const select = async (type) => {
    setSelected(type)
    setResult(null)
    await new Promise(r => setTimeout(r, 600))
    setResult(recommendations[type] || [])
  }

  return (
    <div className="glass rounded-2xl p-6" style={{ border: '1px solid rgba(255,0,110,0.15)' }}>
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'rgba(255,0,110,0.1)', border: '1px solid rgba(255,0,110,0.3)' }}>
          <RiRobot2Line size={20} className="text-neon-pink" />
        </div>
        <div>
          <h3 className="font-display text-sm font-bold text-white">AI Feature Recommender</h3>
          <p className="font-mono text-xs text-slate-500">What are you building?</p>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-4">
        {types.map(t => (
          <button key={t.label} onClick={() => select(t.label)}
            className="p-3 rounded-xl border text-left transition-all"
            style={selected === t.label
              ? { background: 'rgba(255,0,110,0.1)', borderColor: '#ff006e', boxShadow: '0 0 15px rgba(255,0,110,0.2)' }
              : { background: 'rgba(10,16,32,0.5)', borderColor: 'rgba(255,255,255,0.08)' }
            }>
            <div className="text-lg mb-1">{t.icon}</div>
            <div className="font-body text-xs text-slate-300">{t.label}</div>
          </button>
        ))}
      </div>

      {result && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
          className="p-4 rounded-xl" style={{ background: 'rgba(255,0,110,0.04)', border: '1px solid rgba(255,0,110,0.15)' }}>
          <div className="font-mono text-xs text-neon-pink mb-3">🤖 RECOMMENDED AI FEATURES</div>
          <div className="space-y-2">
            {result.map((f, i) => (
              <motion.div key={f} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.07 }}
                className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-neon-pink flex-shrink-0" />
                <span className="font-body text-sm text-slate-300">{f}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  )
}

// ─── Main Export ──────────────────────────────────────────────────────────────
export default function AIDemo() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true })

  return (
    <section id="ai-demo" className="relative py-24 lg:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16" ref={ref}>
          <motion.div initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}}
            className="inline-flex items-center gap-3 mb-4">
            <div className="w-6 h-px bg-neon-cyan" />
            <span className="font-mono text-xs text-neon-cyan tracking-widest uppercase">Try It Live</span>
            <div className="w-6 h-px bg-neon-cyan" />
          </motion.div>
          <motion.h2 initial={{ opacity: 0, y: 30 }} animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.1 }}
            className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
            Interactive <span className="gradient-text-primary">AI Tools</span>
          </motion.h2>
          <motion.p initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}} transition={{ delay: 0.2 }}
            className="font-body text-slate-400 max-w-xl mx-auto">
            Experience the power of AI planning tools — get instant recommendations, estimates, and ideas for your project.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <motion.div initial={{ opacity: 0, y: 40 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.15 }}>
            <IdeaGenerator />
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 40 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.25 }}>
            <ProjectEstimator />
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 40 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.35 }}>
            <FeatureRecommender />
          </motion.div>
        </div>

        {/* Bottom note */}
        <motion.div initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}} transition={{ delay: 0.5 }}
          className="text-center mt-10">
          <p className="font-body text-xs text-slate-600">
            <RiSparklingLine className="inline mr-1 text-neon-blue" size={12} />
            These are demo tools. For a full AI consultation, submit a project request.
          </p>
        </motion.div>
      </div>
    </section>
  )
}
