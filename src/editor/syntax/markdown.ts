import type { Token } from '../model/types'

// Inline markup, concealed like Vim's `conceallevel=2`: the markers disappear
// and only the styled text remains, so cursor columns match what is visible.
const INLINE = /\[([^\]]+)\]\(([^)]+)\)|\*\*([^*]+)\*\*|`([^`]+)`|_([^_]+)_|<!--(.*?)-->/g

export function highlightInline(text: string): Token[] {
  const tokens: Token[] = []
  let last = 0

  for (const match of text.matchAll(INLINE)) {
    const index = match.index
    if (index > last) tokens.push({ text: text.slice(last, index), kind: 'text' })

    const [whole, linkText, href, bold, code, italic, comment] = match
    if (linkText !== undefined) tokens.push({ text: linkText, kind: 'link', href })
    else if (bold !== undefined) tokens.push({ text: bold, kind: 'bold' })
    else if (code !== undefined) tokens.push({ text: code, kind: 'code' })
    else if (italic !== undefined) tokens.push({ text: italic, kind: 'italic' })
    else if (comment !== undefined) tokens.push({ text: whole, kind: 'comment' })

    last = index + whole.length
  }

  if (last < text.length) tokens.push({ text: text.slice(last), kind: 'text' })
  return tokens
}

export function highlightMarkdown(line: string): Token[] {
  const heading = /^(#{1,6}) (.*)$/.exec(line)
  if (heading) {
    const [, hashes = '#', rest = ''] = heading
    return [
      { text: `${hashes} `, kind: 'muted' },
      { text: rest, kind: hashes.length === 1 ? 'title' : 'heading' },
    ]
  }

  if (/^-{3,}$/.test(line)) return [{ text: line, kind: 'rule' }]

  const quote = /^> (.*)$/.exec(line)
  if (quote) {
    return [{ text: '> ', kind: 'muted' }, ...highlightInline(quote[1] ?? '').map(asQuote)]
  }

  const bullet = /^(\s*)([-*]|\d+\.) (.*)$/.exec(line)
  if (bullet) {
    const [, indent = '', marker = '-', rest = ''] = bullet
    return [
      ...(indent ? [{ text: indent, kind: 'text' as const }] : []),
      { text: `${marker} `, kind: 'bullet' },
      ...highlightInline(rest),
    ]
  }

  return highlightInline(line)
}

function asQuote(token: Token): Token {
  return token.kind === 'text' ? { ...token, kind: 'quote' } : token
}
