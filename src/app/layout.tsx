import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Navbar } from '@/components/navigation/Navbar'

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
})

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
}

export const metadata: Metadata = {
  title: 'PropAnalyzer | Immobilien-Investment-Analyse',
  description:
    'Analysiere jede deutsche Kapitalanlageimmobilie in 60 Sekunden. Mietrendite, Cashflow, Deal Score und 10-Jahres-Projektion.',
  keywords: [
    'Immobilien',
    'Rendite',
    'Kapitalanlage',
    'Mietrendite',
    'Immobilienrechner',
    'Deutschland',
    'Investment',
  ],
  authors: [{ name: 'PropAnalyzer' }],
  openGraph: {
    title: 'PropAnalyzer | Immobilien-Investment-Analyse',
    description: 'Analysiere jede Kapitalanlageimmobilie in 60 Sekunden.',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="de" className={inter.variable}>
      <body className="min-h-screen bg-ink-50 text-ink-900 antialiased">
        <Navbar />
        <main>{children}</main>
      </body>
    </html>
  )
}
