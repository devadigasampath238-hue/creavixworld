import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth, api } from '../context/AuthContext'
import { Link } from 'react-router-dom'
import toast from 'react-hot-toast'
import {
  RiDashboardLine, RiTeamLine, RiProjectorLine,
  RiBellLine, RiLogoutBoxLine, RiMenuLine,
  RiCheckLine, RiAddLine, RiDeleteBinLine, RiEditLine,
  RiGalleryLine, RiCloseLine
} from 'react-icons/ri'
import { format } from 'date-fns'

const statusOptions = ['pending', 'under_review', 'in_progress', 'completed', 'delivered']
const statusConfig = {
  pending: { label: 'Pending', cls: 'badge-pending' },
  under_review: { label: 'Under Review', cls: 'badge-review' },
  in_progress: { label: 'In Progress', cls: 'badge-progress' },
  completed: { label: 'Completed', cls: 'badge-completed' },
  delivered: { label: 'Delivered', cls: 'badge-delivered' },
}
const categories = ['E-commerce', 'Dashboard', 'Portfolio', 'Web App', 'Branding', 'Landing Page']
const colorOptions = ['#00d4ff', '#9d4edd', '#ff006e', '#00fff5', '#7b2fff', '#22c55e']

function StatCard({ label, value, color, icon: Icon }) {
  return (
    <motion.div whileHover={{ y: -4 }} className="glass rounded-xl p-5" style={{ borderColor: `${color}20` }}>
      <div className="flex items-center justify-between mb-2">
        <span className="font-body text-xs text-slate-400 uppercase tracking-wider">{label}</span>
        <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: `${color}15`, border: `1px solid ${color}30` }}>
          <Icon size={18} style={{ color }} />
        </div>
      </div>
      <div className="font-display text-3xl font-bold text-white">{value}</div>
    </motion.div>
  )
}

const adminLinks = [
  { key: 'overview', icon: RiDashboardLine, label: 'Overview' },
  { key: 'projects', icon: RiProjectorLine, label: 'Projects' },
  { key: 'portfolio', icon: RiGalleryLine, label: 'Portfolio' },
  { key: 'users', icon: RiTeamLine, label: 'Users' },
]

const emptyForm = { title: '', category: 'E-commerce', description: '', tags: '', color: '#00d4ff', liveUrl: '', imageUrl: '', featured: false, order: 0 }

