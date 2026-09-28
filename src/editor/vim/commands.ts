import { isLocale } from '@/i18n/locale'
import { toRow } from './motions'
import {
  activeBuffer,
  activeLines,
  closeTab,
  cursorOf,
  cycleTab,
  error,
  follow,
  gotoTab,
  info,
  openBuffer,
  resolveBuffer,
  setCursor,
  submitForm,
  toggleTree,
  withMessage,
} from './operations'
import type { EditorState } from './state'

type Command = (state: EditorState, args: string[]) => EditorState

const isForm = (state: EditorState) => activeBuffer(state)?.filetype === 'form'

const quit: Command = (state) => closeTab(state)
const write: Command = (state) =>
  isForm(state) ? submitForm(state) : withMessage(state, error('readonly'))
const writeQuit: Command = (state) => (isForm(state) ? submitForm(state) : closeTab(state))

const edit: Command = (state, [target]) => {
  if (!target) {
    const buffer = activeBuffer(state)
    return buffer ? openBuffer(state, buffer.id) : state
  }
  const id = resolveBuffer(state, target)
  return id ? openBuffer(state, id) : withMessage(state, error('noMatchingBuffer', [target]))
}

const set: Command = (state, args) => {
  let next = state
  for (const arg of args) {
    const [option = '', value] = arg.split('=')
    const { options } = next
    switch (option) {
      case 'lang':
      case 'language':
        if (!isLocale(value)) return withMessage(next, error('unknownOption', [arg]))
        next = { ...next, effects: [...next.effects, { type: 'setLocale', locale: value }] }
        break
      case 'bg':
      case 'background':
        if (value !== 'dark' && value !== 'light')
          return withMessage(next, error('unknownOption', [arg]))
        next = { ...next, options: { ...options, background: value } }
        break
      case 'nu':
      case 'number':
        next = { ...next, options: { ...options, number: true } }
        break
      case 'nonu':
      case 'nonumber':
        next = { ...next, options: { ...options, number: false } }
        break
      case 'rnu':
      case 'relativenumber':
        next = { ...next, options: { ...options, relativeNumber: true } }
        break
      case 'nornu':
      case 'norelativenumber':
        next = { ...next, options: { ...options, relativeNumber: false } }
        break
      default:
        return withMessage(next, error('unknownOption', [arg]))
    }
  }
  return withMessage(next, args.length ? info('optionSet', [args.join(' ')]) : null)
}

const COMMANDS: Record<string, Command> = {}

function register(names: string[], command: Command) {
  for (const name of names) COMMANDS[name] = command
}

register(['q', 'q!', 'quit', 'clo', 'close', 'tabc', 'tabclose', 'bd', 'bdelete', 'bw'], quit)
register(['qa', 'qa!', 'qall', 'wqa', 'xa', 'cq'], (state) =>
  withMessage(state, error('cannotQuit')),
)
register(['w', 'w!', 'write', 'up', 'update'], write)
register(['wq', 'wq!', 'x', 'xit', 'exit'], writeQuit)
register(
  [
    'e',
    'e!',
    'edit',
    'tabe',
    'tabedit',
    'tabnew',
    'b',
    'buffer',
    'find',
    'sp',
    'vs',
    'split',
    'vsplit',
    'new',
  ],
  edit,
)
register(['bn', 'bnext', 'tabn', 'tabnext'], (state) => cycleTab(state, 1))
register(['bp', 'bN', 'bprevious', 'tabp', 'tabN', 'tabprevious'], (state) => cycleTab(state, -1))
register(['tabfir', 'tabfirst', 'tabr', 'tabrewind', 'bf', 'bfirst'], (state) => gotoTab(state, 1))
register(['tabl', 'tablast', 'bl', 'blast'], (state) => gotoTab(state, state.tabs.length))
register(['h', 'help'], (state) => openBuffer(state, 'help'))
register(['se', 'set'], set)
register(['noh', 'nohlsearch'], (state) =>
  withMessage({ ...state, search: state.search && { ...state.search, highlight: false } }, null),
)
register(
  ['Ex', 'Explore', 'Lex', 'Lexplore', 'NERDTree', 'NERDTreeToggle', 'NvimTreeToggle', 'Neotree'],
  (state) => toggleTree(state),
)

/** Ex command names offered by <Tab> completion that take a file argument. */
export const FILE_COMMANDS = new Set([
  'e',
  'edit',
  'tabe',
  'tabedit',
  'tabnew',
  'b',
  'buffer',
  'find',
  'sp',
  'vs',
])

export function executeCommand(state: EditorState, input: string): EditorState {
  const trimmed = input.trim()
  const base = { ...state, mode: 'normal' as const, cmdline: '' }
  if (!trimmed) return base

  if (/^\d+$/.test(trimmed)) {
    const lines = activeLines(base)
    return setCursor(base, toRow(lines, cursorOf(base), Number(trimmed) - 1))
  }

  const [name = '', ...args] = trimmed.split(/\s+/)
  const command = COMMANDS[name]
  if (command) return command(base, args)

  const shortcut = state.shortcuts[name]
  if (shortcut) return follow(base, shortcut)

  return withMessage(base, error('notEditorCommand', [trimmed]))
}

/** <Tab> in the command line: completes file names for :e and friends, cycling on repeat. */
export function completeCommand(state: EditorState, input: string): string {
  const match = /^(\S+)\s+(\S*)$/.exec(input)
  if (!match) return input
  const [, name = '', partial = ''] = match
  if (!FILE_COMMANDS.has(name)) return input

  const names = state.order.map((id) => state.buffers[id]?.name ?? id)
  const exact = names.indexOf(partial)
  if (exact !== -1) return `${name} ${names[(exact + 1) % names.length]}`

  const candidate = names.find((file) => file.toLowerCase().startsWith(partial.toLowerCase()))
  return candidate ? `${name} ${candidate}` : input
}
