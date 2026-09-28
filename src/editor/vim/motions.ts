import type { Line } from '../model/types'
import type { Cursor } from './state'

/** Last valid column on a line (Vim's cursor sits on a character, never past it). */
export function maxCol(line: Line | undefined): number {
  return Math.max(0, (line?.text.length ?? 0) - 1)
}

function clampRow(lines: Line[], row: number): number {
  return Math.min(Math.max(0, row), Math.max(0, lines.length - 1))
}

/** Moves to a row keeping the wanted column, like j/k do. */
export function toRow(lines: Line[], cursor: Cursor, row: number): Cursor {
  const target = clampRow(lines, row)
  return { row: target, col: Math.min(cursor.want, maxCol(lines[target])), want: cursor.want }
}

export function toCol(lines: Line[], cursor: Cursor, col: number): Cursor {
  const target = Math.min(Math.max(0, col), maxCol(lines[cursor.row]))
  return { row: cursor.row, col: target, want: target }
}

export function lineEnd(lines: Line[], cursor: Cursor): Cursor {
  return { row: cursor.row, col: maxCol(lines[cursor.row]), want: Number.POSITIVE_INFINITY }
}

export function firstNonBlank(lines: Line[], cursor: Cursor): Cursor {
  const text = lines[cursor.row]?.text ?? ''
  const col = Math.max(0, text.search(/\S/))
  return { row: cursor.row, col, want: col }
}

type CharClass = 0 | 1 | 2 // blank, word, punctuation

function classify(char: string | undefined): CharClass {
  if (char === undefined || /\s/.test(char)) return 0
  return /[\p{L}\p{N}_]/u.test(char) ? 1 : 2
}

/** `w`: start of the next word, crossing lines. Empty lines count as words. */
export function nextWord(lines: Line[], cursor: Cursor): Cursor {
  let { row, col } = cursor
  const text = lines[row]?.text ?? ''
  const start = classify(text[col])

  if (start !== 0) while (col < text.length && classify(text[col]) === start) col++

  for (;;) {
    const current = lines[row]?.text ?? ''
    while (col < current.length && classify(current[col]) === 0) col++
    if (col < current.length) break
    if (row >= lines.length - 1) return lineEnd(lines, { row, col: 0, want: 0 })
    row++
    col = 0
    if ((lines[row]?.text ?? '') === '') break
  }

  return { row, col, want: col }
}

/** `b`: start of the previous word, crossing lines. */
export function prevWord(lines: Line[], cursor: Cursor): Cursor {
  let { row, col } = cursor
  col--

  for (;;) {
    const text = lines[row]?.text ?? ''
    while (col >= 0 && classify(text[col]) === 0) col--
    if (col >= 0) {
      const kind = classify(text[col])
      while (col > 0 && classify(text[col - 1]) === kind) col--
      return { row, col, want: col }
    }
    if (row === 0) return { row: 0, col: 0, want: 0 }
    row--
    col = (lines[row]?.text ?? '').length - 1
    if (col < 0) return { row, col: 0, want: 0 }
  }
}
