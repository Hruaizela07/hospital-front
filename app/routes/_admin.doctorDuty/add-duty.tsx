import type { doctorDutyAddForm, doctorDutyAddInput } from './schema'
import type { CreateDoctorDutyShiftMutation, CreateDoctorDutyShiftMutationVariables, DoctorsQuery, DoctorsQueryVariables } from '~/gql/graphql'
import { useMutation, useQuery } from '@apollo/client'
import { zodResolver } from '@hookform/resolvers/zod'
import { format, isValid, parse } from 'date-fns'
import { CalendarIcon } from 'lucide-react'
import { useId, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { Button } from '~/components/ui/button'
import { Calendar } from '~/components/ui/calendar'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '~/components/ui/dialog'
import { Field, FieldError, FieldGroup, FieldLabel } from '~/components/ui/field'
import { Input } from '~/components/ui/input'
import { Popover, PopoverContent, PopoverTrigger } from '~/components/ui/popover'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '~/components/ui/select'
import { CREATE_DOCTOR_DUTY_SHIFT } from '~/graphql/mutation/create-doctor-duty-shift'
import { DOCTORS_QUERY } from '~/graphql/query/doctors'
import getSubmitErrorMessage from '~/lib/get-submit-error-message'
import { cn } from '~/lib/utils'
import { dutySchema } from './schema'

interface Props {
  onCreated?: (duty: CreateDoctorDutyShiftMutation['createDoctorDutyShift']) => void | Promise<void>
}

function dateFromFormValue(value?: string) {
  if (!value)
    return undefined

  const date = parse(value, 'yyyy-MM-dd', new Date())

  return isValid(date) ? date : undefined
}

export default function AddDuty({ onCreated }: Props) {
  const [open, setOpen] = useState(false)
  const id = useId()
  const form = useForm<doctorDutyAddInput, unknown, doctorDutyAddForm>({
    resolver: zodResolver(dutySchema),
    defaultValues: {
      doctor_id: '',
      duty_date: '',
      end_time: '',
      start_time: '',
    },
  })

  const [createDuty, { loading }] = useMutation<CreateDoctorDutyShiftMutation, CreateDoctorDutyShiftMutationVariables>(CREATE_DOCTOR_DUTY_SHIFT)
  const doctors = useQuery<DoctorsQuery, DoctorsQueryVariables>(DOCTORS_QUERY, {
    variables: { first: 100, page: 1 },
    skip: !open,
    fetchPolicy: 'cache-and-network',
    notifyOnNetworkStatusChange: true,
  })
  const doctorOptions = doctors.data?.doctors.data ?? []
  const { errors, isSubmitting } = form.formState
  const busy = loading || isSubmitting

  const onSubmit = async (values: doctorDutyAddForm) => {
    let createdDuty: CreateDoctorDutyShiftMutation['createDoctorDutyShift']

    try {
      const response = await createDuty({ variables: { input: values } })
      if (!response.data?.createDoctorDutyShift) {
        toast.error('Duty shift could not be created. Please try again.')
        return
      }
      createdDuty = response.data.createDoctorDutyShift
    }
    catch (error) {
      toast.error(getSubmitErrorMessage(error))
      return
    }

    form.reset()
    setOpen(false)
    toast.success('Duty shift created successfully')

    try {
      await onCreated?.(createdDuty)
    }
    catch {
      toast.error('Duty shift was created, but refreshing failed. Please reload the page.')
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
      <DialogTrigger render={<Button disabled={busy} />}>Add Duty</DialogTrigger>
      <DialogContent showCloseButton={!busy}>
        <DialogHeader className="mb-6">
          <DialogTitle>Add Duty Shift</DialogTitle>
          <DialogDescription>Assign a doctor to a duty date and time window.</DialogDescription>
        </DialogHeader>
        <form noValidate onSubmit={form.handleSubmit(onSubmit)}>
          <FieldGroup>
            <Controller
              control={form.control}
              name="doctor_id"
              render={({ field }) => (
                <Field data-invalid={!!errors.doctor_id}>
                  <FieldLabel htmlFor={`${id}-doctor`}>Doctor</FieldLabel>
                  <Select
                    items={doctorOptions.map(doctor => ({ value: doctor.id, label: doctor.userName }))}
                    value={field.value || null}
                    onValueChange={value => field.onChange(value ?? '')}
                    disabled={busy || doctors.loading || !doctorOptions.length}
                  >
                    <SelectTrigger
                      id={`${id}-doctor`}
                      ref={field.ref}
                      onBlur={field.onBlur}
                      className="w-full"
                      aria-required="true"
                      aria-invalid={!!errors.doctor_id}
                      aria-describedby={errors.doctor_id ? `${id}-doctor-error` : undefined}
                    >
                      <SelectValue placeholder="Select a doctor" />
                    </SelectTrigger>
                    <SelectContent>
                      {doctorOptions.map(doctor => <SelectItem key={doctor.id} value={doctor.id}>{doctor.userName}</SelectItem>)}
                    </SelectContent>
                  </Select>
                  <FieldError id={`${id}-doctor-error`} errors={[errors.doctor_id]} />
                  {doctors.loading && (
                    <p role="status" className="text-sm text-muted-foreground">Loading doctors...</p>
                  )}
                  {doctors.error && (
                    <div role="alert" className="space-y-2">
                      <p className="text-sm text-destructive">Could not load doctors.</p>
                      <Button
                        type="button"
                        variant="outline"
                        disabled={busy || doctors.loading}
                        onClick={() => {
                          void doctors.refetch().catch(() => {})
                        }}
                      >
                        Retry
                      </Button>
                    </div>
                  )}
                  {!doctors.loading && !doctors.error && !doctorOptions.length && (
                    <p className="text-sm text-muted-foreground">Create a doctor before adding a duty shift.</p>
                  )}
                </Field>
              )}
            />
            <Controller
              control={form.control}
              name="duty_date"
              render={({ field }) => {
                const selectedDate = dateFromFormValue(field.value)

                return (
                  <Field data-invalid={!!errors.duty_date}>
                    <FieldLabel htmlFor={`${id}-duty_date`}>Duty Date</FieldLabel>
                    <Popover>
                      <PopoverTrigger
                        render={(
                          <Button
                            id={`${id}-duty_date`}
                            type="button"
                            variant="outline"
                            disabled={busy}
                            aria-invalid={!!errors.duty_date}
                            aria-describedby={errors.duty_date ? `${id}-duty_date-error` : undefined}
                            className={cn(
                              'w-full justify-start text-left font-normal',
                              !field.value && 'text-muted-foreground',
                            )}
                          />
                        )}
                      >
                        <CalendarIcon className="size-4" />
                        {selectedDate ? format(selectedDate, 'PPP') : 'Pick a date'}
                      </PopoverTrigger>
                      <PopoverContent align="start" className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={selectedDate}
                          onSelect={(date) => {
                            field.onChange(date ? format(date, 'yyyy-MM-dd') : '')
                          }}
                        />
                      </PopoverContent>
                    </Popover>
                    <FieldError id={`${id}-duty_date-error`} errors={[errors.duty_date]} />
                  </Field>
                )
              }}
            />
            {([
              { name: 'start_time', label: 'Start Time', type: 'time' },
              { name: 'end_time', label: 'End Time', type: 'time' },
            ] as const).map(field => (
              <Field key={field.name} data-invalid={!!errors[field.name]}>
                <FieldLabel htmlFor={`${id}-${field.name}`}>{field.label}</FieldLabel>
                <Input
                  id={`${id}-${field.name}`}
                  type={field.type}
                  disabled={busy}
                  required
                  aria-invalid={!!errors[field.name]}
                  aria-describedby={errors[field.name] ? `${id}-${field.name}-error` : undefined}
                  {...form.register(field.name)}
                />
                <FieldError id={`${id}-${field.name}-error`} errors={[errors[field.name]]} />
              </Field>
            ))}
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
              <Button type="submit" disabled={busy || doctors.loading || !doctorOptions.length}>
                {busy ? 'Creating...' : 'Create Duty'}
              </Button>
            </div>
          </FieldGroup>
        </form>
      </DialogContent>
    </Dialog>
  )
}
