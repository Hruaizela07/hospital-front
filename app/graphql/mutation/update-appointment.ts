import { gql } from '@apollo/client'

export const UPDATE_APPOINTMENT = gql(`
  mutation updateAppointment($Input: UpdateAppointmentInput!, $id: ID!) {
  updateAppointment(input: $Input, id: $id) {
    id
    patient {
      id
      name
    }
    doctor {
      id
      userName
      department {
        id
      }
    }
    appointment_date
    start_time
    end_time
    duration_minutes
    reason_for_visit
    status
    notes
    created_at
    updated_at
  }
}  
    `)
