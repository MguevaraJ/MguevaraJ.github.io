import { useEffect, type RefObject } from 'react'

/** Reports how many text rows fit in the element, so CTRL-D/CTRL-U scroll half a screen. */
export function useViewportRows(
  ref: RefObject<HTMLElement | null>,
  onResize: (rows: number) => void,
) {
  useEffect(() => {
    const element = ref.current
    if (!element) return
    const observer = new ResizeObserver(() => {
      const lineHeight = parseFloat(getComputedStyle(element).lineHeight) || 20
      onResize(Math.max(1, Math.floor(element.clientHeight / lineHeight)))
    })
    observer.observe(element)
    return () => observer.disconnect()
  }, [ref, onResize])
}
