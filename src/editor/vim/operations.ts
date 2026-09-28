import { ui } from '@/i18n/messages'
import { byteSize, findLink } from '../model/buffer'
import type { Buffer, FormField, Line } from '../model/types'
import { findMatch } from './search'
import { EMPTY_CURSOR, type Cursor, type EditorState, type Message } from './state'

// Small, composable state transitions shared by keys and ex commands.

export function activeBuffer(state: EditorState): Buffer | undefined {
  return state.buffers[state.active]
}

export function activeLines(state: EditorState): Line[] {
  return activeBuffer(state)?.lines ?? []
}

export function cursorOf(state: EditorState, id = state.active): Cursor {
  return state.cursors[id] ?? EMPTY_CURSOR
}

export function setCursor(state: EditorState, cursor: Cursor): EditorState {
  return { ...state, cursors: { ...state.cursors, [state.active]: cursor } }
}

export function info(key: Message['key'], params?: Message['params']): Message {
  return { key, params, level: 'info' }
}

export function error(key: Message['key'], params?: Message['params']): Message {
  return { key, params, level: 'error' }
}

export function withMessage(state: EditorState, message: Message | null): EditorState {
  return { ...state, message }
}

/** Case-insensitive lookup by id, file name, or prefix of either (`:e exp` → experience.md). */
export function resolveBuffer(state: EditorState, query: string): string | undefined {
  const needle = query.replace(/^(~\/|\.\/)/, '').toLowerCase()
  if (!needle) return undefined
  const ids = state.order
  const nameOf = (id: string) => state.buffers[id]?.name.toLowerCase() ?? ''
  return (
    ids.find((id) => id === needle || nameOf(id) === needle) ??
    ids.find((id) => nameOf(id).startsWith(needle) || id.startsWith(needle))
  )
}

export function openBuffer(state: EditorState, id: string): EditorState {
  const buffer = state.buffers[id]
  if (!buffer) return withMessage(state, error('noMatchingBuffer', [id]))

  return {
    ...state,
    tabs: state.tabs.includes(id) ? state.tabs : [...state.tabs, id],
    active: id,
    pane: 'editor',
    mode: 'normal',
    treeCursor: Math.max(0, state.order.indexOf(id)),
    form: { ...state.form, field: null },
    message: info('fileInfo', [buffer.name, buffer.lines.length, byteSize(buffer)]),
  }
}

export function closeTab(state: EditorState, id = state.active): EditorState {
  const index = state.tabs.indexOf(id)
  if (index === -1) return state
  if (state.tabs.length === 1) return withMessage(state, error('cannotQuit'))

  const tabs = state.tabs.filter((tab) => tab !== id)
  if (id !== state.active) return { ...state, tabs }

  // Like :tabclose, focus the tab that takes the closed one's place.
  const next = tabs[Math.min(index, tabs.length - 1)] ?? tabs[0] ?? ''
  return { ...openBuffer({ ...state, tabs }, next) }
}

/** Moves `delta` tabs, wrapping around (gt / gT). */
export function cycleTab(state: EditorState, delta: number): EditorState {
  const count = state.tabs.length
  if (count === 0) return state
  const index = state.tabs.indexOf(state.active)
  const next = state.tabs[(((index + delta) % count) + count) % count]
  return next ? openBuffer(state, next) : state
}

/** `{n}gt`: go to tab number n (1-based). */
export function gotoTab(state: EditorState, number: number): EditorState {
  const id = state.tabs[number - 1]
  return id ? openBuffer(state, id) : state
}

export function toggleTree(state: EditorState, open = !state.treeOpen): EditorState {
  return {
    ...state,
    treeOpen: open,
    pane: open ? 'tree' : 'editor',
    treeCursor: Math.max(0, state.order.indexOf(state.active)),
  }
}

export function focusPane(state: EditorState, pane: EditorState['pane']): EditorState {
  if (pane === 'tree') return state.treeOpen ? { ...state, pane } : toggleTree(state, true)
  return { ...state, pane }
}

/** Follows a link target: another buffer, an editor action, or an external URL. */
export function follow(state: EditorState, href: string): EditorState {
  if (href.startsWith('buffer:')) {
    const id = resolveBuffer(state, href.slice('buffer:'.length))
    return id ? openBuffer(state, id) : withMessage(state, error('noMatchingBuffer', [href]))
  }
  if (href === 'action:submit') return submitForm(state)

  return {
    ...state,
    effects: [...state.effects, { type: 'openUrl', href }],
    message: info('opening', [href.replace(/^mailto:/, '')]),
  }
}

export function followLinkUnderCursor(state: EditorState): EditorState | null {
  const cursor = cursorOf(state)
  const line = activeLines(state)[cursor.row]
  const href = line && findLink(line, cursor.col)
  return href ? follow(state, href) : null
}

export function search(state: EditorState, term: string, direction: 1 | -1): EditorState {
  if (!term) return withMessage(state, error('noPreviousPattern'))
  const result = findMatch(activeLines(state), cursorOf(state), term, direction)
  const next = { ...state, search: { term, highlight: true } }
  if (!result) return withMessage(next, error('patternNotFound', [term]))

  const message = result.wrapped
    ? error(direction === 1 ? 'searchWrapBottom' : 'searchWrapTop')
    : null
  return withMessage(setCursor(next, result.cursor), message)
}

// --- contact form ----------------------------------------------------------

const FIELDS: FormField[] = ['name', 'email', 'message']
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function enterInsert(state: EditorState, field?: FormField): EditorState {
  const lines = activeLines(state)
  const current = lines[cursorOf(state).row]?.field
  const target: FormField = field ?? current ?? 'name'
  const row = lines.findIndex((line) => line.field === target)
  if (row === -1) return withMessage(state, error('notModifiable'))

  return {
    ...setCursor(state, { row, col: 0, want: 0 }),
    mode: 'insert',
    pane: 'editor',
    pending: '',
    count: '',
    form: { ...state.form, field: target },
    message: null,
  }
}

export function submitForm(state: EditorState): EditorState {
  const { values } = state.form
  if (state.form.status === 'sending') return state

  const missing = FIELDS.find((field) => !values[field].trim())
  if (missing) {
    return withMessage(state, error('formRequired', [ui.fieldLabels[missing]]))
  }
  if (!EMAIL.test(values.email.trim())) return withMessage(state, error('formInvalidEmail'))

  return {
    ...state,
    mode: 'normal',
    form: { ...state.form, field: null, status: 'sending' },
    effects: [...state.effects, { type: 'submitContact', values }],
    message: info('formSending'),
  }
}
