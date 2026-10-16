import type { CreateAppointmentInput, CreateAppointmentMutation, CreateAppointmentMutationVariables, CreatePatientInput, CreatePatientMutation, CreatePatientMutationVariables, DoctorsQuery, DoctorsQueryVariables } from '~/gql/graphql'
import { useMutation, useQuery } from '@apollo/client'
import { useState } from 'react'
import { toast } from 'sonner'
import { Button } from '~/components/ui/button'
import { Field, FieldError, FieldGroup, FieldLabel } from '~/components/ui/field'
import { Input } from '~/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '~/components/ui/select'
import { Textarea } from '~/components/ui/textarea'
import { AppointmentStatus, District, Gender, MaritalStatus } from '~/gql/graphql'
import { CREATE_APPOINTMENT } from '~/graphql/mutation/create-appointment'
import { CREATE_PATIENT } from '~/graphql/mutation/create-patient'
import { DOCTORS_QUERY } from '~/graphql/query/doctors'
import getSubmitErrorMessage from '~/lib/get-submit-error-message'
import { submitAppointmentRequest } from './appointment-request'

const WORD_START_REGEX = /\b\w/g

const label = (value: string) => value.toLowerCase().replaceAll('_', ' ').replace(WORD_START_REGEX, character => character.toUpperCase())
const withSeconds = (time: string) => time.length === 5 ? `${time}:00` : time

function EnumSelect({ id, name, values, placeholder }: { id: string, name: string, values: Record<string, string>, placeholder: string }) {
  return (
    <Select name={name} required>
      <SelectTrigger id={id} className="w-full"><SelectValue placeholder={placeholder} /></SelectTrigger>
      <SelectContent>{Object.values(values).map(value => <SelectItem key={value} value={value}>{label(value)}</SelectItem>)}</SelectContent>
    </Select>
  )
}

