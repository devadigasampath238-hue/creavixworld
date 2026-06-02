import { motion } from 'framer-motion'

const logos = [
  'TechStart', 'StyleCraft', 'DataFlow', 'GrowthLabs',
  'NexaFintech', 'CloudPeak', 'PixelForge', 'SwiftBuild',
  'InnovateCo', 'DigitalEdge', 'SmartSuite', 'FutureTech',
]

function MarqueeRow({ reverse = false }) {
  return (
    <div className="flex overflow-hidden">
      <motion.div
        className="flex gap-8 shrink-0"
        animate={{ x: reverse ? ['0%', '100%'] : ['0%', '-100%'] }}
        transition={{ duration: 25, ease: 'linear', repeat: Infinity }}
        style={{ minWidth: 'max-content' }}
      >
        {[...logos, ...logos].map((logo, i) => (
          <div
            key={i}
            className="flex items-center justify-center px-8 py-4 rounded-xl border border-white/10 bg-white/5 hover:border-[#00d4ff]/30 hover:bg-white/10 transition-all cursor-default shrink-0"
          >
            <span className="text-slate-400 font-bold font-mono text-sm tracking-wider hover:text-white transition-colors">
              {logo}
            </span>
          </div>
        ))}
      </motion.div>
    </div>
  )
}

export default function ClientLogos() {
  return (
    <section className="py-16 px-4 bg-[#030508] overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center text-slate-500 font-mono text-sm tracking-widest mb-10 uppercase"
        >
          Trusted by innovative companies
        </motion.p>
        <div className="space-y-4">
          <MarqueeRow />
          <MarqueeRow reverse />
        </div>
      </div>
    </section>
  )
}