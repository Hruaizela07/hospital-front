import type { ApolloError } from '@apollo/client'
import type { DoctorsQuery } from '~/gql/graphql'
import { SearchIcon, UserRound } from 'lucide-react'
import { useId, useMemo, useState } from 'react'
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import { Label } from '~/components/ui/label'
import getFriendlyErrorMessage from '~/lib/get-friendly-error-message'
import DoctorDelete from './doctor-delete'
import { filterDoctors } from './doctor-filters'
import DoctorsUpdate from './doctors-update'

interface Props {
  doctors?: DoctorsQuery['doctors']
  loading: boolean
  error?: ApolloError
  page: number
  onPageChange: (page: number) => void
  onRetry: () => void
  onUpdated?: () => void | Promise<void>
  onDeleted: (id: string) => void | Promise<void>
}

export function DoctorPhoto({ url, name }: { url?: string, name: string }) {
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

export default function DoctorsList({ doctors, loading, error, page, onPageChange, onRetry, onUpdated, onDeleted }: Props) {
  const id = useId()
  const [search, setSearch] = useState('')
  const lastPage = Math.max(1, doctors?.paginatorInfo.lastPage ?? page)
  const filteredDoctors = useMemo(() => (
    filterDoctors(doctors?.data ?? [], search)
  ), [doctors?.data, search])

  return (
    <div className="size-full min-h-190 space-y-6" aria-busy={loading}>
      <div className="grid gap-2 rounded-lg border p-4">
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
              onPageChange(1)
            }}
            placeholder="Search doctors"
            className="pl-9"
          />
        </div>
      </div>
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
              : filteredDoctors.length === 0
                ? (
                    <p role="status" className="text-sm text-muted-foreground">No doctors match your search.</p>
                  )
                : (
                    <div className="
                      grid w-full grid-cols-1 gap-6
                      sm:grid-cols-2
                      lg:grid-cols-3
                      xl:grid-cols-6
                    "
                    >
                      {filteredDoctors.map(doctor => (
                        <article key={doctor.id} className="rounded-lg border">
                          <DoctorPhoto url={doctor.image?.url} name={doctor.userName} />
                          <div className="space-y-2 p-4 wrap-break-word">
                            <h2 className="text-lg font-semibold">{doctor.userName}</h2>
                            <dl className="space-y-2 text-sm">
                              <div className="">
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
                              <div>
                                <dt className="text-muted-foreground">Status</dt>
                                <dd>{doctor.status}</dd>
                              </div>
                              <div>
                                <dt className="text-muted-foreground">Leave Status</dt>
                                <dd>{doctor.leave_status}</dd>
                              </div>
                            </dl>
                            <div className="flex gap-2">
                              <DoctorsUpdate doctor={doctor} onUpdated={onUpdated} />
                              <DoctorDelete doctor={doctor} onDeleted={() => onDeleted(doctor.id)} />
                            </div>
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
