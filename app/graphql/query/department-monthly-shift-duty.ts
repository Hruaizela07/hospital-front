import { gql } from '@apollo/client'

export const DEPARTMENT_MONTHLY_DUTY_SHIFTS = gql(`
  query departmentMonthlyDutyShifts($department_id: ID!, $year: Int!, $month: Int!) {
  departmentMonthlyDutyShifts(
    department_id: $department_id
    year: $year
    month: $month
  ) {
    department {
      id
      name
      doctors {
         id
        userName
      }
    }
    doctor {
      id
      userName
    }
    from_date
    to_date
    start_time
    end_time
    shift_count
  }
}  
    `)
