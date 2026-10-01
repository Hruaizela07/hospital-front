import type { DoctorLeavesQuery, DoctorLeavesQueryVariables } from '~/gql/graphql'
import { useQuery } from '@apollo/client'
import { DOCTOR_LEAVE_QUERY } from '~/graphql/query/doctor-leave'

export default function useGetDoctorsLeaves(variables: DoctorLeavesQueryVariables) {
  const { data, loading, error } = useQuery<DoctorLeavesQuery, DoctorLeavesQueryVariables>(DOCTOR_LEAVE_QUERY, { variables })
  return {
    docLeaves: data?.doctorLeaves.data ?? [],
    paginatorInfo: data?.doctorLeaves.paginatorInfo,
    loading,
    error,
  }
}
