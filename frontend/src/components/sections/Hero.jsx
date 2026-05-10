import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { HiArrowRight } from 'react-icons/hi'
import { RiInstagramLine, RiMailLine } from 'react-icons/ri'

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1, delayChildren: 0.2 } }
}
const fadeUp = {
  hidden: { opacity: 0, y: 50 },
  show: { opacity: 1, y: 0, transition: { duration: 0.9, ease: [0.22, 1, 0.36, 1] } }
}
const fadeIn = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 1.2 } }
}

export default function Hero() {
  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">

      {/* Cyber grid */}
      <div className="absolute inset-0 cyber-grid opacity-50" />

      {/* Radial glow */}
      <div className="absolute inset-0" style={{
        background: 'radial-gradient(ellipse 100% 80% at 50% 30%, rgba(0,212,255,0.06) 0%, rgba(157,78,221,0.05) 35%, rgba(255,0,110,0.02) 60%, transparent 80%)'
      }} />

      {/* Top left corner bracket */}
      <motion.div
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1.2, duration: 0.5 }}
        className="absolute top-24 left-6 sm:left-12"
      >
        <div className="w-16 h-16 border-l-2 border-t-2 border-neon-blue/40" />
      </motion.div>
      <motion.div
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1.3, duration: 0.5 }}
        className="absolute top-24 right-6 sm:right-12"
      >
        <div className="w-16 h-16 border-r-2 border-t-2 border-neon-purple/40" />
      </motion.div>
      <motion.div
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1.4, duration: 0.5 }}
        className="absolute bottom-20 left-6 sm:left-12"
      >
        <div className="w-16 h-16 border-l-2 border-b-2 border-neon-pink/40" />
      </motion.div>
      <motion.div
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1.5, duration: 0.5 }}
        className="absolute bottom-20 right-6 sm:right-12"
      >
        <div className="w-16 h-16 border-r-2 border-b-2 border-neon-cyan/40" />
      </motion.div>

      {/* Floating orbs */}
      <motion.div
        animate={{ scale: [1, 1.3, 1], opacity: [0.2, 0.5, 0.2] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute top-1/3 left-1/4 w-72 h-72 rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(0,212,255,0.06) 0%, transparent 70%)' }}
      />
      <motion.div
        animate={{ scale: [1, 1.2, 1], opacity: [0.15, 0.4, 0.15] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut', delay: 3 }}
        className="absolute bottom-1/3 right-1/4 w-96 h-96 rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(157,78,221,0.06) 0%, transparent 70%)' }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">

          {/* LEFT — Text content */}
          <motion.div variants={stagger} initial="hidden" animate="show" className="text-center lg:text-left order-2 lg:order-1">

            {/* Badge */}
            <motion.div variants={fadeUp} className="inline-flex items-center gap-3 mb-8">
              <div className="flex items-center gap-2 glass px-4 py-2 rounded-full">
                <div className="w-2 h-2 rounded-full bg-neon-cyan animate-pulse" />
                <span className="font-mono text-xs text-neon-cyan tracking-[0.3em] uppercase">Premium Digital Agency</span>
                <div className="w-2 h-2 rounded-full bg-neon-cyan animate-pulse" />
              </div>
            </motion.div>

            {/* Main heading */}
            <motion.div variants={fadeUp} className="mb-6">
              <h1 className="font-display font-black leading-none tracking-tight">
                <span className="block text-white text-4xl sm:text-5xl lg:text-6xl xl:text-7xl mb-1">BUILDING</span>
                <span className="block gradient-text-primary text-4xl sm:text-5xl lg:text-6xl xl:text-7xl mb-1" style={{ lineHeight: 1.1 }}>DIGITAL</span>
                <span className="block text-white text-4xl sm:text-5xl lg:text-6xl xl:text-7xl">EXPERIENCES</span>
              </h1>
            </motion.div>

            {/* Subtitle */}
            <motion.p variants={fadeUp} className="font-body text-slate-400 text-lg sm:text-xl mb-10 leading-relaxed max-w-xl mx-auto lg:mx-0">
              Modern Websites For Modern Businesses.
              <br />
              <span className="text-neon-blue font-medium">Premium design</span> •{' '}
              <span className="text-neon-purple font-medium">Cutting-edge tech</span> •{' '}
              <span className="text-neon-pink font-medium">Infinite impact</span>
            </motion.p>

            {/* CTAs */}
            <motion.div variants={fadeUp} className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 mb-12">
              <Link to="/signup" className="btn-glow group">
                Get Started
                <HiArrowRight className="group-hover:translate-x-1 transition-transform" size={16} />
              </Link>
              <a href="#portfolio" className="btn-primary">
                View Our Work
              </a>
            </motion.div>

            {/* Stats */}
            <motion.div variants={fadeUp} className="grid grid-cols-3 gap-4 max-w-sm mx-auto lg:mx-0">
              {[
                { val: '50+', label: 'Projects' },
                { val: '30+', label: 'Clients' },
                { val: '5★', label: 'Rating' },
              ].map((stat) => (
                <div key={stat.label} className="glass rounded-xl p-4 text-center">
                  <div className="font-display text-xl font-black neon-text-blue mb-1">{stat.val}</div>
                  <div className="font-body text-xs text-slate-500 tracking-wide">{stat.label}</div>
                </div>
              ))}
            </motion.div>

            {/* Social links */}
            <motion.div variants={fadeIn} className="flex items-center justify-center lg:justify-start gap-4 mt-8">
              <a
                href="https://www.instagram.com/creavixworld"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-slate-500 hover:text-neon-pink transition-all duration-300 font-body text-sm group"
              >
                <RiInstagramLine size={18} className="group-hover:scale-110 transition-transform" />
                @creavixworld
              </a>
              <span className="text-slate-700">•</span>
              <a
                href="mailto:teamcreavixworld.org@gmail.com"
                className="flex items-center gap-2 text-slate-500 hover:text-neon-blue transition-all duration-300 font-body text-sm group"
              >
                <RiMailLine size={18} className="group-hover:scale-110 transition-transform" />
                Email Us
              </a>
            </motion.div>
          </motion.div>

          {/* RIGHT — Logo */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1], delay: 0.3 }}
            className="flex items-center justify-center order-1 lg:order-2 relative"
          >
            {/* Outer ring glow */}
            <div className="absolute w-80 h-80 sm:w-96 sm:h-96 rounded-full"
              style={{ background: 'radial-gradient(circle, rgba(0,212,255,0.08) 0%, rgba(157,78,221,0.06) 50%, transparent 70%)' }}
            />

            {/* Animated rings */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
              className="absolute w-72 h-72 sm:w-80 sm:h-80 rounded-full border border-neon-blue/10"
              style={{ borderStyle: 'dashed' }}
            />
            <motion.div
              animate={{ rotate: -360 }}
              transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
              className="absolute w-60 h-60 sm:w-72 sm:h-72 rounded-full border border-neon-purple/10"
              style={{ borderStyle: 'dashed' }}
            />

            {/* Pulsing dots on ring */}
            {[0, 90, 180, 270].map((deg, i) => (
              <motion.div
                key={i}
                animate={{ opacity: [0.3, 1, 0.3], scale: [0.8, 1.2, 0.8] }}
                transition={{ duration: 2, repeat: Infinity, delay: i * 0.5 }}
                className="absolute w-2 h-2 rounded-full bg-neon-blue"
                style={{
                  top: '50%',
                  left: '50%',
                  transform: `rotate(${deg}deg) translateX(155px) translateY(-4px)`,
                }}
              />
            ))}

            {/* Logo container */}
            <div className="relative z-10">
              {/* Glow behind logo */}
              <div className="absolute inset-0 rounded-full"
                style={{ background: 'radial-gradient(circle, rgba(0,212,255,0.15) 0%, transparent 70%)', filter: 'blur(20px)' }}
              />
              {/* Logo SVG — matches CREAVIX WORLD brand */}
              <motion.div
                className="logo-float w-52 h-52 sm:w-64 sm:h-64 lg:w-72 lg:h-72 relative"
              >
                <svg viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
                  <defs>
                    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#020408" />
                      <stop offset="100%" stopColor="#060a10" />
                    </linearGradient>
                    <linearGradient id="cGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#00d4ff" />
                      <stop offset="50%" stopColor="#7b2fff" />
                      <stop offset="100%" stopColor="#9d4edd" />
                    </linearGradient>
                    <linearGradient id="wGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#9d4edd" />
                      <stop offset="50%" stopColor="#ff006e" />
                      <stop offset="100%" stopColor="#7b2fff" />
                    </linearGradient>
                    <linearGradient id="orbitGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#00d4ff" stopOpacity="0" />
                      <stop offset="50%" stopColor="#00d4ff" />
                      <stop offset="100%" stopColor="#9d4edd" stopOpacity="0" />
                    </linearGradient>
                    <filter id="glow">
                      <feGaussianBlur stdDeviation="4" result="blur" />
                      <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
                    </filter>
                    <filter id="strongGlow">
                      <feGaussianBlur stdDeviation="8" result="blur" />
                      <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
                    </filter>
                  </defs>

                  {/* Background circle */}
                  <circle cx="200" cy="200" r="180" fill="url(#bgGrad)" stroke="rgba(0,212,255,0.15)" strokeWidth="1" />

                  {/* Outer glow ring */}
                  <circle cx="200" cy="200" r="175" fill="none" stroke="url(#orbitGrad)" strokeWidth="1" opacity="0.4" />

                  {/* Big C letter */}
                  <path
                    d="M280 120 C220 80 120 100 110 200 C100 300 180 330 260 295"
                    fill="none"
                    stroke="url(#cGrad)"
                    strokeWidth="45"
                    strokeLinecap="round"
                    filter="url(#glow)"
                  />
                  {/* C inner lighter */}
                  <path
                    d="M280 120 C220 80 120 100 110 200 C100 300 180 330 260 295"
                    fill="none"
                    stroke="rgba(255,255,255,0.15)"
                    strokeWidth="12"
                    strokeLinecap="round"
                  />

                  {/* W letter */}
                  <path
                    d="M155 145 L175 240 L200 195 L225 240 L245 145"
                    fill="none"
                    stroke="url(#wGrad)"
                    strokeWidth="22"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    filter="url(#glow)"
                  />

                  {/* Orbit ellipse */}
                  <ellipse
                    cx="200" cy="210"
                    rx="140" ry="40"
                    fill="none"
                    stroke="url(#orbitGrad)"
                    strokeWidth="3"
                    opacity="0.7"
                    filter="url(#glow)"
                  />

                  {/* Star/sparkle */}
                  <g filter="url(#glow)">
                    <line x1="290" y1="95" x2="290" y2="115" stroke="#00fff5" strokeWidth="2.5" strokeLinecap="round" />
                    <line x1="280" y1="105" x2="300" y2="105" stroke="#00fff5" strokeWidth="2.5" strokeLinecap="round" />
                    <line x1="283" y1="98" x2="297" y2="112" stroke="#00fff5" strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />
                    <line x1="297" y1="98" x2="283" y2="112" stroke="#00fff5" strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />
                  </g>

                  {/* Small accent dots */}
                  <circle cx="110" cy="200" r="5" fill="#00d4ff" filter="url(#glow)" />
                  <circle cx="268" cy="295" r="4" fill="#9d4edd" filter="url(#glow)" />
                </svg>
              </motion.div>

              {/* Scanning line effect */}
              <motion.div
                animate={{ top: ['10%', '90%', '10%'] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute left-4 right-4 h-px opacity-30"
                style={{ background: 'linear-gradient(90deg, transparent, #00d4ff, transparent)' }}
              />
            </div>
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <span className="font-mono text-xs text-slate-600 tracking-widest uppercase">Scroll</span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="w-px h-8 bg-gradient-to-b from-neon-blue to-transparent"
        />
      </motion.div>
    </section>
  )
}