import { createContext, useContext } from 'react'
import { DEFAULT_LOCALE, type Locale, type Localized } from './locale'

export const LocaleContext = createContext<Locale>(DEFAULT_LOCALE)

export function useLocale(): Locale {
  return useContext(LocaleContext)
}

/** Returns a picker for localized values in the current locale. */
export function useLocalized() {
  const locale = useLocale()
  return <T,>(value: Localized<T>): T => value[locale]
}
