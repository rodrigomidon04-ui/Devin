import { seedProducts, seedVideos } from './seed'
import type {
  NewProductInput,
  NewVideoInput,
  Product,
  Video,
} from './types'

/**
 * Guardado local que se usa mientras no haya credenciales de Supabase.
 * Permite probar toda la página (ver, agregar y borrar) desde el navegador.
 */

const VIDEOS_KEY = 'mundoCarton.demo.videos'
const PRODUCTS_KEY = 'mundoCarton.demo.products'
const SESSION_KEY = 'mundoCarton.demo.session'

function read<T>(key: string, fallback: T[]): T[] {
  try {
    const raw = localStorage.getItem(key)
    if (!raw) return fallback
    return JSON.parse(raw) as T[]
  } catch {
    return fallback
  }
}

function write<T>(key: string, rows: T[]) {
  try {
    localStorage.setItem(key, JSON.stringify(rows))
  } catch {
    throw new Error(
      'El modo demo del navegador se quedó sin espacio. Configurá Supabase para guardar archivos grandes.',
    )
  }
}

function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(String(reader.result))
    reader.onerror = () => reject(new Error('No se pudo leer el archivo'))
    reader.readAsDataURL(file)
  })
}

function byNewest<T extends { created_at: string }>(rows: T[]): T[] {
  return [...rows].sort((a, b) => b.created_at.localeCompare(a.created_at))
}

export const demoStore = {
  isDemoSessionActive: () => localStorage.getItem(SESSION_KEY) === '1',
  startSession: () => localStorage.setItem(SESSION_KEY, '1'),
  endSession: () => localStorage.removeItem(SESSION_KEY),

  async listVideos(): Promise<Video[]> {
    return byNewest(read<Video>(VIDEOS_KEY, seedVideos))
  },

  async createVideo(input: NewVideoInput): Promise<Video> {
    const video: Video = {
      id: crypto.randomUUID(),
      created_at: new Date().toISOString(),
      title: input.title,
      description: input.description || null,
      category: input.category,
      video_url: input.file
        ? await readFileAsDataUrl(input.file)
        : (input.url ?? ''),
      storage_path: null,
    }
    write(VIDEOS_KEY, [video, ...read<Video>(VIDEOS_KEY, seedVideos)])
    return video
  },

  async removeVideo(id: string): Promise<void> {
    write(
      VIDEOS_KEY,
      read<Video>(VIDEOS_KEY, seedVideos).filter((video) => video.id !== id),
    )
  },

  async listProducts(): Promise<Product[]> {
    return byNewest(read<Product>(PRODUCTS_KEY, seedProducts))
  },

  async createProduct(input: NewProductInput): Promise<Product> {
    const product: Product = {
      id: crypto.randomUUID(),
      created_at: new Date().toISOString(),
      name: input.name,
      description: input.description || null,
      category: input.category,
      price: input.price,
      age_range: input.ageRange || null,
      image_url: input.imageFile
        ? await readFileAsDataUrl(input.imageFile)
        : null,
      storage_path: null,
    }
    write(PRODUCTS_KEY, [product, ...read<Product>(PRODUCTS_KEY, seedProducts)])
    return product
  },

  async removeProduct(id: string): Promise<void> {
    write(
      PRODUCTS_KEY,
      read<Product>(PRODUCTS_KEY, seedProducts).filter(
        (product) => product.id !== id,
      ),
    )
  },
}
