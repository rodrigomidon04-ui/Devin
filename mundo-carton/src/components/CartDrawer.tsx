import { useState } from 'react'
import { Modal } from './Modal'
import { TrashIcon, WhatsappIcon } from './Icons'
import { formatPrice } from '../lib/format'
import type { CartState } from '../lib/useCart'

interface CartDrawerProps {
  cart: CartState
  phone: string
  onClose: () => void
}

export function CartDrawer({ cart, phone, onClose }: CartDrawerProps) {
  const canOrder = cart.lines.length > 0 && Boolean(phone)
  /** Texto que el usuario está tipeando, para poder borrarlo sin perder la línea. */
  const [drafts, setDrafts] = useState<Record<string, string>>({})

  return (
    <Modal title="Tu pedido" onClose={onClose}>
      {cart.lines.length === 0 ? (
        <p className="py-6 text-center text-sm text-carton-700">
          Todavía no agregaste productos. Mirá la tienda y tocá “Agregar”.
        </p>
      ) : (
        <ul className="grid gap-3">
          {cart.lines.map(({ product, quantity }) => (
            <li
              key={product.id}
              className="flex items-center gap-3 rounded-2xl border-2 border-black bg-white px-3 py-2"
            >
              <div className="min-w-0 flex-1">
                <p className="truncate font-bold text-black">{product.name}</p>
                <p className="text-sm text-carton-700">
                  {formatPrice(product.price)} por unidad
                </p>
              </div>
              <label className="sr-only" htmlFor={`qty-${product.id}`}>
                Cantidad de {product.name}
              </label>
              <input
                id={`qty-${product.id}`}
                type="number"
                min={1}
                max={99}
                value={drafts[product.id] ?? String(quantity)}
                onChange={(event) => {
                  const text = event.target.value
                  setDrafts((current) => ({ ...current, [product.id]: text }))
                  const parsed = Number(text)
                  if (text !== '' && Number.isFinite(parsed) && parsed >= 1) {
                    cart.setQuantity(product.id, parsed)
                  }
                }}
                onBlur={() =>
                  setDrafts((current) => {
                    const next = { ...current }
                    delete next[product.id]
                    return next
                  })
                }
                className="w-16 rounded-xl border-2 border-black px-2 py-1 text-center"
              />
              <button
                type="button"
                onClick={() => cart.remove(product.id)}
                aria-label={`Quitar ${product.name}`}
                className="rounded-full border-2 border-black bg-white p-2 text-black transition hover:bg-toon-pink hover:text-white"
              >
                <TrashIcon className="h-4 w-4" />
              </button>
            </li>
          ))}
        </ul>
      )}

      <div className="mt-5 flex items-center justify-between border-t-4 border-black pt-4">
        <span className="font-display text-lg uppercase text-black">Total</span>
        <span className="font-display text-2xl text-black">
          {formatPrice(cart.total)}
        </span>
      </div>

      {!phone ? (
        <p className="mt-3 rounded-xl bg-toon-yellow/40 px-3 py-2 text-sm text-black">
          Falta configurar <code>VITE_WHATSAPP_NUMBER</code> para recibir los
          pedidos por WhatsApp.
        </p>
      ) : null}

      <div className="mt-4 grid gap-2">
        <a
          href={canOrder ? cart.whatsappUrl(phone) : undefined}
          target="_blank"
          rel="noreferrer"
          aria-disabled={!canOrder}
          className={`inline-flex items-center justify-center gap-2 rounded-full border-4 border-black px-5 py-3 font-display uppercase tracking-wide text-black ${
            canOrder
              ? 'bg-toon-cyan hover:bg-toon-yellow'
              : 'pointer-events-none bg-carton-100 opacity-60'
          }`}
        >
          <WhatsappIcon className="h-5 w-5" />
          Encargar por WhatsApp
        </a>
        {cart.lines.length > 0 ? (
          <button
            type="button"
            onClick={cart.clear}
            className="text-sm font-bold text-carton-700 underline"
          >
            Vaciar el pedido
          </button>
        ) : null}
      </div>
    </Modal>
  )
}
