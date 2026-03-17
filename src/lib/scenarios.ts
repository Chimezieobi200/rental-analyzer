import type { PropertyInputs, ScenarioInputs } from '@/types'

export function applyScenario(
  base: PropertyInputs,
  scenario: ScenarioInputs
): PropertyInputs {
  const modified = { ...base }

  // Adjust interest rate
  modified.interestRate = Math.max(0, base.interestRate + scenario.interestRateChange)

  // Adjust rent (percentage change)
  modified.monthlyRent = base.monthlyRent * (1 + scenario.rentChange / 100)

  // Adjust vacancy rate based on extra vacancy months
  // vacancyMonths = extra months per year beyond base vacancy
  const baseVacancyMonths = (base.vacancyRate / 100) * 12
  const totalVacancyMonths = Math.min(12, baseVacancyMonths + scenario.vacancyMonths)
  modified.vacancyRate = (totalVacancyMonths / 12) * 100

  return modified
}

export function getScenarioDefaults(): ScenarioInputs {
  return {
    interestRateChange: 0,
    rentChange: 0,
    vacancyMonths: 0,
    sellAfterYears: null,
  }
}

export const SCENARIO_PRESETS = [
  {
    name: 'Zinsanstieg',
    description: 'Zinsen steigen um 2%',
    scenario: {
      interestRateChange: 2,
      rentChange: 0,
      vacancyMonths: 0,
      sellAfterYears: null,
    } as ScenarioInputs,
  },
  {
    name: 'Mietausfall',
    description: '3 Monate Leerstand zusätzlich',
    scenario: {
      interestRateChange: 0,
      rentChange: 0,
      vacancyMonths: 3,
      sellAfterYears: null,
    } as ScenarioInputs,
  },
  {
    name: 'Optimistisch',
    description: 'Miete +10%, Zinsen stabil',
    scenario: {
      interestRateChange: 0,
      rentChange: 10,
      vacancyMonths: 0,
      sellAfterYears: null,
    } as ScenarioInputs,
  },
  {
    name: 'Stresstest',
    description: 'Zinsen +2%, Miete -10%, 2 Monate Leerstand',
    scenario: {
      interestRateChange: 2,
      rentChange: -10,
      vacancyMonths: 2,
      sellAfterYears: null,
    } as ScenarioInputs,
  },
]
