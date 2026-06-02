import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { HiDesktopComputer, HiDeviceMobile, HiCloud, HiChip, HiCheck, HiArrowRight, HiArrowLeft, HiCurrencyRupee } from 'react-icons/hi'

const platforms = [
  { id: 'website', label: 'Website', icon: HiDesktopComputer, base: 30000, desc: 'Landing page, portfolio, business site' },
  { id: 'mobile', label: 'Mobile App', icon: HiDeviceMobile, base: 80000, desc: 'iOS & Android application' },
  { id: 'saas', label: 'SaaS Product', icon: HiCloud, base: 150000, desc: 'Subscription-based web application' },
  { id: 'ai', label: 'AI Product', icon: HiChip, base: 200000, desc: 'AI-powered application or tool' },
]

const features = [
  { id: 'auth', label: 'Authentication', cost: 10000, time: 3 },
  { id: 'dashboard', label: 'Dashboard', cost: 20000, time: 5 },
  { id: 'payments', label: 'Payments', cost: 25000, time: 7 },
  { id: 'chat', label: 'Live Chat', cost: 20000, time: 5 },
  { id: 'ai', label: 'AI Integration', cost: 40000, time: 10 },
  { id: 'analytics', label: 'Analytics', cost: 15000, time: 4 },
  { id: 'admin', label: 'Admin Panel', cost: 20000, time: 5 },
]

const timelines = [
  { id: '1', label: '1 Month', multiplier: 1.4, desc: 'Rush delivery' },
  { id: '2', label: '2 Months', multiplier: 1.1, desc: 'Standard pace' },
  { id: '3', label: '3 Months', multiplier: 1.0, desc: 'Comfortable pace' },
  { id: 'flex', label: 'Flexible', multiplier: 0.9, desc: 'Best value' },
]

