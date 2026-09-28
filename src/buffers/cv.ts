import { profile } from '@/content/profile'
import type { BufferSource } from '@/editor/model/types'
import type { Locale } from '@/i18n/locale'

const copy = {
  en: {
    binary: 'This is a binary file. Vim would show you gibberish — here are the readable versions:',
    en: 'Download CV — English (PDF)',
    es: 'Descargar CV — Español (PDF)',
    tip: 'Tip: move the cursor to a line and press <Enter>.',
  },
  es: {
    binary:
      'Es un archivo binario. Vim te mostraría caracteres raros — aquí tienes las versiones legibles:',
    en: 'Download CV — English (PDF)',
    es: 'Descargar CV — Español (PDF)',
    tip: 'Tip: mueve el cursor a una línea y presiona <Enter>.',
  },
} satisfies Record<Locale, unknown>

export function cv(locale: Locale): BufferSource {
  const t = copy[locale]
  return {
    id: 'cv',
    name: 'cv.pdf',
    filetype: 'markdown',
    lines: [
      '<!-- %PDF-1.7 %âãÏÓ 1 0 obj <</Type/Catalog/Pages 2 0 R>> endobj ^@^@^@ -->',
      '<!-- stream x^\\ìýÙ²\\çÖ^_ö^Hj^?~ô¿þ^D^Q ... [binary] -->',
      '',
      t.binary,
      '',
      `- [${t.en}](${profile.cv.en})`,
      `- [${t.es}](${profile.cv.es})`,
      '',
      `_${t.tip}_`,
    ],
  }
}
