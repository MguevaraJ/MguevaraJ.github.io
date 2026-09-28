import type { Workspace } from '@/buffers'
import type { FormField } from '../model/types'
import { completeCommand, executeCommand } from './commands'
import { handleNormalKey, handleTreeKey } from './keys'
import { maxCol } from './motions'
import {
  closeTab,
  enterInsert,
  error,
  focusPane,
  follow,
  openBuffer,
  search,
  setCursor,
  toggleTree,
  withMessage,
} from './operations'
import type { EditorState, Options } from './state'

export type Action =
  /** A normalized key (`j`, `G`, `<C-d>`, `<Esc>`…) pressed outside text inputs. */
  | { type: 'key'; key: string }
  | { type: 'cmdline/change'; value: string }
  | { type: 'cmdline/submit' }
  | { type: 'cmdline/cancel' }
  | { type: 'cmdline/complete' }
  | { type: 'cmdline/open'; prefix: ':' | '/' }
  | { type: 'buffer/open'; id: string }
  | { type: 'tab/close'; id: string }
  | { type: 'link/follow'; href: string }
  | { type: 'cursor/set'; row: number; col?: number }
  | { type: 'tree/toggle' }
  | { type: 'pane/focus'; pane: EditorState['pane'] }
  | { type: 'form/focus'; field: FormField }
  | { type: 'form/input'; field: FormField; value: string }
  | { type: 'form/result'; outcome: 'sent' | 'mailto' | 'error'; contactEmail: string }
  | { type: 'workspace/load'; workspace: Workspace }
  | { type: 'options/set'; options: Partial<Options> }
  | { type: 'viewport/resize'; rows: number }
  | { type: 'effects/flush' }

export function editorReducer(state: EditorState, action: Action): EditorState {
  switch (action.type) {
    case 'key':
      return handleKey(state, action.key)

    case 'cmdline/change':
      return { ...state, cmdline: action.value }

    case 'cmdline/submit':
      if (state.mode === 'search') {
        const term = state.cmdline || state.search?.term || ''
        return search({ ...state, mode: 'normal', cmdline: '' }, term, 1)
      }
      return executeCommand(state, state.cmdline)

    case 'cmdline/cancel':
      return { ...state, mode: 'normal', cmdline: '' }

    case 'cmdline/complete':
      return state.mode === 'command'
        ? { ...state, cmdline: completeCommand(state, state.cmdline) }
        : state

    case 'cmdline/open':
      return {
        ...state,
        mode: action.prefix === ':' ? 'command' : 'search',
        cmdline: '',
        pending: '',
        count: '',
      }

    case 'buffer/open':
      return openBuffer(state, action.id)

    case 'tab/close':
      return closeTab(state, action.id)

    case 'link/follow':
      return follow({ ...state, mode: 'normal' }, action.href)

    case 'cursor/set': {
      const line = state.buffers[state.active]?.lines[action.row]
      if (!line) return state
      const col = Math.min(action.col ?? 0, maxCol(line))
      return { ...setCursor(state, { row: action.row, col, want: col }), pane: 'editor' }
    }

    case 'tree/toggle':
      return toggleTree(state)

    case 'pane/focus':
      return focusPane(state, action.pane)

    case 'form/focus':
      return state.mode === 'insert' && state.form.field === action.field
        ? state
        : enterInsert(state, action.field)

    case 'form/input':
      return {
        ...state,
        form: { ...state.form, values: { ...state.form.values, [action.field]: action.value } },
      }

    case 'form/result':
      if (action.outcome === 'error') {
        return withMessage(
          { ...state, form: { ...state.form, status: 'error' } },
          error('formError', [action.contactEmail]),
        )
      }
      return {
        ...state,
        form: { values: { name: '', email: '', message: '' }, field: null, status: 'sent' },
        message: { key: action.outcome === 'sent' ? 'formSent' : 'formMailto', level: 'success' },
      }

    case 'workspace/load': {
      const { workspace } = action
      const known = (id: string) => id in workspace.buffers
      return {
        ...state,
        ...workspace,
        tabs: state.tabs.filter(known),
        active: known(state.active) ? state.active : (workspace.order[0] ?? ''),
      }
    }

    case 'options/set':
      return { ...state, options: { ...state.options, ...action.options } }

    case 'viewport/resize':
      return action.rows === state.viewportRows ? state : { ...state, viewportRows: action.rows }

    case 'effects/flush':
      return state.effects.length ? { ...state, effects: [] } : state
  }
}

function handleKey(state: EditorState, key: string): EditorState {
  if (state.mode === 'insert') {
    return key === '<Esc>'
      ? { ...state, mode: 'normal', form: { ...state.form, field: null } }
      : state
  }
  if (state.mode === 'command' || state.mode === 'search') return state
  return state.pane === 'tree' ? handleTreeKey(state, key) : handleNormalKey(state, key)
}
