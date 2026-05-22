import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import { HiEye, HiEyeOff, HiLockClosed, HiMail } from 'react-icons/hi'
import AuthLayout from '../components/auth/AuthLayout'
import { useAuth } from '../context/AuthContext'

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [showPw, setShowPw] = useState(false)
  const [loading, setLoading] = useState(false)
  const { register, handleSubmit, formState: { errors } } = useForm()

  const onSubmit = async (data) => {
    setLoading(true)
    try {
      const res = await login(data.email, data.password)
      toast.success('Welcome back!')
      navigate(res.user.role === 'admin' ? '/admin' : '/dashboard')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthLayout title="Welcome Back" subtitle="Sign in to your CREAVIX WORLD account">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div>
          <label className="font-body text-xs text-slate-400 tracking-wider uppercase block mb-2">Email</label>
          <div className="relative">
            <HiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-neon-blue/60 z-10 pointer-events-none" size={16} />
            <input
              {...register('email', { required: 'Email required', pattern: { value: /\S+@\S+\.\S+/, message: 'Invalid email' } })}
              type="email"
              placeholder="your@email.com"
              className="cyber-input pl-11"
            />
          </div>
          {errors.email && <p className="text-neon-pink text-xs mt-1">{errors.email.message}</p>}
        </div>

        <div>
          <label className="font-body text-xs text-slate-400 tracking-wider uppercase block mb-2">Password</label>
          <div className="relative">
            <HiLockClosed className="absolute left-4 top-1/2 -translate-y-1/2 text-neon-blue/60 z-10 pointer-events-none" size={16} />
            <input
              {...register('password', { required: 'Password required', minLength: { value: 6, message: 'Min 6 characters' } })}
              type={showPw ? 'text' : 'password'}
              placeholder="••••••••"
              className="cyber-input pl-11 pr-11"
            />
            <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-neon-blue transition-colors z-10">
              {showPw ? <HiEyeOff size={16} /> : <HiEye size={16} />}
            </button>
          </div>
          {errors.password && <p className="text-neon-pink text-xs mt-1">{errors.password.message}</p>}
        </div>

        <div className="flex items-center justify-between">
          <Link to="/forgot-password" className="font-body text-xs text-neon-blue hover:underline">
            Forgot password?
          </Link>
        </div>

        <motion.button
          type="submit"
          disabled={loading}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="btn-glow w-full py-3 flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {loading ? <div className="cyber-loader w-5 h-5" /> : 'Sign In'}
        </motion.button>

        <p className="text-center font-body text-sm text-slate-400">
          Don't have an account?{' '}
          <Link to="/signup" className="text-neon-blue hover:underline">Create one</Link>
        </p>
      </form>
    </AuthLayout>
  )
}