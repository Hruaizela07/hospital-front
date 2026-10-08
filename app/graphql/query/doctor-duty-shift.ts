import { gql } from '@apollo/client'

export const DOCTOR_DUTY_SHIFT_QUERY = gql(`
  query doctorDutyShifts($filter: DoctorDutyShiftFilterInput, $first: Int!, $page: Int) {
  doctorDutyShifts(filter: $filter, first: $first, page: $page) {
    data {
      id
      doctor {
        id
        department {
          id
          name
        }
        userName
        image {
          id
          name
          path
          url
        }
        specialization
      }
      duty_date
      start_time
      end_time
    }
    paginatorInfo {
      total
      lastPage
    }
  }
}  
    `)
