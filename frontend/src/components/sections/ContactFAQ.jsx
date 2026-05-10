import { useRef, useState } from 'react'
import { motion, useInView, AnimatePresence } from 'framer-motion'
import { HiChevronDown, HiMail } from 'react-icons/hi'
import { FaInstagram } from 'react-icons/fa'

const faqs = [
  { q: 'How long does it take to build my website?', a: 'Timelines vary by package: Starter (7 days), Business (14 days), Premium (21–30 days). Rush delivery available.' },
  { q: 'Do you provide hosting and domain setup?', a: 'Yes, we assist with complete hosting setup, domain configuration, SSL certificates, and deployment.' },
  { q: 'Can I update my website after it launches?', a: 'Absolutely. We provide training, documentation, and optional ongoing maintenance packages.' },
  { q: 'What payment methods do you accept?', a: 'We accept bank transfers, PayPal, credit/debit cards, and crypto. 50% upfront, 50% on delivery.' },
  { q: 'Do you offer post-launch support?', a: 'All packages include free support (30–180 days based on plan), with extended support available.' },
]

function FAQItem({ faq, index }) {
  const [open, setOpen] = useState(false)
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08 }}
      className="border border-neon-blue/10 rounded-lg overflow-hidden hover:border-neon-blue/25 transition-colors"
    >
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between p-5 text-left"
      >
        <span className="font-body text-sm font-medium text-white pr-4">{faq.q}</span>
        <motion.div animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.3 }}>
          <HiChevronDown className="text-neon-blue flex-shrink-0" size={18} />
        </motion.div>
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <p className="px-5 pb-5 font-body text-sm text-slate-400 leading-relaxed">{faq.a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

export function FAQ() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true })
  return (
    <section className="py-24 lg:py-32">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12" ref={ref}>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            className="font-display text-3xl sm:text-4xl font-bold text-white"
          >
            Frequently Asked <span className="gradient-text-primary">Questions</span>
          </motion.h2>
        </div>
        <div className="space-y-3">
          {faqs.map((faq, i) => <FAQItem key={i} faq={faq} index={i} />)}
        </div>
      </div>
    </section>
  )
}

export function Contact() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true })

  return (
    <section id="contact" className="relative py-24 lg:py-32 overflow-hidden">
      <div className="absolute inset-0"
        style={{ background: 'radial-gradient(ellipse 80% 60% at 50% 50%, rgba(0,212,255,0.05) 0%, transparent 70%)' }}
      />
      <div className="absolute inset-0 cyber-grid opacity-30" />

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center" ref={ref}>
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          className="inline-flex items-center gap-3 mb-6"
        >
          <div className="w-6 h-px bg-neon-blue" />
          <span className="font-mono text-xs text-neon-blue tracking-widest uppercase">Get In Touch</span>
          <div className="w-6 h-px bg-neon-blue" />
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.1 }}
          className="font-display text-3xl sm:text-5xl lg:text-6xl font-black text-white mb-6 leading-tight"
        >
          Ready to Build<br />
          <span className="gradient-text-primary">Something Epic?</span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.2 }}
          className="font-body text-slate-400 text-lg mb-10 max-w-xl mx-auto"
        >
          Let's turn your vision into a digital masterpiece. Reach out and let's start creating.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <a
            href="mailto:teamcreavixworld.org@gmail.com"
            className="btn-glow flex items-center gap-3 group"
          >
            <HiMail size={18} />
            Email Us
          </a>
          <a
            href="https://www.instagram.com/creavixworld"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary flex items-center gap-3"
          >
            <FaInstagram size={18} />
            Instagram
          </a>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.4 }}
          className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-6 text-sm font-body text-slate-500"
        >
          <a href="mailto:teamcreavixworld.org@gmail.com" className="hover:text-neon-blue transition-colors">
            teamcreavixworld.org@gmail.com
          </a>
          <span className="hidden sm:block text-slate-700">•</span>
          <a href="https://www.instagram.com/creavixworld" target="_blank" rel="noopener noreferrer" className="hover:text-neon-pink transition-colors">
            @creavixworld
          </a>
        </motion.div>
      </div>
    </section>
  )
}
