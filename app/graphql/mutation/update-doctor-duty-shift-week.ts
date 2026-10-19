import { gql } from '@apollo/client'

export const UPDATE_DOCTOR_DUTY_SHIFT_WEEK = gql(`
  mutation updateDoctorDutyShiftWeek($id: ID!, $input: UpdateShiftWeekInput!) {
    updateDoctorDutyShiftWeek(id: $id, input: $input) {
      id
      duty_date
      start_time
      end_time
    }
  }
`)
