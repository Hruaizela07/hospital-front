import z from 'zod'

const DATE_REGEX = /^\d{4}-\d{2}-\d{2}$/
const TIME_REGEX = /^\d{2}:\d{2}(?::\d{2})?$/

const dutyTimeSchema = z
  .string()
  .regex(TIME_REGEX, 'Time is required')
  .transform(time => time.length === 5 ? `${time}:00` : time)

export const dutySchema = z.object({
  doctor_id: z.string().min(1, 'Doctor is required'),
  duty_date: z.string().regex(DATE_REGEX, 'Date is required'),
  start_time: dutyTimeSchema,
  end_time: dutyTimeSchema,
})

export type doctorDutyAddForm = z.infer<typeof dutySchema>
export type doctorDutyAddInput = z.input<typeof dutySchema>

export const monthlyDutySchema = z.object({
  doctor_id: z.string().min(1, 'Doctor is required'),
  month: z.coerce.number().int().min(1, 'Month is required').max(12, 'Month is invalid'),
  year: z.coerce.number().int().min(2000, 'Year is required'),
  start_time: dutyTimeSchema,
  end_time: dutyTimeSchema,
})

export type monthlyDutyAddForm = z.infer<typeof monthlyDutySchema>
export type monthlyDutyAddInput = z.input<typeof monthlyDutySchema>

export function getMonthlyDutyDateFields(date: Date) {
  return {
    month: date.getMonth() + 1,
    year: date.getFullYear(),
  }
}

export const updateDutySchema = z.object({
  id: z.string().min(1, 'Duty shift is required'),
  doctor_id: z.string().min(1, 'Doctor is required').optional(),
  duty_date: z.string().regex(DATE_REGEX, 'Date is required').optional(),
  start_time: dutyTimeSchema.optional(),
  end_time: dutyTimeSchema.optional(),
})

export type updateDoctorDutyForm = z.infer<typeof updateDutySchema>
export type updateDoctorDutyInput = z.input<typeof updateDutySchema>
