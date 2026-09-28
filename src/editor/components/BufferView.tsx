import { useCallback, useEffect, useRef, type Dispatch, type MouseEvent } from 'react'
import type { Buffer, FormField } from '../model/types'
import { useViewportRows } from '../hooks/useViewportRows'
import type { Action } from '../vim/reducer'
import { matchColumns } from '../vim/search'
import type { Cursor, EditorState } from '../vim/state'
import { BufferLine } from './BufferLine'
import { columnFromPoint } from './caret'
import { FormFieldInput } from './FormFieldInput'
import styles from './BufferView.module.css'

const NO_MATCHES: readonly number[] = []

interface BufferViewProps {
  buffer: Buffer
  cursor: Cursor
  state: Pick<EditorState, 'mode' | 'pane' | 'options' | 'search' | 'form' | 'viewportRows'>
  dispatch: Dispatch<Action>
}

export function BufferView({ buffer, cursor, state, dispatch }: BufferViewProps) {
  const ref = useRef<HTMLDivElement>(null)
  const { mode, pane, options, search, form, viewportRows } = state
  const term = search?.highlight ? search.term : ''
  const showCursor =
    pane === 'editor' && (mode === 'normal' || mode === 'command' || mode === 'search')
  const showGutter = options.number || options.relativeNumber

  useViewportRows(
    ref,
    useCallback((rows: number) => dispatch({ type: 'viewport/resize', rows }), [dispatch]),
  )

  // Keep the cursor line on screen, like 'scrolloff'.
  useEffect(() => {
    ref.current?.querySelector(`[data-row="${cursor.row}"]`)?.scrollIntoView({ block: 'nearest' })
  }, [cursor.row, buffer.id])

  // Each buffer starts at the top when it is opened.
  useEffect(() => {
    ref.current?.scrollTo({ top: 0 })
  }, [buffer.id])

  const onFollow = useCallback(
    (href: string) => dispatch({ type: 'link/follow', href }),
    [dispatch],
  )
  const onFocus = useCallback(
    (field: FormField) => dispatch({ type: 'form/focus', field }),
    [dispatch],
  )
  const onChange = useCallback(
    (field: FormField, value: string) => dispatch({ type: 'form/input', field, value }),
    [dispatch],
  )

  function handleClick(event: MouseEvent<HTMLDivElement>) {
    const target = event.target as HTMLElement
    if (target.closest('a, input, textarea, label')) return
    const row = target.closest<HTMLElement>('[data-row]')?.dataset.row
    if (row === undefined) return
    if (window.getSelection()?.toString()) return // the visitor is selecting text to copy
    dispatch({
      type: 'cursor/set',
      row: Number(row),
      col: columnFromPoint(event.clientX, event.clientY),
    })
  }

  const numberFor = (row: number) => {
    if (!showGutter) return null
    if (options.relativeNumber && row !== cursor.row) return Math.abs(row - cursor.row)
    return row + 1
  }

  return (
    <div
      ref={ref}
      className={styles.view}
      onClick={handleClick}
      role="region"
      aria-label={buffer.name}
      tabIndex={-1}
    >
      {buffer.lines.map((line, row) => (
        <BufferLine
          key={row}
          line={line}
          row={row}
          number={numberFor(row)}
          isCursorLine={row === cursor.row && pane === 'editor'}
          cursorCol={showCursor && row === cursor.row && !line.field ? cursor.col : null}
          matches={term ? matchColumns(line.text, term) : NO_MATCHES}
          matchLength={term.length}
          onFollow={onFollow}
        >
          {line.field && (
            <FormFieldInput
              field={line.field}
              label={line.text}
              value={form.values[line.field]}
              active={mode === 'insert' && form.field === line.field}
              disabled={form.status === 'sending'}
              onFocus={onFocus}
              onChange={onChange}
            />
          )}
        </BufferLine>
      ))}
      {/* Vim's "~" lines after the end of the buffer; they only fill leftover space. */}
      <div className={styles.fill} aria-hidden>
        {Array.from({ length: viewportRows }, (_, index) => (
          <div key={index}>~</div>
        ))}
      </div>
    </div>
  )
}
