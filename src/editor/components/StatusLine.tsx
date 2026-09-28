import { useLocale } from '@/i18n/LocaleContext'
import type { Buffer } from '../model/types'
import type { Cursor, EditorState } from '../vim/state'
import styles from './StatusLine.module.css'

interface StatusLineProps {
  buffer: Buffer
  cursor: Cursor
  state: Pick<EditorState, 'mode' | 'pane' | 'form' | 'viewportRows'>
}

const MODE_LABEL = {
  normal: 'NORMAL',
  insert: 'INSERT',
  command: 'COMMAND',
  search: 'COMMAND',
} as const

/** Vim's ruler: Top / Bot / All / NN%. */
function position(row: number, total: number, visible: number): string {
  if (total <= visible) return 'All'
  if (row === 0) return 'Top'
  if (row >= total - 1) return 'Bot'
  return `${Math.round((row / (total - 1)) * 100)}%`
}

/** A lualine-style statusline. */
export function StatusLine({ buffer, cursor, state }: StatusLineProps) {
  const locale = useLocale()
  const isForm = buffer.filetype === 'form'
  const modified = isForm && Object.values(state.form.values).some(Boolean)
  const name = state.pane === 'tree' ? 'netrw' : buffer.name

  return (
    <footer className={styles.statusline} data-mode={state.mode}>
      <span className={styles.mode}>{MODE_LABEL[state.mode]}</span>
      <span className={styles.branch}> main</span>
      <span className={styles.file}>
        {name}
        {state.pane === 'editor' && !isForm && <span className={styles.flag}> [RO]</span>}
        {modified && <span className={styles.modified}> [+]</span>}
      </span>
      <span className={styles.spacer} />
      <span className={styles.meta}>
        utf-8 · {locale} · {buffer.filetype === 'form' ? 'markdown' : buffer.filetype}
      </span>
      <span className={styles.progress}>
        {position(cursor.row, buffer.lines.length, state.viewportRows)}
      </span>
      <span className={styles.location}>
        {cursor.row + 1}:{cursor.col + 1}
      </span>
    </footer>
  )
}
