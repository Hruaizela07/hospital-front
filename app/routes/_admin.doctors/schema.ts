import z from 'zod'

export const doctorSchema = z.object({
  image: z.instanceof(File).refine(file => file.type.startsWith('image/'), 'Select an image file').optional(),
  userName: z.string().trim().min(3, 'Name must be at least 3 characters'),
  password: z.string().min(3, 'Password must be at least 3 characters'),
  email: z.string().trim().email('Enter a valid email address'),
  specialization: z.string().trim().min(1, 'Specialization is required'),
  department_Id: z.string().min(1, 'Select a department'),
})

export type DoctorFormValues = z.infer<typeof doctorSchema>
export type DoctorFormInput = z.input<typeof doctorSchema>

export const updateDoctorSchema = doctorSchema.omit({ password: true }).extend({
  id: z.string().min(1, 'Doctor is required'),
})

export type UpdateDoctorFormValues = z.infer<typeof updateDoctorSchema>
export type UpdateDoctorFormInput = z.input<typeof updateDoctorSchema>
