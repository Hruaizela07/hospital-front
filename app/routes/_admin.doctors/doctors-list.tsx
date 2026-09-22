import type { ApolloError } from '@apollo/client'
import type { DoctorsQuery } from '~/gql/graphql'
import { UserRound } from 'lucide-react'
import { useState } from 'react'
import { Button } from '~/components/ui/button'
import getFriendlyErrorMessage from '~/lib/get-friendly-error-message'
import DoctorsUpdate from './doctors-update'

interface Props {
  doctors?: DoctorsQuery['doctors']
  loading: boolean
  error?: ApolloError
  page: number
  onPageChange: (page: number) => void
  onRetry: () => void
  onUpdated?: () => void | Promise<void>
}

function DoctorPhoto({ url, name }: { url?: string, name: string }) {
  const [failedUrl, setFailedUrl] = useState<string>()

  return (
    <div className="
      flex h-44 items-center justify-center overflow-hidden rounded-t-lg
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

export default function DoctorsList({ doctors, loading, error, page, onPageChange, onRetry, onUpdated }: Props) {
  const lastPage = Math.max(1, doctors?.paginatorInfo.lastPage ?? page)

  return (
    <div className="size-full min-h-190 space-y-6" aria-busy={loading}>
      {loading
        ? (
            <p role="status" className="text-sm text-muted-foreground">Loading doctors...</p>
          )
        : error
          ? (
              <div role="alert" className="space-y-3">
                <p className="text-sm text-destructive">{getFriendlyErrorMessage(error, 'Could not load doctors. Please try again.')}</p>
                <Button type="button" variant="outline" onClick={onRetry}>Try again</Button>
              </div>
            )
          : !doctors?.data.length
              ? (
                  <p role="status" className="text-sm text-muted-foreground">
                    {page === 1 ? 'No doctors yet. Add a doctor to get started.' : 'No doctors on this page. Go back to the previous page.'}
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
                    {doctors.data.map(doctor => (
                      <article key={doctor.id} className="rounded-lg border">
                        <DoctorPhoto url={doctor.image?.url} name={doctor.userName} />
                        <div className="space-y-3 p-4 wrap-break-word">
                          <h2 className="text-lg font-semibold">{doctor.userName}</h2>
                          <dl className="space-y-3 text-sm">
                            <div>
                              <dt className="text-muted-foreground">Specialization</dt>
                              <dd>{doctor.specialization?.trim() || 'Not provided'}</dd>
                            </div>
                            <div>
                              <dt className="text-muted-foreground">Department</dt>
                              <dd>{doctor.department?.name || 'Not assigned'}</dd>
                            </div>
                            <div>
                              <dt className="text-muted-foreground">Email</dt>
                              <dd>{doctor.email || 'Not provided'}</dd>
                            </div>
                          </dl>
                          <DoctorsUpdate doctor={doctor} onUpdated={onUpdated} />
                        </div>
                      </article>
                    ))}
                  </div>
                )}
      {(lastPage > 1 || page > 1) && (
        <nav
          aria-label="Doctor pagination"
          className="flex items-center justify-center gap-4"
        >
          <Button type="button" variant="outline" disabled={loading || page <= 1} onClick={() => onPageChange(page - 1)}>Previous</Button>
          <span className="text-sm">{`Page ${page} of ${Math.max(page, lastPage)}`}</span>
          <Button type="button" variant="outline" disabled={loading || !!error || page >= lastPage} onClick={() => onPageChange(page + 1)}>Next</Button>
        </nav>
      )}
    </div>
  )
}
