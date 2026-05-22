import { useRef, useEffect, useState } from 'react'
import { motion, useInView } from 'framer-motion'
import { HiExternalLink } from 'react-icons/hi'
import { api } from '../../context/AuthContext'

export default function Portfolio() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true })
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/portfolio')
      .then(res => {
        const data = res.data
        // handle both {data:{items:[]}} and {items:[]}
        const items = data?.data?.items || data?.items || []
        setProjects(items)
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  return (
    <section id="portfolio" className="relative py-24 lg:py-32 overflow-hidden">
      <div className="absolute inset-0 opacity-20"
        style={{ background: 'radial-gradient(ellipse 60% 40% at 80% 50%, rgba(157,78,221,0.15) 0%, transparent 70%)' }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16" ref={ref}>
          <motion.div
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            className="inline-flex items-center gap-3 mb-4"
          >
            <div className="w-6 h-px bg-neon-purple" />
            <span className="font-mono text-xs text-neon-purple tracking-widest uppercase">Our Work</span>
            <div className="w-6 h-px bg-neon-purple" />
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.1 }}
            className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4"
          >
            Featured <span className="gradient-text-fire">Projects</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ delay: 0.2 }}
            className="font-body text-slate-400 max-w-xl mx-auto"
          >
            A showcase of our finest digital creations — each project a testament to innovation and craftsmanship.
          </motion.p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="glass rounded-xl overflow-hidden animate-pulse">
                <div className="h-44 bg-dark-700/50" />
                <div className="p-5 space-y-3">
                  <div className="h-4 bg-dark-700/50 rounded w-2/3" />
                  <div className="h-3 bg-dark-700/50 rounded w-full" />
                  <div className="h-3 bg-dark-700/50 rounded w-4/5" />
                </div>
              </div>
            ))}
          </div>
        ) : projects.length === 0 ? (
          <div className="text-center py-20">
            <p className="font-body text-slate-500 text-sm">No portfolio items yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {projects.map((p, i) => (
              <motion.div
                key={p._id}
                initial={{ opacity: 0, y: 40 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.1 + i * 0.1, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                className="group glass rounded-xl overflow-hidden hover:-translate-y-2 transition-all duration-400"
                style={{ borderColor: `${p.color}20` }}
              >
                <div className="h-44 relative overflow-hidden"
                  style={{ background: p.imageUrl ? undefined : `linear-gradient(135deg, ${p.color}10, rgba(3,5,8,0.9))` }}
                >
                  {p.imageUrl ? (
                    <img src={p.imageUrl} alt={p.title} className="w-full h-full object-cover" />
                  ) : (
                    <>
                      <div className="absolute inset-0 cyber-grid opacity-30" />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="font-display text-2xl font-black" style={{ color: p.color, opacity: 0.3 }}>
                          {p.title[0]}W
                        </div>
                      </div>
                    </>
                  )}
                  <div className="absolute top-3 left-3 flex gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-neon-pink/60" />
                    <div className="w-2.5 h-2.5 rounded-full bg-yellow-400/60" />
                    <div className="w-2.5 h-2.5 rounded-full bg-neon-cyan/60" />
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-dark-900/50">
                    {p.liveUrl ? (
                      <a href={p.liveUrl} target="_blank" rel="noopener noreferrer"
                        className="w-10 h-10 rounded-full border flex items-center justify-center"
                        style={{ borderColor: p.color, color: p.color }}>
                        <HiExternalLink size={18} />
                      </a>
                    ) : (
                      <div className="w-10 h-10 rounded-full border flex items-center justify-center"
                        style={{ borderColor: p.color, color: p.color }}>
                        <HiExternalLink size={18} />
                      </div>
                    )}
                  </div>
                </div>

                <div className="p-5">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-display text-sm font-semibold text-white group-hover:text-neon-blue transition-colors">
                      {p.title}
                    </h3>
                    <span className="font-mono text-xs px-2 py-0.5 rounded"
                      style={{ color: p.color, background: `${p.color}15`, border: `1px solid ${p.color}30` }}>
                      {p.category}
                    </span>
                  </div>
                  <p className="font-body text-xs text-slate-400 mb-4 leading-relaxed">{p.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {(p.tags || []).map(tag => (
                      <span key={tag} className="font-mono text-xs text-slate-500 px-2 py-0.5 rounded bg-dark-700/50 border border-slate-700/50">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}