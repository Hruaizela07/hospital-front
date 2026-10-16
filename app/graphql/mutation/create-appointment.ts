import { gql } from '@apollo/client'

export const CREATE_APPOINTMENT = gql(`
  mutation createAppointment($Input: CreateAppointmentInput!) {
  createAppointment(input: $Input) {
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
