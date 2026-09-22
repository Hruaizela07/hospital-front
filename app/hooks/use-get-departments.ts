import type { DepartmentsQuery, DepartmentsQueryVariables } from '~/gql/graphql'
import { useQuery } from '@apollo/client'
import { DEPARTMENTS_QUERY } from '~/graphql/query/departments'

export default function useGetDepartments(variables: DepartmentsQueryVariables) {
  const { data, loading, error, refetch } = useQuery<DepartmentsQuery, DepartmentsQueryVariables>(DEPARTMENTS_QUERY, {
    variables,
    fetchPolicy: 'cache-and-network',
    notifyOnNetworkStatusChange: true,
  })

  return {
    data,
    loading,
    error,
    refetch,
  }
}
