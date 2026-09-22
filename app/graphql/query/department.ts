import { gql } from '@apollo/client'

export const DEPARTMENT_QUERY = gql(`
query department($id: ID!) {
  department(id: $id) {
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
}    
    `)