export default function CreateAppointmentPublic() {
  const [patientId, setPatientId] = useState<string>()
  const doctors = useQuery<DoctorsQuery, DoctorsQueryVariables>(DOCTORS_QUERY, { variables: { filter: {}, first: 100, page: 1 }, fetchPolicy: 'cache-and-network' })
  const [createPatient, patient] = useMutation<CreatePatientMutation, CreatePatientMutationVariables>(CREATE_PATIENT)
  const [createAppointment, appointment] = useMutation<CreateAppointmentMutation, CreateAppointmentMutationVariables>(CREATE_APPOINTMENT)
  const doctorOptions = doctors.data?.doctors.data ?? []
  const busy = doctors.loading || patient.loading || appointment.loading

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const element = event.currentTarget
    const data = new FormData(element)
    const value = (name: string) => String(data.get(name) ?? '').trim()
    const startTime = value('start_time')
    const endTime = value('end_time')
    if (endTime <= startTime) {
      toast.error('End time must be after the start time.')
      return
    }

    let savedPatientId = patientId
    const patientInput: CreatePatientInput = {
      abha_id: value('abha_id') || undefined,
      address: value('address'),
      date_of_birth: `${value('date_of_birth')}T00:00:00.000Z`,
      district: value('district') as District,
      email: value('email'),
      gender: value('gender') as Gender,
      marital_status: value('marital_status') as MaritalStatus,
      name: value('name'),
      phone: value('phone'),
      weight: value('weight') || undefined,
    }
    const appointmentInput: Omit<CreateAppointmentInput, 'patient_id'> = {
      appointment_date: value('appointment_date'),
      doctor_id: value('doctor_id'),
      end_time: withSeconds(endTime),
      notes: value('notes') || undefined,
      reason_for_visit: value('reason_for_visit'),
      start_time: withSeconds(startTime),
      status: AppointmentStatus.Scheduled,
    }

    try {
      await submitAppointmentRequest({
        appointmentInput,
        createAppointment: async (input) => {
          const response = await createAppointment({ variables: { Input: input } })
          if (!response.data?.createAppointment)
            throw new Error('Appointment could not be created.')
        },
        createPatient: async (input) => {
          const response = await createPatient({ variables: { input } })
          if (!response.data?.createPatient)
            throw new Error('Your details could not be saved.')
          return response.data.createPatient
        },
        onPatientCreated: (id) => {
          savedPatientId = id
          setPatientId(id)
        },
        patientId,
        patientInput,
      })
      setPatientId(undefined)
      element.reset()
      toast.success('Your appointment request has been submitted.')
    }
    catch (error) {
      toast.error(savedPatientId ? 'Your details were saved, but the appointment could not be submitted. Please try again.' : getSubmitErrorMessage(error))
    }
  }

  return (
    <main className="
      min-h-screen bg-muted/30 px-4 py-10
      sm:px-6
    "
    >
      <section className="
        mx-auto max-w-3xl rounded-xl border bg-background p-6 shadow-sm
        sm:p-8
      "
      >
        <header className="mb-8">
          <h1 className="text-2xl font-semibold">Request an appointment</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Complete your details and select a preferred time.
          </p>
        </header>
        <form onSubmit={onSubmit}>
          <FieldGroup>
            <fieldset className="
              grid gap-5
              sm:grid-cols-2
            "
            >
              <legend className="col-span-full font-medium">Your details</legend>
              <Field>
                <FieldLabel htmlFor="name">Full name</FieldLabel>
                <Input id="name" name="name" required />
              </Field>
              <Field>
                <FieldLabel htmlFor="phone">Phone number</FieldLabel>
                <Input id="phone" name="phone" type="tel" required />
              </Field>
              <Field>
                <FieldLabel htmlFor="email">Email address</FieldLabel>
                <Input id="email" name="email" type="email" required />
              </Field>
              <Field>
                <FieldLabel htmlFor="date-of-birth">Date of birth</FieldLabel>
                <Input id="date-of-birth" name="date_of_birth" type="date" required />
              </Field>
              <Field>
                <FieldLabel htmlFor="gender">Gender</FieldLabel>
                <EnumSelect id="gender" name="gender" values={Gender} placeholder="Select gender" />
              </Field>
              <Field>
                <FieldLabel htmlFor="marital-status">Marital status</FieldLabel>
                <EnumSelect id="marital-status" name="marital_status" values={MaritalStatus} placeholder="Select marital status" />
              </Field>
              <Field>
                <FieldLabel htmlFor="district">District</FieldLabel>
                <EnumSelect id="district" name="district" values={District} placeholder="Select district" />
              </Field>
              <Field>
                <FieldLabel htmlFor="weight">Weight (optional)</FieldLabel>
                <Input id="weight" name="weight" />
              </Field>
              <Field className="sm:col-span-2">
                <FieldLabel htmlFor="address">Address</FieldLabel>
                <Textarea id="address" name="address" required />
              </Field>
              <Field className="sm:col-span-2">
                <FieldLabel htmlFor="abha-id">ABHA ID (optional)</FieldLabel>
                <Input id="abha-id" name="abha_id" />
              </Field>
            </fieldset>
            <fieldset className="
              grid gap-5
              sm:grid-cols-2
            "
            >
              <legend className="col-span-full font-medium">Appointment details</legend>
              <Field className="sm:col-span-2" data-invalid={!!doctors.error}>
                <FieldLabel htmlFor="doctor">Doctor</FieldLabel>
                <Select name="doctor_id" required disabled={busy || !doctorOptions.length}>
                  <SelectTrigger id="doctor" className="w-full"><SelectValue placeholder={doctors.loading ? 'Loading doctors...' : 'Select a doctor'} /></SelectTrigger>
                  <SelectContent>
                    {doctorOptions.map(doctor => (
                      <SelectItem key={doctor.id} value={doctor.id}>
                        {doctor.userName}
                        {doctor.department?.name ? ` — ${doctor.department.name}` : ''}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FieldError errors={[doctors.error ? { message: 'Doctors could not be loaded. Please refresh and try again.' } : undefined]} />
              </Field>
              <Field>
                <FieldLabel htmlFor="appointment-date">Preferred date</FieldLabel>
                <Input id="appointment-date" name="appointment_date" type="date" required />
              </Field>
              <Field>
                <FieldLabel htmlFor="start-time">Start time</FieldLabel>
                <Input id="start-time" name="start_time" type="time" required />
              </Field>
              <Field>
                <FieldLabel htmlFor="end-time">End time</FieldLabel>
                <Input id="end-time" name="end_time" type="time" required />
              </Field>
              <Field>
                <FieldLabel htmlFor="reason">Reason for visit</FieldLabel>
                <Input id="reason" name="reason_for_visit" required />
              </Field>
              <Field className="sm:col-span-2">
                <FieldLabel htmlFor="notes">Additional notes (optional)</FieldLabel>
                <Textarea id="notes" name="notes" />
              </Field>
            </fieldset>
            <Button
              type="submit"
              disabled={busy || !!doctors.error || !doctorOptions.length}
              className="
                w-full
                sm:w-auto
              "
            >
              {patient.loading || appointment.loading ? 'Submitting request...' : 'Submit appointment request'}
            </Button>
          </FieldGroup>
        </form>
      </section>
    </main>
  )
}
