import { compareAsc, endOfWeek, format, parseISO, startOfWeek } from 'date-fns'

const DUTY_WEEK_OPTIONS = { weekStartsOn: 1 } as const

export interface DutyDate {
  duty_date: string
}

export interface DutyWeekGroup<TDuty extends DutyDate> {
  duties: TDuty[]
  key: string
  label: string
}

function weekLabel(date: Date) {
  const weekStart = startOfWeek(date, DUTY_WEEK_OPTIONS)
  const weekEnd = endOfWeek(date, DUTY_WEEK_OPTIONS)

  return `${format(weekStart, 'MMM dd')} - ${format(weekEnd, 'MMM dd, yyyy')}`
}

export function groupDutiesByWeek<TDuty extends DutyDate>(duties: TDuty[]): Array<DutyWeekGroup<TDuty>> {
  const sortedDuties = [...duties].sort((left, right) =>
    compareAsc(parseISO(left.duty_date), parseISO(right.duty_date)),
  )
  const groups = new Map<string, DutyWeekGroup<TDuty>>()

  for (const duty of sortedDuties) {
    const dutyDate = parseISO(duty.duty_date)
    const weekStart = startOfWeek(dutyDate, DUTY_WEEK_OPTIONS)
    const key = format(weekStart, 'yyyy-MM-dd')

    if (!groups.has(key)) {
      groups.set(key, {
        duties: [],
        key,
        label: weekLabel(dutyDate),
      })
    }

    groups.get(key)?.duties.push(duty)
  }

  return [...groups.values()]
}
