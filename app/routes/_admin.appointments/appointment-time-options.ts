export function formatAppointmentTime(time: string) {
  const [hour, minute] = time.split(':').map(Number)
  const period = timePeriod(time)
  const displayHour = hour % 12 || 12

  return `${displayHour}:${String(minute).padStart(2, '0')} ${period}`
}

export function timePeriod(time: string) {
  return Number(time.split(':')[0]) < 12 ? 'AM' : 'PM'
}

export const APPOINTMENT_TIME_OPTIONS = Array.from({ length: 48 }, (_, index) => {
  const hour = Math.floor(index / 2)
  const minute = index % 2 * 30
  const value = `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`

  return { value, label: formatAppointmentTime(value) }
})
