import { gql } from '@apollo/client'

export const CREATE_APPOINTMENT = gql(`
  mutation createAppointment($Input: CreateAppointmentInput!) {
  createAppointment(input: $Input) {
    id
    patient {
      id
      name
      symptom
    }
    doctor {
      id
      userName
      department {
        id
      }
    }
    appointment_date
    status
    notes
    created_at
    updated_at
  }
}  
    `)
