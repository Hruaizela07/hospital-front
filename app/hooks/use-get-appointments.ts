import type { AppointmentsQuery, AppointmentsQueryVariables } from '~/gql/graphql'
import { useQuery } from '@apollo/client'
import { APPOINTMENTS_QUERY } from '~/graphql/query/appointments'

export default function useGetAppointments(variables: AppointmentsQueryVariables) {
  const { data, loading, error } = useQuery<AppointmentsQuery, AppointmentsQueryVariables>(APPOINTMENTS_QUERY, {
    variables,
  })
  return {
    appointments: data?.appointments.data ?? [],
    paginationInfo: data?.appointments.paginatorInfo,
    loading,
    error,
  }
}
