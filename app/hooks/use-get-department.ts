import type { DepartmentQuery, DepartmentQueryVariables } from '~/gql/graphql'
import { useQuery } from '@apollo/client'
import { DEPARTMENT_QUERY } from '~/graphql/query/department'

export default function useGetDepartment(variables?: DepartmentQueryVariables) {
  const { data, loading, error } = useQuery<DepartmentQuery, DepartmentQueryVariables>(DEPARTMENT_QUERY, {
    variables,
  })

  return {
    data,
    loading,
    error,
  }
}
