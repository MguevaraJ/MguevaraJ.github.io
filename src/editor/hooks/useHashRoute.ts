import { useEffect } from 'react'

/** The buffer id in the URL: `#/experience` → `experience`. */
export function readHash(): string | undefined {
  const id = window.location.hash.replace(/^#\/?/, '')
  return id ? decodeURIComponent(id) : undefined
}

export function hrefForBuffer(id: string): string {
  return `#/${id}`
}

/**
 * Keeps the active tab in the URL so sections are linkable and the browser's
 * back/forward buttons switch tabs.
 */
export function useHashRoute(active: string, onNavigate: (id: string) => void) {
  useEffect(() => {
    const current = readHash()
    if (current === active) return
    // The first visit replaces the entry, so "back" leaves the site instead of looping.
    if (current === undefined) window.history.replaceState(null, '', hrefForBuffer(active))
    else window.history.pushState(null, '', hrefForBuffer(active))
  }, [active])

  useEffect(() => {
    const handle = () => {
      const id = readHash()
      if (id) onNavigate(id)
    }
    window.addEventListener('popstate', handle)
    return () => window.removeEventListener('popstate', handle)
  }, [onNavigate])
}
