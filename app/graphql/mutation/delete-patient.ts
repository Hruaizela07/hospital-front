import { gql } from '@apollo/client'

export const DELETE_PATIENT = gql(`
  mutation deletePatient($id: ID!) {
  deletePatient(id: $id)
}  
    `)
