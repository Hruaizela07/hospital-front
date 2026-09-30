import { useState } from 'react'
import useGetAppointments from '~/hooks/use-get-appointments'

const dateTimeSeparator = /[T ]/

export default function AppointmentsList() {
  const [page, setPage] = useState(1)
  const { appointments, paginationInfo, error, loading } = useGetAppointments({ filter: {}, first: 12, page })

  const lastPage = Math.max(1, paginationInfo?.lastPage ?? page)

  return (
    <div className="size-full min-h-190 space-y-6" aria-busy={loading}>

      {!loading && !error && appointments.length !== 0 && (
        <div className="
          grid w-full grid-cols-1 gap-6
          sm:grid-cols-2
          lg:grid-cols-3
          xl:grid-cols-5
        "
        >
          {appointments.map(aptms => (
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
              </dl>
            </article>
          ))}
        </div>
      )}
    </div>
  )
}
