import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL

function Dashboard() {
  const navigate = useNavigate()

  useEffect(() => {
    const init = async () => {
      try {
        // Check if logged in
        const userRes = await axios.get(`${API_URL}/auth/me`, {
          withCredentials: true
        })
        const username = userRes.data.user.username

        // Generate fresh stats
        await axios.get(`${API_URL}/api/stats/generate`, {
          withCredentials: true
        })

        // Redirect straight to wrapped card
        navigate(`/wrapped/${username}`)
      } catch {
        navigate('/')
      }
    }

    init()
  }, [])

  return (
    <div style={{
      minHeight: '100vh',
      background: '#080B10',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      color: '#E8EDF5',
      fontFamily: 'Segoe UI, system-ui, sans-serif',
      gap: '16px'
    }}>
      <div style={{
        width: '32px',
        height: '32px',
        border: '3px solid #1E2730',
        borderTopColor: '#3EE8A0',
        borderRadius: '50%',
        animation: 'spin 0.8s linear infinite'
      }}></div>
      <p style={{ color: '#5A6878' }}>Generating your developer story...</p>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}

export default Dashboard