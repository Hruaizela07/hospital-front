import { gql } from '@apollo/client'

export const SUBMIT_PUBLIC_BOOKING = gql(`
  mutation submitPublicBooking($input: SubmitPublicBookingInput!) {
    submitPublicBooking(input: $input) { id }
  }
`)
