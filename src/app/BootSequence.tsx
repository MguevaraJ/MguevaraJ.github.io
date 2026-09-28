import { useEffect, useState } from 'react'
import { STARTUP_TABS, type Workspace } from '@/buffers'
import { useLocalized } from '@/i18n/LocaleContext'
import { ui } from '@/i18n/messages'
import styles from './BootSequence.module.css'

const PROMPT = 'moises@portfolio:~$ '
const TYPE_DELAY_MS = 28
const LAUNCH_DELAY_MS = 350

interface BootSequenceProps {
  workspace: Workspace
  onDone: () => void
}

/** A shell that types `nvim -p <files>` and then hands over to the editor. */
export function BootSequence({ workspace, onDone }: BootSequenceProps) {
  const t = useLocalized()
  const files = STARTUP_TABS.map((id) => workspace.buffers[id]?.name ?? id).join(' ')
  const command = `nvim -p ${files}`
  const [typed, setTyped] = useState(0)

  useEffect(() => {
    const done = typed >= command.length
    const timer = window.setTimeout(
      done ? onDone : () => setTyped((n) => n + 1),
      done ? LAUNCH_DELAY_MS : TYPE_DELAY_MS,
    )
    return () => window.clearTimeout(timer)
  }, [typed, command.length, onDone])

  useEffect(() => {
    const skip = () => onDone()
    window.addEventListener('keydown', skip)
    window.addEventListener('pointerdown', skip)
    return () => {
      window.removeEventListener('keydown', skip)
      window.removeEventListener('pointerdown', skip)
    }
  }, [onDone])

  return (
    <div className={styles.shell} aria-hidden>
      <p className={styles.dim}>Last login: {new Date().toDateString()} on ttys001</p>
      <p>
        <span className={styles.prompt}>{PROMPT}</span>
        {command.slice(0, typed)}
        <span className={styles.caret}> </span>
      </p>
      <p className={styles.hint}>{t(ui.skipBoot)}</p>
    </div>
  )
}
