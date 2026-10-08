import type { ApolloError } from '@apollo/client'
import type { DoctorDutyShiftsQuery, UpdateDoctorDutyShiftMutation } from '~/gql/graphql'
import { Button } from '~/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '~/components/ui/table'
import getFriendlyErrorMessage from '~/lib/get-friendly-error-message'
import DutyDelete from './duty-delete'
import { groupDutiesByWeek } from './duty-week-groups'
import UpdateDuty from './update-duty'

export type DoctorDuty = DoctorDutyShiftsQuery['doctorDutyShifts']['data'][number]

interface Props {
  duties: DoctorDuty[]
  error?: ApolloError
  loading?: boolean
  page?: number
  onPageChange: (page: number) => void
  onDeleted: (id: string) => void | Promise<void>
  onRetry?: () => void
  onUpdated: (duty: UpdateDoctorDutyShiftMutation['updateDoctorDutyShift']) => void | Promise<void>
}

function dutyLabel(duty: DoctorDuty) {
  return `${duty.doctor.userName} on ${duty.duty_date}`
}

export default function DutyList({ duties, loading = false, error, onRetry, onUpdated, onDeleted }: Props) {
  const weekGroups = groupDutiesByWeek(duties)

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
                  No duty shifts loaded yet. Add a duty shift or monthly schedule to see it here.
                </p>
              )
            : (
                <div className="space-y-6">
                  {weekGroups.map(group => (
                    <section key={group.key} className="space-y-3">
                      <h2 className="text-lg font-semibold">
                        Week:
                        {' '}
                        {group.label}
                      </h2>
                      <div className="rounded-lg border">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Date</TableHead>
                              <TableHead>Doctor</TableHead>
                              <TableHead>Department</TableHead>
                              <TableHead>Specialization</TableHead>
                              <TableHead>Time</TableHead>
                              <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {group.duties.map(duty => (
                              <TableRow key={duty.id}>
                                <TableCell>{duty.duty_date}</TableCell>
                                <TableCell className="font-medium">{duty.doctor.userName}</TableCell>
                                <TableCell>{duty.doctor.department?.name || 'No department assigned'}</TableCell>
                                <TableCell>{duty.doctor.specialization || 'Not provided'}</TableCell>
                                <TableCell>
                                  {duty.start_time}
                                  {' - '}
                                  {duty.end_time}
                                </TableCell>
                                <TableCell>
                                  <div className="flex justify-end gap-2">
                                    <UpdateDuty duty={duty} onUpdated={onUpdated} />
                                    <DutyDelete
                                      duty={{ id: duty.id, label: dutyLabel(duty) }}
                                      onDeleted={() => onDeleted(duty.id)}
                                    />
                                  </div>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    </section>
                  ))}
                </div>
              )}
    </div>
  )
}
