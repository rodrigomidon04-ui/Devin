import { useState, type FormEvent } from 'react'
import { createItem, updateItem } from '../lib/api'
import type { ItemKind, PortfolioItem } from '../lib/types'
import {
  ImageIcon,
  LinkIcon,
  PdfIcon,
  TextIcon,
  VideoIcon,
} from './Icons'
import { Modal } from './Modal'

const MAX_FILE_BYTES = 50 * 1024 * 1024

const kinds: { value: ItemKind; label: string; icon: typeof ImageIcon }[] = [
  { value: 'image', label: 'Imagen', icon: ImageIcon },
  { value: 'text', label: 'Texto', icon: TextIcon },
  { value: 'link', label: 'Enlace', icon: LinkIcon },
  { value: 'pdf', label: 'PDF', icon: PdfIcon },
  { value: 'video', label: 'Video', icon: VideoIcon },
]

const accept: Record<ItemKind, string> = {
  image: 'image/png,image/jpeg,image/webp,image/gif',
  text: '.txt,.md,text/plain,text/markdown',
  link: '',
  pdf: 'application/pdf',
  video: 'video/mp4,video/webm,video/quicktime',
}

const fileHint: Record<ItemKind, string> = {
  image: '(PNG, JPG, WEBP)',
  text: '(TXT, MD)',
  link: '',
  pdf: '(PDF)',
  video: '(MP4, WEBM, MOV)',
}

export const inputClass =
  'w-full rounded-xl border border-black/10 bg-white px-4 py-3 text-base text-slate-900 placeholder:text-slate-400 focus:border-indigo-400 focus:outline-none dark:border-white/10 dark:bg-slate-950/60 dark:text-white dark:placeholder:text-slate-500'

export const fileInputClass =
  'w-full rounded-xl border border-dashed border-black/20 bg-white px-4 py-3 text-sm text-slate-600 file:mr-3 file:rounded-lg file:border-0 file:bg-indigo-500 file:px-3 file:py-2 file:text-white dark:border-white/20 dark:bg-slate-950/60 dark:text-slate-300'

export const labelClass = 'flex flex-col gap-2 text-sm text-slate-600 dark:text-slate-300'

interface ItemFormModalProps {
  /** Si viene, el modal edita ese item en lugar de crear uno nuevo. */
  item?: PortfolioItem
  categories: string[]
  onClose: () => void
  onSaved: (item: PortfolioItem) => void
}

export function ItemFormModal({
  item,
  categories,
  onClose,
  onSaved,
}: ItemFormModalProps) {
  const editing = Boolean(item)
  const [kind, setKind] = useState<ItemKind>(item?.kind ?? 'image')
  const [title, setTitle] = useState(item?.title ?? '')
  const [description, setDescription] = useState(item?.description ?? '')
  const [category, setCategory] = useState(item?.category ?? '')
  const [url, setUrl] = useState(item?.kind === 'link' ? (item.url ?? '') : '')
  const [file, setFile] = useState<File | null>(null)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()
    setError(null)

    if (!editing) {
      if (kind === 'link') {
        if (!/^https?:\/\/.+/i.test(url.trim())) {
          setError('Escribí un enlace válido que empiece con https://')
          return
        }
      } else if (!file) {
        setError('Elegí un archivo para subir')
        return
      } else if (file.size > MAX_FILE_BYTES) {
        setError('El archivo supera los 50 MB')
        return
      }
    }

    setSaving(true)
    try {
      const saved = item
        ? await updateItem(item, {
            title: title.trim() || item.title,
            description: description.trim(),
            category: category.trim(),
          })
        : await createItem({
            title: title.trim() || file?.name || url.trim(),
            description: description.trim(),
            category: category.trim(),
            kind,
            url: kind === 'link' ? url.trim() : undefined,
            file: kind === 'link' ? undefined : (file ?? undefined),
          })
      onSaved(saved)
    } catch (err) {
      setError((err as Error).message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <Modal
      title={editing ? 'Editar elemento' : 'Agregar al portfolio'}
      onClose={onClose}
    >
      <form noValidate onSubmit={handleSubmit} className="flex flex-col gap-4">
        {editing ? null : (
          <div className="grid grid-cols-3 gap-2 sm:grid-cols-5">
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
                    ? 'border-indigo-400 bg-indigo-500/20 text-slate-900 dark:text-white'
                    : 'border-black/10 bg-black/5 text-slate-600 hover:bg-black/10 dark:border-white/10 dark:bg-white/5 dark:text-slate-300 dark:hover:bg-white/10'
                }`}
              >
                <Icon />
                {label}
              </button>
            ))}
          </div>
        )}

        {editing ? null : kind === 'link' ? (
          <label className={labelClass}>
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
          <label className={labelClass}>
            Archivo {fileHint[kind]}
            <input
              type="file"
              accept={accept[kind]}
              onChange={(event) => {
                setFile(event.target.files?.[0] ?? null)
                setError(null)
              }}
              className={fileInputClass}
            />
          </label>
        )}

        <label className={labelClass}>
          Título
          <input
            type="text"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="Nombre del trabajo"
            className={inputClass}
          />
        </label>

        <label className={labelClass}>
          Categoría (opcional)
          <input
            type="text"
            value={category}
            list="portfolio-categories"
            onChange={(event) => setCategory(event.target.value)}
            placeholder="Fotos, Clientes, Diseños…"
            className={inputClass}
          />
          <datalist id="portfolio-categories">
            {categories.map((name) => (
              <option key={name} value={name} />
            ))}
          </datalist>
        </label>

        <label className={labelClass}>
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
