import { gql } from '@apollo/client'

export const PUBLIC_BOOKING_DEPARTMENTS = gql(`
  query publicBookingDepartments($first: Int!, $page: Int) {
    departments(first: $first, page: $page) {
      data { id name }
      paginatorInfo { lastPage }
    }
  }
`)
