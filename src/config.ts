export const config = {
  name: '奶爸',
  nameEn: 'naiba',
  avatar: 'https://avatars.githubusercontent.com/u/29243953',
  tagline: '一个高级 <highlight>meatbag</highlight>',
  
  bio: [
    { icon: '⛓️', text: 'Web3 Builder' },
    { icon: '🎵', text: '每日高强度 Vibe Coding' },
    { icon: '🐂', text: '天生牛马圣体', hover: '干啥工作都能干好' },
    { icon: '🏠', text: '远程工作' },
    { icon: '🌐', text: '域名收藏' },
  ],

  startDates: {
    coding: '2011-01-01',
    working: '2016-08-01',
  },

  social: {
    github: 'https://github.com/naiba',
    twitter: 'https://x.com/0xnaiba',
    blog: 'https://lifelonglearn.ing',
  },

  projects: [
    {
      name: '哪吒监控',
      repo: 'nezhahq/nezha',
      desc: '轻量级服务器监控与运维工具',
      icon: '🗼',
    },
    {
      name: 'Solitudes',
      repo: 'naiba/solitudes',
      desc: '支持专栏、全文搜索的博客引擎',
      icon: '📝',
    },
    {
      name: 'nbdns',
      repo: 'naiba/nbdns',
      desc: '智能 DNS 中继器',
      icon: '🦭',
    },
    {
      name: 'nb',
      repo: 'naiba/nb',
      desc: '增强版 git/ssh/scp 命令行工具',
      icon: '🔪',
    },
  ],

  domains: [] as string[],

  footer: 'Keep building <heart />',
}
