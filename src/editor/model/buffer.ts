import { highlightHelp } from '../syntax/help'
import { highlightMarkdown } from '../syntax/markdown'
import { highlightTypeScript } from '../syntax/typescript'
import type { Buffer, BufferSource, Filetype, Line, SourceLine, Token } from './types'

const HIGHLIGHTERS: Record<Filetype, (line: string) => Token[]> = {
  markdown: highlightMarkdown,
  form: highlightMarkdown,
  typescript: highlightTypeScript,
  help: highlightHelp,
}

/** Lines starting with this marker render as ASCII art (kept on one row, scaled on small screens). */
export const ART_MARKER = '\u0000art:'

export function toLine(source: SourceLine, filetype: Filetype): Line {
  if (typeof source !== 'string') {
    return {
      text: source.label,
      tokens: [{ text: source.label, kind: 'property' }],
      field: source.field,
    }
  }
  if (source.startsWith(ART_MARKER)) {
    const text = source.slice(ART_MARKER.length)
    return { text, tokens: [{ text, kind: 'art' }] }
  }
  const tokens = HIGHLIGHTERS[filetype](source)
  return { text: tokens.map((token) => token.text).join(''), tokens }
}

export function createBuffer(source: BufferSource): Buffer {
  return {
    id: source.id,
    name: source.name,
    filetype: source.filetype,
    lines: source.lines.map((line) => toLine(line, source.filetype)),
  }
}

/** Size in bytes as Vim reports it on open: `"file" 12L, 340B`. */
export function byteSize(buffer: Buffer): number {
  const encoder = new TextEncoder()
  return buffer.lines.reduce((total, line) => total + encoder.encode(line.text).length + 1, 0)
}

export function linkAt(line: Line, col: number): string | undefined {
  let offset = 0
  for (const token of line.tokens) {
    const end = offset + token.text.length
    if (token.href && col >= offset && col < end) return token.href
    offset = end
  }
  return undefined
}

/** The link under the cursor, or the first link on the line (like `gx` on a line with one URL). */
export function findLink(line: Line, col: number): string | undefined {
  return linkAt(line, col) ?? line.tokens.find((token) => token.href)?.href
}
