import type { DoctorsQuery } from '~/gql/graphql'

type Doctor = NonNullable<DoctorsQuery['doctors']>['data'][number]

export function filterDoctors(doctors: Doctor[], search: string, departmentId = '') {
  const query = search.trim().toLowerCase()

  return doctors.filter(doctor => (
    (!departmentId || doctor.department?.id === departmentId)
    && (!query || [
      doctor.userName,
      doctor.specialization,
      doctor.department?.name,
      doctor.email,
      doctor.status,
      doctor.leave_status,
    ].some(value => value?.toLowerCase().includes(query)))
  ))
}
