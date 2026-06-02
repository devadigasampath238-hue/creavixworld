import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { HiGlobe, HiLightningBolt, HiShieldCheck, HiEye, HiChartBar, HiDownload } from 'react-icons/hi'

const mockAudit = (url) => ({
  url,
  seo: { score: 78, issues: ['Missing meta description', 'No sitemap.xml', 'Images lack alt text'] },
  performance: { score: 62, issues: ['Large uncompressed images', 'No lazy loading', 'Render-blocking scripts'] },
  security: { score: 91, issues: ['Missing Content-Security-Policy header'] },
  accessibility: { score: 85, issues: ['Low contrast text on hero', 'Missing ARIA labels on buttons'] },
  recommendations: [
    'Add meta descriptions to all pages',
    'Compress and lazy-load images',
    'Implement HTTPS redirects',
    'Use semantic HTML elements',
    'Add structured data markup',
  ],
})

const ScoreRing = ({ score, color, size = 80 }) => {
  const r = 30
  const circ = 2 * Math.PI * r
  const offset = circ - (score / 100) * circ
  return (
    <svg width={size} height={size} viewBox="0 0 70 70">
      <circle cx="35" cy="35" r={r} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="6" />
      <motion.circle
        cx="35" cy="35" r={r} fill="none"
        stroke={color} strokeWidth="6"
        strokeDasharray={circ}
        strokeDashoffset={circ}
        animate={{ strokeDashoffset: offset }}
        transition={{ duration: 1.5, ease: 'easeOut' }}
        strokeLinecap="round"
        transform="rotate(-90 35 35)"
        style={{ filter: `drop-shadow(0 0 6px ${color})` }}
      />
      <text x="35" y="40" textAnchor="middle" fill="white" fontSize="14" fontWeight="bold" fontFamily="monospace">{score}</text>
    </svg>
  )
}

const cards = [
  { key: 'seo', label: 'SEO', icon: HiChartBar, color: '#00d4ff' },
  { key: 'performance', label: 'Performance', icon: HiLightningBolt, color: '#9d4edd' },
  { key: 'security', label: 'Security', icon: HiShieldCheck, color: '#22c55e' },
  { key: 'accessibility', label: 'Accessibility', icon: HiEye, color: '#f59e0b' },
]

export default function WebsiteAuditor() {
  const [url, setUrl] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [active, setActive] = useState('seo')

  const handleAudit = async () => {
    if (!url) return
    setLoading(true)
    setResult(null)
    await new Promise(r => setTimeout(r, 2500))
    setResult(mockAudit(url))
    setLoading(false)
  }

  const handleExport = () => {
    if (!result) return
    const content = `CREAVIX WORLD - Website Audit Report
URL: ${result.url}
Date: ${new Date().toLocaleDateString()}

SEO Score: ${result.seo.score}/100
Performance Score: ${result.performance.score}/100
Security Score: ${result.security.score}/100
Accessibility Score: ${result.accessibility.score}/100

RECOMMENDATIONS:
${result.recommendations.map((r, i) => `${i + 1}. ${r}`).join('\n')}
    `
    const blob = new Blob([content], { type: 'text/plain' })
    const a = document.createElement('a')
    a.href = URL.createObjectURL(blob)
    a.download = 'creavix-audit.txt'
    a.click()
  }

  return (
    <div className="min-h-screen bg-[#030508] py-20 px-4">
      <div className="max-w-4xl mx-auto">

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#00d4ff]/20 bg-[#00d4ff]/5 mb-6">
            <HiGlobe className="text-[#00d4ff]" />
            <span className="text-[#00d4ff] text-sm font-mono tracking-widest">AI WEBSITE AUDITOR</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-white mb-4" style={{ fontFamily: 'Orbitron, monospace' }}>
            Audit Your Website
          </h1>
          <p className="text-slate-400 text-lg">Get instant AI-powered insights on SEO, performance, security & accessibility</p>
        </motion.div>

        {/* Input */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className="flex gap-3 mb-12">
          <input
            value={url}
            onChange={e => setUrl(e.target.value)}
            placeholder="https://yourwebsite.com"
            className="flex-1 bg-white/5 border border-white/10 rounded-xl px-5 py-4 text-white placeholder-slate-500 outline-none focus:border-[#00d4ff]/50 transition-all"
            onKeyDown={e => e.key === 'Enter' && handleAudit()}
          />
          <motion.button
            onClick={handleAudit}
            disabled={loading || !url}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="px-8 py-4 rounded-xl font-bold text-black disabled:opacity-50"
            style={{ background: 'linear-gradient(135deg, #00d4ff, #9d4edd)' }}
          >
            {loading ? 'Analyzing...' : 'Analyze'}
          </motion.button>
        </motion.div>

        {/* Loading */}
        <AnimatePresence>
          {loading && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="text-center py-20">
              <div className="relative w-24 h-24 mx-auto mb-6">
                <div className="absolute inset-0 rounded-full border-2 border-[#00d4ff]/20 animate-ping" />
                <div className="absolute inset-2 rounded-full border-2 border-[#9d4edd]/40 animate-spin" />
                <HiGlobe className="absolute inset-0 m-auto text-[#00d4ff]" size={32} />
              </div>
              <p className="text-slate-400 font-mono animate-pulse">Scanning website...</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Results */}
        <AnimatePresence>
          {result && (
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>

              {/* Score Cards */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                {cards.map((card, i) => (
                  <motion.div
                    key={card.key}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    onClick={() => setActive(card.key)}
                    className={`p-5 rounded-2xl border cursor-pointer transition-all ${
                      active === card.key
                        ? 'border-[#00d4ff]/50 bg-[#00d4ff]/5'
                        : 'border-white/10 bg-white/5 hover:border-white/20'
                    }`}
                  >
                    <div className="flex justify-between items-start mb-3">
                      <card.icon style={{ color: card.color }} size={20} />
                    </div>
                    <ScoreRing score={result[card.key].score} color={card.color} />
                    <p className="text-slate-400 text-sm mt-2 font-mono">{card.label}</p>
                  </motion.div>
                ))}
              </div>

              {/* Issues */}
              <motion.div
                key={active}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-white/5 border border-white/10 rounded-2xl p-6 mb-6"
              >
                <h3 className="text-white font-bold mb-4 font-mono">
                  {cards.find(c => c.key === active)?.label} Issues
                </h3>
                <div className="space-y-3">
                  {result[active].issues.map((issue, i) => (
                    <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-red-500/5 border border-red-500/20">
                      <div className="w-2 h-2 rounded-full bg-red-400 mt-1.5 flex-shrink-0" />
                      <p className="text-slate-300 text-sm">{issue}</p>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Recommendations */}
              <div className="bg-white/5 border border-white/10 rounded-2xl p-6 mb-6">
                <h3 className="text-white font-bold mb-4 font-mono">Top Recommendations</h3>
                <div className="space-y-3">
                  {result.recommendations.map((rec, i) => (
                    <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-[#00d4ff]/5 border border-[#00d4ff]/20">
                      <span className="text-[#00d4ff] font-mono text-xs mt-0.5">{String(i + 1).padStart(2, '0')}</span>
                      <p className="text-slate-300 text-sm">{rec}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Export */}
              <motion.button
                onClick={handleExport}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full flex items-center justify-center gap-3 py-4 rounded-xl border border-[#00d4ff]/30 text-[#00d4ff] hover:bg-[#00d4ff]/10 transition-all font-mono"
              >
                <HiDownload size={18} />
                Export Report
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}