import { useEffect, useId, useRef, useState } from 'react'
import { createPortal } from 'react-dom'

import { authClient } from '#/lib/auth-client'

type SignInModalProps = {
  open: boolean
  onClose: () => void
}

export function SignInModal({ open, onClose }: SignInModalProps) {
  const idPrefix = useId()
  const panelRef = useRef<HTMLDivElement>(null)
  const [isSignUp, setIsSignUp] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const titleId = `${idPrefix}-auth-title`

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = prev
    }
  }, [open, onClose])

  useEffect(() => {
    if (!open) {
      setError('')
      setLoading(false)
      return
    }
    queueMicrotask(() => {
      panelRef.current?.querySelector<HTMLInputElement>('input[type="email"]')?.focus()
    })
  }, [open])

  if (!open || typeof document === 'undefined') return null

  const inputClass =
    'flex h-10 w-full rounded-xl border border-[var(--line)] bg-[var(--surface)] px-3 text-sm text-[var(--sea-ink)] outline-none transition focus:border-[var(--lagoon-deep)] focus:ring-2 focus:ring-[var(--lagoon)]/30 disabled:cursor-not-allowed disabled:opacity-50'

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      if (isSignUp) {
        const result = await authClient.signUp.email({ email, password, name })
        if (result.error) {
          setError(result.error.message || 'Sign up failed')
        } else {
          onClose()
        }
      } else {
        const result = await authClient.signIn.email({ email, password })
        if (result.error) {
          setError(result.error.message || 'Sign in failed')
        } else {
          onClose()
        }
      }
    } catch {
      setError('An unexpected error occurred')
    } finally {
      setLoading(false)
    }
  }

  /** Portals to `document.body` so `position: fixed` is viewport-relative (header `backdrop-filter` would otherwise shrink the containing block). */
  return createPortal(
    <div
      className="fixed inset-0 z-[100] flex min-h-[100dvh] items-center justify-center p-4 sm:p-6"
      role="presentation"
    >
      <button
        type="button"
        className="absolute inset-0 bg-[var(--sea-ink)]/25 backdrop-blur-[2px]"
        aria-label="Close dialog"
        onClick={onClose}
      />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="island-shell relative z-10 max-h-[min(90dvh,40rem)] w-full max-w-md overflow-y-auto rise-in rounded-2xl border border-[var(--line)] bg-[var(--header-bg)] p-6 shadow-[0_24px_64px_rgba(23,58,64,0.18)]"
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full text-[var(--sea-ink-soft)] transition hover:bg-[var(--link-bg-hover)] hover:text-[var(--sea-ink)]"
          aria-label="Close"
        >
          <span aria-hidden className="text-lg leading-none">
            ×
          </span>
        </button>

        <h2
          id={titleId}
          className="m-0 pr-8 text-lg font-semibold tracking-tight text-[var(--sea-ink)]"
        >
          {isSignUp ? 'Create an account' : 'Sign in'}
        </h2>
        <p className="mt-2 mb-6 text-sm text-[var(--sea-ink-soft)]">
          {isSignUp
            ? 'Enter your details to join and post jokes.'
            : 'Use your email and password to continue.'}
        </p>

        <form onSubmit={(e) => void handleSubmit(e)} className="grid gap-4">
          {isSignUp && (
            <div className="grid gap-1.5">
              <label
                htmlFor={`${idPrefix}-name`}
                className="text-sm font-medium text-[var(--sea-ink)]"
              >
                Name
              </label>
              <input
                id={`${idPrefix}-name`}
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={inputClass}
                required
                autoComplete="name"
              />
            </div>
          )}

          <div className="grid gap-1.5">
            <label
              htmlFor={`${idPrefix}-email`}
              className="text-sm font-medium text-[var(--sea-ink)]"
            >
              Email
            </label>
            <input
              id={`${idPrefix}-email`}
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={inputClass}
              required
              autoComplete="email"
            />
          </div>

          <div className="grid gap-1.5">
            <label
              htmlFor={`${idPrefix}-password`}
              className="text-sm font-medium text-[var(--sea-ink)]"
            >
              Password
            </label>
            <input
              id={`${idPrefix}-password`}
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={inputClass}
              required
              minLength={8}
              autoComplete={isSignUp ? 'new-password' : 'current-password'}
            />
          </div>

          {error ? (
            <p className="m-0 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-200">
              {error}
            </p>
          ) : null}

          <button
            type="submit"
            disabled={loading}
            className="mt-1 flex h-10 w-full items-center justify-center rounded-full bg-[var(--lagoon-deep)] text-sm font-semibold text-white shadow-[0_8px_24px_color-mix(in_oklab,var(--lagoon-deep)_38%,transparent)] transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                Please wait
              </span>
            ) : isSignUp ? (
              'Create account'
            ) : (
              'Sign in'
            )}
          </button>
        </form>

        <div className="mt-4 text-center">
          <button
            type="button"
            onClick={() => {
              setIsSignUp(!isSignUp)
              setError('')
            }}
            className="border-0 bg-transparent p-0 text-sm font-medium text-[var(--lagoon-deep)] underline decoration-[var(--lagoon)]/35 underline-offset-2 transition hover:decoration-[var(--lagoon-deep)]"
          >
            {isSignUp
              ? 'Already have an account? Sign in'
              : "Don't have an account? Sign up"}
          </button>
        </div>
      </div>
    </div>,
    document.body,
  )
}
