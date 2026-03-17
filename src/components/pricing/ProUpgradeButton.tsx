'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export function ProUpgradeButton() {
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const handleClick = async () => {
    setLoading(true)
    try {
      // Check if user is logged in
      if (!supabase) { router.push('/auth/register'); return }
      const { data: { user } } = await supabase.auth.getUser()

      if (!user) {
        router.push('/auth/register')
        return
      }

      // Logged in → go directly to Stripe checkout
      const res = await fetch('/api/stripe/checkout', { method: 'POST' })
      const data = await res.json()

      if (res.status === 400 && data.error === 'Already subscribed') {
        alert('Du hast bereits ein Pro-Abo!')
        return
      }

      if (data.url) {
        window.location.href = data.url
      }
    } catch {
      alert('Fehler beim Öffnen des Checkouts. Bitte versuche es erneut.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      className="relative flex w-full items-center justify-center gap-2 rounded-xl bg-white py-3.5 text-sm font-semibold text-ink-950 transition-all hover:shadow-btn-brand hover:-translate-y-0.5 disabled:opacity-60 disabled:translate-y-0"
    >
      {loading ? (
        <><div className="h-4 w-4 animate-spin rounded-full border-2 border-ink-200 border-t-ink-800" />Einen Moment...</>
      ) : (
        'Jetzt Pro upgraden'
      )}
    </button>
  )
}
