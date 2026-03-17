import { NextRequest, NextResponse } from 'next/server'
import { calculateInvestment } from '@/lib/calculations'
import type { PropertyInputs } from '@/types'
import { z } from 'zod'

// Simple in-memory rate limiting
const rateLimitMap = new Map<string, { count: number; resetTime: number }>()
const RATE_LIMIT = 30 // requests per window
const RATE_WINDOW = 60 * 1000 // 1 minute

function checkRateLimit(ip: string): boolean {
  const now = Date.now()
  const existing = rateLimitMap.get(ip)

  if (!existing || now > existing.resetTime) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + RATE_WINDOW })
    return true
  }

  if (existing.count >= RATE_LIMIT) {
    return false
  }

  existing.count++
  return true
}

const PropertyInputsSchema = z.object({
  purchasePrice: z.number().positive(),
  propertySizeSqm: z.number().positive(),
  yearBuilt: z.number().int().min(1800).max(2030),
  location: z.string().min(1),
  federalState: z.string().min(1),
  grunderwerbsteuer: z.number().min(0).max(10),
  notarkosten: z.number().min(0).max(10),
  maklercourtage: z.number().min(0).max(10),
  equity: z.number().min(0),
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

export async function POST(req: NextRequest) {
  // Rate limiting
  const ip =
    req.headers.get('x-forwarded-for')?.split(',')[0] ||
    req.headers.get('x-real-ip') ||
    'unknown'

  if (!checkRateLimit(ip)) {
    return NextResponse.json(
      { error: 'Too many requests. Please try again later.' },
      { status: 429 }
    )
  }

  try {
    const body = await req.json()
    const parsed = PropertyInputsSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid input data', details: parsed.error.flatten() },
        { status: 400 }
      )
    }

    const inputs = parsed.data as PropertyInputs
    const results = calculateInvestment(inputs)

    return NextResponse.json({ results }, { status: 200 })
  } catch (error) {
    console.error('Calculation API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
