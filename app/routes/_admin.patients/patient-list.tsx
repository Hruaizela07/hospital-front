import type { PatientFilterInput } from '~/gql/graphql'
import { format, isValid, parse } from 'date-fns'
import { CalendarIcon, SearchIcon, XIcon } from 'lucide-react'
import { useId, useMemo, useState } from 'react'
import { Button } from '~/components/ui/button'
import { Calendar } from '~/components/ui/calendar'
import { Input } from '~/components/ui/input'
import { Label } from '~/components/ui/label'
import { Popover, PopoverContent, PopoverTrigger } from '~/components/ui/popover'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '~/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '~/components/ui/table'
import useGetAppointments from '~/hooks/use-get-appointments'
import useGetDepartments from '~/hooks/use-get-departments'
import useGetPatients from '~/hooks/use-get-patients'
import getFriendlyErrorMessage from '~/lib/get-friendly-error-message'
import { cn } from '~/lib/utils'

const dateTimeSeparator = /[T ]/
const allDepartmentsValue = 'all'

interface PatientFilterForm {
  departmentId: string
  fromDate: string
  search: string
  toDate: string
}

interface DateFilterProps {
  id: string
  label: string
  value: string
  onChange: (value: string) => void
}

const emptyFilters: PatientFilterForm = {
  departmentId: '',
  fromDate: '',
  search: '',
  toDate: '',
}

function dateFromValue(value: string) {
  if (!value)
    return undefined

  const date = parse(value, 'yyyy-MM-dd', new Date())

  return isValid(date) ? date : undefined
}

function toPatientFilter(filters: PatientFilterForm): PatientFilterInput {
  const search = filters.search.trim()

  return {
    ...(filters.departmentId ? { department_id: filters.departmentId } : {}),
    ...(filters.fromDate ? { fromDate: filters.fromDate } : {}),
    ...(search ? { search } : {}),
    ...(filters.toDate ? { toDate: filters.toDate } : {}),
  }
}

