import { useState } from 'react'
import { Button } from '~/components/ui/button'
import useGetPatients from '~/hooks/use-get-patients'
import getFriendlyErrorMessage from '~/lib/get-friendly-error-message'

const dateTimeSeparator = /[T ]/

export default function PatientList() {
  const [page, setPage] = useState(1)
  const { patients, paginationInfo, error, loading, refetch } = useGetPatients({ filter: {}, first: 10, page })
  const lastPage = Math.max(1, paginationInfo?.lastPage ?? page)

  return (
    <div className="size-full min-h-190 space-y-6" aria-busy={loading}>
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
                    {page === 1 ? 'No patients yet.' : 'No patients on this page. Go back to the previous page.'}
                  </p>
                )
              : (
                  <div className="
                    grid w-full grid-cols-1 gap-6
                    sm:grid-cols-2
                    lg:grid-cols-3
                    xl:grid-cols-5
                  "
                  >
                    {patients.map(patient => (
                      <article
                        key={patient.id}
                        className="
                          space-y-3 rounded-lg border p-4 wrap-break-word
                        "
                      >
                        <h2 className="text-lg font-semibold">{patient.name}</h2>
                        <dl className="space-y-3 text-sm">
                          <div>
                            <dt className="text-muted-foreground">Symptom</dt>
                            <dd>{patient.symptom?.trim() || 'Not provided'}</dd>
                          </div>
                          <div>
                            <dt className="text-muted-foreground">Email</dt>
                            <dd>{patient.email?.trim() || 'Not provided'}</dd>
                          </div>
                          <div>
                            <dt className="text-muted-foreground">Phone</dt>
                            <dd>{patient.phone?.trim() || 'Not provided'}</dd>
                          </div>
                          <div>
                            <dt className="text-muted-foreground">Gender</dt>
                            <dd>{patient.gender || 'Not provided'}</dd>
                          </div>
                          <div>
                            <dt className="text-muted-foreground">Date of birth</dt>
                            <dd>{patient.date_of_birth?.split(dateTimeSeparator)[0] || 'Not provided'}</dd>
                          </div>
                        </dl>
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
