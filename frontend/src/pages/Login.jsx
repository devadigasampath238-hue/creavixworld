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

  const handleGoogleLogin = () => {
    window.location.href = `${import.meta.env.VITE_API_URL}/auth/google`
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

        {/* Divider */}
        <div className="flex items-center gap-3">
          <div className="flex-1 h-px bg-gray-700"></div>
          <span className="text-gray-400 text-xs font-body tracking-wider">OR</span>
          <div className="flex-1 h-px bg-gray-700"></div>
        </div>

        {/* Google Login Button */}
        <motion.button
          type="button"
          onClick={handleGoogleLogin}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-gray-600 rounded-lg hover:border-neon-blue hover:bg-gray-800/50 transition-all duration-300 group"
        >
          <svg width="20" height="20" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          <span className="text-white font-body text-sm group-hover:text-neon-blue transition-colors">
            Continue with Google
          </span>
        </motion.button>

        <p className="text-center font-body text-sm text-slate-400">
          Don't have an account?{' '}
          <Link to="/signup" className="text-neon-blue hover:underline">Create one</Link>
        </p>
      </form>
    </AuthLayout>
  )
}