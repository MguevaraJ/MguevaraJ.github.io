import type { Token } from '../model/types'

// Vim help syntax: *tags*, |links|, <keys>/CTRL-X, section rules and
// headlines ending in "~" (the "~" is concealed, as Vim does).
const INLINE = /\*([\w.-]+)\*|\|([\w.-]+)\||(<[\w-]+>|CTRL-\w|\{[\w-]+\})|(:[a-z][\w=!.-]*)/g

export function highlightHelp(line: string): Token[] {
  if (/^[=-]{10,}$/.test(line)) return [{ text: line, kind: 'rule' }]
  if (line.endsWith(' ~')) return [{ text: line.slice(0, -2), kind: 'heading' }]
  if (line.startsWith('vim:')) return [{ text: line, kind: 'comment' }]

  const tokens: Token[] = []
  let last = 0

  for (const match of line.matchAll(INLINE)) {
    const index = match.index
    if (index > last) tokens.push({ text: line.slice(last, index), kind: 'text' })

    const [whole, tag, link, key, command] = match
    if (tag !== undefined) tokens.push({ text: tag, kind: 'tag' })
    else if (link !== undefined) tokens.push({ text: link, kind: 'link', href: `buffer:${link}` })
    else if (key !== undefined) tokens.push({ text: key, kind: 'special' })
    else if (command !== undefined) tokens.push({ text: command, kind: 'keyword' })

    last = index + whole.length
  }

  if (last < line.length) tokens.push({ text: line.slice(last), kind: 'text' })
  return tokens
}
