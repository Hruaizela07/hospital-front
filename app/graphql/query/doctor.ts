import { gql } from '@apollo/client'

export const DOCTOR_QUERY = gql(`
  query doctor($id: ID!) {
  doctor(id: $id) {
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
}  
   
    `)
