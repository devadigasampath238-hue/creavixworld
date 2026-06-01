import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { motion, AnimatePresence } from 'framer-motion'
import toast from 'react-hot-toast'
import { HiMail, HiArrowLeft, HiCheckCircle } from 'react-icons/hi'
import { RiShieldKeyholeLine, RiMailSendLine } from 'react-icons/ri'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function ForgotPassword() {
  const { forgotPassword } = useAuth()
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [email, setEmail] = useState('')
  const { register, handleSubmit, formState: { errors } } = useForm()

  const onSubmit = async (data) => {
    setLoading(true)
    try {
      await forgotPassword(data.email)
      setEmail(data.email)
      setSent(true)
      toast.success('Reset link sent!')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to send reset link')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-dark-900 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 cyber-grid opacity-40" />
      <div className="absolute inset-0" style={{
        background: 'radial-gradient(ellipse 60% 60% at 50% 40%, rgba(157,78,221,0.08) 0%, rgba(0,212,255,0.04) 50%, transparent 70%)'
      }} />

      {/* Corner brackets */}
      <div className="absolute top-6 left-6 w-12 h-12 border-l-2 border-t-2 border-neon-purple/30" />
      <div className="absolute top-6 right-6 w-12 h-12 border-r-2 border-t-2 border-neon-blue/30" />
      <div className="absolute bottom-6 left-6 w-12 h-12 border-l-2 border-b-2 border-neon-cyan/30" />
      <div className="absolute bottom-6 right-6 w-12 h-12 border-r-2 border-b-2 border-neon-pink/30" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 w-full max-w-md"
      >
        {/* Logo */}
        <div className="text-center mb-6">
          <Link to="/" className="inline-flex items-center justify-center gap-3 group">
            <div className="w-11 h-11 rounded-lg border border-neon-blue/50 flex items-center justify-center bg-dark-800 group-hover:shadow-neon-blue transition-all">
              <span className="font-display text-sm font-bold text-neon-blue">CX</span>
            </div>
            <span className="font-display text-lg font-bold tracking-widest text-white">
              CREAVIX<span className="text-neon-blue">.</span>WORLD
            </span>
          </Link>
        </div>

        <div className="glass rounded-2xl overflow-hidden" style={{ border: '1px solid rgba(157,78,221,0.2)' }}>
          {/* Header bar */}
          <div className="h-1 w-full" style={{ background: 'linear-gradient(90deg, #00d4ff, #9d4edd, #ff006e)' }} />

          <div className="p-8">
            <AnimatePresence mode="wait">
              {!sent ? (
                <motion.div key="form" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}>
                  {/* Icon */}
                  <div className="flex justify-center mb-6">
                    <div className="w-16 h-16 rounded-2xl flex items-center justify-center"
                      style={{ background: 'rgba(157,78,221,0.1)', border: '1px solid rgba(157,78,221,0.3)', boxShadow: '0 0 30px rgba(157,78,221,0.15)' }}>
                      <RiShieldKeyholeLine size={32} style={{ color: '#9d4edd' }} />
                    </div>
                  </div>

                  <div className="text-center mb-7">
                    <div className="w-12 h-px mx-auto mb-4" style={{ background: 'linear-gradient(90deg, transparent, #9d4edd, transparent)' }} />
                    <h1 className="font-display text-xl font-bold text-white mb-2">Forgot Password?</h1>
                    <p className="font-body text-sm text-slate-400 leading-relaxed">
                      No worries! Enter your email and we'll send you a secure reset link.
                    </p>
                  </div>

                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                    <div>
                      <label className="font-body text-xs text-slate-400 uppercase tracking-wider block mb-2">
                        Email Address
                      </label>
                      <div className="relative">
                        <HiMail className="absolute left-4 top-1/2 -translate-y-1/2 z-10 pointer-events-none"
                          size={16} style={{ color: '#9d4edd' }} />
                        <input
                          {...register('email', {
                            required: 'Email is required',
                            pattern: { value: /\S+@\S+\.\S+/, message: 'Invalid email address' }
                          })}
                          type="email"
                          placeholder="your@email.com"
                          className="cyber-input pl-11"
                          style={{ borderColor: errors.email ? 'rgba(255,0,110,0.5)' : '' }}
                        />
                      </div>
                      {errors.email && (
                        <motion.p initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }}
                          className="text-neon-pink text-xs mt-1.5 flex items-center gap-1">
                          ⚠ {errors.email.message}
                        </motion.p>
                      )}
                    </div>

                    <motion.button
                      type="submit"
                      disabled={loading}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full py-3.5 rounded-lg font-display text-xs font-bold tracking-widest uppercase text-white flex items-center justify-center gap-2 disabled:opacity-60"
                      style={{ background: 'linear-gradient(135deg, #7b2fff, #9d4edd)', boxShadow: '0 0 25px rgba(157,78,221,0.3)' }}
                    >
                      {loading ? (
                        <><div className="cyber-loader w-5 h-5" style={{ borderTopColor: '#fff' }} /> Sending...</>
                      ) : (
                        <><RiMailSendLine size={16} /> Send Reset Link</>
                      )}
                    </motion.button>
                  </form>

                  <div className="mt-6 text-center">
                    <Link to="/login" className="inline-flex items-center gap-2 font-body text-sm text-slate-400 hover:text-neon-blue transition-colors">
                      <HiArrowLeft size={14} /> Back to Login
                    </Link>
                  </div>
                </motion.div>
              ) : (
                <motion.div key="success" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-4">
                  {/* Success animation */}
                  <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: 'spring', stiffness: 200, damping: 15 }}
                    className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6"
                    style={{ background: 'rgba(34,197,94,0.1)', border: '2px solid rgba(34,197,94,0.4)', boxShadow: '0 0 30px rgba(34,197,94,0.2)' }}
                  >
                    <HiCheckCircle size={40} style={{ color: '#22c55e' }} />
                  </motion.div>

                  <h2 className="font-display text-xl font-bold text-white mb-3">Check Your Email!</h2>
                  <p className="font-body text-sm text-slate-400 mb-2 leading-relaxed">
                    We sent a password reset link to:
                  </p>
                  <div className="glass rounded-lg px-4 py-2.5 inline-block mb-6"
                    style={{ border: '1px solid rgba(0,212,255,0.2)' }}>
                    <span className="font-mono text-sm text-neon-blue">{email}</span>
                  </div>

                  <div className="space-y-3 text-left glass rounded-xl p-4 mb-6"
                    style={{ border: '1px solid rgba(255,255,255,0.06)' }}>
                    <p className="font-body text-xs text-slate-400 font-semibold uppercase tracking-wider mb-2">Next steps:</p>
                    {[
                      '1. Check your inbox (and spam folder)',
                      '2. Click the reset link in the email',
                      '3. Create your new secure password',
                      '4. Link expires in 1 hour',
                    ].map((step, i) => (
                      <motion.p key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 + i * 0.1 }}
                        className="font-body text-sm text-slate-300 flex items-center gap-2">
                        <span className="text-neon-blue">›</span> {step}
                      </motion.p>
                    ))}
                  </div>

                  <div className="flex flex-col gap-3">
                    <button onClick={() => { setSent(false) }}
                      className="font-body text-sm text-neon-purple hover:underline transition-colors">
                      Try a different email
                    </button>
                    <Link to="/login" className="inline-flex items-center justify-center gap-2 font-body text-sm text-slate-400 hover:text-neon-blue transition-colors">
                      <HiArrowLeft size={14} /> Back to Login
                    </Link>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        <div className="text-center mt-5">
          <Link to="/" className="font-body text-xs text-slate-600 hover:text-neon-blue transition-colors">
            ← Back to Homepage
          </Link>
        </div>
      </motion.div>
    </div>
  )
}
