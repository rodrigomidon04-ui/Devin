import { PlayIcon, TrashIcon } from './Icons'
import { videoCategoryLabel } from '../lib/labels'
import { thumbnailUrl } from '../lib/video'
import type { Video } from '../lib/types'

interface VideoCardProps {
  video: Video
  canEdit: boolean
  onOpen: (video: Video) => void
  onDelete: (video: Video) => void
}

export function VideoCard({ video, canEdit, onOpen, onDelete }: VideoCardProps) {
  const thumb = thumbnailUrl(video.video_url)

  return (
    <article className="group relative overflow-hidden rounded-3xl bg-white toon-border">
      <button
        type="button"
        onClick={() => onOpen(video)}
        className="block w-full text-left"
      >
        <div className="relative aspect-video overflow-hidden border-b-4 border-black bg-carton-300">
          {thumb ? (
            <img
              src={thumb}
              alt=""
              loading="lazy"
              className="h-full w-full object-cover transition group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-linear-to-br from-carton-300 to-carton-500 text-6xl">
              📼
            </div>
          )}
          <span className="absolute left-3 top-3 rounded-full border-2 border-black bg-toon-yellow px-3 py-1 text-xs font-extrabold uppercase text-black">
            {videoCategoryLabel(video.category)}
          </span>
          <span className="absolute inset-0 flex items-center justify-center">
            <span className="flex h-16 w-16 items-center justify-center rounded-full border-4 border-black bg-toon-pink text-white transition group-hover:scale-110">
              <PlayIcon className="h-7 w-7" />
            </span>
          </span>
        </div>
        <div className="px-4 py-3">
          <h3 className="font-display text-lg uppercase leading-tight text-black">
            {video.title}
          </h3>
          {video.description ? (
            <p className="mt-1 line-clamp-3 text-sm text-carton-700">
              {video.description}
            </p>
          ) : null}
        </div>
      </button>

      {canEdit ? (
        <button
          type="button"
          onClick={() => onDelete(video)}
          aria-label={`Borrar ${video.title}`}
          className="absolute right-3 top-3 rounded-full border-2 border-black bg-white p-2 text-black transition hover:bg-toon-pink hover:text-white"
        >
          <TrashIcon className="h-4 w-4" />
        </button>
      ) : null}
    </article>
  )
}
