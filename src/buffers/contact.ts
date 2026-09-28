import { profile } from '@/content/profile'
import type { BufferSource } from '@/editor/model/types'
import type { Locale } from '@/i18n/locale'
import { ui } from '@/i18n/messages'

const copy = {
  en: {
    title: 'Contact',
    intro: 'Got a role, a project or a question? Leave a message and I will get back to you.',
    how: 'Click a field (or press `i`) to type · `<Esc>` to stop · `:w` to send',
    send: ':w  send message',
    direct: 'Prefer email?',
  },
  es: {
    title: 'Contacto',
    intro: '¿Tienes un puesto, un proyecto o una pregunta? Déjame un mensaje y te respondo.',
    how: 'Haz clic en un campo (o presiona `i`) para escribir · `<Esc>` para parar · `:w` para enviar',
    send: ':w  enviar mensaje',
    direct: '¿Prefieres el correo?',
  },
} satisfies Record<Locale, unknown>

export function contact(locale: Locale): BufferSource {
  const t = copy[locale]
  const label = (field: keyof typeof ui.fieldLabels) => ui.fieldLabels[field][locale].padEnd(8)

  return {
    id: 'contact',
    name: 'contact.md',
    filetype: 'form',
    lines: [
      `# ${t.title}`,
      '',
      t.intro,
      '',
      `> ${t.how}`,
      '',
      { field: 'name', label: label('name') },
      { field: 'email', label: label('email') },
      { field: 'message', label: label('message') },
      '',
      `→ [${t.send}](action:submit)`,
      '',
      `${t.direct} [${profile.email}](mailto:${profile.email})`,
    ],
  }
}
