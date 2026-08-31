import { useEffect, useState } from 'react'
import { readTextItem } from '../lib/api'
import type { PortfolioItem } from '../lib/types'
import { Modal } from './Modal'

interface ItemViewerProps {
  item: PortfolioItem
  onClose: () => void
}

export function ItemViewer({ item, onClose }: ItemViewerProps) {
  const [text, setText] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (item.kind !== 'text') return
    let active = true
    readTextItem(item)
      .then((content) => {
        if (active) setText(content)
      })
      .catch((err: Error) => {
        if (active) setError(err.message)
      })
    return () => {
      active = false
    }
  }, [item])

  return (
    <Modal title={item.title} onClose={onClose} wide>
      {item.category ? (
        <span className="mb-3 inline-block rounded-full bg-indigo-500/15 px-3 py-1 text-xs text-indigo-700 dark:text-indigo-200">
          {item.category}
        </span>
      ) : null}
      {item.description ? (
        <p className="mb-4 text-sm text-slate-600 dark:text-slate-300">
          {item.description}
        </p>
      ) : null}

      {item.kind === 'image' && item.url ? (
        <img
          src={item.url}
          alt={item.title}
          className="mx-auto max-h-[60dvh] w-auto rounded-xl object-contain"
        />
      ) : null}

      {item.kind === 'video' && item.url ? (
        <video
          src={item.url}
          controls
          playsInline
          className="mx-auto max-h-[60dvh] w-full rounded-xl bg-black"
        />
      ) : null}

      {item.kind === 'pdf' && item.url ? (
        <iframe
          src={item.url}
          title={item.title}
          className="h-[60dvh] w-full rounded-xl border border-black/10 bg-white dark:border-white/10"
        />
      ) : null}

      {item.kind === 'text' ? (
        <pre className="max-h-[55dvh] overflow-auto whitespace-pre-wrap break-words rounded-xl bg-black/5 p-4 text-sm text-slate-800 dark:bg-slate-950/70 dark:text-slate-200">
          {error ?? text ?? 'Cargando…'}
        </pre>
      ) : null}

      {item.kind === 'link' && item.url ? (
        <p className="break-all text-sm text-slate-600 dark:text-slate-300">
          {item.url}
        </p>
      ) : null}

      {item.url ? (
        <a
          href={item.url}
          target="_blank"
          rel="noreferrer noopener"
          className="mt-5 inline-flex w-full items-center justify-center rounded-xl bg-indigo-500 px-4 py-3 font-medium text-white transition hover:bg-indigo-400 sm:w-auto"
        >
          {item.kind === 'link' ? 'Abrir enlace' : 'Abrir / descargar'}
        </a>
      ) : null}
    </Modal>
  )
}
