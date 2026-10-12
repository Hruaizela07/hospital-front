import assert from 'node:assert/strict'
import { after, before, test } from 'node:test'
import { createServer } from 'vite'

let server
let schemaModule

before(async () => {
  server = await createServer({ configFile: false, server: { middlewareMode: true, hmr: false, ws: false } })
  schemaModule = await server.ssrLoadModule('/app/routes/_admin.doctors/schema.ts')
})

after(() => server?.close())

test('validates doctor status and leave status on create and update forms', () => {
  assert.deepEqual(schemaModule.doctorSchema.parse({
    department_Id: '3',
    email: 'doctor@example.com',
    leave_status: 'NOT_ON_LEAVE',
    password: 'secret',
    specialization: 'Cardiology',
    status: 'ACTIVE',
    userName: 'Dr Smith',
  }), {
    department_Id: '3',
    email: 'doctor@example.com',
    leave_status: 'NOT_ON_LEAVE',
    password: 'secret',
    specialization: 'Cardiology',
    status: 'ACTIVE',
    userName: 'Dr Smith',
  })

  assert.deepEqual(schemaModule.updateDoctorSchema.parse({
    department_Id: '4',
    email: 'doctor@example.com',
    id: 'doctor-1',
    leave_status: 'ON_LEAVE',
    specialization: 'Neurology',
    status: 'INACTIVE',
    userName: 'Dr Jones',
  }).leave_status, 'ON_LEAVE')
})

test('rejects invalid doctor status values', () => {
  assert.throws(() => schemaModule.doctorSchema.parse({
    department_Id: '3',
    email: 'doctor@example.com',
    leave_status: 'AWAY',
    password: 'secret',
    specialization: 'Cardiology',
    status: 'UNKNOWN',
    userName: 'Dr Smith',
  }))
})
