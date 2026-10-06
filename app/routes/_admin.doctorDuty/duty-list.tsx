import type { ApolloError } from '@apollo/client'
import type { UpdateDoctorDutyShiftMutation } from '~/gql/graphql'
import { CalendarDays, Clock } from 'lucide-react'
import { Button } from '~/components/ui/button'
import getFriendlyErrorMessage from '~/lib/get-friendly-error-message'
import { DoctorPhoto } from '../_admin.doctors/doctors-list'
import DutyDelete from './duty-delete'
import UpdateDuty from './update-duty'

export type DoctorDuty = UpdateDoctorDutyShiftMutation['updateDoctorDutyShift']

interface Props {
  duties: DoctorDuty[]
  error?: ApolloError
  loading?: boolean
  onDeleted: (id: string) => void | Promise<void>
  onRetry?: () => void
  onUpdated: (duty: DoctorDuty) => void | Promise<void>
}

function dutyLabel(duty: DoctorDuty) {
  return `${duty.doctor.userName} on ${duty.duty_date}`
}

export default function DutyList({ duties, loading = false, error, onRetry, onUpdated, onDeleted }: Props) {
  return (
    <div className="size-full min-h-120 space-y-6" aria-busy={loading}>

      {loading
        ? (
            <p role="status" className="text-sm text-muted-foreground">Loading duty shifts...</p>
          )
        : error
          ? (
              <div role="alert" className="space-y-3">
                <p className="text-sm text-destructive">
                  {getFriendlyErrorMessage(error, 'Could not load duty shifts. Please try again.')}
                </p>
                {onRetry && <Button type="button" variant="outline" onClick={onRetry}>Try again</Button>}
              </div>
            )
          : duties.length === 0
            ? (
                <p role="status" className="text-sm text-muted-foreground">
                  No duty shifts loaded yet. Add a duty shift to see it here. A backend list query is needed to show saved shifts after refresh.
                </p>
              )
            : (
                <div className="
                  grid w-full grid-cols-1 gap-6
                  sm:grid-cols-2
                  lg:grid-cols-3
                  xl:grid-cols-4
                "
                >
                  {duties.map(duty => (
                    <article key={duty.id} className="rounded-lg border p-4">
                      <div className="space-y-4">
                        <div>
                          <DoctorPhoto url={duty.doctor.image?.path} name={duty.doctor.userName} />
                          <h2 className="text-lg font-semibold">{duty.doctor.userName}</h2>
                          <p className="text-sm text-muted-foreground">
                            {duty.doctor.department?.name || 'No department assigned'}
                          </p>
                        </div>
                        <dl className="space-y-3 text-sm">
                          <div className="flex items-start gap-2">
                            <CalendarDays
                              aria-hidden="true"
                              className="mt-0.5 size-4 text-muted-foreground"
                            />
                            <div>
                              <dt className="text-muted-foreground">Duty Date</dt>
                              <dd>{duty.duty_date}</dd>
                            </div>
                          </div>
                          <div className="flex items-start gap-2">
                            <Clock
                              aria-hidden="true"
                              className="mt-0.5 size-4 text-muted-foreground"
                            />
                            <div>
                              <dt className="text-muted-foreground">Time</dt>
                              <dd>
                                {duty.start_time}
                                {' - '}
                                {duty.end_time}
                              </dd>
                            </div>
                          </div>
                        </dl>
                        <div className="flex gap-2">
                          <UpdateDuty duty={duty} onUpdated={onUpdated} />
                          <DutyDelete
                            duty={{ id: duty.id, label: dutyLabel(duty) }}
                            onDeleted={() => onDeleted(duty.id)}
                          />
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              )}
    </div>
  )
}
