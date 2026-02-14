import { useEffect, useRef, useState } from 'react'
import './App.css'
import { config } from './config'
import { domains } from 'virtual:domains'
import { useLang, t, type Lang, type BiText } from './i18n'

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
  <svg viewBox="0 0 24 24" fill="currentColor">
    <path d="M21.976 24H2.026C.9 24 0 23.1 0 21.976V2.026C0 .9.9 0 2.026 0H21.97C23.1 0 24 .9 24 2.026v19.948C24 23.1 23.1 24 21.976 24zM12.96 5.28c-1.606 0-2.41.845-2.56 1.636-.056.296-.04.636-.04.636H8.39c0-.036.004-.072.008-.104 0 0-.008-.088-.008-.204 0-1.2-.972-2.172-2.172-2.172S4.046 6.044 4.046 7.244v4.464c0 3.6 2.916 6.516 6.516 6.516h3.24c2.544 0 4.608-2.064 4.608-4.608V9.888c0-2.544-2.064-4.608-4.608-4.608h-.84zm1.44 8.4h-4.8c-.48 0-.84-.36-.84-.84s.36-.84.84-.84h4.8c.48 0 .84.36.84.84s-.36.84-.84.84zm0-3.6H12c-.48 0-.84-.36-.84-.84s.36-.84.84-.84h2.4c.48 0 .84.36.84.84s-.36.84-.84.84z"/>
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
  return Math.ceil((now.getTime() - start.getTime()) / (365.25 * 24 * 60 * 60 * 1000))
}

function renderBioText(item: { text: BiText; dynamic?: string }, lang: Lang): string {
  if (item.dynamic && config.startDates[item.dynamic as keyof typeof config.startDates]) {
    const years = calcYears(config.startDates[item.dynamic as keyof typeof config.startDates])
    if (lang === 'zh') {
      return `${t(item.text, lang)}${years}年`
    }
    return `${t(item.text, lang)}${years} at Work`
  }
  return t(item.text, lang)
}

function formatStars(count: number): string {
  if (count >= 1000) {
    return (count / 1000).toFixed(1).replace(/\.0$/, '') + 'k'
  }
  return count.toString()
}

const STARS_CACHE_KEY = 'gh_stars'
const STARS_CACHE_TTL = 60 * 60 * 1000 // 1 hour

function useGitHubStars() {
  const [stars, setStars] = useState<Record<string, number>>(() => {
    try {
      const raw = localStorage.getItem(STARS_CACHE_KEY)
      if (raw) {
        const { data, ts } = JSON.parse(raw) as { data: Record<string, number>; ts: number }
        if (Date.now() - ts < STARS_CACHE_TTL) return data
      }
    } catch { /* ignore */ }
    return {}
  })

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STARS_CACHE_KEY)
      if (raw) {
        const { ts } = JSON.parse(raw) as { ts: number }
        if (Date.now() - ts < STARS_CACHE_TTL) return
      }
    } catch { /* ignore */ }

    const fetchStars = async () => {
      const entries = await Promise.all(
        config.projects.map(async (project) => {
          try {
            const res = await fetch(`https://api.github.com/repos/${project.repo}`)
            if (res.ok) {
              const data = await res.json()
              return [project.repo, data.stargazers_count] as const
            }
          } catch { /* ignore */ }
          return null
        })
      )

      const results: Record<string, number> = {}
      for (const entry of entries) {
        if (entry) results[entry[0]] = entry[1]
      }

      if (Object.keys(results).length > 0) {
        setStars(results)
        try {
          localStorage.setItem(STARS_CACHE_KEY, JSON.stringify({ data: results, ts: Date.now() }))
        } catch { /* ignore */ }
      }
    }

    fetchStars()
  }, [])

  return stars
}

function useTapOutside() {
  const [tapped, setTapped] = useState(false)
  const ref = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    if (!tapped) return
    const handler = (e: MouseEvent | TouchEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setTapped(false)
      }
    }
    document.addEventListener('mousedown', handler)
    document.addEventListener('touchstart', handler, { passive: true })
    return () => {
      document.removeEventListener('mousedown', handler)
      document.removeEventListener('touchstart', handler)
    }
  }, [tapped])

  return { tapped, toggle: () => setTapped(prev => !prev), ref }
}

function adjustTooltip(el: HTMLSpanElement) {
  const pad = 8
  el.style.left = '50%'
  const rect = el.getBoundingClientRect()
  if (rect.left < pad) {
    el.style.left = `calc(50% + ${pad - rect.left}px)`
  } else if (rect.right > window.innerWidth - pad) {
    el.style.left = `calc(50% - ${rect.right - window.innerWidth + pad}px)`
  }
}

