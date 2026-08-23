import type { PortfolioItem } from '../lib/types'
import { ImageIcon, LinkIcon, TextIcon, TrashIcon } from './Icons'

const kindLabel: Record<PortfolioItem['kind'], string> = {
  image: 'Imagen',
  text: 'Texto',
  link: 'Enlace',
}

function KindIcon({ kind }: { kind: PortfolioItem['kind'] }) {
  if (kind === 'image') return <ImageIcon className="h-4 w-4" />
  if (kind === 'text') return <TextIcon className="h-4 w-4" />
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

interface ItemCardProps {
  item: PortfolioItem
  canEdit: boolean
  onOpen: (item: PortfolioItem) => void
  onDelete: (item: PortfolioItem) => void
}

export function ItemCard({ item, canEdit, onOpen, onDelete }: ItemCardProps) {
  return (
    <article className="group relative flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-white/5 transition hover:border-indigo-400/40 hover:bg-white/10">
      <button
        type="button"
        onClick={() => onOpen(item)}
        className="flex flex-1 flex-col text-left"
      >
        <div className="flex aspect-[4/3] items-center justify-center overflow-hidden bg-slate-950/40">
          {item.kind === 'image' && item.url ? (
            <img
              src={item.url}
              alt={item.title}
              loading="lazy"
              className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.03]"
            />
          ) : (
            <div className="flex flex-col items-center gap-2 text-indigo-300">
              <KindIcon kind={item.kind} />
              <span className="text-xs uppercase tracking-wide text-slate-400">
                {kindLabel[item.kind]}
              </span>
            </div>
          )}
        </div>
        <div className="flex flex-1 flex-col gap-1 p-4">
          <h3 className="line-clamp-2 font-semibold text-white">{item.title}</h3>
          {item.description ? (
            <p className="line-clamp-2 text-sm text-slate-400">{item.description}</p>
          ) : null}
          {item.kind === 'link' ? (
            <p className="mt-auto truncate pt-2 text-xs text-indigo-300">
              {hostOf(item.url)}
            </p>
          ) : null}
        </div>
      </button>

      {canEdit ? (
        <button
          type="button"
          aria-label={`Borrar ${item.title}`}
          onClick={() => onDelete(item)}
          className="absolute right-3 top-3 rounded-full bg-slate-950/70 p-2 text-slate-300 transition hover:bg-red-500/80 hover:text-white"
        >
          <TrashIcon className="h-4 w-4" />
        </button>
      ) : null}
    </article>
  )
}
