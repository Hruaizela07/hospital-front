import type { DoctorLeaveStatus } from '~/gql/graphql'
import z from 'zod'

export const DOCTOR_STATUS_OPTIONS = [
  { value: 'ACTIVE', label: 'Active' },
  { value: 'INACTIVE', label: 'Inactive' },
] as const

export const DOCTOR_LEAVE_STATUS_OPTIONS = [
  { value: 'NOT_ON_LEAVE' as DoctorLeaveStatus, label: 'Not on leave' },
  { value: 'ON_LEAVE' as DoctorLeaveStatus, label: 'On leave' },
] as const

const doctorStatusValues = DOCTOR_STATUS_OPTIONS.map(option => option.value) as [string, ...string[]]
const doctorLeaveStatusValues = DOCTOR_LEAVE_STATUS_OPTIONS.map(option => option.value) as [DoctorLeaveStatus, ...DoctorLeaveStatus[]]

export const doctorSchema = z.object({
  image: z.instanceof(File).refine(file => file.type.startsWith('image/'), 'Select an image file').optional(),
  userName: z.string().trim().min(3, 'Name must be at least 3 characters'),
  doctorID: z.string().optional(),
  password: z.string().min(3, 'Password must be at least 3 characters'),
  email: z.string().trim().email('Enter a valid email address'),
  specialization: z.string().trim().min(1, 'Specialization is required'),
  department_Id: z.string().min(1, 'Select a department'),
  status: z.enum(doctorStatusValues, 'Select a status'),
  leave_status: z.enum(doctorLeaveStatusValues, 'Select a leave status'),
})

export type DoctorFormValues = z.infer<typeof doctorSchema>
export type DoctorFormInput = z.input<typeof doctorSchema>

export const updateDoctorSchema = doctorSchema.omit({ password: true }).extend({
  id: z.string().min(1, 'Doctor is required'),
})

export type UpdateDoctorFormValues = z.infer<typeof updateDoctorSchema>
export type UpdateDoctorFormInput = z.input<typeof updateDoctorSchema>
