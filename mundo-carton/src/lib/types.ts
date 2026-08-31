export type VideoCategory = 'juguetes' | 'muebles' | 'decoracion' | 'trucos'

export type ProductCategory =
  | 'juguetes'
  | 'muebles'
  | 'decoracion'
  | 'didacticos'

export interface Video {
  id: string
  created_at: string
  title: string
  description: string | null
  category: VideoCategory
  /** Enlace de YouTube, Vimeo, MP4 o URL pública del archivo subido. */
  video_url: string
  /** Ruta dentro del bucket de Supabase Storage (solo si se subió un archivo). */
  storage_path: string | null
}

export interface Product {
  id: string
  created_at: string
  name: string
  description: string | null
  category: ProductCategory
  /** Precio en pesos, sin decimales. */
  price: number
  /** Edad recomendada, por ejemplo "3 a 6 años". */
  age_range: string | null
  image_url: string | null
  storage_path: string | null
}

export interface NewVideoInput {
  title: string
  description: string
  category: VideoCategory
  url?: string
  file?: File
}

export interface NewProductInput {
  name: string
  description: string
  category: ProductCategory
  price: number
  ageRange: string
  imageFile?: File
}

export interface CartLine {
  product: Product
  quantity: number
}
