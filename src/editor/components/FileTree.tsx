import type { Dispatch } from 'react'
import { useLocalized } from '@/i18n/LocaleContext'
import { ui } from '@/i18n/messages'
import { hrefForBuffer } from '../hooks/useHashRoute'
import type { Filetype } from '../model/types'
import type { Action } from '../vim/reducer'
import type { EditorState } from '../vim/state'
import styles from './FileTree.module.css'

const ICONS: Record<Filetype, string> = { markdown: 'M', typescript: 'T', help: '?', form: '@' }

interface FileTreeProps {
  state: Pick<EditorState, 'order' | 'buffers' | 'active' | 'pane' | 'treeCursor' | 'tabs'>
  dispatch: Dispatch<Action>
}

/** A netrw / NvimTree-style sidebar listing every file in the portfolio. */
export function FileTree({ state, dispatch }: FileTreeProps) {
  const t = useLocalized()
  const focused = state.pane === 'tree'

  return (
    <aside className={styles.tree} data-focused={focused || undefined} aria-label={t(ui.treeTitle)}>
      <div className={styles.root}>~/moises/</div>
      <ul className={styles.list}>
        {state.order.map((id, index) => {
          const buffer = state.buffers[id]
          if (!buffer) return null
          const icon = buffer.name.endsWith('.pdf') ? 'P' : ICONS[buffer.filetype]
          return (
            <li key={id}>
              <a
                href={hrefForBuffer(id)}
                className={styles.item}
                data-active={id === state.active || undefined}
                data-cursor={(focused && index === state.treeCursor) || undefined}
                onClick={(event) => {
                  event.preventDefault()
                  dispatch({ type: 'buffer/open', id })
                }}
              >
                <span className={styles.icon} data-type={icon}>
                  {icon}
                </span>
                {buffer.name}
                {state.tabs.includes(id) && id !== state.active && (
                  <span className={styles.open}> •</span>
                )}
              </a>
            </li>
          )
        })}
      </ul>
    </aside>
  )
}
