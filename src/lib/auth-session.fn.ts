import { createServerFn } from '@tanstack/react-start'
import { getRequestHeaders } from '@tanstack/react-start/server'

import { auth } from '#/lib/auth'

/** Used from route loaders without importing server-only APIs in route files. */
export const getAuthUserId = createServerFn({ method: 'GET' }).handler(
  async () => {
    const session = await auth.api.getSession({
      headers: getRequestHeaders(),
    })
    return session?.user?.id ?? null
  },
)
