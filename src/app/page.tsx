import Link from 'next/link'
import {
  TrendingUp,
  BarChart3,
  FileText,
  ArrowRight,
  Building2,
  Calculator,
  Shield,
  Zap,
  Lock,
  CheckCircle2,
  ChevronRight,
  Star,
} from 'lucide-react'
import { ProUpgradeButton } from '@/components/pricing/ProUpgradeButton'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-ink-950 text-white selection:bg-brand-500/30">

      {/* ── Hero ──────────────────────────────────────────────────────── */}
      <section className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-4 pt-20 pb-16">

        {/* Layered background */}
        <div className="pointer-events-none absolute inset-0">
          {/* Base radial glow */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-10%,rgba(59,130,246,0.15),transparent)]" />
          {/* Grid */}
          <div
            className="absolute inset-0 opacity-[0.025]"
            style={{
              backgroundImage:
                'linear-gradient(rgba(255,255,255,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.6) 1px, transparent 1px)',
              backgroundSize: '64px 64px',
            }}
          />
          {/* Vignette */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_100%_80%_at_50%_100%,rgba(10,15,30,0.9),transparent_60%)]" />
        </div>

        <div className="relative mx-auto w-full max-w-5xl text-center">

          {/* Badge */}
          <div className="mb-8 inline-flex animate-fade-in">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.05] px-4 py-1.5 text-xs font-medium text-white/60 backdrop-blur-sm">
              <span className="flex h-1.5 w-1.5 rounded-full bg-positive-500 shadow-[0_0_6px_rgba(34,197,94,0.8)]" />
              Für deutsche Immobilieninvestoren
              <span className="text-white/20">·</span>
              <span className="text-white/40">Kostenlos starten</span>
            </div>
          </div>

          {/* Headline */}
          <h1 className="animate-slide-up mb-6 text-5xl font-black tracking-tight text-white sm:text-6xl lg:text-[80px] lg:leading-[0.95]">
            Analysiere jede<br />
            Immobilie{' '}
            <span className="relative inline-block">
              <span className="relative z-10 bg-gradient-to-r from-brand-400 to-brand-300 bg-clip-text text-transparent">
                in 60 Sekunden
              </span>
              <span className="absolute -inset-x-2 bottom-1 h-px bg-gradient-to-r from-transparent via-brand-500/50 to-transparent" />
            </span>
          </h1>

          {/* Subline */}
          <p className="animate-slide-up stagger-1 mx-auto mb-10 max-w-2xl text-lg leading-relaxed text-white/40 sm:text-xl">
            Mietrendite, Cashflow, Deal Score und 10-Jahres-Projektion für jede
            Kapitalanlageimmobilie in Deutschland — professionell, sofort, kostenlos.
          </p>

          {/* CTAs */}
          <div className="animate-slide-up stagger-2 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <Link
              href="/analyze"
              className="group flex items-center gap-2.5 rounded-2xl bg-white px-7 py-3.5 text-[15px] font-semibold text-ink-950 shadow-[0_1px_0_rgba(255,255,255,0.05)] transition-all hover:bg-white/95 hover:shadow-[0_0_32px_rgba(255,255,255,0.15)] hover:-translate-y-0.5"
            >
              Deal analysieren
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
            <Link
              href="#features"
              className="flex items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.04] px-7 py-3.5 text-[15px] font-medium text-white/60 backdrop-blur-sm transition-all hover:border-white/20 hover:text-white hover:bg-white/[0.07]"
            >
              Funktionen ansehen
            </Link>
          </div>

          {/* Stat strip */}
          <div className="animate-slide-up stagger-3 mt-20 grid grid-cols-3 gap-6 border-t border-white/[0.06] pt-12 sm:gap-16">
            {[
              { num: '15+', label: 'Kennzahlen' },
              { num: '10 J.', label: 'Projektion' },
              { num: '100%', label: 'Kostenlos starten' },
            ].map(({ num, label }) => (
              <div key={label} className="flex flex-col items-center">
                <div className="text-2xl font-black text-white sm:text-3xl num">{num}</div>
                <div className="mt-1 text-xs text-white/30 tracking-wide">{label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Scroll cue */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 opacity-30">
          <div className="h-6 w-px bg-gradient-to-b from-transparent to-white/60" />
          <div className="text-[10px] uppercase tracking-widest text-white/40">Scroll</div>
        </div>
      </section>

      {/* ── Ticker / Social Proof ──────────────────────────────────────── */}
      <div className="relative overflow-hidden border-y border-white/[0.06] py-4">
        <div className="pointer-events-none absolute left-0 top-0 z-10 h-full w-24 bg-gradient-to-r from-ink-950 to-transparent" />
        <div className="pointer-events-none absolute right-0 top-0 z-10 h-full w-24 bg-gradient-to-l from-ink-950 to-transparent" />
        <div className="flex animate-ticker gap-12 whitespace-nowrap">
          {[...Array(3)].flatMap(() => [
            '15+ Kennzahlen',
            '·',
            '10-Jahres-Projektion',
            '·',
            'Alle 16 Bundesländer',
            '·',
            'Annuitätendarlehen-Rechner',
            '·',
            'Deal Score Algorithmus',
            '·',
            'PDF-Export',
            '·',
            'Szenario-Simulator',
            '·',
          ]).map((item, i) => (
            <span
              key={i}
              className={
                item === '·'
                  ? 'text-white/10'
                  : 'text-[13px] font-medium tracking-wide text-white/25'
              }
            >
              {item}
            </span>
          ))}
        </div>
      </div>

      {/* ── Features ──────────────────────────────────────────────────── */}
      <section id="features" className="px-4 py-28 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">

          {/* Section header */}
          <div className="mb-16 text-center">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3.5 py-1 text-[11px] font-semibold uppercase tracking-widest text-white/40">
              Features
            </div>
            <h2 className="text-3xl font-black tracking-tight text-white sm:text-4xl lg:text-5xl">
              Alles was du brauchst
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-lg text-white/35">
              Von der Bruttomietrendite bis zur Tilgungsplanung — alle wichtigen
              Kennzahlen auf einen Blick.
            </p>
          </div>

          {/* Main feature cards */}
          <div className="grid gap-4 md:grid-cols-3">
            {[
              {
                icon: TrendingUp,
                num: '01',
                title: 'Deal Score',
                desc: 'Unser Algorithmus bewertet jedes Objekt auf einer Skala von 0–100, basierend auf Rendite, Cashflow, Beleihungsauslauf und Leerstandsrisiko.',
                accent: 'from-brand-500/20 to-brand-600/5',
              },
              {
                icon: BarChart3,
                num: '02',
                title: '10-Jahres-Projektion',
                desc: 'Sieh wie sich dein Cashflow, Eigenkapital und Vermögen über 10 Jahre entwickeln — mit Szenario-Simulator für Zinsen und Mietentwicklung.',
                accent: 'from-positive-500/20 to-positive-600/5',
              },
              {
                icon: FileText,
                num: '03',
                title: 'PDF-Report',
                desc: 'Erstelle professionelle Investitionsberichte als PDF. Perfekt für die Bank, den Steuerberater oder zur eigenen Dokumentation.',
                accent: 'from-amber-500/20 to-amber-600/5',
              },
            ].map(({ icon: Icon, num, title, desc, accent }) => (
              <div
                key={title}
                className="group relative overflow-hidden rounded-2xl border border-white/[0.07] bg-white/[0.03] p-8 transition-all duration-300 hover:border-white/[0.12] hover:bg-white/[0.05]"
              >
                <div className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${accent} opacity-0 transition-opacity duration-300 group-hover:opacity-100`} />
                <div className="relative">
                  <div className="mb-6 flex items-center justify-between">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/[0.06] border border-white/[0.08]">
                      <Icon className="h-5 w-5 text-white/60" />
                    </div>
                    <span className="text-[11px] font-black text-white/10 num tracking-widest">{num}</span>
                  </div>
                  <h3 className="mb-3 text-lg font-bold text-white">{title}</h3>
                  <p className="text-[14.5px] leading-relaxed text-white/40">{desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Mini feature pills */}
          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { icon: Calculator, text: 'Annuitätendarlehen-Rechner' },
              { icon: Building2, text: 'Alle 16 Bundesländer' },
              { icon: Shield, text: 'Szenario-Simulator' },
              { icon: Zap, text: 'Sofort-Berechnung' },
            ].map(({ icon: Icon, text }) => (
              <div
                key={text}
                className="flex items-center gap-3 rounded-xl border border-white/[0.07] bg-white/[0.03] px-4 py-3 text-[13px] font-medium text-white/40 hover:border-white/[0.12] hover:text-white/60 transition-colors"
              >
                <Icon className="h-4 w-4 shrink-0 text-white/20" />
                {text}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Deal Score Preview ────────────────────────────────────────── */}
      <section className="px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="overflow-hidden rounded-3xl border border-white/[0.07] bg-gradient-to-br from-white/[0.04] to-white/[0.01] p-8 sm:p-12 lg:p-16">
            <div className="grid items-center gap-12 lg:grid-cols-2">

              {/* Left: copy */}
              <div>
                <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-brand-500/30 bg-brand-500/10 px-3.5 py-1 text-[11px] font-semibold uppercase tracking-widest text-brand-400">
                  Deal Score
                </div>
                <h2 className="mb-5 text-3xl font-black tracking-tight text-white sm:text-4xl">
                  Sofort wissen ob es<br />ein guter Deal ist
                </h2>
                <p className="mb-8 text-[15px] leading-relaxed text-white/40">
                  Unser Algorithmus analysiert vier kritische Faktoren und gibt dir in
                  Sekunden einen klaren Score — von 0 (kritisch) bis 100 (ausgezeichnet).
                </p>
                <div className="space-y-3">
                  {[
                    { label: 'Nettomietrendite', max: 30, earned: 26, color: 'bg-brand-500' },
                    { label: 'Monatl. Cashflow', max: 25, earned: 20, color: 'bg-positive-500' },
                    { label: 'Beleihungsauslauf', max: 25, earned: 18, color: 'bg-amber-500' },
                    { label: 'Leerstandsquote', max: 20, earned: 16, color: 'bg-brand-400' },
                  ].map(({ label, max, earned, color }) => (
                    <div key={label} className="flex items-center gap-4">
                      <span className="w-36 shrink-0 text-[12px] text-white/40">{label}</span>
                      <div className="flex-1 h-1 rounded-full bg-white/[0.06]">
                        <div
                          className={`h-full rounded-full ${color} opacity-70`}
                          style={{ width: `${(earned / max) * 100}%` }}
                        />
                      </div>
                      <span className="text-[12px] font-semibold text-white/40 num tabular-nums w-8 text-right">
                        {earned}<span className="text-white/20">/{max}</span>
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right: score ring */}
              <div className="flex items-center justify-center">
                <div className="relative flex flex-col items-center">
                  {/* Outer glow */}
                  <div className="absolute inset-0 rounded-full bg-brand-500/10 blur-3xl" />
                  <svg width="180" height="180" className="relative -rotate-90">
                    <circle cx="90" cy="90" r="70" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="8" />
                    <circle
                      cx="90" cy="90" r="70"
                      fill="none"
                      stroke="url(#scoreGrad)"
                      strokeWidth="8"
                      strokeDasharray={`${2 * Math.PI * 70}`}
                      strokeDashoffset={`${2 * Math.PI * 70 * (1 - 0.80)}`}
                      strokeLinecap="round"
                    />
                    <defs>
                      <linearGradient id="scoreGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#3B82F6" />
                        <stop offset="100%" stopColor="#60A5FA" />
                      </linearGradient>
                    </defs>
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-5xl font-black text-white num">80</span>
                    <span className="text-[11px] text-white/30 mt-1">/ 100</span>
                  </div>
                  <div className="mt-4 text-center">
                    <p className="text-sm font-semibold text-white">Ausgezeichnet</p>
                    <p className="text-[12px] text-white/30 mt-0.5">Starkes Investment</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── How It Works ──────────────────────────────────────────────── */}
      <section className="px-4 py-24 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <div className="mb-16 text-center">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3.5 py-1 text-[11px] font-semibold uppercase tracking-widest text-white/40">
              So funktioniert es
            </div>
            <h2 className="text-3xl font-black tracking-tight text-white sm:text-4xl">
              In drei Schritten zur Analyse
            </h2>
          </div>

          <div className="relative grid gap-8 md:grid-cols-3">
            {/* Connector */}
            <div className="pointer-events-none absolute top-5 left-[calc(16.6%+20px)] right-[calc(16.6%+20px)] hidden h-px bg-gradient-to-r from-white/10 via-white/20 to-white/10 md:block" />

            {[
              {
                step: '01',
                title: 'Daten eingeben',
                desc: 'Kaufpreis, Finanzierung, Mieteinnahmen und Nebenkosten eingeben. Das Formular führt dich Schritt für Schritt.',
              },
              {
                step: '02',
                title: 'Analyse starten',
                desc: 'Mit einem Klick werden alle Kennzahlen berechnet: Renditen, Cashflow, Tilgungsplan und 10-Jahres-Projektion.',
              },
              {
                step: '03',
                title: 'Entscheidung treffen',
                desc: 'Der Deal Score zeigt sofort ob das Objekt ein gutes Investment ist. Simuliere verschiedene Szenarien.',
              },
            ].map(({ step, title, desc }) => (
              <div key={step} className="relative flex flex-col items-center text-center md:items-start md:text-left">
                <div className="relative z-10 mb-5 flex h-10 w-10 items-center justify-center rounded-xl border border-white/[0.10] bg-ink-950 text-xs font-black text-white/50 num shadow-[0_0_0_4px_rgba(255,255,255,0.02)]">
                  {step}
                </div>
                <h3 className="mb-2 text-[16px] font-bold text-white">{title}</h3>
                <p className="text-[14px] leading-relaxed text-white/35">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Pricing ───────────────────────────────────────────────────── */}
      <section id="pricing" className="px-4 py-28 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <div className="mb-16 text-center">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3.5 py-1 text-[11px] font-semibold uppercase tracking-widest text-white/40">
              Preise
            </div>
            <h2 className="text-3xl font-black tracking-tight text-white sm:text-4xl">
              Einfache Preisgestaltung
            </h2>
            <p className="mt-4 text-lg text-white/35">
              Starte kostenlos, upgrade wenn du bereit bist
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2">

            {/* Free */}
            <div className="rounded-2xl border border-white/[0.07] bg-white/[0.03] p-8">
              <div className="text-[10px] font-semibold uppercase tracking-widest text-white/30 mb-3">Kostenlos</div>
              <div className="mb-1 flex items-end gap-1.5">
                <span className="text-4xl font-black text-white num">0 €</span>
                <span className="mb-1 text-sm text-white/30">/ Monat</span>
              </div>
              <p className="mb-8 text-sm text-white/30">Alle Kernfunktionen, sofort starten.</p>
              <ul className="mb-8 space-y-3">
                {[
                  'Vollständige Immobilienanalyse',
                  'Deal Score Berechnung',
                  'Cashflow-Berechnung',
                  '10-Jahres-Projektion',
                  'Tilgungsplan',
                  'Szenario-Simulator',
                  'Bis zu 3 gespeicherte Analysen',
                ].map((f) => (
                  <li key={f} className="flex items-center gap-3 text-[13.5px] text-white/40">
                    <CheckCircle2 className="h-4 w-4 shrink-0 text-white/20" />
                    {f}
                  </li>
                ))}
              </ul>
              <Link
                href="/auth/register"
                className="block w-full rounded-xl border border-white/[0.10] py-3 text-center text-sm font-semibold text-white/50 transition-all hover:border-white/20 hover:text-white hover:bg-white/[0.04]"
              >
                Kostenlos starten
              </Link>
            </div>

            {/* Pro */}
            <div className="relative overflow-hidden rounded-2xl border border-brand-500/30 bg-gradient-to-br from-brand-950/60 to-ink-950">
              {/* Top accent line */}
              <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-brand-500/60 to-transparent" />
              {/* Ambient glow */}
              <div className="pointer-events-none absolute -top-12 -right-12 h-40 w-40 rounded-full bg-brand-500/10 blur-3xl" />

              <div className="relative p-8">
                <div className="mb-3 flex items-center justify-between">
                  <span className="text-[10px] font-semibold uppercase tracking-widest text-white/30">Pro</span>
                  <div className="flex items-center gap-1 rounded-full bg-brand-500/20 px-2.5 py-1 text-[10px] font-semibold text-brand-400 ring-1 ring-brand-500/20">
                    <Star className="h-2.5 w-2.5 fill-brand-400" />
                    Beliebt
                  </div>
                </div>
                <div className="mb-1 flex items-end gap-1.5">
                  <span className="text-4xl font-black text-white num">19 €</span>
                  <span className="mb-1 text-sm text-white/30">/ Monat</span>
                </div>
                <p className="mb-8 text-sm text-white/30 leading-relaxed">Alles aus Free, plus Premium-Features.</p>
                <ul className="mb-8 space-y-3">
                  {[
                    'Alles aus Free inklusive',
                    'PDF-Reports exportieren',
                    'Unbegrenzte Analysen',
                    'Portfolio-Übersicht',
                    'Analysen vergleichen',
                    'Prioritäts-Support',
                    'Neue Features zuerst',
                  ].map((f) => (
                    <li key={f} className="flex items-center gap-3 text-[13.5px] text-white/60">
                      <CheckCircle2 className="h-4 w-4 shrink-0 text-brand-400/70" />
                      {f}
                    </li>
                  ))}
                </ul>
                <ProUpgradeButton />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Final CTA ─────────────────────────────────────────────────── */}
      <section className="px-4 py-24 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <div className="relative overflow-hidden rounded-3xl border border-white/[0.08] bg-gradient-to-br from-white/[0.05] to-white/[0.01] px-8 py-20 text-center">
            {/* Glow */}
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_60%_at_50%_0%,rgba(59,130,246,0.12),transparent)]" />

            <h2 className="relative mb-4 text-3xl font-black tracking-tight text-white sm:text-4xl lg:text-5xl">
              Bereit für deine erste Analyse?
            </h2>
            <p className="relative mb-10 text-lg text-white/35">
              Kostenlos starten — keine Kreditkarte erforderlich.
            </p>
            <Link
              href="/analyze"
              className="relative group inline-flex items-center gap-2.5 rounded-2xl bg-white px-8 py-4 text-[15px] font-semibold text-ink-950 shadow-[0_1px_0_rgba(255,255,255,0.05)] transition-all hover:bg-white/95 hover:shadow-[0_0_40px_rgba(255,255,255,0.18)] hover:-translate-y-0.5"
            >
              Deal analysieren
              <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── Footer ────────────────────────────────────────────────────── */}
      <footer className="border-t border-white/[0.06] px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl flex flex-col items-center justify-between gap-4 sm:flex-row">
          <Link href="/" className="flex items-center gap-2 text-sm font-semibold text-white/50 hover:text-white/80 transition-colors">
            <div className="flex h-6 w-6 items-center justify-center rounded-md bg-brand-500/20 ring-1 ring-brand-500/30">
              <TrendingUp className="h-3.5 w-3.5 text-brand-400" />
            </div>
            PropAnalyzer
          </Link>
          <div className="flex items-center gap-1.5 text-xs text-white/20">
            <Lock className="h-3 w-3" />
            © 2025 PropAnalyzer. Alle Angaben ohne Gewähr. Keine Anlageberatung.
          </div>
        </div>
      </footer>

    </div>
  )
}
