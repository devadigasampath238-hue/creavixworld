import { useState } from 'react'
import { motion } from 'framer-motion'
import { HiMail, HiArrowRight } from 'react-icons/hi'
import { FaInstagram, FaTwitter, FaLinkedin, FaGithub } from 'react-icons/fa'

const links = {
  Services: ['Web Design', 'Mobile Apps', 'SaaS Development', 'AI Integration', 'UI/UX Design'],
  Tools: ['Website Auditor', 'Cost Calculator', 'ROI Calculator', 'Proposal Generator', 'Growth Advisor'],
  Company: ['About Us', 'Portfolio', 'Case Studies', 'Blog', 'Careers'],
  Legal: ['Privacy Policy', 'Terms of Service', 'Cookie Policy', 'Refund Policy'],
}

const socials = [
  { icon: FaInstagram, href: 'https://www.instagram.com/creavixworld', label: 'Instagram', color: '#ff006e' },
  { icon: FaTwitter, href: '#', label: 'Twitter', color: '#00d4ff' },
  { icon: FaLinkedin, href: '#', label: 'LinkedIn', color: '#0077b5' },
  { icon: FaGithub, href: '#', label: 'GitHub', color: '#9d4edd' },
]

export default function Footer() {
  const [email, setEmail] = useState('')
  const [subscribed, setSubscribed] = useState(false)

  const handleSubscribe = (e) => {
    e.preventDefault()
    if (!email) return
    setSubscribed(true)
    setEmail('')
    setTimeout(() => setSubscribed(false), 3000)
  }

  return (
    <footer className="bg-[#030508] border-t border-white/5 pt-16 pb-8 px-4">
      <div className="max-w-7xl mx-auto">

        {/* Top Section */}
        <div className="grid grid-cols-2 md:grid-cols-6 gap-8 mb-16">

          {/* Brand */}
          <div className="col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center text-black font-black text-sm"
                style={{ background: 'linear-gradient(135deg, #00d4ff, #9d4edd)' }}>
                CX
              </div>
              <span className="text-white font-black text-lg" style={{ fontFamily: 'Orbitron, monospace' }}>
                CREAVIX<span className="text-[#00d4ff]">.</span>WORLD
              </span>
            </div>
            <p className="text-slate-500 text-sm leading-relaxed mb-6">
              Building premium digital experiences for businesses that want to stand out. From stunning websites to AI-powered applications.
            </p>

            {/* Newsletter */}
            <form onSubmit={handleSubscribe} className="relative">
              <input
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="your@email.com"
                type="email"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 pr-12 text-white text-sm placeholder-slate-500 outline-none focus:border-[#00d4ff]/50 transition-all"
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-lg flex items-center justify-center"
                style={{ background: 'linear-gradient(135deg, #00d4ff, #9d4edd)' }}
              >
                <HiArrowRight className="text-black" size={14} />
              </button>
            </form>
            {subscribed && (
              <motion.p
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-[#22c55e] text-xs mt-2 font-mono"
              >
                ✓ Subscribed successfully!
              </motion.p>
            )}

            {/* Socials */}
            <div className="flex gap-3 mt-6">
              {socials.map(social => (
                <motion.a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.1, y: -2 }}
                  className="w-9 h-9 rounded-xl border border-white/10 flex items-center justify-center hover:border-white/30 transition-all"
                  style={{ background: 'rgba(255,255,255,0.05)' }}
                >
                  <social.icon style={{ color: social.color }} size={15} />
                </motion.a>
              ))}
            </div>
          </div>

          {/* Links */}
          {Object.entries(links).map(([category, items]) => (
            <div key={category}>
              <p className="text-white font-bold font-mono text-sm mb-4 tracking-wider">{category.toUpperCase()}</p>
              <ul className="space-y-2.5">
                {items.map(item => (
                  <li key={item}>
                    <a
                      href="#"
                      className="text-slate-500 text-sm hover:text-[#00d4ff] transition-colors"
                    >
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Contact Bar */}
        <div className="flex flex-wrap gap-4 items-center justify-between py-6 border-t border-white/5 border-b border-white/5 mb-8">
          <div className="flex items-center gap-2 text-slate-400 text-sm">
            <HiMail className="text-[#00d4ff]" />
            <a href="mailto:teamcreavixworld.org@gmail.com" className="hover:text-white transition-colors">
              teamcreavixworld.org@gmail.com
            </a>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-[#22c55e] animate-pulse" />
            <span className="text-slate-400 text-sm">Available for new projects</span>
          </div>
        </div>

        {/* Bottom */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-slate-600 text-sm font-mono">
            © {new Date().getFullYear()} CREAVIX WORLD. All rights reserved.
          </p>
          <p className="text-slate-600 text-sm">
            Built with <span className="text-[#ff006e]">♥</span> in Kundapura, Karnataka, India
          </p>
        </div>
      </div>
    </footer>
  )
}