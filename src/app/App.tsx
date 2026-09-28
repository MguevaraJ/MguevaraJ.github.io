import { useCallback, useMemo, useState } from 'react'
import { buildWorkspace } from '@/buffers'
import { profile } from '@/content/profile'
import { Editor } from '@/editor/components/Editor'
import { readHash } from '@/editor/hooks/useHashRoute'
import { LocaleContext } from '@/i18n/LocaleContext'
import { BootSequence } from './BootSequence'
import { Terminal } from './Terminal'
import { usePreferences } from './usePreferences'

/** Skip the boot animation for deep links, repeat visits in the session and reduced motion. */
function shouldBoot(): boolean {
  try {
    if (readHash()) return false
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return false
    return window.sessionStorage.getItem('portfolio:booted') === null
  } catch {
    return true
  }
}

export function App() {
  const { locale, setLocale, background, onOptionsChange } = usePreferences()
  const workspace = useMemo(() => buildWorkspace(locale), [locale])
  const [booting, setBooting] = useState(shouldBoot)
  const [initialOptions] = useState(() => ({ background }))

  const finishBoot = useCallback(() => {
    try {
      window.sessionStorage.setItem('portfolio:booted', '1')
    } catch {
      // Not remembering the boot only means it plays again.
    }
    setBooting(false)
  }, [])

  return (
    <LocaleContext.Provider value={locale}>
      <Terminal title={`moises@portfolio: ~ — nvim · ${profile.name}`}>
        {booting ? (
          <BootSequence workspace={workspace} onDone={finishBoot} />
        ) : (
          <Editor
            workspace={workspace}
            initialOptions={initialOptions}
            onLocaleChange={setLocale}
            onOptionsChange={onOptionsChange}
          />
        )}
      </Terminal>
    </LocaleContext.Provider>
  )
}
