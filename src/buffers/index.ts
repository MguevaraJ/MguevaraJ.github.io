import { createBuffer } from '@/editor/model/buffer'
import type { Buffer, BufferSource } from '@/editor/model/types'
import { profile } from '@/content/profile'
import type { Locale } from '@/i18n/locale'
import { contact } from './contact'
import { cv } from './cv'
import { experience } from './experience'
import { help } from './help'
import { projects } from './projects'
import { readme } from './readme'
import { stack } from './stack'

/**
 * Every file in the portfolio, in tab order. To add a section, write a
 * builder that returns a BufferSource and register it here.
 */
const BUILDERS: ((locale: Locale) => BufferSource)[] = [
  readme,
  experience,
  projects,
  stack,
  contact,
  cv,
  help,
]

/** Buffers opened as tabs on startup (`nvim -p ...`). help.txt opens on demand. */
export const STARTUP_TABS = ['readme', 'experience', 'projects', 'stack', 'contact', 'cv']

export interface Workspace {
  buffers: Record<string, Buffer>
  /** File order, used by the tree and for :e completion. */
  order: string[]
  /** Ex commands that jump straight to a link, e.g. `:github`. */
  shortcuts: Record<string, string>
}

const SHORTCUTS: Record<string, string> = {
  contact: 'buffer:contact',
  cv: 'buffer:cv',
  resume: 'buffer:cv',
  github: profile.links.github.href,
  linkedin: profile.links.linkedin.href,
  email: `mailto:${profile.email}`,
  mail: `mailto:${profile.email}`,
}

export function buildWorkspace(locale: Locale): Workspace {
  const buffers = BUILDERS.map((build) => createBuffer(build(locale)))
  return {
    buffers: Object.fromEntries(buffers.map((buffer) => [buffer.id, buffer])),
    order: buffers.map((buffer) => buffer.id),
    shortcuts: SHORTCUTS,
  }
}
