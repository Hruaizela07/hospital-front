import z from 'zod'

export const departmentSchema = z.object({
  name: z.string().trim().min(1, 'Department name is required'),
  description: z.string().trim().optional(),
})

export type departmentAddForm = z.infer<typeof departmentSchema>
export type departmentAddInput = z.input<typeof departmentSchema>

export const updateDpSchema = z.object({
  name: z.string().optional(),
  description: z.string().optional(),
})

export type departmentUpdateForm = z.infer<typeof updateDpSchema>
export type departmentUpdateInput = z.input<typeof updateDpSchema>
