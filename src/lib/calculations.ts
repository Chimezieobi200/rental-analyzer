import type {
  PropertyInputs,
  CalculationResults,
  AmortizationEntry,
  YearlyProjection,
} from '@/types'

export function calculateInvestment(inputs: PropertyInputs): CalculationResults {
  const {
    purchasePrice,
    grunderwerbsteuer,
    notarkosten,
    maklercourtage,
    equity,
    interestRate,
    loanDuration,
    repaymentRate,
    monthlyRent,
    rentIncreaseRate,
    maintenanceReserve,
    propertyManagement,
    vacancyRate,
    additionalCosts,
  } = inputs

  // ─── Buying Costs ────────────────────────────────────────────────────────────
  const grunderwerbsteuerAmount = purchasePrice * (grunderwerbsteuer / 100)
  const notarkostenAmount = purchasePrice * (notarkosten / 100)
  const maklercourtageAmount = purchasePrice * (maklercourtage / 100)
  const totalBuyingCosts = grunderwerbsteuerAmount + notarkostenAmount + maklercourtageAmount
  const totalInvestment = purchasePrice + totalBuyingCosts
  const loanAmount = Math.max(0, totalInvestment - equity)

  // ─── Loan / Annuität ─────────────────────────────────────────────────────────
  // German Annuitätendarlehen: fixed monthly payment = (interest% + repayment%) / 12 * loanAmount
  const annualRate = (interestRate + repaymentRate) / 100
  const monthlyLoanRepayment = loanAmount > 0 ? (annualRate / 12) * loanAmount : 0
  const monthlyInterestRate = interestRate / 100 / 12

  // ─── Rental Income ───────────────────────────────────────────────────────────
  const monthlyGrossRent = monthlyRent
  const vacancyFactor = 1 - vacancyRate / 100
  const monthlyEffectiveRent = monthlyGrossRent * vacancyFactor

  // ─── Monthly Costs ───────────────────────────────────────────────────────────
  const monthlyManagement = monthlyEffectiveRent * (propertyManagement / 100)
  const monthlyMaintenance = maintenanceReserve
  const monthlyOtherCosts = additionalCosts

  const totalMonthlyCosts =
    monthlyLoanRepayment + monthlyManagement + monthlyMaintenance + monthlyOtherCosts

  const monthlyCashflow = monthlyEffectiveRent - totalMonthlyCosts

  // ─── Monthly Interest / Principal split (month 1) ────────────────────────────
  const firstMonthInterest = loanAmount * monthlyInterestRate
  const firstMonthPrincipal = monthlyLoanRepayment - firstMonthInterest

  // ─── Annual figures ───────────────────────────────────────────────────────────
  const annualCashflow = monthlyCashflow * 12
  const annualRent = monthlyEffectiveRent * 12
  const annualCosts =
    (monthlyManagement + monthlyMaintenance + monthlyOtherCosts) * 12
  const annualProfit = annualRent - annualCosts - monthlyLoanRepayment * 12

  // ─── Yields ───────────────────────────────────────────────────────────────────
  const grossRentalYield = purchasePrice > 0
    ? (monthlyGrossRent * 12) / purchasePrice * 100
    : 0

  const annualNetIncome =
    monthlyEffectiveRent * 12 - (monthlyManagement + monthlyMaintenance + monthlyOtherCosts) * 12
  const netRentalYield = purchasePrice > 0 ? (annualNetIncome / purchasePrice) * 100 : 0

  // ─── Equity Return ────────────────────────────────────────────────────────────
  // Annual net income / equity invested
  const equityReturn = equity > 0 ? (annualNetIncome / equity) * 100 : 0

  // ─── LTV ─────────────────────────────────────────────────────────────────────
  const loanToValue = purchasePrice > 0 ? (loanAmount / purchasePrice) * 100 : 0

  // ─── Amortization Schedule ───────────────────────────────────────────────────
  const amortizationSchedule: AmortizationEntry[] = []
  let balance = loanAmount

  const totalMonths = loanDuration * 12

  for (let m = 1; m <= totalMonths; m++) {
    if (balance <= 0) {
      amortizationSchedule.push({
        month: m,
        year: Math.ceil(m / 12),
        payment: 0,
        principal: 0,
        interest: 0,
        balance: 0,
      })
      continue
    }

    const interestPortion = balance * monthlyInterestRate
    const principalPortion = Math.min(monthlyLoanRepayment - interestPortion, balance)
    const actualPayment = interestPortion + principalPortion
    balance = Math.max(0, balance - principalPortion)

    amortizationSchedule.push({
      month: m,
      year: Math.ceil(m / 12),
      payment: actualPayment,
      principal: principalPortion,
      interest: interestPortion,
      balance: balance,
    })
  }

  // ─── Break-Even ───────────────────────────────────────────────────────────────
  // How many years until cumulative cashflow covers total buying costs (Nebenkosten)
  let cumulativeCF = 0
  let breakEvenYears = -1
  let currentRent = monthlyEffectiveRent
  let currentBalance = loanAmount

  for (let yr = 1; yr <= 50; yr++) {
    const yearlyRent = currentRent * 12
    const yearlyManagement = yearlyRent * (propertyManagement / 100)
    const yearlyOther = (maintenanceReserve + additionalCosts) * 12
    const yearlyLoan = monthlyLoanRepayment * 12
    const yearlyCF = yearlyRent - yearlyManagement - yearlyOther - yearlyLoan
    cumulativeCF += yearlyCF
    currentRent = currentRent * (1 + rentIncreaseRate / 100)
    if (cumulativeCF >= totalBuyingCosts && breakEvenYears === -1) {
      breakEvenYears = yr
    }
  }
  if (breakEvenYears === -1) breakEvenYears = 999

  // ─── 10-Year Projection ───────────────────────────────────────────────────────
  const tenYearProjection: YearlyProjection[] = []
  let projRent = monthlyEffectiveRent
  let projBalance = loanAmount
  let cumCashflow = 0
  const propertyAppreciation = 0.02 // 2% per year

  for (let yr = 1; yr <= 10; yr++) {
    const yearlyRentIncome = projRent * 12
    const yearlyManagementCost = yearlyRentIncome * (propertyManagement / 100)
    const yearlyOtherCosts = (maintenanceReserve + additionalCosts) * 12
    const yearlyLoanPayment = monthlyLoanRepayment * 12
    const yearlyCosts = yearlyManagementCost + yearlyOtherCosts
    const yearlyCashflow = yearlyRentIncome - yearlyCosts - yearlyLoanPayment

    cumCashflow += yearlyCashflow

    // Update loan balance for this year
    let yearEndBalance = projBalance
    for (let m = 0; m < 12; m++) {
      if (yearEndBalance <= 0) break
      const iP = yearEndBalance * monthlyInterestRate
      const pP = Math.min(monthlyLoanRepayment - iP, yearEndBalance)
      yearEndBalance = Math.max(0, yearEndBalance - pP)
    }
    projBalance = yearEndBalance

    const propertyValue = purchasePrice * Math.pow(1 + propertyAppreciation, yr)
    const equityValue = propertyValue - projBalance
    const netWorth = equityValue + cumCashflow

    tenYearProjection.push({
      year: yr,
      annualRent: yearlyRentIncome,
      annualCosts: yearlyCosts,
      annualLoanPayment: yearlyLoanPayment,
      cashflow: yearlyCashflow,
      cumulativeCashflow: cumCashflow,
      loanBalance: projBalance,
      propertyValue: propertyValue,
      equity: equityValue,
      netWorth: netWorth,
    })

    projRent = projRent * (1 + rentIncreaseRate / 100)
  }

  // ─── Deal Score ───────────────────────────────────────────────────────────────
  const yieldScore =
    netRentalYield >= 5 ? 30 : netRentalYield >= 4 ? 20 : netRentalYield >= 3 ? 10 : 0

  const cashflowScore =
    monthlyCashflow >= 0 ? 25 : monthlyCashflow >= -100 ? 15 : monthlyCashflow >= -300 ? 5 : 0

  const ltvScore =
    loanToValue <= 70 ? 25 : loanToValue <= 80 ? 15 : loanToValue <= 90 ? 5 : 0

  const vacancyScore =
    vacancyRate <= 3 ? 20 : vacancyRate <= 5 ? 15 : vacancyRate <= 8 ? 10 : 0

  let score = Math.min(100, Math.max(0, yieldScore + cashflowScore + ltvScore + vacancyScore))

  let dealScoreLabel: 'Excellent' | 'Solid' | 'Risky'
  let dealScoreColor: string

  if (score >= 80) {
    dealScoreLabel = 'Excellent'
    dealScoreColor = 'text-green-400'
  } else if (score >= 60) {
    dealScoreLabel = 'Solid'
    dealScoreColor = 'text-gold-500'
  } else {
    dealScoreLabel = 'Risky'
    dealScoreColor = 'text-red-400'
  }

  return {
    grunderwerbsteuerAmount,
    notarkostenAmount,
    maklercourtageAmount,
    totalBuyingCosts,
    totalInvestment,
    loanAmount,
    grossRentalYield,
    netRentalYield,
    monthlyGrossRent,
    monthlyEffectiveRent,
    monthlyLoanRepayment,
    monthlyInterest: firstMonthInterest,
    monthlyPrincipal: firstMonthPrincipal,
    monthlyMaintenance,
    monthlyManagement,
    monthlyOtherCosts,
    monthlyCashflow,
    annualCashflow,
    annualProfit,
    equityReturn,
    breakEvenYears,
    loanToValue,
    dealScore: score,
    dealScoreLabel,
    dealScoreColor,
    dealScoreBreakdown: { yieldScore, cashflowScore, ltvScore, vacancyScore },
    amortizationSchedule,
    tenYearProjection,
  }
}
