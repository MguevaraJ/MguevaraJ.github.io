import { buildWorkspace, STARTUP_TABS } from '@/buffers'
import { editorReducer, type Action } from './reducer'
import { createInitialState, type EditorState } from './state'

function setup(active = 'readme'): EditorState {
  return createInitialState(buildWorkspace('en'), { tabs: STARTUP_TABS, active })
}

function keys(state: EditorState, sequence: string[]): EditorState {
  return sequence.reduce((s, key) => editorReducer(s, { type: 'key', key }), state)
}

function run(state: EditorState, ...actions: Action[]): EditorState {
  return actions.reduce(editorReducer, state)
}

function command(state: EditorState, input: string): EditorState {
  return run(
    state,
    { type: 'key', key: ':' },
    { type: 'cmdline/change', value: input },
    { type: 'cmdline/submit' },
  )
}

const cursor = (state: EditorState) => state.cursors[state.active] ?? { row: 0, col: 0 }

describe('motions', () => {
  it('moves with j/k and supports counts', () => {
    const state = keys(setup(), ['5', 'j'])
    expect(cursor(state).row).toBe(5)
    expect(cursor(keys(state, ['2', 'k'])).row).toBe(3)
  })

  it('jumps with gg, G and {count}G', () => {
    const state = setup()
    const last = state.buffers.readme!.lines.length - 1
    expect(cursor(keys(state, ['G'])).row).toBe(last)
    expect(cursor(keys(state, ['G', 'g', 'g'])).row).toBe(0)
    expect(cursor(keys(state, ['1', '0', 'G'])).row).toBe(9)
  })

  it('never leaves the buffer', () => {
    expect(cursor(keys(setup(), ['k', 'k'])).row).toBe(0)
    expect(cursor(keys(setup(), ['9', '9', '9', 'j'])).row).toBe(
      setup().buffers.readme!.lines.length - 1,
    )
  })

  it('remembers the wanted column across short lines', () => {
    const state = setup('experience')
    const lines = state.buffers.experience!.lines
    const long = lines.findIndex((l, i) => l.text.length > 20 && lines[i + 1]?.text === '')
    let s = command(state, String(long + 1))
    s = keys(s, ['$'])
    s = keys(s, ['j'])
    expect(cursor(s).col).toBe(0)
    s = keys(s, ['k'])
    expect(cursor(s).col).toBe(lines[long]!.text.length - 1)
  })
})

describe('tabs', () => {
  it('opens every section as a tab on startup', () => {
    expect(setup().tabs).toEqual(STARTUP_TABS)
  })

  it('cycles with gt / gT and jumps with {n}gt', () => {
    const state = setup()
    expect(keys(state, ['g', 't']).active).toBe('experience')
    expect(keys(state, ['g', 'T']).active).toBe('cv')
    expect(keys(state, ['3', 'g', 't']).active).toBe('projects')
  })

  it('closes a tab with :q but refuses to close the last one', () => {
    let state = command(setup(), 'q')
    expect(state.tabs).not.toContain('readme')
    expect(state.active).toBe('experience')

    state = { ...state, tabs: ['experience'] }
    state = command(state, 'q')
    expect(state.tabs).toEqual(['experience'])
    expect(state.message?.key).toBe('cannotQuit')
  })

  it('opens files with :e using prefixes, and reports unknown ones', () => {
    expect(command(setup(), 'e proj').active).toBe('projects')
    expect(command(setup(), 'e nope').message?.key).toBe('noMatchingBuffer')
  })

  it('opens help as a new tab', () => {
    const state = keys(setup(), ['?'])
    expect(state.active).toBe('help')
    expect(state.tabs.at(-1)).toBe('help')
  })
})

