import type { PublicDoctor } from './route'
import type { NewPublicPatientInput, RequestPublicBookingOtpMutation, RequestPublicBookingOtpMutationVariables, SubmitPublicBookingMutation, SubmitPublicBookingMutationVariables, VerifyPublicBookingOtpMutation, VerifyPublicBookingOtpMutationVariables } from '~/gql/graphql'
import { gql, useMutation, useQuery } from '@apollo/client'
import { format, parseISO } from 'date-fns'
import { MessageCircleWarning } from 'lucide-react'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { Button } from '~/components/ui/button'
import { Field, FieldGroup, FieldLabel } from '~/components/ui/field'
import { Input } from '~/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '~/components/ui/select'
import { Textarea } from '~/components/ui/textarea'
import { District, Gender, MaritalStatus } from '~/gql/graphql'
import { CREATE_PUBLIC_BOOKING_OTP } from '~/graphql/mutation/create-booking-request-otp'
import { SUBMIT_PUBLIC_BOOKING } from '~/graphql/mutation/submit-public-booking'
import { VERIFY_PUBLIC_BOOKING_OTP } from '~/graphql/mutation/verify-public-booking-otp'
import getSubmitErrorMessage from '~/lib/get-submit-error-message'

const WORD_START_REGEX = /\b\w/g
const TIMEZONE_SUFFIX_REGEX = /(?:Z|[+-]\d{2}:?\d{2})$/i
const label = (value: string) => value.toLowerCase().replaceAll('_', ' ').replace(WORD_START_REGEX, character => character.toUpperCase())
const PUBLIC_BOOKING_SLOTS = gql(`
  query publicBookingAvailableSlots($doctor_id: ID!, $date: Date!) {
    publicBookingAvailableSlots(doctor_id: $doctor_id, date: $date) { start end }
  }
`)
const PUBLIC_BOOKING_DUTY_DATES = gql(`
  query publicBookingDutyDates($doctor_id: ID!) {
    publicBookingDutyDates(doctor_id: $doctor_id)
  }
`)

function localTime(utc: string) {
  const normalized = utc.replace(' ', 'T')
  const timestamp = TIMEZONE_SUFFIX_REGEX.test(normalized) ? normalized : `${normalized}Z`
  return new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Asia/Kolkata',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hourCycle: 'h23',
  }).format(new Date(timestamp))
}

function displayTime(utc: string) {
  const [hour, minute] = localTime(utc).split(':').map(Number)
  return `${hour % 12 || 12}:${String(minute).padStart(2, '0')} ${hour < 12 ? 'AM' : 'PM'}`
}

function availableTimeRanges(slots: { start: string, end: string }[]) {
  const ordered = [...slots].sort((first, second) => first.start.localeCompare(second.start))
  return ordered.reduce<{ start: string, end: string }[]>((ranges, slot) => {
    const last = ranges.at(-1)
    if (last && slot.start <= last.end) {
      if (slot.end > last.end)
        last.end = slot.end
    }
    else {
      ranges.push({ ...slot })
    }
    return ranges
  }, [])
}

function EnumSelect({ id, name, values, placeholder }: { id: string, name: string, values: Record<string, string>, placeholder: string }) {
  return (
    <Select name={name} required>
      <SelectTrigger id={id} className="w-full"><SelectValue placeholder={placeholder} /></SelectTrigger>
      <SelectContent>{Object.values(values).map(value => <SelectItem key={value} value={value}>{label(value)}</SelectItem>)}</SelectContent>
    </Select>
  )
}

