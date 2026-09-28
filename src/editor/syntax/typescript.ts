import type { Token, TokenKind } from '../model/types'

const KEYWORDS = new Set([
  'as',
  'const',
  'export',
  'from',
  'import',
  'interface',
  'let',
  'readonly',
  'return',
  'satisfies',
  'type',
])

const TYPES = new Set(['Record', 'string', 'number', 'boolean', 'readonly'])

// Order matters: comments and strings must win over everything inside them.
const RULES: [RegExp, TokenKind | 'word'][] = [
  [/^\/\/.*/, 'comment'],
  [/^'(?:[^'\\]|\\.)*'/, 'string'],
  [/^"(?:[^"\\]|\\.)*"/, 'string'],
  [/^`(?:[^`\\]|\\.)*`/, 'string'],
  [/^\d+(?:\.\d+)?/, 'number'],
  [/^[A-Za-z_$][\w$]*(?=\s*:)/, 'property'],
  [/^[A-Za-z_$][\w$]*/, 'word'],
  [/^\s+/, 'text'],
  [/^[{}[\]().,;:=<>|&?!+\-*/]/, 'punctuation'],
]

export function highlightTypeScript(line: string): Token[] {
  const tokens: Token[] = []
  let rest = line

  while (rest.length > 0) {
    let matched = false
    for (const [pattern, kind] of RULES) {
      const match = pattern.exec(rest)
      if (!match) continue
      const text = match[0]
      push(tokens, text, kind === 'word' ? classifyWord(text) : kind)
      rest = rest.slice(text.length)
      matched = true
      break
    }
    if (!matched) {
      push(tokens, rest[0] ?? '', 'text')
      rest = rest.slice(1)
    }
  }

  return tokens
}

function classifyWord(word: string): TokenKind {
  if (KEYWORDS.has(word)) return 'keyword'
  if (TYPES.has(word)) return 'type'
  return 'text'
}

/** Appends a token, merging it with the previous one when the kind matches. */
function push(tokens: Token[], text: string, kind: TokenKind) {
  const previous = tokens.at(-1)
  if (previous && previous.kind === kind && !previous.href) previous.text += text
  else tokens.push({ text, kind })
}
