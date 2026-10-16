import { gql } from '@apollo/client'

export const PATIENT_QUERY = gql(`
  query patient($id: ID!) {
  patient(id: $id) {
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
