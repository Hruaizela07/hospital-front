import type { DoctorDutyShiftsQuery, UpdateDoctorDutyShiftMutation, UpdateDoctorDutyShiftMutationVariables } from '~/gql/graphql'
import { useMutation } from '@apollo/client'
import { useState } from 'react'
import { toast } from 'sonner'
import { Button } from '~/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '~/components/ui/dialog'
import { Field, FieldGroup, FieldLabel } from '~/components/ui/field'
import { Input } from '~/components/ui/input'
import { UPDATE_DOCTOR_DUTY_SHIFT } from '~/graphql/mutation/update-doctor-duty-shift'
import getSubmitErrorMessage from '~/lib/get-submit-error-message'

type Duty = DoctorDutyShiftsQuery['doctorDutyShifts']['data'][number]

export default function EditDutyTime({ duty, onUpdated }: { duty: Duty, onUpdated: () => void | Promise<void> }) {
  const [open, setOpen] = useState(false)
  const [start, setStart] = useState(duty.start_time.slice(0, 5))
  const [end, setEnd] = useState(duty.end_time.slice(0, 5))
  const [update, { loading }] = useMutation<UpdateDoctorDutyShiftMutation, UpdateDoctorDutyShiftMutationVariables>(UPDATE_DOCTOR_DUTY_SHIFT)

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (end <= start) {
      toast.error('End time must be after start time.')
      return
    }
    try {
      await update({ variables: { id: duty.id, input: { start_time: `${start}:00`, end_time: `${end}:00` } } })
      setOpen(false)
      toast.success('Duty timing updated.')
      await onUpdated()
    }
    catch (error) {
      toast.error(getSubmitErrorMessage(error))
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button type="button" variant="outline" />}>Edit timing</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit duty timing</DialogTitle>
          <DialogDescription>
            {duty.duty_date}
            {' '}
            ·
            {' '}
            {duty.doctor.userName}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={submit}>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor={`start-${duty.id}`}>Start time</FieldLabel>
              <Input id={`start-${duty.id}`} type="time" value={start} onChange={event => setStart(event.target.value)} required />
            </Field>
            <Field>
              <FieldLabel htmlFor={`end-${duty.id}`}>End time</FieldLabel>
              <Input id={`end-${duty.id}`} type="time" value={end} onChange={event => setEnd(event.target.value)} required />
            </Field>
            <Button type="submit" disabled={loading}>{loading ? 'Saving...' : 'Save timing'}</Button>
          </FieldGroup>
        </form>
      </DialogContent>
    </Dialog>
  )
}
