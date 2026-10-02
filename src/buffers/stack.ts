import { coreComment, coreSkills, skillGroups } from '@/content/skills'
import type { BufferSource } from '@/editor/model/types'
import type { Locale } from '@/i18n/locale'

const copy = {
  en: [
    '// stack.ts — the tools I reach for, grouped by layer.',
    '// Things I have actually built with, in production systems and my own projects.',
  ],
  es: [
    '// stack.ts — las herramientas que uso, agrupadas por capa.',
    '// Cosas con las que de verdad he construido, en sistemas en producción y proyectos propios.',
  ],
} satisfies Record<Locale, string[]>

const WIDTH = 72

/** Formats a string array the way Prettier would, wrapping at WIDTH. */
function formatArray(items: string[], indent: string): string[] {
  const quoted = items.map((item) => `'${item}'`)
  const lines: string[] = []
  let current = ''
  for (const item of quoted) {
    const next = current ? `${current} ${item},` : `${item},`
    if (indent.length + next.length > WIDTH && current) {
      lines.push(indent + current)
      current = `${item},`
    } else {
      current = next
    }
  }
  if (current) lines.push(indent + current)
  return lines
}

export function stack(locale: Locale): BufferSource {
  return {
    id: 'stack',
    name: 'stack.ts',
    filetype: 'typescript',
    lines: [
      ...copy[locale],
      '',
      `// ${coreComment[locale]}`,
      'export const core = [',
      ...formatArray(coreSkills, '  '),
      '] as const',
      '',
      'export const stack = {',
      ...skillGroups.flatMap((group, index) => [
        ...(index > 0 ? [''] : []),
        `  // ${group.comment[locale]}`,
        `  ${group.key}: [`,
        ...formatArray(group.items, '    '),
        '  ],',
      ]),
      '} satisfies Record<string, readonly string[]>',
    ],
  }
}
