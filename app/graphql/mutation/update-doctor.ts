import { gql } from '@apollo/client'

export const UPDATE_DOCTOR = gql(`
mutation updateDoctor($id: ID!, $input: UpdateDoctorInput!) {
  updateDoctor(input: $input, id: $id) {
    id
    department {
      id
    }
    userName
    image {
      id
      name
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
