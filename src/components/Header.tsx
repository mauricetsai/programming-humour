import { Link } from '@tanstack/react-router'

import BetterAuthHeader from '../integrations/better-auth/header-user.tsx'
import { useVoteHandMode } from '#/hooks/useVoteHandMode'
import { authClient } from '#/lib/auth-client'
import ThemeToggle from './ThemeToggle'

function VoteHandToggle() {
  const { mode, setMode } = useVoteHandMode()

  return (
    <div
      className="flex items-center gap-1.5"
      role="group"
      aria-label="Vote controls position on joke cards"
    >
      <span
        className="hidden text-[11px] font-medium text-[var(--sea-ink-soft)] sm:inline"
        aria-hidden
      >
        Votes
      </span>
      <div className="inline-flex overflow-hidden rounded-full border border-[var(--line)] bg-[var(--surface)] p-0.5 text-[11px] font-semibold">
        <button
          type="button"
          onClick={() => setMode('left')}
          title="Place ++ / -- on the left"
          className={`rounded-full px-2 py-1 transition sm:px-2.5 ${
            mode === 'left'
              ? 'bg-[var(--lagoon-deep)] text-white'
              : 'text-[var(--sea-ink-soft)] hover:text-[var(--sea-ink)]'
          }`}
          aria-pressed={mode === 'left'}
        >
          Left
        </button>
        <button
          type="button"
          onClick={() => setMode('right')}
          title="Place ++ / -- on the right"
          className={`rounded-full px-2 py-1 transition sm:px-2.5 ${
            mode === 'right'
              ? 'bg-[var(--lagoon-deep)] text-white'
              : 'text-[var(--sea-ink-soft)] hover:text-[var(--sea-ink)]'
          }`}
          aria-pressed={mode === 'right'}
        >
          Right
        </button>
      </div>
    </div>
  )
}

function AddJokeNavLink() {
  const { data: session, isPending } = authClient.useSession()

  if (isPending) {
    return (
      <span className="nav-link opacity-60" aria-hidden>
        Add Joke
      </span>
    )
  }

  if (!session?.user) {
    return (
      <span
        className="nav-link cursor-not-allowed opacity-45"
        aria-disabled
        title="Sign in to add a joke"
      >
        Add Joke
      </span>
    )
  }

  return (
    <Link
      to="/add-joke"
      className="nav-link"
      activeProps={{ className: 'nav-link is-active' }}
    >
      Add Joke
    </Link>
  )
}

export default function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-[var(--line)] bg-[var(--header-bg)] px-4 backdrop-blur-lg">
      <nav className="page-wrap flex flex-wrap items-center gap-x-3 gap-y-2 py-3 sm:py-4">
        <div className="flex min-w-0 flex-1 flex-wrap items-center gap-x-4 gap-y-2">
          <h2 className="m-0 flex-shrink-0 text-base font-semibold tracking-tight">
            <Link
              to="/"
              className="inline-flex items-center gap-2 rounded-full border border-[var(--chip-line)] bg-[var(--chip-bg)] px-3 py-1.5 text-sm text-[var(--sea-ink)] no-underline shadow-[0_8px_24px_color-mix(in_oklab,var(--sea-ink)_10%,transparent)] sm:px-4 sm:py-2"
            >
              <span className="h-2 w-2 rounded-full bg-[linear-gradient(90deg,#00b8d9,#55b85a)]" />
              Programming Humour
            </Link>
          </h2>

          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm font-semibold">
            <Link
              to="/"
              className="nav-link"
              activeProps={{ className: 'nav-link is-active' }}
            >
              Home
            </Link>
            <AddJokeNavLink />
          </div>
        </div>

        <div className="ml-auto flex flex-shrink-0 flex-wrap items-center justify-end gap-1.5 sm:gap-2">
          <VoteHandToggle />
          <ThemeToggle />
          <BetterAuthHeader />
        </div>
      </nav>
    </header>
  )
}
