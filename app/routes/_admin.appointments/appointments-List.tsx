import { format, isValid, parse } from 'date-fns'
import { CalendarIcon, SearchIcon, XIcon } from 'lucide-react'
import { useId, useMemo, useState } from 'react'
import AppPagination from '~/components/ui/app-pagination'
import { Button } from '~/components/ui/button'
import { Calendar } from '~/components/ui/calendar'
import { Input } from '~/components/ui/input'
import { Label } from '~/components/ui/label'
import { Popover, PopoverContent, PopoverTrigger } from '~/components/ui/popover'
import useGetAppointments from '~/hooks/use-get-appointments'
import { cn } from '~/lib/utils'
import AppointmentAdd from './appointment-add'
import AppointmentDelete from './appointment-delete'
import { filterAppointments } from './appointment-filters'
import AppointmentUpdate from './appointment-update'

const dateTimeSeparator = /[T ]/

interface DateFilterProps {
  id: string
  label: string
  value: string
  onChange: (value: string) => void
}

function dateFromValue(value: string) {
  if (!value)
    return undefined

  const date = parse(value, 'yyyy-MM-dd', new Date())

  return isValid(date) ? date : undefined
}

function DateFilter({ id, label, value, onChange }: DateFilterProps) {
  const selectedDate = dateFromValue(value)

  return (
    <div className="grid gap-2">
      <Label htmlFor={id}>{label}</Label>
      <Popover>
        <PopoverTrigger
          render={(
            <Button
              id={id}
              type="button"
              variant="outline"
              className={cn(
                'w-full justify-start text-left font-normal',
                !value && 'text-muted-foreground',
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
              onChange(date ? format(date, 'yyyy-MM-dd') : '')
            }}
          />
        </PopoverContent>
      </Popover>
    </div>
  )
}

function hasFilters(search: string, startDay: string, endDay: string) {
  return !!(search.trim() || startDay || endDay)
}

export default function AppointmentsList() {
  const id = useId()
  const [currentPage, setCurrentPage] = useState(1)
  const [search, setSearch] = useState('')
  const [startDay, setStartDay] = useState('')
  const [endDay, setEndDay] = useState('')
  const { appointments, paginationInfo, error, loading, refetch } = useGetAppointments({ filter: {}, first: 12, page: currentPage })

  const filteredAppointments = useMemo(() => (
    filterAppointments(appointments, { endDay, search, startDay })
  ), [appointments, endDay, search, startDay])
  const filtersActive = hasFilters(search, startDay, endDay)

  const lastPage = paginationInfo?.lastPage ?? 0

  const refreshAppointments = async () => {
    await refetch()
  }

  return (
    <div className="size-full min-h-190 space-y-6" aria-busy={loading}>
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-2xl font-semibold">Appointments</h1>
        <AppointmentAdd onCreated={refreshAppointments} />
      </div>
      <div className="
        grid gap-4 rounded-lg border p-4
        md:grid-cols-2
        xl:grid-cols-[minmax(14rem,1fr)_minmax(12rem,14rem)_minmax(12rem,14rem)_auto]
      "
      >
        <div className="grid gap-2">
          <Label htmlFor={`${id}-search`}>Search</Label>
          <div className="relative">
            <SearchIcon className="
              absolute top-1/2 left-3 size-4 -translate-y-1/2
              text-muted-foreground
            "
            />
            <Input
              id={`${id}-search`}
              type="search"
              value={search}
              onChange={(event) => {
                setSearch(event.target.value)
                setCurrentPage(1)
              }}
              placeholder="Search appointments"
              className="pl-9"
            />
          </div>
        </div>
        <DateFilter
          id={`${id}-start-day`}
          label="Start day"
          value={startDay}
          onChange={(value) => {
            setStartDay(value)
            setCurrentPage(1)
          }}
        />
        <DateFilter
          id={`${id}-end-day`}
          label="End day"
          value={endDay}
          onChange={(value) => {
            setEndDay(value)
            setCurrentPage(1)
          }}
        />
        <div className="flex items-end">
          <Button
            type="button"
            variant="outline"
            disabled={loading || !filtersActive}
            className="w-full"
            onClick={() => {
              setSearch('')
              setStartDay('')
              setEndDay('')
              setCurrentPage(1)
            }}
          >
            <XIcon className="size-4" />
            Clear
          </Button>
        </div>
      </div>

      {loading && (
        <p role="status" className="text-sm text-muted-foreground">Loading appointments...</p>
      )}
      {error && (
        <p role="alert" className="text-sm text-destructive">Could not load appointments.</p>
      )}
      {!loading && !error && appointments.length === 0 && (
        <p role="status" className="text-sm text-muted-foreground">No appointments loaded yet.</p>
      )}
      {!loading && !error && appointments.length !== 0 && filteredAppointments.length === 0 && (
        <p role="status" className="text-sm text-muted-foreground">No appointments match your filters.</p>
      )}

      {!loading && !error && filteredAppointments.length !== 0 && (
        <div className="
          grid w-full grid-cols-1 gap-6
          sm:grid-cols-2
          lg:grid-cols-3
          xl:grid-cols-5
        "
        >
          {filteredAppointments.map(aptms => (
            <article
              key={aptms.id}
              className="space-y-3 rounded-lg border p-4 wrap-break-word"
            >
              <dl className="border-b-2">
                <dt>Doctor</dt>
                <h3 className="text-lg font-semibold">{aptms.doctor?.userName}</h3>
                <dt>Department</dt>
                <h3 className="text-lg font-semibold">{aptms.doctor?.department?.name}</h3>
              </dl>
              <dl className="space-y-3 text-sm">
                <div>
                  <dt className="text-muted-foreground">Patient Name</dt>
                  <dd>{aptms.patient?.name?.trim() || 'Not provided'}</dd>
                </div>
                <div>
                  <dt className="text-muted-foreground">Symptom</dt>
                  <dd>{aptms.patient?.symptom?.trim() || 'Not provided'}</dd>
                </div>
                <div>
                  <dt className="text-muted-foreground">Email</dt>
                  <dd>{aptms.patient?.email?.trim() || 'Not provided'}</dd>
                </div>
                <div>
                  <dt className="text-muted-foreground">Phone</dt>
                  <dd>{aptms.patient?.phone?.trim() || 'Not provided'}</dd>
                </div>
                <div>
                  <dt className="text-muted-foreground">Gender</dt>
                  <dd>{aptms.patient?.gender || 'Not provided'}</dd>
                </div>
                <div>
                  <dt className="text-muted-foreground">Date of birth</dt>
                  <dd>{aptms.patient?.date_of_birth?.split(dateTimeSeparator)[0] || 'Not provided'}</dd>
                </div>
                <div>
                  <dt className="text-muted-foreground">Appointment</dt>
                  <dd>{aptms.appointment_date?.replace('T', ' ') || 'Not scheduled'}</dd>
                </div>
                <div>
                  <dt className="text-muted-foreground">Duration</dt>
                  <dd>
                    {aptms.duration_minutes}
                    {' '}
                    minutes
                  </dd>
                </div>
                <div>
                  <dt className="text-muted-foreground">Status</dt>
                  <dd>{aptms.status || 'Not provided'}</dd>
                </div>
                <div>
                  <dt className="text-muted-foreground">Notes</dt>
                  <dd>{aptms.notes?.trim() || 'No notes'}</dd>
                </div>
              </dl>
              <div className="flex gap-2">
                <AppointmentUpdate appointment={aptms} onUpdated={refreshAppointments} />
                <AppointmentDelete
                  aptm={{ id: aptms.id, name: `${aptms.patient?.name ?? 'appointment'} with ${aptms.doctor?.userName ?? 'doctor'}` }}
                  onDeleted={refreshAppointments}
                />
              </div>
            </article>
          ))}
        </div>
      )}
      {lastPage > 1 && filteredAppointments.length > 0 && (
        <AppPagination
          currentPage={currentPage}
          lastPage={lastPage}
          handlePagePagination={(page) => {
            if (page !== currentPage) {
              setCurrentPage(page)
            }
          }}
        />
      )}
    </div>
  )
}
