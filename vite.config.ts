import { defineConfig, type Plugin } from 'vite'
import { writeFileSync } from 'node:fs'
import { resolve } from 'node:path'
import react from '@vitejs/plugin-react'

const siteConfig = {
  name: '奶爸',
  nameEn: 'naiba',
  siteUrl: 'https://nai.ba',
  avatar: 'https://lifelonglearn.ing/logo.png',
  ogImage: 'https://nai.ba/avatar.jpg',
  description: 'naiba (奶爸) - Web3 Builder & Open Source Developer. Creator of Nezha Monitoring. Domainer, remote worker, building things on the internet.',
  keywords: 'naiba, 奶爸, Web3, open source, Nezha Monitoring, 哪吒监控, developer, domainer',
  jobTitle: 'Web3 Builder',
  knowsAbout: ['Web3', 'Open Source', 'Server Monitoring', 'Domain Names', 'Go', 'TypeScript'],
  themeColor: '#0ea5e9',
  social: {
    github: 'https://github.com/naiba',
    twitter: 'https://x.com/0xnaiba',
    blog: 'https://lifelonglearn.ing',
  },
  twitterHandle: '@0xnaiba',
  bio: [
    { icon: '⛓️', text: { zh: 'Web3 Builder', en: 'Web3 Builder' } },
    { icon: '🤖', text: { zh: 'Vibe Coding', en: 'Vibe Coding' }, hover: { zh: '每日高强度 Vibeeeee', en: 'Daily intense Vibeeeee' } },
    { icon: '🧑‍💻', text: { zh: '工作第', en: 'Year ' }, hover: { zh: '仍然心潮澎湃不感厌倦', en: 'Still passionate, never bored' }, dynamic: 'working' },
    { icon: '🏠', text: { zh: '居家办公', en: 'Work from Home' } },
    { icon: '🌐', text: { zh: '域名玩家', en: 'Domainer' }, hover: { zh: '基本上每年都会收米煮米', en: 'Buying & selling domains every year' } },
  ],
  startDates: {
    working: '2016-08-01',
  },
  projects: [
    {
      name: { zh: 'Bonds', en: 'Bonds' },
      repo: 'naiba/bonds',
      desc: { zh: '现代化个人关系管理工具', en: 'Modern personal relationship manager' },
      icon: '💛',
      language: 'Go',
    },
    {
      name: { zh: 'nb', en: 'nb' },
      repo: 'naiba/nb',
      desc: { zh: '增强版 git/ssh/scp 命令行工具', en: 'Enhanced git/ssh/scp CLI commands' },
      icon: '🔪',
      language: 'Go',
    },
    {
      name: { zh: 'nbdns', en: 'nbdns' },
      repo: 'naiba/nbdns',
      desc: { zh: '智能 DNS 中继器，内置 Web 面板与 DoH 支持', en: 'Smart DNS relay with web dashboard & DoH support' },
      icon: '🦭',
      language: 'Go',
      license: 'https://opensource.org/licenses/MIT',
    },
    {
      name: { zh: '哪吒监控', en: 'Nezha Monitoring' },
      repo: 'nezhahq/nezha',
      desc: { zh: '轻量级服务器监控与运维工具', en: 'Lightweight server monitoring & ops tool' },
      icon: '🗼',
      language: 'Go',
      license: 'https://opensource.org/licenses/Apache-2.0',
    },
    {
      name: { zh: 'Proxy in a Box', en: 'Proxy in a Box' },
      repo: 'naiba/proxy-in-a-box',
      desc: { zh: '自动代理池，抓取、验证、轮转一体化', en: 'Auto proxy pool — crawl, validate & rotate in one' },
      icon: '📦',
      language: 'Go',
    },
    {
      name: { zh: 'Solitudes', en: 'Solitudes' },
      repo: 'naiba/solitudes',
      desc: { zh: '支持专栏、全文搜索的博客引擎', en: 'Blog engine with columns & full-text search' },
      icon: '📝',
      language: 'Go',
    },
  ],
  tagline: {
    zh: '<highlight>letshithappen.com</highlight>',
    en: '<highlight>letshithappen.com</highlight>',
  },
  footer: {
    zh: 'Keep building <heart />',
    en: 'Keep building <heart />',
  },
  sections: {
    projects: { zh: '🚀 开源项目', en: '🚀 Open Source' },
    domains: { zh: '🌐 域名收藏', en: '🌐 Domain Collection' },
  },
  blogLabel: { zh: '奶爸博客', en: 'Blog' },
  domainMore: { zh: '还有一些在停放', en: 'Some are parked' },
}

