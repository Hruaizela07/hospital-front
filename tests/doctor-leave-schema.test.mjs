import assert from 'node:assert/strict'
import { after, before, test } from 'node:test'
import { createServer } from 'vite'

let server
let schemaModule

before(async () => {
  server = await createServer({ configFile: false, server: { middlewareMode: true, hmr: false, ws: false } })
  schemaModule = await server.ssrLoadModule('/app/routes/_admin.doctor-leaves/schema.ts')
})

after(() => server?.close())

test('validates doctor leave create and update date payloads', () => {
  assert.deepEqual(schemaModule.doctorLeaveSchema.parse({
    doctor_id: '7',
    start_date: '2026-10-12',
    end_date: '2026-10-14',
  }), {
    doctor_id: '7',
    start_date: '2026-10-12',
    end_date: '2026-10-14',
  })

  assert.deepEqual(schemaModule.updateDoctorLeaveSchema.parse({
    id: 'leave-1',
    start_date: '2026-10-15',
  }), {
    id: 'leave-1',
    start_date: '2026-10-15',
  })
})

test('rejects missing doctors and invalid leave dates', () => {
  assert.throws(() => schemaModule.doctorLeaveSchema.parse({
    doctor_id: '',
    start_date: '12-10-2026',
    end_date: '',
  }))
})
