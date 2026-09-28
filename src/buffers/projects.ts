import { projects as items } from '@/content/projects'
import type { BufferSource } from '@/editor/model/types'
import type { Locale } from '@/i18n/locale'

const copy = {
  en: {
    title: 'Projects',
    intro: 'Selected work. Client code is private, so these are told as case studies.',
    challenge: 'Challenge',
    approach: 'Approach',
    outcome: 'Outcome',
    stack: 'Stack',
  },
  es: {
    title: 'Proyectos',
    intro:
      'Trabajo seleccionado. El código de clientes es privado, así que los cuento como casos de estudio.',
    challenge: 'Reto',
    approach: 'Enfoque',
    outcome: 'Resultado',
    stack: 'Stack',
  },
} satisfies Record<Locale, unknown>

export function projects(locale: Locale): BufferSource {
  const t = copy[locale]

  return {
    id: 'projects',
    name: 'projects.md',
    filetype: 'markdown',
    lines: [
      `# ${t.title}`,
      '',
      `_${t.intro}_`,
      '',
      ...items.flatMap((project, index) => [
        `## ${index + 1}. ${project.name[locale]}`,
        `> ${project.context[locale]}`,
        '',
        `**${t.challenge}** — ${project.challenge[locale]}`,
        '',
        `**${t.approach}**`,
        ...project.approach[locale].map((item) => `- ${item}`),
        '',
        `**${t.outcome}**`,
        ...project.outcome[locale].map((item) => `- ${item}`),
        '',
        `**${t.stack}:** ${project.stack.map((tech) => `\`${tech}\``).join(' ')}`,
        ...(project.links ?? []).map((link) => `→ [${link.label}](${link.href})`),
        '',
        '---',
        '',
      ]),
    ].slice(0, -2),
  }
}
