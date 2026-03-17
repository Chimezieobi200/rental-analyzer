export interface PropertyInputs {
  // Property
  purchasePrice: number
  propertySizeSqm: number
  yearBuilt: number
  location: string
  federalState: string

  // German buying costs
  grunderwerbsteuer: number // 3.5-6.5% (state-dependent)
  notarkosten: number // default 1.5%
  maklercourtage: number // default 3.57%

  // Financing
  equity: number
  interestRate: number // annual %
  loanDuration: number // years
  repaymentRate: number // annual %

  // Rental
  monthlyRent: number
  rentIncreaseRate: number // annual %

  // Costs
  maintenanceReserve: number // €/month
  propertyManagement: number // % of rent
  vacancyRate: number // % (e.g. 5 = 5%)
  additionalCosts: number // €/month
}

export interface AmortizationEntry {
  month: number
  year: number
  payment: number
  principal: number
  interest: number
  balance: number
}

export interface YearlyProjection {
  year: number
  annualRent: number
  annualCosts: number
  annualLoanPayment: number
  cashflow: number
  cumulativeCashflow: number
  loanBalance: number
  propertyValue: number
  equity: number
  netWorth: number
}

export interface CalculationResults {
  // Purchase
  grunderwerbsteuerAmount: number
  notarkostenAmount: number
  maklercourtageAmount: number
  totalBuyingCosts: number
  totalInvestment: number
  loanAmount: number

  // Yields
  grossRentalYield: number // %
  netRentalYield: number // %

  // Monthly cashflow
  monthlyGrossRent: number
  monthlyEffectiveRent: number // after vacancy
  monthlyLoanRepayment: number
  monthlyInterest: number
  monthlyPrincipal: number
  monthlyMaintenance: number
  monthlyManagement: number
  monthlyOtherCosts: number
  monthlyCashflow: number

  // Annual
  annualCashflow: number
  annualProfit: number

  // Returns
  equityReturn: number // % return on equity invested

  // Break-even
  breakEvenYears: number

  // LTV
  loanToValue: number // %

  // Deal score 0-100
  dealScore: number
  dealScoreLabel: 'Excellent' | 'Solid' | 'Risky'
  dealScoreColor: string
  dealScoreBreakdown: {
    yieldScore: number      // max 30
    cashflowScore: number   // max 25
    ltvScore: number        // max 25
    vacancyScore: number    // max 20
  }

  // Loan amortization
  amortizationSchedule: AmortizationEntry[]

  // 10-year projection
  tenYearProjection: YearlyProjection[]
}

export interface ScenarioInputs {
  interestRateChange: number // e.g. +1
  rentChange: number // e.g. +2%
  vacancyMonths: number // extra vacancy months per year
  sellAfterYears: number | null
}

export interface Profile {
  id: string
  email: string
  full_name: string | null
  subscription_status: 'free' | 'pro'
  stripe_customer_id: string | null
  stripe_subscription_id: string | null
  analyses_count: number
  created_at: string
  updated_at: string
}

export interface Analysis {
  id: string
  user_id: string
  name: string
  location: string
  inputs: PropertyInputs
  results: CalculationResults
  created_at: string
  updated_at: string
}

export interface GermanState {
  name: string
  grunderwerbsteuer: number
}

export const GERMAN_STATES: GermanState[] = [
  { name: 'Bayern', grunderwerbsteuer: 3.5 },
  { name: 'Sachsen', grunderwerbsteuer: 3.5 },
  { name: 'Hamburg', grunderwerbsteuer: 5.5 },
  { name: 'Baden-Württemberg', grunderwerbsteuer: 5.0 },
  { name: 'Niedersachsen', grunderwerbsteuer: 5.0 },
  { name: 'Rheinland-Pfalz', grunderwerbsteuer: 5.0 },
  { name: 'Sachsen-Anhalt', grunderwerbsteuer: 5.0 },
  { name: 'Berlin', grunderwerbsteuer: 6.0 },
  { name: 'Hessen', grunderwerbsteuer: 6.0 },
  { name: 'Mecklenburg-Vorpommern', grunderwerbsteuer: 6.0 },
  { name: 'Thüringen', grunderwerbsteuer: 6.5 },
  { name: 'Brandenburg', grunderwerbsteuer: 6.5 },
  { name: 'Nordrhein-Westfalen', grunderwerbsteuer: 6.5 },
  { name: 'Saarland', grunderwerbsteuer: 6.5 },
  { name: 'Schleswig-Holstein', grunderwerbsteuer: 6.5 },
  { name: 'Bremen', grunderwerbsteuer: 5.0 },
]
