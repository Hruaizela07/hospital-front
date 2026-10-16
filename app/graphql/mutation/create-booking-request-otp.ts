import { gql } from '@apollo/client'

export const CREATE_PUBLIC_BOOKING_OTP = gql(`
mutation requestPublicBookingOtp($input: RequestPublicBookingOtpInput!) {
  requestPublicBookingOtp(input: $input) {
    challenge_id
    expires_at
  }
}    
    `)
