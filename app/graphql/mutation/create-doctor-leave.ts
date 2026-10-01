import { gql } from '@apollo/client'

export const CREATE_DOCTOR_LEAVE = gql(`
  mutation createDoctorLeave($input: CreateDoctorLeaveInput!) {
  createDoctorLeave(input: $input) {
    id
    doctor {
      id
      userName
      department {
        id
        name
      }
      image {
        id
        path
      }
    }
    start_date
    end_date
  }
}  
    `)
