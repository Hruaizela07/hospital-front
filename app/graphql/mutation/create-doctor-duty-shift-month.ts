import { gql } from '@apollo/client'

export const DOCTOR_DUTY_SHIFT_FOR_MONTH = gql(`
 mutation createDoctorDutyShiftsForMonth($input: CreateMonthlyShiftInput!) {
  createDoctorDutyShiftsForMonth(input: $input) {
    id
    doctor {
      id
      department {
        id
        name
      }
      userName
      image{
        id
        url
      }
    }
    duty_date
    start_time
    end_time
  }
}   
    `)
