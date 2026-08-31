import { useState } from 'react'
import { Modal } from './Modal'
import { embedUrl } from '../lib/video'
import { videoCategoryLabel } from '../lib/labels'
import type { Video } from '../lib/types'

interface VideoPlayerProps {
  video: Video
  onClose: () => void
}

export function VideoPlayer({ video, onClose }: VideoPlayerProps) {
  const embed = embedUrl(video.video_url)
  const [failed, setFailed] = useState(false)

  return (
    <Modal title={video.title} onClose={onClose} wide>
      <div className="overflow-hidden rounded-2xl border-4 border-black bg-black">
        {embed ? (
          <iframe
            src={embed}
            title={video.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="aspect-video w-full"
          />
        ) : (
          <video
            src={video.video_url}
            controls
            autoPlay
            playsInline
            onError={() => setFailed(true)}
            className="aspect-video w-full bg-black"
          />
        )}
      </div>
      {failed ? (
        <p
          role="alert"
          className="mt-3 rounded-xl border-2 border-black bg-toon-yellow px-3 py-2 text-sm font-bold text-black"
        >
          Este video no se pudo cargar. Probá de nuevo o abrilo en otra pestaña.
        </p>
      ) : null}

      <p className="mt-3 text-xs font-extrabold uppercase tracking-wide text-carton-700">
        {videoCategoryLabel(video.category)}
      </p>
      {video.description ? (
        <p className="mt-1 text-sm text-black">{video.description}</p>
      ) : null}
      {!embed ? (
        <a
          href={video.video_url}
          target="_blank"
          rel="noreferrer"
          className="mt-3 inline-block text-sm font-bold text-toon-pink underline"
        >
          Abrir el video en otra pestaña
        </a>
      ) : null}
    </Modal>
  )
}
