import { useState, type FormEvent } from 'react'
import { createItem } from '../lib/api'
import type { ItemKind, PortfolioItem } from '../lib/types'
import { ImageIcon, LinkIcon, TextIcon } from './Icons'
import { Modal } from './Modal'

const MAX_FILE_BYTES = 10 * 1024 * 1024

const kinds: { value: ItemKind; label: string; icon: typeof ImageIcon }[] = [
  { value: 'image', label: 'Imagen', icon: ImageIcon },
  { value: 'text', label: 'Texto', icon: TextIcon },
  { value: 'link', label: 'Enlace', icon: LinkIcon },
]

const accept: Record<ItemKind, string> = {
  image: 'image/png,image/jpeg,image/webp,image/gif',
  text: '.txt,.md,text/plain,text/markdown',
  link: '',
}

interface AddItemModalProps {
  onClose: () => void
  onCreated: (item: PortfolioItem) => void
}

export function AddItemModal({ onClose, onCreated }: AddItemModalProps) {
  const [kind, setKind] = useState<ItemKind>('image')
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [url, setUrl] = useState('')
  const [file, setFile] = useState<File | null>(null)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const inputClass =
    'w-full rounded-xl border border-white/10 bg-slate-950/60 px-4 py-3 text-base text-white placeholder:text-slate-500 focus:border-indigo-400 focus:outline-none'

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()
    setError(null)

    if (kind === 'link') {
      if (!/^https?:\/\/.+/i.test(url.trim())) {
        setError('Escribí un enlace válido que empiece con https://')
        return
      }
    } else if (!file) {
      setError('Elegí un archivo para subir')
      return
    } else if (file.size > MAX_FILE_BYTES) {
      setError('El archivo supera los 10 MB')
      return
    }

    setSaving(true)
    try {
      const item = await createItem({
        title: title.trim() || file?.name || url.trim(),
        description: description.trim(),
        kind,
        url: kind === 'link' ? url.trim() : undefined,
        file: kind === 'link' ? undefined : (file ?? undefined),
      })
      onCreated(item)
    } catch (err) {
      setError((err as Error).message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <Modal title="Agregar al portfolio" onClose={onClose}>
      <form noValidate onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="grid grid-cols-3 gap-2">
          {kinds.map(({ value, label, icon: Icon }) => (
            <button
              key={value}
              type="button"
              onClick={() => {
                setKind(value)
                setFile(null)
                setError(null)
              }}
              className={`flex flex-col items-center gap-1 rounded-xl border px-2 py-3 text-sm transition ${
                kind === value
                  ? 'border-indigo-400 bg-indigo-500/20 text-white'
                  : 'border-white/10 bg-white/5 text-slate-300 hover:bg-white/10'
              }`}
            >
              <Icon />
              {label}
            </button>
          ))}
        </div>

        {kind === 'link' ? (
          <label className="flex flex-col gap-2 text-sm text-slate-300">
            Dirección web
            <input
              type="url"
              inputMode="url"
              value={url}
              onChange={(event) => {
                setUrl(event.target.value)
                setError(null)
              }}
              placeholder="https://mi-otra-pagina.com"
              className={inputClass}
            />
          </label>
        ) : (
          <label className="flex flex-col gap-2 text-sm text-slate-300">
            Archivo {kind === 'image' ? '(PNG, JPG, WEBP)' : '(TXT, MD)'}
            <input
              type="file"
              accept={accept[kind]}
              onChange={(event) => {
                setFile(event.target.files?.[0] ?? null)
                setError(null)
              }}
              className="w-full rounded-xl border border-dashed border-white/20 bg-slate-950/60 px-4 py-3 text-sm text-slate-300 file:mr-3 file:rounded-lg file:border-0 file:bg-indigo-500 file:px-3 file:py-2 file:text-white"
            />
          </label>
        )}

        <label className="flex flex-col gap-2 text-sm text-slate-300">
          Título
          <input
            type="text"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="Nombre del trabajo"
            className={inputClass}
          />
        </label>

        <label className="flex flex-col gap-2 text-sm text-slate-300">
          Descripción (opcional)
          <textarea
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            rows={3}
            placeholder="Contá de qué se trata"
            className={inputClass}
          />
        </label>

        {error ? (
          <p role="alert" className="rounded-xl bg-red-500/15 px-4 py-3 text-sm text-red-200">
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