export default function CostCalculator() {
  const [step, setStep] = useState(1)
  const [platform, setPlatform] = useState(null)
  const [selectedFeatures, setSelectedFeatures] = useState([])
  const [timeline, setTimeline] = useState(null)
  const [result, setResult] = useState(null)

  const toggleFeature = (id) => {
    setSelectedFeatures(prev =>
      prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]
    )
  }

  const calculate = () => {
    const p = platforms.find(p => p.id === platform)
    const t = timelines.find(t => t.id === timeline)
    const featureCost = selectedFeatures.reduce((sum, id) => {
      const f = features.find(f => f.id === id)
      return sum + (f?.cost || 0)
    }, 0)
    const featureTime = selectedFeatures.reduce((sum, id) => {
      const f = features.find(f => f.id === id)
      return sum + (f?.time || 0)
    }, 0)
    const base = p?.base || 0
    const total = Math.round((base + featureCost) * (t?.multiplier || 1))
    const weeks = Math.max(4, Math.round(featureTime * (t?.multiplier || 1)))
    const team = total > 150000 ? 4 : total > 80000 ? 3 : 2
    setResult({ total, weeks, team, platform: p?.label, timeline: t?.label })
    setStep(4)
  }

  const steps = ['Platform', 'Features', 'Timeline', 'Estimate']

  return (
    <div className="min-h-screen bg-[#030508] py-20 px-4">
      <div className="max-w-3xl mx-auto">

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#9d4edd]/20 bg-[#9d4edd]/5 mb-6">
            <HiCurrencyRupee className="text-[#9d4edd]" />
            <span className="text-[#9d4edd] text-sm font-mono tracking-widest">AI COST CALCULATOR</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-white mb-4" style={{ fontFamily: 'Orbitron, monospace' }}>
            Estimate Your Project
          </h1>
          <p className="text-slate-400 text-lg">Get instant cost & timeline estimates powered by AI</p>
        </motion.div>

        {/* Step Indicator */}
        <div className="flex items-center justify-center gap-2 mb-10">
          {steps.map((s, i) => (
            <div key={s} className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold font-mono transition-all ${
                step > i + 1 ? 'bg-[#00d4ff] text-black' :
                step === i + 1 ? 'border-2 border-[#00d4ff] text-[#00d4ff]' :
                'border border-white/20 text-slate-500'
              }`}>
                {step > i + 1 ? <HiCheck size={14} /> : i + 1}
              </div>
              <span className={`text-xs font-mono hidden sm:block ${step === i + 1 ? 'text-white' : 'text-slate-500'}`}>{s}</span>
              {i < steps.length - 1 && <div className={`w-8 h-px ${step > i + 1 ? 'bg-[#00d4ff]' : 'bg-white/10'}`} />}
            </div>
          ))}
        </div>

        <AnimatePresence mode="wait">

          {/* Step 1 - Platform */}
          {step === 1 && (
            <motion.div key="step1" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}>
              <h2 className="text-white text-xl font-bold mb-6 font-mono">Select Platform</h2>
              <div className="grid grid-cols-2 gap-4 mb-8">
                {platforms.map(p => (
                  <motion.div
                    key={p.id}
                    onClick={() => setPlatform(p.id)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`p-6 rounded-2xl border cursor-pointer transition-all ${
                      platform === p.id
                        ? 'border-[#9d4edd] bg-[#9d4edd]/10'
                        : 'border-white/10 bg-white/5 hover:border-white/20'
                    }`}
                  >
                    <p.icon className={platform === p.id ? 'text-[#9d4edd]' : 'text-slate-400'} size={28} />
                    <p className="text-white font-bold mt-3 mb-1">{p.label}</p>
                    <p className="text-slate-500 text-xs">{p.desc}</p>
                    <p className="text-[#9d4edd] text-sm font-mono mt-2">from ₹{p.base.toLocaleString()}</p>
                  </motion.div>
                ))}
              </div>
              <button
                onClick={() => platform && setStep(2)}
                disabled={!platform}
                className="w-full py-4 rounded-xl font-bold text-black disabled:opacity-40 flex items-center justify-center gap-2"
                style={{ background: 'linear-gradient(135deg, #9d4edd, #00d4ff)' }}
              >
                Next <HiArrowRight />
              </button>
            </motion.div>
          )}

          {/* Step 2 - Features */}
          {step === 2 && (
            <motion.div key="step2" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}>
              <h2 className="text-white text-xl font-bold mb-6 font-mono">Select Features</h2>
              <div className="space-y-3 mb-8">
                {features.map(f => (
                  <motion.div
                    key={f.id}
                    onClick={() => toggleFeature(f.id)}
                    whileHover={{ scale: 1.01 }}
                    className={`flex items-center justify-between p-4 rounded-xl border cursor-pointer transition-all ${
                      selectedFeatures.includes(f.id)
                        ? 'border-[#00d4ff]/50 bg-[#00d4ff]/5'
                        : 'border-white/10 bg-white/5'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${
                        selectedFeatures.includes(f.id) ? 'bg-[#00d4ff] border-[#00d4ff]' : 'border-white/30'
                      }`}>
                        {selectedFeatures.includes(f.id) && <HiCheck size={12} className="text-black" />}
                      </div>
                      <span className="text-white font-medium">{f.label}</span>
                    </div>
                    <div className="text-right">
                      <p className="text-[#00d4ff] text-sm font-mono">+₹{f.cost.toLocaleString()}</p>
                      <p className="text-slate-500 text-xs">{f.time} days</p>
                    </div>
                  </motion.div>
                ))}
              </div>
              <div className="flex gap-3">
                <button onClick={() => setStep(1)} className="flex items-center gap-2 px-6 py-4 rounded-xl border border-white/20 text-white">
                  <HiArrowLeft /> Back
                </button>
                <button
                  onClick={() => setStep(3)}
                  className="flex-1 py-4 rounded-xl font-bold text-black flex items-center justify-center gap-2"
                  style={{ background: 'linear-gradient(135deg, #9d4edd, #00d4ff)' }}
                >
                  Next <HiArrowRight />
                </button>
              </div>
            </motion.div>
          )}

          {/* Step 3 - Timeline */}
          {step === 3 && (
            <motion.div key="step3" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}>
              <h2 className="text-white text-xl font-bold mb-6 font-mono">Select Timeline</h2>
              <div className="grid grid-cols-2 gap-4 mb-8">
                {timelines.map(t => (
                  <motion.div
                    key={t.id}
                    onClick={() => setTimeline(t.id)}
                    whileHover={{ scale: 1.02 }}
                    className={`p-6 rounded-2xl border cursor-pointer transition-all ${
                      timeline === t.id
                        ? 'border-[#9d4edd] bg-[#9d4edd]/10'
                        : 'border-white/10 bg-white/5'
                    }`}
                  >
                    <p className="text-white font-bold text-xl mb-1">{t.label}</p>
                    <p className="text-slate-500 text-sm">{t.desc}</p>
                    {t.multiplier > 1 && <p className="text-red-400 text-xs mt-2 font-mono">+{Math.round((t.multiplier - 1) * 100)}% rush fee</p>}
                    {t.multiplier < 1 && <p className="text-green-400 text-xs mt-2 font-mono">{Math.round((1 - t.multiplier) * 100)}% discount</p>}
                  </motion.div>
                ))}
              </div>
              <div className="flex gap-3">
                <button onClick={() => setStep(2)} className="flex items-center gap-2 px-6 py-4 rounded-xl border border-white/20 text-white">
                  <HiArrowLeft /> Back
                </button>
                <button
                  onClick={calculate}
                  disabled={!timeline}
                  className="flex-1 py-4 rounded-xl font-bold text-black disabled:opacity-40 flex items-center justify-center gap-2"
                  style={{ background: 'linear-gradient(135deg, #9d4edd, #00d4ff)' }}
                >
                  Calculate <HiChip />
                </button>
              </div>
            </motion.div>
          )}

          {/* Step 4 - Result */}
          {step === 4 && result && (
            <motion.div key="step4" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
              <div className="text-center mb-8">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', delay: 0.2 }}
                  className="inline-block p-6 rounded-3xl mb-6"
                  style={{ background: 'linear-gradient(135deg, rgba(157,78,221,0.2), rgba(0,212,255,0.2))', border: '1px solid rgba(0,212,255,0.3)' }}
                >
                  <p className="text-slate-400 text-sm font-mono mb-2">ESTIMATED COST</p>
                  <p className="text-5xl font-black text-white" style={{ fontFamily: 'Orbitron, monospace' }}>
                    ₹{result.total.toLocaleString()}
                  </p>
                </motion.div>
              </div>

              <div className="grid grid-cols-3 gap-4 mb-8">
                {[
                  { label: 'Platform', value: result.platform },
                  { label: 'Timeline', value: result.timeline },
                  { label: 'Team Size', value: `${result.team} devs` },
                ].map((item, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 + i * 0.1 }}
                    className="p-4 rounded-xl bg-white/5 border border-white/10 text-center"
                  >
                    <p className="text-slate-500 text-xs font-mono mb-1">{item.label}</p>
                    <p className="text-white font-bold">{item.value}</p>
                  </motion.div>
                ))}
              </div>

              <div className="p-5 rounded-xl bg-[#00d4ff]/5 border border-[#00d4ff]/20 mb-6">
                <p className="text-[#00d4ff] font-mono text-sm">💡 This is an estimate. Final pricing depends on design complexity, revisions, and specific requirements.</p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => { setStep(1); setPlatform(null); setSelectedFeatures([]); setTimeline(null); setResult(null) }}
                  className="flex-1 py-4 rounded-xl border border-white/20 text-white font-bold"
                >
                  Start Over
                </button>
                <a
                  href="/submit-project"
                  className="flex-1 py-4 rounded-xl font-bold text-black text-center flex items-center justify-center"
                  style={{ background: 'linear-gradient(135deg, #9d4edd, #00d4ff)' }}
                >
                  Get Started
                </a>
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </div>
  )
}