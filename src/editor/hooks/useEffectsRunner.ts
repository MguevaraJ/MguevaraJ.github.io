import { useEffect, type Dispatch } from 'react'
import { profile } from '@/content/profile'
import type { Locale } from '@/i18n/locale'
import { sendContactMessage } from '@/services/contact'
import type { Action } from '../vim/reducer'
import type { Effect } from '../vim/state'

function openUrl(href: string) {
  if (href.startsWith('mailto:')) window.location.href = href
  else window.open(href, '_blank', 'noopener,noreferrer')
}

/** Executes the side effects queued by the reducer, then clears the queue. */
export function useEffectsRunner(
  effects: Effect[],
  dispatch: Dispatch<Action>,
  onLocaleChange: (locale: Locale) => void,
) {
  useEffect(() => {
    if (effects.length === 0) return
    dispatch({ type: 'effects/flush' })

    for (const effect of effects) {
      switch (effect.type) {
        case 'openUrl':
          openUrl(effect.href)
          break
        case 'setLocale':
          onLocaleChange(effect.locale)
          break
        case 'submitContact':
          sendContactMessage(effect.values, profile.email)
            .then((outcome) =>
              dispatch({ type: 'form/result', outcome, contactEmail: profile.email }),
            )
            .catch(() =>
              dispatch({ type: 'form/result', outcome: 'error', contactEmail: profile.email }),
            )
          break
      }
    }
  }, [effects, dispatch, onLocaleChange])
}
