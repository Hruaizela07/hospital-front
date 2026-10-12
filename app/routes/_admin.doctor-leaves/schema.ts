import z from 'zod'

const DATE_REGEX = /^\d{4}-\d{2}-\d{2}$/

const leaveDateSchema = z.string().regex(DATE_REGEX, 'Date is required')

export const doctorLeaveSchema = z.object({
  doctor_id: z.string().min(1, 'Doctor is required'),
  start_date: leaveDateSchema,
  end_date: leaveDateSchema,
})

export type doctorLeaveForm = z.infer<typeof doctorLeaveSchema>
export type doctorLeaveInput = z.input<typeof doctorLeaveSchema>

export const updateDoctorLeaveSchema = z.object({
  id: z.string().min(1, 'Doctor leave is required'),
  start_date: leaveDateSchema.optional(),
  end_date: leaveDateSchema.optional(),
})

export type updateDoctorLeaveForm = z.infer<typeof updateDoctorLeaveSchema>
export type updateDoctorLeaveInput = z.input<typeof updateDoctorLeaveSchema>
