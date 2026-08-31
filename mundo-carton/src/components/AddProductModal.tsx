import { useState } from 'react'
import { Modal } from './Modal'
import { MAX_FILE_BYTES, createProduct } from '../lib/api'
import { productCategories } from '../lib/labels'
import type { Product, ProductCategory } from '../lib/types'

interface AddProductModalProps {
  onClose: () => void
  onCreated: (product: Product) => void
}

export function AddProductModal({ onClose, onCreated }: AddProductModalProps) {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState<ProductCategory>('juguetes')
  const [price, setPrice] = useState('')
  const [ageRange, setAgeRange] = useState('')
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault()
    setError(null)

    const priceNumber = Number(price)
    if (!Number.isFinite(priceNumber) || priceNumber <= 0) {
      setError('Poné un precio mayor que cero')
      return
    }
    if (imageFile && imageFile.size > MAX_FILE_BYTES) {
      setError('La foto es muy grande (máximo 50 MB)')
      return
    }

    setSaving(true)
    try {
      const product = await createProduct({
        name: name.trim(),
        description: description.trim(),
        category,
        price: Math.round(priceNumber),
        ageRange: ageRange.trim(),
        imageFile: imageFile ?? undefined,
      })
      onCreated(product)
    } catch (err) {
      setError((err as Error).message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <Modal title="Agregar producto" onClose={onClose}>
      <form onSubmit={handleSubmit} className="grid gap-4">
        <label className="grid gap-1 text-sm font-bold text-black">
          Nombre
          <input
            required
            value={name}
            onChange={(event) => setName(event.target.value)}
            className="rounded-xl border-2 border-black bg-white px-3 py-2 text-base font-normal outline-none focus:border-toon-pink"
          />
        </label>

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="grid gap-1 text-sm font-bold text-black">
            Precio
            <input
              type="number"
              min={1}
              step={1}
              required
              value={price}
              onChange={(event) => {
                setPrice(event.target.value)
                setError(null)
              }}
              className="rounded-xl border-2 border-black bg-white px-3 py-2 text-base font-normal outline-none focus:border-toon-pink"
            />
          </label>
          <label className="grid gap-1 text-sm font-bold text-black">
            Edad recomendada
            <input
              placeholder="3 a 7 años"
              value={ageRange}
              onChange={(event) => setAgeRange(event.target.value)}
              className="rounded-xl border-2 border-black bg-white px-3 py-2 text-base font-normal outline-none focus:border-toon-pink"
            />
          </label>
        </div>

        <label className="grid gap-1 text-sm font-bold text-black">
          Categoría
          <select
            value={category}
            onChange={(event) =>
              setCategory(event.target.value as ProductCategory)
            }
            className="rounded-xl border-2 border-black bg-white px-3 py-2 text-base font-normal outline-none focus:border-toon-pink"
          >
            {productCategories.map((option) => (
              <option key={option.value} value={option.value}>
                {option.emoji} {option.label}
              </option>
            ))}
          </select>
        </label>

        <label className="grid gap-1 text-sm font-bold text-black">
          Foto (opcional)
          <input
            type="file"
            accept="image/png,image/jpeg,image/webp"
            onChange={(event) => {
              setImageFile(event.target.files?.[0] ?? null)
              setError(null)
            }}
            className="rounded-xl border-2 border-black bg-white px-3 py-2 text-sm font-normal"
          />
        </label>

        <label className="grid gap-1 text-sm font-bold text-black">
          Descripción (opcional)
          <textarea
            rows={3}
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            className="rounded-xl border-2 border-black bg-white px-3 py-2 text-base font-normal outline-none focus:border-toon-pink"
          />
        </label>

        {error ? (
          <p role="alert" className="rounded-xl bg-toon-pink/15 px-3 py-2 text-sm text-toon-pink">
            {error}
          </p>
        ) : null}

        <button
          type="submit"
          disabled={saving}
          className="rounded-full border-4 border-black bg-toon-cyan px-5 py-2.5 font-display uppercase tracking-wide text-black transition hover:bg-toon-yellow disabled:opacity-60"
        >
          {saving ? 'Guardando…' : 'Guardar producto'}
        </button>
      </form>
    </Modal>
  )
}
