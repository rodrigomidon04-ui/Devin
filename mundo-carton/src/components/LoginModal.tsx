import { useState } from 'react'
import { Modal } from './Modal'
import { isSupabaseConfigured } from '../lib/api'

interface LoginModalProps {
  onClose: () => void
  onSignIn: (email: string, password: string) => Promise<void>
}

export function LoginModal({ onClose, onSignIn }: LoginModalProps) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault()
    setSaving(true)
    setError(null)
    try {
      await onSignIn(email.trim(), password)
      onClose()
    } catch (err) {
      setError((err as Error).message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <Modal title="Entrar" onClose={onClose}>
      <form onSubmit={handleSubmit} className="grid gap-4">
        <p className="text-sm text-carton-700">
          {isSupabaseConfigured
            ? 'Usá el correo y la contraseña de tu usuario de Supabase para cargar videos y productos.'
            : 'Modo demo: escribí cualquier correo para probar la carga de videos y productos en este navegador.'}
        </p>
        <label className="grid gap-1 text-sm font-bold text-black">
          Correo
          <input
            type="email"
            required
            autoComplete="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="rounded-xl border-2 border-black bg-white px-3 py-2 text-base font-normal outline-none focus:border-toon-pink"
          />
        </label>
        {isSupabaseConfigured ? (
          <label className="grid gap-1 text-sm font-bold text-black">
            Contraseña
            <input
              type="password"
              required
              autoComplete="current-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="rounded-xl border-2 border-black bg-white px-3 py-2 text-base font-normal outline-none focus:border-toon-pink"
            />
          </label>
        ) : null}
        {error ? (
          <p role="alert" className="rounded-xl bg-toon-pink/15 px-3 py-2 text-sm text-toon-pink">
            {error}
          </p>
        ) : null}
        <button
          type="submit"
          disabled={saving}
          className="rounded-full border-4 border-black bg-toon-cyan px-5 py-2.5 font-display uppercase tracking-wide text-black transition hover:bg-toon-yellow disabled:opacity-60"
        >
          {saving ? 'Entrando…' : 'Entrar'}
        </button>
      </form>
    </Modal>
  )
}
