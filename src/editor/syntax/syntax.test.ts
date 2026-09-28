import { highlightHelp } from './help'
import { highlightMarkdown } from './markdown'
import { highlightTypeScript } from './typescript'

const text = (tokens: { text: string }[]) => tokens.map((t) => t.text).join('')

describe('markdown', () => {
  it('conceals link markup and keeps the target', () => {
    const tokens = highlightMarkdown('see [experience.md](buffer:experience) now')
    expect(text(tokens)).toBe('see experience.md now')
    expect(tokens[1]).toEqual({ text: 'experience.md', kind: 'link', href: 'buffer:experience' })
  })

  it('distinguishes the title from other headings', () => {
    expect(highlightMarkdown('# Title')[1]?.kind).toBe('title')
    expect(highlightMarkdown('## Section')[1]?.kind).toBe('heading')
  })

  it('highlights bullets, bold and inline code', () => {
    const tokens = highlightMarkdown('- **Stack:** `NestJS`')
    expect(tokens.map((t) => t.kind)).toEqual(['bullet', 'bold', 'text', 'code'])
    expect(text(tokens)).toBe('- Stack: NestJS')
  })
})

describe('typescript', () => {
  it('classifies keywords, properties, strings and comments', () => {
    const tokens = highlightTypeScript("  backend: ['NestJS'], // core")
    const kinds = Object.fromEntries(tokens.map((t) => [t.text.trim(), t.kind]))
    expect(kinds.backend).toBe('property')
    expect(kinds["'NestJS'"]).toBe('string')
    expect(kinds['// core']).toBe('comment')
    expect(highlightTypeScript('export const x')[0]).toEqual({ text: 'export', kind: 'keyword' })
  })

  it('never loses characters', () => {
    const line = '} satisfies Record<string, readonly string[]> // ok'
    expect(text(highlightTypeScript(line))).toBe(line)
  })
})

describe('vim help', () => {
  it('turns |links| into buffer links and *tags* into tags', () => {
    const tokens = highlightHelp('*help.txt* go to |experience|')
    expect(tokens[0]).toEqual({ text: 'help.txt', kind: 'tag' })
    expect(tokens.at(-1)).toEqual({ text: 'experience', kind: 'link', href: 'buffer:experience' })
  })
})
