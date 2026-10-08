import type { DoctorAvailableSlotsQuery, DoctorAvailableSlotsQueryVariables } from '~/gql/graphql'
import { useQuery } from '@apollo/client'
import { DOCTOR_AVAILABLE_SLOT_QUERY } from '~/graphql/query/doctor-available-slot'

export default function useGetDoctorAvailableSlots(variables?: DoctorAvailableSlotsQueryVariables) {
  const { data, loading, error, refetch } = useQuery<DoctorAvailableSlotsQuery, DoctorAvailableSlotsQueryVariables>(DOCTOR_AVAILABLE_SLOT_QUERY, {
    variables,
    skip: !variables,
    fetchPolicy: 'cache-and-network',
    notifyOnNetworkStatusChange: true,
  })

  return {
    slots: data?.doctorAvailableSlots ?? [],
    loading,
    error,
    refetch,
  }
}
