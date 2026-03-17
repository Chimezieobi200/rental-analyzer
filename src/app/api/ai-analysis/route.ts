import { NextRequest } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import type { PropertyInputs, CalculationResults } from '@/types'

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

export async function POST(req: NextRequest) {
  const { inputs, results }: { inputs: PropertyInputs; results: CalculationResults } = await req.json()

  if (!inputs || !results) {
    return new Response('Missing inputs or results', { status: 400 })
  }

  const prompt = `Du analysierst folgendes Immobilien-Investment in Deutschland:

**Objekt**
- Lage: ${inputs.location} (${inputs.federalState})
- Kaufpreis: ${results.totalInvestment.toLocaleString('de-DE')} € (inkl. ${results.totalBuyingCosts.toLocaleString('de-DE')} € Nebenkosten)
- Baujahr: ${inputs.yearBuilt}, Wohnfläche: ${inputs.propertySizeSqm} m²
- Preis/m²: ${Math.round(inputs.purchasePrice / inputs.propertySizeSqm).toLocaleString('de-DE')} €

**Finanzierung**
- Eigenkapital: ${inputs.equity.toLocaleString('de-DE')} € (${((inputs.equity / results.totalInvestment) * 100).toFixed(1)} %)
- Darlehen: ${results.loanAmount.toLocaleString('de-DE')} €
- Zinssatz: ${inputs.interestRate} %, Tilgung: ${inputs.repaymentRate} %, Laufzeit: ${inputs.loanDuration} Jahre
- Beleihungsauslauf (LTV): ${results.loanToValue.toFixed(1)} %

**Mieteinnahmen**
- Kaltmiete: ${inputs.monthlyRent} €/Monat (${((inputs.monthlyRent * 12) / inputs.purchasePrice * 100).toFixed(2)} % Brutto-Rendite)
- Effektivmiete (nach Leerstand ${inputs.vacancyRate} %): ${results.monthlyEffectiveRent.toLocaleString('de-DE')} €/Monat

**Monatliche Kosten**
- Darlehensrate: ${results.monthlyLoanRepayment.toLocaleString('de-DE')} € (davon ${results.monthlyInterest.toLocaleString('de-DE')} € Zinsen, ${results.monthlyPrincipal.toLocaleString('de-DE')} € Tilgung)
- Instandhaltungsrücklage: ${results.monthlyMaintenance.toLocaleString('de-DE')} €/Monat
- Hausverwaltung (${inputs.propertyManagement} % der Miete): ${results.monthlyManagement.toLocaleString('de-DE')} €/Monat
- Sonstige Kosten: ${results.monthlyOtherCosts.toLocaleString('de-DE')} €/Monat
- Gesamtkosten/Monat: ${(results.monthlyLoanRepayment + results.monthlyMaintenance + results.monthlyManagement + results.monthlyOtherCosts).toLocaleString('de-DE')} €

**Cashflow**
- Monatlicher Cashflow: ${results.monthlyCashflow.toLocaleString('de-DE')} €
- Jährlicher Cashflow: ${results.annualCashflow.toLocaleString('de-DE')} €

**Renditekennzahlen**
- Brutto-Mietrendite: ${results.grossRentalYield.toFixed(2)} %
- Netto-Mietrendite: ${results.netRentalYield.toFixed(2)} %
- Eigenkapitalrendite: ${results.equityReturn.toFixed(2)} %
- Break-Even: ${results.breakEvenYears > 50 ? 'über 50 Jahre' : results.breakEvenYears + ' Jahre'}

**Deal Score: ${results.dealScore}/100 (${results.dealScoreLabel})**
- Rendite-Score: ${results.dealScoreBreakdown.yieldScore}/30
- Cashflow-Score: ${results.dealScoreBreakdown.cashflowScore}/25
- LTV-Score: ${results.dealScoreBreakdown.ltvScore}/25
- Leerstandsrisiko-Score: ${results.dealScoreBreakdown.vacancyScore}/20

Erstelle eine professionelle Investitionsanalyse mit genau diesen 4 Abschnitten (nutze diese exakten Überschriften):

## Fazit
Ein klares, prägnantes Urteil in 2-3 Sätzen. Ist das ein gutes Investment?

## Stärken
Maximal 3 konkrete Stärken dieses Investments mit Zahlen belegt. Kurze Bulletpoints.

## Risiken
Maximal 3 konkrete Risiken oder Schwachstellen mit Zahlen belegt. Kurze Bulletpoints.

## Empfehlungen
Maximal 3 konkrete, umsetzbare Handlungsempfehlungen für den Investor. Kurze Bulletpoints.

Schreibe professionell, direkt und faktenbasiert. Kein Fachjargon, keine allgemeinen Phrasen. Beziehe dich immer auf die konkreten Zahlen des Investments.`

  const stream = await client.messages.stream({
    model: 'claude-sonnet-4-6',
    max_tokens: 800,
    system: 'Du bist ein erfahrener Immobilien-Investmentberater mit 20 Jahren Erfahrung im deutschen Markt. Deine Analysen sind präzise, faktenbasiert und handlungsorientiert. Du antwortest ausschließlich auf Deutsch.',
    messages: [{ role: 'user', content: prompt }],
  })

  const encoder = new TextEncoder()
  const readable = new ReadableStream({
    async start(controller) {
      for await (const chunk of stream) {
        if (chunk.type === 'content_block_delta' && chunk.delta.type === 'text_delta') {
          controller.enqueue(encoder.encode(chunk.delta.text))
        }
      }
      controller.close()
    },
  })

  return new Response(readable, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8', 'Transfer-Encoding': 'chunked' },
  })
}
