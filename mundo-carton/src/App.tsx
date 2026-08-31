import { useEffect, useMemo, useState } from 'react'
import { AddProductModal } from './components/AddProductModal'
import { AddVideoModal } from './components/AddVideoModal'
import { CartDrawer } from './components/CartDrawer'
import { CartIcon, PlusIcon, UserIcon } from './components/Icons'
import { LoginModal } from './components/LoginModal'
import { ProductCard } from './components/ProductCard'
import { VideoCard } from './components/VideoCard'
import { VideoPlayer } from './components/VideoPlayer'
import {
  deleteProduct,
  deleteVideo,
  isSupabaseConfigured,
  listProducts,
  listVideos,
} from './lib/api'
import { productCategories, videoCategories } from './lib/labels'
import { useAuth } from './lib/useAuth'
import { useCart } from './lib/useCart'
import type {
  Product,
  ProductCategory,
  Video,
  VideoCategory,
} from './lib/types'

const SITE_TITLE = import.meta.env.VITE_SITE_TITLE || 'Mundo Cartón'
const SITE_SUBTITLE =
  import.meta.env.VITE_SITE_SUBTITLE ||
  'Videos para aprender a construir con cartón reciclado y una tienda de juguetes y muebles para chicos.'
const WHATSAPP_NUMBER = (
  import.meta.env.VITE_WHATSAPP_NUMBER || ''
).replace(/\D/g, '')

type Section = 'videos' | 'tienda'

