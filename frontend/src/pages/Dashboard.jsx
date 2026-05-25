import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useAuth, api } from '../context/AuthContext'
import DashSidebar from '../components/dashboard/DashSidebar'
import { RiProjectorLine, RiCheckLine, RiTimeLine, RiBellLine, RiMenuLine } from 'react-icons/ri'
import { Link } from 'react-router-dom'
import { format } from 'date-fns'
import PrintCard from '../components/dashboard/PrintCard'

const statusConfig = {
  pending: { label: 'Pending', cls: 'badge-pending' },
  under_review: { label: 'Under Review', cls: 'badge-review' },
  in_progress: { label: 'In Progress', cls: 'badge-progress' },
  completed: { label: 'Completed', cls: 'badge-completed' },
  delivered: { label: 'Delivered', cls: 'badge-delivered' },
}

function StatCard({ label, value, icon: Icon, color }) {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      className="glass rounded-xl p-5"
      style={{ borderColor: `${color}20` }}
    >
      <div className="flex items-center justify-between mb-3">
        <span className="font-body text-xs text-slate-400 uppercase tracking-wider">{label}</span>
        <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: `${color}15`, border: `1px solid ${color}30` }}>
          <Icon size={18} style={{ color }} />
        </div>
      </div>
      <div className="font-display text-2xl font-bold text-white">{value}</div>
    </motion.div>
  )
}

