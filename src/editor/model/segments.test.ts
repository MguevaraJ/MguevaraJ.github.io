import { toSegments } from './segments'

describe('toSegments', () => {
  const tokens = [
    { text: 'hello ', kind: 'text' as const },
    { text: 'world', kind: 'link' as const, href: 'https://x.dev' },
  ]

  it('isolates the cursor character', () => {
    const segments = toSegments(tokens, 7, [], 0)
    expect(segments.map((s) => s.text)).toEqual(['hello ', 'w', 'o', 'rld'])
    expect(segments.find((s) => s.cursor)?.text).toBe('o')
    expect(segments[2]?.href).toBe('https://x.dev')
  })

  it('marks search matches across token boundaries', () => {
    const segments = toSegments(tokens, null, [4], 4)
    expect(
      segments
        .filter((s) => s.match)
        .map((s) => s.text)
        .join(''),
    ).toBe('o wo')
    expect(segments.map((s) => s.start)).toEqual([0, 4, 6, 8])
  })
})
