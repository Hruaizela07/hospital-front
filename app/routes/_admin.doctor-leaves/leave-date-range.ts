import { format } from 'date-fns'

interface LeaveDateRange {
  from?: Date
  to?: Date
}

export function leaveRangeToFormValues(range?: LeaveDateRange) {
  return {
    end_date: range?.to ? format(range.to, 'yyyy-MM-dd') : '',
    start_date: range?.from ? format(range.from, 'yyyy-MM-dd') : '',
  }
}
