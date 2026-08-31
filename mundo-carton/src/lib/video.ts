/** Devuelve el id de YouTube si la URL apunta a un video de YouTube. */
export function youtubeId(url: string): string | null {
  try {
    const parsed = new URL(url)
    const host = parsed.hostname.replace(/^www\./, '')
    if (host === 'youtu.be') return parsed.pathname.slice(1) || null
    if (host === 'youtube.com' || host === 'm.youtube.com') {
      if (parsed.pathname === '/watch') return parsed.searchParams.get('v')
      const match = parsed.pathname.match(/^\/(?:embed|shorts|live)\/([^/]+)/)
      if (match) return match[1]
    }
    return null
  } catch {
    return null
  }
}

/** Devuelve el id de Vimeo si la URL apunta a un video de Vimeo. */
export function vimeoId(url: string): string | null {
  try {
    const parsed = new URL(url)
    if (!parsed.hostname.replace(/^www\./, '').endsWith('vimeo.com')) return null
    const match = parsed.pathname.match(/(\d+)/)
    return match ? match[1] : null
  } catch {
    return null
  }
}

export function embedUrl(url: string): string | null {
  const yt = youtubeId(url)
  if (yt) return `https://www.youtube-nocookie.com/embed/${yt}?rel=0`
  const vimeo = vimeoId(url)
  if (vimeo) return `https://player.vimeo.com/video/${vimeo}`
  return null
}

export function thumbnailUrl(url: string): string | null {
  const yt = youtubeId(url)
  return yt ? `https://i.ytimg.com/vi/${yt}/hqdefault.jpg` : null
}
