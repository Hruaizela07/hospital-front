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
    status
    doctorID
    leave_status
    created_at
    updated_at
  }
}  
   
    `)
