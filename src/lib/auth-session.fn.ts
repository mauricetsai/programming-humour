import { createServerFn } from '@tanstack/react-start'
import { getRequestHeaders } from '@tanstack/react-start/server'

import { auth } from '#/lib/auth'

// Server fn so loaders can grab user id without dragging in all of auth.ts.
export const getAuthUserId = createServerFn({ method: 'GET' }).handler(
  async () => {
    const session = await auth.api.getSession({
      headers: getRequestHeaders(),
    })
    return session?.user?.id ?? null
  },
)