export default function CreateAppointmentPublic({ doctor, onChangeDoctor }: { doctor: PublicDoctor, onChangeDoctor: () => void }) {
  const [challengeId, setChallengeId] = useState('')
  const [bookingToken, setBookingToken] = useState('')
  const [phone, setPhone] = useState('')
  const [otpPatient, setOtpPatient] = useState<NewPublicPatientInput | null>(null)
  const [resendAvailableAt, setResendAvailableAt] = useState(0)
  const [now, setNow] = useState(() => Date.now())
  const [appointmentDate, setAppointmentDate] = useState('')
  const resendSeconds = Math.max(0, Math.ceil((resendAvailableAt - now) / 1000))
  const dutyDates = useQuery<{ publicBookingDutyDates: string[] }>(PUBLIC_BOOKING_DUTY_DATES, {
    variables: { doctor_id: doctor.id },
    skip: !bookingToken,
    fetchPolicy: 'network-only',
  })
  const slots = useQuery<{ publicBookingAvailableSlots: { start: string, end: string }[] }>(PUBLIC_BOOKING_SLOTS, {
    variables: { doctor_id: doctor.id, date: appointmentDate },
    skip: !bookingToken || !appointmentDate,
    fetchPolicy: 'network-only',
  })
  const [requestOtp, request] = useMutation<RequestPublicBookingOtpMutation, RequestPublicBookingOtpMutationVariables>(CREATE_PUBLIC_BOOKING_OTP)
  const [verifyOtp, verify] = useMutation<VerifyPublicBookingOtpMutation, VerifyPublicBookingOtpMutationVariables>(VERIFY_PUBLIC_BOOKING_OTP)
  const [submitBooking, booking] = useMutation<SubmitPublicBookingMutation, SubmitPublicBookingMutationVariables>(SUBMIT_PUBLIC_BOOKING)

  useEffect(() => {
    if (!challengeId || bookingToken || !resendSeconds)
      return

    const timer = window.setInterval(() => setNow(Date.now()), 1000)
    return () => window.clearInterval(timer)
  }, [bookingToken, challengeId, resendSeconds])

  async function sendOtp(patient: NewPublicPatientInput) {
    try {
      const response = await requestOtp({ variables: { input: { department_id: doctor.department.id, patient } } })
      const challenge = response.data?.requestPublicBookingOtp
      if (!challenge)
        throw new Error('Could not create an OTP challenge.')
      setOtpPatient(patient)
      setPhone(patient.phone)
      setChallengeId(challenge.challenge_id)
      const sentAt = Date.now()
      setNow(sentAt)
      setResendAvailableAt(sentAt + 60_000)
      toast.success('Development code saved in public_booking_challenges. Read it in DBeaver.')
    }
    catch (error) {
      toast.error(getSubmitErrorMessage(error))
    }
  }

  async function onRequestOtp(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const data = new FormData(event.currentTarget)
    const value = (name: string) => String(data.get(name) ?? '').trim()
    const patient: NewPublicPatientInput = {
      abha_id: value('abha_id') || undefined,
      address: value('address'),
      date_of_birth: `${value('date_of_birth')} 00:00:00`,
      district: value('district') as District,
      email: value('email'),
      gender: value('gender') as Gender,
      marital_status: value('marital_status') as MaritalStatus,
      name: value('name'),
      phone: value('phone'),
      weight: value('weight') || undefined,
    }
    await sendOtp(patient)
  }

  async function onResendOtp() {
    if (otpPatient && !resendSeconds)
      await sendOtp(otpPatient)
  }

  async function onVerifyOtp(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const code = String(new FormData(event.currentTarget).get('code') ?? '').trim()
    try {
      const response = await verifyOtp({ variables: { input: { challenge_id: challengeId, code } } })
      const token = response.data?.verifyPublicBookingOtp.booking_token
      if (!token)
        throw new Error('The code could not be verified.')
      setBookingToken(token)
      toast.success('Phone verified. Choose a duty date.')
    }
    catch (error) {
      toast.error(getSubmitErrorMessage(error))
    }
  }

  async function onSubmitBooking(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const data = new FormData(event.currentTarget)
    const value = (name: string) => String(data.get(name) ?? '').trim()
    if (!dutyDates.data?.publicBookingDutyDates.includes(appointmentDate)) {
      toast.error('Choose an available duty date.')
      return
    }
    const selectedSlot = slots.data?.publicBookingAvailableSlots[0]
    if (!selectedSlot) {
      toast.error('No appointment is available on this duty date.')
      return
    }
    try {
      const response = await submitBooking({ variables: { input: {
        challenge_id: challengeId,
        booking_token: bookingToken,
        doctor_id: doctor.id,
        appointment_date: appointmentDate,
        start_time: localTime(selectedSlot.start),
        end_time: localTime(selectedSlot.end),
        reason_for_visit: value('reason_for_visit'),
        notes: value('notes') || undefined,
      } } })
      if (!response.data?.submitPublicBooking)
        throw new Error('Appointment could not be submitted.')
      setChallengeId('')
      setBookingToken('')
      toast.success('Your appointment request has been submitted.')
    }
    catch (error) {
      toast.error(getSubmitErrorMessage(error))
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
            With
            {' '}
            {doctor.userName}
            {' '}
            in
            {doctor.department.name}
            . Verify your phone, then choose a duty date.
          </p>
          <Button type="button" variant="outline" className="mt-4" onClick={onChangeDoctor}>Change doctor</Button>
        </header>
        {!challengeId && (
          <form onSubmit={onRequestOtp}>
            <FieldGroup>
              <p className="font-medium">Your details</p>
              <div className="
                grid gap-5
                sm:grid-cols-2
              "
              >
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
              </div>
              <Button type="submit" disabled={request.loading}>{request.loading ? 'Creating code...' : 'Get verification code'}</Button>
            </FieldGroup>
          </form>
        )}
        {challengeId && !bookingToken && (
          <form key={challengeId} onSubmit={onVerifyOtp}>
            <FieldGroup>
              <p className="text-sm text-muted-foreground">
                Enter the code sent to
                {' '}
                {phone}
                .
              </p>
              <Field>
                <FieldLabel htmlFor="code">Verification code</FieldLabel>
                <Input id="code" name="code" inputMode="numeric" pattern="[0-9]{6}" maxLength={6} required />
              </Field>
              <Button type="submit" disabled={verify.loading}>{verify.loading ? 'Verifying...' : 'Verify phone'}</Button>
              <Button type="button" variant="outline" disabled={request.loading || verify.loading || !!resendSeconds} onClick={onResendOtp}>
                {request.loading ? 'Sending code...' : resendSeconds ? `Resend code in ${resendSeconds}s` : 'Resend OTP code'}
              </Button>
            </FieldGroup>
          </form>
        )}
        {!!bookingToken && (
          <form onSubmit={onSubmitBooking}>
            <FieldGroup>
              <p className="font-medium">Appointment details</p>
              <Field>
                <FieldLabel htmlFor="appointment-date">Duty date</FieldLabel>
                <p className="text-sm text-muted-foreground">An available appointment time will be assigned automatically.</p>
                <Select name="appointment_date" value={appointmentDate} onValueChange={value => setAppointmentDate(String(value))} required>
                  <SelectTrigger id="appointment-date" className="w-full"><SelectValue placeholder="Choose a duty date" /></SelectTrigger>
                  <SelectContent>
                    {dutyDates.data?.publicBookingDutyDates.map(date => (
                      <SelectItem key={date} value={date}>{format(parseISO(date), 'PPP')}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {dutyDates.loading && <p role="status">Loading duty dates...</p>}
                {dutyDates.error && <p role="alert">Could not load duty dates. Please try again.</p>}
                {!dutyDates.loading && !dutyDates.error && !dutyDates.data?.publicBookingDutyDates.length && <p role="status">No upcoming duty dates are available.</p>}
              </Field>
              {slots.loading && <p role="status">Checking availability...</p>}
              {slots.error && <p role="alert">Could not check availability. Try another date.</p>}
              {appointmentDate && !slots.loading && !slots.error && !slots.data?.publicBookingAvailableSlots.length && <p role="status">No appointments are available on this date.</p>}
              {appointmentDate && !slots.loading && !slots.error && !!slots.data?.publicBookingAvailableSlots.length && (
                <div>
                  <p className="font-medium">Doctor's available times</p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {availableTimeRanges(slots.data.publicBookingAvailableSlots).map(range => (
                      <span
                        key={range.start}
                        className="rounded-md border px-3 py-2 text-sm"
                      >
                        {displayTime(range.start)}
                        {' – '}
                        {displayTime(range.end)}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              <Field>
                <FieldLabel htmlFor="reason">Reason for visit</FieldLabel>
                <Input id="reason" name="reason_for_visit" required />
              </Field>
              <Field>
                <FieldLabel htmlFor="notes">Additional notes (optional)</FieldLabel>
                <Textarea id="notes" name="notes" />
              </Field>
              <span className="
                flex gap-2 rounded-lg border border-blue-400 px-2 py-1 text-sm
                text-blue-700
              "
              >
                <MessageCircleWarning />
                {' '}
                Your request will be reviewed by our team, who will contact you to confirm the final date and time.
              </span>
              <Button type="submit" disabled={booking.loading || dutyDates.loading || !!dutyDates.error || slots.loading || !!slots.error || !slots.data?.publicBookingAvailableSlots.length}>{booking.loading ? 'Submitting...' : 'Submit appointment request'}</Button>
              <Button
                type="button"
                variant="outline"
                disabled={booking.loading}
                onClick={() => {
                  setBookingToken('')
                  setChallengeId('')
                }}
              >
                Start again
              </Button>
            </FieldGroup>
          </form>
        )}
      </section>
    </main>
  )
}
