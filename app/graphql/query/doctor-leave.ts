import { gql } from '@apollo/client'

export const DOCTOR_LEAVE_QUERY = gql(`
query doctorLeaves($filter: DoctorLeaveFilterInput!,$first: Int!,$page: Int) {
  doctorLeaves(filter: $filter, first: $first, page: $page) {
     data {
    id
    doctor{
      id
      department{
        id
        name
      }
      specialization
      userName
      email
      image{
        id
        url
        path
      }
    }
    start_date
    end_date
     }
     paginatorInfo {
      currentPage
      lastPage
      total
    }
  }
}
    `)
