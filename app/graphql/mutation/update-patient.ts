import { gql } from '@apollo/client'

export const UPDATE_PATIENT = gql(`
  mutation updatePatient($input: UpdatePatientInput!, $id: ID!) {
  updatePatient(input: $input, id: $id) {
    id
    name
    symptom
    email
    phone
    gender
    date_of_birth
    created_at
    updated_at
  }
}  
    `)
