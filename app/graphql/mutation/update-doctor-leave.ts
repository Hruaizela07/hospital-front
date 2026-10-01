import { gql } from '@apollo/client'

export const UPDATE_DOCTOR_LEAVE = gql(`
  mutation udateDoctorLeave($id: ID!, $input: UpdateDoctorLeaveInput!) {
  updateDoctorLeave(id: $id, input: $input) {
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
