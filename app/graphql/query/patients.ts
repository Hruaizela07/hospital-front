import { gql } from '@apollo/client'

export const PATIENTS_QUERY = gql(`
  query patients($filter: PatientFilterInput!, $first: Int!, $page: Int) {
  patients(filter: $filter, first: $first, page: $page) {
    data {
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
    paginatorInfo {
      lastPage
      total
    }
  }
}  
    `)
