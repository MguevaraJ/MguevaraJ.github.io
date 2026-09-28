import { toLine } from '../model/buffer'
import { nextWord, prevWord } from './motions'

const lines = ['const stack = {', '', '  backend: [1]'].map((l) => toLine(l, 'typescript'))

describe('word motions', () => {
  it('w jumps between words and punctuation, stopping on empty lines', () => {
    let c = { row: 0, col: 0, want: 0 }
    const stops: string[] = []
    for (let i = 0; i < 6; i++) {
      c = nextWord(lines, c)
      stops.push(`${c.row}:${c.col}`)
    }
    expect(stops).toEqual(['0:6', '0:12', '0:14', '1:0', '2:2', '2:9'])
  })

  it('b goes back to the start of the previous word', () => {
    expect(prevWord(lines, { row: 2, col: 2, want: 2 })).toMatchObject({ row: 1, col: 0 })
    expect(prevWord(lines, { row: 0, col: 12, want: 12 })).toMatchObject({ row: 0, col: 6 })
  })
})
