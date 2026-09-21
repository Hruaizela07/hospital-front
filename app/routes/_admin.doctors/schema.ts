import z from 'zod'

export const doctorSchema = z.object({
  image: z.instanceof(File),
  userName: z.string().min(3, 'must be atleast 3 words'),
  password: z.string().min(3, 'must be atleast 3'),
  email: z.string(),
  specialization: z.string(),
  department_Id: z.string(),
})

export type DoctorFormValues = z.infer<typeof doctorSchema>
export type DoctorFormInput = z.input<typeof doctorSchema>

export const updateDoctorSchema = z.object({
  id: z.string(),
  image: z.instanceof(File).optional(),
  userName: z.string().min(3, 'must be atleast 3 words'),
  password: z.string().min(3, 'must be atleast 3'),
  email: z.string(),
  specialization: z.string(),
  department_Id: z.string(),
})

export type UpdateDoctorFormValues = z.infer<typeof updateDoctorSchema>
export type UpdateDoctorFormInput = z.input<typeof updateDoctorSchema>