function useTooltipAlign(visible: boolean) {
  const tooltipRef = useRef<HTMLSpanElement>(null)
  const parentRef = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const el = tooltipRef.current
    if (!el || !visible) {
      if (el) el.style.left = ''
      return
    }
    adjustTooltip(el)
  }, [visible])

  useEffect(() => {
    const parent = parentRef.current
    const tooltip = tooltipRef.current
    if (!parent || !tooltip) return
    const onEnter = () => adjustTooltip(tooltip)
    const onLeave = () => { tooltip.style.left = '' }
    parent.addEventListener('mouseenter', onEnter)
    parent.addEventListener('mouseleave', onLeave)
    return () => {
      parent.removeEventListener('mouseenter', onEnter)
      parent.removeEventListener('mouseleave', onLeave)
    }
  }, [])

  return { tooltipRef, parentRef }
}

function BioTag({ item, lang }: { item: { icon: string; text: BiText; hover?: BiText; dynamic?: string }; lang: Lang }) {
  const { tapped, toggle, ref } = useTapOutside()
  const { tooltipRef, parentRef } = useTooltipAlign(tapped)
  const text = renderBioText(item, lang)

  const setRefs = (el: HTMLSpanElement | null) => {
    (ref as React.MutableRefObject<HTMLSpanElement | null>).current = el;
    (parentRef as React.MutableRefObject<HTMLSpanElement | null>).current = el
  }

  return (
    <span
      ref={setRefs}
      className={`bio-tag ${item.hover ? 'bio-tag-has-tooltip' : ''} ${tapped ? 'bio-tag-tapped' : ''}`}
      onClick={() => item.hover && toggle()}
    >
      <span className="bio-tag-icon">{item.icon}</span>
      {text}
      {item.hover && (
        <span ref={tooltipRef} className="bio-tooltip">{t(item.hover, lang)}</span>
      )}
    </span>
  )
}

function DomainMore({ lang }: { lang: Lang }) {
  const { tapped, toggle, ref } = useTapOutside()
  const { tooltipRef, parentRef } = useTooltipAlign(tapped)

  const setRefs = (el: HTMLSpanElement | null) => {
    (ref as React.MutableRefObject<HTMLSpanElement | null>).current = el;
    (parentRef as React.MutableRefObject<HTMLSpanElement | null>).current = el
  }

  return (
    <span
      ref={setRefs}
      className={`domain-card domain-card-more ${tapped ? 'bio-tag-tapped' : ''}`}
      onClick={toggle}
    >
      <span className="domain-text">
        <span className="domain-name domain-more-dots">...</span>
      </span>
      <span ref={tooltipRef} className="bio-tooltip">{t(config.domainMore, lang)}</span>
    </span>
  )
}

function LangSwitch({ lang, setLang }: { lang: Lang; setLang: (l: Lang) => void }) {
  return (
    <button
      className="lang-switch"
      onClick={() => setLang(lang === 'zh' ? 'en' : 'zh')}
      aria-label="Switch language"
    >
      {lang === 'zh' ? 'EN' : '中'}
    </button>
  )
}

function App() {
  const stars = useGitHubStars()
  const [lang, setLang] = useLang()

  return (
    <div className="page">
      <LangSwitch lang={lang} setLang={setLang} />
      <div className="container">
        <section className="hero">
          <img
            src={config.avatar}
            alt={`${config.name} (${config.nameEn}) - Web3 Builder`}
            width={120}
            height={120}
            className="avatar"
          />
          <h1 className="name">
            {config.name}<span className="name-en">{config.nameEn}</span>
          </h1>
          <p className="tagline">
            {renderTagline(t(config.tagline, lang))}
          </p>
          
          <div className="bio-tags">
            {config.bio.map((item, i) => (
              <BioTag key={i} item={item} lang={lang} />
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
                className="social-link social-link-blog"
                aria-label="Blog"
              >
                <BlogIcon />
                <span className="social-link-text">{t(config.blogLabel, lang)}</span>
              </a>
            )}
          </div>
        </section>

        {config.projects.length > 0 && (
          <section className="section">
            <div className="section-header">
              <h2 className="section-title">{t(config.sections.projects, lang)}</h2>
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
                    <div className="project-name">{t(project.name, lang)}</div>
                    <div className="project-desc">{t(project.desc, lang)}</div>
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
              <h2 className="section-title">{t(config.sections.domains, lang)}</h2>
              <div className="section-line" />
            </div>
            
            <div className="domains-grid">
              {domains.map((encoded) => {
                const { domain, name, tld } = parseDomain(encoded)
                return (
                  <a
                    key={encoded}
                    href={`http://${domain}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="domain-card"
                    aria-label={`Visit ${domain}`}
                  >
                    <span className="domain-text">
                      <span className="domain-name">{name}</span>
                      <span className="domain-tld">{tld}</span>
                    </span>
                  </a>
                )
              })}
              <DomainMore lang={lang} />
            </div>
          </section>
        )}
      </div>

      <footer className="footer">
        <p className="footer-text">
          {renderFooter(t(config.footer, lang))}
        </p>
      </footer>
    </div>
  )
}

export default App