export default function Dashboard() {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState('overview')
  const [projects, setProjects] = useState([])
  const [notifications, setNotifications] = useState([])
  const [loading, setLoading] = useState(true)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [editProfile, setEditProfile] = useState({ name: user?.name || '', phone: user?.phone || '' })
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [pRes, nRes] = await Promise.all([
          api.get('/projects/my'),
          api.get('/notifications/my'),
        ])
        setProjects(pRes.data.projects || [])
        setNotifications(nRes.data.notifications || [])
      } catch (e) {}
      finally { setLoading(false) }
    }
    fetchData()
  }, [])

  const saveProfile = async () => {
    setSaving(true)
    try {
      await api.put('/auth/profile', editProfile)
    } catch (e) {}
    setSaving(false)
  }

  const stats = [
    { label: 'Total Projects', value: projects.length, icon: RiProjectorLine, color: '#00d4ff' },
    { label: 'In Progress', value: projects.filter(p => p.status === 'in_progress').length, icon: RiTimeLine, color: '#9d4edd' },
    { label: 'Completed', value: projects.filter(p => ['completed','delivered'].includes(p.status)).length, icon: RiCheckLine, color: '#22c55e' },
    { label: 'Notifications', value: notifications.filter(n => !n.read).length, icon: RiBellLine, color: '#ff006e' },
  ]

  return (
    <div className="min-h-screen bg-dark-900 flex">
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex flex-col glass-dark border-r border-neon-blue/10 fixed left-0 top-0 h-full z-40 w-64">
        <DashSidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      </aside>

      {/* Mobile sidebar */}
      {sidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div className="w-64 glass-dark border-r border-neon-blue/10 h-full">
            <DashSidebar activeTab={activeTab} setActiveTab={(t) => { setActiveTab(t); setSidebarOpen(false) }} mobile />
          </div>
          <div className="flex-1 bg-dark-900/80" onClick={() => setSidebarOpen(false)} />
        </div>
      )}

      {/* Main */}
      <main className="flex-1 lg:ml-64 p-4 sm:p-6 lg:p-8">
        {/* Top bar */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <button className="lg:hidden mr-4 text-neon-blue" onClick={() => setSidebarOpen(true)}>
              <RiMenuLine size={24} />
            </button>
            <h1 className="font-display text-xl sm:text-2xl font-bold text-white inline">
              {activeTab === 'overview' && 'Dashboard'}
              {activeTab === 'projects' && 'My Projects'}
              {activeTab === 'profile' && 'Profile'}
              {activeTab === 'notifications' && 'Notifications'}
            </h1>
            <div className="font-body text-xs text-slate-500 mt-1">
              Welcome back, <span className="text-neon-blue">{user?.name}</span>
            </div>
          </div>
          <Link to="/submit-project" className="btn-primary text-xs py-2 px-4">
            + New Request
          </Link>
        </div>

        {/* Overview */}
        {activeTab === 'overview' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              {stats.map(s => <StatCard key={s.label} {...s} />)}
            </div>

            <div className="glass rounded-xl p-6">
              <h2 className="font-display text-sm font-semibold text-white mb-4 tracking-wide">Recent Projects</h2>
              {projects.length === 0 ? (
                <div className="text-center py-12">
                  <RiProjectorLine className="mx-auto text-slate-600 mb-3" size={40} />
                  <p className="font-body text-slate-500 mb-4">No projects yet</p>
                  <Link to="/submit-project" className="btn-glow text-xs py-2 px-6">Submit Your First Project</Link>
                </div>
              ) : (
                <div className="space-y-3">
                  {projects.slice(0, 5).map(p => (
                    <div key={p._id} className="flex items-center justify-between p-4 rounded-lg bg-dark-700/50 border border-neon-blue/10">
                      <div>
                        <div className="font-body text-sm font-medium text-white">{p.businessName || p.name}</div>
                        <div className="font-mono text-xs text-slate-500">{p.projectType}</div>
                      </div>
                      <span className={`font-mono text-xs px-3 py-1 rounded-full ${statusConfig[p.status]?.cls || 'badge-pending'}`}>
                        {statusConfig[p.status]?.label || 'Pending'}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* Projects tab */}
        {activeTab === 'projects' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            {loading ? (
              <div className="flex justify-center py-20"><div className="cyber-loader" /></div>
            ) : projects.length === 0 ? (
              <div className="text-center py-20">
                <p className="font-body text-slate-400 mb-4">No project requests yet.</p>
                <Link to="/submit-project" className="btn-glow text-xs py-2 px-6">Submit Project Request</Link>
              </div>
            ) : (
              <div className="space-y-4">
                {projects.map(p => (
                  <div key={p._id} className="glass rounded-xl p-5">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="font-body font-semibold text-white">{p.businessName}</h3>
                        <span className="font-mono text-xs text-slate-400">{p.projectType} • Budget: {p.budget}</span>
                      </div>
                      <span className={`font-mono text-xs px-3 py-1 rounded-full ${statusConfig[p.status]?.cls}`}>
                        {statusConfig[p.status]?.label}
                      </span>
                    </div>
                    <p className="font-body text-xs text-slate-400 mb-3 line-clamp-2">{p.description}</p>
                    <div className="flex items-center gap-4 text-xs text-slate-500 font-mono">
                      <span>Deadline: {p.deadline ? format(new Date(p.deadline), 'MMM d, yyyy') : 'TBD'}</span>
                      <span>Submitted: {format(new Date(p.createdAt), 'MMM d, yyyy')}</span>
                    </div>
                    {p.adminNote && (
                      <div className="mt-3 p-3 rounded-lg bg-neon-blue/5 border border-neon-blue/20 font-body text-xs text-neon-blue">
                        Admin Note: {p.adminNote}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        )}

        {/* Profile tab */}
        {activeTab === 'profile' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-lg">
            <div className="glass rounded-xl p-6 space-y-5">
              <div className="flex items-center gap-4 pb-5 border-b border-neon-blue/10">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-neon-blue to-neon-purple flex items-center justify-center">
                  <span className="font-display text-2xl font-bold text-dark-900">{user?.name?.[0]?.toUpperCase()}</span>
                </div>
                <div>
                  <h2 className="font-display text-lg font-semibold text-white">{user?.name}</h2>
                  <p className="font-body text-sm text-neon-blue">{user?.email}</p>
                </div>
              </div>
              <div>
                <label className="font-body text-xs text-slate-400 uppercase tracking-wider block mb-2">Full Name</label>
                <input
                  value={editProfile.name}
                  onChange={e => setEditProfile({ ...editProfile, name: e.target.value })}
                  className="cyber-input"
                />
              </div>
              <div>
                <label className="font-body text-xs text-slate-400 uppercase tracking-wider block mb-2">Phone</label>
                <input
                  value={editProfile.phone}
                  onChange={e => setEditProfile({ ...editProfile, phone: e.target.value })}
                  className="cyber-input"
                  placeholder="+1 234 567 8900"
                />
              </div>
              <div>
                <label className="font-body text-xs text-slate-400 uppercase tracking-wider block mb-2">Email</label>
                <input value={user?.email} disabled className="cyber-input opacity-50" />
              </div>
              <button onClick={saveProfile} disabled={saving} className="btn-glow w-full py-3">
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </motion.div>
        )}
       

// Inside profile tab section:
<div className="mt-6">
  <h3 className="font-display text-sm font-semibold text-white mb-4">Member Card</h3>
  <PrintCard user={user} />
</div>

        {/* Notifications tab */}
        {activeTab === 'notifications' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            {notifications.length === 0 ? (
              <div className="text-center py-20">
                <RiBellLine className="mx-auto text-slate-600 mb-3" size={40} />
                <p className="font-body text-slate-500">No notifications yet</p>
              </div>
            ) : (
              <div className="space-y-3">
                {notifications.map(n => (
                  <div key={n._id} className={`glass rounded-xl p-4 border ${n.read ? 'opacity-60' : 'border-neon-blue/20'}`}>
                    <div className="flex items-start gap-3">
                      <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${n.read ? 'bg-slate-600' : 'bg-neon-blue animate-pulse'}`} />
                      <div>
                        <p className="font-body text-sm text-white mb-1">{n.message}</p>
                        <p className="font-mono text-xs text-slate-500">{format(new Date(n.createdAt), 'MMM d, yyyy HH:mm')}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </main>
    </div>
  )
}
