import assert from 'node:assert/strict'
import { test } from 'node:test'
import { formatAppointmentTime, timePeriod } from '../app/routes/_admin.appointments/appointment-time-options.ts'

test('formats 24-hour appointment times with AM and PM labels', () => {
  assert.equal(formatAppointmentTime('00:00'), '12:00 AM')
  assert.equal(formatAppointmentTime('09:30'), '9:30 AM')
  assert.equal(formatAppointmentTime('12:00'), '12:00 PM')
  assert.equal(formatAppointmentTime('15:30'), '3:30 PM')
})

test('derives the AM or PM indicator from the selected time', () => {
  assert.equal(timePeriod('00:00'), 'AM')
  assert.equal(timePeriod('11:59'), 'AM')
  assert.equal(timePeriod('12:00'), 'PM')
  assert.equal(timePeriod('23:59'), 'PM')
})
