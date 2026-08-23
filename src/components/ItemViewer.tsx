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
      {item.description ? (
        <p className="mb-4 text-sm text-slate-300">{item.description}</p>
      ) : null}

      {item.kind === 'image' && item.url ? (
        <img
          src={item.url}
          alt={item.title}
          className="mx-auto max-h-[60dvh] w-auto rounded-xl object-contain"
        />
      ) : null}

      {item.kind === 'text' ? (
        <pre className="max-h-[55dvh] overflow-auto whitespace-pre-wrap break-words rounded-xl bg-slate-950/70 p-4 text-sm text-slate-200">
          {error ?? text ?? 'Cargando…'}
        </pre>
      ) : null}

      {item.kind === 'link' && item.url ? (
        <p className="break-all text-sm text-slate-300">{item.url}</p>
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
