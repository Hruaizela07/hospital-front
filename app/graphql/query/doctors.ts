import { gql } from '@apollo/client'

export const DOCTORS_QUERY = gql(`
  query doctors($filter: DoctorFilterInput, $first: Int!, $page: Int) {
  doctors(filter: $filter, first: $first, page: $page) {
    data {
      id
      department {
        id
        name
        description
      }
      userName
      image {
        id
        path
        url
      }
      email
      specialization
      created_at
      updated_at
    }
    paginatorInfo {
      total
      lastPage
    }
  }
}  
    `)
