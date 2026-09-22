import { gql } from '@apollo/client'

export const DEPARTMENTS_QUERY = gql(`
query departments($filter: DepartmentFilterInput, $first: Int!, $page: Int) {
  departments(filter: $filter, first: $first, page: $page) {
    data {
      id
      name
      description
      doctors {
        id
        department {
          id
        }
        userName
        image {
          id
          path
        }
        email
        specialization
      }
      created_at
      updated_at
    }
    paginatorInfo {
      currentPage
      lastPage
    }
  }
}
    `)