const domains = [
  '5.nu',
  'rekt.im',
  'uselessclass.net',
  'lajilao.com',
  'letshithappen.com',
  'magua.net',
  'makeshithappen.xyz',
  'meatbag.co',
  'nai.ba',
  'notthegoodguy.com',
  'oh1.com',
  'pppppppppp.com',
  'qio.ng',
  'qundao.com',
  'retiredbyai.com',
  'musclememo.net',
  'yii.com',
]

function siteConfigPlugin(): Plugin {
  const virtualModuleId = 'virtual:site-config'
  const resolvedVirtualModuleId = '\0' + virtualModuleId

  return {
    name: 'site-config',
    resolveId(id) {
      if (id === virtualModuleId) return resolvedVirtualModuleId
    },
    load(id) {
      if (id === resolvedVirtualModuleId) {
        return `export const siteConfig = ${JSON.stringify(siteConfig)};`
      }
    },
  }
}

function encodeDomainsPlugin(): Plugin {
  const virtualModuleId = 'virtual:domains'
  const resolvedVirtualModuleId = '\0' + virtualModuleId

  return {
    name: 'encode-domains',
    resolveId(id) {
      if (id === virtualModuleId) return resolvedVirtualModuleId
    },
    load(id) {
      if (id === resolvedVirtualModuleId) {
        const encoded = domains.map(d => Buffer.from(d).toString('base64'))
        return `export const domains = ${JSON.stringify(encoded)};`
      }
    },
  }
}

