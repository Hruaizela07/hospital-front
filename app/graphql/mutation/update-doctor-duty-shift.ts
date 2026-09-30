import { gql } from '@apollo/client'

export const UPDATE_DOCTOR_DUTY_SHIFT = gql(`
  mutation updateDoctorDutyShift($id: ID!, $input: UpdateShiftInput!) {
  updateDoctorDutyShift(id: $id, input: $input) {
    id
    doctor {
      id
      department {
        id
        name
      }
      userName
      image {
        id
        path
      }
      email
      specialization
    }
    duty_date
    start_time
    end_time
    slot_minutes
  }
}  
    `)
