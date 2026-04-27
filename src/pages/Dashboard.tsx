/*
 * WHAT THIS FILE DOES (plain English)
 *
 * This is the page users land on after logging in with GitHub.
 * It fetches their stats from our backend, displays them, and lets
 * them view their shareable DevRewind card.
 *
 * It talks to our backend API at /api/stats/generate to get the data,
 * then passes it down to child components to display.
 */

import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import './Dashboard.css'

const API_URL = import.meta.env.VITE_API_URL

interface Stats {
  totalContributions: number
  totalCommits: number
  bestStreak: number
  mostActiveDay: string
  topLanguages: { language: string; count: number }[]
  pinnedRepos: {
    name: string
    description: string
    url: string
    homepageUrl: string
    stargazerCount: number
    primaryLanguage: { name: string } | null
  }[]
  totalRepos: number
}

function Dashboard() {
  const [stats, setStats] = useState<Stats | null>(null)
  const [user, setUser] = useState<{ username: string; avatar_url: string } | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Check if user is logged in
        const userRes = await axios.get(`${API_URL}/auth/me`, {
          withCredentials: true
        })
        setUser(userRes.data.user)

        // Fetch their GitHub stats
        const statsRes = await axios.get(`${API_URL}/api/stats/generate`, {
          withCredentials: true
        })
        setStats(statsRes.data.stats)
      } catch (err) {
        setError('Please log in to view your dashboard')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  if (loading) return (
    <div className="dashboard-loading">
      <div className="spinner"></div>
      <p>Fetching your GitHub stats...</p>
    </div>
  )

  if (error) return (
    <div className="dashboard-error">
      <p>{error}</p>
      <button onClick={() => navigate('/')}>Go back home</button>
    </div>
  )

  if (!stats || !user) return null

  const topLang = stats.topLanguages[0]?.language || 'Unknown'

  return (
    <div className="dashboard">
      <nav className="nav">
        <div className="logo">Dev<span>Rewind</span></div>
        <div className="nav-user">
          <img src={user.avatar_url} alt={user.username} className="avatar" />
          <span>@{user.username}</span>
        </div>
      </nav>

      <main className="dashboard-main">
        <div className="dashboard-header">
          <h1>Your 2025 Rewind</h1>
          <button
            className="btn-share"
            onClick={() => navigate(`/wrapped/${user.username}`)}
          >
            View shareable card →
          </button>
        </div>

        {/* Stats grid */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-label">Total contributions</div>
            <div className="stat-value green">{stats.totalContributions}</div>
            <div className="stat-sub">across {stats.totalRepos} repos</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Total commits</div>
            <div className="stat-value blue">{stats.totalCommits}</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Best streak</div>
            <div className="stat-value purple">{stats.bestStreak} days</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Most active day</div>
            <div className="stat-value amber">{stats.mostActiveDay}</div>
          </div>
        </div>

        {/* Languages */}
        <div className="section">
          <h2>Top languages</h2>
          <div className="languages">
            {stats.topLanguages.map((lang, i) => (
              <div key={i} className="lang-row">
                <span className="lang-name">{lang.language}</span>
                <div className="lang-bar-wrap">
                  <div
                    className="lang-bar"
                    style={{ width: `${(lang.count / stats.totalRepos) * 100}%` }}
                  ></div>
                </div>
                <span className="lang-count">{lang.count} repos</span>
              </div>
            ))}
          </div>
        </div>

        {/* Pinned repos */}
        {stats.pinnedRepos.length > 0 && (
          <div className="section">
            <h2>Pinned projects</h2>
            <div className="projects-grid">
              {stats.pinnedRepos.map((repo, i) => (
                <div key={i} className="project-card">
                  <div className="project-top">
                    <span className="project-name">{repo.name}</span>
                    {repo.primaryLanguage && (
                      <span className="project-lang">{repo.primaryLanguage.name}</span>
                    )}
                  </div>
                  <p className="project-desc">{repo.description}</p>
                  <div className="project-links">
                    <a href={repo.url} target="_blank" rel="noreferrer">GitHub →</a>
                    {repo.homepageUrl && (
                      <a href={repo.homepageUrl} target="_blank" rel="noreferrer">
                        Live demo →
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  )
}

export default Dashboard