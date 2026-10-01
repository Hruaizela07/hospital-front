import { gql } from '@apollo/client'

export const DELETE_DOCTOR_LEAVE = gql(`
  mutation deleteDoctorLeave($id: ID!) {
  deleteDoctorLeave(id: $id)
}  
    `)
