import type { AppointmentQuery, AppointmentQueryVariables } from '~/gql/graphql'
import { useQuery } from '@apollo/client'
import { APPOINTMENT_QUERY } from '~/graphql/query/appointment'

export default function useGetAppointment(variables: AppointmentQueryVariables) {
  const { data, loading, error } = useQuery<AppointmentQuery, AppointmentQueryVariables>(APPOINTMENT_QUERY, {
    variables,
  })

  return {
    appointment: data?.appointment ?? [],
    loading,
    error,
  }
}
