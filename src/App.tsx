import { useEffect, useMemo, useState } from 'react'
import { AddItemModal } from './components/AddItemModal'
import { ItemCard } from './components/ItemCard'
import { ItemViewer } from './components/ItemViewer'
import { LoginModal } from './components/LoginModal'
import { PlusIcon, UserIcon } from './components/Icons'
import { deleteItem, isSupabaseConfigured, listItems } from './lib/api'
import { useAuth } from './lib/useAuth'
import type { ItemKind, PortfolioItem } from './lib/types'

const SITE_TITLE = import.meta.env.VITE_SITE_TITLE || 'Mi Portfolio'
const SITE_SUBTITLE =
  import.meta.env.VITE_SITE_SUBTITLE ||
  'Imágenes, textos y enlaces de mis proyectos, todo en un solo lugar.'

type Filter = 'all' | ItemKind

const filters: { value: Filter; label: string }[] = [
  { value: 'all', label: 'Todo' },
  { value: 'image', label: 'Imágenes' },
  { value: 'text', label: 'Textos' },
  { value: 'link', label: 'Enlaces' },
]

export default function App() {
  const { email, signIn, signOut } = useAuth()
  const [items, setItems] = useState<PortfolioItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [filter, setFilter] = useState<Filter>('all')
  const [showAdd, setShowAdd] = useState(false)
  const [showLogin, setShowLogin] = useState(false)
  const [viewing, setViewing] = useState<PortfolioItem | null>(null)

  useEffect(() => {
    listItems()
      .then(setItems)
      .catch((err: Error) => setError(err.message))
      .finally(() => setLoading(false))
  }, [])

  const visible = useMemo(
    () => (filter === 'all' ? items : items.filter((item) => item.kind === filter)),
    [items, filter],
  )

  async function handleDelete(item: PortfolioItem) {
    if (!confirm(`¿Borrar "${item.title}"?`)) return
    const previous = items
    setItems((current) => current.filter((entry) => entry.id !== item.id))
    try {
      await deleteItem(item)
    } catch (err) {
      setItems(previous)
      setError((err as Error).message)
    }
  }

  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-6xl flex-col px-4 pb-16 pt-[max(1.5rem,env(safe-area-inset-top))] sm:px-6">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <span className="text-sm font-semibold uppercase tracking-[0.2em] text-indigo-300">
          Portfolio
        </span>
        <div className="flex items-center gap-2">
          {email ? (
            <>
              <button
                type="button"
                onClick={() => setShowAdd(true)}
                className="inline-flex items-center gap-2 rounded-full bg-indigo-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-indigo-400"
              >
                <PlusIcon className="h-4 w-4" />
                Agregar
              </button>
              <button
                type="button"
                onClick={signOut}
                className="rounded-full border border-white/10 px-4 py-2 text-sm text-slate-300 transition hover:bg-white/10"
              >
                Salir
              </button>
            </>
          ) : (
            <button
              type="button"
              onClick={() => setShowLogin(true)}
              className="inline-flex items-center gap-2 rounded-full border border-white/10 px-4 py-2 text-sm text-slate-300 transition hover:bg-white/10"
            >
              <UserIcon className="h-4 w-4" />
              Entrar
            </button>
          )}
        </div>
      </header>

      <section className="py-10 sm:py-14">
        <h1 className="text-4xl font-bold leading-tight text-white sm:text-6xl">
          {SITE_TITLE}
        </h1>
        <p className="mt-4 max-w-2xl text-base text-slate-300 sm:text-lg">
          {SITE_SUBTITLE}
        </p>
      </section>

      <nav className="mb-6 flex gap-2 overflow-x-auto pb-1">
        {filters.map(({ value, label }) => (
          <button
            key={value}
            type="button"
            onClick={() => setFilter(value)}
            className={`whitespace-nowrap rounded-full px-4 py-2 text-sm transition ${
              filter === value
                ? 'bg-white text-slate-900'
                : 'border border-white/10 text-slate-300 hover:bg-white/10'
            }`}
          >
            {label}
          </button>
        ))}
      </nav>

      {error ? (
        <p role="alert" className="mb-6 rounded-xl bg-red-500/15 px-4 py-3 text-sm text-red-200">
          {error}
        </p>
      ) : null}

      {loading ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[0, 1, 2].map((key) => (
            <div key={key} className="h-64 animate-pulse rounded-2xl bg-white/5" />
          ))}
        </div>
      ) : visible.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-white/15 px-6 py-16 text-center">
          <p className="text-lg font-medium text-white">Todavía no hay nada acá</p>
          <p className="mt-2 text-sm text-slate-400">
            {email
              ? 'Tocá “Agregar” para subir tu primera imagen, texto o enlace.'
              : 'Entrá con tu cuenta para subir tus trabajos.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {visible.map((item) => (
            <ItemCard
              key={item.id}
              item={item}
              canEdit={Boolean(email)}
              onOpen={setViewing}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      <footer className="mt-auto pt-14 text-center text-xs text-slate-500">
        {isSupabaseConfigured
          ? 'Hecho con React y Supabase'
          : 'Modo demo · los archivos se guardan solo en este navegador'}
      </footer>

      {showAdd ? (
        <AddItemModal
          onClose={() => setShowAdd(false)}
          onCreated={(item) => {
            setItems((current) => [item, ...current])
            setShowAdd(false)
          }}
        />
      ) : null}

      {showLogin ? (
        <LoginModal onClose={() => setShowLogin(false)} onSignIn={signIn} />
      ) : null}

      {viewing ? (
        <ItemViewer item={viewing} onClose={() => setViewing(null)} />
      ) : null}
    </div>
  )
}
