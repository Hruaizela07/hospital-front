import type { UpdateDoctorFormInput, UpdateDoctorFormValues } from './schema'
import type { DepartmentsQuery, DepartmentsQueryVariables, DoctorsQuery, UpdateDoctorInput, UpdateDoctorMutation, UpdateDoctorMutationVariables } from '~/gql/graphql'
import { useMutation, useQuery } from '@apollo/client'
import { zodResolver } from '@hookform/resolvers/zod'
import { useId, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { Button } from '~/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '~/components/ui/dialog'
import { Field, FieldError, FieldGroup, FieldLabel } from '~/components/ui/field'
import { Input } from '~/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '~/components/ui/select'
import { UPDATE_DOCTOR } from '~/graphql/mutation/update-doctor'
import { DEPARTMENTS_QUERY } from '~/graphql/query/departments'
import getSubmitErrorMessage from '~/lib/get-submit-error-message'
import { updateDoctorSchema } from './schema'

interface Props {
  doctor: DoctorsQuery['doctors']['data'][number]
  onUpdated?: () => void | Promise<void>
}

function toInputMutation(values: UpdateDoctorFormValues): UpdateDoctorInput {
  return {
    email: values.email,
    userName: values.userName,
    specialization: values.specialization,
    image: values.image,
    department_id: values.department_Id,
  }
}

export default function DoctorsUpdate({ doctor, onUpdated }: Props) {
  const [open, setOpen] = useState(false)
  const [fileInputKey, setFileInputKey] = useState(0)
  const id = useId()
  const defaults: UpdateDoctorFormInput = {
    id: doctor.id,
    userName: doctor.userName,
    email: doctor.email ?? '',
    specialization: doctor.specialization ?? '',
    department_Id: doctor.department?.id ?? '',
    image: undefined,
  }
  const form = useForm<UpdateDoctorFormInput, unknown, UpdateDoctorFormValues>({
    resolver: zodResolver(updateDoctorSchema),
    defaultValues: defaults,
  })
  const resetForm = () => {
    form.reset(defaults)
    setFileInputKey(value => value + 1)
  }
  const [doctorUpdate, { loading }] = useMutation<UpdateDoctorMutation, UpdateDoctorMutationVariables>(UPDATE_DOCTOR)
  const departments = useQuery<DepartmentsQuery, DepartmentsQueryVariables>(DEPARTMENTS_QUERY, {
    variables: { first: 20, page: 1 },
    skip: !open,
    fetchPolicy: 'cache-and-network',
    notifyOnNetworkStatusChange: true,
  })
  const options = [...new Map([
    ...(doctor.department ? [doctor.department] : []),
    ...(departments.data?.departments.data ?? []),
  ].map(item => [item.id, item])).values()]
  const pagination = departments.data?.departments.paginatorInfo
  const { errors, isSubmitting } = form.formState
  const busy = loading || isSubmitting

  const loadMoreDepartments = async () => {
    if (!pagination)
      return
    try {
      await departments.fetchMore({
        variables: { page: pagination.currentPage + 1 },
        updateQuery: (previous, { fetchMoreResult }) => ({
          ...fetchMoreResult,
          departments: {
            ...fetchMoreResult.departments,
            data: [...new Map([...previous.departments.data, ...fetchMoreResult.departments.data].map(item => [item.id, item])).values()],
          },
        }),
      })
    }
    catch (error) {
      toast.error(getSubmitErrorMessage(error, 'Could not load more departments.'))
    }
  }

  const onSubmit = async (values: UpdateDoctorFormValues) => {
    try {
      const response = await doctorUpdate({ variables: { id: doctor.id, input: toInputMutation(values) } })
      if (!response.data?.updateDoctor) {
        toast.error('Doctor could not be updated. Please try again.')
        return
      }
    }
    catch (error) {
      toast.error(getSubmitErrorMessage(error))
      return
    }
    resetForm()
    setOpen(false)
    toast.success('Doctor updated successfully')
    try {
      await onUpdated?.()
    }
    catch {
      toast.error('Doctor was updated, but refreshing failed. Please reload the page.')
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        if (busy)
          return
        resetForm()
        setOpen(nextOpen)
      }}
    >
      <DialogTrigger render={<Button variant="outline" disabled={busy} />}>Edit</DialogTrigger>
      <DialogContent showCloseButton={!busy}>
        <DialogHeader className="mb-6">
          <DialogTitle>Edit Doctor</DialogTitle>
          <DialogDescription>Update the doctor’s details and department. Their password will stay unchanged.</DialogDescription>
        </DialogHeader>
        <form noValidate onSubmit={form.handleSubmit(onSubmit)}>
          <FieldGroup>
            {([
              { name: 'userName', label: 'Name', type: 'text', autoComplete: 'name' },
              { name: 'email', label: 'Email', type: 'email', autoComplete: 'email' },
              { name: 'specialization', label: 'Specialization', type: 'text', autoComplete: 'off' },
            ] as const).map(field => (
              <Field key={field.name} data-invalid={!!errors[field.name]}>
                <FieldLabel htmlFor={`${id}-${field.name}`}>{field.label}</FieldLabel>
                <Input
                  id={`${id}-${field.name}`}
                  type={field.type}
                  autoComplete={field.autoComplete}
                  disabled={busy}
                  required
                  aria-invalid={!!errors[field.name]}
                  aria-describedby={errors[field.name] ? `${id}-${field.name}-error` : undefined}
                  {...form.register(field.name)}
                />
                <FieldError id={`${id}-${field.name}-error`} errors={[errors[field.name]]} />
              </Field>
            ))}
            <Controller
              control={form.control}
              name="department_Id"
              render={({ field }) => (
                <Field data-invalid={!!errors.department_Id}>
                  <FieldLabel htmlFor={`${id}-department`}>Department</FieldLabel>
                  <Select
                    items={options.map(item => ({ value: item.id, label: item.name }))}
                    value={field.value || null}
                    onValueChange={value => field.onChange(value ?? '')}
                    disabled={busy || departments.loading || !options.length}
                  >
                    <SelectTrigger
                      id={`${id}-department`}
                      ref={field.ref}
                      onBlur={field.onBlur}
                      className="w-full"
                      aria-required="true"
                      aria-invalid={!!errors.department_Id}
                      aria-describedby={errors.department_Id ? `${id}-department-error` : undefined}
                    >
                      <SelectValue placeholder="Select a department" />
                    </SelectTrigger>
                    <SelectContent>
                      {options.map(item => <SelectItem key={item.id} value={item.id}>{item.name}</SelectItem>)}
                    </SelectContent>
                  </Select>
                  <FieldError id={`${id}-department-error`} errors={[errors.department_Id]} />
                  {departments.loading && (
                    <p
                      role="status"
                      className="text-sm text-muted-foreground"
                    >
                      Loading departments...
                    </p>
                  )}
                  {departments.error && (
                    <div role="alert" className="space-y-2">
                      <p className="text-sm text-destructive">Could not load departments.</p>
                      <Button
                        type="button"
                        variant="outline"
                        disabled={busy || departments.loading}
                        onClick={() => {
                          void departments.refetch().catch(() => {})
                        }}
                      >
                        Retry
                      </Button>
                    </div>
                  )}
                  {!departments.loading && !departments.error && !options.length && (
                    <p className="text-sm text-muted-foreground">Create a department before updating this doctor.</p>
                  )}
                  {pagination && pagination.currentPage < pagination.lastPage && (
                    <Button type="button" variant="outline" disabled={busy || departments.loading} onClick={loadMoreDepartments}>Load more departments</Button>
                  )}
                </Field>
              )}
            />
            <Controller
              control={form.control}
              name="image"
              render={({ field: { onChange, onBlur, ref } }) => (
                <Field data-invalid={!!errors.image}>
                  <FieldLabel htmlFor={`${id}-image`}>Replace image (optional)</FieldLabel>
                  <p className="text-sm text-muted-foreground">Leave empty to keep the current image.</p>
                  <Input
                    id={`${id}-image`}
                    type="file"
                    accept="image/*"
                    disabled={busy}
                    key={fileInputKey}
                    ref={ref}
                    onBlur={onBlur}
                    onChange={event => onChange(event.target.files?.[0])}
                    aria-invalid={!!errors.image}
                    aria-describedby={errors.image ? `${id}-image-error` : undefined}
                  />
                  <FieldError id={`${id}-image-error`} errors={[errors.image]} />
                </Field>
              )}
            />
            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                disabled={busy}
                onClick={() => {
                  resetForm()
                  setOpen(false)
                }}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={busy}>{busy ? 'Saving...' : 'Save Changes'}</Button>
            </div>
          </FieldGroup>
        </form>
      </DialogContent>
    </Dialog>
  )
}
