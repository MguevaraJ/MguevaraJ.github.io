import { useCallback, useEffect, useReducer } from 'react'
import { STARTUP_TABS, type Workspace } from '@/buffers'
import type { Locale } from '@/i18n/locale'
import { readHash, useHashRoute } from '../hooks/useHashRoute'
import { useEffectsRunner } from '../hooks/useEffectsRunner'
import { useKeyboard } from '../hooks/useKeyboard'
import { cursorOf } from '../vim/operations'
import { editorReducer } from '../vim/reducer'
import { createInitialState, type Options } from '../vim/state'
import { BufferView } from './BufferView'
import { CommandLine } from './CommandLine'
import { FileTree } from './FileTree'
import { StatusLine } from './StatusLine'
import { TabLine } from './TabLine'
import styles from './Editor.module.css'

interface EditorProps {
  workspace: Workspace
  initialOptions?: Partial<Options>
  /** Keyboard input is ignored while false (e.g. during the boot animation). */
  active?: boolean
  onLocaleChange: (locale: Locale) => void
  onOptionsChange?: (options: Options) => void
}

export function Editor({
  workspace,
  initialOptions,
  active = true,
  onLocaleChange,
  onOptionsChange,
}: EditorProps) {
  const [state, dispatch] = useReducer(editorReducer, undefined, () =>
    createInitialState(workspace, {
      tabs: STARTUP_TABS,
      active: readHash(),
      options: initialOptions,
    }),
  )

  // Re-render every buffer when the language changes, keeping tabs and cursors.
  useEffect(() => {
    dispatch({ type: 'workspace/load', workspace })
  }, [workspace])

  useEffect(() => {
    onOptionsChange?.(state.options)
  }, [state.options, onOptionsChange])

  const onKey = useCallback((key: string) => dispatch({ type: 'key', key }), [])
  const onNavigate = useCallback((id: string) => dispatch({ type: 'buffer/open', id }), [])

  useKeyboard(state.mode, onKey, active)
  useHashRoute(state.active, onNavigate)
  useEffectsRunner(state.effects, dispatch, onLocaleChange)

  const buffer = state.buffers[state.active]
  if (!buffer) return null
  const cursor = cursorOf(state)

  return (
    <div className={styles.editor}>
      <TabLine
        state={state}
        background={state.options.background}
        dispatch={dispatch}
        onLocaleChange={onLocaleChange}
      />
      <main className={styles.body}>
        {state.treeOpen && <FileTree state={state} dispatch={dispatch} />}
        <BufferView buffer={buffer} cursor={cursor} state={state} dispatch={dispatch} />
      </main>
      <StatusLine buffer={buffer} cursor={cursor} state={state} />
      <CommandLine state={state} dispatch={dispatch} />
    </div>
  )
}
