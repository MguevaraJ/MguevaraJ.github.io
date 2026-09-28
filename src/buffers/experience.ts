import { experience as jobs } from '@/content/experience'
import type { BufferSource } from '@/editor/model/types'
import type { Locale } from '@/i18n/locale'

const copy = {
  en: { title: 'Experience', client: 'client', stack: 'Stack' },
  es: { title: 'Experiencia', client: 'cliente', stack: 'Stack' },
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
        `## ${job.role[locale]} @ ${job.company}`,
        ...(job.client ? [`> ${t.client}: **${job.client}**`] : []),
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
