import { experience as jobs } from '@/content/experience'
import type { BufferSource } from '@/editor/model/types'
import type { Locale } from '@/i18n/locale'

const copy = {
  en: { title: 'Experience', stack: 'Stack' },
  es: { title: 'Experiencia', stack: 'Stack' },
} satisfies Record<Locale, unknown>

export function experience(locale: Locale): BufferSource {
  const t = copy[locale]

  return {
    id: 'experience',
    name: 'experience.md',
    filetype: 'markdown',
    lines: [
      `# ${t.title}`,
      '',
      ...jobs.flatMap((job) => [
        `## ${job.role[locale]} @ ${job.client ? `${job.company} · ${job.client}` : job.company}`,
        ...(job.period ? [`_${job.period[locale]}_`] : []),
        '',
        ...job.highlights[locale].map((item) => `- ${item}`),
        '',
        `**${t.stack}:** ${job.stack.map((tech) => `\`${tech}\``).join(' ')}`,
        '',
        '---',
        '',
      ]),
    ].slice(0, -2),
  }
}
