import { gql } from '@apollo/client'

export const DOCTOR_AVAILABLE_SLOT_QUERY = gql(`
query doctorAvailableSlots($doctor_id: ID!, $date: Date!, $duration_minutes: Int!) {
  doctorAvailableSlots(
    doctor_id: $doctor_id
    date: $date
    duration_minutes: $duration_minutes
  ) {
    start
    end
    duration_minutes
    doctor_id
    doctor {
      id
      userName
      department {
        id
        name
      }
      specialization
      leave_status
      image {
        id
        path
      }
    }
  }
}
    `)
