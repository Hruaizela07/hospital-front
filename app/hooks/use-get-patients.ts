import type { PatientsQuery, PatientsQueryVariables } from '~/gql/graphql'
import { useQuery } from '@apollo/client'
import { PATIENTS_QUERY } from '~/graphql/query/patients'

export default function useGetPatients(variables: PatientsQueryVariables) {
  const { data, loading, error, refetch } = useQuery<PatientsQuery, PatientsQueryVariables>(PATIENTS_QUERY, {
    variables,
    notifyOnNetworkStatusChange: true,
  })

  return {
    patients: data?.patients.data ?? [],
    paginationInfo: data?.patients.paginatorInfo,
    loading,
    error,
    refetch,
  }
}
