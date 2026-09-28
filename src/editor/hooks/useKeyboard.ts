import { useEffect } from 'react'
import type { Mode } from '../vim/state'

const NAMED: Record<string, string> = {
  Escape: '<Esc>',
  Enter: '<CR>',
  Backspace: '<BS>',
  ArrowDown: '<Down>',
  ArrowUp: '<Up>',
  ArrowLeft: '<Left>',
  ArrowRight: '<Right>',
  PageDown: '<PageDown>',
  PageUp: '<PageUp>',
  Home: '<Home>',
  End: '<End>',
  ' ': '<Space>',
}

/**
 * Ctrl chords the editor takes over. Deliberately small: CTRL-F (find),
 * CTRL-L (address bar), CTRL-R (reload)… stay with the browser.
 */
const CTRL_KEYS = new Set(['d', 'u'])

/** Converts a KeyboardEvent to Vim notation, or null if the editor should ignore it. */
export function normalizeKey(
  event: Pick<KeyboardEvent, 'key' | 'ctrlKey' | 'metaKey' | 'altKey'>,
): string | null {
  if (event.metaKey || event.altKey) return null
  if (event.ctrlKey) {
    const key = event.key.toLowerCase()
    return CTRL_KEYS.has(key) ? `<C-${key}>` : null
  }
  if (event.key in NAMED) return NAMED[event.key] ?? null
  return event.key.length === 1 ? event.key : null
}

function isTextInput(target: EventTarget | null): boolean {
  return (
    target instanceof HTMLElement &&
    (target.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(target.tagName))
  )
}

/**
 * Global key listener. In normal mode keys drive the editor; in insert and
 * command modes the focused input owns the keyboard (except <Esc>).
 */
export function useKeyboard(mode: Mode, onKey: (key: string) => void, enabled = true) {
  useEffect(() => {
    if (!enabled) return

    function handle(event: KeyboardEvent) {
      const key = normalizeKey(event)
      if (!key) return

      if (mode === 'insert') {
        if (key === '<Esc>') {
          event.preventDefault()
          ;(document.activeElement as HTMLElement | null)?.blur()
          onKey(key)
        }
        return
      }
      if (mode === 'command' || mode === 'search') return
      if (isTextInput(event.target)) return
      // Let Tab / Shift+Tab keep moving focus for keyboard and screen-reader users.
      if (event.key === 'Tab') return
      // Enter on a focused link or button keeps its native behaviour.
      if (
        key === '<CR>' &&
        event.target instanceof HTMLElement &&
        event.target.closest('a, button')
      )
        return

      event.preventDefault()
      onKey(key)
    }

    window.addEventListener('keydown', handle)
    return () => window.removeEventListener('keydown', handle)
  }, [mode, onKey, enabled])
}
