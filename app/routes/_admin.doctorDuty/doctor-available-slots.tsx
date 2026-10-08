import type { DoctorAvailableSlotsQueryVariables, DoctorsQuery, DoctorsQueryVariables } from '~/gql/graphql'
import { useQuery } from '@apollo/client'
import { format, isValid, parse } from 'date-fns'
import { useMemo, useState } from 'react'
import { DOCTORS_QUERY } from '~/graphql/query/doctors'
import getFriendlyErrorMessage from '~/lib/get-friendly-error-message'
import AvailableSlotList from './available-slot-list'
import useGetDoctorAvailableSlots from './use-get-doctor-available-slots'

function todayValue() {
  return format(new Date(), 'yyyy-MM-dd')
}

function isDateValue(value: string) {
  const date = parse(value, 'yyyy-MM-dd', new Date())

  return isValid(date)
}

export default function DoctorAvailableSlots() {
  const [doctorId, setDoctorId] = useState('')
  const [date, setDate] = useState(() => todayValue())
  const [durationMinutes, setDurationMinutes] = useState('30')

  const {
    data: doctorsData,
    loading: doctorsLoading,
    error: doctorsError,
  } = useQuery<DoctorsQuery, DoctorsQueryVariables>(DOCTORS_QUERY, {
    variables: { first: 100, page: 1 },
  })

  const variables = useMemo<DoctorAvailableSlotsQueryVariables | undefined>(() => {
    const duration = Number(durationMinutes)

    if (!doctorId || !isDateValue(date) || !Number.isInteger(duration) || duration <= 0) {
      return undefined
    }

    return {
      date,
      doctor_id: doctorId,
      duration_minutes: duration,
    }
  }, [date, doctorId, durationMinutes])

  const {
    slots,
    loading,
    error,
    refetch,
  } = useGetDoctorAvailableSlots(variables)

  return (
    <section className="space-y-4">
      <div>
        <h2 className="text-lg font-semibold">Available Slots</h2>
        <p className="text-sm text-muted-foreground">Slots returned by doctorAvailableSlots.</p>
      </div>

      <div className="
        grid gap-4
        md:grid-cols-3
      "
      >
        <label className="space-y-2 text-sm font-medium">
          <span>Doctor</span>
          <select
            value={doctorId}
            disabled={doctorsLoading}
            onChange={event => setDoctorId(event.target.value)}
            className="
              h-10 w-full rounded-md border border-input bg-background px-3
              text-sm
              focus-visible:ring-2 focus-visible:ring-ring
              focus-visible:outline-none
            "
          >
            <option value="">{doctorsLoading ? 'Loading doctors...' : 'Select doctor'}</option>
            {doctorsData?.doctors.data.map(doctor => (
              <option key={doctor.id} value={doctor.id}>
                {doctor.userName}
              </option>
            ))}
          </select>
        </label>

        <label className="space-y-2 text-sm font-medium">
          <span>Date</span>
          <input
            type="date"
            value={date}
            onChange={event => setDate(event.target.value)}
            className="
              h-10 w-full rounded-md border border-input bg-background px-3
              text-sm
              focus-visible:ring-2 focus-visible:ring-ring
              focus-visible:outline-none
            "
          />
        </label>

        <label className="space-y-2 text-sm font-medium">
          <span>Duration</span>
          <select
            value={durationMinutes}
            onChange={event => setDurationMinutes(event.target.value)}
            className="
              h-10 w-full rounded-md border border-input bg-background px-3
              text-sm
              focus-visible:ring-2 focus-visible:ring-ring
              focus-visible:outline-none
            "
          >
            <option value="15">15 minutes</option>
            <option value="30">30 minutes</option>
            <option value="45">45 minutes</option>
            <option value="60">60 minutes</option>
          </select>
        </label>
      </div>

      {doctorsError && (
        <p role="alert" className="text-sm text-destructive">
          {getFriendlyErrorMessage(doctorsError, 'Could not load doctors. Please try again.')}
        </p>
      )}

      {!variables
        ? (
            <p role="status" className="text-sm text-muted-foreground">
              Choose a doctor and valid date to see available slots.
            </p>
          )
        : (
            <AvailableSlotList
              slots={slots}
              loading={loading}
              error={error}
              onRetry={() => {
                void refetch().catch(() => {})
              }}
            />
          )}
    </section>
  )
}
