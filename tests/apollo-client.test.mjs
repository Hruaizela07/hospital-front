import assert from 'node:assert/strict'
import { after, afterEach, before, test } from 'node:test'
import { createServer } from 'vite'

let server
let clientModule
let gql
let LOGINMUTATION
before(async () => {
  server = await createServer({ configFile: false, ssr: { noExternal: ['@apollo/client'] }, server: { middlewareMode: true, hmr: false, ws: false } })
  clientModule = await server.ssrLoadModule('/app/lib/graphql-client.ts')
  ;({ gql } = await server.ssrLoadModule('@apollo/client'))
  ;({ LOGINMUTATION } = await server.ssrLoadModule('/app/graphql/mutation/login-mutation.ts'))
})
const originalFetch = globalThis.fetch
const clients = []
after(() => server?.close())
afterEach(() => {
  globalThis.fetch = originalFetch
  delete globalThis.document
  delete globalThis.window
  clients.splice(0).forEach(client => client.stop())
})

function client() {
  assert.equal(typeof clientModule.createApolloClient, 'function', 'exports an Apollo client factory')
  const instance = clientModule.createApolloClient({ token: 'test-token' })
  clients.push(instance)
  return instance
}

const variables = { username: 'tester', password: 'secret' }
function success() {
  return Response.json({ data: { login: { id: '1', userName: 'tester', role: 'ADMIN', lastLoginAt: null, createdAt: '2026-01-01', updatedAt: '2026-01-01' } } })
}

test('sends credentials and refreshes the CSRF cookie once on HTTP 419', async () => {
  globalThis.document = { cookie: 'XSRF-TOKEN=old%3D' }
  const calls = []
  globalThis.fetch = async (url, options) => {
    calls.push({ url, options })
    if (String(url).endsWith('/sanctum/csrf-cookie')) {
      globalThis.document.cookie = 'XSRF-TOKEN=new%3D'
      return new Response(null, { status: 204 })
    }
    return calls.length === 1 ? new Response('', { status: 419 }) : success()
  }
  const result = await client().mutate({ mutation: LOGINMUTATION, variables })
  assert.equal(result.data.login.id, '1')
  assert.equal(calls.length, 3)
  assert.equal(calls[0].options.credentials, 'include')
  assert.equal(new Headers(calls[0].options.headers).get('Authorization'), 'Bearer test-token')
  assert.equal(new Headers(calls[0].options.headers).get('X-XSRF-TOKEN'), 'old=')
  assert.equal(new Headers(calls[2].options.headers).get('X-XSRF-TOKEN'), 'new=')
})

test('does not loop when the retried request also returns HTTP 419', async () => {
  globalThis.document = { cookie: 'XSRF-TOKEN=token' }
  let attempts = 0
  globalThis.fetch = async (url) => {
    attempts++
    if (String(url).endsWith('/sanctum/csrf-cookie'))
      return new Response(null, { status: 204 })
    return new Response('', { status: 419 })
  }
  await assert.rejects(client().mutate({ mutation: LOGINMUTATION, variables }))
  assert.equal(attempts, 3)
})

test('uploads nested files without mutating caller variables', async () => {
  const file = new File(['report'], 'report.txt')
  const input = { items: [{ file }] }
  let body
  globalThis.fetch = async (_, options) => {
    body = options.body
    assert.equal(new Headers(options.headers).has('content-type'), false)
    return Response.json({ data: { upload: true } })
  }
  await client().mutate({ mutation: gql`mutation Upload($input: UploadInput!) { upload(input: $input) }`, variables: { input } })
  assert.ok(body instanceof FormData)
  assert.deepEqual(JSON.parse(body.get('map')), { 0: ['variables.input.items.0.file'] })
  assert.deepEqual(JSON.parse(body.get('operations')).variables, { input: { items: [{ file: null }] } })
  assert.equal(await body.get('0').text(), 'report')
  assert.equal(input.items[0].file, file)
})

for (const [name, response, destination] of [
  ['maintenance', () => new Response('', { status: 503 }), '/maintenance-mode'],
  ['unauthenticated', () => Response.json({ errors: [{ message: 'Unauthenticated.' }] }), '/login'],
]) {
  test(`redirects on ${name} errors`, async () => {
    globalThis.window = { location: { href: '/' } }
    globalThis.fetch = async () => response()
    await assert.rejects(client().mutate({ mutation: LOGINMUTATION, variables }))
    assert.equal(globalThis.window.location.href, destination)
  })
}
