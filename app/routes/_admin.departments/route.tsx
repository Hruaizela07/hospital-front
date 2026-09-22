import { useState } from 'react'
import useGetDepartments from '~/hooks/use-get-departments'
import DepartmentAdd from './department-add'
import DepartmentList from './department-list'

export default function Route() {
  const [page, setPage] = useState(1)
  const { data, loading, error, refetch } = useGetDepartments({ first: 10, page })

  const refreshDepartments = async () => {
    await refetch()
  }

  return (
    <div className="mx-auto my-4 flex w-full max-w-360 flex-col gap-6">
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-2xl font-semibold">Departments</h1>
        <DepartmentAdd onCreated={refreshDepartments} />
      </div>
      <div>
        <DepartmentList
          departments={data?.departments}
          loading={loading}
          error={error}
          page={page}
          onPageChange={setPage}
          onDeleted={refreshDepartments}
          onRetry={() => {
            // Query errors are displayed by the list.
            void refreshDepartments().catch(() => {})
          }}
        />
      </div>
    </div>
  )
}
