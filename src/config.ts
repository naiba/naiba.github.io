import type { BiText } from './i18n'

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

export const config = {
  name: '奶爸',
  nameEn: 'naiba',
  avatar: 'https://lifelonglearn.ing/logo.png',
  tagline: {
    zh: '一个高级 <highlight>meatbag.co</highlight>',
    en: 'A senior <highlight>meatbag.co</highlight>',
  } as BiText,

  bio: [
    { icon: '⛓️', text: { zh: 'Web3 Builder', en: 'Web3 Builder' } },
    { icon: '🤖', text: { zh: 'Vibe Coding', en: 'Vibe Coding' }, hover: { zh: '每日高强度 Vibeeeeee', en: 'Daily intense Vibeeeeee' } },
    { icon: '🧑‍💻', text: { zh: '工作第', en: 'Year ' }, hover: { zh: '仍然心潮澎湃不感厌倦', en: 'Still passionate, never bored' }, dynamic: 'working' },
    { icon: '🏠', text: { zh: '居家办公', en: 'Work from Home' } },
    { icon: '🌐', text: { zh: '域名玩家', en: 'Domainer' }, hover: { zh: '基本上每年都会收米煮米', en: 'Buying & selling domains every year' } },
  ] as BioItem[],

  startDates: {
    working: '2016-08-01',
  },

  social: {
    github: 'https://github.com/naiba',
    twitter: 'https://x.com/0xnaiba',
    blog: 'https://lifelonglearn.ing',
  },

  projects: [
    {
      name: { zh: '哪吒监控', en: 'Nezha Monitoring' },
      repo: 'nezhahq/nezha',
      desc: { zh: '轻量级服务器监控与运维工具', en: 'Lightweight server monitoring & ops tool' },
      icon: '🗼',
    },
    {
      name: { zh: 'Solitudes', en: 'Solitudes' },
      repo: 'naiba/solitudes',
      desc: { zh: '支持专栏、全文搜索的博客引擎', en: 'Blog engine with columns & full-text search' },
      icon: '📝',
    },
    {
      name: { zh: 'nbdns', en: 'nbdns' },
      repo: 'naiba/nbdns',
      desc: { zh: '智能 DNS 中继器', en: 'Smart DNS relay' },
      icon: '🦭',
    },
    {
      name: { zh: 'nb', en: 'nb' },
      repo: 'naiba/nb',
      desc: { zh: '增强版 git/ssh/scp 命令行工具', en: 'Enhanced git/ssh/scp CLI tool' },
      icon: '🔪',
    },
  ] as Project[],

  domains: [] as string[],

  footer: {
    zh: 'Keep building <heart />',
    en: 'Keep building <heart />',
  } as BiText,

  sections: {
    projects: { zh: '🚀 开源项目', en: '🚀 Open Source' },
    domains: { zh: '🌐 域名收藏', en: '🌐 Domain Collection' },
  } as Record<string, BiText>,

  blogLabel: { zh: '奶爸博客', en: 'Blog' } as BiText,
  domainMore: { zh: '还有一些在停放', en: 'Some are parked' } as BiText,
}
