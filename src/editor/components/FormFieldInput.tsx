import { useEffect, useRef } from 'react'
import { useLocalized } from '@/i18n/LocaleContext'
import { ui } from '@/i18n/messages'
import type { FormField } from '../model/types'
import styles from './FormFieldInput.module.css'

interface FormFieldInputProps {
  field: FormField
  label: string
  value: string
  active: boolean
  disabled: boolean
  onFocus: (field: FormField) => void
  onChange: (field: FormField, value: string) => void
}

/** A form input disguised as a buffer line: `name    │ ...`. */
export function FormFieldInput({
  field,
  label,
  value,
  active,
  disabled,
  onFocus,
  onChange,
}: FormFieldInputProps) {
  const t = useLocalized()
  const ref = useRef<HTMLInputElement & HTMLTextAreaElement>(null)
  const id = `contact-${field}`

  useEffect(() => {
    if (active) ref.current?.focus()
  }, [active])

  const shared = {
    ref,
    id,
    name: field,
    value,
    disabled,
    placeholder: t(ui.placeholders[field]),
    className: styles.input,
    spellCheck: field === 'message',
    onFocus: () => onFocus(field),
    onChange: (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      onChange(field, event.target.value),
  }

  return (
    <span className={styles.field} data-active={active || undefined}>
      <label htmlFor={id} className={styles.label}>
        {label}
      </label>
      <span className={styles.bar} aria-hidden>
        │
      </span>
      {field === 'message' ? (
        <textarea {...shared} rows={4} maxLength={4000} />
      ) : (
        <input
          {...shared}
          type={field === 'email' ? 'email' : 'text'}
          autoComplete={field === 'email' ? 'email' : 'name'}
          maxLength={200}
        />
      )}
    </span>
  )
}
