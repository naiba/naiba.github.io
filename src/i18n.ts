import { useState, useEffect, useCallback } from 'react'

export type Lang = 'zh' | 'en'

function detectLang(): Lang {
  const langs = [...(navigator.languages || []), navigator.language || '']
  return langs.some((l) => l.startsWith('zh')) ? 'zh' : 'en'
}

let currentLang: Lang = detectLang()
document.documentElement.lang = currentLang
const listeners = new Set<() => void>()

export function getLang(): Lang {
  return currentLang
}

export function setLang(lang: Lang) {
  currentLang = lang
  document.documentElement.lang = lang
  listeners.forEach((fn) => fn())
}

export function useLang(): [Lang, (lang: Lang) => void] {
  const [lang, _setLang] = useState(currentLang)

  useEffect(() => {
    const handler = () => _setLang(currentLang)
    listeners.add(handler)
    return () => { listeners.delete(handler) }
  }, [])

  const toggle = useCallback((l: Lang) => setLang(l), [])
  return [lang, toggle]
}

export type BiText = { zh: string; en: string }

export function t(text: BiText, lang: Lang): string {
  return text[lang]
}
