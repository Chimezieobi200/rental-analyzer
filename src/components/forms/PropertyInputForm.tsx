'use client'

import { useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import {
  Building2,
  Banknote,
  Home,
  TrendingUp,
  ChevronDown,
  Info,
  Calculator,
  CheckCircle2,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import type { PropertyInputs } from '@/types'
import { GERMAN_STATES } from '@/types'

const schema = z.object({
  purchasePrice: z.number({ required_error: 'Pflichtfeld' }).positive('Muss positiv sein'),
  propertySizeSqm: z.number().positive('Muss positiv sein'),
  yearBuilt: z.number().int().min(1800).max(2030),
  location: z.string().min(1, 'Pflichtfeld'),
  federalState: z.string().min(1, 'Bundesland wählen'),
  grunderwerbsteuer: z.number().min(0).max(10),
  notarkosten: z.number().min(0).max(10),
  maklercourtage: z.number().min(0).max(10),
  equity: z.number().min(0, 'Muss positiv sein'),
  interestRate: z.number().min(0).max(20),
  loanDuration: z.number().int().min(1).max(40),
  repaymentRate: z.number().min(0).max(20),
  monthlyRent: z.number().min(0),
  rentIncreaseRate: z.number().min(0).max(20),
  maintenanceReserve: z.number().min(0),
  propertyManagement: z.number().min(0).max(30),
  vacancyRate: z.number().min(0).max(100),
  additionalCosts: z.number().min(0),
})

type FormValues = z.infer<typeof schema>

interface PropertyInputFormProps {
  onCalculate: (inputs: PropertyInputs) => void
  isCalculating: boolean
}

function Tooltip({ text }: { text: string }) {
  const [show, setShow] = useState(false)
  return (
    <div className="relative inline-block">
      <button
        type="button"
        onMouseEnter={() => setShow(true)}
        onMouseLeave={() => setShow(false)}
        className="text-white/30 hover:text-white/60 transition-colors"
      >
        <Info className="h-3.5 w-3.5" />
      </button>
      {show && (
        <div className="absolute bottom-full left-1/2 z-20 mb-2 w-56 -translate-x-1/2 rounded-xl border border-white/[0.12] bg-ink-900 px-3 py-2.5 text-xs leading-relaxed text-white/70 shadow-overlay">
          {text}
          <div className="absolute left-1/2 top-full -translate-x-1/2 border-4 border-transparent border-t-ink-900" />
        </div>
      )}
    </div>
  )
}

function FieldLabel({
  label,
  tooltip,
  error,
}: {
  label: string
  tooltip?: string
  error?: string
}) {
  return (
    <div className="mb-1.5 flex items-center gap-1.5">
      <label className="text-xs font-medium text-white/60">{label}</label>
      {tooltip && <Tooltip text={tooltip} />}
      {error && <span className="ml-auto text-[11px] text-negative-400">{error}</span>}
    </div>
  )
}

function NumberInput({
  value,
  onChange,
  onBlur,
  suffix,
  placeholder,
  step = 1,
  min = 0,
  hasError,
}: {
  value: number
  onChange: (v: number) => void
  onBlur?: () => void
  suffix?: string
  placeholder?: string
  step?: number
  min?: number
  hasError?: boolean
}) {
  if (suffix) {
    return (
      <div className={cn('input-group-dark', hasError && 'border-negative-500 shadow-[0_0_0_3px_rgba(220,38,38,0.12)]')}>
        <input
          type="number"
          value={value || ''}
          onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
          onBlur={onBlur}
          placeholder={placeholder}
          step={step}
          min={min}
          className="tabular-nums num"
        />
        <span className="suffix">{suffix}</span>
      </div>
    )
  }

  return (
    <input
      type="number"
      value={value || ''}
      onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
      onBlur={onBlur}
      placeholder={placeholder}
      step={step}
      min={min}
      className={cn(
        'input-dark text-sm tabular-nums num',
        hasError && 'border-negative-500'
      )}
    />
  )
}

type SectionKey = 'property' | 'financing' | 'rental' | 'costs'

const sections: { id: SectionKey; step: number; title: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { id: 'property', step: 1, title: 'Objekt & Nebenkosten', icon: Building2 },
  { id: 'financing', step: 2, title: 'Finanzierung', icon: Banknote },
  { id: 'rental', step: 3, title: 'Mieteinnahmen', icon: Home },
  { id: 'costs', step: 4, title: 'Laufende Kosten', icon: TrendingUp },
]

export function PropertyInputForm({ onCalculate, isCalculating }: PropertyInputFormProps) {
  const [openSection, setOpenSection] = useState<SectionKey | null>('property')

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      purchasePrice: 350000,
      propertySizeSqm: 75,
      yearBuilt: 2000,
      location: 'München',
      federalState: 'Bayern',
      grunderwerbsteuer: 3.5,
      notarkosten: 1.5,
      maklercourtage: 3.57,
      equity: 100000,
      interestRate: 3.8,
      loanDuration: 25,
      repaymentRate: 2.0,
      monthlyRent: 1400,
      rentIncreaseRate: 2.0,
      maintenanceReserve: 150,
      propertyManagement: 0,
      vacancyRate: 3,
      additionalCosts: 50,
    },
  })

  const watchedState = watch('federalState')
  const watchedPrice = watch('purchasePrice')
  const watchedGrunderwerbsteuer = watch('grunderwerbsteuer')
  const watchedNotarkosten = watch('notarkosten')
  const watchedMaklercourtage = watch('maklercourtage')

  const buyingCosts =
    watchedPrice * (watchedGrunderwerbsteuer / 100) +
    watchedPrice * (watchedNotarkosten / 100) +
    watchedPrice * (watchedMaklercourtage / 100)

  const onSubmit = (data: FormValues) => {
    onCalculate(data as PropertyInputs)
  }

  const handleStateChange = (stateName: string) => {
    setValue('federalState', stateName)
    const state = GERMAN_STATES.find((s) => s.name === stateName)
    if (state) setValue('grunderwerbsteuer', state.grunderwerbsteuer)
  }

  const fmt = (n: number) =>
    n.toLocaleString('de-DE', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 })

  return (
    <div className="overflow-hidden rounded-2xl border border-white/[0.07] bg-white/[0.04] backdrop-blur-sm">
      {/* Header */}
      <div className="flex items-center gap-3 border-b border-white/[0.07] px-5 py-4">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/[0.10]">
          <Calculator className="h-4 w-4 text-white/70" />
        </div>
        <div>
          <h2 className="text-sm font-semibold text-white">Objektdaten</h2>
          <p className="text-xs text-white/40">4 Abschnitte ausfüllen</p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        {sections.map((section, idx) => {
          const Icon = section.icon
          const isOpen = openSection === section.id
          const isLast = idx === sections.length - 1

          return (
            <div key={section.id} className={cn(!isLast && 'border-b border-white/[0.07]')}>
              {/* Section Toggle */}
              <button
                type="button"
                onClick={() => setOpenSection(isOpen ? null : section.id)}
                className={cn(
                  'flex w-full items-center justify-between px-5 py-3.5 text-left transition-colors',
                  isOpen ? 'bg-white/[0.05]' : 'hover:bg-white/[0.03]'
                )}
                aria-expanded={isOpen}
              >
                <div className="flex items-center gap-3">
                  <div className={cn(
                    'flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold transition-colors',
                    isOpen ? 'bg-white text-ink-950' : 'bg-white/[0.08] text-white/30'
                  )}>
                    {section.step}
                  </div>
                  <div className="flex items-center gap-2">
                    <Icon className={cn('h-3.5 w-3.5', isOpen ? 'text-white/70' : 'text-white/25')} />
                    <span className={cn(
                      'text-sm font-medium',
                      isOpen ? 'text-white' : 'text-white/40'
                    )}>
                      {section.title}
                    </span>
                  </div>
                </div>
                <ChevronDown
                  className={cn(
                    'h-4 w-4 text-white/30 transition-transform duration-200',
                    isOpen && 'rotate-180'
                  )}
                />
              </button>

              {/* Section Content */}
              {isOpen && (
                <div className="space-y-4 px-5 pb-5 pt-4 animate-slide-up-sm">

                  {/* ── PROPERTY ── */}
                  {section.id === 'property' && (
                    <>
                      <div className="grid grid-cols-2 gap-3">
                        <Controller
                          name="purchasePrice"
                          control={control}
                          render={({ field }) => (
                            <div>
                              <FieldLabel label="Kaufpreis" tooltip="Netto-Kaufpreis ohne Nebenkosten" error={errors.purchasePrice?.message} />
                              <NumberInput value={field.value} onChange={field.onChange} onBlur={field.onBlur} suffix="€" placeholder="350.000" step={1000} hasError={!!errors.purchasePrice} />
                            </div>
                          )}
                        />
                        <Controller
                          name="propertySizeSqm"
                          control={control}
                          render={({ field }) => (
                            <div>
                              <FieldLabel label="Wohnfläche" error={errors.propertySizeSqm?.message} />
                              <NumberInput value={field.value} onChange={field.onChange} suffix="m²" placeholder="75" />
                            </div>
                          )}
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <Controller
                          name="yearBuilt"
                          control={control}
                          render={({ field }) => (
                            <div>
                              <FieldLabel label="Baujahr" error={errors.yearBuilt?.message} />
                              <NumberInput value={field.value} onChange={field.onChange} placeholder="2000" min={1800} />
                            </div>
                          )}
                        />
                        <Controller
                          name="location"
                          control={control}
                          render={({ field }) => (
                            <div>
                              <FieldLabel label="Ort" error={errors.location?.message} />
                              <input
                                {...field}
                                placeholder="München"
                                className="input-dark text-sm"
                              />
                            </div>
                          )}
                        />
                      </div>

                      <div>
                        <FieldLabel label="Bundesland" />
                        <select
                          value={watchedState}
                          onChange={(e) => handleStateChange(e.target.value)}
                          className="input-dark text-sm appearance-none"
                        >
                          {GERMAN_STATES.map((state) => (
                            <option key={state.name} value={state.name}>
                              {state.name} ({state.grunderwerbsteuer}%)
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                        <Controller name="grunderwerbsteuer" control={control} render={({ field }) => (
                          <div>
                            <FieldLabel label="Grunderwerbst." tooltip="3,5% (Bayern) bis 6,5% (NRW)" />
                            <NumberInput value={field.value} onChange={field.onChange} suffix="%" step={0.1} />
                          </div>
                        )} />
                        <Controller name="notarkosten" control={control} render={({ field }) => (
                          <div>
                            <FieldLabel label="Notarkosten" tooltip="Typisch 1,5% des Kaufpreises" />
                            <NumberInput value={field.value} onChange={field.onChange} suffix="%" step={0.1} />
                          </div>
                        )} />
                        <Controller name="maklercourtage" control={control} render={({ field }) => (
                          <div>
                            <FieldLabel label="Makler" tooltip="Typisch 3,57% inkl. MwSt." />
                            <NumberInput value={field.value} onChange={field.onChange} suffix="%" step={0.01} />
                          </div>
                        )} />
                      </div>

                      {watchedPrice > 0 && (
                        <div className="rounded-xl border border-white/[0.08] bg-white/[0.05] p-3.5">
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-white/40">Gesamte Nebenkosten</span>
                            <span className="text-xs text-white/30">
                              {((buyingCosts / watchedPrice) * 100).toFixed(1)}% des KP
                            </span>
                          </div>
                          <div className="mt-1 text-lg font-bold text-white num">{fmt(buyingCosts)}</div>
                        </div>
                      )}
                    </>
                  )}

                  {/* ── FINANCING ── */}
                  {section.id === 'financing' && (
                    <>
                      <Controller name="equity" control={control} render={({ field }) => (
                        <div>
                          <FieldLabel label="Eigenkapital" tooltip="Eingesetztes EK inkl. Nebenkosten" error={errors.equity?.message} />
                          <NumberInput value={field.value} onChange={field.onChange} suffix="€" step={5000} placeholder="100.000" />
                        </div>
                      )} />

                      <div className="grid grid-cols-2 gap-3">
                        <Controller name="interestRate" control={control} render={({ field }) => (
                          <div>
                            <FieldLabel label="Zinssatz p.a." tooltip="Aktueller Sollzinssatz" />
                            <NumberInput value={field.value} onChange={field.onChange} suffix="%" step={0.1} />
                          </div>
                        )} />
                        <Controller name="repaymentRate" control={control} render={({ field }) => (
                          <div>
                            <FieldLabel label="Tilgung p.a." tooltip="Anfängliche Tilgungsrate" />
                            <NumberInput value={field.value} onChange={field.onChange} suffix="%" step={0.1} />
                          </div>
                        )} />
                      </div>

                      <Controller name="loanDuration" control={control} render={({ field }) => (
                        <div>
                          <FieldLabel label="Zinsbindung" tooltip="Laufzeit der Zinsbindung" />
                          <NumberInput value={field.value} onChange={field.onChange} suffix="Jahre" step={1} min={1} />
                        </div>
                      )} />

                      {watchedPrice > 0 && (
                        <div className="rounded-xl border border-white/[0.08] bg-white/[0.05] p-3.5 space-y-1">
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-white/40">Darlehensbetrag</span>
                            <span className="text-xs text-white/30">
                              Beleihung: {watchedPrice > 0 ? (Math.max(0, (watchedPrice + buyingCosts) - watch('equity')) / watchedPrice * 100).toFixed(1) : 0}%
                            </span>
                          </div>
                          <div className="text-lg font-bold text-white num">
                            {fmt(Math.max(0, (watchedPrice + buyingCosts) - watch('equity')))}
                          </div>
                        </div>
                      )}
                    </>
                  )}

                  {/* ── RENTAL ── */}
                  {section.id === 'rental' && (
                    <>
                      <Controller name="monthlyRent" control={control} render={({ field }) => (
                        <div>
                          <FieldLabel label="Kaltmiete / Monat" tooltip="Monatliche Nettokaltmiete" />
                          <NumberInput value={field.value} onChange={field.onChange} suffix="€" step={50} placeholder="1.400" />
                        </div>
                      )} />

                      <Controller name="rentIncreaseRate" control={control} render={({ field }) => (
                        <div>
                          <FieldLabel label="Mietsteigerung p.a." tooltip="Jährliche Steigerung (historisch ca. 2-3%)" />
                          <NumberInput value={field.value} onChange={field.onChange} suffix="%" step={0.1} />
                        </div>
                      )} />

                      {watchedPrice > 0 && watch('monthlyRent') > 0 && (
                        <div className="rounded-xl border border-white/[0.08] bg-white/[0.05] p-3.5">
                          <span className="text-xs text-white/40">Brutto-Mietrendite</span>
                          <div className="mt-1 text-lg font-bold text-white num">
                            {((watch('monthlyRent') * 12 / watchedPrice) * 100).toFixed(2).replace('.', ',')} %
                          </div>
                        </div>
                      )}
                    </>
                  )}

                  {/* ── COSTS ── */}
                  {section.id === 'costs' && (
                    <>
                      <Controller name="maintenanceReserve" control={control} render={({ field }) => (
                        <div>
                          <FieldLabel label="Instandhaltungsrücklage" tooltip="Faustregel: 1 €/m²/Monat" />
                          <NumberInput value={field.value} onChange={field.onChange} suffix="€/Mo." step={10} />
                        </div>
                      )} />

                      <Controller name="propertyManagement" control={control} render={({ field }) => (
                        <div>
                          <FieldLabel label="Hausverwaltung" tooltip="Kosten für Verwaltung, typisch 5-8% der Miete" />
                          <NumberInput value={field.value} onChange={field.onChange} suffix="% Miete" step={0.5} />
                        </div>
                      )} />

                      <Controller name="vacancyRate" control={control} render={({ field }) => (
                        <div>
                          <FieldLabel label="Leerstandsquote" tooltip="Erwarteter Leerstand p.a. (z.B. 3% ≈ 11 Tage)" />
                          <NumberInput value={field.value} onChange={field.onChange} suffix="%" step={0.5} />
                        </div>
                      )} />

                      <Controller name="additionalCosts" control={control} render={({ field }) => (
                        <div>
                          <FieldLabel label="Sonstige Kosten" tooltip="Weitere monatliche Kosten" />
                          <NumberInput value={field.value} onChange={field.onChange} suffix="€/Mo." step={10} />
                        </div>
                      )} />
                    </>
                  )}
                </div>
              )}
            </div>
          )
        })}

        {/* Submit */}
        <div className="p-4">
          <button
            type="submit"
            disabled={isCalculating}
            className={cn(
              'group flex w-full items-center justify-center gap-2.5 rounded-xl py-3.5 text-sm font-semibold transition-all duration-150',
              'bg-white text-ink-950',
              'hover:bg-white/90 hover:-translate-y-0.5 hover:shadow-[0_0_24px_rgba(255,255,255,0.15)]',
              'disabled:cursor-not-allowed disabled:opacity-50 disabled:translate-y-0'
            )}
          >
            {isCalculating ? (
              <>
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-ink-300 border-t-ink-950" />
                Berechnung läuft...
              </>
            ) : (
              <>
                <Calculator className="h-4 w-4" />
                Analyse berechnen
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  )
}
