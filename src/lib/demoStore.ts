import type { NewItemInput, PortfolioItem } from './types'

/**
 * Almacenamiento local usado cuando todavía no hay credenciales de Supabase.
 * Permite probar la página completa (subir, ver y borrar) desde el navegador.
 */
const KEY = 'portfolio.demo.items'
const SESSION_KEY = 'portfolio.demo.session'

function read(): PortfolioItem[] {
  try {
    const raw = localStorage.getItem(KEY)
    return raw ? (JSON.parse(raw) as PortfolioItem[]) : []
  } catch {
    return []
  }
}

function write(items: PortfolioItem[]) {
  localStorage.setItem(KEY, JSON.stringify(items))
}

function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(String(reader.result))
    reader.onerror = () => reject(new Error('No se pudo leer el archivo'))
    reader.readAsDataURL(file)
  })
}

export const demoStore = {
  isDemoSessionActive: () => localStorage.getItem(SESSION_KEY) === '1',
  startSession: () => localStorage.setItem(SESSION_KEY, '1'),
  endSession: () => localStorage.removeItem(SESSION_KEY),

  async list(): Promise<PortfolioItem[]> {
    return read().sort((a, b) => b.created_at.localeCompare(a.created_at))
  },

  async create(input: NewItemInput): Promise<PortfolioItem> {
    const item: PortfolioItem = {
      id: crypto.randomUUID(),
      created_at: new Date().toISOString(),
      title: input.title,
      description: input.description || null,
      kind: input.kind,
      url: input.url ?? null,
      storage_path: null,
      file_name: input.file?.name ?? null,
      mime_type: input.file?.type ?? null,
      size_bytes: input.file?.size ?? null,
    }
    if (input.file) {
      item.url = await readFileAsDataUrl(input.file)
    }
    const items = read()
    items.unshift(item)
    try {
      write(items)
    } catch {
      throw new Error(
        'El modo demo del navegador se quedó sin espacio. Configurá Supabase para guardar archivos grandes.',
      )
    }
    return item
  },

  async remove(id: string): Promise<void> {
    write(read().filter((item) => item.id !== id))
  },

  async textContent(item: PortfolioItem): Promise<string> {
    if (!item.url) return ''
    const response = await fetch(item.url)
    return response.text()
  },
}
