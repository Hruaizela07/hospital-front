import { useState } from 'react'
import useGetDoctors from '~/hooks/use-get-doctors'
import DoctorsAdd from './doctors-add'
import DoctorsList from './doctors-list'

export default function AdminDoctors() {
  const [page, setPage] = useState(1)
  const { data, loading, error, refetch } = useGetDoctors({ first: 10, page })
  const refreshDoctors = async () => {
    await refetch()
  }

  return (
    <div className="mx-auto my-4 flex w-full max-w-360 flex-col gap-6">
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-2xl font-semibold">Doctors</h1>
        <DoctorsAdd onCreated={refreshDoctors} />
      </div>
      <DoctorsList
        doctors={data?.doctors}
        loading={loading}
        error={error}
        page={page}
        onPageChange={setPage}
        onUpdated={refreshDoctors}
        onRetry={() => {
          // Query errors are displayed by the list.
          void refreshDoctors().catch(() => {})
        }}
      />
    </div>
  )
}
