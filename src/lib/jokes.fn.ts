import { createServerFn } from '@tanstack/react-start'
import { getRequestHeaders } from '@tanstack/react-start/server'
import { and, eq, inArray, sql } from 'drizzle-orm'

import { db } from '#/db/index'
import { jokeVotes, jokes, user } from '#/db/schema'
import { auth } from '#/lib/auth'

export type JokeRow = {
  id: number
  setup: string
  punchline: string
  userId: string
  authorName: string
  createdAt: Date
  score: number
  myVote: 1 | -1 | null // my vote (null = guest or didn't vote)
}

export const listJokes = createServerFn({ method: 'GET' }).handler(
  async (): Promise<JokeRow[]> => {
    const session = await auth.api.getSession({
      headers: getRequestHeaders(),
    })
    const viewerId = session?.user?.id ?? null

    const scoreExpr = sql<number>`coalesce(sum(${jokeVotes.value}), 0)`.mapWith(
      Number,
    )
    const rows = await db
      .select({
        id: jokes.id,
        setup: jokes.setup,
        punchline: jokes.punchline,
        userId: jokes.userId,
        authorName: user.name,
        createdAt: jokes.createdAt,
        score: scoreExpr,
      })
      .from(jokes)
      .innerJoin(user, eq(jokes.userId, user.id))
      .leftJoin(jokeVotes, eq(jokeVotes.jokeId, jokes.id))
      .groupBy(jokes.id, user.id, user.name)

    const sorted = [...rows].sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score
      // same score -> sort by id so the list doesn't jump around
      return a.id - b.id
    })

    const jokeIds = sorted.map((r) => r.id)
    const myByJoke: Record<number, 1 | -1> = {}
    if (viewerId && jokeIds.length > 0) {
      const mine = await db
        .select({
          jokeId: jokeVotes.jokeId,
          value: jokeVotes.value,
        })
        .from(jokeVotes)
        .where(
          and(
            eq(jokeVotes.userId, viewerId),
            inArray(jokeVotes.jokeId, jokeIds),
          ),
        )
      for (const v of mine) {
        if (v.value === 1 || v.value === -1) myByJoke[v.jokeId] = v.value
      }
    }

    return sorted.map((r) => ({
      ...r,
      myVote: myByJoke[r.id] ?? null,
    }))
  },
)

export const createJoke = createServerFn({ method: 'POST' })
  .inputValidator((data: { setup: string; punchline: string }) => data)
  .handler(async ({ data }) => {
    const session = await auth.api.getSession({
      headers: getRequestHeaders(),
    })
    if (!session?.user) {
      throw new Error('Unauthorized')
    }
    const setup = data.setup.trim()
    const punchline = data.punchline.trim()
    if (!setup || !punchline) {
      throw new Error('Setup and punchline are required')
    }
    await db.insert(jokes).values({
      userId: session.user.id,
      setup,
      punchline,
    })
    return { success: true as const }
  })

export const deleteJoke = createServerFn({ method: 'POST' })
  .inputValidator((data: { jokeId: number }) => data)
  .handler(async ({ data }) => {
    const session = await auth.api.getSession({
      headers: getRequestHeaders(),
    })
    if (!session?.user) {
      throw new Error('Unauthorized')
    }
    const [row] = await db
      .select()
      .from(jokes)
      .where(eq(jokes.id, data.jokeId))
      .limit(1)
    if (!row) {
      throw new Error('Not found')
    }
    if (row.userId !== session.user.id) {
      throw new Error('Forbidden')
    }
    await db.delete(jokes).where(eq(jokes.id, data.jokeId))
    return { success: true as const }
  })

export const voteJoke = createServerFn({ method: 'POST' })
  .inputValidator((data: { jokeId: number; direction: 'up' | 'down' }) => data)
  .handler(async ({ data }) => {
    const session = await auth.api.getSession({
      headers: getRequestHeaders(),
    })
    if (!session?.user) {
      throw new Error('Unauthorized')
    }
    const uid = session.user.id
    const value = data.direction === 'up' ? 1 : -1

    const [existing] = await db
      .select()
      .from(jokeVotes)
      .where(
        and(eq(jokeVotes.jokeId, data.jokeId), eq(jokeVotes.userId, uid)),
      )
      .limit(1)

    if (!existing) {
      await db.insert(jokeVotes).values({
        jokeId: data.jokeId,
        userId: uid,
        value,
      })
    } else if (existing.value === value) {
      // same vote again = undo
      await db.delete(jokeVotes).where(eq(jokeVotes.id, existing.id))
    } else {
      // opposite button = flip the vote
      await db
        .update(jokeVotes)
        .set({ value })
        .where(eq(jokeVotes.id, existing.id))
    }
    return { success: true as const }
  })
