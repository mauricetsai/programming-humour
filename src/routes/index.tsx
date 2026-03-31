import { createFileRoute, useRouter } from '@tanstack/react-router'
import { Trash2 } from 'lucide-react'
import { useCallback, useMemo, useState } from 'react'

import { useVoteHandMode } from '#/hooks/useVoteHandMode'
import { authClient } from '#/lib/auth-client'
import { formatRelativeTime } from '#/lib/formatRelativeTime'
import {
  deleteJoke,
  listJokes,
  voteJoke,
  type JokeRow,
} from '#/lib/jokes.fn'

export const Route = createFileRoute('/')({
  component: Home,
  loader: async () => ({ jokes: await listJokes() }),
})

function Home() {
  const { jokes } = Route.useLoaderData()
  const router = useRouter()
  const { data: session } = authClient.useSession()
  const currentUserId = session?.user?.id ?? null
  const [pendingId, setPendingId] = useState<number | null>(null)
  const { mode: voteHandMode } = useVoteHandMode()

  const { topThree, more } = useMemo(() => {
    const topThree = jokes.slice(0, 3)
    const more = jokes.slice(3)
    return { topThree, more }
  }, [jokes])

  const refresh = useCallback(async () => {
    await router.invalidate()
  }, [router])

  const handleVote = async (jokeId: number, direction: 'up' | 'down') => {
    setPendingId(jokeId)
    try {
      await voteJoke({ data: { jokeId, direction } })
      await refresh()
    } finally {
      setPendingId(null)
    }
  }

  const handleDelete = async (jokeId: number) => {
    if (!confirm('Delete this joke? This cannot be undone.')) return
    setPendingId(jokeId)
    try {
      await deleteJoke({ data: { jokeId } })
      await refresh()
    } finally {
      setPendingId(null)
    }
  }

  return (
    <main className="page-wrap px-4 pb-8 pt-14">
      <section className="island-shell rise-in relative overflow-hidden rounded-[2rem] px-6 py-10 sm:px-10 sm:py-14">
        <div className="pointer-events-none absolute -left-20 -top-24 h-56 w-56 rounded-full bg-[radial-gradient(circle,rgba(0,184,217,0.32),transparent_66%)]" />
        <div className="pointer-events-none absolute -bottom-20 -right-20 h-56 w-56 rounded-full bg-[radial-gradient(circle,rgba(107,91,149,0.22),transparent_66%)]" />
        <p className="island-kicker mb-3">Programming Humour</p>
        <h1 className="display-title mb-5 max-w-3xl text-4xl leading-[1.02] font-bold tracking-tight text-[var(--sea-ink)] sm:text-6xl">
          Jokes only a debugger could love.
        </h1>
        <p className="mb-0 max-w-2xl text-base text-[var(--sea-ink-soft)] sm:text-lg">
          A cozy corner for developers to share programmer-humor setups and
          punchlines, vote once per joke when you are signed in, and delete only
          what you wrote.
        </p>
      </section>

      <section className="mt-10">
        <h2 className="mb-4 text-lg font-semibold text-[var(--sea-ink)]">
          Community jokes
        </h2>

        {jokes.length === 0 ? (
          <p className="m-0 rounded-2xl border border-dashed border-[var(--line)] bg-[var(--surface)] px-6 py-12 text-center text-[var(--sea-ink-soft)]">
            No jokes found.
          </p>
        ) : (
          <div className="flex flex-col gap-10">
            <JokeSection
              title="Top 3 Jokes"
              jokes={topThree}
              voteHandMode={voteHandMode}
              currentUserId={currentUserId}
              pendingId={pendingId}
              onVote={handleVote}
              onDelete={handleDelete}
            />
            {more.length > 0 ? (
              <JokeSection
                title="More Jokes"
                jokes={more}
                voteHandMode={voteHandMode}
                currentUserId={currentUserId}
                pendingId={pendingId}
                onVote={handleVote}
                onDelete={handleDelete}
              />
            ) : null}
          </div>
        )}
      </section>
    </main>
  )
}

