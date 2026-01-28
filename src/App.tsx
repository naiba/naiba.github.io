import { useEffect, useState } from 'react'
import './App.css'
import { config } from './config'
import { domains } from 'virtual:domains'

const GitHubIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
  </svg>
)

const TwitterIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
  </svg>
)

const BlogIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 19l7-7 3 3-7 7-3-3z"/>
    <path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z"/>
    <path d="M2 2l7.586 7.586"/>
    <circle cx="11" cy="11" r="2"/>
  </svg>
)

const StarIcon = () => (
  <svg className="star-icon" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
  </svg>
)

function decodeDomain(encoded: string): string {
  try {
    return atob(encoded)
  } catch {
    return encoded
  }
}

function parseDomain(encoded: string) {
  const domain = decodeDomain(encoded)
  const lastDot = domain.lastIndexOf('.')
  return {
    domain,
    name: domain.slice(0, lastDot),
    tld: domain.slice(lastDot),
  }
}

function renderTagline(text: string) {
  return text.split(/<highlight>(.*?)<\/highlight>/).map((part, i) =>
    i % 2 === 1 ? <span key={i} className="tagline-highlight">{part}</span> : part
  )
}

function renderFooter(text: string) {
  return text.split(/<heart \/>/).map((part, i, arr) =>
    i < arr.length - 1 ? (
      <span key={i}>{part}<span className="footer-heart">♥</span></span>
    ) : part
  )
}

function calcYears(startDate: string): number {
  const start = new Date(startDate)
  const now = new Date()
  return Math.floor((now.getTime() - start.getTime()) / (365.25 * 24 * 60 * 60 * 1000))
}

function renderBioText(item: { icon: string; text: string; dynamic?: string }): string {
  if (item.dynamic && config.startDates[item.dynamic as keyof typeof config.startDates]) {
    const years = calcYears(config.startDates[item.dynamic as keyof typeof config.startDates])
    return `${item.text} ${years} 年`
  }
  return item.text
}

function formatStars(count: number): string {
  if (count >= 1000) {
    return (count / 1000).toFixed(1).replace(/\.0$/, '') + 'k'
  }
  return count.toString()
}

function useGitHubStars() {
  const [stars, setStars] = useState<Record<string, number>>({})

  useEffect(() => {
    const fetchStars = async () => {
      const results: Record<string, number> = {}
      
      for (const project of config.projects) {
        try {
          const res = await fetch(`https://api.github.com/repos/${project.repo}`)
          if (res.ok) {
            const data = await res.json()
            results[project.repo] = data.stargazers_count
          }
        } catch {
        }
      }
      
      setStars(results)
    }

    fetchStars()
  }, [])

  return stars
}

function App() {
  const stars = useGitHubStars()

  return (
    <div className="page">
      <div className="container">
        <section className="hero">
          <img
            src={config.avatar}
            alt={config.name}
            className="avatar"
          />
          <h1 className="name">
            {config.name}<span className="name-en">{config.nameEn}</span>
          </h1>
          <p className="tagline">
            {renderTagline(config.tagline)}
          </p>
          
          <div className="bio-tags">
            {config.bio.map((item, i) => (
              <span key={i} className="bio-tag" title={item.hover}>
                <span className="bio-tag-icon">{item.icon}</span>
                {renderBioText(item)}
              </span>
            ))}
          </div>

          <div className="social-links">
            {config.social.github && (
              <a
                href={config.social.github}
                target="_blank"
                rel="noopener noreferrer"
                className="social-link"
                aria-label="GitHub"
              >
                <GitHubIcon />
              </a>
            )}
            {config.social.twitter && (
              <a
                href={config.social.twitter}
                target="_blank"
                rel="noopener noreferrer"
                className="social-link"
                aria-label="Twitter"
              >
                <TwitterIcon />
              </a>
            )}
            {config.social.blog && (
              <a
                href={config.social.blog}
                target="_blank"
                rel="noopener noreferrer"
                className="social-link"
                aria-label="Blog"
              >
                <BlogIcon />
              </a>
            )}
          </div>
        </section>

        {config.projects.length > 0 && (
          <section className="section">
            <div className="section-header">
              <h2 className="section-title">🚀 开源项目</h2>
              <div className="section-line" />
            </div>
            
            <div className="projects-grid">
              {config.projects.map((project) => (
                <a
                  key={project.repo}
                  href={`https://github.com/${project.repo}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="project-card"
                >
                  <div className="project-icon">{project.icon}</div>
                  <div className="project-info">
                    <div className="project-name">{project.name}</div>
                    <div className="project-desc">{project.desc}</div>
                    <div className="project-stats">
                      <span className="project-stat">
                        <StarIcon /> {stars[project.repo] ? formatStars(stars[project.repo]) : '...'}
                      </span>
                    </div>
                  </div>
                </a>
              ))}
            </div>
          </section>
        )}

        {domains.length > 0 && (
          <section className="section">
            <div className="section-header">
              <h2 className="section-title">🌐 域名收藏</h2>
              <div className="section-line" />
            </div>
            
            <div className="domains-grid">
              {domains.map((encoded) => {
                const { domain, name, tld } = parseDomain(encoded)
                return (
                  <a
                    key={encoded}
                    href="#"
                    onClick={(e) => {
                      e.preventDefault()
                      window.open(`https://${domain}`, '_blank', 'noopener,noreferrer')
                    }}
                    className="domain-card"
                  >
                    <span className="domain-text">
                      <span className="domain-name">{name}</span>
                      <span className="domain-tld">{tld}</span>
                    </span>
                  </a>
                )
              })}
            </div>
          </section>
        )}
      </div>

      <footer className="footer">
        <p className="footer-text">
          {renderFooter(config.footer)}
        </p>
      </footer>
    </div>
  )
}

export default App
