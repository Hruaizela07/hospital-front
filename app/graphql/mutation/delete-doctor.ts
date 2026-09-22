import { gql } from '@apollo/client'

export const DELETE_DOCTOR = gql(`
mutation deleteDoctor($id: ID!) {
  deleteDoctor(id: $id)
}    
    `)
