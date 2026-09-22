import type { departmentAddForm, departmentAddInput } from './dpSchema'
import type { CreateDepartmentMutation, CreateDepartmentMutationVariables } from '~/gql/graphql'
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
import { CREATE_DEPARTMENT } from '~/graphql/mutation/create-department'
import getSubmitErrorMessage from '~/lib/get-submit-error-message'
import { departmentSchema } from './dpSchema'

interface Props {
  onCreated?: () => void | Promise<void>
}

export default function DepartmentAdd({ onCreated }: Props) {
  const [open, setOpen] = useState(false)
  const id = useId()
  const form = useForm<departmentAddInput, unknown, departmentAddForm>({
    resolver: zodResolver(departmentSchema),
    defaultValues: { name: '', description: '' },
  })
  const [createDepartment, { loading }] = useMutation<CreateDepartmentMutation, CreateDepartmentMutationVariables>(CREATE_DEPARTMENT)
  const { errors, isSubmitting } = form.formState
  const busy = loading || isSubmitting

  const onSubmit = async (values: departmentAddForm) => {
    try {
      const response = await createDepartment({ variables: { input: values } })
      if (!response.data?.createDepartment) {
        toast.error('Department could not be created. Please try again.')
        return
      }
    }
    catch (error) {
      toast.error(getSubmitErrorMessage(error))
      return
    }

    form.reset()
    setOpen(false)
    toast.success('Department created successfully')

    try {
      await onCreated?.()
    }
    catch {
      toast.error('Department was created, but refreshing failed. Please reload the page.')
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
        Add Department
      </DialogTrigger>
      <DialogContent showCloseButton={!busy}>
        <DialogHeader className="mb-6">
          <DialogTitle>Add Department</DialogTitle>
          <DialogDescription>Create a department with a name and an optional description.</DialogDescription>
        </DialogHeader>
        <form noValidate onSubmit={form.handleSubmit(onSubmit)}>
          <FieldGroup>
            <Field data-invalid={!!errors.name}>
              <FieldLabel htmlFor={`${id}-name`}>Name</FieldLabel>
              <Input
                id={`${id}-name`}
                disabled={busy}
                required
                aria-invalid={!!errors.name}
                aria-describedby={errors.name ? `${id}-name-error` : undefined}
                {...form.register('name')}
              />
              <FieldError id={`${id}-name-error`} errors={[errors.name]} />
            </Field>
            <Field data-invalid={!!errors.description}>
              <FieldLabel htmlFor={`${id}-description`}>Description (optional)</FieldLabel>
              <Textarea
                id={`${id}-description`}
                disabled={busy}
                aria-invalid={!!errors.description}
                aria-describedby={errors.description ? `${id}-description-error` : undefined}
                {...form.register('description')}
              />
              <FieldError id={`${id}-description-error`} errors={[errors.description]} />
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
                {busy ? 'Creating...' : 'Create Department'}
              </Button>
            </div>
          </FieldGroup>
        </form>
      </DialogContent>
    </Dialog>
  )
}
