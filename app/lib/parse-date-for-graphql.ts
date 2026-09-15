import { format } from 'date-fns'

export function parseDateForGraphQL(date: string | Date): string {
  return format(new Date(date), 'yyyy-MM-dd HH:mm:ss')
}
