## GraphQL with Apollo Client

Define shared queries, mutations, and fragments here using `gql` from
`@apollo/client`. The root `ApolloProvider` supplies the client to route components.

For example, inside a login component:

```tsx
import { useMutation } from '@apollo/client'
import { LOGINMUTATION } from '~/graphql/mutation/login-mutation'

const [login, { loading, error }] = useMutation(LOGINMUTATION)

// Call from the form's submit handler:
await login({ variables: { username, password } })
```

Use `useQuery` for reads. Outside React, create a client with
`createApolloClient` from `~/lib/graphql-client`, then call `client.query` or
`client.mutate`. An optional `{ token }` adds bearer authentication.

The client sends requests to `${VITE_BASE_URL}/arsi` with cookies, reads the
current XSRF cookie for each operation, and retries once after refreshing CSRF
on HTTP 419. File variables are sent as multipart uploads. HTTP 503 redirects
to `/maintenance-mode`, and `Unauthenticated.` GraphQL errors redirect to `/login`.

The `graphql` dependency remains required by Apollo and GraphQL Code Generator.
