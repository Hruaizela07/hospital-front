interface SubmitAppointmentRequestOptions<TPatientInput, TAppointmentInput> {
  appointmentInput: TAppointmentInput
  createAppointment: (input: TAppointmentInput & { patient_id: string }) => Promise<unknown>
  createPatient: (input: TPatientInput) => Promise<{ id: string }>
  onPatientCreated?: (patientId: string) => void
  patientId?: string
  patientInput: TPatientInput
}

export async function submitAppointmentRequest<TPatientInput, TAppointmentInput>({
  appointmentInput,
  createAppointment,
  createPatient,
  onPatientCreated,
  patientId: existingPatientId,
  patientInput,
}: SubmitAppointmentRequestOptions<TPatientInput, TAppointmentInput>) {
  const patientId = existingPatientId ?? (await createPatient(patientInput)).id

  if (!existingPatientId)
    onPatientCreated?.(patientId)

  await createAppointment({ ...appointmentInput, patient_id: patientId })

  return patientId
}
