import { gql } from '@apollo/client'

export const DELETE_DOCTOR_DUTY_SHIFT = gql(`
   mutation deleteDoctorDutyShift($id:ID!) {
  deleteDoctorDutyShift(id: $id) 
}
    `)
