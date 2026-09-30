import { gql } from '@apollo/client'

export const APPOINTMENT_QUERY = gql(`
   query appointment($id: ID!) {
  appointment(id: $id) {
    id
    patient {
      id
      name
      symptom
      phone
      date_of_birth
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
} 
    `)
