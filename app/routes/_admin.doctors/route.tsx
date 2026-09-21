import * as React from 'react'
import DoctorsAdd from './doctors-add'
import DoctorsList from './doctors-list'

export default function AdminDoctors() {
  return (
    <div className="flex w-full flex-col">
      <>
        <DoctorsAdd />
      </>
      <DoctorsList />
    </div>
  )
}
