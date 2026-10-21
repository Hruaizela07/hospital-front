import type { ApolloError } from '@apollo/client'
import type { DepartmentsQuery } from '~/gql/graphql'
import { Image } from 'lucide-react'
import AppPagination from '~/components/ui/app-pagination'
import { Button } from '~/components/ui/button'
import getFriendlyErrorMessage from '~/lib/get-friendly-error-message'
import DepartmentDelete from './department-delete'
import DepartmentUpdate from './department-update'

interface Props {
  departments?: DepartmentsQuery['departments']
  loading: boolean
  error?: ApolloError
  page: number
  onPageChange: (page: number) => void
  onRetry: () => void
  onUpdated: () => void | Promise<void>
  onDeleted: () => void | Promise<void>
}

export default function DepartmentList({ departments, loading, error, page, onPageChange, onRetry, onUpdated, onDeleted }: Props) {
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
                        className="min-h-44 rounded-lg border"
                      >
                        {/* <div className="flex items-center justify-center">
                          <Image
                            aria-hidden="true"
                            className="size-42 object-contain text-gray-300"
                          />
                        </div> */}
                        <div className="space-y-4 p-4 wrap-break-word">
                          <h2 className="h-10 text-lg font-semibold">{department.name}</h2>
                          <p className="h-13 text-sm text-muted-foreground">
                            {department.description?.trim() || 'No description provided.'}
                          </p>
                        </div>
                        <div className="flex gap-2 px-4 pb-3">
                          <DepartmentUpdate dpt={department} onUpdated={onUpdated} />
                          <DepartmentDelete departM={department} onDeleted={onDeleted} />
                        </div>
                      </article>
                    ))}
                  </div>
                )}
      {!loading && !error && (lastPage > 1 || page > 1) && (
        <AppPagination
          currentPage={page}
          handlePagePagination={onPageChange}
          lastPage={Math.max(page, lastPage)}
        />
      )}
    </div>
  )
}
