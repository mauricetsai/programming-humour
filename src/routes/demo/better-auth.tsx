import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useEffect } from 'react'

import { requestOpenAuthModal } from '#/lib/auth-modal'

/** Legacy route: open the header sign-in modal and return home. */
export const Route = createFileRoute('/demo/better-auth')({
  component: BetterAuthRedirect,
})

function BetterAuthRedirect() {
  const navigate = useNavigate()

  useEffect(() => {
    requestOpenAuthModal()
    void navigate({ to: '/', replace: true })
  }, [navigate])

  return (
    <div className="page-wrap flex justify-center px-4 py-16">
      <p className="text-sm text-[var(--sea-ink-soft)]">Opening sign-in…</p>
    </div>
  )
}
