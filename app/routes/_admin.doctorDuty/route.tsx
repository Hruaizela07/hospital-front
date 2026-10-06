import { useId, useState } from 'react'
import AddDuty from './add-duty'
import DutyList from './duty-list'
import useGetDoctorAvailableSlots from './use-get-doctor-available-slots'

export default function DoctorDuty() {
  const doctorId = 'real-doctor-id'
  const date = '2026-10-06'
  const durationMinutes = 30
  const [page, setPage] = useState(1)
  const { slots, error, loading, refetch } = useGetDoctorAvailableSlots({ filter: { doctor_id: ID, data: Date!, duration_minutes: Int! }, first: 12, page })

  const refreshDuty = async () => {
    await refetch()
  }

  return (
    <div className="mx-auto my-4 flex w-full max-w-360 flex-col gap-6">
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-2xl font-semibold">Doctor Duty</h1>
        <AddDuty onCreated={refreshDuty} />
      </div>
      <DutyList
        duties={slots}
        loading={loading}
        error={error}
        page={page}
        onPageChange={setPage}
        onDeleted={refreshDuty}
        onRetry={() => {
          // Query errors are displayed by the list.
          void refreshDuty().catch(() => {})
        }}
      />
    </div>
  )
}
