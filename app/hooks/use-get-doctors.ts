import type { DoctorsQuery, DoctorsQueryVariables } from '~/gql/graphql'
import { useQuery } from '@apollo/client'
import { DOCTORS_QUERY } from '~/graphql/query/doctors'

export default function useGetDoctors(variables: DoctorsQueryVariables) {
  const { data, loading, error, refetch } = useQuery<DoctorsQuery, DoctorsQueryVariables>(DOCTORS_QUERY, {
    variables,
    fetchPolicy: 'cache-and-network',
    notifyOnNetworkStatusChange: true,
  })
  return { data, loading, error, refetch }
}
