import type { PatientQuery, PatientQueryVariables } from '~/gql/graphql'
import { useQuery } from '@apollo/client'
import { PATIENT_QUERY } from '~/graphql/query/patient'

export default function useGetPatient(variables: PatientQueryVariables) {
  const { data, loading, error } = useQuery<PatientQuery, PatientQueryVariables>(PATIENT_QUERY, {
    variables,
  })
  return {
    data,
    loading,
    error,
  }
}
