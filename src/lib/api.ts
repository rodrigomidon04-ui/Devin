import { demoStore } from './demoStore'
import {
  ITEMS_TABLE,
  STORAGE_BUCKET,
  isSupabaseConfigured,
  supabase,
} from './supabase'
import type { NewItemInput, PortfolioItem } from './types'

function slugify(name: string): string {
  return name
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-zA-Z0-9.\-_]/g, '-')
    .replace(/-+/g, '-')
    .toLowerCase()
}

export async function listItems(): Promise<PortfolioItem[]> {
  if (!supabase) return demoStore.list()

  const { data, error } = await supabase
    .from(ITEMS_TABLE)
    .select('*')
    .order('created_at', { ascending: false })

  if (error) throw new Error(error.message)
  return (data ?? []) as PortfolioItem[]
}

export async function createItem(input: NewItemInput): Promise<PortfolioItem> {
  if (!supabase) return demoStore.create(input)

  let storagePath: string | null = null
  let publicUrl: string | null = input.url ?? null

  if (input.file) {
    const path = `${Date.now()}-${slugify(input.file.name)}`
    const { error: uploadError } = await supabase.storage
      .from(STORAGE_BUCKET)
      .upload(path, input.file, {
        cacheControl: '3600',
        contentType: input.file.type || 'application/octet-stream',
      })
    if (uploadError) throw new Error(uploadError.message)

    storagePath = path
    publicUrl = supabase.storage.from(STORAGE_BUCKET).getPublicUrl(path)
      .data.publicUrl
  }

  const { data, error } = await supabase
    .from(ITEMS_TABLE)
    .insert({
      title: input.title,
      description: input.description || null,
      kind: input.kind,
      url: publicUrl,
      storage_path: storagePath,
      file_name: input.file?.name ?? null,
      mime_type: input.file?.type ?? null,
      size_bytes: input.file?.size ?? null,
    })
    .select()
    .single()

  if (error) throw new Error(error.message)
  return data as PortfolioItem
}

export async function deleteItem(item: PortfolioItem): Promise<void> {
  if (!supabase) return demoStore.remove(item.id)

  if (item.storage_path) {
    const { error: storageError } = await supabase.storage
      .from(STORAGE_BUCKET)
      .remove([item.storage_path])
    if (storageError) throw new Error(storageError.message)
  }
  const { error } = await supabase
    .from(ITEMS_TABLE)
    .delete()
    .eq('id', item.id)
  if (error) throw new Error(error.message)
}

export async function readTextItem(item: PortfolioItem): Promise<string> {
  if (!supabase) return demoStore.textContent(item)
  if (!item.url) return ''
  const response = await fetch(item.url)
  if (!response.ok) throw new Error('No se pudo leer el archivo de texto')
  return response.text()
}

export { isSupabaseConfigured }
