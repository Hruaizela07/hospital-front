import { gql } from '@apollo/client'

export const LOGINMUTATION = gql(`
    mutation login($username:String!,$password:String!) {
        login(userName:$username,password:$password) {
            id
            userName
            role
            lastLoginAt
            createdAt
            updatedAt
        }
    }
`)
