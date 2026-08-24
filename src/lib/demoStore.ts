import type {
  ItemUpdate,
  NewItemInput,
  PortfolioItem,
  Profile,
} from './types'

/**
 * Almacenamiento local usado cuando todavía no hay credenciales de Supabase.
 * Permite probar la página completa (subir, editar, ordenar y borrar) desde el navegador.
 */
const KEY = 'portfolio.demo.items'
const SESSION_KEY = 'portfolio.demo.session'
const PROFILE_KEY = 'portfolio.demo.profile'

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

function sorted(items: PortfolioItem[]): PortfolioItem[] {
  return [...items].sort((a, b) => {
    if (a.position != null && b.position != null) return a.position - b.position
    if (a.position != null) return -1
    if (b.position != null) return 1
    return b.created_at.localeCompare(a.created_at)
  })
}

function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(String(reader.result))
    reader.onerror = () => reject(new Error('No se pudo leer el archivo'))
    reader.readAsDataURL(file)
  })
}

function persist(items: PortfolioItem[]) {
  try {
    write(items)
  } catch {
    throw new Error(
      'El modo demo del navegador se quedó sin espacio. Configurá Supabase para guardar archivos grandes.',
    )
  }
}

export const demoStore = {
  isDemoSessionActive: () => localStorage.getItem(SESSION_KEY) === '1',
  startSession: () => localStorage.setItem(SESSION_KEY, '1'),
  endSession: () => localStorage.removeItem(SESSION_KEY),

  async list(): Promise<PortfolioItem[]> {
    return sorted(read())
  },

  async create(input: NewItemInput): Promise<PortfolioItem> {
    const item: PortfolioItem = {
      id: crypto.randomUUID(),
      created_at: new Date().toISOString(),
      title: input.title,
      description: input.description || null,
      category: input.category || null,
      position: null,
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
    persist(items)
    return item
  },

  async update(id: string, changes: ItemUpdate): Promise<PortfolioItem> {
    const items = read()
    const item = items.find((entry) => entry.id === id)
    if (!item) throw new Error('No se encontró el elemento')
    item.title = changes.title
    item.description = changes.description || null
    item.category = changes.category || null
    persist(items)
    return item
  },

  async saveOrder(ids: string[]): Promise<void> {
    const items = read()
    for (const item of items) {
      const index = ids.indexOf(item.id)
      item.position = index === -1 ? null : index
    }
    persist(items)
  },

  async remove(id: string): Promise<void> {
    persist(read().filter((item) => item.id !== id))
  },

  async textContent(item: PortfolioItem): Promise<string> {
    if (!item.url) return ''
    const response = await fetch(item.url)
    return response.text()
  },

  async getProfile(): Promise<Profile | null> {
    try {
      const raw = localStorage.getItem(PROFILE_KEY)
      return raw ? (JSON.parse(raw) as Profile) : null
    } catch {
      return null
    }
  },

  async saveProfile(profile: Profile, avatarFile?: File): Promise<Profile> {
    const next: Profile = { ...profile }
    if (avatarFile) next.avatar_url = await readFileAsDataUrl(avatarFile)
    localStorage.setItem(PROFILE_KEY, JSON.stringify(next))
    return next
  },
}
