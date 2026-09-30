import { gql } from '@apollo/client'

export const UPDATE_APPOINTMENT = gql(`
  mutation updateAppointment($Input: UpdateAppointmentInput!, $id: ID!) {
  updateAppointment(input: $Input, id: $id) {
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
