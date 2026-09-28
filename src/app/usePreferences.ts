import { useCallback, useEffect, useState } from 'react'
import { detectLocale, isLocale, type Locale } from '@/i18n/locale'
import type { Background, Options } from '@/editor/vim/state'
import { storage } from '@/lib/storage'

const LOCALE_KEY = 'portfolio:locale'
const BACKGROUND_KEY = 'portfolio:background'

function initialLocale(): Locale {
  const stored = storage.get(LOCALE_KEY)
  return isLocale(stored) ? stored : detectLocale()
}

function initialBackground(): Background {
  const stored = storage.get(BACKGROUND_KEY)
  // Dark is the default on purpose: it's a terminal. Light is one click (◐) away.
  return stored === 'light' ? 'light' : 'dark'
}

/** Visitor preferences (language and theme), remembered across visits. */
export function usePreferences() {
  const [locale, setLocaleState] = useState(initialLocale)
  const [background, setBackground] = useState(initialBackground)

  useEffect(() => {
    document.documentElement.lang = locale
  }, [locale])

  useEffect(() => {
    document.documentElement.dataset.theme = background
  }, [background])

  const setLocale = useCallback((next: Locale) => {
    storage.set(LOCALE_KEY, next)
    setLocaleState(next)
  }, [])

  const onOptionsChange = useCallback((options: Options) => {
    storage.set(BACKGROUND_KEY, options.background)
    setBackground(options.background)
  }, [])

  return { locale, setLocale, background, onOptionsChange }
}
