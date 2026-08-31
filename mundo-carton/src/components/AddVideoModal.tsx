import { useState } from 'react'
import { Modal } from './Modal'
import { MAX_FILE_BYTES, createVideo } from '../lib/api'
import { videoCategories } from '../lib/labels'
import type { Video, VideoCategory } from '../lib/types'

interface AddVideoModalProps {
  onClose: () => void
  onCreated: (video: Video) => void
}

type Source = 'link' | 'file'

export function AddVideoModal({ onClose, onCreated }: AddVideoModalProps) {
  const [source, setSource] = useState<Source>('link')
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState<VideoCategory>('juguetes')
  const [url, setUrl] = useState('')
  const [file, setFile] = useState<File | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault()
    setError(null)

    if (source === 'link') {
      try {
        new URL(url.trim())
      } catch {
        setError('Pegá una dirección web completa, por ejemplo https://youtu.be/…')
        return
      }
    } else {
      if (!file) {
        setError('Elegí el archivo de video')
        return
      }
      if (file.size > MAX_FILE_BYTES) {
        setError('El video es muy grande (máximo 50 MB)')
        return
      }
    }

    setSaving(true)
    try {
      const video = await createVideo({
        title: title.trim(),
        description: description.trim(),
        category,
        url: source === 'link' ? url.trim() : undefined,
        file: source === 'file' ? (file ?? undefined) : undefined,
      })
      onCreated(video)
    } catch (err) {
      setError((err as Error).message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <Modal title="Subir video" onClose={onClose}>
      <form onSubmit={handleSubmit} className="grid gap-4">
        <div className="flex gap-2">
          {(['link', 'file'] as Source[]).map((value) => (
            <button
              key={value}
              type="button"
              onClick={() => {
                setSource(value)
                setError(null)
              }}
              className={`flex-1 rounded-full border-2 border-black px-4 py-2 text-sm font-extrabold uppercase ${
                source === value ? 'bg-toon-yellow text-black' : 'bg-white text-carton-700'
              }`}
            >
              {value === 'link' ? 'Enlace de YouTube' : 'Archivo de video'}
            </button>
          ))}
        </div>

        <label className="grid gap-1 text-sm font-bold text-black">
          Título
          <input
            required
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            className="rounded-xl border-2 border-black bg-white px-3 py-2 text-base font-normal outline-none focus:border-toon-pink"
          />
        </label>

        {source === 'link' ? (
          <label className="grid gap-1 text-sm font-bold text-black">
            Dirección del video
            <input
              type="url"
              required
              placeholder="https://youtu.be/…"
              value={url}
              onChange={(event) => {
                setUrl(event.target.value)
                setError(null)
              }}
              className="rounded-xl border-2 border-black bg-white px-3 py-2 text-base font-normal outline-none focus:border-toon-pink"
            />
          </label>
        ) : (
          <label className="grid gap-1 text-sm font-bold text-black">
            Archivo (MP4, WEBM · hasta 50 MB)
            <input
              type="file"
              accept="video/mp4,video/webm,video/quicktime"
              onChange={(event) => {
                setFile(event.target.files?.[0] ?? null)
                setError(null)
              }}
              className="rounded-xl border-2 border-black bg-white px-3 py-2 text-sm font-normal"
            />
          </label>
        )}

        <label className="grid gap-1 text-sm font-bold text-black">
          Categoría
          <select
            value={category}
            onChange={(event) => setCategory(event.target.value as VideoCategory)}
            className="rounded-xl border-2 border-black bg-white px-3 py-2 text-base font-normal outline-none focus:border-toon-pink"
          >
            {videoCategories.map((option) => (
              <option key={option.value} value={option.value}>
                {option.emoji} {option.label}
              </option>
            ))}
          </select>
        </label>

        <label className="grid gap-1 text-sm font-bold text-black">
          Descripción (opcional)
          <textarea
            rows={3}
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            className="rounded-xl border-2 border-black bg-white px-3 py-2 text-base font-normal outline-none focus:border-toon-pink"
          />
        </label>

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
          {saving ? 'Guardando…' : 'Guardar video'}
        </button>
      </form>
    </Modal>
  )
}
