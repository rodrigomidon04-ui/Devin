import { useEffect, useMemo, useState } from 'react'
import { ItemCard } from './components/ItemCard'
import { ItemFormModal } from './components/ItemFormModal'
import { ItemViewer } from './components/ItemViewer'
import { LoginModal } from './components/LoginModal'
import { ProfileModal } from './components/ProfileModal'
import {
  MoonIcon,
  PlusIcon,
  SearchIcon,
  SunIcon,
  UserIcon,
} from './components/Icons'
import {
  deleteItem,
  getProfile,
  isSupabaseConfigured,
  listItems,
  saveOrder,
} from './lib/api'
import { useAuth } from './lib/useAuth'
import { useTheme } from './lib/useTheme'
import type { ItemKind, PortfolioItem, Profile } from './lib/types'

const DEFAULT_PROFILE: Profile = {
  title: import.meta.env.VITE_SITE_TITLE || 'Mi Portfolio',
  subtitle:
    import.meta.env.VITE_SITE_SUBTITLE ||
    'Imágenes, textos y enlaces de mis proyectos, todo en un solo lugar.',
  avatar_url: null,
}

type Filter = 'all' | ItemKind

const filters: { value: Filter; label: string }[] = [
  { value: 'all', label: 'Todo' },
  { value: 'image', label: 'Imágenes' },
  { value: 'text', label: 'Textos' },
  { value: 'link', label: 'Enlaces' },
  { value: 'pdf', label: 'PDF' },
  { value: 'video', label: 'Videos' },
]

const chipClass = (active: boolean) =>
  `whitespace-nowrap rounded-full px-4 py-2 text-sm transition ${
    active
      ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900'
      : 'border border-black/10 text-slate-600 hover:bg-black/5 dark:border-white/10 dark:text-slate-300 dark:hover:bg-white/10'
  }`

const ghostButtonClass =
  'inline-flex items-center gap-2 rounded-full border border-black/10 px-4 py-2 text-sm text-slate-600 transition hover:bg-black/5 dark:border-white/10 dark:text-slate-300 dark:hover:bg-white/10'

