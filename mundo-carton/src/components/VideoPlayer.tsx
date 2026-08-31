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
            className="aspect-video w-full bg-black"
          />
        )}
      </div>
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
