import type { DoctorQuery, DoctorQueryVariables } from '~/gql/graphql'
import { useQuery } from '@apollo/client'
import { DOCTOR_QUERY } from '~/graphql/query/doctor'

export default function useGetDoctor(variables?: DoctorQueryVariables) {
  const { data, loading, error } = useQuery<DoctorQuery, DoctorQueryVariables>(DOCTOR_QUERY, {
    variables,
  })
  return { data, loading, error }
}
