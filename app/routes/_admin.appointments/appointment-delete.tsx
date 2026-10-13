import type { DeleteAppointmentMutation, DeleteAppointmentMutationVariables } from '~/gql/graphql'
import { useMutation } from '@apollo/client'
import { useState } from 'react'
import { toast } from 'sonner'
import ConfirmationDialog from '~/components/common/confirmation-dialog'
import { Button } from '~/components/ui/button'
import { DELETE_APPOINTMENT } from '~/graphql/mutation/delete-appointment'
import getSubmitErrorMessage from '~/lib/get-submit-error-message'

interface Props {
  onDeleted: () => void | Promise<void>
  aptm: {
    id: string
    name: string
  }
}

export default function AppointmentDelete({ onDeleted, aptm }: Props) {
  const [open, setOpen] = useState(false)

  const [deleteAptm, { loading }] = useMutation<DeleteAppointmentMutation, DeleteAppointmentMutationVariables>(DELETE_APPOINTMENT)

  const handleDelete = async () => {
    try {
      const response = await deleteAptm({
        variables: {
          id: aptm.id,
        },
      })
      if (!response.data?.deleteAppointment) {
        toast.error('Appointment could not be deleted. Please try again.')
        return
      }
    }
    catch (error) {
      toast.error(getSubmitErrorMessage(error, 'Unable to delete appointment'))
      return
    }
    setOpen(false)
    toast.success('Appointment deleted successfully')
    try {
      await onDeleted()
    }
    catch {
      toast.error('Appointment was deleted, but refreshing failed. Please reload the page.')
    }
  }

  return (
    <div>
      <Button type="button" variant="destructive" disabled={loading} onClick={() => setOpen(true)}>Delete</Button>
      <ConfirmationDialog
        open={open}
        title="Delete appointment"
        handleOpenChange={(nextOpen) => {
          if (!loading)
            setOpen(nextOpen)
        }}
        handleConfirm={handleDelete}
        isPending={loading}
        description={`Are you sure you want to delete ${aptm.name}?`}
      />
    </div>
  )
}
