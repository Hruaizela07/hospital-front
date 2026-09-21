import type { Variable } from 'lucide-react'
import type { DoctorFormInput, DoctorFormValues } from './schema'
import type { CreateDoctorInput, CreateDoctorMutation, CreateDoctorMutationVariables, UpdateDoctorInput } from '~/gql/graphql'
import { useMutation } from '@apollo/client'
import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { Button } from '~/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTrigger } from '~/components/ui/dialog'
import { CREATE_DOCTOR } from '~/graphql/mutation/create-doctor'
import getSubmitErrorMessage from '~/lib/get-submit-error-message'
import { doctorSchema } from './schema'

interface Props {
  onCreated?: () => void | Promise<void>
}

function toInputMutation(values: DoctorFormValues): CreateDoctorInput {
  return {
    email: values.email,
    password: values.password,
    userName: values.userName,
    specialization: values.specialization,
    image: undefined,
    department_id: values.department_Id,
  }
}

export default function DoctorsAdd({ onCreated }: Props) {
  const [open, setOpen] = useState(false)

  const form = useForm<DoctorFormInput, DoctorFormValues>({
    resolver: zodResolver(doctorSchema),
    defaultValues: {
      userName: '',
      email: '',
      password: '',
      specialization: '',
      department_Id: '',
    },
  })

  const [doctorAdd, { data, error, loading }] = useMutation<CreateDoctorMutation, CreateDoctorMutationVariables>(CREATE_DOCTOR)

  const onSubmit = async (values: DoctorFormValues) => {
    try {
      const response = await doctorAdd({
        variables: {
          input: toInputMutation(values),
        },
      })

      if (response.data?.createDoctor) {
        // const updateInput:UpdateDoctorInput = {}
        form.reset()
        await onCreated?.()
        setOpen(false)
        toast.success('Created Successfully')
      }
    }
    catch (submitError) {
      console.error(submitError)
      toast.error(getSubmitErrorMessage(submitError))
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button />}>
        ADD DOCTOR
      </DialogTrigger>
      <DialogContent>
        <DialogHeader></DialogHeader>
        <form onSubmit={form.handleSubmit(onSubmit)}>

        </form>
      </DialogContent>
    </Dialog>
  )
}
