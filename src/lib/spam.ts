import { useState } from 'react'

const KEY = 'last_form_submit'
const COOLDOWN_MS = 30_000
const MIN_FILL_MS = 1_500

/** Bot checks for public forms: hidden honeypot field, too-fast fill, and a 30s cooldown per browser. */
export function useSpamGuard() {
  const [openedAt] = useState(() => Date.now())
  const [trap, setTrap] = useState('')

  return {
    trap,
    setTrap,
    /** true = almost certainly a bot (caller should silently pretend success) */
    isBot: () => trap.length > 0 || Date.now() - openedAt < MIN_FILL_MS,
    /** true = this browser submitted very recently */
    onCooldown: () => {
      try {
        return Date.now() - Number(localStorage.getItem(KEY) || 0) < COOLDOWN_MS
      } catch {
        return false
      }
    },
    markSent: () => {
      try {
        localStorage.setItem(KEY, String(Date.now()))
      } catch {
        /* ignore */
      }
    },
  }
}
