import { profile } from '@/content/profile'
import { ART_MARKER } from '@/editor/model/buffer'
import type { BufferSource } from '@/editor/model/types'
import type { Locale } from '@/i18n/locale'

const BANNER = [
  '                    _',
  '   ____ ___  ____  (_)_______  _____',
  '  / __ `__ \\/ __ \\/ / ___/ _ \\/ ___/',
  ' / / / / / / /_/ / (__  )  __(__  )',
  '/_/ /_/ /_/\\____/_/____/\\___/____/',
]

const copy = {
  en: {
    about: 'About',
    bring: 'What I bring',
    explore: 'Explore',
    links: 'Links',
    languages: 'Languages',
    education: 'Education',
    files: {
      experience: "where I've worked and what I shipped",
      projects: 'case studies: challenge → approach → outcome',
      stack: 'the technologies I use',
      contact: 'send me a message right from here',
      cv: 'download my résumé (PDF)',
    },
    hint: 'New to Vim? Click the tabs above, or type :help',
  },
  es: {
    about: 'Sobre mí',
    bring: 'Lo que aporto',
    explore: 'Explorar',
    links: 'Enlaces',
    languages: 'Idiomas',
    education: 'Educación',
    files: {
      experience: 'dónde he trabajado y qué entregué',
      projects: 'casos de estudio: reto → enfoque → resultado',
      stack: 'las tecnologías que uso',
      contact: 'envíame un mensaje desde aquí mismo',
      cv: 'descarga mi CV (PDF)',
    },
    hint: '¿No conoces Vim? Haz clic en las tabs de arriba, o escribe :help',
  },
} satisfies Record<Locale, unknown>

export function readme(locale: Locale): BufferSource {
  const t = copy[locale]
  const { links, education } = profile

  return {
    id: 'readme',
    name: 'README.md',
    filetype: 'markdown',
    lines: [
      ...BANNER.map((line) => ART_MARKER + line),
      '',
      `# ${profile.name}`,
      `> ${profile.role[locale]} — ${profile.headline}`,
      '',
      `**${profile.location[locale]}**`,
      `_${profile.availability[locale]}_`,
      '',
      `## ${t.about}`,
      '',
      ...profile.summary[locale].flatMap((paragraph) => [paragraph, '']),
      `## ${t.bring}`,
      '',
      ...profile.strengths[locale].map((item) => `- ${item}`),
      '',
      `## ${t.explore}`,
      '',
      `- [experience.md](buffer:experience)  ${t.files.experience}`,
      `- [projects.md](buffer:projects)    ${t.files.projects}`,
      `- [stack.ts](buffer:stack)       ${t.files.stack}`,
      `- [contact.md](buffer:contact)     ${t.files.contact}`,
      `- [cv.pdf](buffer:cv)         ${t.files.cv}`,
      '',
      `## ${t.links}`,
      '',
      `- GitHub    [${links.github.label}](${links.github.href})`,
      `- LinkedIn  [${links.linkedin.label}](${links.linkedin.href})`,
      `- Email     [${profile.email}](mailto:${profile.email})`,
      '',
      `## ${t.languages}`,
      '',
      ...profile.languages.map((lang) => `- ${lang.name[locale]} — ${lang.level[locale]}`),
      ...(education
        ? [
            '',
            `## ${t.education}`,
            '',
            `- ${education.degree[locale]} — ${education.institution} (${education.year})`,
          ]
        : []),
      '',
      `<!-- ${t.hint} -->`,
    ],
  }
}
