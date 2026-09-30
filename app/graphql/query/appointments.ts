import { gql } from '@apollo/client'

export const APPOINTMENTS_QUERY = gql(`
  query appointments($filter: AppointmentFilterInput!, $first: Int!, $page: Int) {
  appointments(filter: $filter, first: $first, page: $page) {
    data {
      id
      patient {
        id
        name
        symptom
        phone
        email
        date_of_birth
        gender
      }
      doctor {
        id
        department {
          id
          name
        }
        userName
        image {
          id
          path
        }
        specialization
      }
      appointment_date
      status
      notes
      created_at
      updated_at
    }
    paginatorInfo {
      total
      lastPage
    }
  }
}  
 `)