export default function App() {
  const { email, loading: authLoading, signIn, signOut } = useAuth()
  const { theme, toggleTheme } = useTheme()
  const [items, setItems] = useState<PortfolioItem[]>([])
  const [profile, setProfile] = useState<Profile>(DEFAULT_PROFILE)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [filter, setFilter] = useState<Filter>('all')
  const [category, setCategory] = useState<string>('all')
  const [search, setSearch] = useState('')
  const [ordering, setOrdering] = useState(false)
  const [showAdd, setShowAdd] = useState(false)
  const [showLogin, setShowLogin] = useState(false)
  const [showProfile, setShowProfile] = useState(false)
  const [editing, setEditing] = useState<PortfolioItem | null>(null)
  const [viewing, setViewing] = useState<PortfolioItem | null>(null)

  useEffect(() => {
    listItems()
      .then(setItems)
      .catch((err: Error) => setError(err.message))
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    getProfile()
      .then((saved) => {
        if (!saved) return
        setProfile({
          title: saved.title || DEFAULT_PROFILE.title,
          subtitle: saved.subtitle || DEFAULT_PROFILE.subtitle,
          avatar_url: saved.avatar_url,
        })
      })
      .catch(() => undefined)
  }, [])

  const categories = useMemo(() => {
    const names = new Set<string>()
    for (const item of items) if (item.category) names.add(item.category)
    return [...names].sort((a, b) => a.localeCompare(b))
  }, [items])

  const visible = useMemo(() => {
    if (ordering) return items
    const query = search.trim().toLowerCase()
    return items.filter((item) => {
      if (filter !== 'all' && item.kind !== filter) return false
      if (category !== 'all' && item.category !== category) return false
      if (!query) return true
      return [item.title, item.description, item.category, item.file_name]
        .filter(Boolean)
        .some((field) => String(field).toLowerCase().includes(query))
    })
  }, [items, filter, category, search, ordering])

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

  async function handleMove(item: PortfolioItem, direction: -1 | 1) {
    const index = items.findIndex((entry) => entry.id === item.id)
    const target = index + direction
    if (index === -1 || target < 0 || target >= items.length) return

    const previous = items
    const next = [...items]
    ;[next[index], next[target]] = [next[target], next[index]]
    setItems(next.map((entry, position) => ({ ...entry, position })))
    try {
      await saveOrder(next)
    } catch (err) {
      setItems(previous)
      setError((err as Error).message)
    }
  }

  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-6xl flex-col px-4 pb-16 pt-[max(1.5rem,env(safe-area-inset-top))] sm:px-6">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <span className="text-sm font-semibold uppercase tracking-[0.2em] text-indigo-600 dark:text-indigo-300">
          Portfolio
        </span>
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={toggleTheme}
            aria-label={theme === 'dark' ? 'Usar tema claro' : 'Usar tema oscuro'}
            className={ghostButtonClass}
          >
            {theme === 'dark' ? (
              <SunIcon className="h-4 w-4" />
            ) : (
              <MoonIcon className="h-4 w-4" />
            )}
          </button>
          {authLoading ? (
            <div className="h-9 w-24 animate-pulse rounded-full bg-black/5 dark:bg-white/5" />
          ) : email ? (
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
                onClick={() => setOrdering((current) => !current)}
                className={ghostButtonClass}
              >
                {ordering ? 'Listo' : 'Ordenar'}
              </button>
              <button
                type="button"
                onClick={() => setShowProfile(true)}
                className={ghostButtonClass}
              >
                Perfil
              </button>
              <button type="button" onClick={signOut} className={ghostButtonClass}>
                Salir
              </button>
            </>
          ) : (
            <button
              type="button"
              onClick={() => setShowLogin(true)}
              className={ghostButtonClass}
            >
              <UserIcon className="h-4 w-4" />
              Entrar
            </button>
          )}
        </div>
      </header>

      <section className="flex flex-col gap-5 py-10 sm:flex-row sm:items-center sm:py-14">
        {profile.avatar_url ? (
          <img
            src={profile.avatar_url}
            alt={profile.title}
            className="h-24 w-24 shrink-0 rounded-full object-cover ring-2 ring-indigo-400/50"
          />
        ) : null}
        <div>
          <h1 className="text-4xl font-bold leading-tight text-slate-900 sm:text-6xl dark:text-white">
            {profile.title}
          </h1>
          <p className="mt-4 max-w-2xl text-base text-slate-600 sm:text-lg dark:text-slate-300">
            {profile.subtitle}
          </p>
        </div>
      </section>

      {ordering ? (
        <p className="mb-6 rounded-xl bg-indigo-500/15 px-4 py-3 text-sm text-indigo-700 dark:text-indigo-200">
          Modo ordenar: usá las flechas de cada tarjeta para cambiar el orden. Tocá
          “Listo” cuando termines.
        </p>
      ) : (
        <>
          <label className="relative mb-4 block">
            <SearchIcon className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Buscar por título, descripción o categoría"
              aria-label="Buscar"
              className="w-full rounded-full border border-black/10 bg-white py-3 pl-11 pr-4 text-base text-slate-900 placeholder:text-slate-400 focus:border-indigo-400 focus:outline-none dark:border-white/10 dark:bg-white/5 dark:text-white dark:placeholder:text-slate-500"
            />
          </label>

          <nav className="mb-3 flex gap-2 overflow-x-auto pb-1">
            {filters.map(({ value, label }) => (
              <button
                key={value}
                type="button"
                onClick={() => setFilter(value)}
                className={chipClass(filter === value)}
              >
                {label}
              </button>
            ))}
          </nav>

          {categories.length > 0 ? (
            <nav className="mb-6 flex gap-2 overflow-x-auto pb-1">
              <button
                type="button"
                onClick={() => setCategory('all')}
                className={chipClass(category === 'all')}
              >
                Todas las categorías
              </button>
              {categories.map((name) => (
                <button
                  key={name}
                  type="button"
                  onClick={() => setCategory(name)}
                  className={chipClass(category === name)}
                >
                  {name}
                </button>
              ))}
            </nav>
          ) : null}
        </>
      )}

      {error ? (
        <p role="alert" className="mb-6 rounded-xl bg-red-500/15 px-4 py-3 text-sm text-red-700 dark:text-red-200">
          {error}
        </p>
      ) : null}

      {loading ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[0, 1, 2].map((key) => (
            <div
              key={key}
              className="h-64 animate-pulse rounded-2xl bg-black/5 dark:bg-white/5"
            />
          ))}
        </div>
      ) : visible.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-black/15 px-6 py-16 text-center dark:border-white/15">
          <p className="text-lg font-medium text-slate-900 dark:text-white">
            {items.length === 0 ? 'Todavía no hay nada acá' : 'Sin resultados'}
          </p>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            {items.length > 0
              ? 'Probá con otra búsqueda o filtro.'
              : authLoading
                ? ''
                : email
                  ? 'Tocá “Agregar” para subir tu primera imagen, texto, PDF, video o enlace.'
                  : 'Entrá con tu cuenta para subir tus trabajos.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {visible.map((item, index) => (
            <ItemCard
              key={item.id}
              item={item}
              canEdit={Boolean(email)}
              ordering={ordering}
              isFirst={index === 0}
              isLast={index === visible.length - 1}
              onOpen={setViewing}
              onEdit={setEditing}
              onDelete={handleDelete}
              onMove={handleMove}
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
        <ItemFormModal
          categories={categories}
          onClose={() => setShowAdd(false)}
          onSaved={(item) => {
            setItems((current) => [item, ...current])
            setShowAdd(false)
          }}
        />
      ) : null}

      {editing ? (
        <ItemFormModal
          item={editing}
          categories={categories}
          onClose={() => setEditing(null)}
          onSaved={(saved) => {
            setItems((current) =>
              current.map((entry) => (entry.id === saved.id ? saved : entry)),
            )
            setEditing(null)
          }}
        />
      ) : null}

      {showProfile ? (
        <ProfileModal
          profile={profile}
          onClose={() => setShowProfile(false)}
          onSaved={(saved) => {
            setProfile(saved)
            setShowProfile(false)
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
