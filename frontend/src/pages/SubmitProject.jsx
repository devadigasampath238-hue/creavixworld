import { useState, useCallback } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { motion } from 'framer-motion'
import { useDropzone } from 'react-dropzone'
import toast from 'react-hot-toast'
import { HiCloudUpload, HiArrowLeft } from 'react-icons/hi'
import { api } from '../context/AuthContext'
import { getTodayString } from '../utils/dateUtils'


const projectTypes = ['Business Website', 'Portfolio Website', 'E-commerce Store', 'Admin Dashboard', 'Custom Web App', 'UI/UX Design', 'Branding', 'Landing Page', 'Other']
const budgets = ['Under $500', '$500 - $1,000', '$1,000 - $2,500', '$2,500 - $5,000', '$5,000+', 'Let\'s Discuss']

export default function SubmitProject() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [files, setFiles] = useState([])
  const { register, handleSubmit, formState: { errors } } = useForm()

  const onDrop = useCallback(accepted => {
    setFiles(prev => [...prev, ...accepted].slice(0, 5))
  }, [])
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': [], 'application/pdf': [] },
    maxSize: 5 * 1024 * 1024,
  })

  const onSubmit = async (data) => {
    setLoading(true)
    try {
      const formData = new FormData()
      Object.entries(data).forEach(([k, v]) => formData.append(k, v))
      files.forEach(f => formData.append('files', f))
      await api.post('/projects', formData, { headers: { 'Content-Type': 'multipart/form-data' } })
      toast.success('Project request submitted successfully!')
      navigate('/dashboard')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Submission failed')
    } finally {
      setLoading(false)
    }
  }
   
  <input {...register('deadline')} type="date" 
     min={getTodayString()}
  className="cyber-input" style={{ colorScheme: 'dark' }} />

  return (
    <div className="min-h-screen bg-dark-900 py-12 px-4 sm:px-6">
      <div className="absolute inset-0 cyber-grid opacity-30" />
      <div className="relative max-w-3xl mx-auto z-10">
        <Link to="/dashboard" className="inline-flex items-center gap-2 font-body text-sm text-slate-400 hover:text-neon-blue transition-colors mb-8">
          <HiArrowLeft size={16} /> Back to Dashboard
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-3 mb-4">
              <div className="w-6 h-px bg-neon-blue" />
              <span className="font-mono text-xs text-neon-blue tracking-widest uppercase">New Request</span>
              <div className="w-6 h-px bg-neon-blue" />
            </div>
            <h1 className="font-display text-3xl font-bold text-white">
              Submit <span className="gradient-text-primary">Project Request</span>
            </h1>
            <p className="font-body text-slate-400 mt-2">Tell us about your vision and we'll bring it to life.</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="glass rounded-2xl p-8 space-y-6">
            {/* Row 1 */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="font-body text-xs text-slate-400 uppercase tracking-wider block mb-2">Full Name *</label>
                <input {...register('name', { required: 'Required' })} className="cyber-input" placeholder="John Doe" />
                {errors.name && <p className="text-neon-pink text-xs mt-1">{errors.name.message}</p>}
              </div>
              <div>
                <label className="font-body text-xs text-slate-400 uppercase tracking-wider block mb-2">Email *</label>
                <input {...register('email', { required: 'Required' })} type="email" className="cyber-input" placeholder="your@email.com" />
                {errors.email && <p className="text-neon-pink text-xs mt-1">{errors.email.message}</p>}
              </div>
            </div>

            {/* Row 2 */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="font-body text-xs text-slate-400 uppercase tracking-wider block mb-2">Phone</label>
                <input {...register('phone')} className="cyber-input" placeholder="+1 234 567 8900" />
              </div>
              <div>
                <label className="font-body text-xs text-slate-400 uppercase tracking-wider block mb-2">Business Name *</label>
                <input {...register('businessName', { required: 'Required' })} className="cyber-input" placeholder="Your Company" />
                {errors.businessName && <p className="text-neon-pink text-xs mt-1">{errors.businessName.message}</p>}
              </div>
            </div>

            {/* Row 3 */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="font-body text-xs text-slate-400 uppercase tracking-wider block mb-2">Project Type *</label>
                <select {...register('projectType', { required: 'Required' })} className="cyber-input">
                  <option value="">Select type...</option>
                  {projectTypes.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
                {errors.projectType && <p className="text-neon-pink text-xs mt-1">{errors.projectType.message}</p>}
              </div>
              <div>
                <label className="font-body text-xs text-slate-400 uppercase tracking-wider block mb-2">Budget *</label>
                <select {...register('budget', { required: 'Required' })} className="cyber-input">
                  <option value="">Select budget...</option>
                  {budgets.map(b => <option key={b} value={b}>{b}</option>)}
                </select>
                {errors.budget && <p className="text-neon-pink text-xs mt-1">{errors.budget.message}</p>}
              </div>
            </div>

            {/* Deadline */}
            {/* Deadline */}
<div>
  <label className="font-body text-xs text-slate-400 uppercase tracking-wider block mb-2">Desired Deadline</label>
  <input
    {...register('deadline')}
    type="date"
    className="cyber-input"
    style={{ colorScheme: 'dark' }}
    min={new Date(Date.now() + 86400000).toISOString().split('T')[0]}
  />
</div>

            {/* Additional notes */}
            <div>
              <label className="font-body text-xs text-slate-400 uppercase tracking-wider block mb-2">Additional Notes</label>
              <textarea
                {...register('additionalNotes')}
                rows={3}
                className="cyber-input resize-none"
                placeholder="Any references, competitor sites, special requirements..."
              />
            </div>

            {/* File upload */}
            <div>
              <label className="font-body text-xs text-slate-400 uppercase tracking-wider block mb-2">Attachments (Max 5 files, 5MB each)</label>
              <div
                {...getRootProps()}
                className={`border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300 ${
                  isDragActive ? 'border-neon-blue bg-neon-blue/5' : 'border-neon-blue/20 hover:border-neon-blue/40'
                }`}
              >
                <input {...getInputProps()} />
                <HiCloudUpload className="mx-auto text-neon-blue/50 mb-2" size={32} />
                <p className="font-body text-sm text-slate-400">
                  {isDragActive ? 'Drop files here' : 'Drag & drop files, or click to select'}
                </p>
                <p className="font-mono text-xs text-slate-600 mt-1">PNG, JPG, PDF up to 5MB</p>
              </div>
              {files.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {files.map((f, i) => (
                    <div key={i} className="flex items-center gap-2 px-3 py-1.5 glass rounded-lg text-xs font-mono text-neon-blue">
                      {f.name}
                      <button type="button" onClick={() => setFiles(files.filter((_, j) => j !== i))} className="text-neon-pink ml-1">×</button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <motion.button
              type="submit"
              disabled={loading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="btn-glow w-full py-4 flex items-center justify-center gap-2 text-sm"
            >
              {loading ? <div className="cyber-loader w-5 h-5" /> : '🚀 Submit Project Request'}
            </motion.button>
          </form>
        </motion.div>
      </div>
    </div>
  )
}
