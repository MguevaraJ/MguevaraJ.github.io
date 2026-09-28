import type { Line } from '../model/types'
import type { Cursor } from './state'

/** 'smartcase': case-insensitive unless the pattern has an uppercase letter. */
function normalize(term: string, text: string): [string, string] {
  return term === term.toLowerCase() ? [term, text.toLowerCase()] : [term, text]
}

/** Start columns of every match of `term` in `text`. */
export function matchColumns(text: string, term: string): number[] {
  if (!term) return []
  const [needle, haystack] = normalize(term, text)
  const columns: number[] = []
  let index = haystack.indexOf(needle)
  while (index !== -1) {
    columns.push(index)
    index = haystack.indexOf(needle, index + needle.length)
  }
  return columns
}

export interface SearchResult {
  cursor: Cursor
  wrapped: boolean
}

/** Finds the next (or previous) match from the cursor, wrapping around like 'wrapscan'. */
export function findMatch(
  lines: Line[],
  from: Cursor,
  term: string,
  direction: 1 | -1,
): SearchResult | null {
  const total = lines.length
  if (!term || total === 0) return null

  for (let step = 0; step <= total; step++) {
    const row = (((from.row + step * direction) % total) + total) % total
    const columns = matchColumns(lines[row]?.text ?? '', term)
    const candidates = direction === 1 ? columns : [...columns].reverse()

    const col = candidates.find((c) => {
      if (step === 0) return direction === 1 ? c > from.col : c < from.col
      if (step === total) return direction === 1 ? c <= from.col : c >= from.col
      return true
    })

    if (col !== undefined) {
      const wrapped =
        direction === 1
          ? row < from.row || (row === from.row && step > 0)
          : row > from.row || (row === from.row && step > 0)
      return { cursor: { row, col, want: col }, wrapped }
    }
  }

  return null
}
