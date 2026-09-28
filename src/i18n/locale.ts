export const LOCALES = ['en', 'es'] as const

export type Locale = (typeof LOCALES)[number]

/** A value that has one variant per supported locale. */
export type Localized<T = string> = Record<Locale, T>

export const DEFAULT_LOCALE: Locale = 'en'

export function isLocale(value: unknown): value is Locale {
  return typeof value === 'string' && (LOCALES as readonly string[]).includes(value)
}

/** Picks the visitor's preferred locale from the browser, falling back to English. */
export function detectLocale(languages: readonly string[] = navigator.languages): Locale {
  for (const tag of languages) {
    const base = tag.toLowerCase().split('-')[0]
    if (isLocale(base)) return base
  }
  return DEFAULT_LOCALE
}
