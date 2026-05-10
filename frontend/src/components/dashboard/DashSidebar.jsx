import { Link, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuth } from '../../context/AuthContext'
import {
  RiDashboardLine, RiProjectorLine, RiAddCircleLine,
  RiUserLine, RiBellLine, RiLogoutBoxLine
} from 'react-icons/ri'

const links = [
  { to: '/dashboard', icon: RiDashboardLine, label: 'Overview' },
  { to: '/dashboard?tab=projects', icon: RiProjectorLine, label: 'My Projects' },
  { to: '/submit-project', icon: RiAddCircleLine, label: 'New Request' },
  { to: '/dashboard?tab=profile', icon: RiUserLine, label: 'Profile' },
  { to: '/dashboard?tab=notifications', icon: RiBellLine, label: 'Notifications' },
]

export default function DashSidebar({ activeTab, setActiveTab, mobile }) {
  const { user, logout } = useAuth()
  const location = useLocation()

  const navItems = [
    { key: 'overview', icon: RiDashboardLine, label: 'Overview' },
    { key: 'projects', icon: RiProjectorLine, label: 'My Projects' },
    { key: 'profile', icon: RiUserLine, label: 'Profile' },
    { key: 'notifications', icon: RiBellLine, label: 'Notifications' },
  ]

  return (
    <div className={`flex flex-col h-full ${mobile ? '' : 'w-64'}`}>
      {/* Brand */}
      <div className="p-6 border-b border-neon-blue/10">
        <Link to="/" className="flex items-center gap-3">
          <div className="w-8 h-8 rounded border border-neon-blue/50 flex items-center justify-center bg-dark-800">
            <span className="font-display text-xs font-bold text-neon-blue">CX</span>
          </div>
          <span className="font-display text-sm font-bold text-white tracking-widest">
            CREAVIX<span className="text-neon-blue">.</span>WORLD
          </span>
        </Link>
      </div>

      {/* User info */}
      <div className="p-4 mx-4 mt-4 glass rounded-lg">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-neon-blue to-neon-purple flex items-center justify-center">
            <span className="font-display text-sm font-bold text-dark-900">
              {user?.name?.[0]?.toUpperCase()}
            </span>
          </div>
          <div className="overflow-hidden">
            <div className="font-body text-sm font-semibold text-white truncate">{user?.name}</div>
            <div className="font-mono text-xs text-neon-blue">Active</div>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-4 space-y-1 mt-4">
        {navItems.map((item) => {
          const Icon = item.icon
          const active = activeTab === item.key
          return (
            <button
              key={item.key}
              onClick={() => setActiveTab(item.key)}
              className={`sidebar-link w-full ${active ? 'active' : ''}`}
            >
              <Icon size={18} />
              <span>{item.label}</span>
              {active && (
                <motion.div
                  layoutId="sidebar-active"
                  className="ml-auto w-1.5 h-1.5 rounded-full bg-neon-blue"
                />
              )}
            </button>
          )
        })}

        <Link to="/submit-project" className="sidebar-link block">
          <div className="flex items-center gap-3">
            <RiAddCircleLine size={18} />
            <span>New Request</span>
          </div>
        </Link>
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-neon-blue/10">
        <button onClick={logout} className="sidebar-link w-full text-neon-pink hover:text-neon-pink hover:border-neon-pink/30">
          <RiLogoutBoxLine size={18} />
          <span>Logout</span>
        </button>
      </div>
    </div>
  )
}
