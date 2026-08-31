import { useState, type FormEvent } from 'react'
import { saveProfile } from '../lib/api'
import type { Profile } from '../lib/types'
import { fileInputClass, inputClass, labelClass } from './ItemFormModal'
import { Modal } from './Modal'

interface ProfileModalProps {
  profile: Profile
  onClose: () => void
  onSaved: (profile: Profile) => void
}

export function ProfileModal({ profile, onClose, onSaved }: ProfileModalProps) {
  const [title, setTitle] = useState(profile.title)
  const [subtitle, setSubtitle] = useState(profile.subtitle)
  const [avatar, setAvatar] = useState<File | null>(null)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()
    setSaving(true)
    setError(null)
    try {
      const saved = await saveProfile(
        { title: title.trim(), subtitle: subtitle.trim(), avatar_url: profile.avatar_url },
        avatar ?? undefined,
      )
      onSaved(saved)
    } catch (err) {
      setError((err as Error).message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <Modal title="Editar perfil" onClose={onClose}>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <label className={labelClass}>
          Nombre / título
          <input
            type="text"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="Mi Portfolio"
            className={inputClass}
          />
        </label>

        <label className={labelClass}>
          Descripción corta
          <textarea
            value={subtitle}
            onChange={(event) => setSubtitle(event.target.value)}
            rows={3}
            placeholder="Qué hacés y qué vas a mostrar acá"
            className={inputClass}
          />
        </label>

        <label className={labelClass}>
          Foto de perfil (opcional)
          <input
            type="file"
            accept="image/png,image/jpeg,image/webp"
            onChange={(event) => setAvatar(event.target.files?.[0] ?? null)}
            className={fileInputClass}
          />
        </label>

        {error ? (
          <p role="alert" className="rounded-xl bg-red-500/15 px-4 py-3 text-sm text-red-700 dark:text-red-200">
            {error}
          </p>
        ) : null}

        <button
          type="submit"
          disabled={saving}
          className="rounded-xl bg-indigo-500 px-4 py-3 font-medium text-white transition hover:bg-indigo-400 disabled:opacity-60"
        >
          {saving ? 'Guardando…' : 'Guardar'}
        </button>
      </form>
    </Modal>
  )
}
