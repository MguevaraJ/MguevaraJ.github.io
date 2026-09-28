interface CaretPosition {
  offsetNode: Node
  offset: number
}

type CaretDocument = Document & {
  caretPositionFromPoint?: (x: number, y: number) => CaretPosition | null
  caretRangeFromPoint?: (x: number, y: number) => Range | null
}

/** Character column under a click, using the `data-col` offsets on rendered segments. */
export function columnFromPoint(x: number, y: number): number | undefined {
  const doc = document as CaretDocument
  let node: Node | undefined
  let offset = 0

  const position = doc.caretPositionFromPoint?.(x, y)
  if (position) {
    node = position.offsetNode
    offset = position.offset
  } else {
    const range = doc.caretRangeFromPoint?.(x, y)
    if (range) {
      node = range.startContainer
      offset = range.startOffset
    }
  }

  const element = node instanceof Element ? node : node?.parentElement
  const segment = element?.closest<HTMLElement>('[data-col]')
  if (!segment) return undefined
  return Number(segment.dataset.col) + (node instanceof Text ? offset : 0)
}
