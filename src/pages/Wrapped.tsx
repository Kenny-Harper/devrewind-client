import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import axios from 'axios'
import './Wrapped.css'

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
    readmeImage: string | null
    readmeLiveUrl: string | null
  }[]
  totalRepos: number
}

function Wrapped() {
  const { username } = useParams()
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [shareOpen, setShareOpen] = useState(false)
  const [avatarUrl, setAvatarUrl] = useState('')

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/stats/${username}`)
        setStats(res.data.stats)
        setAvatarUrl(res.data.avatar_url)
      } catch {
        setError('No stats found for this user')
      } finally {
        setLoading(false)
      }
    }
    fetchStats()
  }, [username])

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href)
    alert('Link copied!')
    setShareOpen(false)
  }

  const handleShareX = () => {
    window.open(
      `https://twitter.com/intent/tweet?text=Check out my developer story on DevRewind 🚀 Your CV doesn't tell the full story&url=${encodeURIComponent(window.location.href)}`,
      '_blank'
    )
    setShareOpen(false)
  }

  const handleShareLinkedIn = () => {
    window.open(
      `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}`,
      '_blank'
    )
    setShareOpen(false)
  }

  const handleLogout = () => {
    window.location.href = `${API_URL}/auth/logout`
  }

  if (loading) return (
    <div className="wrapped-loading">
      <div className="spinner"></div>
      <p>Loading DevRewind...</p>
    </div>
  )

  if (error || !stats) return (
    <div className="wrapped-error">
      <p>{error}</p>
    </div>
  )

  const topLang = stats.topLanguages[0]?.language || 'Code'

  const getProjectImage = (repo: Stats['pinnedRepos'][0]) => {
    if (repo.readmeImage) return repo.readmeImage
    if (repo.readmeLiveUrl) {
      return `https://api.microlink.io/?url=${encodeURIComponent(repo.readmeLiveUrl)}&screenshot=true&meta=false&embed=screenshot.url`
    }
    if (repo.homepageUrl) {
      return `https://api.microlink.io/?url=${encodeURIComponent(repo.homepageUrl)}&screenshot=true&meta=false&embed=screenshot.url`
    }
    return `https://opengraph.githubassets.com/1/${username}/${repo.name}`
  }

  const getLiveUrl = (repo: Stats['pinnedRepos'][0]): string => {
    return repo.readmeLiveUrl || repo.homepageUrl || repo.url
  }

  const getGridClass = (count: number): string => {
    if (count === 1) return 'projects-grid projects-grid-1'
    if (count === 2) return 'projects-grid projects-grid-2'
    if (count === 4) return 'projects-grid projects-grid-4'
    if (count === 5) return 'projects-grid projects-grid-3 projects-grid-5'
    return 'projects-grid projects-grid-3'
  }

  return (
    <div className="wrapped">
      <nav className="nav">
        <div className="logo">Dev<span>Rewind</span></div>
        <div className="nav-right">
          <button className="btn-logout" onClick={handleLogout}>Log out</button>
          <div className="share-dropdown-wrap">
            <button className="btn-share-main" onClick={() => setShareOpen(!shareOpen)}>
              Share ↗
            </button>
            {shareOpen && (
              <div className="share-menu">
                <button onClick={handleShareX}>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.737-8.835L1.254 2.25H8.08l4.253 5.622 5.911-5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                  </svg>
                  Share on X
                </button>
                <button onClick={handleShareLinkedIn}>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                  Share on LinkedIn
                </button>
                <button onClick={handleCopyLink}>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                    <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"></path>
                  </svg>
                  Copy link
                </button>
              </div>
            )}
          </div>
        </div>
      </nav>

      <main className="wrapped-main">
        <div className="wrapped-card">

          <div className="card-header">
            <div className="card-header-left">
              <div className="year-badge">Your Developer Story</div>
              <div className="card-username-row">
                {avatarUrl && (
                  <img src={avatarUrl} alt={username} className="card-avatar" />
                )}
                <h1 className="card-username">@{username}</h1>
              </div>
              <p className="card-tagline">Your CV doesn't tell the full story</p>
            </div>
            <div className="card-header-right">
              <div className="archetype-box">
                <div className="archetype-label">Top language</div>
                <div className="archetype-value">{topLang}</div>
              </div>
            </div>
          </div>

          <div className="card-stats">
            <div className="big-stat">
              <div className="big-number green">{stats.totalContributions}</div>
              <div className="big-label">Total contributions</div>
            </div>
            <div className="stat-divider"></div>
            <div className="big-stat">
              <div className="big-number blue">{stats.totalCommits}</div>
              <div className="big-label">Commits</div>
            </div>
            <div className="stat-divider"></div>
            <div className="big-stat">
              <div className="big-number purple">{stats.bestStreak} days</div>
              <div className="big-label">Best streak</div>
            </div>
            <div className="stat-divider"></div>
            <div className="big-stat">
              <div className="big-number amber">{stats.mostActiveDay}</div>
              <div className="big-label">Most active day</div>
            </div>
          </div>

          <div className="card-languages">
            <div className="section-title">Languages</div>
            <div className="lang-list">
              {stats.topLanguages.map((lang, i) => (
                <div key={i} className="lang-item">
                  <span className="lang-name">{lang.language}</span>
                  <div className="lang-bar-wrap">
                    <div
                      className="lang-bar"
                      style={{
                        width: `${(lang.count / stats.totalRepos) * 100}%`,
                        background: i === 0 ? '#4D9CFF' : i === 1 ? '#9B6FFF' : i === 2 ? '#F5A623' : '#3EE8A0'
                      }}
                    ></div>
                  </div>
                  <span className="lang-count">{lang.count} repos</span>
                </div>
              ))}
            </div>
          </div>

          {stats.pinnedRepos.length > 0 && (
            <div className="card-projects">
              <div className="section-title">Shipped projects</div>
              <div className={getGridClass(stats.pinnedRepos.length)}>
                {stats.pinnedRepos.map((repo, i) => (
                  <div key={i} className="project-card">
                    <a href={getLiveUrl(repo)} target="_blank" rel="noreferrer" className="project-image skeleton">
                      <img
                        src={getProjectImage(repo)}
                        alt={repo.name}
                        onLoad={(e) => {
                          (e.target as HTMLImageElement).parentElement?.classList.remove('skeleton')
                        }}
                        onError={(e) => {
                          const img = e.target as HTMLImageElement
                          img.src = `https://opengraph.githubassets.com/1/${username}/${repo.name}`
                          img.parentElement?.classList.remove('skeleton')
                        }}
                      />
                    </a>
                    <div className="project-content">
                      <div className="project-top">
                        <span className="project-name">{repo.name}</span>
                        {repo.primaryLanguage && (
                          <span className="project-lang">{repo.primaryLanguage.name}</span>
                        )}
                      </div>
                      <p className="project-desc">{repo.description}</p>
                      <div className="project-links">
                        <a href={repo.url} target="_blank" rel="noreferrer">GitHub →</a>
                        {(repo.readmeLiveUrl || repo.homepageUrl) && (
                          <a href={repo.readmeLiveUrl || repo.homepageUrl} target="_blank" rel="noreferrer">Live →</a>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="card-footer">
            <span className="footer-url">devrewind.app/{username}</span>
            <span className="footer-brand">Made with DevRewind</span>
          </div>

        </div>
      </main>
    </div>
  )
}

export default Wrapped