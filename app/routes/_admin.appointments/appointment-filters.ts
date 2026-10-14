import type { AppointmentsQuery } from '~/gql/graphql'

type Appointment = AppointmentsQuery['appointments']['data'][number]

export interface AppointmentListFilters {
  endDay: string
  search: string
  startDay: string
}

const dateTimeSeparator = /[T ]/

function appointmentDay(value: string | null | undefined) {
  return value?.split(dateTimeSeparator)[0] ?? ''
}

function matchesSearch(search: string, values: Array<string | null | undefined>) {
  const query = search.trim().toLowerCase()

  if (!query)
    return true

  return values.some(value => value?.toLowerCase().includes(query))
}

function matchesDateRange(appointment: Pick<Appointment, 'appointment_date'>, filters: AppointmentListFilters) {
  const day = appointmentDay(appointment.appointment_date)

  if (!day)
    return !filters.startDay && !filters.endDay

  if (filters.startDay && day < filters.startDay)
    return false

  if (filters.endDay && day > filters.endDay)
    return false

  return true
}

export function filterAppointments(appointments: Appointment[], filters: AppointmentListFilters) {
  return appointments.filter(appointment => (
    matchesDateRange(appointment, filters)
    && matchesSearch(filters.search, [
      appointment.doctor?.userName,
      appointment.doctor?.department?.name,
      appointment.doctor?.specialization,
      appointment.patient?.name,
      appointment.patient?.email,
      appointment.patient?.phone,
      appointment.patient?.symptom,
      appointment.status,
      appointment.notes,
    ])
  ))
}
