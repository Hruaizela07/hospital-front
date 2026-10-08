import assert from 'node:assert/strict'
import { after, before, test } from 'node:test'
import { createServer } from 'vite'

let server
let schemaModule

before(async () => {
  server = await createServer({ configFile: false, server: { middlewareMode: true, hmr: false, ws: false } })
  schemaModule = await server.ssrLoadModule('/app/routes/_admin.doctorDuty/schema.ts')
})

after(() => server?.close())

test('monthly duty form values are normalized for the monthly mutation input', () => {
  const result = schemaModule.monthlyDutySchema.parse({
    doctor_id: 'doctor-1',
    end_time: '17:30',
    month: '10',
    start_time: '09:00',
    year: '2026',
  })

  assert.deepEqual(result, {
    doctor_id: 'doctor-1',
    end_time: '17:30:00',
    month: 10,
    start_time: '09:00:00',
    year: 2026,
  })
})

test('monthly duty calendar date provides the monthly mutation date fields', () => {
  const result = schemaModule.getMonthlyDutyDateFields(new Date(2026, 9, 15))

  assert.deepEqual(result, {
    month: 10,
    year: 2026,
  })
})
