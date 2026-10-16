import type { DateRange } from 'react-day-picker'
import type { doctorLeaveForm, doctorLeaveInput } from './schema'
import type { CreateDoctorLeaveMutation, CreateDoctorLeaveMutationVariables, DoctorsQuery, DoctorsQueryVariables } from '~/gql/graphql'
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
import { Popover, PopoverContent, PopoverTrigger } from '~/components/ui/popover'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '~/components/ui/select'
import { CREATE_DOCTOR_LEAVE } from '~/graphql/mutation/create-doctor-leave'
import { DOCTORS_QUERY } from '~/graphql/query/doctors'
import getSubmitErrorMessage from '~/lib/get-submit-error-message'
import { cn } from '~/lib/utils'
import { leaveRangeToFormValues } from './leave-date-range'
import { doctorLeaveSchema } from './schema'

interface Props {
  onCreated?: (leave: CreateDoctorLeaveMutation['createDoctorLeave']) => void | Promise<void>
}

function dateFromFormValue(value?: string) {
  if (!value)
    return undefined

  const date = parse(value, 'yyyy-MM-dd', new Date())

  return isValid(date) ? date : undefined
}

export default function DoctorLeaveAdd({ onCreated }: Props) {
  const [open, setOpen] = useState(false)
  const id = useId()
  const form = useForm<doctorLeaveInput, unknown, doctorLeaveForm>({
    resolver: zodResolver(doctorLeaveSchema),
    defaultValues: {
      doctor_id: '',
      end_date: '',
      start_date: '',
    },
  })
  const [createLeave, { loading }] = useMutation<CreateDoctorLeaveMutation, CreateDoctorLeaveMutationVariables>(CREATE_DOCTOR_LEAVE)
  const doctors = useQuery<DoctorsQuery, DoctorsQueryVariables>(DOCTORS_QUERY, {
    variables: { first: 100, page: 1 },
    skip: !open,
    fetchPolicy: 'cache-and-network',
    notifyOnNetworkStatusChange: true,
  })
  const doctorOptions = doctors.data?.doctors.data ?? []
  const { errors, isSubmitting } = form.formState
  const busy = loading || isSubmitting
  const selectedRange: DateRange = {
    from: dateFromFormValue(form.watch('start_date')),
    to: dateFromFormValue(form.watch('end_date')),
  }

  const onSubmit = async (values: doctorLeaveForm) => {
    let createdLeave: CreateDoctorLeaveMutation['createDoctorLeave']

    try {
      const response = await createLeave({ variables: { input: values } })
      if (!response.data?.createDoctorLeave) {
        toast.error('Doctor leave could not be created. Please try again.')
        return
      }
      createdLeave = response.data.createDoctorLeave
    }
    catch (error) {
      toast.error(getSubmitErrorMessage(error))
      return
    }

    form.reset()
    setOpen(false)
    toast.success('Doctor leave created successfully')

    try {
      await onCreated?.(createdLeave)
    }
    catch {
      toast.error('Doctor leave was created, but refreshing failed. Please reload the page.')
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
      <DialogTrigger render={<Button disabled={busy} />}>Add Leave</DialogTrigger>
      <DialogContent showCloseButton={!busy}>
        <DialogHeader className="mb-6">
          <DialogTitle>Add Doctor Leave</DialogTitle>
          <DialogDescription>Record a doctor leave date range.</DialogDescription>
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
                    items={doctorOptions.map(doctor => ({ value: doctor.id, label: `${doctor.userName} Dept:${doctor.department?.name ?? 'No department'}` }))}
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
                      {doctorOptions.map(doctor => (
                        <SelectItem key={doctor.id} value={doctor.id}>
                          {doctor.userName}
                          {' '}
                          <span className="text-gray-600">
                            Dept:
                            {' '}
                            {doctor.department?.name ?? 'No department'}
                          </span>
                        </SelectItem>
                      ))}
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
                    <p className="text-sm text-muted-foreground">Create a doctor before adding leave.</p>
                  )}
                </Field>
              )}
            />
            <Field data-invalid={!!errors.start_date || !!errors.end_date}>
              <FieldLabel htmlFor={`${id}-leave-dates`}>Leave dates</FieldLabel>
              <Popover>
                <PopoverTrigger
                  render={(
                    <Button
                      id={`${id}-leave-dates`}
                      type="button"
                      variant="outline"
                      disabled={busy}
                      aria-invalid={!!errors.start_date || !!errors.end_date}
                      aria-describedby={errors.start_date || errors.end_date ? `${id}-leave-dates-error` : undefined}
                      className={cn(
                        'w-full justify-start text-left font-normal',
                        !selectedRange.from && 'text-muted-foreground',
                      )}
                    />
                  )}
                >
                  <CalendarIcon className="size-4" />
                  {selectedRange.from
                    ? selectedRange.to
                      ? `${format(selectedRange.from, 'PPP')} – ${format(selectedRange.to, 'PPP')}`
                      : `${format(selectedRange.from, 'PPP')} – Select end date`
                    : 'Pick a date range'}
                </PopoverTrigger>
                <PopoverContent align="start" className="w-auto p-0">
                  <Calendar
                    mode="range"
                    selected={selectedRange}
                    onSelect={(range) => {
                      const values = leaveRangeToFormValues(range)
                      form.setValue('start_date', values.start_date, { shouldValidate: true })
                      form.setValue('end_date', values.end_date, { shouldValidate: true })
                    }}
                  />
                </PopoverContent>
              </Popover>
              <FieldError id={`${id}-leave-dates-error`} errors={[errors.start_date, errors.end_date]} />
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
              <Button type="submit" disabled={busy || doctors.loading || !doctorOptions.length}>
                {busy ? 'Creating...' : 'Create Leave'}
              </Button>
            </div>
          </FieldGroup>
        </form>
      </DialogContent>
    </Dialog>
  )
}