function JokeSection({
  title,
  jokes,
  voteHandMode,
  currentUserId,
  pendingId,
  onVote,
  onDelete,
}: {
  title: string
  jokes: JokeRow[]
  voteHandMode: 'left' | 'right'
  currentUserId: string | null
  pendingId: number | null
  onVote: (id: number, direction: 'up' | 'down') => void
  onDelete: (id: number) => void
}) {
  const voteDisabled = !currentUserId
  const rowReverse =
    voteHandMode === 'left' ? 'sm:flex-row-reverse' : 'sm:flex-row'

  return (
    <div>
      <h3 className="mb-3 text-base font-semibold text-[var(--lagoon-deep)]">
        {title}
      </h3>
      <ul className="m-0 flex list-none flex-col gap-3 p-0">
        {jokes.map((joke) => (
          <li key={joke.id}>
            <article
              className={`island-shell flex flex-col gap-3 rounded-2xl p-5 sm:items-start sm:justify-between ${rowReverse}`}
            >
              <div className="min-w-0 flex-1">
                <p className="m-0 text-[var(--sea-ink)]">{joke.setup}</p>
                <p className="mt-2 mb-0 text-sm font-medium text-[var(--lagoon-deep)]">
                  {joke.punchline}
                </p>
                <p className="mt-3 mb-0 text-xs text-[var(--sea-ink-soft)]">
                  <span className="font-medium text-[var(--sea-ink)]">
                    {joke.authorName}
                  </span>
                  <span aria-hidden className="mx-1.5 text-[var(--line)]">
                    ·
                  </span>
                  <time dateTime={new Date(joke.createdAt).toISOString()}>
                    {formatRelativeTime(joke.createdAt)}
                  </time>
                </p>
              </div>
              <div
                className={`flex shrink-0 flex-wrap items-center gap-2 sm:flex-col ${
                  voteHandMode === 'left'
                    ? 'sm:items-start'
                    : 'sm:items-end'
                }`}
              >
                <div
                  className="flex items-center gap-1 rounded-full border border-[var(--line)] bg-[var(--surface)] px-1 py-1"
                  title={
                    voteDisabled
                      ? 'Sign in to vote'
                      : 'Click again to remove your vote'
                  }
                >
                  <button
                    type="button"
                    className={`inline-flex min-h-9 min-w-9 items-center justify-center rounded-full px-2 font-mono text-sm font-bold leading-none transition disabled:opacity-50 ${
                      joke.myVote === 1
                        ? 'bg-[rgba(0,184,217,0.26)] text-[var(--lagoon-deep)]'
                        : 'text-[var(--sea-ink-soft)] hover:bg-[var(--link-bg-hover)] hover:text-[var(--sea-ink)]'
                    }`}
                    aria-label={joke.myVote === 1 ? 'Remove upvote' : 'Upvote'}
                    disabled={voteDisabled || pendingId === joke.id}
                    onClick={() => void onVote(joke.id, 'up')}
                  >
                    ++
                  </button>
                  <span className="min-w-[2ch] px-1 text-center text-sm font-semibold tabular-nums text-[var(--sea-ink)]">
                    {joke.score}
                  </span>
                  <button
                    type="button"
                    className={`inline-flex min-h-9 min-w-9 items-center justify-center rounded-full px-2 font-mono text-sm font-bold leading-none transition disabled:opacity-50 ${
                      joke.myVote === -1
                        ? 'bg-[rgba(200,90,90,0.18)] text-red-700 dark:text-red-300'
                        : 'text-[var(--sea-ink-soft)] hover:bg-[var(--link-bg-hover)] hover:text-[var(--sea-ink)]'
                    }`}
                    aria-label={
                      joke.myVote === -1 ? 'Remove downvote' : 'Downvote'
                    }
                    disabled={voteDisabled || pendingId === joke.id}
                    onClick={() => void onVote(joke.id, 'down')}
                  >
                    --
                  </button>
                </div>
                {currentUserId === joke.userId ? (
                  <button
                    type="button"
                    className="inline-flex items-center gap-1.5 rounded-full border border-red-200/80 px-3 py-1.5 text-xs font-semibold text-red-700 transition hover:bg-red-50 dark:border-red-900/60 dark:text-red-300 dark:hover:bg-red-950/50 disabled:opacity-50"
                    disabled={pendingId === joke.id}
                    onClick={() => void onDelete(joke.id)}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    Delete
                  </button>
                ) : null}
              </div>
            </article>
          </li>
        ))}
      </ul>
    </div>
  )
}
