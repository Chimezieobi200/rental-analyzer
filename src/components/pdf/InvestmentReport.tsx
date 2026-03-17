import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Font,
} from '@react-pdf/renderer'
import type { PropertyInputs, CalculationResults } from '@/types'
import { format } from 'date-fns'
import { de } from 'date-fns/locale'

interface InvestmentReportProps {
  inputs: PropertyInputs
  results: CalculationResults
}

// Register a standard font
Font.register({
  family: 'Helvetica',
  fonts: [
    { src: 'Helvetica' },
    { src: 'Helvetica-Bold', fontWeight: 'bold' },
  ],
})

const colors = {
  navy: '#0f172a',
  navyLight: '#1e293b',
  navyMid: '#334155',
  gold: '#f59e0b',
  white: '#ffffff',
  slate: '#94a3b8',
  slateLight: '#cbd5e1',
  green: '#4ade80',
  red: '#f87171',
  text: '#e2e8f0',
}

const styles = StyleSheet.create({
  page: {
    backgroundColor: colors.navy,
    color: colors.text,
    fontFamily: 'Helvetica',
    padding: 40,
    fontSize: 10,
  },
  coverPage: {
    backgroundColor: colors.navy,
    padding: 60,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    minHeight: '100%',
  },
  goldAccent: {
    width: 60,
    height: 4,
    backgroundColor: colors.gold,
    marginBottom: 24,
    borderRadius: 2,
  },
  h1: {
    fontSize: 32,
    fontWeight: 'bold',
    color: colors.white,
    marginBottom: 8,
  },
  h2: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.white,
    marginBottom: 16,
  },
  h3: {
    fontSize: 13,
    fontWeight: 'bold',
    color: colors.white,
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 14,
    color: colors.slate,
    marginBottom: 4,
  },
  label: {
    fontSize: 9,
    color: colors.slate,
    marginBottom: 2,
  },
  value: {
    fontSize: 12,
    fontWeight: 'bold',
    color: colors.white,
  },
  gold: {
    color: colors.gold,
  },
  green: {
    color: colors.green,
  },
  red: {
    color: colors.red,
  },
  section: {
    marginBottom: 28,
  },
  sectionHeader: {
    backgroundColor: colors.navyLight,
    padding: '8 12',
    borderRadius: 4,
    marginBottom: 12,
    borderLeft: `3px solid ${colors.gold}`,
  },
  row: {
    display: 'flex',
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  card: {
    flex: 1,
    backgroundColor: colors.navyLight,
    borderRadius: 6,
    padding: 12,
    border: `1px solid ${colors.navyMid}`,
  },
  table: {
    borderRadius: 6,
    overflow: 'hidden',
    border: `1px solid ${colors.navyMid}`,
  },
  tableHeader: {
    backgroundColor: colors.navyLight,
    flexDirection: 'row',
    padding: '8 12',
  },
  tableRow: {
    flexDirection: 'row',
    padding: '7 12',
    borderTop: `1px solid ${colors.navyMid}`,
  },
  tableRowAlt: {
    backgroundColor: '#1a2744',
  },
  tableCell: {
    flex: 1,
    fontSize: 9,
    color: colors.text,
  },
  tableCellRight: {
    flex: 1,
    fontSize: 9,
    color: colors.text,
    textAlign: 'right',
  },
  tableCellHeader: {
    flex: 1,
    fontSize: 9,
    color: colors.slate,
    fontWeight: 'bold',
  },
  tableCellHeaderRight: {
    flex: 1,
    fontSize: 9,
    color: colors.slate,
    fontWeight: 'bold',
    textAlign: 'right',
  },
  disclaimer: {
    fontSize: 8,
    color: '#475569',
    marginTop: 30,
    lineHeight: 1.5,
    borderTop: `1px solid ${colors.navyMid}`,
    paddingTop: 12,
  },
  scoreCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.navyMid,
    justifyContent: 'center',
    alignItems: 'center',
    border: `4px solid ${colors.gold}`,
  },
  scoreNumber: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.gold,
    textAlign: 'center',
  },
  pageNumber: {
    position: 'absolute',
    bottom: 24,
    right: 40,
    fontSize: 8,
    color: colors.slate,
  },
  footer: {
    position: 'absolute',
    bottom: 24,
    left: 40,
    right: 40,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTop: `1px solid ${colors.navyMid}`,
    paddingTop: 8,
  },
  footerText: {
    fontSize: 8,
    color: colors.slate,
  },
})

