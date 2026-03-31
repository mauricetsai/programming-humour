import { createFileRoute, useRouter } from '@tanstack/react-router'
import { useState } from 'react'

import { requestOpenAuthModal } from '#/lib/auth-modal'
import { getAuthUserId } from '#/lib/auth-session.fn'
import { createJoke } from '#/lib/jokes.fn'

export const Route = createFileRoute('/add-joke')({
  component: AddJokePage,
  loader: async () => ({ userId: await getAuthUserId() }),
})

function AddJokePage() {
  const { userId } = Route.useLoaderData()
  const router = useRouter()
  const [setup, setSetup] = useState('')
  const [punchline, setPunchline] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  if (!userId) {
    return (
      <main className="page-wrap px-4 pb-16 pt-10">
        <section className="island-shell mx-auto max-w-lg rise-in rounded-2xl p-8 text-center">
          <h1 className="mt-0 text-xl font-semibold text-[var(--sea-ink)]">
            Access denied
          </h1>
          <p className="mb-6 text-[var(--sea-ink-soft)]">
            You must sign in to add a joke. Open sign-in from the header, or use
            the button below.
          </p>
          <button
            type="button"
            onClick={() => requestOpenAuthModal()}
            className="inline-flex items-center justify-center rounded-full border border-[color-mix(in_oklab,var(--lagoon-deep)_42%,transparent)] bg-[color-mix(in_oklab,var(--lagoon)_18%,transparent)] px-5 py-2.5 text-sm font-semibold text-[var(--lagoon-deep)] transition hover:-translate-y-0.5 hover:bg-[color-mix(in_oklab,var(--lagoon)_28%,transparent)]"
          >
            Sign in
          </button>
        </section>
      </main>
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSubmitting(true)
    try {
      await createJoke({ data: { setup, punchline } })
      await router.navigate({ to: '/' })
    } catch {
      setError('Could not save your joke. Check both fields and try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <main className="page-wrap px-4 pb-16 pt-10">
      <section className="island-shell mx-auto max-w-lg rise-in relative overflow-hidden rounded-[1.75rem] px-6 py-8 sm:px-8 sm:py-10">
        <div className="pointer-events-none absolute -right-16 -top-12 h-40 w-40 rounded-full bg-[radial-gradient(circle,rgba(0,184,217,0.22),transparent_68%)]" />
        <p className="island-kicker mb-2">Share something terrible</p>
        <h1 className="mt-0 text-2xl font-bold tracking-tight text-[var(--sea-ink)] sm:text-3xl">
          Add a joke
        </h1>
        <p className="mb-6 text-sm text-[var(--sea-ink-soft)] sm:text-base">
          Setup and punchline are stored separately so the punch line can land
          properly.
        </p>

        <form onSubmit={(e) => void handleSubmit(e)} className="grid gap-4">
          <div className="grid gap-1.5">
            <label htmlFor="setup" className="text-sm font-medium text-[var(--sea-ink)]">
              Setup
            </label>
            <textarea
              id="setup"
              required
              rows={3}
              value={setup}
              onChange={(e) => setSetup(e.target.value)}
              className="w-full resize-y rounded-xl border border-[var(--line)] bg-[var(--surface)] px-3 py-2 text-sm text-[var(--sea-ink)] outline-none focus:ring-2 focus:ring-[var(--lagoon)]/35"
              placeholder="Why do programmers prefer dark mode?"
            />
          </div>
          <div className="grid gap-1.5">
            <label
              htmlFor="punchline"
              className="text-sm font-medium text-[var(--sea-ink)]"
            >
              Punchline
            </label>
            <textarea
              id="punchline"
              required
              rows={3}
              value={punchline}
              onChange={(e) => setPunchline(e.target.value)}
              className="w-full resize-y rounded-xl border border-[var(--line)] bg-[var(--surface)] px-3 py-2 text-sm text-[var(--sea-ink)] outline-none focus:ring-2 focus:ring-[var(--lagoon)]/35"
              placeholder="Because light attracts bugs."
            />
          </div>
          {error ? (
            <p className="m-0 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-200">
              {error}
            </p>
          ) : null}
          <div className="flex flex-wrap gap-3 pt-2">
            <button
              type="submit"
              disabled={submitting}
              className="rounded-full bg-[var(--lagoon-deep)] px-6 py-2.5 text-sm font-semibold text-white shadow-[0_8px_24px_color-mix(in_oklab,var(--lagoon-deep)_38%,transparent)] transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitting ? 'Saving…' : 'Save joke'}
            </button>
            <button
              type="button"
              className="rounded-full border border-[var(--line)] bg-transparent px-6 py-2.5 text-sm font-semibold text-[var(--sea-ink)] transition hover:bg-[var(--link-bg-hover)]"
              onClick={() => void router.navigate({ to: '/' })}
            >
              Cancel
            </button>
          </div>
        </form>
      </section>
    </main>
  )
}
