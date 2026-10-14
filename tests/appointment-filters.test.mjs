import assert from 'node:assert/strict'
import { after, before, test } from 'node:test'
import { createServer } from 'vite'

let server
let filters

before(async () => {
  server = await createServer({ configFile: false, server: { middlewareMode: true, hmr: false, ws: false } })
  filters = await server.ssrLoadModule('/app/routes/_admin.appointments/appointment-filters.ts')
})

after(() => server?.close())

test('filters appointments inside the selected start and end days inclusively', () => {
  const appointments = [
    { id: 'before', appointment_date: '2026-10-09T15:30:00' },
    { id: 'start', appointment_date: '2026-10-10T00:00:00' },
    { id: 'middle', appointment_date: '2026-10-12T09:15:00' },
    { id: 'end', appointment_date: '2026-10-14T23:59:00' },
    { id: 'after', appointment_date: '2026-10-15T08:00:00' },
  ]

  const result = filters.filterAppointments(appointments, {
    endDay: '2026-10-14',
    search: '',
    startDay: '2026-10-10',
  })

  assert.deepEqual(result.map(appointment => appointment.id), ['start', 'middle', 'end'])
})

test('keeps search and one-sided date filters working together', () => {
  const appointments = [
    {
      id: 'old-match',
      appointment_date: '2026-10-09',
      doctor: { userName: 'Dr. Sana' },
      patient: { name: 'Rafi' },
    },
    {
      id: 'visible',
      appointment_date: '2026-10-11',
      doctor: { userName: 'Dr. Noor' },
      patient: { name: 'Amina' },
    },
    {
      id: 'wrong-search',
      appointment_date: '2026-10-12',
      doctor: { userName: 'Dr. Sana' },
      patient: { name: 'Karim' },
    },
  ]

  const result = filters.filterAppointments(appointments, {
    endDay: '',
    search: 'amina',
    startDay: '2026-10-10',
  })

  assert.deepEqual(result.map(appointment => appointment.id), ['visible'])
})
