import { useState } from 'react'
import { Button } from '~/components/ui/button'
import { DoctorPhoto } from '../_admin_.doctors/doctors-list'
import DoctorLeaveDelete from './department-delete'
import DoctorLeaveAdd from './doctor-leave-add'
import DoctorLeaveUpdate from './doctor-leave-update'
import useGetDoctorsLeaves from './use-get-doctors-leaves'

export default function DoctorLeavesList() {
  const [page, setPage] = useState(1)
  const { docLeaves, paginatorInfo, loading, error, refetch } = useGetDoctorsLeaves({ filter: { }, page, first: 12 })

  const lastPage = Math.max(1, paginatorInfo?.lastPage ?? page)
  const refreshLeaves = async () => {
    await refetch()
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-2xl font-semibold">Doctor Leaves</h1>
        <DoctorLeaveAdd onCreated={refreshLeaves} />
      </div>
      {loading && (
        <p role="status" className="text-sm text-muted-foreground">Loading doctor leaves...</p>
      )}
      {error && (
        <p role="alert" className="text-sm text-destructive">Could not load doctor leaves.</p>
      )}
      {!loading && !error && docLeaves.length === 0 && (
        <p role="status" className="text-sm text-muted-foreground">No doctor leaves loaded yet.</p>
      )}
      {!loading && !error && docLeaves.length !== 0 && (
        <div className="
          grid w-full grid-cols-1 gap-6
          sm:grid-cols-2
          lg:grid-cols-3
          xl:grid-cols-5
        "
        >
          {docLeaves.map(doctor => (
            <article key={doctor.id} className="rounded-lg border">
              <DoctorPhoto url={doctor.doctor.image?.url} name={doctor.doctor.userName} />
              <div className="space-y-3 p-4 wrap-break-word">
                <h2 className="text-lg font-semibold">{doctor.doctor.userName}</h2>
                <dl className="space-y-3 text-sm">
                  <div>
                    <dt className="text-muted-foreground">Specialization</dt>
                    <dd>{doctor.doctor.specialization?.trim() || 'Not provided'}</dd>
                  </div>
                  <div>
                    <dt className="text-muted-foreground">Department</dt>
                    <dd>{doctor.doctor.department?.name || 'Not assigned'}</dd>
                  </div>
                  <div>
                    <dt className="text-muted-foreground">Email</dt>
                    <dd>{doctor.doctor.email || 'Not provided'}</dd>
                  </div>
                  <div>
                    <dt className="text-muted-foreground">Leave Dates</dt>
                    <dd>
                      {doctor.start_date}
                      {' - '}
                      {doctor.end_date}
                    </dd>
                  </div>
                </dl>
                <div className="flex gap-2">
                  <DoctorLeaveUpdate leave={doctor} onUpdated={refreshLeaves} />
                  <DoctorLeaveDelete
                    doctorLeave={{ id: doctor.id, name: `${doctor.doctor.userName}'s leave` }}
                    onDeleted={refreshLeaves}
                  />
                </div>
              </div>
            </article>
          ))}
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
