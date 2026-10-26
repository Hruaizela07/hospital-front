import type { PublicBookingDepartmentsQuery, PublicBookingDepartmentsQueryVariables, PublicBookingDoctorsQuery, PublicBookingDoctorsQueryVariables } from '~/gql/graphql'
import { useApolloClient, useQuery } from '@apollo/client'
import { UserRound } from 'lucide-react'
import { useEffect, useId, useMemo, useState } from 'react'
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import { Label } from '~/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '~/components/ui/select'
import { PUBLIC_BOOKING_DEPARTMENTS } from '~/graphql/query/public-booking-departments'
import { PUBLIC_BOOKING_DOCTORS } from '~/graphql/query/public-booking-doctors'
import CreateAppointmentPublic from './create-appointment'

export interface PublicDoctor {
  id: string
  userName: string
  imageUrl?: string
  specialization?: string
  department: { id: string, name: string }
}

function DoctorPhoto({ url, name }: { url?: string, name: string }) {
  const [failedUrl, setFailedUrl] = useState<string>()

  return (
    <div className="
      flex h-44 items-center justify-center overflow-hidden rounded-t-xl
      bg-muted
    "
    >
      {url && failedUrl !== url
        ? (
            <img
              src={url}
              alt={`Photo of ${name}`}
              loading="lazy"
              className="size-full object-cover"
              onError={() => setFailedUrl(url)}
            />
          )
        : (
            <UserRound
              aria-hidden="true"
              className="size-20 text-muted-foreground"
            />
          )}
    </div>
  )
}

export default function Appointment() {
  const client = useApolloClient()
  const id = useId()
  const [search, setSearch] = useState('')
  const [departmentId, setDepartmentId] = useState('')
  const [selectedDoctor, setSelectedDoctor] = useState<PublicDoctor | null>(null)
  const [directory, setDirectory] = useState<PublicDoctor[] | null>(null)
  const [directoryError, setDirectoryError] = useState<Error | null>(null)
  const departments = useQuery<PublicBookingDepartmentsQuery, PublicBookingDepartmentsQueryVariables>(PUBLIC_BOOKING_DEPARTMENTS, {
    variables: { first: 100, page: 1 },
  })
  const departmentOptions = departments.data?.departments.data

  useEffect(() => {
    if (!departmentOptions)
      return

    let cancelled = false
    const loadDoctors = async () => {
      try {
        const results = await Promise.all(departmentOptions.map(async (department) => {
          const response = await client.query<PublicBookingDoctorsQuery, PublicBookingDoctorsQueryVariables>({
            query: PUBLIC_BOOKING_DOCTORS,
            variables: { department_id: department.id },
            fetchPolicy: 'network-only',
          })
          return response.data.publicBookingDoctors.map(doctor => ({
            id: doctor.id,
            userName: doctor.userName,
            imageUrl: doctor.image?.url,
            specialization: doctor.specialization ?? undefined,
            department: { id: department.id, name: department.name },
          }))
        }))
        if (!cancelled) {
          setDirectoryError(null)
          setDirectory(results.flat())
        }
      }
      catch (error) {
        if (!cancelled)
          setDirectoryError(error instanceof Error ? error : new Error('Could not load doctors.'))
      }
    }

    void loadDoctors()
    return () => {
      cancelled = true
    }
  }, [client, departmentOptions])

  const visibleDoctors = useMemo(() => (
    (directory ?? []).filter(doctor => (
      (!departmentId || doctor.department.id === departmentId)
      && doctor.userName.toLowerCase().includes(search.trim().toLowerCase())
    ))
  ), [departmentId, directory, search])

  if (selectedDoctor) {
    return <CreateAppointmentPublic doctor={selectedDoctor} onChangeDoctor={() => setSelectedDoctor(null)} />
  }

  return (
    <main className="
      min-h-screen bg-[#F9F0E0] px-4 py-10
      sm:px-6
    "
    >
      <section className="mx-auto max-w-5xl space-y-6">
        <header>
          <h1 className="text-2xl font-semibold">Choose a doctor</h1>
          <p className="mt-2 text-sm text-muted-foreground">Search by name or filter by department, then make an appointment.</p>
        </header>
        <div className="
          grid gap-4 rounded-xl border bg-background p-4
          sm:grid-cols-2
        "
        >
          <div className="grid gap-2">
            <Label htmlFor={`${id}-search`}>Search doctor by name</Label>
            <Input id={`${id}-search`} type="search" value={search} onChange={event => setSearch(event.target.value)} placeholder="Doctor name" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor={`${id}-department`}>Department</Label>
            <Select
              items={[{ value: 'all', label: 'All departments' }, ...(departmentOptions ?? []).map(department => ({ value: department.id, label: department.name }))]}
              value={departmentId || 'all'}
              onValueChange={value => setDepartmentId(value === 'all' ? '' : value ?? '')}
              disabled={departments.loading || !departmentOptions?.length}
            >
              <SelectTrigger id={`${id}-department`} className="w-full"><SelectValue placeholder="All departments" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All departments</SelectItem>
                {departmentOptions?.map(department => <SelectItem key={department.id} value={department.id}>{department.name}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        </div>
        {(departments.loading || (!directory && !directoryError && !!departmentOptions)) && <p role="status">Loading doctors...</p>}
        {(departments.error || directoryError) && (
          <p
            role="alert"
            className="text-sm text-destructive"
          >
            Could not load doctors. Refresh the page and try again.
          </p>
        )}
        {!departments.loading && !departments.error && !departmentOptions?.length && <p role="status">No departments are available yet.</p>}
        {directory && !directoryError && !!departmentOptions?.length && !visibleDoctors.length && <p role="status">No doctors with upcoming duty match your filters.</p>}
        {!!visibleDoctors.length && (
          <div className="
            grid gap-4
            sm:grid-cols-2
            lg:grid-cols-3
          "
          >
            {visibleDoctors.map(doctor => (
              <article
                key={doctor.id}
                className="overflow-hidden rounded-xl border bg-background"
              >
                <DoctorPhoto url={doctor.imageUrl} name={doctor.userName} />
                <div className="space-y-3 p-5">
                  <div>
                    <h2 className="text-lg font-semibold">{doctor.userName}</h2>
                    <p className="text-sm text-muted-foreground">{doctor.department.name}</p>
                    {doctor.specialization && (
                      <p className="text-sm text-muted-foreground">
                        {doctor.specialization}
                      </p>
                    )}
                  </div>
                  <Button type="button" onClick={() => setSelectedDoctor(doctor)}>Make appointment</Button>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  )
}
