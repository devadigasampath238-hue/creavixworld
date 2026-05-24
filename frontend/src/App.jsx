import { lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AuthProvider, useAuth } from './context/AuthContext'
import ParticleBackground from './components/ui/ParticleBackground'
import CursorGlow from './components/ui/CursorGlow'
import ChatWidget from './components/chat/ChatWidget'
import ScrollToTop from './components/ui/ScrollToTop'

// Lazy load all pages for performance
const Home = lazy(() => import('./pages/Home'))
const Login = lazy(() => import('./pages/Login'))
const Signup = lazy(() => import('./pages/Signup'))
const VerifyOTP = lazy(() => import('./pages/VerifyOTP'))
const ForgotPassword = lazy(() => import('./pages/ForgotPassword'))
const ResetPassword = lazy(() => import('./pages/ResetPassword'))
const Dashboard = lazy(() => import('./pages/Dashboard'))
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'))
const SubmitProject = lazy(() => import('./pages/SubmitProject'))
const NotFound = lazy(() => import('./pages/NotFound'))

// Page loader fallback
function PageLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-dark-900">
      <div className="flex flex-col items-center gap-4">
        <div className="cyber-loader" />
        <p className="font-mono text-xs text-neon-blue/60 tracking-widest animate-pulse">LOADING...</p>
      </div>
    </div>
  )
}

function ProtectedRoute({ children, adminOnly = false }) {
  const { user, loading } = useAuth()
  if (loading) return <PageLoader />
  if (!user) return <Navigate to="/login" replace />
  if (adminOnly && user.role !== 'admin') return <Navigate to="/dashboard" replace />
  return children
}

function PublicRoute({ children }) {
  const { user, loading } = useAuth()
  if (loading) return null
  if (user) return <Navigate to={user.role === 'admin' ? '/admin' : '/dashboard'} replace />
  return children
}

function AppRoutes() {
  return (
    <>
      <CursorGlow />
      <ParticleBackground />
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: 'rgba(13, 19, 33, 0.95)',
            border: '1px solid rgba(0, 212, 255, 0.3)',
            color: '#e2e8f0',
            fontFamily: '"Exo 2", sans-serif',
            fontSize: '14px',
          },
          success: { iconTheme: { primary: '#00d4ff', secondary: '#030508' } },
          error: { iconTheme: { primary: '#ff006e', secondary: '#030508' } },
        }}
      />
      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
          <Route path="/signup" element={<PublicRoute><Signup /></PublicRoute>} />
          <Route path="/verify-otp" element={<VerifyOTP />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/submit-project" element={<ProtectedRoute><SubmitProject /></ProtectedRoute>} />
          <Route path="/admin" element={<ProtectedRoute adminOnly><AdminDashboard /></ProtectedRoute>} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
      <ChatWidget />
      <ScrollToTop />
    </>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  )
}