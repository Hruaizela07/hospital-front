import { gql } from '@apollo/client'

export const PATIENTS_QUERY = gql(`
  query patients($filter: PatientFilterInput!, $first: Int!, $page: Int) {
  patients(filter: $filter, first: $first, page: $page) {
    data {
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
    paginatorInfo {
      lastPage
      total
    }
  }
}  
    `)
