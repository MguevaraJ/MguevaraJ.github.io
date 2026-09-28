import type { ReactNode } from 'react'
import styles from './Terminal.module.css'

interface TerminalProps {
  title: string
  children: ReactNode
}

/** A terminal emulator window that hosts the shell and the editor. */
export function Terminal({ title, children }: TerminalProps) {
  return (
    <div className={styles.desktop}>
      <div className={styles.window}>
        <div className={styles.titlebar} aria-hidden>
          <div className={styles.lights}>
            <span />
            <span />
            <span />
          </div>
          <div className={styles.title}>{title}</div>
        </div>
        <div className={styles.screen}>{children}</div>
      </div>
    </div>
  )
}
