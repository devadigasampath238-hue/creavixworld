import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { motion, AnimatePresence } from 'framer-motion'
import toast from 'react-hot-toast'
import { HiEye, HiEyeOff, HiLockClosed, HiCheckCircle, HiArrowLeft } from 'react-icons/hi'
import { RiShieldCheckLine, RiAlertLine } from 'react-icons/ri'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

// Password strength checker
function getStrength(password) {
  if (!password) return { score: 0, label: '', color: '' }
  let score = 0
  if (password.length >= 8) score++
  if (password.length >= 12) score++
  if (/[A-Z]/.test(password)) score++
  if (/[0-9]/.test(password)) score++
  if (/[^A-Za-z0-9]/.test(password)) score++

  if (score <= 1) return { score, label: 'Very Weak', color: '#ff006e', width: '15%' }
  if (score === 2) return { score, label: 'Weak', color: '#f97316', width: '35%' }
  if (score === 3) return { score, label: 'Fair', color: '#eab308', width: '55%' }
  if (score === 4) return { score, label: 'Strong', color: '#22c55e', width: '80%' }
  return { score, label: 'Very Strong', color: '#00d4ff', width: '100%' }
}

const requirements = [
  { test: (p) => p.length >= 8, label: 'At least 8 characters' },
  { test: (p) => /[A-Z]/.test(p), label: 'One uppercase letter' },
  { test: (p) => /[0-9]/.test(p), label: 'One number' },
  { test: (p) => /[^A-Za-z0-9]/.test(p), label: 'One special character' },
]

