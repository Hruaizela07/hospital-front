import type { DoctorDutyShiftsQuery, DoctorDutyShiftsQueryVariables } from '~/gql/graphql'
import { useQuery } from '@apollo/client'
import { DOCTOR_DUTY_SHIFT_QUERY } from '~/graphql/query/doctor-duty-shift'

export default function useGetDoctorDutyShift(variables: DoctorDutyShiftsQueryVariables) {
  const { data, refetch, loading, error } = useQuery<DoctorDutyShiftsQuery, DoctorDutyShiftsQueryVariables>(DOCTOR_DUTY_SHIFT_QUERY, {
    variables,
  })
  return {
    duty: data?.doctorDutyShifts.data ?? [],
    pagination: data?.doctorDutyShifts.paginatorInfo,
    loading,
    error,
    refetch,
  }
}
