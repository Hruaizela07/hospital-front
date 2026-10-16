import { gql } from '@apollo/client'

export const UPDATE_PATIENT = gql(`
  mutation updatePatient($input: UpdatePatientInput!, $id: ID!) {
  updatePatient(input: $input, id: $id) {
    id
    name
    email
    phone
    gender
    department {
      id
      name
    }
    weight
    date_of_birth
    abha_id
    address
    district
    marital_status
    created_at
    updated_at
  }
}  
    `)
