import type { Localized } from '@/i18n/locale'

export interface Link {
  label: string
  href: string
}

export interface Language {
  name: Localized
  level: Localized
}

export interface Education {
  degree: Localized
  institution: string
  year: string
}

export interface Profile {
  name: string
  role: Localized
  headline: string
  location: Localized
  availability: Localized
  summary: Localized<string[]>
  strengths: Localized<string[]>
  email: string
  links: {
    github: Link
    linkedin: Link
    /** Public repository of this site, shown in projects.md. */
    source?: Link
  }
  languages: Language[]
  education?: Education
  cv: Localized
}

export interface Job {
  id: string
  role: Localized
  company: string
  client?: string
  /** e.g. "03/2023 – Present". Hidden when missing, never rendered as a placeholder. */
  period?: Localized
  stack: string[]
  highlights: Localized<string[]>
}

export interface Project {
  id: string
  name: Localized
  context: Localized
  challenge: Localized
  approach: Localized<string[]>
  outcome: Localized<string[]>
  stack: string[]
  links?: Link[]
}

export interface SkillGroup {
  /** Identifier used as the object key in stack.ts. */
  key: string
  comment: Localized
  items: string[]
}
