import type { ApolloClient } from '@apollo/client'
import type { SessionBoundaryLink } from './session-boundary-link'
import type { AuthUsers } from '~/lib/auth-user'
import { ME_QUERY } from '~/graphql/query/me'
import { storeUser } from '~/lib/auth-user'

const sessionBoundaries = new WeakMap<ApolloClient, SessionBoundaryLink>()

export function registerSessionBoundary(client: ApolloClient, boundary: SessionBoundaryLink) {
  sessionBoundaries.set(client, boundary)
  return client
}

export async function replaceSessionUser(client: ApolloClient, user: AuthUsers | null) {
  // clearStore cancels queries, but mutations also need a stale-response guard.
  sessionBoundaries.get(client)?.invalidate()
  // Do not refetch protected queries while transitioning between accounts.
  await client.clearStore()
  storeUser(user)
  client.writeQuery({
    query: ME_QUERY,
    data: { me: user },
  })
}
