import type { DoctorsQuery } from '~/gql/graphql'

type Doctor = NonNullable<DoctorsQuery['doctors']>['data'][number]

export function filterDoctors(doctors: Doctor[], search: string) {
  const query = search.trim().toLowerCase()

  if (!query)
    return doctors

  return doctors.filter(doctor => [
    doctor.userName,
    doctor.specialization,
    doctor.department?.name,
    doctor.email,
    doctor.status,
    doctor.leave_status,
  ].some(value => value?.toLowerCase().includes(query)))
}
