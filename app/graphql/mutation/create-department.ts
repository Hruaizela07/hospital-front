import { gql } from '@apollo/client'

export const CREATE_DEPARTMENT = gql(`
    mutation createDepartment($input: CreateDepartmentInput!) {
        createDepartment(input: $input) {
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