const fmtEur = (v: number) =>
  v.toLocaleString('de-DE', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 })

const fmtPct = (v: number) => `${v.toFixed(2).replace('.', ',')} %`

export function InvestmentReport({ inputs, results }: InvestmentReportProps) {
  const today = format(new Date(), 'dd. MMMM yyyy', { locale: de })

  const scoreColor =
    results.dealScore >= 80 ? colors.green : results.dealScore >= 60 ? colors.gold : colors.red
  const labelDE =
    results.dealScoreLabel === 'Excellent'
      ? 'Ausgezeichnet'
      : results.dealScoreLabel === 'Solid'
      ? 'Solide'
      : 'Risikoreich'

  return (
    <Document title="PropAnalyzer – Investitionsanalyse" author="PropAnalyzer">
      {/* ── Cover Page ───────────────────────────────────────────────────────── */}
      <Page size="A4" style={styles.page}>
        <View style={styles.coverPage}>
          <View style={styles.goldAccent} />
          <Text style={styles.h1}>Investitionsanalyse</Text>
          <Text style={[styles.subtitle, { marginBottom: 32 }]}>{inputs.location} • {today}</Text>

          {/* Score highlight */}
          <View
            style={{
              backgroundColor: colors.navyLight,
              borderRadius: 8,
              padding: 24,
              marginBottom: 32,
              border: `1px solid ${colors.navyMid}`,
              flexDirection: 'row',
              alignItems: 'center',
              gap: 20,
            }}
          >
            <View style={[styles.scoreCircle, { borderColor: scoreColor }]}>
              <Text style={[styles.scoreNumber, { color: scoreColor }]}>
                {results.dealScore}
              </Text>
            </View>
            <View>
              <Text style={[styles.label, { marginBottom: 4 }]}>Deal Score</Text>
              <Text style={[styles.h2, { color: scoreColor, marginBottom: 4, fontSize: 22 }]}>
                {labelDE}
              </Text>
              <Text style={styles.label}>0 = Schlecht | 100 = Ausgezeichnet</Text>
            </View>
          </View>

          {/* Key KPIs */}
          <View style={styles.row}>
            <View style={styles.card}>
              <Text style={styles.label}>Kaufpreis</Text>
              <Text style={styles.value}>{fmtEur(inputs.purchasePrice)}</Text>
            </View>
            <View style={styles.card}>
              <Text style={styles.label}>Gesamtinvestition</Text>
              <Text style={styles.value}>{fmtEur(results.totalInvestment)}</Text>
            </View>
          </View>
          <View style={styles.row}>
            <View style={styles.card}>
              <Text style={styles.label}>Nettomietrendite</Text>
              <Text style={[styles.value, styles.gold]}>{fmtPct(results.netRentalYield)}</Text>
            </View>
            <View style={styles.card}>
              <Text style={styles.label}>Monatl. Cashflow</Text>
              <Text
                style={[
                  styles.value,
                  results.monthlyCashflow >= 0 ? styles.green : styles.red,
                ]}
              >
                {results.monthlyCashflow >= 0 ? '+' : ''}{fmtEur(results.monthlyCashflow)}
              </Text>
            </View>
          </View>

          <View style={{ marginTop: 40 }}>
            <Text style={[styles.label, { fontSize: 9 }]}>
              Erstellt mit PropAnalyzer • propanalyzer.de
            </Text>
          </View>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>PropAnalyzer Investitionsanalyse</Text>
          <Text style={styles.footerText}>{today}</Text>
        </View>
      </Page>

      {/* ── Page 2: Assumptions + Key Metrics ───────────────────────────────── */}
      <Page size="A4" style={styles.page}>
        <Text style={[styles.h2, { marginBottom: 20 }]}>Eckdaten & Annahmen</Text>

        {/* Assumptions Table */}
        <View style={[styles.section]}>
          <View style={styles.sectionHeader}>
            <Text style={styles.h3}>Eingabeparameter</Text>
          </View>
          <View style={styles.table}>
            <View style={styles.tableHeader}>
              <Text style={styles.tableCellHeader}>Parameter</Text>
              <Text style={styles.tableCellHeaderRight}>Wert</Text>
            </View>
            {[
              ['Kaufpreis', fmtEur(inputs.purchasePrice)],
              ['Grunderwerbsteuer', fmtPct(inputs.grunderwerbsteuer)],
              ['Notarkosten', fmtPct(inputs.notarkosten)],
              ['Maklerprovision', fmtPct(inputs.maklercourtage)],
              ['Eigenkapital', fmtEur(inputs.equity)],
              ['Darlehensbetrag', fmtEur(results.loanAmount)],
              ['Zinssatz p.a.', fmtPct(inputs.interestRate)],
              ['Tilgungssatz p.a.', fmtPct(inputs.repaymentRate)],
              ['Darlehenslaufzeit', `${inputs.loanDuration} Jahre`],
              ['Kaltmiete/Monat', fmtEur(inputs.monthlyRent)],
              ['Mietsteigerung p.a.', fmtPct(inputs.rentIncreaseRate)],
              ['Leerstandsquote', fmtPct(inputs.vacancyRate)],
              ['Instandhaltung/Monat', fmtEur(inputs.maintenanceReserve)],
              ['Verwaltung', `${inputs.propertyManagement} % der Miete`],
            ].map(([label, value], idx) => (
              <View key={label} style={[styles.tableRow, idx % 2 === 1 ? styles.tableRowAlt : {}]}>
                <Text style={styles.tableCell}>{label}</Text>
                <Text style={styles.tableCellRight}>{value}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>PropAnalyzer • {inputs.location}</Text>
          <Text render={({ pageNumber, totalPages }) => `Seite ${pageNumber} von ${totalPages}`} style={styles.footerText} />
        </View>
      </Page>

      {/* ── Page 3: Financial Results ─────────────────────────────────────────── */}
      <Page size="A4" style={styles.page}>
        <Text style={[styles.h2, { marginBottom: 20 }]}>Finanzkennzahlen</Text>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.h3}>Rendite & Cashflow</Text>
          </View>
          <View style={styles.table}>
            <View style={styles.tableHeader}>
              <Text style={styles.tableCellHeader}>Kennzahl</Text>
              <Text style={styles.tableCellHeaderRight}>Wert</Text>
            </View>
            {[
              ['Brutto-Mietrendite', fmtPct(results.grossRentalYield)],
              ['Netto-Mietrendite', fmtPct(results.netRentalYield)],
              ['Eigenkapitalrendite', fmtPct(results.equityReturn)],
              ['Beleihungsauslauf (LTV)', fmtPct(results.loanToValue)],
              ['Monatl. Bruttomiete', fmtEur(results.monthlyGrossRent)],
              ['Monatl. Effektivmiete', fmtEur(results.monthlyEffectiveRent)],
              ['Monatl. Darlehensrate', fmtEur(results.monthlyLoanRepayment)],
              ['  davon Zinsen', fmtEur(results.monthlyInterest)],
              ['  davon Tilgung', fmtEur(results.monthlyPrincipal)],
              ['Monatl. Instandhaltung', fmtEur(results.monthlyMaintenance)],
              ['Monatl. Verwaltung', fmtEur(results.monthlyManagement)],
              ['Monatl. Cashflow', `${results.monthlyCashflow >= 0 ? '+' : ''}${fmtEur(results.monthlyCashflow)}`],
              ['Jahres-Cashflow', `${results.annualCashflow >= 0 ? '+' : ''}${fmtEur(results.annualCashflow)}`],
              ['Break-Even', results.breakEvenYears > 50 ? 'n/a' : `${results.breakEvenYears} Jahre`],
            ].map(([label, value], idx) => (
              <View key={label} style={[styles.tableRow, idx % 2 === 1 ? styles.tableRowAlt : {}]}>
                <Text style={styles.tableCell}>{label}</Text>
                <Text style={styles.tableCellRight}>{value}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>PropAnalyzer • {inputs.location}</Text>
          <Text render={({ pageNumber, totalPages }) => `Seite ${pageNumber} von ${totalPages}`} style={styles.footerText} />
        </View>
      </Page>

      {/* ── Page 4: 10-Year Projection ───────────────────────────────────────── */}
      <Page size="A4" style={styles.page}>
        <Text style={[styles.h2, { marginBottom: 20 }]}>10-Jahres-Projektion</Text>
        <Text style={[styles.label, { marginBottom: 12 }]}>
          Annahmen: {inputs.rentIncreaseRate}% jährliche Mietsteigerung, 2% Wertsteigerung p.a.
        </Text>

        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <Text style={[styles.tableCellHeader, { flex: 0.6 }]}>Jahr</Text>
            <Text style={styles.tableCellHeaderRight}>Jahresmiete</Text>
            <Text style={styles.tableCellHeaderRight}>Cashflow</Text>
            <Text style={styles.tableCellHeaderRight}>Kum. CF</Text>
            <Text style={styles.tableCellHeaderRight}>Obj.-Wert</Text>
            <Text style={styles.tableCellHeaderRight}>Eigenkapital</Text>
          </View>
          {results.tenYearProjection.map((row, idx) => (
            <View key={row.year} style={[styles.tableRow, idx % 2 === 1 ? styles.tableRowAlt : {}]}>
              <Text style={[styles.tableCell, { flex: 0.6 }]}>Jahr {row.year}</Text>
              <Text style={styles.tableCellRight}>{fmtEur(row.annualRent)}</Text>
              <Text style={[styles.tableCellRight, { color: row.cashflow >= 0 ? colors.green : colors.red }]}>
                {row.cashflow >= 0 ? '+' : ''}{fmtEur(row.cashflow)}
              </Text>
              <Text style={[styles.tableCellRight, { color: row.cumulativeCashflow >= 0 ? colors.green : colors.red }]}>
                {fmtEur(row.cumulativeCashflow)}
              </Text>
              <Text style={[styles.tableCellRight, { color: colors.gold }]}>{fmtEur(row.propertyValue)}</Text>
              <Text style={[styles.tableCellRight, { fontWeight: 'bold' }]}>{fmtEur(row.equity)}</Text>
            </View>
          ))}
        </View>

        <Text style={styles.disclaimer}>
          RECHTLICHER HINWEIS: Diese Analyse wurde von PropAnalyzer automatisch erstellt und dient ausschließlich zur
          informativen Orientierung. Sie stellt keine Anlage-, Steuer- oder Rechtsberatung dar. Alle Berechnungen
          basieren auf den eingegebenen Daten und enthalten Schätzungen und Prognosen, die mit Unsicherheiten behaftet
          sind. Tatsächliche Ergebnisse können erheblich abweichen. Bitte konsultiere vor jeder Investitionsentscheidung
          einen qualifizierten Finanz- oder Steuerberater. PropAnalyzer übernimmt keine Haftung für Entscheidungen,
          die auf Basis dieser Analyse getroffen werden.
        </Text>

        <View style={styles.footer}>
          <Text style={styles.footerText}>PropAnalyzer • {inputs.location} • {today}</Text>
          <Text render={({ pageNumber, totalPages }) => `Seite ${pageNumber} von ${totalPages}`} style={styles.footerText} />
        </View>
      </Page>
    </Document>
  )
}
