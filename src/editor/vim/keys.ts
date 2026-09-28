import { firstNonBlank, lineEnd, nextWord, prevWord, toCol, toRow } from './motions'
import {
  activeBuffer,
  activeLines,
  closeTab,
  cursorOf,
  cycleTab,
  enterInsert,
  error,
  focusPane,
  follow,
  followLinkUnderCursor,
  gotoTab,
  openBuffer,
  search,
  setCursor,
  toggleTree,
  withMessage,
} from './operations'
import type { Cursor, EditorState } from './state'

/** Keys that would modify text: only meaningful in the contact form. */
const INSERT_KEYS = new Set(['i', 'a', 'o', 'I', 'A', 'O', 's', 'S', 'C', 'c'])
const EDIT_KEYS = new Set(['x', 'X', 'd', 'D', 'p', 'P', 'r', 'R', 'u', '<C-r>', '.', 'J'])

/** Prefixes that wait for another key. */
const PREFIXES = new Set(['g', 'Z', '<Space>'])

function reset(state: EditorState): EditorState {
  return { ...state, pending: '', count: '' }
}

function move(state: EditorState, motion: (cursor: Cursor) => Cursor): EditorState {
  return reset(setCursor(state, motion(cursorOf(state))))
}

function repeat(times: number, step: (cursor: Cursor) => Cursor) {
  return (cursor: Cursor) => {
    let next = cursor
    for (let i = 0; i < times; i++) next = step(next)
    return next
  }
}

/** Resolves a two-key sequence such as `gg`, `gt`, `ZZ` or `<Space>e`. */
function handleSequence(
  state: EditorState,
  sequence: string,
  count: number,
  hasCount: boolean,
): EditorState {
  const lines = activeLines(state)
  switch (sequence) {
    case 'gg':
      return move(state, (c) => toRow(lines, c, hasCount ? count - 1 : 0))
    case 'gt':
      return reset(hasCount ? gotoTab(state, count) : cycleTab(state, 1))
    case 'gT':
      return reset(cycleTab(state, -count))
    case 'gx':
      return reset(followLinkUnderCursor(state) ?? withMessage(state, error('noLink')))
    case 'ZZ':
    case 'ZQ':
      return reset(closeTab(state))
    case '<Space>e':
      return reset(toggleTree(state))
    default:
      return reset(state)
  }
}

export function handleNormalKey(state: EditorState, key: string): EditorState {
  const count = Number(state.count) || 1
  const hasCount = state.count !== ''

  if (state.pending) return handleSequence(state, state.pending + key, count, hasCount)
  if (/^[1-9]$/.test(key) || (key === '0' && hasCount))
    return { ...state, count: state.count + key }
  if (PREFIXES.has(key)) return { ...state, pending: key }

  const lines = activeLines(state)
  const page = Math.max(1, Math.floor(state.viewportRows / 2))

  switch (key) {
    case 'j':
    case '<Down>':
      return move(state, (c) => toRow(lines, c, c.row + count))
    case 'k':
    case '<Up>':
      return move(state, (c) => toRow(lines, c, c.row - count))
    case 'h':
    case '<Left>':
    case '<BS>':
      return move(state, (c) => toCol(lines, c, c.col - count))
    case 'l':
    case '<Right>':
      return move(state, (c) => toCol(lines, c, c.col + count))
    case 'w':
      return move(
        state,
        repeat(count, (c) => nextWord(lines, c)),
      )
    case 'b':
      return move(
        state,
        repeat(count, (c) => prevWord(lines, c)),
      )
    case '0':
    case '<Home>':
      return move(state, (c) => toCol(lines, c, 0))
    case '^':
      return move(state, (c) => firstNonBlank(lines, c))
    case '$':
    case '<End>':
      return move(state, (c) => lineEnd(lines, c))
    case 'G':
      return move(state, (c) => toRow(lines, c, hasCount ? count - 1 : lines.length - 1))
    case '<C-d>':
      return move(state, (c) => toRow(lines, c, c.row + page))
    case '<C-u>':
      return move(state, (c) => toRow(lines, c, c.row - page))
    case '<C-f>':
    case '<PageDown>':
      return move(state, (c) => toRow(lines, c, c.row + page * 2))
    case '<C-b>':
    case '<PageUp>':
      return move(state, (c) => toRow(lines, c, c.row - page * 2))
    case '<CR>':
      return reset(
        followLinkUnderCursor(state) ??
          move(state, (c) => firstNonBlank(lines, toRow(lines, c, c.row + count))),
      )
    case 'n':
    case 'N': {
      const term = state.search?.term ?? ''
      return reset(search(state, term, key === 'n' ? 1 : -1))
    }
    case ':':
      return { ...reset(state), mode: 'command', cmdline: '' }
    case '/':
      return { ...reset(state), mode: 'search', cmdline: '' }
    case '?':
      return reset(openBuffer(state, 'help'))
    case 'q':
      return reset(activeBuffer(state)?.filetype === 'help' ? closeTab(state) : state)
    case '-':
    case '<C-h>':
      return reset(focusPane(state, 'tree'))
    case '<C-l>':
      return reset(focusPane(state, 'editor'))
    case '<Esc>':
      return { ...reset(state), message: null }
  }

  if (INSERT_KEYS.has(key)) {
    return activeBuffer(state)?.filetype === 'form'
      ? enterInsert(reset(state))
      : withMessage(reset(state), error('notModifiable'))
  }
  if (EDIT_KEYS.has(key)) return withMessage(reset(state), error('notModifiable'))

  return reset(state)
}

export function handleTreeKey(state: EditorState, key: string): EditorState {
  const last = state.order.length - 1
  const at = (index: number) => ({
    ...state,
    treeCursor: Math.min(Math.max(0, index), last),
    pending: '',
  })

  if (state.pending === 'g') return key === 'g' ? at(0) : { ...state, pending: '' }
  if (state.pending === '<Space>')
    return { ...(key === 'e' ? toggleTree(state, false) : state), pending: '' }

  switch (key) {
    case 'j':
    case '<Down>':
      return at(state.treeCursor + 1)
    case 'k':
    case '<Up>':
      return at(state.treeCursor - 1)
    case 'G':
      return at(last)
    case 'g':
    case '<Space>':
      return { ...state, pending: key }
    case '<CR>':
    case 'l':
    case 'o': {
      const id = state.order[state.treeCursor]
      return id ? follow(state, `buffer:${id}`) : state
    }
    case 'q':
    case '-':
      return toggleTree(state, false)
    case '<C-l>':
    case '<Esc>':
      return focusPane(state, 'editor')
    case ':':
      return { ...state, mode: 'command', cmdline: '' }
    case '?':
      return openBuffer(state, 'help')
    default:
      return state
  }
}
