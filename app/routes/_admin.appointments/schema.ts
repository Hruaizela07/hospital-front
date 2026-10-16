import z from 'zod'
import { AppointmentStatus } from '~/gql/graphql'

export const APPOINTMENT_STATUS_OPTIONS = [
  { value: AppointmentStatus.Scheduled, label: 'Scheduled' },
  { value: AppointmentStatus.Completed, label: 'Completed' },
  { value: AppointmentStatus.Cancelled, label: 'Cancelled' },
] as const

const appointmentStatusValues = APPOINTMENT_STATUS_OPTIONS.map(option => option.value) as [AppointmentStatus, ...AppointmentStatus[]]

const DATE_REGEX = /^\d{4}-\d{2}-\d{2}$/
const TIME_REGEX = /^\d{2}:\d{2}(?::\d{2})?$/

const appointmentDateSchema = z.string().regex(DATE_REGEX, 'Appointment date is required')
const appointmentTimeSchema = z
  .string()
  .regex(TIME_REGEX, 'Time is required')
  .transform(time => time.length === 5 ? `${time}:00` : time)

export const aptmSchema = z.object({
  patient_id: z.string().min(1, 'Patient is required'),
  doctor_id: z.string().min(1, 'Doctor is required'),
  appointment_date: appointmentDateSchema,
  start_time: appointmentTimeSchema,
  end_time: appointmentTimeSchema,
  status: z.enum(appointmentStatusValues),
  reason_for_visit: z.string(),
  notes: z.string().trim().optional(),
})

export type AptmFormValue = z.infer<typeof aptmSchema>
export type AptmFormInput = z.input<typeof aptmSchema>

export const aptmUpSchema = z.object({
  id: z.string().min(1, 'Appointment is required'),
  patient_id: z.string().min(1, 'Patient is required'),
  doctor_id: z.string().min(1, 'Doctor is required'),
  appointment_date: appointmentDateSchema,
  start_time: appointmentTimeSchema,
  end_time: appointmentTimeSchema,
  status: z.enum(appointmentStatusValues),
  reason_for_visit: z.string().optional(),
  notes: z.string().trim().optional(),
})

export type AptmUpFormValue = z.infer<typeof aptmUpSchema>
export type AptmUpFormInput = z.input<typeof aptmUpSchema>
