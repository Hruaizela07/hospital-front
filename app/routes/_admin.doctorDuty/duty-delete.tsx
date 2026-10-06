import type { DeleteDoctorDutyShiftMutation, DeleteDoctorDutyShiftMutationVariables } from '~/gql/graphql'
import { useMutation } from '@apollo/client'
import { useState } from 'react'
import { toast } from 'sonner'
import ConfirmationDialog from '~/components/common/confirmation-dialog'
import { Button } from '~/components/ui/button'
import { DELETE_DOCTOR_DUTY_SHIFT } from '~/graphql/mutation/delete-doctor-duty-shift'
import getSubmitErrorMessage from '~/lib/get-submit-error-message'

interface Props {
  onDeleted: () => void | Promise<void>
  duty: {
    id: string
    label: string
  }
}

export default function DutyDelete({ onDeleted, duty }: Props) {
  const [open, setOpen] = useState(false)

  const [deleteDuty, { loading }] = useMutation<DeleteDoctorDutyShiftMutation, DeleteDoctorDutyShiftMutationVariables>(DELETE_DOCTOR_DUTY_SHIFT)

  const handleDelete = async () => {
    try {
      const response = await deleteDuty({
        variables: {
          id: duty.id,
        },
      })
      if (!response.data?.deleteDoctorDutyShift) {
        toast.error('Duty shift could not be deleted. Please try again.')
        return
      }
    }
    catch (error) {
      toast.error(getSubmitErrorMessage(error, 'Unable to delete duty shift'))
      return
    }
    setOpen(false)
    toast.success('Duty shift deleted successfully')
    try {
      await onDeleted()
    }
    catch {
      toast.error('Duty shift was deleted, but refreshing failed. Please reload the page.')
    }
  }

  return (
    <div>
      <Button type="button" variant="destructive" disabled={loading} onClick={() => setOpen(true)}>Delete</Button>
      <ConfirmationDialog
        open={open}
        title="Delete duty shift"
        handleOpenChange={(nextOpen) => {
          if (!loading)
            setOpen(nextOpen)
        }}
        handleConfirm={handleDelete}
        isPending={loading}
        description={`Are you sure you want to delete ${duty.label}?`}
      />
    </div>
  )
}
