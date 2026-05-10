import { motion } from 'framer-motion'
import { FaInstagram, FaEnvelope, FaHeart } from 'react-icons/fa'
import { RiCodeSSlashLine } from 'react-icons/ri'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  const links = {
    Company: ['About Us', 'Our Work', 'Blog', 'Careers'],
    Services: ['Web Design', 'UI/UX Design', 'Branding', 'E-commerce'],
    Legal: ['Privacy Policy', 'Terms of Service', 'Cookie Policy'],
  }

  return (
    <footer className="relative border-t border-neon-blue/10 bg-dark-900/80">
      {/* Top glow line */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-neon-blue/50 to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded border border-neon-blue/50 flex items-center justify-center bg-dark-800">
                <span className="font-display text-sm font-bold text-neon-blue">CX</span>
              </div>
              <span className="font-display text-lg font-bold tracking-widest text-white">
                CREAVIX<span className="text-neon-blue">.</span>WORLD
              </span>
            </div>
            <p className="text-slate-400 text-sm font-body leading-relaxed mb-6 max-w-xs">
              Building digital experiences that define the future. Premium web solutions for modern businesses worldwide.
            </p>
            <div className="flex items-center gap-4">
              <motion.a
                whileHover={{ scale: 1.1, y: -2 }}
                href="https://www.instagram.com/creavixworld"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded border border-neon-pink/30 flex items-center justify-center text-neon-pink hover:border-neon-pink hover:shadow-neon-pink transition-all duration-300"
              >
                <FaInstagram size={18} />
              </motion.a>
              <motion.a
                whileHover={{ scale: 1.1, y: -2 }}
                href="mailto:teamcreavixworld.org@gmail.com"
                className="w-10 h-10 rounded border border-neon-blue/30 flex items-center justify-center text-neon-blue hover:border-neon-blue hover:shadow-neon-blue transition-all duration-300"
              >
                <FaEnvelope size={18} />
              </motion.a>
            </div>
          </div>

          {/* Links */}
          {Object.entries(links).map(([title, items]) => (
            <div key={title}>
              <h4 className="font-display text-xs font-semibold text-neon-blue tracking-widest uppercase mb-4">
                {title}
              </h4>
              <ul className="space-y-3">
                {items.map(item => (
                  <li key={item}>
                    <a href="#" className="text-slate-400 hover:text-white text-sm font-body transition-colors duration-300">
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-6 border-t border-neon-blue/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-slate-500 text-sm font-body">
            <RiCodeSSlashLine className="text-neon-blue" size={16} />
            <span>© {currentYear} CREAVIX WORLD. All rights reserved.</span>
          </div>
          <div className="flex items-center gap-2 text-slate-500 text-xs font-body">
            <span>Crafted with</span>
            <FaHeart className="text-neon-pink animate-pulse" size={12} />
            <span>for the future</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
