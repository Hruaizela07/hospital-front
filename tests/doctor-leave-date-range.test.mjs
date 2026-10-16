import assert from 'node:assert/strict'
import { test } from 'node:test'
import { leaveRangeToFormValues } from '../app/routes/_admin.doctor-leaves/leave-date-range.ts'

test('maps one calendar range to the leave start and end fields', () => {
  assert.deepEqual(leaveRangeToFormValues({
    from: new Date(2026, 9, 12),
    to: new Date(2026, 9, 15),
  }), {
    end_date: '2026-10-15',
    start_date: '2026-10-12',
  })
})
