/// <reference types="vite/client" />

declare module 'virtual:domains' {
  export const domains: string[]
}

declare module 'virtual:site-config' {
  interface BiText {
    zh: string
    en: string
  }

  interface BioItem {
    icon: string
    text: BiText
    hover?: BiText
    dynamic?: string
  }

  interface Project {
    name: BiText
    repo: string
    desc: BiText
    icon: string
  }

  interface SiteConfig {
    name: string
    nameEn: string
    siteUrl: string
    avatar: string
    description: string
    keywords: string
    jobTitle: string
    knowsAbout: string[]
    themeColor: string
    social: {
      github: string
      twitter: string
      blog: string
    }
    twitterHandle: string
    bio: BioItem[]
    startDates: Record<string, string>
    projects: Project[]
    tagline: BiText
    footer: BiText
    sections: Record<string, BiText>
    blogLabel: BiText
    domainMore: BiText
  }

  export const siteConfig: SiteConfig
}
