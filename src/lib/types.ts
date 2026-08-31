export type ItemKind = 'image' | 'text' | 'link' | 'pdf' | 'video'

export interface PortfolioItem {
  id: string
  created_at: string
  title: string
  description: string | null
  kind: ItemKind
  /** Categoría libre elegida por el dueño (ej. "Fotos", "Clientes"). */
  category: string | null
  /** Orden manual; los items sin posición van al final. */
  position: number | null
  /** Enlace externo (kind === 'link') o URL pública del archivo subido. */
  url: string | null
  /** Ruta dentro del bucket de Supabase Storage (todos los kinds con archivo). */
  storage_path: string | null
  file_name: string | null
  mime_type: string | null
  size_bytes: number | null
}

export interface NewItemInput {
  title: string
  description: string
  category: string
  kind: ItemKind
  url?: string
  file?: File
}

export interface ItemUpdate {
  title: string
  description: string
  category: string
}

export interface Profile {
  title: string
  subtitle: string
  avatar_url: string | null
}