function hasFilters(filters: PatientFilterForm) {
  return !!(filters.departmentId || filters.fromDate || filters.search.trim() || filters.toDate)
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

function PatientAppointmentDate({ patientId }: { patientId: string }) {
  const { appointments, error, loading } = useGetAppointments({
    filter: { patient_id: patientId },
    first: 1,
    page: 1,
  })
  const appointmentDate = appointments[0]?.appointment_date

  if (loading)
    return <span className="text-muted-foreground">Loading...</span>

  if (error)
    return <span className="text-muted-foreground">Unavailable</span>

  return appointmentDate?.split(dateTimeSeparator)[0] || 'Not scheduled'
}

export default function PatientList() {
  const id = useId()
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [draftFilters, setDraftFilters] = useState<PatientFilterForm>(emptyFilters)
  const [appliedFilters, setAppliedFilters] = useState<PatientFilterForm>(emptyFilters)
  const departments = useGetDepartments({ first: 100, page: 1 })

  const patientFilter = useMemo(() => toPatientFilter(appliedFilters), [appliedFilters])
  const departmentOptions = departments.data?.departments.data ?? []
  const filtersActive = hasFilters(appliedFilters)
  const { patients, paginationInfo, error, loading, refetch } = useGetPatients({ filter: patientFilter, first: 10, page })
  const lastPage = Math.max(1, paginationInfo?.lastPage ?? page)

  return (
    <div className="size-full min-h-190 space-y-6" aria-busy={loading}>
      <form
        className="
          grid gap-4 rounded-lg border p-4
          md:grid-cols-2
          xl:grid-cols-[minmax(14rem,1fr)_minmax(12rem,16rem)_minmax(12rem,14rem)_minmax(12rem,14rem)_auto]
        "
        onSubmit={(event) => {
          event.preventDefault()
          setAppliedFilters(draftFilters)
          setPage(1)
        }}
      >
        <div className="grid gap-2">
          <Label htmlFor={`${id}-search`}>Search</Label>
          <Input
            id={`${id}-search`}
            type="search"
            value={search}
            onChange={(event) => {
              setDraftFilters(current => ({ ...current, search: event.target.value }))
              setSearch(event.target.value)
              setPage(1)
            }}
            placeholder="Search appointments"
            className="pl-9"
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor={`${id}-department`}>Department</Label>
          <Select
            items={[
              { value: allDepartmentsValue, label: 'All departments' },
              ...departmentOptions.map(department => ({ value: department.id, label: department.name })),
            ]}
            value={draftFilters.departmentId || allDepartmentsValue}
            onValueChange={(value) => {
              setDraftFilters(current => ({
                ...current,
                departmentId: value === allDepartmentsValue ? '' : value ?? '',
              }))
            }}
            disabled={departments.loading || !departmentOptions.length}
          >
            <SelectTrigger id={`${id}-department`} className="w-full">
              <SelectValue placeholder={departments.loading ? 'Loading departments...' : 'All departments'} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={allDepartmentsValue}>All departments</SelectItem>
              {departmentOptions.map(department => (
                <SelectItem key={department.id} value={department.id}>
                  {department.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <DateFilter
          id={`${id}-from-date`}
          label="From date"
          value={draftFilters.fromDate}
          onChange={(value) => {
            setDraftFilters(current => ({ ...current, fromDate: value }))
          }}
        />
        <DateFilter
          id={`${id}-to-date`}
          label="To date"
          value={draftFilters.toDate}
          onChange={(value) => {
            setDraftFilters(current => ({ ...current, toDate: value }))
          }}
        />
        <div className="flex items-end gap-2">
          <Button type="submit" disabled={loading} className="flex-1">
            <SearchIcon className="size-4" />
            Search
          </Button>
          <Button
            type="button"
            variant="outline"
            disabled={loading || (!hasFilters(draftFilters) && !filtersActive)}
            onClick={() => {
              setDraftFilters(emptyFilters)
              setAppliedFilters(emptyFilters)
              setPage(1)
            }}
          >
            <XIcon className="size-4" />
            Clear
          </Button>
        </div>
      </form>
      {departments.error && (
        <p role="alert" className="text-sm text-destructive">Could not load departments for filtering.</p>
      )}
      {loading
        ? (
            <p role="status" className="text-sm text-muted-foreground">Loading patients...</p>
          )
        : error
          ? (
              <div role="alert" className="space-y-3">
                <p className="text-sm text-destructive">{getFriendlyErrorMessage(error, 'Could not load patients. Please try again.')}</p>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    // Query errors are displayed by the list.
                    void refetch().catch(() => {})
                  }}
                >
                  Try again
                </Button>
              </div>
            )
          : !patients.length
              ? (
                  <p role="status" className="text-sm text-muted-foreground">
                    {filtersActive
                      ? 'No patients match these filters.'
                      : page === 1 ? 'No patients yet.' : 'No patients on this page. Go back to the previous page.'}
                  </p>
                )
              : (
                  <div className="rounded-lg border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Name</TableHead>
                          <TableHead>Email</TableHead>
                          <TableHead>Phone</TableHead>
                          <TableHead>Gender</TableHead>
                          <TableHead>Address</TableHead>
                          <TableHead>Date of birth</TableHead>
                          <TableHead>Appointment date</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {patients.map(patient => (
                          <TableRow key={patient.id}>
                            <TableCell className="font-medium">{patient.name}</TableCell>
                            <TableCell>{patient.email?.trim() || 'Not provided'}</TableCell>
                            <TableCell>{patient.phone?.trim() || 'Not provided'}</TableCell>
                            <TableCell>{patient.gender || 'Not provided'}</TableCell>
                            <TableCell>{patient.address?.trim() || 'Not provided'}</TableCell>
                            <TableCell>{patient.date_of_birth?.split(dateTimeSeparator)[0] || 'Not provided'}</TableCell>
                            <TableCell>
                              <PatientAppointmentDate patientId={patient.id} />
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
      {(lastPage > 1 || page > 1) && (
        <nav
          aria-label="Patient pagination"
          className="flex items-center justify-center gap-4"
        >
          <Button type="button" variant="outline" disabled={loading || page <= 1} onClick={() => setPage(page - 1)}>Previous</Button>
          <span className="text-sm">{`Page ${page} of ${Math.max(page, lastPage)}`}</span>
          <Button type="button" variant="outline" disabled={loading || !!error || page >= lastPage} onClick={() => setPage(page + 1)}>Next</Button>
        </nav>
      )}
    </div>
  )
}