export default function AdminDashboard() {
  const { user, logout } = useAuth()
  const [activeTab, setActiveTab] = useState('overview')
  const [projects, setProjects] = useState([])
  const [users, setUsers] = useState([])
  const [portfolio, setPortfolio] = useState([])
  const [loading, setLoading] = useState(true)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [noteInputs, setNoteInputs] = useState({})
  const [showPortfolioForm, setShowPortfolioForm] = useState(false)
  const [editingPortfolio, setEditingPortfolio] = useState(null)
  const [portfolioForm, setPortfolioForm] = useState(emptyForm)
  const [savingPortfolio, setSavingPortfolio] = useState(false)

  useEffect(() => { fetchAll() }, [])

  const fetchAll = async () => {
    try {
      const [pRes, uRes, portRes] = await Promise.all([
        api.get('/admin/projects'),
        api.get('/admin/users'),
        api.get('/admin/portfolio'),
      ])
      setProjects(pRes.data.items || pRes.data.projects || [])
      setUsers(uRes.data.users || [])
      setPortfolio(portRes.data.items || [])
    } catch (e) { toast.error('Failed to load data') }
    finally { setLoading(false) }
  }

  const updateStatus = async (id, status) => {
    try {
      await api.put(`/admin/projects/${id}/status`, { status, adminNote: noteInputs[id] || '' })
      toast.success('Status updated!')
      setProjects(projects.map(p => p._id === id ? { ...p, status, adminNote: noteInputs[id] || p.adminNote } : p))
    } catch (e) { toast.error('Update failed') }
  }

  const toggleUserStatus = async (id, active) => {
    try {
      await api.put(`/admin/users/${id}`, { isActive: !active })
      setUsers(users.map(u => u._id === id ? { ...u, isActive: !active } : u))
      toast.success('User updated!')
    } catch (e) { toast.error('Failed') }
  }

  const openAddPortfolio = () => {
    setEditingPortfolio(null)
    setPortfolioForm(emptyForm)
    setShowPortfolioForm(true)
  }

  const openEditPortfolio = (item) => {
    setEditingPortfolio(item)
    setPortfolioForm({
      title: item.title,
      category: item.category,
      description: item.description,
      tags: item.tags?.join(', ') || '',
      color: item.color || '#00d4ff',
      liveUrl: item.liveUrl || '',
      imageUrl: item.imageUrl || '',
      featured: item.featured || false,
      order: item.order || 0,
    })
    setShowPortfolioForm(true)
  }

  const savePortfolio = async () => {
    if (!portfolioForm.title || !portfolioForm.description) {
      toast.error('Title and description required')
      return
    }
    setSavingPortfolio(true)
    try {
      if (editingPortfolio) {
        const res = await api.put(`/admin/portfolio/${editingPortfolio._id}`, portfolioForm)
        setPortfolio(portfolio.map(p => p._id === editingPortfolio._id ? res.data.item : p))
        toast.success('Portfolio item updated!')
      } else {
        const res = await api.post('/admin/portfolio', portfolioForm)
        setPortfolio([res.data.item, ...portfolio])
        toast.success('Portfolio item added!')
      }
      setShowPortfolioForm(false)
    } catch (e) { toast.error('Save failed') }
    finally { setSavingPortfolio(false) }
  }

  const deletePortfolioItem = async (id) => {
    if (!window.confirm('Delete this portfolio item?')) return
    try {
      await api.delete(`/admin/portfolio/${id}`)
      setPortfolio(portfolio.filter(p => p._id !== id))
      toast.success('Deleted!')
    } catch (e) { toast.error('Delete failed') }
  }

  const stats = [
    { label: 'Total Users', value: users.length, color: '#00d4ff', icon: RiTeamLine },
    { label: 'Total Projects', value: projects.length, color: '#9d4edd', icon: RiProjectorLine },
    { label: 'Portfolio Items', value: portfolio.length, color: '#ff006e', icon: RiGalleryLine },
    { label: 'Delivered', value: projects.filter(p => p.status === 'delivered').length, color: '#22c55e', icon: RiCheckLine },
  ]

  const Sidebar = () => (
    <div className="flex flex-col h-full">
      <div className="p-6 border-b border-neon-blue/10">
        <Link to="/" className="flex items-center gap-3">
          <div className="w-8 h-8 rounded border border-neon-blue/50 flex items-center justify-center bg-dark-800">
            <span className="font-display text-xs font-bold text-neon-blue">CX</span>
          </div>
          <div>
            <div className="font-display text-xs font-bold text-white tracking-widest">CREAVIX.WORLD</div>
            <div className="font-mono text-xs text-neon-pink">ADMIN PANEL</div>
          </div>
        </Link>
      </div>
      <nav className="flex-1 p-4 space-y-1 mt-4">
        {adminLinks.map(l => {
          const Icon = l.icon
          return (
            <button key={l.key} onClick={() => { setActiveTab(l.key); setSidebarOpen(false) }}
              className={`sidebar-link w-full ${activeTab === l.key ? 'active' : ''}`}>
              <Icon size={18} /><span>{l.label}</span>
            </button>
          )
        })}
      </nav>
      <div className="p-4 border-t border-neon-blue/10">
        <button onClick={logout} className="sidebar-link w-full text-neon-pink hover:text-neon-pink hover:border-neon-pink/20">
          <RiLogoutBoxLine size={18} /><span>Logout</span>
        </button>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-dark-900 flex">
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex flex-col glass-dark border-r border-neon-blue/10 fixed left-0 top-0 h-full z-40 w-64">
        <Sidebar />
      </aside>

      {/* Mobile sidebar */}
      {sidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div className="w-64 glass-dark border-r border-neon-blue/10 h-full"><Sidebar /></div>
          <div className="flex-1 bg-dark-900/80" onClick={() => setSidebarOpen(false)} />
        </div>
      )}

      <main className="flex-1 lg:ml-64 p-4 sm:p-6 lg:p-8">
        {/* Top bar */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <button className="lg:hidden text-neon-blue" onClick={() => setSidebarOpen(true)}>
              <RiMenuLine size={24} />
            </button>
            <div>
              <h1 className="font-display text-xl font-bold text-white">
                Admin <span className="gradient-text-primary">Panel</span>
              </h1>
              <div className="font-mono text-xs text-neon-pink mt-0.5">CREAVIX WORLD CONTROL CENTER</div>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-20"><div className="cyber-loader" /></div>
        ) : (
          <>
            {/* OVERVIEW */}
            {activeTab === 'overview' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                  {stats.map(s => <StatCard key={s.label} {...s} />)}
                </div>
                <div className="glass rounded-xl p-6">
                  <h2 className="font-display text-sm font-semibold text-white mb-4">Recent Projects</h2>
                  <div className="space-y-3">
                    {projects.slice(0, 6).map(p => (
                      <div key={p._id} className="flex items-center justify-between p-3 rounded-lg bg-dark-700/50 border border-neon-blue/5">
                        <div>
                          <div className="font-body text-sm text-white">{p.businessName}</div>
                          <div className="font-mono text-xs text-slate-500">{p.projectType} • {p.budget}</div>
                        </div>
                        <span className={`text-xs px-3 py-1 rounded-full ${statusConfig[p.status]?.cls}`}>
                          {statusConfig[p.status]?.label}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {/* PROJECTS */}
            {activeTab === 'projects' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-5">
                {projects.length === 0 ? (
                  <div className="text-center py-20 font-body text-slate-500">No projects yet</div>
                ) : projects.map(p => (
                  <div key={p._id} className="glass rounded-xl p-6">
                    <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                      <div>
                        <h3 className="font-body font-semibold text-white text-lg">{p.businessName}</h3>
                        <div className="font-mono text-xs text-slate-400 mt-1">
                          {p.projectType} • {p.budget} • by {p.userId?.name || p.name}
                        </div>
                        <div className="font-mono text-xs text-slate-500">{p.email} • {p.phone}</div>
                      </div>
                      <span className={`text-xs px-3 py-1 rounded-full ${statusConfig[p.status]?.cls}`}>
                        {statusConfig[p.status]?.label}
                      </span>
                    </div>
                    <p className="font-body text-sm text-slate-300 mb-4 line-clamp-2">{p.description}</p>
                    {p.deadline && <p className="font-mono text-xs text-slate-500 mb-4">Deadline: {format(new Date(p.deadline), 'MMM d, yyyy')}</p>}
                    <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-neon-blue/10">
                      <select
                        defaultValue={p.status}
                        onChange={e => updateStatus(p._id, e.target.value)}
                        className="cyber-input text-sm py-2"
                      >
                        {statusOptions.map(s => <option key={s} value={s}>{statusConfig[s]?.label}</option>)}
                      </select>
                      <input
                        value={noteInputs[p._id] || ''}
                        onChange={e => setNoteInputs({ ...noteInputs, [p._id]: e.target.value })}
                        className="cyber-input text-sm py-2 flex-1"
                        placeholder="Add note to client..."
                      />
                    </div>
                  </div>
                ))}
              </motion.div>
            )}

            {/* PORTFOLIO */}
            {activeTab === 'portfolio' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="font-display text-lg font-bold text-white">Portfolio Items <span className="text-neon-blue">({portfolio.length})</span></h2>
                  <button onClick={openAddPortfolio} className="btn-glow text-xs py-2 px-5 flex items-center gap-2">
                    <RiAddLine size={16} /> Add Item
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {portfolio.map(item => (
                    <motion.div key={item._id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                      className="glass rounded-xl overflow-hidden group">
                      {/* Color preview */}
                      <div className="h-32 relative" style={{ background: `linear-gradient(135deg, ${item.color}20, rgba(6,10,20,0.9))` }}>
                        <div className="absolute inset-0 cyber-grid opacity-20" />
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="font-display text-3xl font-black opacity-20" style={{ color: item.color }}>
                            {item.title?.[0]}
                          </span>
                        </div>
                        <div className="absolute top-3 left-3">
                          <span className="font-mono text-xs px-2 py-1 rounded" style={{ background: `${item.color}20`, color: item.color, border: `1px solid ${item.color}40` }}>
                            {item.category}
                          </span>
                        </div>
                        {item.featured && (
                          <div className="absolute top-3 right-3">
                            <span className="font-mono text-xs px-2 py-1 rounded bg-yellow-400/20 text-yellow-400 border border-yellow-400/30">⭐ Featured</span>
                          </div>
                        )}
                        {/* Action buttons */}
                        <div className="absolute inset-0 bg-dark-900/70 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                          <button onClick={() => openEditPortfolio(item)}
                            className="w-9 h-9 rounded-lg border border-neon-blue/50 flex items-center justify-center text-neon-blue hover:bg-neon-blue/10 transition-all">
                            <RiEditLine size={16} />
                          </button>
                          <button onClick={() => deletePortfolioItem(item._id)}
                            className="w-9 h-9 rounded-lg border border-neon-pink/50 flex items-center justify-center text-neon-pink hover:bg-neon-pink/10 transition-all">
                            <RiDeleteBinLine size={16} />
                          </button>
                        </div>
                      </div>
                      <div className="p-4">
                        <h3 className="font-body font-semibold text-white mb-1">{item.title}</h3>
                        <p className="font-body text-xs text-slate-400 line-clamp-2 mb-3">{item.description}</p>
                        <div className="flex flex-wrap gap-1">
                          {item.tags?.map(tag => (
                            <span key={tag} className="font-mono text-xs px-2 py-0.5 rounded bg-dark-700/50 text-slate-500 border border-slate-700/30">{tag}</span>
                          ))}
                        </div>
                        <div className="flex items-center gap-1 mt-2">
                          <div className="w-3 h-3 rounded-full" style={{ background: item.color }} />
                          <span className="font-mono text-xs text-slate-500">{item.isActive ? 'Active' : 'Hidden'}</span>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {portfolio.length === 0 && (
                  <div className="text-center py-20">
                    <RiGalleryLine className="mx-auto text-slate-600 mb-3" size={48} />
                    <p className="font-body text-slate-500 mb-4">No portfolio items yet</p>
                    <button onClick={openAddPortfolio} className="btn-glow text-xs py-2 px-6">Add First Item</button>
                  </div>
                )}
              </motion.div>
            )}

            {/* USERS */}
            {activeTab === 'users' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-3">
                <h2 className="font-display text-lg font-bold text-white mb-6">
                  All Users <span className="text-neon-blue">({users.length})</span>
                </h2>
                {users.map(u => (
                  <div key={u._id} className="glass rounded-xl p-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-neon-blue to-neon-purple flex items-center justify-center flex-shrink-0">
                        <span className="font-display text-sm font-bold text-dark-900">{u.name?.[0]?.toUpperCase()}</span>
                      </div>
                      <div>
                        <div className="font-body text-sm font-medium text-white">{u.name}</div>
                        <div className="font-mono text-xs text-slate-400">{u.email}</div>
                        <div className="font-mono text-xs text-slate-600">Joined {format(new Date(u.createdAt), 'MMM d, yyyy')}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`text-xs px-2 py-1 rounded-full ${u.isVerified ? 'badge-completed' : 'badge-pending'}`}>
                        {u.isVerified ? 'Verified' : 'Unverified'}
                      </span>
                      <button onClick={() => toggleUserStatus(u._id, u.isActive)}
                        className={`font-mono text-xs px-3 py-1.5 rounded border transition-all ${
                          u.isActive !== false
                            ? 'border-neon-pink/30 text-neon-pink hover:bg-neon-pink/10'
                            : 'border-neon-cyan/30 text-neon-cyan hover:bg-neon-cyan/10'
                        }`}>
                        {u.isActive !== false ? 'Deactivate' : 'Activate'}
                      </button>
                    </div>
                  </div>
                ))}
              </motion.div>
            )}
          </>
        )}
      </main>

      {/* Portfolio Form Modal */}
      <AnimatePresence>
        {showPortfolioForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-dark-900/80 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="glass rounded-2xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto"
              style={{ border: '1px solid rgba(0,212,255,0.2)' }}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-display text-lg font-bold text-white">
                  {editingPortfolio ? 'Edit' : 'Add'} Portfolio Item
                </h2>
                <button onClick={() => setShowPortfolioForm(false)} className="text-slate-400 hover:text-neon-pink transition-colors">
                  <RiCloseLine size={24} />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="font-body text-xs text-slate-400 uppercase tracking-wider block mb-2">Title *</label>
                  <input value={portfolioForm.title} onChange={e => setPortfolioForm({ ...portfolioForm, title: e.target.value })}
                    className="cyber-input" placeholder="Project name" />
                </div>

                <div>
                  <label className="font-body text-xs text-slate-400 uppercase tracking-wider block mb-2">Category *</label>
                  <select value={portfolioForm.category} onChange={e => setPortfolioForm({ ...portfolioForm, category: e.target.value })}
                    className="cyber-input">
                    {categories.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>

                <div>
                  <label className="font-body text-xs text-slate-400 uppercase tracking-wider block mb-2">Description *</label>
                  <textarea value={portfolioForm.description} onChange={e => setPortfolioForm({ ...portfolioForm, description: e.target.value })}
                    className="cyber-input resize-none" rows={3} placeholder="Project description" />
                </div>

                <div>
                  <label className="font-body text-xs text-slate-400 uppercase tracking-wider block mb-2">Tags (comma separated)</label>
                  <input value={portfolioForm.tags} onChange={e => setPortfolioForm({ ...portfolioForm, tags: e.target.value })}
                    className="cyber-input" placeholder="React, Node.js, MongoDB" />
                </div>

                <div>
                  <label className="font-body text-xs text-slate-400 uppercase tracking-wider block mb-2">Accent Color</label>
                  <div className="flex gap-3 flex-wrap">
                    {colorOptions.map(c => (
                      <button key={c} onClick={() => setPortfolioForm({ ...portfolioForm, color: c })}
                        className="w-8 h-8 rounded-full border-2 transition-all"
                        style={{
                          background: c,
                          borderColor: portfolioForm.color === c ? '#fff' : 'transparent',
                          boxShadow: portfolioForm.color === c ? `0 0 12px ${c}` : 'none'
                        }} />
                    ))}
                  </div>
                </div>

                <div>
                  <label className="font-body text-xs text-slate-400 uppercase tracking-wider block mb-2">Live URL</label>
                  <input value={portfolioForm.liveUrl} onChange={e => setPortfolioForm({ ...portfolioForm, liveUrl: e.target.value })}
                    className="cyber-input" placeholder="https://yourproject.com" />
                </div>

                <div>
                  <label className="font-body text-xs text-slate-400 uppercase tracking-wider block mb-2">Image URL</label>
                  <input value={portfolioForm.imageUrl} onChange={e => setPortfolioForm({ ...portfolioForm, imageUrl: e.target.value })}
                    className="cyber-input" placeholder="https://image-url.com/preview.jpg" />
                </div>

                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={portfolioForm.featured}
                      onChange={e => setPortfolioForm({ ...portfolioForm, featured: e.target.checked })}
                      className="w-4 h-4 accent-neon-blue" />
                    <span className="font-body text-sm text-slate-300">Featured item</span>
                  </label>
                  <div className="flex items-center gap-2">
                    <label className="font-body text-xs text-slate-400">Order:</label>
                    <input type="number" value={portfolioForm.order}
                      onChange={e => setPortfolioForm({ ...portfolioForm, order: parseInt(e.target.value) || 0 })}
                      className="cyber-input w-20 text-center" />
                  </div>
                </div>

                {editingPortfolio && (
                  <div>
                    <label className="font-body text-xs text-slate-400 uppercase tracking-wider block mb-2">Visibility</label>
                    <select value={portfolioForm.isActive} onChange={e => setPortfolioForm({ ...portfolioForm, isActive: e.target.value === 'true' })}
                      className="cyber-input">
                      <option value="true">Active (Visible)</option>
                      <option value="false">Hidden</option>
                    </select>
                  </div>
                )}

                <div className="flex gap-3 pt-2">
                  <button onClick={() => setShowPortfolioForm(false)} className="btn-secondary flex-1 py-3 text-xs">
                    Cancel
                  </button>
                  <button onClick={savePortfolio} disabled={savingPortfolio} className="btn-glow flex-1 py-3 text-xs">
                    {savingPortfolio ? 'Saving...' : editingPortfolio ? 'Update Item' : 'Add Item'}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
