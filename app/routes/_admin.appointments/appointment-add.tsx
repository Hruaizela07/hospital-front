import type { AptmFormInput, AptmFormValue } from './schema'
import type { CreateAppointmentMutation, CreateAppointmentMutationVariables, DoctorsQuery, DoctorsQueryVariables, PatientsQuery, PatientsQueryVariables } from '~/gql/graphql'
import { useMutation, useQuery } from '@apollo/client'
import { zodResolver } from '@hookform/resolvers/zod'
import { format, isValid, parse } from 'date-fns'
import { CalendarIcon } from 'lucide-react'
import { useId, useMemo, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { Button } from '~/components/ui/button'
import { Calendar } from '~/components/ui/calendar'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '~/components/ui/dialog'
import { Field, FieldError, FieldGroup, FieldLabel } from '~/components/ui/field'
import { Input } from '~/components/ui/input'
import { Popover, PopoverContent, PopoverTrigger } from '~/components/ui/popover'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '~/components/ui/select'
import { Textarea } from '~/components/ui/textarea'
import { CREATE_APPOINTMENT } from '~/graphql/mutation/create-appointment'
import { DOCTORS_QUERY } from '~/graphql/query/doctors'
import { PATIENTS_QUERY } from '~/graphql/query/patients'
import getSubmitErrorMessage from '~/lib/get-submit-error-message'
import { cn } from '~/lib/utils'
import { APPOINTMENT_STATUS_OPTIONS, aptmSchema } from './schema'

const DATE_TIME_SEPARATOR = /[T ]/

interface Props {
  onCreated?: (appointment: CreateAppointmentMutation['createAppointment']) => void | Promise<void>
}

function dateFromAppointmentValue(value?: string) {
  if (!value)
    return undefined

  const date = parse(value.split(DATE_TIME_SEPARATOR)[0], 'yyyy-MM-dd', new Date())

  return isValid(date) ? date : undefined
}

export default function AppointmentAdd({ onCreated }: Props) {
  const [open, setOpen] = useState(false)

  const id = useId()
  const form = useForm<AptmFormInput, unknown, AptmFormValue>({
    resolver: zodResolver(aptmSchema),
    defaultValues: {
      appointment_date: '',
      doctor_id: '',
      end_time: '',
      notes: '',
      patient_id: '',
      start_time: '',
      status: APPOINTMENT_STATUS_OPTIONS[0].value,
    },
  })
  const patients = useQuery<PatientsQuery, PatientsQueryVariables>(PATIENTS_QUERY, {
    variables: { filter: {}, first: 100, page: 1 },
    skip: !open,
    fetchPolicy: 'cache-and-network',
    notifyOnNetworkStatusChange: true,
  })
  const doctors = useQuery<DoctorsQuery, DoctorsQueryVariables>(DOCTORS_QUERY, {
    variables: { filter: {}, first: 100, page: 1 },
    skip: !open,
    fetchPolicy: 'cache-and-network',
    notifyOnNetworkStatusChange: true,
  })
  const [createAppointment, { loading }] = useMutation<CreateAppointmentMutation, CreateAppointmentMutationVariables>(CREATE_APPOINTMENT)
  const patientData = patients.data?.patients.data
  const doctorData = doctors.data?.doctors.data
  const patientOptions = useMemo(() => patientData ?? [], [patientData])
  const doctorOptions = useMemo(() => doctorData ?? [], [doctorData])

  const { errors, isSubmitting } = form.formState
  const busy = loading || isSubmitting

  const resetDialog = () => {
    form.reset()
  }

  const onSubmit = async (values: AptmFormValue) => {
    let createdAppointment: CreateAppointmentMutation['createAppointment']

    try {
      const response = await createAppointment({ variables: { Input: values } })
      if (!response.data?.createAppointment) {
        toast.error('Appointment could not be created. Please try again.')
        return
      }
      createdAppointment = response.data.createAppointment
    }
    catch (error) {
      toast.error(getSubmitErrorMessage(error))
      return
    }

    resetDialog()
    setOpen(false)
    toast.success('Appointment created successfully')

    try {
      await onCreated?.(createdAppointment)
    }
    catch {
      toast.error('Appointment was created, but refreshing failed. Please reload the page.')
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        if (busy)
          return
        resetDialog()
        setOpen(nextOpen)
      }}
    >
      <DialogTrigger render={<Button disabled={busy} />}>Add Appointment</DialogTrigger>
      <DialogContent showCloseButton={!busy}>
        <DialogHeader className="mb-6">
          <DialogTitle>Add Appointment</DialogTitle>
          <DialogDescription>Schedule a patient with a doctor.</DialogDescription>
        </DialogHeader>
        <form noValidate onSubmit={form.handleSubmit(onSubmit)}>
          <FieldGroup>

            <Controller
              control={form.control}
              name="patient_id"
              render={({ field }) => (
                <Field data-invalid={!!errors.patient_id}>
                  <FieldLabel htmlFor={`${id}-patient`}>Patient</FieldLabel>
                  <Select
                    value={field.value || null}
                    onValueChange={value => field.onChange(value ?? '')}
                    disabled={busy || patients.loading}
                  >
                    <SelectTrigger
                      id={`${id}-patient`}
                      ref={field.ref}
                      onBlur={field.onBlur}
                      className="w-full"
                      aria-required="true"
                      aria-invalid={!!errors.patient_id}
                      aria-describedby={errors.patient_id ? `${id}-patient-error` : undefined}
                    >
                      <SelectValue placeholder="Select a patient" />
                    </SelectTrigger>
                    <SelectContent>
                      {patientOptions.map(patient => (
                        <SelectItem key={patient.id} value={`${patient.name} Symptom:${patient.symptom}`}>
                          {patient.name}
                          <span className="text-muted-foreground">
                            {' '}
                            {patient.phone ?? patient.email ?? 'No contact'}
                          </span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FieldError id={`${id}-patient-error`} errors={[errors.patient_id]} />
                  {patients.loading && (
                    <p
                      role="status"
                      className="text-sm text-muted-foreground"
                    >
                      Loading patients...
                    </p>
                  )}
                  {patients.error && (
                    <p
                      role="alert"
                      className="text-sm text-destructive"
                    >
                      Could not load patients.
                    </p>
                  )}
                  {!patients.loading && !patients.error && !patientOptions.length && (
                    <p className="text-sm text-muted-foreground">Create a patient before adding an appointment.</p>
                  )}
                </Field>
              )}
            />

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
                      {doctorOptions.map(doctor => (
                        <SelectItem key={doctor.id} value={doctor.id}>
                          {doctor.userName}
                          <span className="text-muted-foreground">
                            {' '}
                            {doctor.department?.name ?? 'No department'}
                          </span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FieldError id={`${id}-doctor-error`} errors={[errors.doctor_id]} />
                  {doctors.loading && (
                    <p
                      role="status"
                      className="text-sm text-muted-foreground"
                    >
                      Loading doctors...
                    </p>
                  )}
                  {doctors.error && (
                    <p
                      role="alert"
                      className="text-sm text-destructive"
                    >
                      Could not load doctors.
                    </p>
                  )}
                  {!doctors.loading && !doctors.error && !doctorOptions.length && (
                    <p className="text-sm text-muted-foreground">Create a doctor before adding an appointment.</p>
                  )}
                </Field>
              )}
            />

            <Controller
              control={form.control}
              name="appointment_date"
              render={({ field }) => {
                const selectedDate = dateFromAppointmentValue(field.value)

                return (
                  <Field data-invalid={!!errors.appointment_date}>
                    <FieldLabel htmlFor={`${id}-date`}>Date</FieldLabel>
                    <Popover>
                      <PopoverTrigger
                        render={(
                          <Button
                            id={`${id}-date`}
                            type="button"
                            variant="outline"
                            disabled={busy}
                            aria-invalid={!!errors.appointment_date}
                            aria-describedby={errors.appointment_date ? `${id}-appointment-date-error` : undefined}
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
                    <FieldError id={`${id}-appointment-date-error`} errors={[errors.appointment_date]} />
                  </Field>
                )
              }}
            />

            <div className="
              grid gap-3
              sm:grid-cols-2
            "
            >
              {([
                { name: 'start_time', label: 'Start Time' },
                { name: 'end_time', label: 'End Time' },
              ] as const).map(timeField => (
                <Controller
                  key={timeField.name}
                  control={form.control}
                  name={timeField.name}
                  render={({ field }) => (
                    <Field data-invalid={!!errors[timeField.name]}>
                      <FieldLabel htmlFor={`${id}-${timeField.name}`}>{timeField.label}</FieldLabel>
                      <Input
                        id={`${id}-${timeField.name}`}
                        type="time"
                        value={field.value?.slice(0, 5) ?? ''}
                        disabled={busy}
                        aria-invalid={!!errors[timeField.name]}
                        aria-describedby={errors[timeField.name] ? `${id}-${timeField.name}-error` : undefined}
                        onBlur={field.onBlur}
                        onChange={event => field.onChange(event.target.value)}
                      />
                      <FieldError id={`${id}-${timeField.name}-error`} errors={[errors[timeField.name]]} />
                    </Field>
                  )}
                />
              ))}
            </div>

            <Controller
              control={form.control}
              name="status"
              render={({ field }) => (
                <Field data-invalid={!!errors.status}>
                  <FieldLabel htmlFor={`${id}-status`}>Status</FieldLabel>
                  <Select
                    items={APPOINTMENT_STATUS_OPTIONS}
                    value={field.value || null}
                    onValueChange={value => field.onChange(value ?? '')}
                    disabled={busy}
                  >
                    <SelectTrigger
                      id={`${id}-status`}
                      ref={field.ref}
                      onBlur={field.onBlur}
                      className="w-full"
                      aria-required="true"
                      aria-invalid={!!errors.status}
                      aria-describedby={errors.status ? `${id}-status-error` : undefined}
                    >
                      <SelectValue placeholder="Select a status" />
                    </SelectTrigger>
                    <SelectContent>
                      {APPOINTMENT_STATUS_OPTIONS.map(option => <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>)}
                    </SelectContent>
                  </Select>
                  <FieldError id={`${id}-status-error`} errors={[errors.status]} />
                </Field>
              )}
            />

            <Controller
              control={form.control}
              name="notes"
              render={({ field }) => (
                <Field data-invalid={!!errors.notes}>
                  <FieldLabel htmlFor={`${id}-notes`}>Notes</FieldLabel>
                  <Textarea
                    id={`${id}-notes`}
                    disabled={busy}
                    aria-invalid={!!errors.notes}
                    aria-describedby={errors.notes ? `${id}-notes-error` : undefined}
                    {...field}
                  />
                  <FieldError id={`${id}-notes-error`} errors={[errors.notes]} />
                </Field>
              )}
            />

            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                disabled={busy}
                onClick={() => {
                  resetDialog()
                  setOpen(false)
                }}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={busy || patients.loading || doctors.loading || !patientOptions.length || !doctorOptions.length}>
                {busy ? 'Creating...' : 'Create Appointment'}
              </Button>
            </div>
          </FieldGroup>
        </form>
      </DialogContent>
    </Dialog>
  )
}
