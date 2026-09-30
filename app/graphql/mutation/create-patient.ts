import { gql } from '@apollo/client'

export const CREATE_PATIENT = gql(`
  mutation createPatient($input: CreatePatientInput!) {
  createPatient(input: $input) {
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
