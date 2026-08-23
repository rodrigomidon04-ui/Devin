export type ItemKind = 'image' | 'text' | 'link'

export interface PortfolioItem {
  id: string
  created_at: string
  title: string
  description: string | null
  kind: ItemKind
  /** Enlace externo (kind === 'link') o URL pública del archivo subido. */
  url: string | null
  /** Ruta dentro del bucket de Supabase Storage (kind === 'image' | 'text'). */
  storage_path: string | null
  file_name: string | null
  mime_type: string | null
  size_bytes: number | null
}

export interface NewItemInput {
  title: string
  description: string
  kind: ItemKind
  url?: string
  file?: File
}
