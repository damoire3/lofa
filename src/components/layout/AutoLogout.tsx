'use client'

import { useEffect, useRef } from 'react'
import { signOut } from 'next-auth/react'

const TIMEOUT_MS = 30 * 60 * 1000 // 30 minutes

export default function AutoLogout() {
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  const resetTimer = () => {
    if (timerRef.current) clearTimeout(timerRef.current)
    timerRef.current = setTimeout(() => {
      signOut({ callbackUrl: '/login?reason=timeout' })
    }, TIMEOUT_MS)
  }

  useEffect(() => {
    // Événements qui réinitialisent le timer
    const events = ['mousedown', 'mousemove', 'keydown', 'scroll', 'touchstart', 'click']

    events.forEach((e) => window.addEventListener(e, resetTimer, { passive: true }))
    resetTimer() // Démarre le timer dès le montage

    return () => {
      events.forEach((e) => window.removeEventListener(e, resetTimer))
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [])

  return null // Composant invisible
}