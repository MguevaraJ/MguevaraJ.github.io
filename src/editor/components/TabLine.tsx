import { useEffect, useRef, type Dispatch } from 'react'
import { useLocale, useLocalized } from '@/i18n/LocaleContext'
import type { Locale } from '@/i18n/locale'
import { ui } from '@/i18n/messages'
import { hrefForBuffer } from '../hooks/useHashRoute'
import type { Action } from '../vim/reducer'
import type { Background, EditorState } from '../vim/state'
import styles from './TabLine.module.css'

interface TabLineProps {
  state: Pick<EditorState, 'tabs' | 'active' | 'buffers' | 'treeOpen'>
  background: Background
  dispatch: Dispatch<Action>
  onLocaleChange: (locale: Locale) => void
}

/** Vim's tabline: one tab per section, plus a few mouse-friendly toggles. */
export function TabLine({ state, background, dispatch, onLocaleChange }: TabLineProps) {
  const locale = useLocale()
  const t = useLocalized()
  const tabsRef = useRef<HTMLElement>(null)

  // Keep the active tab visible when the tabline overflows (phones).
  useEffect(() => {
    tabsRef.current
      ?.querySelector('[aria-current="page"]')
      ?.scrollIntoView({ block: 'nearest', inline: 'nearest' })
  }, [state.active])

  return (
    <header className={styles.tabline}>
      <nav ref={tabsRef} className={styles.tabs} aria-label="Tabs">
        {state.tabs.map((id, index) => {
          const buffer = state.buffers[id]
          if (!buffer) return null
          const active = id === state.active
          return (
            <span key={id} className={styles.tab} data-active={active || undefined}>
              <a
                href={hrefForBuffer(id)}
                className={styles.label}
                aria-current={active ? 'page' : undefined}
                onClick={(event) => {
                  event.preventDefault()
                  dispatch({ type: 'buffer/open', id })
                }}
              >
                <span className={styles.index}>{index + 1}</span> {buffer.name}
              </a>
              <button
                type="button"
                className={styles.close}
                aria-label={`${t(ui.closeTab)} ${buffer.name}`}
                onClick={() => dispatch({ type: 'tab/close', id })}
              >
                ×
              </button>
            </span>
          )
        })}
      </nav>
      <div className={styles.actions}>
        <button
          type="button"
          title={t(ui.toggleTree)}
          aria-label={t(ui.toggleTree)}
          aria-pressed={state.treeOpen}
          onClick={() => dispatch({ type: 'tree/toggle' })}
        >
          ☰
        </button>
        <button
          type="button"
          title={t(ui.openCommand)}
          aria-label={t(ui.openCommand)}
          onClick={() => dispatch({ type: 'cmdline/open', prefix: ':' })}
        >
          :
        </button>
        <button
          type="button"
          title=":help"
          onClick={() => dispatch({ type: 'buffer/open', id: 'help' })}
        >
          ?
        </button>
        <button
          type="button"
          title={`:set lang=${locale === 'en' ? 'es' : 'en'}`}
          lang={locale === 'en' ? 'es' : 'en'}
          onClick={() => onLocaleChange(locale === 'en' ? 'es' : 'en')}
        >
          {locale === 'en' ? 'ES' : 'EN'}
        </button>
        <button
          type="button"
          title={`:set background=${background === 'dark' ? 'light' : 'dark'}`}
          aria-label={`:set background=${background === 'dark' ? 'light' : 'dark'}`}
          onClick={() =>
            dispatch({
              type: 'options/set',
              options: { background: background === 'dark' ? 'light' : 'dark' },
            })
          }
        >
          ◐
        </button>
      </div>
    </header>
  )
}
