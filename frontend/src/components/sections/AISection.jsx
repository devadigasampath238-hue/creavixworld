import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import {
  RiRobot2Line, RiImageAiLine, RiFlowChart, RiVoiceprintLine,
  RiBrainLine, RiBarChartBoxLine
} from 'react-icons/ri'

const aiCards = [
  {
    icon: RiRobot2Line,
    title: 'AI Chatbots',
    desc: 'Intelligent conversational agents that handle customer queries 24/7 with natural language understanding.',
    color: '#00d4ff',
    tags: ['NLP', 'GPT-4', 'Real-time'],
  },
  {
    icon: RiImageAiLine,
    title: 'AI Image Generation',
    desc: 'Generate stunning visuals, product mockups, and creative assets using state-of-the-art AI models.',
    color: '#9d4edd',
    tags: ['DALL-E', 'Stable Diffusion', 'Midjourney'],
  },
  {
    icon: RiFlowChart,
    title: 'AI Automation',
    desc: 'Streamline workflows, automate repetitive tasks, and integrate intelligent decision-making into your systems.',
    color: '#ff006e',
    tags: ['n8n', 'Zapier AI', 'LangChain'],
  },
  {
    icon: RiVoiceprintLine,
    title: 'AI Voice Assistant',
    desc: 'Build voice-enabled interfaces with speech recognition and natural language synthesis capabilities.',
    color: '#00fff5',
    tags: ['Whisper', 'TTS', 'Voice UI'],
  },
  {
    icon: RiBrainLine,
    title: 'AI Recommendation Engine',
    desc: 'Personalize user experiences with intelligent recommendation systems trained on your data.',
    color: '#7b2fff',
    tags: ['ML Models', 'Collaborative Filtering', 'Real-time'],
  },
  {
    icon: RiBarChartBoxLine,
    title: 'AI Data Analysis',
    desc: 'Extract insights from complex datasets with AI-powered analytics, forecasting, and visualization.',
    color: '#f59e0b',
    tags: ['Predictive', 'Dashboards', 'Python AI'],
  },
]

export default function AISection() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true })

  return (
    <section id="ai" className="relative py-24 lg:py-32 overflow-hidden">
      {/* BG glow */}
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse 80% 60% at 50% 50%, rgba(157,78,221,0.05) 0%, rgba(0,212,255,0.03) 40%, transparent 70%)' }} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16" ref={ref}>
          <motion.div initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}}
            className="inline-flex items-center gap-3 mb-4">
            <div className="w-6 h-px bg-neon-purple" />
            <span className="font-mono text-xs text-neon-purple tracking-widest uppercase">Next Generation</span>
            <div className="w-6 h-px bg-neon-purple" />
          </motion.div>
          <motion.h2 initial={{ opacity: 0, y: 30 }} animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.1 }}
            className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
            AI-Powered <span className="gradient-text-fire">Solutions</span>
          </motion.h2>
          <motion.p initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}} transition={{ delay: 0.2 }}
            className="font-body text-slate-400 max-w-2xl mx-auto text-lg">
            We integrate cutting-edge artificial intelligence into every product we build — making your business smarter, faster, and future-proof.
          </motion.p>
        </div>

        {/* Cards grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {aiCards.map((card, i) => {
            const Icon = card.icon
            return (
              <motion.div
                key={card.title}
                initial={{ opacity: 0, y: 40 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.1 + i * 0.08, duration: 0.7 }}
                className="group relative rounded-2xl p-6 overflow-hidden cursor-default"
                style={{
                  background: 'linear-gradient(135deg, rgba(10,16,32,0.8), rgba(6,10,20,0.95))',
                  border: `1px solid ${card.color}18`,
                  transition: 'all 0.4s cubic-bezier(0.22,1,0.36,1)',
                }}
                whileHover={{ y: -8, borderColor: card.color + '40' }}
              >
                {/* BG glow on hover */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-2xl"
                  style={{ background: `radial-gradient(circle at 30% 30%, ${card.color}08 0%, transparent 60%)` }} />

                {/* Top accent line */}
                <div className="absolute top-0 left-0 right-0 h-px opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{ background: `linear-gradient(90deg, transparent, ${card.color}, transparent)` }} />

                {/* Icon */}
                <div className="relative w-14 h-14 rounded-xl mb-5 flex items-center justify-center"
                  style={{
                    background: `linear-gradient(135deg, ${card.color}15, ${card.color}08)`,
                    border: `1px solid ${card.color}30`,
                    boxShadow: `0 0 20px ${card.color}10`,
                    transition: 'all 0.3s ease',
                  }}>
                  <Icon size={26} style={{ color: card.color }} />
                  {/* Pulse ring */}
                  <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity"
                    style={{ boxShadow: `0 0 15px ${card.color}40` }} />
                </div>

                {/* Content */}
                <h3 className="font-display text-sm font-bold text-white mb-3 tracking-wide group-hover:text-neon-blue transition-colors duration-300">
                  {card.title}
                </h3>
                <p className="font-body text-sm text-slate-400 leading-relaxed mb-4">{card.desc}</p>

                {/* Tags */}
                <div className="flex flex-wrap gap-2">
                  {card.tags.map(tag => (
                    <span key={tag} className="font-mono text-xs px-2 py-0.5 rounded"
                      style={{ background: `${card.color}10`, color: card.color, border: `1px solid ${card.color}25` }}>
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Bottom AI indicator */}
                <div className="flex items-center gap-2 mt-5 pt-4 border-t opacity-0 group-hover:opacity-100 transition-all duration-300"
                  style={{ borderColor: `${card.color}20` }}>
                  <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: card.color }} />
                  <span className="font-mono text-xs" style={{ color: card.color }}>AI-Ready Integration</span>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
