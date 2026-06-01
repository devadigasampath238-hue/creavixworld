import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const GoogleSuccess = () => {
  const navigate = useNavigate()
  const { loginWithToken } = useAuth()

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const token = params.get('token')

    if (token) {
      loginWithToken(token)
    } else {
      navigate('/login')
    }
  }, [])

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#030508]">
      <div className="text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-[#00d4ff] mx-auto mb-4"></div>
        <p className="text-[#00d4ff] text-xl font-orbitron">Logging in with Google...</p>
      </div>
    </div>
  )
}

export default GoogleSuccess