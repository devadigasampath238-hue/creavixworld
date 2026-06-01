import { createContext, useContext, useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

const AuthContext = createContext(null)

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('creavix_token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    const token = localStorage.getItem('creavix_token')
    if (token) {
      api.get('/auth/me')
        .then(res => setUser(res.data.user))
        .catch(() => localStorage.removeItem('creavix_token'))
        .finally(() => setLoading(false))
    } else {
      setLoading(false)
    }
  }, [])

  const login = async (email, password) => {
    const res = await api.post('/auth/login', { email, password })
    localStorage.setItem('creavix_token', res.data.token)
    setUser(res.data.user)
    return res.data
  }

  const signup = async (data) => {
    const res = await api.post('/auth/signup', data)
    return res.data
  }

  const verifyOTP = async (email, otp) => {
    const res = await api.post('/auth/verify-otp', { email, otp })
    localStorage.setItem('creavix_token', res.data.token)
    setUser(res.data.user)
    return res.data
  }

  const logout = () => {
    localStorage.removeItem('creavix_token')
    setUser(null)
  }

  const forgotPassword = async (email) => {
    const res = await api.post('/auth/forgot-password', { email })
    return res.data
  }

  const resetPassword = async (token, password) => {
    const res = await api.post('/auth/reset-password', { token, password })
    return res.data
  }

  const loginWithToken = async (token) => {
    localStorage.setItem('creavix_token', token)
    try {
      const res = await api.get('/auth/me', {
        headers: { Authorization: `Bearer ${token}` }
      })
      setUser(res.data.user)
      navigate(res.data.user.role === 'admin' ? '/admin' : '/dashboard')
    } catch {
      localStorage.removeItem('creavix_token')
      navigate('/login')
    }
  }

  return (
    <AuthContext.Provider value={{ 
      user, loading, login, signup, verifyOTP, 
      logout, forgotPassword, resetPassword, 
      loginWithToken, api 
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be inside AuthProvider')
  return ctx
}

export { api }