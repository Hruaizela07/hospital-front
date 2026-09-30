import PatientList from './patient-list'

export default function Patients() {
  return (
    <div className="mx-auto my-4 flex w-full max-w-360 flex-col gap-6">
      <h1 className="text-2xl font-semibold">Patients</h1>
      <PatientList />
    </div>
  )
}
