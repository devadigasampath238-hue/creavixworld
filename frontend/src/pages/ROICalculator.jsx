import { useState } from 'react'
import { motion } from 'framer-motion'
import { HiTrendingUp, HiCurrencyRupee, HiUsers, HiChartBar } from 'react-icons/hi'

const AnimatedNumber = ({ value, prefix = '', suffix = '' }) => {
  return (
    <motion.span
      key={value}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="font-black"
      style={{ fontFamily: 'Orbitron, monospace' }}
    >
      {prefix}{typeof value === 'number' ? value.toLocaleString() : value}{suffix}
    </motion.span>
  )
}

export default function ROICalculator() {
  const [revenue, setRevenue] = useState('')
  const [visitors, setVisitors] = useState('')
  const [conversion, setConversion] = useState('')
  const [calculated, setCalculated] = useState(false)

  const r = parseFloat(revenue) || 0
  const v = parseFloat(visitors) || 0
  const c = parseFloat(conversion) || 0

  const currentCustomers = Math.round(v * (c / 100))
  const improvedConversion = c * 1.35
  const newCustomers = Math.round(v * (improvedConversion / 100))
  const avgOrderValue = currentCustomers > 0 ? r / currentCustomers : 0
  const projectedRevenue = Math.round(newCustomers * avgOrderValue)
  const revenueGrowth = Math.round(projectedRevenue - r)
  const roi = r > 0 ? Math.round((revenueGrowth / 50000) * 100) : 0

  const handleCalculate = () => {
    if (r && v && c) setCalculated(true)
  }

  const inputClass = "w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4 text-white placeholder-slate-500 outline-none focus:border-[#00d4ff]/50 transition-all font-mono"

  return (
    <div className="min-h-screen bg-[#030508] py-20 px-4">
      <div className="max-w-4xl mx-auto">

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#22c55e]/20 bg-[#22c55e]/5 mb-6">
            <HiTrendingUp className="text-[#22c55e]" />
            <span className="text-[#22c55e] text-sm font-mono tracking-widest">ROI CALCULATOR</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-white mb-4" style={{ fontFamily: 'Orbitron, monospace' }}>
            Calculate Your ROI
          </h1>
          <p className="text-slate-400 text-lg">See how a new website can grow your revenue</p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8">

          {/* Inputs */}
          <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-5">
              <h2 className="text-white font-bold font-mono mb-2">Your Current Numbers</h2>

              <div>
                <label className="text-slate-400 text-xs font-mono uppercase tracking-wider block mb-2">
                  <HiCurrencyRupee className="inline mr-1" />Monthly Revenue (₹)
                </label>
                <input
                  value={revenue}
                  onChange={e => { setRevenue(e.target.value); setCalculated(false) }}
                  placeholder="100000"
                  type="number"
                  className={inputClass}
                />
              </div>

              <div>
                <label className="text-slate-400 text-xs font-mono uppercase tracking-wider block mb-2">
                  <HiUsers className="inline mr-1" />Monthly Visitors
                </label>
                <input
                  value={visitors}
                  onChange={e => { setVisitors(e.target.value); setCalculated(false) }}
                  placeholder="5000"
                  type="number"
                  className={inputClass}
                />
              </div>

              <div>
                <label className="text-slate-400 text-xs font-mono uppercase tracking-wider block mb-2">
                  <HiChartBar className="inline mr-1" />Conversion Rate (%)
                </label>
                <input
                  value={conversion}
                  onChange={e => { setConversion(e.target.value); setCalculated(false) }}
                  placeholder="2.5"
                  type="number"
                  step="0.1"
                  className={inputClass}
                />
              </div>

              <motion.button
                onClick={handleCalculate}
                disabled={!r || !v || !c}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full py-4 rounded-xl font-bold text-black disabled:opacity-40"
                style={{ background: 'linear-gradient(135deg, #22c55e, #00d4ff)' }}
              >
                Calculate ROI
              </motion.button>
            </div>
          </motion.div>

          {/* Results */}
          <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}>
            <div className="space-y-4">

              {[
                {
                  label: 'Current Monthly Revenue',
                  value: r,
                  prefix: '₹',
                  color: '#94a3b8',
                  bg: 'rgba(148,163,184,0.1)',
                  border: 'rgba(148,163,184,0.2)',
                },
                {
                  label: 'Projected Revenue',
                  value: calculated ? projectedRevenue : 0,
                  prefix: '₹',
                  color: '#22c55e',
                  bg: 'rgba(34,197,94,0.1)',
                  border: 'rgba(34,197,94,0.2)',
                },
                {
                  label: 'Additional Revenue / Month',
                  value: calculated ? revenueGrowth : 0,
                  prefix: '+₹',
                  color: '#00d4ff',
                  bg: 'rgba(0,212,255,0.1)',
                  border: 'rgba(0,212,255,0.2)',
                },
                {
                  label: 'Expected ROI',
                  value: calculated ? roi : 0,
                  suffix: '%',
                  color: '#f59e0b',
                  bg: 'rgba(245,158,11,0.1)',
                  border: 'rgba(245,158,11,0.2)',
                },
              ].map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: calculated || i === 0 ? 1 : 0.4, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="p-5 rounded-2xl"
                  style={{ background: item.bg, border: `1px solid ${item.border}` }}
                >
                  <p className="text-slate-400 text-xs font-mono mb-2 uppercase tracking-wider">{item.label}</p>
                  <p className="text-3xl" style={{ color: item.color }}>
                    <AnimatedNumber
                      value={item.value}
                      prefix={item.prefix || ''}
                      suffix={item.suffix || ''}
                    />
                  </p>
                </motion.div>
              ))}

              {calculated && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-5 rounded-2xl bg-[#22c55e]/10 border border-[#22c55e]/30"
                >
                  <p className="text-[#22c55e] text-sm font-mono">
                    🚀 A premium website could increase your conversion rate by <strong>35%</strong>,
                    generating an extra <strong>₹{revenueGrowth.toLocaleString()}/month</strong>
                  </p>
                </motion.div>
              )}
            </div>
          </motion.div>
        </div>

        {/* CTA */}
        {calculated && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="text-center mt-12"
          >
            <a
              href="/submit-project"
              className="inline-flex items-center gap-3 px-10 py-5 rounded-xl font-bold text-black text-lg"
              style={{ background: 'linear-gradient(135deg, #22c55e, #00d4ff)' }}
            >
              <HiTrendingUp size={22} />
              Start Growing Today
            </a>
          </motion.div>
        )}
      </div>
    </div>
  )
}