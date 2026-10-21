import DoctorLeavesList from './doctor-leaves-list'

export default function DoctorLeaves() {
  return (
    <div className="
      my-4 flex max-w-80 flex-col gap-6
      md:mx-auto md:w-full md:max-w-170
      lg:max-w-390
    "
    >
      <div><DoctorLeavesList /></div>
    </div>
  )
}
