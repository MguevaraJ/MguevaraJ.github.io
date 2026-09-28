export interface ContactMessage {
  name: string
  email: string
  message: string
}

export type ContactOutcome = 'sent' | 'mailto'

const endpoint = import.meta.env.VITE_CONTACT_ENDPOINT?.trim()

/**
 * Delivers the contact form. With VITE_CONTACT_ENDPOINT set it POSTs JSON
 * (Formspree-compatible); otherwise it falls back to the visitor's mail client.
 */
export async function sendContactMessage(
  data: ContactMessage,
  fallbackEmail: string,
): Promise<ContactOutcome> {
  if (!endpoint) {
    const subject = encodeURIComponent(`Portfolio — ${data.name}`)
    const body = encodeURIComponent(`${data.message}\n\n— ${data.name} <${data.email}>`)
    window.location.href = `mailto:${fallbackEmail}?subject=${subject}&body=${body}`
    return 'mailto'
  }

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify({ ...data, _replyto: data.email, _subject: `Portfolio — ${data.name}` }),
  })
  if (!response.ok) throw new Error(`Contact endpoint answered ${response.status}`)
  return 'sent'
}
