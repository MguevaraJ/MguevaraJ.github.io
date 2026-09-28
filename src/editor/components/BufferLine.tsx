import { memo, type MouseEvent } from 'react'
import { toSegments } from '../model/segments'
import type { Line } from '../model/types'
import { hrefForBuffer } from '../hooks/useHashRoute'
import styles from './BufferLine.module.css'

export interface BufferLineProps {
  line: Line
  row: number
  number: number | null
  isCursorLine: boolean
  /** Column of the block cursor, or null when the cursor is not drawn on this line. */
  cursorCol: number | null
  matches: readonly number[]
  matchLength: number
  onFollow: (href: string) => void
  children?: React.ReactNode
}

const isInternal = (href: string) => href.startsWith('buffer:') || href.startsWith('action:')

function linkProps(href: string, onFollow: (href: string) => void) {
  if (isInternal(href)) {
    return {
      href: href.startsWith('buffer:') ? hrefForBuffer(href.slice('buffer:'.length)) : '#',
      onClick: (event: MouseEvent) => {
        event.preventDefault()
        onFollow(href)
      },
    }
  }
  const external = /^https?:/.test(href)
  return {
    href,
    ...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {}),
    ...(href.endsWith('.pdf') ? { download: true } : {}),
  }
}

function BufferLineComponent({
  line,
  row,
  number,
  isCursorLine,
  cursorCol,
  matches,
  matchLength,
  onFollow,
  children,
}: BufferLineProps) {
  const segments = toSegments(line.tokens, cursorCol, matches, matchLength)
  const cursorPastEnd = cursorCol !== null && cursorCol >= line.text.length
  return (
    <div
      className={styles.line}
      data-row={row}
      data-cursorline={isCursorLine || undefined}
      data-art={line.tokens[0]?.kind === 'art' || undefined}
    >
      {number !== null && (
        <span className={styles.gutter} aria-hidden>
          {number}
        </span>
      )}
      <span className={styles.content}>
        {line.field
          ? children
          : segments.map((segment, index) => {
              const className = [
                styles[segment.kind],
                segment.match && styles.match,
                segment.cursor && styles.cursor,
              ]
                .filter(Boolean)
                .join(' ')

              return segment.href ? (
                <a
                  key={index}
                  className={className}
                  data-col={segment.start}
                  {...linkProps(segment.href, onFollow)}
                >
                  {segment.text}
                </a>
              ) : (
                <span key={index} className={className} data-col={segment.start}>
                  {segment.text}
                </span>
              )
            })}
        {!line.field && cursorPastEnd && <span className={styles.cursor}> </span>}
      </span>
    </div>
  )
}

export const BufferLine = memo(BufferLineComponent)
