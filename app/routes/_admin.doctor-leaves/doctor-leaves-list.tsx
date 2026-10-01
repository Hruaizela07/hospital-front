import { useState } from 'react'
import { Button } from '~/components/ui/button'
import { DoctorPhoto } from '../_admin.doctors/doctors-list'
import useGetDoctorsLeaves from './use-get-doctors-leaves'

export default function DoctorLeavesList() {
  const [page, setPage] = useState(1)
  const { docLeaves, paginatorInfo, loading, error } = useGetDoctorsLeaves({ filter: { }, page, first: 12 })

  const lastPage = Math.max(1, paginatorInfo?.lastPage ?? page)

  return (
    <div>
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
                </dl>
                {/* <DoctorsUpdate doctor={doctor} onUpdated={onUpdated} /> */}
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
