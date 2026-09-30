import { gql } from '@apollo/client'

export const DOCTOR_AVAILABLE_SLOT_QUERY = gql(`
  query doctorAvailableSlots($doctor_id: ID!, $date: String!) {
  doctorAvailableSlots(doctor_id: $doctor_id, date: $date) {
    start
    end
    duration_minutes
  }
}  
    `)
