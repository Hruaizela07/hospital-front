import { gql } from '@apollo/client'

export const UPDATE_DEPARTMENT = gql(`
    mutation updateDepartment($id:ID!, $input: UpdateDepartmentInput!) {
        updateDepartment(id:$id, input: $input) {
            id
            name
            description
            doctors{
                id
                userName
            }
            created_at
            updated_at
        }
    }
`)
