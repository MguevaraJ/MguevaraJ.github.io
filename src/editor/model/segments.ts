import type { Token } from './types'

export interface Segment {
  /** Column where the segment starts. */
  start: number
  text: string
  kind: Token['kind']
  href?: string
  cursor?: boolean
  match?: boolean
}

/**
 * Splits a line's tokens into render segments so the block cursor and search
 * matches can be painted on exact character ranges.
 */
export function toSegments(
  tokens: Token[],
  cursorCol: number | null,
  matches: readonly number[],
  matchLength: number,
): Segment[] {
  const cuts = new Set<number>()
  if (cursorCol !== null) cuts.add(cursorCol).add(cursorCol + 1)
  for (const start of matches) cuts.add(start).add(start + matchLength)

  const inMatch = (col: number) =>
    matches.some((start) => col >= start && col < start + matchLength)
  const segments: Segment[] = []
  let offset = 0

  for (const token of tokens) {
    const end = offset + token.text.length
    const points = [
      offset,
      ...[...cuts].filter((cut) => cut > offset && cut < end).sort((a, b) => a - b),
      end,
    ]

    for (let i = 0; i < points.length - 1; i++) {
      const from = points[i] ?? 0
      const to = points[i + 1] ?? 0
      if (to <= from) continue
      segments.push({
        start: from,
        text: token.text.slice(from - offset, to - offset),
        kind: token.kind,
        href: token.href,
        cursor: cursorCol === from,
        match: inMatch(from),
      })
    }
    offset = end
  }

  return segments
}
