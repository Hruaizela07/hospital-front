import { gql } from '@apollo/client'

export const CREATE_DOCTOR = gql(`
    mutation createDoctor($input: CreateDoctorInput!) {
        createDoctor(input: $input) {
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
