import PatientList from './patient-list'

export default function Patients() {
  return (
    <div className="
      my-4 flex max-w-82 flex-col gap-6
      md:mx-auto md:w-full md:max-w-170
      lg:max-w-390
    "
    >
      <h1 className="text-2xl font-semibold">Patients</h1>
      <PatientList />
    </div>
  )
}