export default function App() {
  const { email, isOwner, loading: authLoading, signIn, signOut } = useAuth()
  const cart = useCart()

  const [section, setSection] = useState<Section>('videos')
  const [videos, setVideos] = useState<Video[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [videoFilter, setVideoFilter] = useState<VideoCategory | 'all'>('all')
  const [productFilter, setProductFilter] = useState<ProductCategory | 'all'>(
    'all',
  )
  const [showLogin, setShowLogin] = useState(false)
  const [showAddVideo, setShowAddVideo] = useState(false)
  const [showAddProduct, setShowAddProduct] = useState(false)
  const [showCart, setShowCart] = useState(false)
  const [playing, setPlaying] = useState<Video | null>(null)

  useEffect(() => {
    Promise.all([listVideos(), listProducts()])
      .then(([loadedVideos, loadedProducts]) => {
        setVideos(loadedVideos)
        setProducts(loadedProducts)
      })
      .catch((err: Error) => setError(err.message))
      .finally(() => setLoading(false))
  }, [])

  const visibleVideos = useMemo(
    () =>
      videoFilter === 'all'
        ? videos
        : videos.filter((video) => video.category === videoFilter),
    [videos, videoFilter],
  )

  const visibleProducts = useMemo(
    () =>
      productFilter === 'all'
        ? products
        : products.filter((product) => product.category === productFilter),
    [products, productFilter],
  )

  async function handleDeleteVideo(video: Video) {
    if (!confirm(`¿Borrar el video "${video.title}"?`)) return
    const previous = videos
    setVideos((current) => current.filter((entry) => entry.id !== video.id))
    try {
      await deleteVideo(video)
    } catch (err) {
      setVideos(previous)
      setError((err as Error).message)
    }
  }

  async function handleDeleteProduct(product: Product) {
    if (!confirm(`¿Borrar el producto "${product.name}"?`)) return
    const previous = products
    setProducts((current) =>
      current.filter((entry) => entry.id !== product.id),
    )
    try {
      await deleteProduct(product)
    } catch (err) {
      setProducts(previous)
      setError((err as Error).message)
    }
  }

  return (
    <div className="min-h-dvh bg-carton-50">
      <header className="sticky top-0 z-40 border-b-4 border-black bg-white">
        <div className="mx-auto flex w-full max-w-6xl flex-wrap items-center gap-3 px-4 py-3 sm:px-6">
          <button
            type="button"
            onClick={() => setSection('videos')}
            className="flex items-center gap-2"
          >
            <span className="grid h-11 w-11 place-items-center rounded-2xl border-4 border-black bg-toon-yellow text-2xl">
              📦
            </span>
            <span className="font-display text-2xl uppercase leading-none tracking-wide text-black sm:text-3xl">
              {SITE_TITLE}
            </span>
          </button>

          <div className="ml-auto flex items-center gap-2">
            <button
              type="button"
              onClick={() => setShowCart(true)}
              className="relative inline-flex items-center gap-2 rounded-full border-4 border-black bg-toon-cyan px-4 py-2 text-sm font-extrabold uppercase text-black transition hover:bg-toon-yellow"
            >
              <CartIcon className="h-4 w-4" />
              Pedido
              {cart.count > 0 ? (
                <span className="absolute -right-2 -top-2 grid h-6 w-6 place-items-center rounded-full border-2 border-black bg-toon-pink text-xs text-white">
                  {cart.count}
                </span>
              ) : null}
            </button>

            {authLoading ? (
              <div className="h-10 w-24 animate-pulse rounded-full bg-carton-100" />
            ) : email ? (
              <>
                {isOwner ? (
                  <button
                    type="button"
                    onClick={() =>
                      section === 'videos'
                        ? setShowAddVideo(true)
                        : setShowAddProduct(true)
                    }
                    className="inline-flex items-center gap-2 rounded-full border-4 border-black bg-toon-pink px-4 py-2 text-sm font-extrabold uppercase text-white transition hover:bg-black"
                  >
                    <PlusIcon className="h-4 w-4" />
                    {section === 'videos' ? 'Video' : 'Producto'}
                  </button>
                ) : null}
                <button
                  type="button"
                  onClick={signOut}
                  className="rounded-full border-2 border-black px-4 py-2 text-sm font-bold uppercase text-black transition hover:bg-carton-100"
                >
                  Salir
                </button>
              </>
            ) : (
              <button
                type="button"
                onClick={() => setShowLogin(true)}
                className="inline-flex items-center gap-2 rounded-full border-2 border-black px-4 py-2 text-sm font-bold uppercase text-black transition hover:bg-carton-100"
              >
                <UserIcon className="h-4 w-4" />
                Entrar
              </button>
            )}
          </div>
        </div>
        <div className="checker-strip h-3 w-full" />
      </header>

      <main className="mx-auto w-full max-w-6xl px-4 pb-20 sm:px-6">
        <section className="py-8 sm:py-12">
          <p className="inline-block -rotate-2 rounded-full border-4 border-black bg-toon-pink px-4 py-1 font-display text-sm uppercase tracking-wide text-white">
            Cartón reciclado · para chicos
          </p>
          <h1 className="mt-4 font-display text-4xl uppercase leading-none text-black sm:text-6xl">
            Dibujos, tutoriales y juguetes de cartón
          </h1>
          <p className="mt-4 max-w-2xl text-base text-carton-700 sm:text-lg">
            {SITE_SUBTITLE}
          </p>
        </section>

        <nav className="mb-6 flex gap-3">
          {(
            [
              { value: 'videos', label: 'Videos' },
              { value: 'tienda', label: 'Tienda' },
            ] as { value: Section; label: string }[]
          ).map(({ value, label }) => (
            <button
              key={value}
              type="button"
              onClick={() => setSection(value)}
              className={`rounded-2xl border-4 border-black px-5 py-2 font-display text-lg uppercase tracking-wide transition ${
                section === value
                  ? 'bg-black text-toon-yellow'
                  : 'bg-white text-black hover:bg-toon-yellow'
              }`}
            >
              {label}
            </button>
          ))}
        </nav>

        {error ? (
          <p
            role="alert"
            className="mb-6 rounded-2xl border-4 border-black bg-toon-pink px-4 py-3 text-sm font-bold text-white"
          >
            {error}
          </p>
        ) : null}

        {section === 'videos' ? (
          <>
            <div className="mb-5 flex gap-2 overflow-x-auto pb-1">
              <FilterChip
                active={videoFilter === 'all'}
                label="Todos"
                onClick={() => setVideoFilter('all')}
              />
              {videoCategories.map((option) => (
                <FilterChip
                  key={option.value}
                  active={videoFilter === option.value}
                  label={`${option.emoji} ${option.label}`}
                  onClick={() => setVideoFilter(option.value)}
                />
              ))}
            </div>

            {loading ? (
              <SkeletonGrid />
            ) : visibleVideos.length === 0 ? (
              <EmptyState
                title="Todavía no hay videos acá"
                hint={
                  isOwner
                    ? 'Tocá “Video” arriba para subir el primero.'
                    : 'Entrá con tu cuenta para subir videos.'
                }
              />
            ) : (
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {visibleVideos.map((video) => (
                  <VideoCard
                    key={video.id}
                    video={video}
                    canEdit={isOwner}
                    onOpen={setPlaying}
                    onDelete={handleDeleteVideo}
                  />
                ))}
              </div>
            )}
          </>
        ) : (
          <>
            <div className="mb-5 flex gap-2 overflow-x-auto pb-1">
              <FilterChip
                active={productFilter === 'all'}
                label="Todos"
                onClick={() => setProductFilter('all')}
              />
              {productCategories.map((option) => (
                <FilterChip
                  key={option.value}
                  active={productFilter === option.value}
                  label={`${option.emoji} ${option.label}`}
                  onClick={() => setProductFilter(option.value)}
                />
              ))}
            </div>

            {loading ? (
              <SkeletonGrid />
            ) : visibleProducts.length === 0 ? (
              <EmptyState
                title="Todavía no hay productos acá"
                hint={
                  isOwner
                    ? 'Tocá “Producto” arriba para publicar el primero.'
                    : 'Entrá con tu cuenta para publicar productos.'
                }
              />
            ) : (
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {visibleProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    canEdit={isOwner}
                    onAdd={(item) => {
                      cart.add(item)
                      setShowCart(true)
                    }}
                    onDelete={handleDeleteProduct}
                  />
                ))}
              </div>
            )}
          </>
        )}
      </main>

      <footer className="border-t-4 border-black bg-black py-8 text-center text-sm text-carton-100">
        <p className="font-display text-xl uppercase text-toon-yellow">
          {SITE_TITLE}
        </p>
        <p className="mt-2">
          {isSupabaseConfigured
            ? 'Videos y productos guardados en Supabase'
            : 'Modo demo · el contenido que cargues queda solo en este navegador'}
        </p>
      </footer>

      {showLogin ? (
        <LoginModal onClose={() => setShowLogin(false)} onSignIn={signIn} />
      ) : null}

      {showAddVideo ? (
        <AddVideoModal
          onClose={() => setShowAddVideo(false)}
          onCreated={(video) => {
            setVideos((current) => [video, ...current])
            setShowAddVideo(false)
          }}
        />
      ) : null}

      {showAddProduct ? (
        <AddProductModal
          onClose={() => setShowAddProduct(false)}
          onCreated={(product) => {
            setProducts((current) => [product, ...current])
            setShowAddProduct(false)
          }}
        />
      ) : null}

      {showCart ? (
        <CartDrawer
          cart={cart}
          phone={WHATSAPP_NUMBER}
          onClose={() => setShowCart(false)}
        />
      ) : null}

      {playing ? (
        <VideoPlayer video={playing} onClose={() => setPlaying(null)} />
      ) : null}
    </div>
  )
}

function FilterChip({
  active,
  label,
  onClick,
}: {
  active: boolean
  label: string
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`whitespace-nowrap rounded-full border-2 border-black px-4 py-2 text-sm font-extrabold uppercase transition ${
        active ? 'bg-black text-white' : 'bg-white text-black hover:bg-toon-yellow'
      }`}
    >
      {label}
    </button>
  )
}

function SkeletonGrid() {
  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {[0, 1, 2].map((key) => (
        <div
          key={key}
          className="h-72 animate-pulse rounded-3xl border-4 border-black bg-carton-100"
        />
      ))}
    </div>
  )
}

function EmptyState({ title, hint }: { title: string; hint: string }) {
  return (
    <div className="rounded-3xl border-4 border-dashed border-black bg-white px-6 py-16 text-center">
      <p className="font-display text-2xl uppercase text-black">{title}</p>
      <p className="mt-2 text-sm text-carton-700">{hint}</p>
    </div>
  )
}
