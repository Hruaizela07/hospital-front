import { gql } from '@apollo/client'

export const PUBLIC_BOOKING_DOCTORS = gql(`
  query publicBookingDoctors($department_id: ID!) {
    publicBookingDoctors(department_id: $department_id) {
      id
      userName
      image{
        id
        name
        path
        url
      }
      specialization
    }
  }
`)
