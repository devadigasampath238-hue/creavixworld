import { useState, useRef } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import AuthLayout from '../components/auth/AuthLayout'
import { useAuth } from '../context/AuthContext'
import { api } from '../context/AuthContext'

export default function VerifyOTP() {
  const [otp, setOtp] = useState(['', '', '', '', '', ''])
  const [loading, setLoading] = useState(false)
  const [resending, setResending] = useState(false)
  const refs = useRef([])
  const { verifyOTP } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const email = location.state?.email || ''
  const phone = location.state?.phone || ''

  const handleChange = (val, idx) => {
    if (!/^\d*$/.test(val)) return
    const next = [...otp]
    next[idx] = val.slice(-1)
    setOtp(next)
    if (val && idx < 5) refs.current[idx + 1]?.focus()
  }

  const handleKeyDown = (e, idx) => {
    if (e.key === 'Backspace' && !otp[idx] && idx > 0) refs.current[idx - 1]?.focus()
  }

  const handleSubmit = async () => {
    const code = otp.join('')
    if (code.length !== 6) { toast.error('Enter 6-digit OTP'); return }
    setLoading(true)
    try {
      await verifyOTP(email, code)
      toast.success('Account verified! Welcome aboard! 🚀')
      navigate('/dashboard')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Invalid OTP')
    } finally {
      setLoading(false)
    }
  }

  const handleResend = async () => {
    setResending(true)
    try {
      await api.post('/auth/resend-otp', { email })
      toast.success('New OTP sent to your mobile!')
    } catch (err) {
      toast.error('Failed to resend OTP')
    } finally {
      setResending(false)
    }
  }

  // Show last 4 digits of phone or email
  const maskedContact = phone
    ? `+91 ******${phone.slice(-4)}`
    : email

  return (
    <AuthLayout
      title="Verify Mobile"
      subtitle={`Enter the 6-digit code sent to ${maskedContact}`}
    >
      <div className="space-y-8">

        {/* OTP inputs */}
        <div className="flex gap-3 justify-center">
          {otp.map((digit, i) => (
            <motion.input
              key={i}
              ref={el => refs.current[i] = el}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={e => handleChange(e.target.value, i)}
              onKeyDown={e => handleKeyDown(e, i)}
              className="w-12 h-14 text-center text-xl font-display font-bold text-neon-blue cyber-input"
              style={{ padding: 0 }}
            />
          ))}
        </div>

        <motion.button
          onClick={handleSubmit}
          disabled={loading}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="btn-glow w-full py-3 flex items-center justify-center"
        >
          {loading ? <div className="cyber-loader w-5 h-5" /> : 'Verify OTP'}
        </motion.button>

        <p className="text-center font-body text-sm text-slate-400">
          Didn't receive it?{' '}
          <button
            onClick={handleResend}
            disabled={resending}
            className="text-neon-blue hover:underline disabled:opacity-50"
          >
            {resending ? 'Sending...' : 'Resend OTP'}
          </button>
        </p>
      </div>
    </AuthLayout>
  )
}