describe('command line', () => {
  it('reports unknown commands like Vim', () => {
    const state = command(setup(), 'foo')
    expect(state.message).toMatchObject({ key: 'notEditorCommand', level: 'error' })
    expect(state.mode).toBe('normal')
  })

  it('completes file names with <Tab>', () => {
    const state = run(
      setup(),
      { type: 'key', key: ':' },
      { type: 'cmdline/change', value: 'e st' },
      { type: 'cmdline/complete' },
    )
    expect(state.cmdline).toBe('e stack.ts')
  })

  it('queues a locale change for :set lang=es', () => {
    const state = command(setup(), 'set lang=es')
    expect(state.effects).toContainEqual({ type: 'setLocale', locale: 'es' })
    expect(command(setup(), 'set lang=fr').message?.key).toBe('unknownOption')
  })

  it('toggles options', () => {
    expect(command(setup(), 'set rnu').options.relativeNumber).toBe(true)
    expect(command(setup(), 'set background=light').options.background).toBe('light')
  })

  it('refuses to write read-only buffers', () => {
    expect(command(setup(), 'w').message?.key).toBe('readonly')
  })

  it('opens shortcut links as external effects', () => {
    const state = command(setup(), 'github')
    expect(state.effects[0]).toMatchObject({ type: 'openUrl' })
  })
})

describe('search', () => {
  it('finds matches, wraps and reports misses', () => {
    let state = run(
      setup('experience'),
      { type: 'key', key: '/' },
      { type: 'cmdline/change', value: 'nestjs' },
      { type: 'cmdline/submit' },
    )
    const first = cursor(state).row
    expect(state.buffers.experience!.lines[first]!.text.toLowerCase()).toContain('nestjs')

    state = keys(state, ['n'])
    expect(cursor(state).row).toBeGreaterThanOrEqual(first)

    state = run(
      state,
      { type: 'key', key: '/' },
      { type: 'cmdline/change', value: 'zzzz' },
      { type: 'cmdline/submit' },
    )
    expect(state.message?.key).toBe('patternNotFound')
  })
})

describe('links', () => {
  it('follows buffer links with <CR>', () => {
    const state = setup()
    const row = state.buffers.readme!.lines.findIndex((l) =>
      l.tokens.some((t) => t.href === 'buffer:projects'),
    )
    const moved = command(state, String(row + 1))
    expect(keys(moved, ['<CR>']).active).toBe('projects')
  })
})

describe('contact form', () => {
  it('only allows insert mode in contact.md', () => {
    expect(keys(setup(), ['i']).message?.key).toBe('notModifiable')
    const state = keys(setup('contact'), ['i'])
    expect(state.mode).toBe('insert')
    expect(state.form.field).toBe('name')
    expect(keys(state, ['<Esc>']).mode).toBe('normal')
  })

  it('validates before sending with :w', () => {
    let state = setup('contact')
    expect(command(state, 'w').message?.key).toBe('formRequired')

    state = run(
      state,
      { type: 'form/input', field: 'name', value: 'Ada' },
      { type: 'form/input', field: 'email', value: 'not-an-email' },
      { type: 'form/input', field: 'message', value: 'Hi!' },
    )
    expect(command(state, 'w').message?.key).toBe('formInvalidEmail')

    state = run(state, { type: 'form/input', field: 'email', value: 'ada@example.com' })
    const sent = command(state, 'w')
    expect(sent.form.status).toBe('sending')
    expect(sent.effects).toContainEqual({
      type: 'submitContact',
      values: { name: 'Ada', email: 'ada@example.com', message: 'Hi!' },
    })
  })

  it('clears the form after a successful send', () => {
    const state = run(
      setup('contact'),
      { type: 'form/input', field: 'name', value: 'Ada' },
      { type: 'form/result', outcome: 'sent', contactEmail: 'me@x.dev' },
    )
    expect(state.form.values.name).toBe('')
    expect(state.message?.key).toBe('formSent')
  })
})

describe('workspace', () => {
  it('keeps tabs and the active buffer when the language changes', () => {
    const state = run(keys(setup(), ['g', 't']), {
      type: 'workspace/load',
      workspace: buildWorkspace('es'),
    })
    expect(state.active).toBe('experience')
    expect(state.tabs).toEqual(STARTUP_TABS)
    expect(state.buffers.experience!.lines[0]!.text).toBe('# Experiencia')
  })
})
