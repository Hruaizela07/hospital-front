import type { DoctorFormInput, DoctorFormValues } from './schema'
import type { CreateDoctorInput, CreateDoctorMutation, CreateDoctorMutationVariables, DepartmentsQuery, DepartmentsQueryVariables } from '~/gql/graphql'
import { useMutation, useQuery } from '@apollo/client'
import { zodResolver } from '@hookform/resolvers/zod'
import { useId, useRef, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { Button } from '~/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '~/components/ui/dialog'
import { Field, FieldError, FieldGroup, FieldLabel } from '~/components/ui/field'
import { Input } from '~/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '~/components/ui/select'
import { CREATE_DOCTOR } from '~/graphql/mutation/create-doctor'
import { DEPARTMENTS_QUERY } from '~/graphql/query/departments'
import getSubmitErrorMessage from '~/lib/get-submit-error-message'
import { DOCTOR_LEAVE_STATUS_OPTIONS, DOCTOR_STATUS_OPTIONS, doctorSchema } from './schema'

interface Props {
  onCreated?: () => void | Promise<void>
}

function toInputMutation(values: DoctorFormValues): CreateDoctorInput {
  return {
    email: values.email,
    password: values.password,
    userName: values.userName,
    specialization: values.specialization,
    status: values.status,
    image: values.image,
    department_id: values.department_Id,
  }
}

export default function DoctorsAdd({ onCreated }: Props) {
  const [open, setOpen] = useState(false)
  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const id = useId()
  const form = useForm<DoctorFormInput, unknown, DoctorFormValues>({
    resolver: zodResolver(doctorSchema),
    defaultValues: {
      userName: '',
      email: '',
      password: '',
      specialization: '',
      department_Id: '',
      status: 'ACTIVE',
      leave_status: DOCTOR_LEAVE_STATUS_OPTIONS[0].value,
    },
  })
  const [doctorAdd, { loading }] = useMutation<CreateDoctorMutation, CreateDoctorMutationVariables>(CREATE_DOCTOR)
  const departments = useQuery<DepartmentsQuery, DepartmentsQueryVariables>(DEPARTMENTS_QUERY, {
    variables: { first: 20, page: 1 },
    skip: !open,
    fetchPolicy: 'cache-and-network',
    notifyOnNetworkStatusChange: true,
  })
  const options = departments.data?.departments.data ?? []
  const { errors, isSubmitting } = form.formState
  const busy = loading || isSubmitting

  const onSubmit = async (values: DoctorFormValues) => {
    try {
      const response = await doctorAdd({ variables: { input: toInputMutation(values) } })
      if (!response.data?.createDoctor) {
        toast.error('Doctor could not be created. Please try again.')
        return
      }
    }
    catch (error) {
      toast.error(getSubmitErrorMessage(error))
      return
    }
    form.reset()
    setOpen(false)
    toast.success('Doctor created successfully')
    try {
      await onCreated?.()
    }
    catch {
      toast.error('Doctor was created, but refreshing failed. Please reload the page.')
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
      <DialogTrigger render={<Button disabled={busy} />}>Add Doctor</DialogTrigger>
      <DialogContent showCloseButton={!busy}>
        <DialogHeader className="mb-6">
          <DialogTitle>Add Doctor</DialogTitle>
          <DialogDescription>Enter the doctor’s details and select their department.</DialogDescription>
        </DialogHeader>
        <form noValidate onSubmit={form.handleSubmit(onSubmit)}>
          <FieldGroup>
            {([
              { name: 'userName', label: 'Name', type: 'text', autoComplete: 'name' },
              { name: 'password', label: 'Password', type: 'password', autoComplete: 'new-password' },
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
                    <p className="text-sm text-muted-foreground">Create a department before adding a doctor.</p>
                  )}

                </Field>
              )}
            />
            {([
              { name: 'status', label: 'Status', placeholder: 'Select a status', options: DOCTOR_STATUS_OPTIONS },
              // { name: 'leave_status', label: 'Leave Status', placeholder: 'Select a leave status', options: DOCTOR_LEAVE_STATUS_OPTIONS },
            ] as const).map(statusField => (
              <Controller
                key={statusField.name}
                control={form.control}
                name={statusField.name}
                render={({ field }) => (
                  <Field data-invalid={!!errors[statusField.name]}>
                    <FieldLabel htmlFor={`${id}-${statusField.name}`}>{statusField.label}</FieldLabel>
                    <Select
                      items={statusField.options.map(option => ({ value: option.value, label: option.label }))}
                      value={field.value || null}
                      onValueChange={value => field.onChange(value ?? '')}
                      disabled={busy}
                    >
                      <SelectTrigger
                        id={`${id}-${statusField.name}`}
                        ref={field.ref}
                        onBlur={field.onBlur}
                        className="w-full"
                        aria-required="true"
                        aria-invalid={!!errors[statusField.name]}
                        aria-describedby={errors[statusField.name] ? `${id}-${statusField.name}-error` : undefined}
                      >
                        <SelectValue placeholder={statusField.placeholder} />
                      </SelectTrigger>
                      <SelectContent>
                        {statusField.options.map(option => <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>)}
                      </SelectContent>
                    </Select>
                    <FieldError id={`${id}-${statusField.name}-error`} errors={[errors[statusField.name]]} />
                  </Field>
                )}
              />
            ))}
            <Controller
              control={form.control}
              name="image"
              render={({ field: { onChange, onBlur } }) => (
                <Field data-invalid={!!errors.image}>
                  <FieldLabel htmlFor={`${id}-image`}>Image (optional)</FieldLabel>
                  <Input
                    id="img"
                    type="file"
                    accept="image/*"
                    disabled={busy}
                    ref={fileInputRef}
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
                  form.reset()
                  setOpen(false)
                }}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={busy}>{busy ? 'Creating...' : 'Create Doctor'}</Button>
            </div>
          </FieldGroup>
        </form>
      </DialogContent>
    </Dialog>
  )
}
