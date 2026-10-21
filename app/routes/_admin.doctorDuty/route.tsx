import { useQuery } from '@apollo/client'
import { useState } from 'react'
import { UserRole } from '~/gql/graphql'
import { ME_QUERY } from '~/graphql/query/me'
import AddDuty from './add-duty'
import DutyList from './duty-list'
import useGetDoctorDutyShift from './use-get-doctor-duty-shift'

export default function DoctorDuty() {
  const [page, setPage] = useState(1)
  const { data: me } = useQuery<{ me: { role: UserRole } | null }>(ME_QUERY)
  const isAdmin = me?.me?.role === UserRole.Admin

  const { duty, error, loading, refetch } = useGetDoctorDutyShift({ first: 12, page })

  const refreshDuty = async () => {
    await refetch()
  }

  return (
    <div className="
      my-4 flex w-82 flex-col gap-6
      lg:mx-auto lg:w-full lg:max-w-360
    "
    >
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-2xl font-semibold">Doctor Duty</h1>
        <div className="flex flex-wrap justify-end gap-2">
          {/* <AddMonthlyDuty onCreated={refreshDuty} /> */}
          {isAdmin && <AddDuty onCreated={refreshDuty} />}
        </div>
      </div>
      <DutyList
        isAdmin={isAdmin}
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
