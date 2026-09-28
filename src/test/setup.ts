import '@testing-library/jest-dom/vitest'

// jsdom lacks these layout APIs; the editor only needs them to exist.
class ResizeObserverStub {
  observe() {}
  unobserve() {}
  disconnect() {}
}
globalThis.ResizeObserver ??= ResizeObserverStub as unknown as typeof ResizeObserver
Element.prototype.scrollIntoView ??= () => {}
Element.prototype.scrollTo ??= () => {}
