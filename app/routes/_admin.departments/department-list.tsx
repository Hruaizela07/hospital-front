import type { ApolloError } from '@apollo/client'
import type { DepartmentsQuery } from '~/gql/graphql'
import { Image } from 'lucide-react'
import { Button } from '~/components/ui/button'
import getFriendlyErrorMessage from '~/lib/get-friendly-error-message'
import DepartmentDelete from './department-delete'

interface Props {
  departments?: DepartmentsQuery['departments']
  loading: boolean
  error?: ApolloError
  page: number
  onPageChange: (page: number) => void
  onRetry: () => void
  onDeleted: () => void | Promise<void>
}

export default function DepartmentList({ departments, loading, error, page, onPageChange, onRetry, onDeleted }: Props) {
  const lastPage = Math.max(1, departments?.paginatorInfo.lastPage ?? page)

  return (
    <div className="size-full min-h-190 space-y-6" aria-busy={loading}>
      {loading
        ? (
            <p role="status" className="text-sm text-muted-foreground">Loading departments...</p>
          )
        : error
          ? (
              <div role="alert" className="space-y-3">
                <p className="text-sm text-destructive">
                  {getFriendlyErrorMessage(error, 'Could not load departments. Please try again.')}
                </p>
                <Button type="button" variant="outline" onClick={onRetry}>Try again</Button>
              </div>
            )
          : !departments?.data.length
              ? (
                  <p role="status" className="text-sm text-muted-foreground">
                    {page === 1 ? 'No departments yet. Add a department to get started.' : 'No departments on this page. Go back to the previous page.'}
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
                    {departments.data.map(department => (
                      <article
                        key={department.id}
                        className="min-h-68 rounded-lg border"
                      >
                        <div className="flex items-center justify-center">
                          <Image
                            aria-hidden="true"
                            className="size-42 object-contain text-gray-300"
                          />
                        </div>
                        <div className="space-y-4 p-4 wrap-break-word">
                          <h2 className="text-lg font-semibold">{department.name}</h2>
                          <p className="text-sm text-muted-foreground">
                            {department.description?.trim() || 'No description provided.'}
                          </p>
                        </div>
                        <div>
                          <DepartmentDelete departM={department} onDeleted={onDeleted} />
                        </div>
                      </article>
                    ))}
                  </div>
                )}
      {(lastPage > 1 || page > 1) && (
        <nav
          aria-label="Department pagination"
          className="flex items-center justify-center gap-4"
        >
          <Button type="button" variant="outline" disabled={loading || page <= 1} onClick={() => onPageChange(page - 1)}>
            Previous
          </Button>
          <span className="text-sm">
            Page
            {' '}
            {page}
            {' '}
            of
            {' '}
            {Math.max(page, lastPage)}
          </span>
          <Button type="button" variant="outline" disabled={loading || !!error || page >= lastPage} onClick={() => onPageChange(page + 1)}>
            Next
          </Button>
        </nav>
      )}
    </div>
  )
}
