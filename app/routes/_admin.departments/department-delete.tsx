import type { DeleteDepartmentMutation, DeleteDepartmentMutationVariables } from '~/gql/graphql'
import { useMutation } from '@apollo/client'
import { useState } from 'react'
import { toast } from 'sonner'
import ConfirmationDialog from '~/components/common/confirmation-dialog'
import { Button } from '~/components/ui/button'
import { DELETE_DEPARTMENT } from '~/graphql/mutation/delete-department'
import getSubmitErrorMessage from '~/lib/get-submit-error-message'

interface Props {
  onDeleted: () => void | Promise<void>
  departM: {
    id: string
    name: string
  }
}

export default function DepartmentDelete({ onDeleted, departM }: Props) {
  const [open, setOpen] = useState(false)

  const [deleteDp, { loading }] = useMutation<DeleteDepartmentMutation, DeleteDepartmentMutationVariables>(DELETE_DEPARTMENT)

  const handleDelete = async () => {
    try {
      const response = await deleteDp({
        variables: {
          id: departM.id,
        },
      })
      if (!response.data?.deleteDepartment) {
        toast.error('Department could not be deleted. Please try again.')
        return
      }
    }
    catch (error) {
      toast.error(getSubmitErrorMessage(error, 'Unable to delete department'))
      return
    }
    setOpen(false)
    toast.success('Department deleted successfully')
    try {
      await onDeleted()
    }
    catch {
      toast.error('Department was deleted, but refreshing failed. Please reload the page.')
    }
  }

  return (
    <div>
      <Button type="button" variant="destructive" disabled={loading} onClick={() => setOpen(true)}>Delete</Button>
      <ConfirmationDialog
        open={open}
        title="Delete department"
        handleOpenChange={(nextOpen) => {
          if (!loading)
            setOpen(nextOpen)
        }}
        handleConfirm={handleDelete}
        isPending={loading}
        description={`Are you sure you want to delete ${departM.name}?`}
      />
    </div>
  )
}
