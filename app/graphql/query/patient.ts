import { gql } from '@apollo/client'

export const PATIENT_QUERY = gql(`
  query patient($id: ID!) {
  patient(id: $id) {
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
