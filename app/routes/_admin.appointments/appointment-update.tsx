import type { AptmUpFormInput, AptmUpFormValue } from './schema'
import type { AppointmentsQuery, DoctorsQuery, DoctorsQueryVariables, PatientsQuery, PatientsQueryVariables, UpdateAppointmentInput, UpdateAppointmentMutation, UpdateAppointmentMutationVariables } from '~/gql/graphql'
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
import { UPDATE_APPOINTMENT } from '~/graphql/mutation/update-appointment'
import { DOCTORS_QUERY } from '~/graphql/query/doctors'
import { PATIENTS_QUERY } from '~/graphql/query/patients'
import getSubmitErrorMessage from '~/lib/get-submit-error-message'
import { cn } from '~/lib/utils'
import { APPOINTMENT_STATUS_OPTIONS, aptmUpSchema } from './schema'

const DATE_TIME_SEPARATOR = /[T ]/

export type AppointmentForUpdate = AppointmentsQuery['appointments']['data'][number]

interface Props {
  appointment: AppointmentForUpdate
  onUpdated?: (appointment: UpdateAppointmentMutation['updateAppointment']) => void | Promise<void>
}

function dateFromAppointmentValue(value?: string) {
  if (!value)
    return undefined

  const date = parse(value.split(DATE_TIME_SEPARATOR)[0], 'yyyy-MM-dd', new Date())

  return isValid(date) ? date : undefined
}

function matchesSearch(search: string, values: Array<string | null | undefined>) {
  const query = search.trim().toLowerCase()

  if (!query)
    return true

  return values.some(value => value?.toLowerCase().includes(query))
}

function toUpdateInput(values: AptmUpFormValue): UpdateAppointmentInput {
  return {
    appointment_date: values.appointment_date,
    doctor_id: values.doctor_id,
    end_time: values.end_time,
    notes: values.notes,
    patient_id: values.patient_id,
    start_time: values.start_time,
    status: values.status,
  }
}

export default function AppointmentUpdate({ appointment, onUpdated }: Props) {
  const [open, setOpen] = useState(false)
  const [patientSearch, setPatientSearch] = useState('')
  const [doctorSearch, setDoctorSearch] = useState('')
  const id = useId()
  const defaults: AptmUpFormInput = {
    appointment_date: appointment.appointment_date,
    doctor_id: appointment.doctor?.id ?? '',
    end_time: appointment.end_time,
    id: appointment.id,
    notes: appointment.notes ?? '',
    patient_id: appointment.patient?.id ?? '',
    start_time: appointment.start_time,
    status: appointment.status,
  }
  const form = useForm<AptmUpFormInput, unknown, AptmUpFormValue>({
    resolver: zodResolver(aptmUpSchema),
    defaultValues: defaults,
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
  const [updateAppointment, { loading }] = useMutation<UpdateAppointmentMutation, UpdateAppointmentMutationVariables>(UPDATE_APPOINTMENT)
  const patientData = patients.data?.patients.data
  const doctorData = doctors.data?.doctors.data
  const patientOptions = useMemo(() => patientData ?? [], [patientData])
  const doctorOptions = useMemo(() => doctorData ?? [], [doctorData])
  const filteredPatientOptions = useMemo(() => (
    patientOptions.filter(patient => matchesSearch(patientSearch, [patient.name, patient.phone, patient.email, patient.symptom]))
  ), [patientOptions, patientSearch])
  const filteredDoctorOptions = useMemo(() => (
    doctorOptions.filter(doctor => matchesSearch(doctorSearch, [doctor.userName, doctor.email, doctor.specialization, doctor.department?.name]))
  ), [doctorOptions, doctorSearch])
  const { errors, isSubmitting } = form.formState
  const busy = loading || isSubmitting

  const resetDialog = () => {
    form.reset(defaults)
    setPatientSearch('')
    setDoctorSearch('')
  }

  const onSubmit = async (values: AptmUpFormValue) => {
    let updatedAppointment: UpdateAppointmentMutation['updateAppointment']

    try {
      const response = await updateAppointment({ variables: { id: appointment.id, Input: toUpdateInput(values) } })
      if (!response.data?.updateAppointment) {
        toast.error('Appointment could not be updated. Please try again.')
        return
      }
      updatedAppointment = response.data.updateAppointment
    }
    catch (error) {
      toast.error(getSubmitErrorMessage(error))
      return
    }

    resetDialog()
    setOpen(false)
    toast.success('Appointment updated successfully')

    try {
      await onUpdated?.(updatedAppointment)
    }
    catch {
      toast.error('Appointment was updated, but refreshing failed. Please reload the page.')
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
      <DialogTrigger render={<Button type="button" variant="outline" disabled={busy} />}>Edit</DialogTrigger>
      <DialogContent showCloseButton={!busy}>
        <DialogHeader className="mb-6">
          <DialogTitle>Edit Appointment</DialogTitle>
          <DialogDescription>Update the patient, doctor, schedule, and status.</DialogDescription>
        </DialogHeader>
        <form noValidate onSubmit={form.handleSubmit(onSubmit)}>
          <FieldGroup>
            <Input
              type="search"
              value={patientSearch}
              onChange={event => setPatientSearch(event.target.value)}
              placeholder="Search patients"
              disabled={busy || patients.loading}
            />
            <Controller
              control={form.control}
              name="patient_id"
              render={({ field }) => (
                <Field data-invalid={!!errors.patient_id}>
                  <FieldLabel htmlFor={`${id}-patient`}>Patient</FieldLabel>
                  <Select
                    items={filteredPatientOptions.map(patient => ({ value: patient.id, label: patient.name }))}
                    value={field.value || null}
                    onValueChange={value => field.onChange(value ?? '')}
                    disabled={busy || patients.loading || !filteredPatientOptions.length}
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
                      {filteredPatientOptions.map(patient => (
                        <SelectItem key={patient.id} value={patient.id}>
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
                  {!patients.loading && !patients.error && !filteredPatientOptions.length && (
                    <p className="text-sm text-muted-foreground">No patients match your search.</p>
                  )}
                </Field>
              )}
            />

            <Input
              type="search"
              value={doctorSearch}
              onChange={event => setDoctorSearch(event.target.value)}
              placeholder="Search doctors"
              disabled={busy || doctors.loading}
            />
            <Controller
              control={form.control}
              name="doctor_id"
              render={({ field }) => (
                <Field data-invalid={!!errors.doctor_id}>
                  <FieldLabel htmlFor={`${id}-doctor`}>Doctor</FieldLabel>
                  <Select
                    items={filteredDoctorOptions.map(doctor => ({ value: doctor.id, label: doctor.userName }))}
                    value={field.value || null}
                    onValueChange={value => field.onChange(value ?? '')}
                    disabled={busy || doctors.loading || !filteredDoctorOptions.length}
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
                      {filteredDoctorOptions.map(doctor => (
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
                  {!doctors.loading && !doctors.error && !filteredDoctorOptions.length && (
                    <p className="text-sm text-muted-foreground">No doctors match your search.</p>
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
                {busy ? 'Updating...' : 'Update Appointment'}
              </Button>
            </div>
          </FieldGroup>
        </form>
      </DialogContent>
    </Dialog>
  )
}