function htmlMetaPlugin(): Plugin {
  const c = siteConfig
  const title = `${c.nameEn} - ${c.jobTitle} & Open Source Developer`
  const sameAs = [c.social.github, c.social.twitter, c.social.blog].filter(Boolean)

  const softwareEntities = c.projects.map(p => {
    const entity: Record<string, unknown> = {
      '@type': 'SoftwareSourceCode',
      '@id': `${c.siteUrl}/#software-${p.repo.replace('/', '-')}`,
      name: p.name.en,
      description: p.desc.en,
      codeRepository: `https://github.com/${p.repo}`,
      author: { '@id': `${c.siteUrl}/#person` },
      programmingLanguage: p.language,
    }
    if (p.license) {
      entity.license = p.license
    }
    return entity
  })

  const jsonLd = JSON.stringify({
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebSite',
        '@id': `${c.siteUrl}/#website`,
        url: `${c.siteUrl}/`,
        name: c.nameEn,
        description: `${c.jobTitle} & Open Source Developer`,
        inLanguage: ['zh-CN', 'en-US'],
        publisher: { '@id': `${c.siteUrl}/#person` },
      },
      {
        '@type': 'WebPage',
        '@id': `${c.siteUrl}/#webpage`,
        url: `${c.siteUrl}/`,
        name: title,
        description: c.description,
        isPartOf: { '@id': `${c.siteUrl}/#website` },
        about: { '@id': `${c.siteUrl}/#person` },
        primaryImageOfPage: { '@type': 'ImageObject', url: c.ogImage, width: 1500, height: 1500 },
        inLanguage: ['zh-CN', 'en-US'],
      },
      {
        '@type': 'Person',
        '@id': `${c.siteUrl}/#person`,
        name: c.nameEn,
        alternateName: c.name,
        description: c.description,
        url: `${c.siteUrl}/`,
        image: c.ogImage,
        jobTitle: c.jobTitle,
        knowsAbout: c.knowsAbout,
        mainEntityOfPage: { '@id': `${c.siteUrl}/#webpage` },
        sameAs,
      },
      {
        '@type': 'ProfilePage',
        '@id': `${c.siteUrl}/#profilepage`,
        url: `${c.siteUrl}/`,
        name: title,
        mainEntity: { '@id': `${c.siteUrl}/#person` },
        isPartOf: { '@id': `${c.siteUrl}/#website` },
        dateCreated: '2025-01-01',
        dateModified: new Date().toISOString().split('T')[0],
      },
      {
        '@type': 'BreadcrumbList',
        '@id': `${c.siteUrl}/#breadcrumb`,
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'Home',
            item: `${c.siteUrl}/`,
          },
        ],
      },
      ...softwareEntities,
    ],
  }, null, 2)

  const noscriptBio = c.bio
    .filter(b => !b.dynamic)
    .map(b => `          <li>${b.icon} ${b.text.en}</li>`)
    .join('\n')

  const noscriptProjects = c.projects
    .map(p => `          <li><a href="https://github.com/${p.repo}">${p.name.en}</a> - ${p.desc.en}</li>`)
    .join('\n')

  const noscriptSocial = [
    c.social.github ? `<a href="${c.social.github}">GitHub</a>` : '',
    c.social.twitter ? `<a href="${c.social.twitter}">Twitter</a>` : '',
    c.social.blog ? `<a href="${c.social.blog}">Blog</a>` : '',
  ].filter(Boolean).join(' |\n          ')

  return {
    name: 'html-meta',
    transformIndexHtml(html) {
      const replacements: Record<string, string> = {
        '__SITE_TITLE__': title,
        '__SITE_DESCRIPTION__': c.description,
        '__SITE_KEYWORDS__': c.keywords,
        '__SITE_URL__': c.siteUrl,
        '__SITE_NAME__': c.nameEn,
        '__SITE_AUTHOR__': c.nameEn,
        '__SITE_AVATAR__': c.avatar,
        '__SITE_OG_IMAGE__': c.ogImage,
        '__SITE_THEME_COLOR__': c.themeColor,
        '__TWITTER_HANDLE__': c.twitterHandle,
        '__JSON_LD__': jsonLd,
        '__NOSCRIPT_BIO__': noscriptBio,
        '__NOSCRIPT_PROJECTS__': noscriptProjects,
        '__NOSCRIPT_SOCIAL__': noscriptSocial,
        '__NOSCRIPT_NAME__': c.name,
        '__NOSCRIPT_NAME_EN__': c.nameEn,
        '__NOSCRIPT_JOB__': `${c.jobTitle} &amp; Open Source Developer`,
        '__NOSCRIPT_ALT__': `${c.nameEn} - ${c.jobTitle}`,
        '__HTML_LANG__': 'en',
      }

      let result = html
      for (const [placeholder, value] of Object.entries(replacements)) {
        result = result.replaceAll(placeholder, value)
      }
      return result
    },
  }
}

function sitemapPlugin(): Plugin {
  return {
    name: 'generate-sitemap',
    closeBundle() {
      const today = new Date().toISOString().split('T')[0]
      const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${siteConfig.siteUrl}/</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>1.0</priority>
  </url>
</urlset>
`
      writeFileSync(resolve(import.meta.dirname, 'dist/sitemap.xml'), sitemap)
    },
  }
}

export default defineConfig({
  plugins: [siteConfigPlugin(), encodeDomainsPlugin(), htmlMetaPlugin(), sitemapPlugin(), react()],
  base: '/',
  server: {
    allowedHosts: true,
  },
})
