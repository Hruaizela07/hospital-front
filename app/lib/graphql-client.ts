import type { Operation } from '@apollo/client'
import { ApolloClient, ApolloLink, HttpLink, InMemoryCache } from '@apollo/client'
import { onError } from '@apollo/client/link/error'
import { print } from 'graphql'
import { baseUrl } from './base-url'
import extractXsrfFromCookie from './extract-xsrf-from-cookie'

function csrfToken() {
  if (typeof document === 'undefined')
    return ''
  const token = extractXsrfFromCookie(document.cookie)
  return token ? decodeURIComponent(token) : ''
}

function multipartBody(operation: Operation) {
  const files: File[] = []
  const map: Record<string, string[]> = {}

  function extract(value: unknown, path: string): unknown {
    if (typeof File !== 'undefined' && value instanceof File) {
      map[String(files.length)] = [path]
      files.push(value)
      return null
    }
    if (Array.isArray(value))
      return value.map((item, index) => extract(item, `${path}.${index}`))
    if (value && typeof value === 'object' && !(value instanceof Date)) {
      return Object.fromEntries(
        Object.entries(value).map(([key, item]) => [key, extract(item, `${path}.${key}`)]),
      )
    }
    return value
  }

  const variables = extract(operation.variables, 'variables')
  if (!files.length)
    return undefined

  const body = new FormData()
  body.append('operations', JSON.stringify({
    query: print(operation.query),
    operationName: operation.operationName,
    variables,
  }))
  body.append('map', JSON.stringify(map))
  files.forEach((file, index) => body.append(String(index), file))
  return body
}

export interface ApolloClientOptions {
  token?: string
}

export function createApolloClient({ token }: ApolloClientOptions = {}) {
  const errorLink = onError(({ graphQLErrors, networkError }) => {
    if (typeof window === 'undefined')
      return
    if (networkError && 'statusCode' in networkError && networkError.statusCode === 503)
      window.location.href = '/maintenance-mode'
    if (graphQLErrors?.some(error => error.message === 'Unauthenticated.'))
      window.location.href = '/login'
  })

  // Each operation's fetch captures its original variables before HTTP serialization.
  const httpLink = new ApolloLink((operation, forward) => {
    const upload = multipartBody(operation)
    return new HttpLink({
      uri: `${baseUrl}/arsi`,
      credentials: 'include',
      fetch: async (uri, options) => {
        const headers = new Headers(options?.headers)
        if (token)
          headers.set('Authorization', `Bearer ${token}`)
        const xsrfToken = csrfToken()
        if (xsrfToken)
          headers.set('X-XSRF-TOKEN', xsrfToken)
        if (upload)
          headers.delete('content-type')

        const send = () => fetch(uri, {
          ...options,
          headers: new Headers(headers),
          body: upload ?? options?.body,
        })
        const response = await send()
        if (response.status !== 419)
          return response

        try {
          const refresh = await fetch(`${baseUrl}/sanctum/csrf-cookie`, {
            method: 'GET',
            credentials: 'include',
            signal: options?.signal,
          })
          const freshToken = csrfToken()
          if (refresh.ok && freshToken) {
            headers.set('X-XSRF-TOKEN', freshToken)
            return send()
          }
        }
        catch {
          // Let Apollo report the original HTTP error if CSRF refresh fails.
        }
        return response
      },
    }).request(operation, forward)
  })

  return new ApolloClient({
    link: ApolloLink.from([errorLink, httpLink]),
    cache: new InMemoryCache(),
    ssrMode: typeof window === 'undefined',
  })
}
