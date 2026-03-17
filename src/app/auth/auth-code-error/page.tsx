import Link from 'next/link'
import { AlertCircle } from 'lucide-react'

export default function AuthCodeErrorPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-navy-950 px-4">
      <div className="w-full max-w-md rounded-2xl border border-red-500/30 bg-navy-900 p-8 text-center">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-red-500/10">
          <AlertCircle className="h-7 w-7 text-red-400" />
        </div>
        <h1 className="mb-2 text-xl font-bold text-white">Anmeldung fehlgeschlagen</h1>
        <p className="mb-6 text-sm text-slate-400">
          Der Bestätigungslink ist abgelaufen oder ungültig. Bitte versuche es erneut.
        </p>
        <div className="flex flex-col gap-3">
          <Link
            href="/auth/login"
            className="block w-full rounded-xl bg-gold-500 py-3 text-center text-sm font-semibold text-navy-950 hover:bg-gold-400"
          >
            Erneut anmelden
          </Link>
          <Link
            href="/"
            className="block w-full rounded-xl border border-navy-700 py-3 text-center text-sm font-medium text-slate-300 hover:border-slate-500 hover:text-white"
          >
            Zur Startseite
          </Link>
        </div>
      </div>
    </div>
  )
}
