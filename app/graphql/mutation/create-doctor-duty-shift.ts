import { gql } from '@apollo/client'

export const CREATE_DOCTOR_DUTY_SHIFT = gql(`
 mutation createDoctorDutyShift($input: CreateShiftInput!) {
  createDoctorDutyShift(input: $input) {
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
