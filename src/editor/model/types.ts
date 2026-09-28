export type TokenKind =
  | 'text'
  | 'title'
  | 'heading'
  | 'bold'
  | 'italic'
  | 'code'
  | 'link'
  | 'bullet'
  | 'quote'
  | 'rule'
  | 'comment'
  | 'keyword'
  | 'string'
  | 'property'
  | 'number'
  | 'punctuation'
  | 'type'
  | 'tag'
  | 'special'
  | 'art'
  | 'muted'

export interface Token {
  text: string
  kind: TokenKind
  /**
   * Link target. Supported schemes:
   * - `buffer:<id>`  opens another buffer
   * - `action:<name>` triggers an editor action (e.g. submitting the form)
   * - anything else is treated as a URL (http, mailto, a file to download…)
   */
  href?: string
}

export type FormField = 'name' | 'email' | 'message'

export interface Line {
  /** Visible text (concealed markup removed); the cursor moves over this. */
  text: string
  tokens: Token[]
  /** Present on lines that render a form input instead of text. */
  field?: FormField
}

export type Filetype = 'markdown' | 'typescript' | 'help' | 'form'

export interface Buffer {
  id: string
  name: string
  filetype: Filetype
  lines: Line[]
}

/** A buffer as authored: raw source lines, highlighted later by filetype. */
export type SourceLine = string | { field: FormField; label: string }

export interface BufferSource {
  id: string
  name: string
  filetype: Filetype
  lines: SourceLine[]
}
