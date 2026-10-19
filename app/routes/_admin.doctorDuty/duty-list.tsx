import type { ApolloError } from '@apollo/client'
import type { DoctorDutyShiftsQuery } from '~/gql/graphql'
import { format, parseISO } from 'date-fns'
import { CalendarIcon } from 'lucide-react'
import { useState } from 'react'
import { Button } from '~/components/ui/button'
import { Calendar } from '~/components/ui/calendar'
import { Input } from '~/components/ui/input'
import { Popover, PopoverContent, PopoverTrigger } from '~/components/ui/popover'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '~/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '~/components/ui/table'
import getFriendlyErrorMessage from '~/lib/get-friendly-error-message'
import DutyDelete from './duty-delete'
import { groupDutiesByWeek } from './duty-week-groups'
import UpdateDuty from './update-duty'

export type DoctorDuty = DoctorDutyShiftsQuery['doctorDutyShifts']['data'][number]

const DUTY_TIME_REGEX = /^(\d{2}):(\d{2})(?::\d{2})?$/
const ALL_DEPARTMENTS = 'all'

interface Props {
  duties: DoctorDuty[]
  error?: ApolloError
  loading?: boolean
  page?: number
  onPageChange: (page: number) => void
  onDeleted: (id: string) => void | Promise<void>
  onRetry?: () => void
  onUpdated: () => void | Promise<void>
}

function dutyLabel(duty: DoctorDuty) {
  return `${duty.doctor.userName} on ${duty.duty_date}`
}

function formatDutyTime(time: string) {
  const match = DUTY_TIME_REGEX.exec(time)
  if (!match)
    return time

  const hour = Number(match[1])
  return `${hour % 12 || 12}:${match[2]} ${hour < 12 ? 'AM' : 'PM'}`
}

function timeInDuty(time: string, start: string, end: string) {
  const selected = time.slice(0, 5)
  const startTime = start.slice(0, 5)
  const endTime = end.slice(0, 5)

  return startTime <= endTime
    ? selected >= startTime && selected < endTime
    : selected >= startTime || selected < endTime
}

export default function DutyList({ duties, loading = false, error, onRetry, onUpdated, onDeleted }: Props) {
  const [doctorName, setDoctorName] = useState('')
  const [departmentId, setDepartmentId] = useState(ALL_DEPARTMENTS)
  const [todayDate] = useState(() => format(new Date(), 'yyyy-MM-dd'))
  const [dutyDate, setDutyDate] = useState(todayDate)
  const [dateFilterActive, setDateFilterActive] = useState(false)
  const [dateOpen, setDateOpen] = useState(false)
  const [dutyTime, setDutyTime] = useState('')
  const normalizedDoctorName = doctorName.trim().toLowerCase()
  const departments = [...new Map(duties
    .map(duty => duty.doctor.department)
    .filter(department => department != null)
    .map(department => [department.id, department])).values()]
    .sort((first, second) => first.name.localeCompare(second.name))
  const filteredDuties = duties.filter(duty =>
    (!normalizedDoctorName || duty.doctor.userName.toLowerCase().includes(normalizedDoctorName))
    && (departmentId === ALL_DEPARTMENTS || duty.doctor.department?.id === departmentId)
    && (!dateFilterActive || duty.duty_date.slice(0, 10) === dutyDate)
    && (!dutyTime || timeInDuty(dutyTime, duty.start_time, duty.end_time)),
  )
  const weekGroups = groupDutiesByWeek(filteredDuties)
  const hasFilters = !!(doctorName || dateFilterActive || dutyTime || departmentId !== ALL_DEPARTMENTS)

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
                  <div className="flex flex-wrap items-end gap-3">
                    <div className="min-w-48 flex-1 space-y-1">
                      <label
                        htmlFor="duty-doctor-filter"
                        className="text-sm font-medium"
                      >
                        Doctor name
                      </label>
                      <Input
                        id="duty-doctor-filter"
                        value={doctorName}
                        onChange={event => setDoctorName(event.target.value)}
                        placeholder="Search doctor"
                      />
                    </div>
                    <div className="min-w-48 flex-1 space-y-1">
                      <label
                        htmlFor="duty-department-filter"
                        className="text-sm font-medium"
                      >
                        Department
                      </label>
                      <Select
                        items={departments.map(item => ({ value: item.id, label: item.name }))}
                        value={departmentId}
                        onValueChange={value => setDepartmentId(String(value))}
                      >
                        <SelectTrigger
                          id="duty-department-filter"
                          className="w-full"
                        >
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value={ALL_DEPARTMENTS}>All departments</SelectItem>
                          {departments.map(department => (
                            <SelectItem key={department.id} value={department.id}>{department.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="min-w-40 flex-1 space-y-1">
                      <label
                        htmlFor="duty-date-filter"
                        className="text-sm font-medium"
                      >
                        Duty date
                      </label>
                      <Popover open={dateOpen} onOpenChange={setDateOpen}>
                        <PopoverTrigger
                          render={(
                            <Button
                              id="duty-date-filter"
                              type="button"
                              variant="outline"
                              className="w-full justify-start font-normal"
                            />
                          )}
                        >
                          <CalendarIcon className="size-4" />
                          {dutyDate ? format(parseISO(dutyDate), 'PPP') : 'Pick a date'}
                        </PopoverTrigger>
                        <PopoverContent align="start" className="w-auto p-0">
                          <Calendar
                            mode="single"
                            required
                            selected={dutyDate ? parseISO(dutyDate) : undefined}
                            onSelect={(date) => {
                              if (!date)
                                return
                              setDutyDate(format(date, 'yyyy-MM-dd'))
                              setDateFilterActive(true)
                              setDateOpen(false)
                            }}
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                    {hasFilters && (
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                          setDoctorName('')
                          setDepartmentId(ALL_DEPARTMENTS)
                          setDutyDate(todayDate)
                          setDateFilterActive(false)
                          setDutyTime('')
                        }}
                      >
                        Clear filters
                      </Button>
                    )}
                  </div>
                  {filteredDuties.length === 0 && (
                    <p role="status" className="text-sm text-muted-foreground">No duty shifts match these filters.</p>
                  )}
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
                              <TableHead>Duty Timing</TableHead>
                              <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {group.duties.map(duty => (
                              <TableRow key={duty.id}>
                                <TableCell>{format(duty.duty_date, 'd-MMM-yyyy')}</TableCell>
                                <TableCell className="font-medium">{duty.doctor.userName}</TableCell>
                                <TableCell>{duty.doctor.department?.name || 'No department assigned'}</TableCell>
                                <TableCell>{duty.doctor.specialization || 'Not provided'}</TableCell>
                                <TableCell>
                                  {formatDutyTime(duty.start_time)}
                                  {' - '}
                                  {formatDutyTime(duty.end_time)}
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
