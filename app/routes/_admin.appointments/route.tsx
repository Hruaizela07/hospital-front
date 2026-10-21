import AppointmentsList from './appointments-List'

export default function Appointments() {
  return (
    <div className="
      my-4 flex max-w-80 flex-col gap-6
      md:mx-auto md:w-full md:max-w-170
      lg:max-w-390
    "
    >
      <AppointmentsList />
    </div>
  )
}
