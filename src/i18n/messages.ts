import type { Localized } from './locale'

/**
 * UI strings. The editor reducer is locale-agnostic: it emits message keys
 * and parameters, and the components translate them at render time.
 */
const messages = {
  welcome: {
    en: 'Tip: gt / gT (or click) to switch tabs · :help for everything else',
    es: 'Tip: gt / gT (o clic) para cambiar de tab · :help para todo lo demás',
  },
  fileInfo: { en: '"{0}" {1}L, {2}B', es: '"{0}" {1}L, {2}B' },
  notEditorCommand: {
    en: 'E492: Not an editor command: {0}',
    es: 'E492: No es una orden del editor: {0}',
  },
  noMatchingBuffer: {
    en: 'E94: No matching buffer for {0}',
    es: 'E94: No hay un buffer que coincida con {0}',
  },
  readonly: {
    en: "E45: 'readonly' option is set (this is a portfolio, not your dotfiles)",
    es: "E45: La opción 'readonly' está activada (es un portafolio, no tus dotfiles)",
  },
  notModifiable: {
    en: "E21: Cannot make changes, 'modifiable' is off — try contact.md",
    es: "E21: No se pueden hacer cambios, 'modifiable' está desactivado — prueba contact.md",
  },
  patternNotFound: { en: 'E486: Pattern not found: {0}', es: 'E486: Patrón no encontrado: {0}' },
  noPreviousPattern: {
    en: 'E35: No previous regular expression',
    es: 'E35: No hay una expresión regular previa',
  },
  searchWrapBottom: {
    en: 'search hit BOTTOM, continuing at TOP',
    es: 'la búsqueda llegó al FINAL, continúa desde el PRINCIPIO',
  },
  searchWrapTop: {
    en: 'search hit TOP, continuing at BOTTOM',
    es: 'la búsqueda llegó al PRINCIPIO, continúa desde el FINAL',
  },
  cannotQuit: {
    en: 'Last tab standing. Nobody really knows how to exit Vim — :e experience.md instead?',
    es: 'Es la última tab. Nadie sabe realmente cómo salir de Vim — ¿mejor :e experience.md?',
  },
  unknownOption: { en: 'E518: Unknown option: {0}', es: 'E518: Opción desconocida: {0}' },
  optionSet: { en: '{0}', es: '{0}' },
  noLink: { en: 'No link under the cursor', es: 'No hay un enlace bajo el cursor' },
  opening: { en: 'Opening {0}…', es: 'Abriendo {0}…' },
  formRequired: {
    en: 'E: {0} is required — press i to start typing',
    es: 'E: {0} es obligatorio — presiona i para escribir',
  },
  formInvalidEmail: {
    en: "E: That email doesn't look right",
    es: 'E: Ese correo no parece válido',
  },
  formSending: { en: 'Sending…', es: 'Enviando…' },
  formSent: {
    en: '"contact.md" written. Thanks! I will reply soon.',
    es: '"contact.md" escrito. ¡Gracias! Te responderé pronto.',
  },
  formMailto: {
    en: 'Opening your mail client to send the message…',
    es: 'Abriendo tu cliente de correo para enviar el mensaje…',
  },
  formError: {
    en: "E212: Can't send the message right now — write me at {0}",
    es: 'E212: No se pudo enviar el mensaje — escríbeme a {0}',
  },
} satisfies Record<string, Localized>

export type MessageKey = keyof typeof messages

export const ui = {
  fieldLabels: {
    name: { en: 'name', es: 'nombre' },
    email: { en: 'email', es: 'correo' },
    message: { en: 'message', es: 'mensaje' },
  },
  placeholders: {
    name: { en: 'Ada Lovelace', es: 'Ada Lovelace' },
    email: { en: 'ada@company.com', es: 'ada@empresa.com' },
    message: {
      en: "Hi Moisés, we're hiring a fullstack developer…",
      es: 'Hola Moisés, estamos buscando un desarrollador fullstack…',
    },
  },
  treeTitle: { en: 'Files', es: 'Archivos' },
  toggleTree: { en: 'Toggle file tree', es: 'Mostrar/ocultar archivos' },
  openCommand: { en: 'Open command line', es: 'Abrir línea de comandos' },
  closeTab: { en: 'Close tab', es: 'Cerrar tab' },
  skipBoot: { en: 'press any key to skip', es: 'presiona cualquier tecla para saltar' },
} satisfies Record<string, Localized | Record<string, Localized>>

export function translate(
  key: MessageKey,
  locale: keyof Localized,
  params: readonly (string | number)[] = [],
): string {
  return messages[key][locale].replace(/\{(\d+)\}/g, (_, index: string) =>
    String(params[Number(index)] ?? ''),
  )
}
