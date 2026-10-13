import type { DeleteDoctorMutation, DeleteDoctorMutationVariables } from '~/gql/graphql'
import { useMutation } from '@apollo/client'
import { useState } from 'react'
import { toast } from 'sonner'
import ConfirmationDialog from '~/components/common/confirmation-dialog'
import { Button } from '~/components/ui/button'
import { DELETE_DOCTOR } from '~/graphql/mutation/delete-doctor'
import getSubmitErrorMessage from '~/lib/get-submit-error-message'

interface Props {
  onDeleted: () => void | Promise<void>
  doctor: {
    id: string
    userName: string
  }
}

export default function DoctorDelete({ onDeleted, doctor }: Props) {
  const [open, setOpen] = useState(false)

  const [deleteDoctor, { loading }] = useMutation<DeleteDoctorMutation, DeleteDoctorMutationVariables>(DELETE_DOCTOR)

  const handleDelete = async () => {
    try {
      const response = await deleteDoctor({
        variables: {
          id: doctor.id,
        },
      })
      if (!response.data?.deleteDoctor) {
        toast.error('Doctor could not be deleted. Please try again.')
        return
      }
    }
    catch (error) {
      toast.error(getSubmitErrorMessage(error, 'Unable to delete Doctor '))
      return
    }
    setOpen(false)
    toast.success('Doctor  deleted successfully')
    try {
      await onDeleted()
    }
    catch {
      toast.error('Doctor  was deleted, but refreshing failed. Please reload the page.')
    }
  }

  return (
    <div>
      <Button type="button" variant="destructive" disabled={loading} onClick={() => setOpen(true)}>Delete</Button>
      <ConfirmationDialog
        open={open}
        title="Delete doctor "
        handleOpenChange={(nextOpen) => {
          if (!loading)
            setOpen(nextOpen)
        }}
        handleConfirm={handleDelete}
        isPending={loading}
        description={`Are you sure you want to delete ${doctor.userName}?`}
      />
    </div>
  )
}
