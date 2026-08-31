import type { ProductCategory, VideoCategory } from './types'

export const videoCategories: {
  value: VideoCategory
  label: string
  emoji: string
}[] = [
  { value: 'juguetes', label: 'Juguetes', emoji: '🤖' },
  { value: 'muebles', label: 'Muebles', emoji: '🪑' },
  { value: 'decoracion', label: 'Decoración', emoji: '🎨' },
  { value: 'trucos', label: 'Trucos', emoji: '✂️' },
]

export const productCategories: {
  value: ProductCategory
  label: string
  emoji: string
}[] = [
  { value: 'juguetes', label: 'Juguetes', emoji: '🧸' },
  { value: 'muebles', label: 'Muebles', emoji: '🪑' },
  { value: 'decoracion', label: 'Decoración', emoji: '🌈' },
  { value: 'didacticos', label: 'Didácticos', emoji: '🧩' },
]

export function videoCategoryLabel(category: VideoCategory): string {
  return videoCategories.find((item) => item.value === category)?.label ?? category
}

export function productCategoryLabel(category: ProductCategory): string {
  return (
    productCategories.find((item) => item.value === category)?.label ?? category
  )
}

export function productCategoryEmoji(category: ProductCategory): string {
  return productCategories.find((item) => item.value === category)?.emoji ?? '📦'
}
