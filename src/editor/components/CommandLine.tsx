import { useEffect, useRef, type Dispatch, type KeyboardEvent } from 'react'
import { useLocale } from '@/i18n/LocaleContext'
import type { Localized } from '@/i18n/locale'
import { translate } from '@/i18n/messages'
import type { Action } from '../vim/reducer'
import type { EditorState, Message } from '../vim/state'
import styles from './CommandLine.module.css'

interface CommandLineProps {
  state: Pick<EditorState, 'mode' | 'cmdline' | 'message' | 'pending' | 'count'>
  dispatch: Dispatch<Action>
}

function useMessageText(message: Message | null): string {
  const locale = useLocale()
  if (!message) return ''
  const params = (message.params ?? []).map((param) =>
    typeof param === 'object' ? (param as Localized)[locale] : param,
  )
  return translate(message.key, locale, params)
}

/** The bottom line: ex commands and searches are typed here; messages are shown here. */
export function CommandLine({ state, dispatch }: CommandLineProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const typing = state.mode === 'command' || state.mode === 'search'
  const message = useMessageText(state.message)

  useEffect(() => {
    if (typing) inputRef.current?.focus()
  }, [typing])

  function handleKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    switch (event.key) {
      case 'Enter':
        event.preventDefault()
        dispatch({ type: 'cmdline/submit' })
        break
      case 'Escape':
        event.preventDefault()
        dispatch({ type: 'cmdline/cancel' })
        break
      case 'Tab':
        event.preventDefault()
        dispatch({ type: 'cmdline/complete' })
        break
      case 'Backspace':
        if (!state.cmdline) {
          event.preventDefault()
          dispatch({ type: 'cmdline/cancel' })
        }
        break
    }
  }

  return (
    <div className={styles.cmdline}>
      {typing ? (
        <label className={styles.prompt}>
          <span aria-hidden>{state.mode === 'command' ? ':' : '/'}</span>
          <span className="visually-hidden">{state.mode === 'command' ? 'Command' : 'Search'}</span>
          <input
            ref={inputRef}
            className={styles.input}
            value={state.cmdline}
            onChange={(event) => dispatch({ type: 'cmdline/change', value: event.target.value })}
            onKeyDown={handleKeyDown}
            onBlur={() => dispatch({ type: 'cmdline/cancel' })}
            autoCapitalize="off"
            autoComplete="off"
            autoCorrect="off"
            spellCheck={false}
            enterKeyHint="go"
          />
        </label>
      ) : (
        <span
          className={styles.message}
          data-level={state.message?.level}
          role="status"
          aria-live="polite"
        >
          {message || (state.mode === 'insert' ? '-- INSERT --' : '')}
        </span>
      )}
      <span className={styles.showcmd} aria-hidden>
        {state.count}
        {state.pending === '<Space>' ? '␣' : state.pending}
      </span>
    </div>
  )
}
