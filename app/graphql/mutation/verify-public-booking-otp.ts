import { gql } from '@apollo/client'

export const VERIFY_PUBLIC_BOOKING_OTP = gql(`
  mutation verifyPublicBookingOtp($input: VerifyPublicBookingOtpInput!) {
    verifyPublicBookingOtp(input: $input) { booking_token }
  }
`)
