import { normalizeKey } from './useKeyboard'

const event = (
  key: string,
  mods: Partial<Record<'ctrlKey' | 'metaKey' | 'altKey', boolean>> = {},
) => ({
  key,
  ctrlKey: false,
  metaKey: false,
  altKey: false,
  ...mods,
})

describe('normalizeKey', () => {
  it('maps named keys to Vim notation', () => {
    expect(normalizeKey(event('Escape'))).toBe('<Esc>')
    expect(normalizeKey(event('Enter'))).toBe('<CR>')
    expect(normalizeKey(event(' '))).toBe('<Space>')
    expect(normalizeKey(event('G'))).toBe('G')
  })

  it('only takes over the Ctrl chords it uses', () => {
    expect(normalizeKey(event('d', { ctrlKey: true }))).toBe('<C-d>')
    expect(normalizeKey(event('f', { ctrlKey: true }))).toBeNull()
    expect(normalizeKey(event('c', { metaKey: true }))).toBeNull()
    expect(normalizeKey(event('Shift'))).toBeNull()
  })
})
