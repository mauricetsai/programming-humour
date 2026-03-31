import { useEffect, useState } from 'react'

import { SignInModal } from '#/components/SignInModal'
import { OPEN_AUTH_MODAL_EVENT, requestOpenAuthModal } from '#/lib/auth-modal'
import { authClient } from '#/lib/auth-client'

export default function BetterAuthHeader() {
  const { data: session, isPending } = authClient.useSession()
  const [authOpen, setAuthOpen] = useState(false)

  useEffect(() => {
    const open = () => setAuthOpen(true)
    window.addEventListener(OPEN_AUTH_MODAL_EVENT, open)
    return () => window.removeEventListener(OPEN_AUTH_MODAL_EVENT, open)
  }, [])

  useEffect(() => {
    if (session?.user) setAuthOpen(false)
  }, [session?.user])

  if (isPending) {
    return (
      <div
        className="h-9 w-[4.5rem] shrink-0 animate-pulse rounded-full bg-[var(--surface)]"
        aria-hidden
      />
    )
  }

  if (session?.user) {
    return (
      <div className="flex items-center gap-2">
        {session.user.image ? (
          <img
            src={session.user.image}
            alt=""
            className="h-9 w-9 shrink-0 rounded-full border border-[var(--line)] object-cover"
          />
        ) : (
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[var(--chip-line)] bg-[var(--chip-bg)] text-sm font-semibold text-[var(--sea-ink)]">
            {session.user.name?.charAt(0).toUpperCase() || 'U'}
          </div>
        )}
        <button
          type="button"
          onClick={() => void authClient.signOut()}
          className="shrink-0 rounded-full border border-[var(--line)] bg-[var(--surface)] px-4 py-2 text-sm font-semibold text-[var(--sea-ink)] shadow-[0_4px_14px_color-mix(in_oklab,var(--sea-ink)_8%,transparent)] transition hover:border-[color-mix(in_oklab,var(--lagoon-deep)_40%,transparent)] hover:bg-[color-mix(in_oklab,var(--lagoon)_14%,transparent)]"
        >
          Sign out
        </button>
      </div>
    )
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setAuthOpen(true)}
        className="shrink-0 rounded-full border border-[color-mix(in_oklab,var(--lagoon-deep)_42%,transparent)] bg-[color-mix(in_oklab,var(--lagoon)_18%,transparent)] px-4 py-2 text-sm font-semibold text-[var(--lagoon-deep)] shadow-[0_4px_14px_color-mix(in_oklab,var(--sea-ink)_10%,transparent)] transition hover:-translate-y-0.5 hover:bg-[color-mix(in_oklab,var(--lagoon)_28%,transparent)]"
      >
        Sign in
      </button>
      <SignInModal open={authOpen} onClose={() => setAuthOpen(false)} />
    </>
  )
}
