import { useState, type FormEvent } from 'react'
import { isSupabaseConfigured } from '../lib/api'
import { inputClass, labelClass } from './ItemFormModal'
import { Modal } from './Modal'

interface LoginModalProps {
  onClose: () => void
  onSignIn: (email: string, password: string) => Promise<void>
}

export function LoginModal({ onClose, onSignIn }: LoginModalProps) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()
    setBusy(true)
    setError(null)
    try {
      await onSignIn(email.trim(), password)
      onClose()
    } catch (err) {
      setError((err as Error).message)
    } finally {
      setBusy(false)
    }
  }

  return (
    <Modal title="Entrar como dueño" onClose={onClose}>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {!isSupabaseConfigured ? (
          <p className="rounded-xl bg-amber-500/15 px-4 py-3 text-sm text-amber-700 dark:text-amber-200">
            Modo demo: todavía no hay Supabase conectado, así que tus archivos se
            guardan solo en este navegador. Escribí cualquier correo para entrar.
          </p>
        ) : null}

        <label className={labelClass}>
          Correo
          <input
            type="email"
            autoComplete="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className={inputClass}
            placeholder="vos@correo.com"
          />
        </label>

        {isSupabaseConfigured ? (
          <label className={labelClass}>
            Contraseña
            <input
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className={inputClass}
            />
          </label>
        ) : null}

        {error ? (
          <p role="alert" className="rounded-xl bg-red-500/15 px-4 py-3 text-sm text-red-700 dark:text-red-200">
            {error}
          </p>
        ) : null}

        <button
          type="submit"
          disabled={busy}
          className="rounded-xl bg-indigo-500 px-4 py-3 font-medium text-white transition hover:bg-indigo-400 disabled:opacity-60"
        >
          {busy ? 'Entrando…' : 'Entrar'}
        </button>
      </form>
    </Modal>
  )
}
