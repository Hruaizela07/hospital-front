import type { CodegenConfig } from '@graphql-codegen/cli'
import { existsSync } from 'node:fs'
import process from 'node:process'
import { loadEnv } from 'vite'

const env = loadEnv(process.env.NODE_ENV || 'development', process.cwd(), '')
const remoteSchema = env.CODEGEN_SCHEMA_URL || env.VITE_BASE_GRAPHQL_URL
const localSchema = env.CODEGEN_SCHEMA_FILE || './schema.graphql'
const hasLocalSchema = existsSync(localSchema)
const requestedLocalSchema = env.CODEGEN_USE_LOCAL_SCHEMA === 'true'

type FetchInput = string | URL | Request

function getSetCookies(headers: Headers) {
  const headersWithSetCookie = headers as Headers & {
    getSetCookie?: () => string[]
  }

  if (headersWithSetCookie.getSetCookie) {
    return headersWithSetCookie.getSetCookie()
  }

  const setCookie = headers.get('set-cookie')
  return setCookie ? [setCookie] : []
}

function readCookie(cookies: string[], name: string) {
  const prefix = `${name}=`

  return cookies
    .map(cookie => cookie.split(';')[0])
    .find(cookie => cookie.startsWith(prefix))
    ?.slice(prefix.length)
}

function createCsrfFetch(schemaUrl: string) {
  let cookieHeader = ''
  let xsrfToken = ''

  async function refreshCsrfToken() {
    const csrfUrl = new URL('/sanctum/csrf-cookie', schemaUrl)
    const response = await fetch(csrfUrl, {
      method: 'GET',
    })

    const cookies = getSetCookies(response.headers)
    cookieHeader = cookies
      .map(cookie => cookie.split(';')[0])
      .filter(Boolean)
      .join('; ')
    xsrfToken = readCookie(cookies, 'XSRF-TOKEN') || ''
  }

  return async function csrfFetch(input: FetchInput, init?: RequestInit) {
    if (!cookieHeader || !xsrfToken) {
      await refreshCsrfToken()
    }

    const headers = new Headers(init?.headers)
    headers.set('Cookie', cookieHeader)
    headers.set('X-XSRF-TOKEN', decodeURIComponent(xsrfToken))

    const response = await fetch(input, {
      ...init,
      headers,
    })

    if (response.status !== 419) {
      return response
    }

    await refreshCsrfToken()
    headers.set('Cookie', cookieHeader)
    headers.set('X-XSRF-TOKEN', decodeURIComponent(xsrfToken))

    return fetch(input, {
      ...init,
      headers,
    })
  }
}

if (requestedLocalSchema && !hasLocalSchema) {
  throw new Error(
    `CODEGEN_USE_LOCAL_SCHEMA=true but schema file was not found at ${localSchema}.`,
  )
}

const shouldUseLocalSchema = requestedLocalSchema || (!remoteSchema && hasLocalSchema)

const schema = shouldUseLocalSchema
  ? localSchema
  : remoteSchema
    ? { [remoteSchema]: { customFetch: createCsrfFetch(remoteSchema) } }
    : undefined

if (!schema) {
  throw new Error (
    'No GraphQL schema source found. Set VITE_BASE_GRAPHQL_URL/CODEGEN_SCHEMA_URL or provide schema.graphql and set CODEGEN_USE_LOCAL_SCHEMA=true.',
  )
}

const config: CodegenConfig = {
  schema,
  documents: ['app/**/*.{ts,tsx}'],
  ignoreNoDocuments: true,
  config: {
    useTypeImports: true,
    scalars: {
      DateTime: 'string',
    },
  },
  generates: {
    'app/gql/': {
      preset: 'client',
    },
    ...(!shouldUseLocalSchema
      ? {
          './schema.graphql': {
            plugins: ['schema-ast'],
            config: {
              includeDirectives: true,
            },
          },
        }
      : {}),
  },
}

export default config
