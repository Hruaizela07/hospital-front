import { gql } from '@apollo/client'

export const DEPARTMENT_WITH_DOCTOR_QUERY = gql(`
    query DepartmentsWithDoctors {
  departments(first: 100) {
    data {
      id
      name
      doctors {
        id
        userName
        specialization
      }
    }
  }
}
    
    `)
