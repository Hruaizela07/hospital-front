import assert from 'node:assert/strict'
import { test } from 'node:test'
import { submitAppointmentRequest } from '../app/routes/_landing.appointment/appointment-request.ts'

test('creates a patient before submitting an appointment and reuses that patient on retry', async () => {
  assert.equal(typeof submitAppointmentRequest, 'function')

  const patientInput = { name: 'Amina Rahman' }
  const appointmentInput = { doctor_id: 'doctor-1', reason_for_visit: 'Consultation' }
  const calls = []
  const createPatient = async (input) => {
    calls.push(['patient', input])
    return { id: 'patient-1' }
  }
  const createAppointment = async (input) => {
    calls.push(['appointment', input])
  }

  const patientId = await submitAppointmentRequest({
    appointmentInput,
    createAppointment,
    createPatient,
    patientInput,
  })
  await submitAppointmentRequest({
    appointmentInput,
    createAppointment,
    createPatient,
    patientId,
    patientInput,
  })

  assert.deepEqual(calls, [
    ['patient', patientInput],
    ['appointment', { ...appointmentInput, patient_id: 'patient-1' }],
    ['appointment', { ...appointmentInput, patient_id: 'patient-1' }],
  ])
  assert.equal(patientId, 'patient-1')
})

test('retains a newly created patient ID when appointment submission fails', async () => {
  let createdPatientId

  await assert.rejects(() => submitAppointmentRequest({
    appointmentInput: { doctor_id: 'doctor-1' },
    createAppointment: async () => {
      throw new Error('Appointment unavailable')
    },
    createPatient: async () => ({ id: 'patient-2' }),
    onPatientCreated: (patientId) => {
      createdPatientId = patientId
    },
    patientInput: { name: 'Noor Ali' },
  }))

  assert.equal(createdPatientId, 'patient-2')
})
