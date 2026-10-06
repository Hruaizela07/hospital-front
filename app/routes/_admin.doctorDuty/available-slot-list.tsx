import type { ApolloError } from '@apollo/client'
import type { DoctorAvailableSlotsQuery } from '~/gql/graphql'
import { CalendarDays, Clock } from 'lucide-react'
import { Button } from '~/components/ui/button'
import getFriendlyErrorMessage from '~/lib/get-friendly-error-message'
import { DoctorPhoto } from '../_admin.doctors/doctors-list'

export type AppointmentSlot = DoctorAvailableSlotsQuery['doctorAvailableSlots']['data'][number]

interface Props {
  error?: ApolloError
  loading?: boolean
  onRetry?: () => void
  slots: AppointmentSlot[]
}

export default function AvailableSlotList({ slots, loading = false, error, onRetry }: Props) {
  if (loading) {
    return <p role="status" className="text-sm text-muted-foreground">Loading available slots...</p>
  }

  if (error) {
    return (
      <div role="alert" className="space-y-3">
        <p className="text-sm text-destructive">
          {getFriendlyErrorMessage(error, 'Could not load available slots. Please try again.')}
        </p>
        {onRetry && <Button type="button" variant="outline" onClick={onRetry}>Try again</Button>}
      </div>
    )
  }

  if (slots.length === 0) {
    return (
      <p role="status" className="text-sm text-muted-foreground">
        No available slots found for this doctor and date.
      </p>
    )
  }

  return (
    <div className="
      grid w-full grid-cols-1 gap-6
      sm:grid-cols-2
      lg:grid-cols-3
      xl:grid-cols-4
    "
    >
      {slots.map(slot => (
        <article
          key={`${slot.doctor_id}-${slot.start}-${slot.end}`}
          className="rounded-lg border p-4"
        >
          <div className="space-y-4">
            <div>
              <DoctorPhoto url={slot.doctor?.image?.path} name={slot.doctor?.userName ?? 'Doctor'} />
              <h2 className="text-lg font-semibold">{slot.doctor?.userName ?? 'Doctor'}</h2>
              <p className="text-sm text-muted-foreground">
                {slot.doctor?.department?.name || 'No department assigned'}
              </p>
            </div>
            <dl className="space-y-3 text-sm">
              <div className="flex items-start gap-2">
                <CalendarDays
                  aria-hidden="true"
                  className="mt-0.5 size-4 text-muted-foreground"
                />
                <div>
                  <dt className="text-muted-foreground">Duration</dt>
                  <dd>
                    {slot.duration_minutes}
                    {' '}
                    minutes
                  </dd>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <Clock
                  aria-hidden="true"
                  className="mt-0.5 size-4 text-muted-foreground"
                />
                <div>
                  <dt className="text-muted-foreground">Available Time</dt>
                  <dd>
                    {slot.start}
                    {' - '}
                    {slot.end}
                  </dd>
                </div>
              </div>
            </dl>
          </div>
        </article>
      ))}
    </div>
  )
}
