import { gql } from '@apollo/client'

export const DELETE_DEPARTMENT = gql(`
mutation deleteDepartment($id: ID!) {
  deleteDepartment(id: $id)
}    
    `)
