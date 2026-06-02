import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { HiDocumentText, HiDownload, HiSparkles } from 'react-icons/hi'

const generateProposal = (data) => ({
  ...data,
  date: new Date().toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' }),
  scope: [
    'Discovery & Requirements Analysis',
    'UI/UX Design & Prototyping',
    'Frontend Development',
    'Backend API Development',
    'Database Architecture',
    'Testing & Quality Assurance',
    'Deployment & Launch',
    'Post-launch Support (30 days)',
  ],
  deliverables: [
    'Fully responsive website/application',
    'Admin dashboard & CMS',
    'API documentation',
    'Source code with documentation',
    'Deployment on cloud infrastructure',
    '30-day bug-fix warranty',
  ],
  breakdown: [
    { item: 'Discovery & Design', cost: Math.round(parseInt(data.budget) * 0.2) },
    { item: 'Frontend Development', cost: Math.round(parseInt(data.budget) * 0.3) },
    { item: 'Backend Development', cost: Math.round(parseInt(data.budget) * 0.3) },
    { item: 'Testing & Deployment', cost: Math.round(parseInt(data.budget) * 0.15) },
    { item: 'Support & Maintenance', cost: Math.round(parseInt(data.budget) * 0.05) },
  ],
})

export default function ProposalGenerator() {
  const [form, setForm] = useState({ clientName: '', company: '', projectType: '', budget: '', timeline: '' })
  const [loading, setLoading] = useState(false)
  const [proposal, setProposal] = useState(null)

  const handleChange = e => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))

  const handleGenerate = async () => {
    if (!form.clientName || !form.company || !form.projectType || !form.budget || !form.timeline) return
    setLoading(true)
    await new Promise(r => setTimeout(r, 2000))
    setProposal(generateProposal(form))
    setLoading(false)
  }

  const handleDownload = () => {
    if (!proposal) return
    const text = `
CREAVIX WORLD — PROJECT PROPOSAL
================================
Date: ${proposal.date}
Prepared for: ${proposal.clientName}
Company: ${proposal.company}

PROJECT OVERVIEW
Project Type: ${proposal.projectType}
Budget: ₹${parseInt(proposal.budget).toLocaleString()}
Timeline: ${proposal.timeline}

SCOPE OF WORK
${proposal.scope.map((s, i) => `${i + 1}. ${s}`).join('\n')}

DELIVERABLES
${proposal.deliverables.map((d, i) => `${i + 1}. ${d}`).join('\n')}

COST BREAKDOWN
${proposal.breakdown.map(b => `${b.item}: ₹${b.cost.toLocaleString()}`).join('\n')}
Total: ₹${parseInt(proposal.budget).toLocaleString()}

CREAVIX WORLD
teamcreavixworld.org@gmail.com
https://creavixworld.vercel.app
    `
    const blob = new Blob([text], { type: 'text/plain' })
    const a = document.createElement('a')
    a.href = URL.createObjectURL(blob)
    a.download = `proposal-${proposal.company.replace(/\s+/g, '-').toLowerCase()}.txt`
    a.click()
  }

  const inputClass = "w-full bg-white/5 border border-white/10 rounded-xl px-5 py-3.5 text-white placeholder-slate-500 outline-none focus:border-[#ff006e]/50 transition-all"

  return (
    <div className="min-h-screen bg-[#030508] py-20 px-4">
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#ff006e]/20 bg-[#ff006e]/5 mb-6">
            <HiSparkles className="text-[#ff006e]" />
            <span className="text-[#ff006e] text-sm font-mono tracking-widest">AI PROPOSAL GENERATOR</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-white mb-4" style={{ fontFamily: 'Orbitron, monospace' }}>
            Generate Proposal
          </h1>
          <p className="text-slate-400 text-lg">Create professional project proposals in seconds</p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8">

          {/* Form */}
          <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-4">
              <h2 className="text-white font-bold font-mono mb-4">Project Details</h2>

              {[
                { name: 'clientName', label: 'Client Name', placeholder: 'John Smith' },
                { name: 'company', label: 'Company', placeholder: 'Acme Corp' },
                { name: 'projectType', label: 'Project Type', placeholder: 'E-commerce Website' },
                { name: 'budget', label: 'Budget (₹)', placeholder: '150000', type: 'number' },
                { name: 'timeline', label: 'Timeline', placeholder: '2 Months' },
              ].map(field => (
                <div key={field.name}>
                  <label className="text-slate-400 text-xs font-mono uppercase tracking-wider block mb-2">{field.label}</label>
                  <input
                    name={field.name}
                    value={form[field.name]}
                    onChange={handleChange}
                    placeholder={field.placeholder}
                    type={field.type || 'text'}
                    className={inputClass}
                  />
                </div>
              ))}

              <motion.button
                onClick={handleGenerate}
                disabled={loading}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full py-4 rounded-xl font-bold text-black disabled:opacity-40 flex items-center justify-center gap-2 mt-2"
                style={{ background: 'linear-gradient(135deg, #ff006e, #9d4edd)' }}
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                    Generating...
                  </>
                ) : (
                  <><HiSparkles /> Generate Proposal</>
                )}
              </motion.button>
            </div>
          </motion.div>

          {/* Proposal Preview */}
          <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}>
            <AnimatePresence>
              {proposal ? (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white/5 border border-white/10 rounded-2xl p-6 h-full"
                >
                  {/* Header */}
                  <div className="border-b border-white/10 pb-4 mb-5">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-[#ff006e] text-xs font-mono tracking-widest mb-1">CREAVIX WORLD</p>
                        <h3 className="text-white text-xl font-black" style={{ fontFamily: 'Orbitron, monospace' }}>
                          PROJECT PROPOSAL
                        </h3>
                      </div>
                      <p className="text-slate-500 text-xs font-mono">{proposal.date}</p>
                    </div>
                    <p className="text-slate-400 text-sm mt-2">Prepared for: <span className="text-white">{proposal.clientName}</span> — {proposal.company}</p>
                  </div>

                  {/* Overview */}
                  <div className="grid grid-cols-3 gap-3 mb-5">
                    {[
                      { label: 'Type', value: proposal.projectType },
                      { label: 'Budget', value: `₹${parseInt(proposal.budget).toLocaleString()}` },
                      { label: 'Timeline', value: proposal.timeline },
                    ].map((item, i) => (
                      <div key={i} className="p-3 rounded-xl bg-white/5 text-center">
                        <p className="text-slate-500 text-xs font-mono mb-1">{item.label}</p>
                        <p className="text-white text-sm font-bold">{item.value}</p>
                      </div>
                    ))}
                  </div>

                  {/* Scope */}
                  <div className="mb-5">
                    <p className="text-slate-400 text-xs font-mono uppercase tracking-wider mb-3">Scope of Work</p>
                    <div className="space-y-1.5">
                      {proposal.scope.slice(0, 5).map((s, i) => (
                        <div key={i} className="flex items-center gap-2 text-sm text-slate-300">
                          <div className="w-1.5 h-1.5 rounded-full bg-[#ff006e]" />
                          {s}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Cost Breakdown */}
                  <div className="mb-5">
                    <p className="text-slate-400 text-xs font-mono uppercase tracking-wider mb-3">Cost Breakdown</p>
                    <div className="space-y-2">
                      {proposal.breakdown.map((b, i) => (
                        <div key={i} className="flex justify-between text-sm">
                          <span className="text-slate-400">{b.item}</span>
                          <span className="text-white font-mono">₹{b.cost.toLocaleString()}</span>
                        </div>
                      ))}
                      <div className="flex justify-between text-sm border-t border-white/10 pt-2 mt-2">
                        <span className="text-white font-bold">Total</span>
                        <span className="text-[#ff006e] font-mono font-bold">₹{parseInt(proposal.budget).toLocaleString()}</span>
                      </div>
                    </div>
                  </div>

                  {/* Download */}
                  <motion.button
                    onClick={handleDownload}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border border-[#ff006e]/30 text-[#ff006e] hover:bg-[#ff006e]/10 transition-all font-mono text-sm"
                  >
                    <HiDownload /> Download Proposal
                  </motion.button>
                </motion.div>
              ) : (
                <div className="h-full flex items-center justify-center">
                  <div className="text-center">
                    <HiDocumentText className="text-slate-600 mx-auto mb-3" size={48} />
                    <p className="text-slate-500 font-mono text-sm">Fill the form to generate your proposal</p>
                  </div>
                </div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </div>
  )
}