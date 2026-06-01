import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import { HiEye, HiEyeOff, HiLockClosed, HiMail, HiUser, HiPhone } from 'react-icons/hi'
import AuthLayout from '../components/auth/AuthLayout'
import { useAuth } from '../context/AuthContext'

export default function Signup() {
  const { signup } = useAuth()
  const navigate = useNavigate()
  const [showPw, setShowPw] = useState(false)
  const [loading, setLoading] = useState(false)
  const { register, handleSubmit, watch, formState: { errors } } = useForm()

  const onSubmit = async (data) => {
    setLoading(true)
    try {
      // Format phone with +91 if not already included
      const phone = data.phone.startsWith('+') ? data.phone : `+91${data.phone}`
      await signup({ name: data.name, email: data.email, password: data.password, phone })
      toast.success('OTP sent to your mobile number!')
      navigate('/verify-otp', { state: { email: data.email, phone: data.phone } })
    } catch (err) {
      toast.error(err.response?.data?.message || 'Signup failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthLayout title="Create Account" subtitle="Join CREAVIX WORLD — Start building your future">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">

        {/* Full Name */}
        <div>
          <label className="font-body text-xs text-slate-400 tracking-wider uppercase block mb-2">Full Name</label>
          <div className="relative">
            <HiUser className="absolute left-4 top-1/2 -translate-y-1/2 text-neon-blue/60 z-10 pointer-events-none" size={16} />
            <input
              {...register('name', { required: 'Name required', minLength: { value: 2, message: 'Min 2 chars' } })}
              type="text"
              placeholder="John Doe"
              className="cyber-input pl-11"
            />
          </div>
          {errors.name && <p className="text-neon-pink text-xs mt-1">{errors.name.message}</p>}
        </div>

        {/* Email */}
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

        {/* Phone Number */}
        <div>
          <label className="font-body text-xs text-slate-400 tracking-wider uppercase block mb-2">Mobile Number</label>
          <div className="relative">
            <HiPhone className="absolute left-4 top-1/2 -translate-y-1/2 text-neon-blue/60 z-10 pointer-events-none" size={16} />
            <input
              {...register('phone', {
                required: 'Phone number required',
                pattern: {
                  value: /^[+]?[0-9]{10,13}$/,
                  message: 'Enter valid phone number'
                }
              })}
              type="tel"
              placeholder="9876543210"
              className="cyber-input pl-11"
            />
          </div>
          {errors.phone && <p className="text-neon-pink text-xs mt-1">{errors.phone.message}</p>}
          <p className="text-slate-500 text-xs mt-1">OTP will be sent to this number</p>
        </div>

        {/* Password */}
        <div>
          <label className="font-body text-xs text-slate-400 tracking-wider uppercase block mb-2">Password</label>
          <div className="relative">
            <HiLockClosed className="absolute left-4 top-1/2 -translate-y-1/2 text-neon-blue/60 z-10 pointer-events-none" size={16} />
            <input
              {...register('password', { required: 'Password required', minLength: { value: 8, message: 'Min 8 characters' } })}
              type={showPw ? 'text' : 'password'}
              placeholder="Min 8 characters"
              className="cyber-input pl-11 pr-11"
            />
            <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-neon-blue transition-colors z-10">
              {showPw ? <HiEyeOff size={16} /> : <HiEye size={16} />}
            </button>
          </div>
          {errors.password && <p className="text-neon-pink text-xs mt-1">{errors.password.message}</p>}
        </div>

        {/* Confirm Password */}
        <div>
          <label className="font-body text-xs text-slate-400 tracking-wider uppercase block mb-2">Confirm Password</label>
          <div className="relative">
            <HiLockClosed className="absolute left-4 top-1/2 -translate-y-1/2 text-neon-purple/60 z-10 pointer-events-none" size={16} />
            <input
              {...register('confirm', {
                required: 'Please confirm password',
                validate: v => v === watch('password') || 'Passwords do not match'
              })}
              type="password"
              placeholder="Repeat password"
              className="cyber-input pl-11"
            />
          </div>
          {errors.confirm && <p className="text-neon-pink text-xs mt-1">{errors.confirm.message}</p>}
        </div>

        <motion.button
          type="submit"
          disabled={loading}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="btn-glow w-full py-3 flex items-center justify-center gap-2 disabled:opacity-60"
        >
          {loading ? <div className="cyber-loader w-5 h-5" /> : 'Create Account'}
        </motion.button>

        <p className="text-center font-body text-sm text-slate-400">
          Already have an account?{' '}
          <Link to="/login" className="text-neon-blue hover:underline">Sign in</Link>
        </p>
      </form>
    </AuthLayout>
  )
}