export default function ResetPassword() {
  const { resetPassword } = useAuth()
  const { token } = useParams()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [showPw, setShowPw] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [password, setPassword] = useState('')
  const { register, handleSubmit, watch, formState: { errors } } = useForm()

  const strength = getStrength(password)

  const onSubmit = async (data) => {
    if (strength.score < 2) {
      toast.error('Please use a stronger password')
      return
    }
    setLoading(true)
    try {
      await resetPassword(token, data.password)
      setSuccess(true)
      toast.success('Password reset successfully!')
      setTimeout(() => navigate('/login'), 3000)
    } catch (err) {
      toast.error(err.response?.data?.message || 'Reset failed. Link may have expired.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-dark-900 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 cyber-grid opacity-40" />
      <div className="absolute inset-0" style={{
        background: 'radial-gradient(ellipse 60% 60% at 50% 40%, rgba(0,212,255,0.07) 0%, rgba(123,47,255,0.05) 50%, transparent 70%)'
      }} />

      {/* Corner brackets */}
      <div className="absolute top-6 left-6 w-12 h-12 border-l-2 border-t-2 border-neon-blue/30" />
      <div className="absolute top-6 right-6 w-12 h-12 border-r-2 border-t-2 border-neon-purple/30" />
      <div className="absolute bottom-6 left-6 w-12 h-12 border-l-2 border-b-2 border-neon-pink/30" />
      <div className="absolute bottom-6 right-6 w-12 h-12 border-r-2 border-b-2 border-neon-cyan/30" />

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

        <div className="glass rounded-2xl overflow-hidden" style={{ border: '1px solid rgba(0,212,255,0.2)' }}>
          <div className="h-1 w-full" style={{ background: 'linear-gradient(90deg, #00d4ff, #7b2fff, #9d4edd)' }} />

          <div className="p-8">
            <AnimatePresence mode="wait">
              {success ? (
                <motion.div key="success" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-4">
                  <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: 'spring', stiffness: 200, damping: 15 }}
                    className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6"
                    style={{ background: 'rgba(0,212,255,0.1)', border: '2px solid rgba(0,212,255,0.4)', boxShadow: '0 0 30px rgba(0,212,255,0.2)' }}
                  >
                    <HiCheckCircle size={40} style={{ color: '#00d4ff' }} />
                  </motion.div>
                  <h2 className="font-display text-xl font-bold text-white mb-3">Password Reset!</h2>
                  <p className="font-body text-sm text-slate-400 mb-6">
                    Your password has been updated successfully. Redirecting to login...
                  </p>
                  <div className="w-full h-1 rounded-full overflow-hidden bg-dark-700">
                    <motion.div
                      initial={{ width: '0%' }}
                      animate={{ width: '100%' }}
                      transition={{ duration: 3, ease: 'linear' }}
                      className="h-full"
                      style={{ background: 'linear-gradient(90deg, #00d4ff, #9d4edd)' }}
                    />
                  </div>
                  <p className="font-mono text-xs text-slate-600 mt-2">Redirecting in 3 seconds...</p>
                  <Link to="/login" className="inline-flex items-center gap-2 font-body text-sm text-neon-blue hover:underline mt-4 block">
                    Go to Login now →
                  </Link>
                </motion.div>
              ) : (
                <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  {/* Icon */}
                  <div className="flex justify-center mb-6">
                    <div className="w-16 h-16 rounded-2xl flex items-center justify-center"
                      style={{ background: 'rgba(0,212,255,0.08)', border: '1px solid rgba(0,212,255,0.3)', boxShadow: '0 0 30px rgba(0,212,255,0.1)' }}>
                      <RiShieldCheckLine size={32} style={{ color: '#00d4ff' }} />
                    </div>
                  </div>

                  <div className="text-center mb-7">
                    <div className="w-12 h-px mx-auto mb-4" style={{ background: 'linear-gradient(90deg, transparent, #00d4ff, transparent)' }} />
                    <h1 className="font-display text-xl font-bold text-white mb-2">Create New Password</h1>
                    <p className="font-body text-sm text-slate-400">Make it strong and memorable</p>
                  </div>

                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                    {/* New Password */}
                    <div>
                      <label className="font-body text-xs text-slate-400 uppercase tracking-wider block mb-2">
                        New Password
                      </label>
                      <div className="relative">
                        <HiLockClosed className="absolute left-4 top-1/2 -translate-y-1/2 z-10 pointer-events-none text-neon-blue/60" size={16} />
                        <input
                          {...register('password', {
                            required: 'Password is required',
                            minLength: { value: 8, message: 'Minimum 8 characters' },
                            onChange: (e) => setPassword(e.target.value),
                          })}
                          type={showPw ? 'text' : 'password'}
                          placeholder="Enter new password"
                          className="cyber-input pl-11 pr-11"
                        />
                        <button type="button" onClick={() => setShowPw(!showPw)}
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-neon-blue transition-colors z-10">
                          {showPw ? <HiEyeOff size={16} /> : <HiEye size={16} />}
                        </button>
                      </div>
                      {errors.password && (
                        <p className="text-neon-pink text-xs mt-1.5">⚠ {errors.password.message}</p>
                      )}

                      {/* Strength meter */}
                      {password && (
                        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="mt-3">
                          <div className="flex items-center justify-between mb-1.5">
                            <span className="font-mono text-xs text-slate-500">Strength</span>
                            <span className="font-mono text-xs font-bold" style={{ color: strength.color }}>
                              {strength.label}
                            </span>
                          </div>
                          <div className="w-full h-1.5 rounded-full bg-dark-700 overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: strength.width }}
                              transition={{ duration: 0.4, ease: 'easeOut' }}
                              className="h-full rounded-full"
                              style={{ background: strength.color, boxShadow: `0 0 8px ${strength.color}60` }}
                            />
                          </div>

                          {/* Requirements checklist */}
                          <div className="mt-3 space-y-1.5">
                            {requirements.map((req) => {
                              const met = req.test(password)
                              return (
                                <motion.div key={req.label} className="flex items-center gap-2">
                                  <div className={`w-3.5 h-3.5 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-300 ${met ? 'bg-green-500/20 border border-green-500/50' : 'bg-slate-700/50 border border-slate-600/30'}`}>
                                    {met && <div className="w-1.5 h-1.5 rounded-full bg-green-400" />}
                                  </div>
                                  <span className={`font-body text-xs transition-colors duration-300 ${met ? 'text-green-400' : 'text-slate-500'}`}>
                                    {req.label}
                                  </span>
                                </motion.div>
                              )
                            })}
                          </div>
                        </motion.div>
                      )}
                    </div>

                    {/* Confirm Password */}
                    <div>
                      <label className="font-body text-xs text-slate-400 uppercase tracking-wider block mb-2">
                        Confirm Password
                      </label>
                      <div className="relative">
                        <HiLockClosed className="absolute left-4 top-1/2 -translate-y-1/2 z-10 pointer-events-none text-neon-purple/60" size={16} />
                        <input
                          {...register('confirm', {
                            required: 'Please confirm your password',
                            validate: v => v === watch('password') || 'Passwords do not match',
                          })}
                          type={showConfirm ? 'text' : 'password'}
                          placeholder="Repeat new password"
                          className="cyber-input pl-11 pr-11"
                        />
                        <button type="button" onClick={() => setShowConfirm(!showConfirm)}
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-neon-blue transition-colors z-10">
                          {showConfirm ? <HiEyeOff size={16} /> : <HiEye size={16} />}
                        </button>
                      </div>
                      {errors.confirm && (
                        <p className="text-neon-pink text-xs mt-1.5">⚠ {errors.confirm.message}</p>
                      )}
                      {/* Match indicator */}
                      {watch('confirm') && watch('password') && (
                        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                          className={`text-xs mt-1.5 font-mono ${watch('confirm') === watch('password') ? 'text-green-400' : 'text-neon-pink'}`}>
                          {watch('confirm') === watch('password') ? '✓ Passwords match' : '✗ Passwords do not match'}
                        </motion.p>
                      )}
                    </div>

                    {/* Security tip */}
                    <div className="flex items-start gap-3 p-3 rounded-lg"
                      style={{ background: 'rgba(0,212,255,0.04)', border: '1px solid rgba(0,212,255,0.1)' }}>
                      <RiAlertLine className="text-neon-blue flex-shrink-0 mt-0.5" size={14} />
                      <p className="font-body text-xs text-slate-400 leading-relaxed">
                        Use a unique password you don't use elsewhere. Mix letters, numbers and symbols for best security.
                      </p>
                    </div>

                    <motion.button
                      type="submit"
                      disabled={loading}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full py-3.5 rounded-lg font-display text-xs font-bold tracking-widest uppercase text-white flex items-center justify-center gap-2 disabled:opacity-60"
                      style={{ background: 'linear-gradient(135deg, #00b8d9, #7b2fff)', boxShadow: '0 0 25px rgba(0,212,255,0.25)' }}
                    >
                      {loading ? (
                        <><div className="cyber-loader w-5 h-5" style={{ borderTopColor: '#fff' }} /> Resetting...</>
                      ) : (
                        <><RiShieldCheckLine size={16} /> Reset Password</>
                      )}
                    </motion.button>
                  </form>

                  <div className="mt-6 text-center">
                    <Link to="/login" className="inline-flex items-center gap-2 font-body text-sm text-slate-400 hover:text-neon-blue transition-colors">
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
