import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useAuth, api } from '../context/AuthContext'
import { Link, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import {
  RiDashboardLine, RiTeamLine, RiProjectorLine, RiSettings3Line,
  RiBellLine, RiLogoutBoxLine, RiMenuLine, RiCheckLine, RiCloseLine
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

function StatCard({ label, value, color, icon: Icon }) {
  return (
    <div className="glass rounded-xl p-5" style={{ borderColor: `${color}20` }}>
      <div className="flex items-center justify-between mb-2">
        <span className="font-body text-xs text-slate-400 uppercase tracking-wider">{label}</span>
        <Icon size={18} style={{ color }} />
      </div>
      <div className="font-display text-3xl font-bold text-white">{value}</div>
    </div>
  )
}

const adminLinks = [
  { key: 'overview', icon: RiDashboardLine, label: 'Overview' },
  { key: 'projects', icon: RiProjectorLine, label: 'Projects' },
  { key: 'users', icon: RiTeamLine, label: 'Users' },
  { key: 'notifications', icon: RiBellLine, label: 'Notifications' },
]

export default function AdminDashboard() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('overview')
  const [projects, setProjects] = useState([])
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [noteInputs, setNoteInputs] = useState({})

  useEffect(() => {
    fetchAll()
  }, [])

  const fetchAll = async () => {
    try {
      const [pRes, uRes] = await Promise.all([
        api.get('/admin/projects'),
        api.get('/admin/users'),
      ])
      setProjects(pRes.data.projects || [])
      setUsers(uRes.data.users || [])
    } catch (e) {
      toast.error('Failed to load data')
    } finally {
      setLoading(false)
    }
  }

  const updateStatus = async (id, status) => {
    try {
      await api.put(`/admin/projects/${id}/status`, { status, adminNote: noteInputs[id] || '' })
      toast.success('Status updated!')
      setProjects(projects.map(p => p._id === id ? { ...p, status, adminNote: noteInputs[id] || p.adminNote } : p))
    } catch (e) {
      toast.error('Update failed')
    }
  }

  const toggleUserStatus = async (id, active) => {
    try {
      await api.put(`/admin/users/${id}`, { isActive: !active })
      setUsers(users.map(u => u._id === id ? { ...u, isActive: !active } : u))
      toast.success('User status updated!')
    } catch (e) {
      toast.error('Failed')
    }
  }

  const stats = [
    { label: 'Total Users', value: users.length, color: '#00d4ff', icon: RiTeamLine },
    { label: 'Total Projects', value: projects.length, color: '#9d4edd', icon: RiProjectorLine },
    { label: 'In Progress', value: projects.filter(p => p.status === 'in_progress').length, color: '#eab308', icon: RiDashboardLine },
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
            <div className="font-mono text-xs text-neon-pink">ADMIN</div>
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
        <button onClick={logout} className="sidebar-link w-full text-neon-pink hover:text-neon-pink">
          <RiLogoutBoxLine size={18} /><span>Logout</span>
        </button>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-dark-900 flex">
      <aside className="hidden lg:flex flex-col glass-dark border-r border-neon-blue/10 fixed left-0 top-0 h-full z-40 w-64">
        <Sidebar />
      </aside>
      {sidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div className="w-64 glass-dark border-r border-neon-blue/10 h-full"><Sidebar /></div>
          <div className="flex-1 bg-dark-900/80" onClick={() => setSidebarOpen(false)} />
        </div>
      )}

      <main className="flex-1 lg:ml-64 p-4 sm:p-6 lg:p-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <button className="lg:hidden text-neon-blue" onClick={() => setSidebarOpen(true)}>
              <RiMenuLine size={24} />
            </button>
            <div>
              <h1 className="font-display text-xl font-bold text-white flex items-center gap-2">
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
            {activeTab === 'overview' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                  {stats.map(s => <StatCard key={s.label} {...s} />)}
                </div>

                {/* Recent projects */}
                <div className="glass rounded-xl p-6 mb-6">
                  <h2 className="font-display text-sm font-semibold text-white mb-4">Recent Project Requests</h2>
                  <div className="space-y-3">
                    {projects.slice(0, 5).map(p => (
                      <div key={p._id} className="flex items-center justify-between p-3 rounded-lg bg-dark-700/50">
                        <div>
                          <div className="font-body text-sm text-white">{p.businessName}</div>
                          <div className="font-mono text-xs text-slate-500">{p.projectType} • {p.budget}</div>
                        </div>
                        <span className={`font-mono text-xs px-3 py-1 rounded-full ${statusConfig[p.status]?.cls}`}>
                          {statusConfig[p.status]?.label}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

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
                          {p.projectType} • {p.budget} • by {p.userId?.name || 'Unknown'}
                        </div>
                        <div className="font-mono text-xs text-slate-500 mt-0.5">
                          {p.email} • {p.phone}
                        </div>
                      </div>
                      <span className={`font-mono text-xs px-3 py-1 rounded-full ${statusConfig[p.status]?.cls}`}>
                        {statusConfig[p.status]?.label}
                      </span>
                    </div>
                    <p className="font-body text-sm text-slate-300 mb-4">{p.description}</p>
                    {p.deadline && (
                      <p className="font-mono text-xs text-slate-500 mb-4">Deadline: {format(new Date(p.deadline), 'MMM d, yyyy')}</p>
                    )}

                    {/* Status update */}
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
                        placeholder="Add admin note to client..."
                      />
                    </div>
                  </div>
                ))}
              </motion.div>
            )}

            {activeTab === 'users' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-3">
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
                      <span className={`font-mono text-xs px-2 py-1 rounded-full ${u.isVerified ? 'badge-completed' : 'badge-pending'}`}>
                        {u.isVerified ? 'Verified' : 'Unverified'}
                      </span>
                      <button
                        onClick={() => toggleUserStatus(u._id, u.isActive)}
                        className={`font-mono text-xs px-3 py-1.5 rounded border transition-all ${
                          u.isActive !== false
                            ? 'border-neon-pink/30 text-neon-pink hover:bg-neon-pink/10'
                            : 'border-neon-cyan/30 text-neon-cyan hover:bg-neon-cyan/10'
                        }`}
                      >
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
    </div>
  )
}
