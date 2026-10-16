import assert from 'node:assert/strict'
import { after, before, test } from 'node:test'
import { createServer } from 'vite'

let doctorsList
let server

before(async () => {
  server = await createServer({ configFile: false, server: { middlewareMode: true, hmr: false, ws: false } })
  doctorsList = await server.ssrLoadModule('/app/routes/_admin.doctors/doctor-filters.ts')
})

after(() => server?.close())

test('filters doctors case-insensitively across their searchable details', () => {
  const doctors = [
    {
      id: 'cardiology',
      department: { name: 'Cardiology' },
      email: 'sana@example.com',
      leave_status: 'NOT_ON_LEAVE',
      specialization: 'Heart Failure',
      status: 'ACTIVE',
      userName: 'Dr. Sana',
    },
    {
      id: 'neurology',
      department: { name: 'Neurology' },
      email: 'noor@example.com',
      leave_status: 'ON_LEAVE',
      specialization: 'Stroke Care',
      status: 'INACTIVE',
      userName: 'Dr. Noor',
    },
  ]

  const result = doctorsList.filterDoctors(doctors, 'stroke')

  assert.deepEqual(result.map(doctor => doctor.id), ['neurology'])
})
