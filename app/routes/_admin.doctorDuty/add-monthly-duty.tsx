import type { monthlyDutyAddForm, monthlyDutyAddInput } from './schema'
import type { CreateDoctorDutyShiftsForMonthMutation, CreateDoctorDutyShiftsForMonthMutationVariables, DoctorsQuery, DoctorsQueryVariables } from '~/gql/graphql'
import { useMutation, useQuery } from '@apollo/client'
import { zodResolver } from '@hookform/resolvers/zod'
import { useId, useState } from 'react'
import { Controller, useForm, useWatch } from 'react-hook-form'
import { toast } from 'sonner'
import { Button } from '~/components/ui/button'
import { Calendar } from '~/components/ui/calendar'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '~/components/ui/dialog'
import { Field, FieldError, FieldGroup, FieldLabel } from '~/components/ui/field'
import { Input } from '~/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '~/components/ui/select'
import { DOCTOR_DUTY_SHIFT_FOR_MONTH } from '~/graphql/mutation/create-doctor-duty-shift-month'
import { DOCTORS_QUERY } from '~/graphql/query/doctors'
import getSubmitErrorMessage from '~/lib/get-submit-error-message'
import { getMonthlyDutyDateFields, monthlyDutySchema } from './schema'

interface Props {
  onCreated?: (duties: CreateDoctorDutyShiftsForMonthMutation['createDoctorDutyShiftsForMonth']) => void | Promise<void>
}

function dateFromMonthlyDutyFields(month?: unknown, year?: unknown) {
  const monthNumber = Number(month)
  const yearNumber = Number(year)

  if (!Number.isInteger(monthNumber) || !Number.isInteger(yearNumber) || monthNumber < 1 || monthNumber > 12) {
    return undefined
  }

  // const today = new Date()

  // if (today.getMonth() + 1 === monthNumber && today.getFullYear() === yearNumber) {
  //   return today
  // }

  return new Date()
}

export default function AddMonthlyDuty({ onCreated }: Props) {
  const [open, setOpen] = useState(false)
  const id = useId()
  const today = new Date()
  const defaultDateFields = getMonthlyDutyDateFields(today)
  const form = useForm<monthlyDutyAddInput, unknown, monthlyDutyAddForm>({
    resolver: zodResolver(monthlyDutySchema),
    defaultValues: {
      doctor_id: '',
      end_time: '',
      month: String(defaultDateFields.month),
      start_time: '',
      year: String(defaultDateFields.year),
    },
  })

  const [createMonthlyDuty, { loading }] = useMutation<CreateDoctorDutyShiftsForMonthMutation, CreateDoctorDutyShiftsForMonthMutationVariables>(DOCTOR_DUTY_SHIFT_FOR_MONTH)
  const doctors = useQuery<DoctorsQuery, DoctorsQueryVariables>(DOCTORS_QUERY, {
    variables: { first: 100, page: 1 },
    skip: !open,
    fetchPolicy: 'cache-and-network',
    notifyOnNetworkStatusChange: true,
  })
  const doctorOptions = doctors.data?.doctors.data ?? []
  const selectedYear = useWatch({ control: form.control, name: 'year' })
  const { errors, isSubmitting } = form.formState
  const busy = loading || isSubmitting

  const resetForm = () => {
    form.reset({
      doctor_id: '',
      end_time: '',
      month: String(defaultDateFields.month),
      start_time: '',
      year: String(defaultDateFields.year),
    })
  }

  const onSubmit = async (values: monthlyDutyAddForm) => {
    let createdDuties: CreateDoctorDutyShiftsForMonthMutation['createDoctorDutyShiftsForMonth']

    try {
      const response = await createMonthlyDuty({ variables: { input: values } })
      if (!response.data?.createDoctorDutyShiftsForMonth) {
        toast.error('Monthly duty schedule could not be created. Please try again.')
        return
      }
      createdDuties = response.data.createDoctorDutyShiftsForMonth
    }
    catch (error) {
      toast.error(getSubmitErrorMessage(error))
      return
    }

    resetForm()
    setOpen(false)
    toast.success('Monthly duty schedule created successfully')

    try {
      await onCreated?.(createdDuties)
    }
    catch {
      toast.error('Monthly duty schedule was created, but refreshing failed. Please reload the page.')
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
      <DialogTrigger render={<Button type="button" variant="outline" disabled={busy} />}>Create Monthly Schedule</DialogTrigger>
      <DialogContent showCloseButton={!busy}>
        <DialogHeader className="mb-6">
          <DialogTitle>Create Monthly Schedule</DialogTitle>
          <DialogDescription>Assign a doctor to the same duty time across a month.</DialogDescription>
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
                    items={doctorOptions.map(doctor => ({ value: doctor.id, label: ` ${doctor.userName} Dept: ${doctor.department?.name ?? 'No Dept'}` }))}
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
                            {doctor.department?.name}
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
                    <p className="text-sm text-muted-foreground">Create a doctor before adding a duty schedule.</p>
                  )}
                </Field>
              )}
            />
            <Controller
              control={form.control}
              name="month"
              render={({ field }) => {
                const selectedDate = dateFromMonthlyDutyFields(field.value, selectedYear)
                const dateErrorId = `${id}-schedule-date-error`

                return (
                  <Field data-invalid={!!errors.month || !!errors.year}>
                    <FieldLabel htmlFor={`${id}-schedule-date`}>Schedule Month</FieldLabel>
                    <Calendar
                      id={`${id}-schedule-date`}
                      mode="single"
                      captionLayout="dropdown"
                      selected={selectedDate}
                      onSelect={(date) => {
                        if (!date)
                          return

                        const dateFields = getMonthlyDutyDateFields(date)
                        field.onChange(String(dateFields.month))
                        form.setValue('year', String(dateFields.year), {
                          shouldDirty: true,
                          shouldValidate: true,
                        })
                      }}
                      disabled={busy}
                      aria-invalid={!!errors.month || !!errors.year}
                      aria-describedby={errors.month || errors.year ? dateErrorId : undefined}
                      className="rounded-lg border"
                    />
                    <FieldError id={dateErrorId} errors={[errors.month, errors.year]} />
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
                  resetForm()
                  setOpen(false)
                }}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={busy || doctors.loading || !doctorOptions.length}>
                {busy ? 'Creating...' : 'Create Schedule'}
              </Button>
            </div>
          </FieldGroup>
        </form>
      </DialogContent>
    </Dialog>
  )
}
