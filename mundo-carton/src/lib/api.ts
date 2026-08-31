import { demoStore } from './demoStore'
import { slugify } from './format'
import {
  PRODUCTS_TABLE,
  STORAGE_BUCKET,
  VIDEOS_TABLE,
  isSupabaseConfigured,
  supabase,
} from './supabase'
import type {
  NewProductInput,
  NewVideoInput,
  Product,
  Video,
} from './types'

export const MAX_FILE_BYTES = 50 * 1024 * 1024

async function uploadFile(file: File): Promise<{ path: string; url: string }> {
  if (!supabase) throw new Error('Supabase no está configurado')
  const path = `${Date.now()}-${slugify(file.name)}`
  const { error } = await supabase.storage
    .from(STORAGE_BUCKET)
    .upload(path, file, {
      cacheControl: '3600',
      contentType: file.type || 'application/octet-stream',
    })
  if (error) throw new Error(error.message)
  const { data } = supabase.storage.from(STORAGE_BUCKET).getPublicUrl(path)
  return { path, url: data.publicUrl }
}

async function removeFile(path: string | null): Promise<void> {
  if (!supabase || !path) return
  const { error } = await supabase.storage.from(STORAGE_BUCKET).remove([path])
  if (error) throw new Error(error.message)
}

/** Borra el archivo recién subido cuando falla el guardado de la fila. */
async function rollbackUpload(path: string | null): Promise<void> {
  try {
    await removeFile(path)
  } catch {
    // El error importante es el de la base de datos, no el de la limpieza.
  }
}

export async function listVideos(): Promise<Video[]> {
  if (!supabase) return demoStore.listVideos()
  const { data, error } = await supabase
    .from(VIDEOS_TABLE)
    .select('*')
    .order('created_at', { ascending: false })
  if (error) throw new Error(error.message)
  return (data ?? []) as Video[]
}

export async function createVideo(input: NewVideoInput): Promise<Video> {
  if (!supabase) return demoStore.createVideo(input)

  let storagePath: string | null = null
  let videoUrl = input.url ?? ''
  if (input.file) {
    const uploaded = await uploadFile(input.file)
    storagePath = uploaded.path
    videoUrl = uploaded.url
  }

  const { data, error } = await supabase
    .from(VIDEOS_TABLE)
    .insert({
      title: input.title,
      description: input.description || null,
      category: input.category,
      video_url: videoUrl,
      storage_path: storagePath,
    })
    .select()
    .single()
  if (error) {
    await rollbackUpload(storagePath)
    throw new Error(error.message)
  }
  return data as Video
}

export async function deleteVideo(video: Video): Promise<void> {
  if (!supabase) return demoStore.removeVideo(video.id)
  const { error } = await supabase
    .from(VIDEOS_TABLE)
    .delete()
    .eq('id', video.id)
  if (error) throw new Error(error.message)
  await rollbackUpload(video.storage_path)
}

export async function listProducts(): Promise<Product[]> {
  if (!supabase) return demoStore.listProducts()
  const { data, error } = await supabase
    .from(PRODUCTS_TABLE)
    .select('*')
    .order('created_at', { ascending: false })
  if (error) throw new Error(error.message)
  return (data ?? []) as Product[]
}

export async function createProduct(input: NewProductInput): Promise<Product> {
  if (!supabase) return demoStore.createProduct(input)

  let storagePath: string | null = null
  let imageUrl: string | null = null
  if (input.imageFile) {
    const uploaded = await uploadFile(input.imageFile)
    storagePath = uploaded.path
    imageUrl = uploaded.url
  }

  const { data, error } = await supabase
    .from(PRODUCTS_TABLE)
    .insert({
      name: input.name,
      description: input.description || null,
      category: input.category,
      price: input.price,
      age_range: input.ageRange || null,
      image_url: imageUrl,
      storage_path: storagePath,
    })
    .select()
    .single()
  if (error) {
    await rollbackUpload(storagePath)
    throw new Error(error.message)
  }
  return data as Product
}

export async function deleteProduct(product: Product): Promise<void> {
  if (!supabase) return demoStore.removeProduct(product.id)
  const { error } = await supabase
    .from(PRODUCTS_TABLE)
    .delete()
    .eq('id', product.id)
  if (error) throw new Error(error.message)
  await rollbackUpload(product.storage_path)
}

export { isSupabaseConfigured }
