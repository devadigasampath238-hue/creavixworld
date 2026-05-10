import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import { HiMail, HiLockClosed } from 'react-icons/hi'
import AuthLayout from '../components/auth/AuthLayout'
import { useAuth } from '../context/AuthContext'
import { Link, useNavigate, useParams } from 'react-router-dom'

export function ForgotPassword() {
  const { forgotPassword } = useAuth()
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const { register, handleSubmit, formState: { errors } } = useForm()

  const onSubmit = async ({ email }) => {
    setLoading(true)
    try {
      await forgotPassword(email)
      setSent(true)
      toast.success('Reset link sent to your email!')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthLayout title="Reset Password" subtitle="Enter your email to receive a reset link">
      {sent ? (
        <div className="text-center py-4">
          <div className="w-16 h-16 rounded-full border border-neon-cyan/50 flex items-center justify-center mx-auto mb-4 bg-neon-cyan/10">
            <HiMail className="text-neon-cyan" size={28} />
          </div>
          <p className="font-body text-slate-300 mb-4">Check your email for the reset link.</p>
          <Link to="/login" className="text-neon-blue hover:underline text-sm">Back to login</Link>
        </div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div>
            <label className="font-body text-xs text-slate-400 tracking-wider uppercase block mb-2">Email</label>
            <div className="relative">
              <HiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-neon-blue/60" size={16} />
              <input
                {...register('email', { required: 'Email required' })}
                type="email"
                placeholder="your@email.com"
                className="cyber-input pl-10"
              />
            </div>
            {errors.email && <p className="text-neon-pink text-xs mt-1">{errors.email.message}</p>}
          </div>
          <motion.button type="submit" disabled={loading} whileHover={{ scale: 1.02 }} className="btn-glow w-full py-3 flex items-center justify-center">
            {loading ? <div className="cyber-loader w-5 h-5" /> : 'Send Reset Link'}
          </motion.button>
          <p className="text-center text-sm font-body text-slate-400">
            <Link to="/login" className="text-neon-blue hover:underline">Back to login</Link>
          </p>
        </form>
      )}
    </AuthLayout>
  )
}

export function ResetPassword() {
  const { resetPassword } = useAuth()
  const { token } = useParams()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const { register, handleSubmit, watch, formState: { errors } } = useForm()

  const onSubmit = async ({ password }) => {
    setLoading(true)
    try {
      await resetPassword(token, password)
      toast.success('Password reset! Please login.')
      navigate('/login')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Reset failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthLayout title="New Password" subtitle="Set your new secure password">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div>
          <label className="font-body text-xs text-slate-400 tracking-wider uppercase block mb-2">New Password</label>
          <div className="relative">
            <HiLockClosed className="absolute left-3 top-1/2 -translate-y-1/2 text-neon-blue/60" size={16} />
            <input
              {...register('password', { required: 'Required', minLength: { value: 8, message: 'Min 8 chars' } })}
              type="password"
              placeholder="Min 8 characters"
              className="cyber-input pl-10"
            />
          </div>
          {errors.password && <p className="text-neon-pink text-xs mt-1">{errors.password.message}</p>}
        </div>
        <div>
          <label className="font-body text-xs text-slate-400 tracking-wider uppercase block mb-2">Confirm Password</label>
          <div className="relative">
            <HiLockClosed className="absolute left-3 top-1/2 -translate-y-1/2 text-neon-purple/60" size={16} />
            <input
              {...register('confirm', { validate: v => v === watch('password') || 'Passwords do not match' })}
              type="password"
              placeholder="Repeat password"
              className="cyber-input pl-10"
            />
          </div>
          {errors.confirm && <p className="text-neon-pink text-xs mt-1">{errors.confirm.message}</p>}
        </div>
        <motion.button type="submit" disabled={loading} whileHover={{ scale: 1.02 }} className="btn-glow w-full py-3 flex items-center justify-center">
          {loading ? <div className="cyber-loader w-5 h-5" /> : 'Reset Password'}
        </motion.button>
      </form>
    </AuthLayout>
  )
}

export default ForgotPassword
