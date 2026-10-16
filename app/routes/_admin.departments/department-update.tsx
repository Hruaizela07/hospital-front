import type { departmentAddForm, departmentAddInput, departmentUpdateForm, departmentUpdateInput } from './dpSchema'
import type { CreateDepartmentMutation, CreateDepartmentMutationVariables, DepartmentQuery, DepartmentsQuery, UpdateDepartmentMutation, UpdateDepartmentMutationVariables } from '~/gql/graphql'
import { useMutation } from '@apollo/client'
import { zodResolver } from '@hookform/resolvers/zod'
import { useId, useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { Button } from '~/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '~/components/ui/dialog'
import { Field, FieldError, FieldGroup, FieldLabel } from '~/components/ui/field'
import { Input } from '~/components/ui/input'
import { Textarea } from '~/components/ui/textarea'
import { UPDATE_DEPARTMENT } from '~/graphql/mutation/update-department'
import getSubmitErrorMessage from '~/lib/get-submit-error-message'
import { updateDpSchema } from './dpSchema'

export type DepartmentUpdates = DepartmentQuery['department']

interface Props {
  dpt: DepartmentUpdates
  onUpdated?: () => void | Promise<void>
}

function toUpdateMutation(values: departmentUpdateForm): departmentUpdateInput {
  return {
    name: values.name,
    description: values.description,
  }
}

export default function DepartmentUpdate({ onUpdated, dpt }: Props) {
  const [open, setOpen] = useState(false)
  const fieldId = useId()
  const defaults: departmentUpdateInput = {
    name: dpt?.name,
    description: dpt?.description || undefined,
  }

  const form = useForm<departmentUpdateInput, unknown, departmentUpdateForm>({
    resolver: zodResolver(updateDpSchema),
    defaultValues: defaults,
  })

  const [updateDepartment, { loading }] = useMutation<UpdateDepartmentMutation, UpdateDepartmentMutationVariables>(UPDATE_DEPARTMENT)
  const { errors, isSubmitting } = form.formState
  const busy = loading || isSubmitting

  const onSubmit = async (values: departmentUpdateForm) => {
    try {
      const response = await updateDepartment({ variables: { id: dpt!.id, input: toUpdateMutation(values) } })
      if (!response.data?.updateDepartment) {
        toast.error('Department could not be updated. Please try again.')
        return
      }
    }
    catch (error) {
      toast.error(getSubmitErrorMessage(error))
      return
    }

    form.reset()
    setOpen(false)
    toast.success('Department Updated successfully')

    try {
      await onUpdated?.()
    }

    catch {
      toast.error('Department was updated, but refreshing failed. Please reload the page.')
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        if (busy)
          return
        form.reset()
        setOpen(nextOpen)
      }}
    >
      <DialogTrigger render={<Button disabled={busy} />}>
        Update
      </DialogTrigger>
      <DialogContent showCloseButton={!busy}>
        <DialogHeader className="mb-6">
          <DialogTitle>Update Department</DialogTitle>
          <DialogDescription>Update a department with a name and an optional description.</DialogDescription>
        </DialogHeader>
        <form noValidate onSubmit={form.handleSubmit(onSubmit)}>
          <FieldGroup>
            <Field data-invalid={!!errors.name}>
              <FieldLabel htmlFor={`${fieldId}-name`}>Name</FieldLabel>
              <Input
                id={`${fieldId}-name`}
                disabled={busy}
                required
                aria-invalid={!!errors.name}
                aria-describedby={errors.name ? `${fieldId}-name-error` : undefined}
                {...form.register('name')}
              />
              <FieldError id={`${fieldId}-name-error`} errors={[errors.name]} />
            </Field>
            <Field data-invalid={!!errors.description}>
              <FieldLabel htmlFor={`${fieldId}-description`}>Description (optional)</FieldLabel>
              <Textarea
                id={`${fieldId}-description`}
                disabled={busy}
                aria-invalid={!!errors.description}
                aria-describedby={errors.description ? `${fieldId}-description-error` : undefined}
                {...form.register('description')}
              />
              <FieldError id={`${fieldId}-description-error`} errors={[errors.description]} />
            </Field>
            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                disabled={busy}
                onClick={() => {
                  form.reset()
                  setOpen(false)
                }}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={busy}>
                {busy ? 'Updating...' : 'Update Department'}
              </Button>
            </div>
          </FieldGroup>
        </form>
      </DialogContent>
    </Dialog>
  )
}
