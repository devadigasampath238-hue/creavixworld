import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '../../context/AuthContext'
import { HiMenuAlt3, HiX } from 'react-icons/hi'
import { RiDashboardLine } from 'react-icons/ri'

const navLinks = [
  { label: 'Home', href: '/#home' },
  { label: 'Services', href: '/#services' },
  { label: 'Portfolio', href: '/#portfolio' },
  { label: 'Pricing', href: '/#pricing' },
  { label: 'Contact', href: '/#contact' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const { user, logout } = useAuth()
  const location = useLocation()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => setMobileOpen(false), [location])

  return (
    <>
      <motion.nav
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled ? 'glass-dark shadow-[0_1px_0_rgba(0,212,255,0.1)]' : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-20">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3 group">
              <div className="relative">
                <div className="w-9 h-9 rounded border border-neon-blue/50 flex items-center justify-center bg-dark-800/80 group-hover:border-neon-blue transition-all duration-300 group-hover:shadow-neon-blue">
                  <span className="font-display text-xs font-bold text-neon-blue">CX</span>
                </div>
                <div className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-neon-cyan animate-pulse" />
              </div>
              <span className="font-display text-sm sm:text-base font-bold tracking-widest text-white group-hover:neon-text-blue transition-all duration-300">
                CREAVIX<span className="text-neon-blue">.</span>WORLD
              </span>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden lg:flex items-center gap-8">
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="font-body text-sm text-slate-400 hover:text-neon-blue transition-all duration-300 relative group tracking-wide"
                >
                  {link.label}
                  <span className="absolute -bottom-1 left-0 w-0 h-px bg-neon-blue group-hover:w-full transition-all duration-300" />
                </a>
              ))}
            </div>

            {/* CTA */}
            <div className="hidden lg:flex items-center gap-4">
              {user ? (
                <>
                  <Link
                    to={user.role === 'admin' ? '/admin' : '/dashboard'}
                    className="flex items-center gap-2 text-sm text-neon-blue border border-neon-blue/30 px-4 py-2 rounded hover:bg-neon-blue/10 transition-all duration-300 font-body"
                  >
                    <RiDashboardLine size={16} />
                    Dashboard
                  </Link>
                  <button onClick={logout} className="btn-secondary text-xs py-2 px-5">
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" className="text-sm text-slate-400 hover:text-neon-blue transition-colors font-body tracking-wide">
                    Login
                  </Link>
                  <Link to="/signup" className="btn-primary text-xs py-2 px-6">
                    Get Started
                  </Link>
                </>
              )}
            </div>

            {/* Mobile menu button */}
            <button
              className="lg:hidden text-neon-blue p-2"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle menu"
            >
              {mobileOpen ? <HiX size={24} /> : <HiMenuAlt3 size={24} />}
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="mobile-menu fixed top-16 left-0 right-0 z-40 p-6"
          >
            <div className="flex flex-col gap-4">
              {navLinks.map((link, i) => (
                <motion.a
                  key={link.label}
                  href={link.href}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="text-slate-300 hover:text-neon-blue transition-colors font-body text-base py-2 border-b border-neon-blue/10"
                >
                  {link.label}
                </motion.a>
              ))}
              <div className="flex flex-col gap-3 pt-4">
                {user ? (
                  <>
                    <Link to={user.role === 'admin' ? '/admin' : '/dashboard'} className="btn-primary text-center text-xs py-3">
                      Dashboard
                    </Link>
                    <button onClick={logout} className="btn-secondary text-center text-xs py-3">Logout</button>
                  </>
                ) : (
                  <>
                    <Link to="/login" className="btn-secondary text-center text-xs py-3">Login</Link>
                    <Link to="/signup" className="btn-glow text-center text-xs py-3">Get Started</Link>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
