import { gql } from '@apollo/client'

export const DELETE_APPOINTMENT = gql(`
  mutation deleteAppointment($id: ID!) {
  deleteAppointment(id: $id)
}  
    `)
