'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { TrendingUp, Eye, EyeOff, Chrome, ArrowRight } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

export default function LoginPage() {
  const router = useRouter()
  const supabase = createClient()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!supabase) { setError('Auth not configured yet.'); return }
    setIsLoading(true)
    setError(null)
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) { setError(error.message); setIsLoading(false); return }
    router.push('/analyze')
    router.refresh()
  }

  const handleGoogleLogin = async () => {
    if (!supabase) { setError('Auth not configured yet.'); return }
    setIsLoading(true)
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/api/auth/callback` },
    })
    if (error) { setError(error.message); setIsLoading(false) }
  }

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-ink-950 px-4 pt-[60px]">

      {/* Background */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_40%_at_50%_0%,rgba(59,130,246,0.10),transparent)]" />
        <div
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage:
              'linear-gradient(rgba(255,255,255,0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.8) 1px, transparent 1px)',
            backgroundSize: '48px 48px',
          }}
        />
      </div>

      <div className="relative w-full max-w-[380px]">

        {/* Logo + heading */}
        <div className="mb-8 flex flex-col items-center text-center">
          <Link href="/" className="mb-5 flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-500 to-brand-700 shadow-[0_0_0_1px_rgba(255,255,255,0.12),0_4px_16px_rgba(59,130,246,0.4)]">
            <TrendingUp className="h-5 w-5 text-white" />
          </Link>
          <h1 className="text-2xl font-black tracking-tight text-white">Willkommen zurück</h1>
          <p className="mt-1.5 text-sm text-white/35">Melde dich bei PropAnalyzer an</p>
        </div>

        {/* Card */}
        <div className="overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.04] backdrop-blur-sm">
          <div className="p-7">

            {/* Google */}
            <button
              onClick={handleGoogleLogin}
              disabled={isLoading}
              className="mb-5 flex w-full items-center justify-center gap-2.5 rounded-xl border border-white/[0.10] bg-white/[0.06] py-3 text-sm font-medium text-white/70 transition-all hover:bg-white/[0.10] hover:text-white hover:border-white/[0.18] disabled:opacity-40"
            >
              <Chrome className="h-4 w-4" />
              Mit Google anmelden
            </button>

            {/* Divider */}
            <div className="relative mb-5">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/[0.06]" />
              </div>
              <div className="relative flex justify-center">
                <span className="bg-transparent px-3 text-[11px] text-white/25">oder per E-Mail</span>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleEmailLogin} className="space-y-4">
              <div>
                <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wider text-white/30">
                  E-Mail-Adresse
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="deine@email.de"
                  className="w-full rounded-xl border border-white/[0.08] bg-white/[0.05] px-4 py-3 text-sm text-white placeholder-white/20 outline-none transition-all focus:border-brand-500/50 focus:bg-white/[0.08] focus:ring-1 focus:ring-brand-500/20"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wider text-white/30">
                  Passwort
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    placeholder="••••••••"
                    className="w-full rounded-xl border border-white/[0.08] bg-white/[0.05] px-4 py-3 pr-11 text-sm text-white placeholder-white/20 outline-none transition-all focus:border-brand-500/50 focus:bg-white/[0.08] focus:ring-1 focus:ring-brand-500/20"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-white/25 hover:text-white/60 transition-colors"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {error && (
                <div className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-[13px] text-red-400">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="group flex w-full items-center justify-center gap-2 rounded-xl bg-white py-3 text-sm font-semibold text-ink-950 transition-all hover:bg-white/90 hover:shadow-[0_0_24px_rgba(255,255,255,0.15)] disabled:opacity-40"
              >
                {isLoading ? (
                  <>
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-ink-900/30 border-t-ink-950" />
                    Anmeldung...
                  </>
                ) : (
                  <>
                    Anmelden
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        <p className="mt-5 text-center text-[13px] text-white/30">
          Noch kein Account?{' '}
          <Link href="/auth/register" className="font-semibold text-brand-400 hover:text-brand-300 transition-colors">
            Kostenlos registrieren
          </Link>
        </p>
      </div>
    </div>
  )
}
