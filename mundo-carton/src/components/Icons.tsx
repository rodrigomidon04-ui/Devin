interface IconProps {
  className?: string
}

export function PlusIcon({ className = 'h-5 w-5' }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" aria-hidden="true">
      <path d="M12 5v14M5 12h14" />
    </svg>
  )
}

export function TrashIcon({ className = 'h-5 w-5' }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" aria-hidden="true">
      <path d="M4 7h16M9 7V5h6v2M6 7l1 13h10l1-13" />
    </svg>
  )
}

export function CloseIcon({ className = 'h-5 w-5' }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" aria-hidden="true">
      <path d="M6 6l12 12M18 6L6 18" />
    </svg>
  )
}

export function CartIcon({ className = 'h-5 w-5' }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M3 4h2l2.4 11.2a2 2 0 002 1.6h7.8a2 2 0 002-1.6L21 8H6" />
      <circle cx="10" cy="20" r="1.4" />
      <circle cx="17" cy="20" r="1.4" />
    </svg>
  )
}

export function PlayIcon({ className = 'h-5 w-5' }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M8 5.5v13l11-6.5-11-6.5z" />
    </svg>
  )
}

export function UserIcon({ className = 'h-5 w-5' }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" aria-hidden="true">
      <circle cx="12" cy="8" r="3.5" />
      <path d="M4.5 20c1.5-3.5 4.2-5 7.5-5s5.9 1.5 7.5 5" />
    </svg>
  )
}

export function WhatsappIcon({ className = 'h-5 w-5' }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12.04 2C6.6 2 2.2 6.4 2.2 11.84c0 1.94.55 3.75 1.5 5.29L2 22l4.99-1.65a9.83 9.83 0 005.05 1.38c5.44 0 9.84-4.4 9.84-9.84S17.48 2 12.04 2zm5.7 13.9c-.24.67-1.4 1.29-1.93 1.34-.53.05-1.02.24-3.47-.9-2.86-1.34-4.62-4.4-4.76-4.6-.14-.2-1.12-1.62-1.06-3.05.05-1.43.83-2.11 1.11-2.4.29-.29.62-.34.83-.34.2 0 .43.01.62.02.2.01.47-.08.72.57.25.65.85 2.13.92 2.28.07.15.12.33.02.53-.1.2-.2.32-.39.53-.19.21-.29.33-.42.53-.13.2-.05.4.03.57.09.17.72 1.35 1.6 2.13 1.13 1 2.07 1.32 2.36 1.47.29.15.46.13.63-.06.17-.2.72-.85.91-1.14.19-.29.39-.24.65-.14.26.1 1.63.79 1.9.94.28.14.46.21.53.33.07.11.07.66-.17 1.32z" />
    </svg>
  )
}
