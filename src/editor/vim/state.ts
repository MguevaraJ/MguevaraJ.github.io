import type { Workspace } from '@/buffers'
import type { Locale, Localized } from '@/i18n/locale'
import type { MessageKey } from '@/i18n/messages'
import type { FormField } from '../model/types'

export type Mode = 'normal' | 'insert' | 'command' | 'search'
export type Pane = 'tree' | 'editor'
export type Background = 'dark' | 'light'

export interface Cursor {
  row: number
  col: number
  /** Column Vim "wants" to return to when moving vertically (curswant). */
  want: number
}

export interface Message {
  key: MessageKey
  params?: (string | number | Localized)[]
  level: 'info' | 'error' | 'success'
}

export type ContactValues = Record<FormField, string>
export type FormStatus = 'idle' | 'sending' | 'sent' | 'error'

/** Side effects the reducer requests; executed by the Editor, then cleared. */
export type Effect =
  | { type: 'openUrl'; href: string }
  | { type: 'submitContact'; values: ContactValues }
  | { type: 'setLocale'; locale: Locale }

export interface Options {
  number: boolean
  relativeNumber: boolean
  background: Background
}

export interface EditorState extends Workspace {
  tabs: string[]
  active: string
  cursors: Record<string, Cursor>
  mode: Mode
  pane: Pane
  treeOpen: boolean
  treeCursor: number
  /** Text typed after ':' or '/'. */
  cmdline: string
  /** First keys of a multi-key command, e.g. 'g' while waiting for 'g' or 't'. */
  pending: string
  count: string
  search: { term: string; highlight: boolean } | null
  message: Message | null
  viewportRows: number
  options: Options
  form: { values: ContactValues; field: FormField | null; status: FormStatus }
  effects: Effect[]
}

export const EMPTY_CURSOR: Cursor = { row: 0, col: 0, want: 0 }

export interface InitOptions {
  tabs: string[]
  active?: string
  options?: Partial<Options>
}

export function createInitialState(workspace: Workspace, init: InitOptions): EditorState {
  const tabs = init.tabs.filter((id) => id in workspace.buffers)
  const requested = init.active && init.active in workspace.buffers ? init.active : undefined
  const active = requested ?? tabs[0] ?? workspace.order[0] ?? ''

  return {
    ...workspace,
    tabs: tabs.includes(active) ? tabs : [...tabs, active],
    active,
    cursors: {},
    mode: 'normal',
    pane: 'editor',
    treeOpen: false,
    treeCursor: Math.max(0, workspace.order.indexOf(active)),
    cmdline: '',
    pending: '',
    count: '',
    search: null,
    message: { key: 'welcome', level: 'info' },
    viewportRows: 30,
    options: { number: true, relativeNumber: false, background: 'dark', ...init.options },
    form: { values: { name: '', email: '', message: '' }, field: null, status: 'idle' },
    effects: [],
  }
}
