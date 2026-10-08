import assert from 'node:assert/strict'
import { after, before, test } from 'node:test'
import { createServer } from 'vite'

let server
let dutyWeekGroupsModule

before(async () => {
  server = await createServer({ configFile: false, server: { middlewareMode: true, hmr: false, ws: false } })
  dutyWeekGroupsModule = await server.ssrLoadModule('/app/routes/_admin.doctorDuty/duty-week-groups.ts')
})

after(() => server?.close())

test('groups duty rows by week in date order', () => {
  const groups = dutyWeekGroupsModule.groupDutiesByWeek([
    { id: '3', duty_date: '2026-10-12' },
    { id: '1', duty_date: '2026-10-01' },
    { id: '2', duty_date: '2026-10-04' },
  ])

  assert.deepEqual(groups.map(group => ({
    label: group.label,
    ids: group.duties.map(duty => duty.id),
  })), [
    { label: 'Sep 28 - Oct 04, 2026', ids: ['1', '2'] },
    { label: 'Oct 12 - Oct 18, 2026', ids: ['3'] },
  ])
})
