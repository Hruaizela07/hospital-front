import { gql } from '@apollo/client'

export const DOCTOR_AVAILABLE_SLOT_QUERY = gql(`
query doctorAvailableSlots($filter: DoctorAvailableSlotFilterInput, $first: Int!, $page: Int) {
  doctorAvailableSlots(filter: $filter, first: $first, page: $page) {
    data {
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
    paginatorInfo {
      total
      lastPage
    }
  }
}
    `)
