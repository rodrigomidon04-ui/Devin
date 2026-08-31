import { useState } from 'react'
import type { PortfolioItem } from '../lib/types'
import {
  ArrowDownIcon,
  ArrowUpIcon,
  ImageIcon,
  LinkIcon,
  PdfIcon,
  PencilIcon,
  TextIcon,
  TrashIcon,
  VideoIcon,
} from './Icons'

const kindLabel: Record<PortfolioItem['kind'], string> = {
  image: 'Imagen',
  text: 'Texto',
  link: 'Enlace',
  pdf: 'PDF',
  video: 'Video',
}

function KindIcon({ kind }: { kind: PortfolioItem['kind'] }) {
  if (kind === 'image') return <ImageIcon className="h-4 w-4" />
  if (kind === 'text') return <TextIcon className="h-4 w-4" />
  if (kind === 'pdf') return <PdfIcon className="h-4 w-4" />
  if (kind === 'video') return <VideoIcon className="h-4 w-4" />
  return <LinkIcon className="h-4 w-4" />
}

function hostOf(url: string | null): string {
  if (!url) return ''
  try {
    return new URL(url).hostname.replace(/^www\./, '')
  } catch {
    return url
  }
}

function faviconOf(url: string): string {
  return `https://www.google.com/s2/favicons?sz=128&domain_url=${encodeURIComponent(url)}`
}

function LinkThumb({ url, title }: { url: string; title: string }) {
  const [failed, setFailed] = useState(false)
  if (failed) return <LinkIcon className="h-4 w-4" />
  return (
    <img
      src={faviconOf(url)}
      alt={title}
      loading="lazy"
      onError={() => setFailed(true)}
      className="h-12 w-12 rounded-xl bg-white object-contain p-1.5"
    />
  )
}

const actionClass =
  'rounded-full bg-white/90 p-2 text-slate-600 shadow-sm transition hover:text-slate-900 disabled:opacity-40 dark:bg-slate-950/70 dark:text-slate-300 dark:hover:text-white'

interface ItemCardProps {
  item: PortfolioItem
  canEdit: boolean
  ordering: boolean
  isFirst: boolean
  isLast: boolean
  onOpen: (item: PortfolioItem) => void
  onEdit: (item: PortfolioItem) => void
  onDelete: (item: PortfolioItem) => void
  onMove: (item: PortfolioItem, direction: -1 | 1) => void
}

export function ItemCard({
  item,
  canEdit,
  ordering,
  isFirst,
  isLast,
  onOpen,
  onEdit,
  onDelete,
  onMove,
}: ItemCardProps) {
  return (
    <article className="group relative flex flex-col overflow-hidden rounded-2xl border border-black/10 bg-black/5 transition hover:border-indigo-400/40 dark:border-white/10 dark:bg-white/5 dark:hover:bg-white/10">
      <button
        type="button"
        onClick={() => onOpen(item)}
        className="flex flex-1 flex-col text-left"
      >
        <div className="flex aspect-[4/3] items-center justify-center overflow-hidden bg-black/5 dark:bg-slate-950/40">
          {item.kind === 'image' && item.url ? (
            <img
              src={item.url}
              alt={item.title}
              loading="lazy"
              className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.03]"
            />
          ) : item.kind === 'video' && item.url ? (
            <video
              src={item.url}
              muted
              playsInline
              preload="metadata"
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex flex-col items-center gap-2 text-indigo-500 dark:text-indigo-300">
              {item.kind === 'link' && item.url ? (
                <LinkThumb url={item.url} title={item.title} />
              ) : (
                <KindIcon kind={item.kind} />
              )}
              <span className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">
                {kindLabel[item.kind]}
              </span>
            </div>
          )}
        </div>
        <div className="flex flex-1 flex-col gap-1 p-4">
          {item.category ? (
            <span className="w-fit rounded-full bg-indigo-500/15 px-2 py-0.5 text-xs text-indigo-700 dark:text-indigo-200">
              {item.category}
            </span>
          ) : null}
          <h3 className="line-clamp-2 font-semibold text-slate-900 dark:text-white">
            {item.title}
          </h3>
          {item.description ? (
            <p className="line-clamp-2 text-sm text-slate-600 dark:text-slate-400">
              {item.description}
            </p>
          ) : null}
          {item.kind === 'link' ? (
            <p className="mt-auto truncate pt-2 text-xs text-indigo-600 dark:text-indigo-300">
              {hostOf(item.url)}
            </p>
          ) : null}
        </div>
      </button>

      {canEdit ? (
        <div className="absolute right-3 top-3 flex gap-1">
          {ordering ? (
            <>
              <button
                type="button"
                aria-label={`Mover ${item.title} antes`}
                disabled={isFirst}
                onClick={() => onMove(item, -1)}
                className={actionClass}
              >
                <ArrowUpIcon className="h-4 w-4" />
              </button>
              <button
                type="button"
                aria-label={`Mover ${item.title} después`}
                disabled={isLast}
                onClick={() => onMove(item, 1)}
                className={actionClass}
              >
                <ArrowDownIcon className="h-4 w-4" />
              </button>
            </>
          ) : (
            <>
              <button
                type="button"
                aria-label={`Editar ${item.title}`}
                onClick={() => onEdit(item)}
                className={actionClass}
              >
                <PencilIcon className="h-4 w-4" />
              </button>
              <button
                type="button"
                aria-label={`Borrar ${item.title}`}
                onClick={() => onDelete(item)}
                className={`${actionClass} hover:bg-red-500/80 hover:text-white`}
              >
                <TrashIcon className="h-4 w-4" />
              </button>
            </>
          )}
        </div>
      ) : null}
    </article>
  )
}
