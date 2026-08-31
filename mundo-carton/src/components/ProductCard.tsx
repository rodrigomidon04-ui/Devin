import { CartIcon, TrashIcon } from './Icons'
import { formatPrice } from '../lib/format'
import { productCategoryEmoji, productCategoryLabel } from '../lib/labels'
import type { Product } from '../lib/types'

interface ProductCardProps {
  product: Product
  canEdit: boolean
  onAdd: (product: Product) => void
  onDelete: (product: Product) => void
}

export function ProductCard({
  product,
  canEdit,
  onAdd,
  onDelete,
}: ProductCardProps) {
  return (
    <article className="relative flex flex-col overflow-hidden rounded-3xl bg-white toon-border">
      <div className="relative aspect-4/3 border-b-4 border-black bg-carton-100">
        {product.image_url ? (
          <img
            src={product.image_url}
            alt={product.name}
            loading="lazy"
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-linear-to-br from-carton-100 to-carton-300 text-6xl">
            {productCategoryEmoji(product.category)}
          </div>
        )}
        <span className="absolute left-3 top-3 rounded-full border-2 border-black bg-toon-cyan px-3 py-1 text-xs font-extrabold uppercase text-black">
          {productCategoryLabel(product.category)}
        </span>
        {canEdit ? (
          <button
            type="button"
            onClick={() => onDelete(product)}
            aria-label={`Borrar ${product.name}`}
            className="absolute right-3 top-3 rounded-full border-2 border-black bg-white p-2 text-black transition hover:bg-toon-pink hover:text-white"
          >
            <TrashIcon className="h-4 w-4" />
          </button>
        ) : null}
      </div>

      <div className="flex flex-1 flex-col px-4 py-3">
        <h3 className="font-display text-lg uppercase leading-tight text-black">
          {product.name}
        </h3>
        {product.description ? (
          <p className="mt-1 line-clamp-3 text-sm text-carton-700">
            {product.description}
          </p>
        ) : null}
        {product.age_range ? (
          <p className="mt-2 text-xs font-extrabold uppercase text-carton-500">
            Para {product.age_range}
          </p>
        ) : null}
        <div className="mt-auto flex items-center justify-between gap-3 pt-4">
          <span className="font-display text-xl text-black">
            {formatPrice(product.price)}
          </span>
          <button
            type="button"
            onClick={() => onAdd(product)}
            className="inline-flex items-center gap-2 rounded-full border-4 border-black bg-toon-yellow px-4 py-2 text-sm font-extrabold uppercase text-black transition hover:bg-toon-pink hover:text-white"
          >
            <CartIcon className="h-4 w-4" />
            Agregar
          </button>
        </div>
      </div>
    </article>
  )
}
