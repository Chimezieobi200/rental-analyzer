'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { LogOut, Crown, BarChart3, Settings, ChevronDown, Menu, X, TrendingUp, LayoutGrid } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { cn } from '@/lib/utils'
import type { User as SupabaseUser } from '@supabase/supabase-js'

export function Navbar() {
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClient()

  const [user, setUser] = useState<SupabaseUser | null>(null)
  const [isPro, setIsPro] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  useEffect(() => {
    if (!supabase) return
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
      if (user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('subscription_status')
          .eq('id', user.id)
          .single()
        setIsPro(profile?.subscription_status === 'pro')
      }
    }
    getUser()
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })
    return () => subscription.unsubscribe()
  }, [supabase])

  const handleManageBilling = async () => {
    try {
      const res = await fetch('/api/stripe/portal', { method: 'POST' })
      const data = await res.json()
      if (data.url) window.location.href = data.url
    } catch {
      console.error('Failed to open billing portal')
    }
    setUserMenuOpen(false)
  }

  const handleSignOut = async () => {
    if (!supabase) return
    await supabase.auth.signOut()
    setUser(null)
    setUserMenuOpen(false)
    router.push('/')
    router.refresh()
  }

  const navLinks = [
    { href: '/#features', label: 'Features' },
    { href: '/#pricing', label: 'Preise' },
    { href: '/analyze', label: 'Analysieren' },
    ...(user ? [{ href: '/dashboard', label: 'Portfolio' }] : []),
  ]

  const userInitial = user?.email?.[0]?.toUpperCase() ?? '?'
  const userHandle = user?.email?.split('@')[0] ?? ''

  return (
    <>
      <nav
        className={cn(
          'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
          scrolled
            ? 'bg-ink-950/90 backdrop-blur-xl border-b border-white/[0.08] shadow-[0_1px_0_rgba(255,255,255,0.04),0_8px_32px_rgba(0,0,0,0.4)]'
            : 'bg-transparent border-b border-transparent'
        )}
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-[60px] items-center justify-between gap-4">

            {/* ── Logo ─────────────────────────────── */}
            <Link href="/" className="group flex shrink-0 items-center gap-2.5">
              <div className="relative flex h-8 w-8 items-center justify-center rounded-[9px] bg-gradient-to-br from-brand-500 to-brand-700 shadow-[0_0_0_1px_rgba(255,255,255,0.12),0_2px_8px_rgba(59,130,246,0.35)]">
                <TrendingUp className="h-4 w-4 text-white" />
              </div>
              <span className="text-[15px] font-semibold tracking-tight text-white">
                PropAnalyzer
              </span>
            </Link>

            {/* ── Desktop nav links ─────────────────── */}
            <div className="hidden flex-1 items-center justify-center gap-0.5 md:flex">
              {navLinks.map(({ href, label }) => {
                const isActive = pathname === href || (href === '/analyze' && pathname === '/analyze')
                return (
                  <Link
                    key={href}
                    href={href}
                    className={cn(
                      'relative px-3.5 py-1.5 text-[13.5px] font-medium rounded-lg transition-all duration-150',
                      isActive
                        ? 'text-white bg-white/10'
                        : 'text-white/50 hover:text-white hover:bg-white/[0.06]'
                    )}
                  >
                    {label}
                    {isActive && (
                      <span className="absolute bottom-0.5 left-1/2 h-px w-3 -translate-x-1/2 rounded-full bg-brand-400" />
                    )}
                  </Link>
                )
              })}
            </div>

            {/* ── Auth area ─────────────────────────── */}
            <div className="hidden shrink-0 items-center gap-2 md:flex">
              {user ? (
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setUserMenuOpen(v => !v)}
                    className={cn(
                      'flex items-center gap-2 rounded-xl px-2.5 py-1.5 text-sm transition-all duration-150',
                      'border border-white/10 bg-white/[0.06] hover:bg-white/[0.10] hover:border-white/20'
                    )}
                  >
                    {/* Avatar */}
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-brand-500/20 text-brand-400 ring-1 ring-brand-500/30">
                      <span className="text-[11px] font-bold">{userInitial}</span>
                    </div>
                    <span className="max-w-[100px] truncate text-[13px] font-medium text-white/70">
                      {userHandle}
                    </span>
                    {isPro && (
                      <span className="flex items-center gap-1 rounded-full bg-amber-500/15 px-1.5 py-0.5 text-[10px] font-semibold text-amber-400 ring-1 ring-amber-500/20">
                        <Crown className="h-2.5 w-2.5" />
                        Pro
                      </span>
                    )}
                    <ChevronDown
                      className={cn(
                        'h-3.5 w-3.5 text-white/30 transition-transform duration-200',
                        userMenuOpen && 'rotate-180'
                      )}
                    />
                  </button>

                  {/* Dropdown */}
                  {userMenuOpen && (
                    <div className="absolute right-0 mt-2 w-52 overflow-hidden rounded-2xl border border-white/10 bg-ink-950/95 shadow-[0_8px_32px_rgba(0,0,0,0.5)] backdrop-blur-xl animate-scale-in">
                      {/* Header */}
                      <div className="border-b border-white/[0.06] px-3.5 py-3">
                        <p className="text-[11px] text-white/30 truncate">{user.email}</p>
                      </div>

                      {/* Menu items */}
                      <div className="p-1.5 space-y-0.5">
                        <Link
                          href="/dashboard"
                          onClick={() => setUserMenuOpen(false)}
                          className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-[13px] text-white/60 hover:bg-white/[0.06] hover:text-white transition-colors"
                        >
                          <LayoutGrid className="h-3.5 w-3.5" />
                          Portfolio
                        </Link>

                        {isPro ? (
                          <button
                            onClick={handleManageBilling}
                            className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-[13px] text-white/60 hover:bg-white/[0.06] hover:text-white transition-colors"
                          >
                            <Settings className="h-3.5 w-3.5" />
                            Abo verwalten
                          </button>
                        ) : (
                          <Link
                            href="/#pricing"
                            onClick={() => setUserMenuOpen(false)}
                            className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-[13px] text-brand-400 hover:bg-brand-500/10 hover:text-brand-300 transition-colors font-medium"
                          >
                            <Crown className="h-3.5 w-3.5" />
                            Auf Pro upgraden
                          </Link>
                        )}

                        <div className="my-1 border-t border-white/[0.06]" />

                        <button
                          onClick={handleSignOut}
                          className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-[13px] text-white/40 hover:bg-red-500/10 hover:text-red-400 transition-colors"
                        >
                          <LogOut className="h-3.5 w-3.5" />
                          Abmelden
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <>
                  <Link
                    href="/auth/login"
                    className="px-3.5 py-1.5 text-[13.5px] font-medium text-white/50 hover:text-white rounded-lg transition-colors"
                  >
                    Anmelden
                  </Link>
                  <Link
                    href="/auth/register"
                    className="group flex items-center gap-1.5 rounded-xl bg-white px-4 py-1.5 text-[13.5px] font-semibold text-ink-950 shadow-[0_1px_0_rgba(255,255,255,0.08)] transition-all hover:bg-white/90 hover:shadow-[0_0_20px_rgba(255,255,255,0.12)]"
                  >
                    Kostenlos starten
                  </Link>
                </>
              )}
            </div>

            {/* ── Mobile toggle ──────────────────────── */}
            <button
              onClick={() => setMobileOpen(v => !v)}
              className="rounded-xl border border-white/10 p-2 text-white/50 hover:bg-white/[0.06] hover:text-white transition-colors md:hidden"
              aria-label="Menu"
            >
              {mobileOpen ? <X className="h-4.5 w-4.5" /> : <Menu className="h-4.5 w-4.5" />}
            </button>
          </div>
        </div>
      </nav>

      {/* ── Mobile overlay ──────────────────────────── */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 md:hidden" onClick={() => setMobileOpen(false)}>
          <div className="absolute inset-0 bg-ink-950/60 backdrop-blur-sm" />
        </div>
      )}

      {/* ── Mobile drawer ───────────────────────────── */}
      <div
        className={cn(
          'fixed top-[60px] right-0 z-40 h-[calc(100dvh-60px)] w-72 border-l border-white/[0.08] bg-ink-950/95 backdrop-blur-xl transition-transform duration-300 md:hidden',
          mobileOpen ? 'translate-x-0' : 'translate-x-full'
        )}
      >
        <div className="flex h-full flex-col p-4">
          <nav className="space-y-0.5">
            {navLinks.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  'flex items-center rounded-xl px-4 py-3 text-sm font-medium transition-colors',
                  pathname === href
                    ? 'bg-white/10 text-white'
                    : 'text-white/50 hover:bg-white/[0.06] hover:text-white'
                )}
              >
                {label}
              </Link>
            ))}
          </nav>

          <div className="mt-auto space-y-2 border-t border-white/[0.06] pt-4">
            {user ? (
              <>
                <div className="flex items-center gap-2.5 rounded-xl bg-white/[0.04] px-4 py-2.5">
                  <div className="flex h-7 w-7 items-center justify-center rounded-full bg-brand-500/20 text-brand-400 ring-1 ring-brand-500/30">
                    <span className="text-xs font-bold">{userInitial}</span>
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-[13px] font-medium text-white/80">{userHandle}</p>
                    {isPro && <p className="text-[10px] text-amber-400 font-semibold">Pro</p>}
                  </div>
                </div>
                <Link
                  href="/dashboard"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-2.5 rounded-xl px-4 py-2.5 text-sm text-white/60 hover:bg-white/[0.06] hover:text-white transition-colors"
                >
                  <LayoutGrid className="h-4 w-4" />
                  Portfolio
                </Link>
                <button
                  onClick={() => { handleSignOut(); setMobileOpen(false) }}
                  className="flex w-full items-center gap-2.5 rounded-xl px-4 py-2.5 text-sm text-white/40 hover:bg-red-500/10 hover:text-red-400 transition-colors"
                >
                  <LogOut className="h-4 w-4" />
                  Abmelden
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/auth/login"
                  onClick={() => setMobileOpen(false)}
                  className="block rounded-xl border border-white/10 px-4 py-2.5 text-center text-sm font-medium text-white/60 hover:border-white/20 hover:text-white transition-colors"
                >
                  Anmelden
                </Link>
                <Link
                  href="/auth/register"
                  onClick={() => setMobileOpen(false)}
                  className="block rounded-xl bg-white px-4 py-2.5 text-center text-sm font-semibold text-ink-950 hover:bg-white/90 transition-colors"
                >
                  Kostenlos starten
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
