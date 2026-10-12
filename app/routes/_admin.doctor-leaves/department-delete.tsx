import type { DeleteDoctorLeaveMutation, DeleteDoctorLeaveMutationVariables } from '~/gql/graphql'
import { useMutation } from '@apollo/client'
import { useState } from 'react'
import { toast } from 'sonner'
import ConfirmationDialog from '~/components/common/confirmation-dialog'
import { Button } from '~/components/ui/button'
import { DELETE_DOCTOR_LEAVE } from '~/graphql/mutation/delete-doctor-leave'
import getSubmitErrorMessage from '~/lib/get-submit-error-message'

interface Props {
  onDeleted: () => void | Promise<void>
  doctorLeave: {
    id: string
    name: string
  }
}

export default function DoctorLeaveDelete({ onDeleted, doctorLeave }: Props) {
  const [open, setOpen] = useState(false)

  const [deleteLeave, { loading }] = useMutation<DeleteDoctorLeaveMutation, DeleteDoctorLeaveMutationVariables>(DELETE_DOCTOR_LEAVE)

  const handleDelete = async () => {
    try {
      const response = await deleteLeave({
        variables: {
          id: doctorLeave.id,
        },
      })
      if (!response.data?.deleteDoctorLeave) {
        toast.error('Doctor Leave could not be deleted. Please try again.')
        return
      }
    }
    catch (error) {
      toast.error(getSubmitErrorMessage(error, 'Unable to delete Doctor Leave'))
      return
    }
    setOpen(false)
    toast.success('Doctor Leave deleted successfully')
    try {
      await onDeleted()
    }
    catch {
      toast.error('Doctor Leave was deleted, but refreshing failed. Please reload the page.')
    }
  }

  return (
    <div>
      <Button type="button" variant="destructive" disabled={loading} onClick={() => setOpen(true)}>Delete</Button>
      <ConfirmationDialog
        open={open}
        title="Delete doctor leave"
        handleOpenChange={(nextOpen) => {
          if (!loading)
            setOpen(nextOpen)
        }}
        handleConfirm={handleDelete}
        isPending={loading}
        description={`Are you sure you want to delete ${doctorLeave.name}?`}
      />
    </div>
  )
}
