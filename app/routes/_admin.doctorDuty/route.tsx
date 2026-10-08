import { useState } from 'react'
import AddDuty from './add-duty'
import AddMonthlyDuty from './add-monthly-duty'
import DutyList from './duty-list'
import useGetDoctorDutyShift from './use-get-doctor-duty-shift'

export default function DoctorDuty() {
  const [page, setPage] = useState(1)

  const { duty, error, loading, refetch } = useGetDoctorDutyShift({ first: 12, page })

  const refreshDuty = async () => {
    await refetch()
  }

  return (
    <div className="mx-auto my-4 flex w-full max-w-360 flex-col gap-6">
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-2xl font-semibold">Doctor Duty</h1>
        <div className="flex flex-wrap justify-end gap-2">
          <AddMonthlyDuty onCreated={refreshDuty} />
          <AddDuty onCreated={refreshDuty} />
        </div>
      </div>
      <DutyList
        duties={duty}
        loading={loading}
        error={error}
        page={page}
        onPageChange={setPage}
        onDeleted={refreshDuty}
        onUpdated={refreshDuty}
        onRetry={() => {
          // Query errors are displayed by the list.
          void refreshDuty().catch(() => {})
        }}
      />
    </div>
  )
}
