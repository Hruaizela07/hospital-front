import { useEffect, useMemo, useState } from 'react'
import AppPagination from '~/components/ui/app-pagination'
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import useGetAppointments from '~/hooks/use-get-appointments'
import AppointmentAdd from './appointment-add'
import AppointmentDelete from './appointment-delete'
import AppointmentUpdate from './appointment-update'

const dateTimeSeparator = /[T ]/

function matchesSearch(search: string, values: Array<string | null | undefined>) {
  const query = search.trim().toLowerCase()

  if (!query)
    return true

  return values.some(value => value?.toLowerCase().includes(query))
}

export default function AppointmentsList() {
  const [currentPage, setCurrentPage] = useState(1)
  const [search, setSearch] = useState('')
  const { appointments, paginationInfo, error, loading, refetch } = useGetAppointments({ filter: {}, first: 12, page: currentPage })

  const filteredAppointments = useMemo(() => (
    appointments.filter(appointment => matchesSearch(search, [
      appointment.doctor?.userName,
      appointment.doctor?.department?.name,
      appointment.doctor?.specialization,
      appointment.patient?.name,
      appointment.patient?.email,
      appointment.patient?.phone,
      appointment.patient?.symptom,
      appointment.status,
      appointment.notes,
    ]))
  ), [appointments, search])

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
      <div>
        <Input
          type="search"
          value={search}
          onChange={event => setSearch(event.target.value)}
          placeholder="Search appointments"
          aria-label="Search appointments"
        />
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
        <p role="status" className="text-sm text-muted-foreground">No appointments match your search.</p>
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
