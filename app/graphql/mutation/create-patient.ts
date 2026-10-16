import { gql } from '@apollo/client'

export const CREATE_PATIENT = gql(`
  mutation createPatient($input: CreatePatientInput!) {
  createPatient(input: $input) {
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
