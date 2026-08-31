import { demoStore } from './demoStore'
import {
  ITEMS_TABLE,
  PROFILE_TABLE,
  STORAGE_BUCKET,
  isSupabaseConfigured,
  supabase,
} from './supabase'
import type {
  ItemUpdate,
  NewItemInput,
  PortfolioItem,
  Profile,
} from './types'

function slugify(name: string): string {
  return name
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-zA-Z0-9.\-_]/g, '-')
    .replace(/-+/g, '-')
    .toLowerCase()
}

export function sortItems(items: PortfolioItem[]): PortfolioItem[] {
  return [...items].sort((a, b) => {
    if (a.position != null && b.position != null) return a.position - b.position
    if (a.position != null) return -1
    if (b.position != null) return 1
    return b.created_at.localeCompare(a.created_at)
  })
}

export async function listItems(): Promise<PortfolioItem[]> {
  if (!supabase) return demoStore.list()

  const { data, error } = await supabase.from(ITEMS_TABLE).select('*')
  if (error) throw new Error(error.message)
  return sortItems((data ?? []) as PortfolioItem[])
}

async function uploadFile(file: File) {
  if (!supabase) throw new Error('Supabase no está configurado')
  const path = `${Date.now()}-${slugify(file.name)}`
  const { error } = await supabase.storage
    .from(STORAGE_BUCKET)
    .upload(path, file, {
      cacheControl: '3600',
      contentType: file.type || 'application/octet-stream',
    })
  if (error) throw new Error(error.message)
  const publicUrl = supabase.storage.from(STORAGE_BUCKET).getPublicUrl(path).data
    .publicUrl
  return { path, publicUrl }
}

export async function createItem(input: NewItemInput): Promise<PortfolioItem> {
  if (!supabase) return demoStore.create(input)

  let storagePath: string | null = null
  let publicUrl: string | null = input.url ?? null

  if (input.file) {
    const uploaded = await uploadFile(input.file)
    storagePath = uploaded.path
    publicUrl = uploaded.publicUrl
  }

  const { data, error } = await supabase
    .from(ITEMS_TABLE)
    .insert({
      title: input.title,
      description: input.description || null,
      category: input.category || null,
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

export async function updateItem(
  item: PortfolioItem,
  changes: ItemUpdate,
): Promise<PortfolioItem> {
  if (!supabase) return demoStore.update(item.id, changes)

  const { data, error } = await supabase
    .from(ITEMS_TABLE)
    .update({
      title: changes.title,
      description: changes.description || null,
      category: changes.category || null,
    })
    .eq('id', item.id)
    .select()
    .single()

  if (error) throw new Error(error.message)
  return data as PortfolioItem
}

/** Guarda el orden manual de la lista completa. */
export async function saveOrder(items: PortfolioItem[]): Promise<void> {
  const client = supabase
  if (!client) return demoStore.saveOrder(items.map((item) => item.id))

  const updates = items.map((item, index) =>
    client.from(ITEMS_TABLE).update({ position: index }).eq('id', item.id),
  )
  const results = await Promise.all(updates)
  const failed = results.find((result) => result.error)
  if (failed?.error) throw new Error(failed.error.message)
}

export async function deleteItem(item: PortfolioItem): Promise<void> {
  if (!supabase) return demoStore.remove(item.id)

  if (item.storage_path) {
    const { error: storageError } = await supabase.storage
      .from(STORAGE_BUCKET)
      .remove([item.storage_path])
    if (storageError) throw new Error(storageError.message)
  }
  const { error } = await supabase.from(ITEMS_TABLE).delete().eq('id', item.id)
  if (error) throw new Error(error.message)
}

export async function readTextItem(item: PortfolioItem): Promise<string> {
  if (!supabase) return demoStore.textContent(item)
  if (!item.url) return ''
  const response = await fetch(item.url)
  if (!response.ok) throw new Error('No se pudo leer el archivo de texto')
  return response.text()
}

export async function getProfile(): Promise<Profile | null> {
  if (!supabase) return demoStore.getProfile()

  const { data, error } = await supabase
    .from(PROFILE_TABLE)
    .select('title, subtitle, avatar_url')
    .eq('id', 1)
    .maybeSingle()

  if (error) throw new Error(error.message)
  return (data as Profile | null) ?? null
}

export async function saveProfile(
  profile: Profile,
  avatarFile?: File,
): Promise<Profile> {
  if (!supabase) return demoStore.saveProfile(profile, avatarFile)

  let avatarUrl = profile.avatar_url
  if (avatarFile) {
    avatarUrl = (await uploadFile(avatarFile)).publicUrl
  }

  const next = { ...profile, avatar_url: avatarUrl }
  const { error } = await supabase
    .from(PROFILE_TABLE)
    .update({ ...next, updated_at: new Date().toISOString() })
    .eq('id', 1)

  if (error) throw new Error(error.message)
  return next
}

export { isSupabaseConfigured }
