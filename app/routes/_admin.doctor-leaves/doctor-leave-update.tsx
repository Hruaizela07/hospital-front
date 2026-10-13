import type { updateDoctorLeaveForm, updateDoctorLeaveInput } from './schema'
import type { DoctorLeavesQuery, UdateDoctorLeaveMutation, UdateDoctorLeaveMutationVariables, UpdateDoctorLeaveInput } from '~/gql/graphql'
import { useMutation } from '@apollo/client'
import { zodResolver } from '@hookform/resolvers/zod'
import { format, isValid, parse } from 'date-fns'
import { CalendarIcon } from 'lucide-react'
import { useId, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { Button } from '~/components/ui/button'
import { Calendar } from '~/components/ui/calendar'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '~/components/ui/dialog'
import { Field, FieldError, FieldGroup, FieldLabel } from '~/components/ui/field'
import { Popover, PopoverContent, PopoverTrigger } from '~/components/ui/popover'
import { UPDATE_DOCTOR_LEAVE } from '~/graphql/mutation/update-doctor-leave'
import getSubmitErrorMessage from '~/lib/get-submit-error-message'
import { cn } from '~/lib/utils'
import { updateDoctorLeaveSchema } from './schema'

export type DoctorLeaveForUpdate = DoctorLeavesQuery['doctorLeaves']['data'][number]

interface Props {
  leave: DoctorLeaveForUpdate
  onUpdated?: (leave: UdateDoctorLeaveMutation['updateDoctorLeave']) => void | Promise<void>
}

function dateFromFormValue(value?: string) {
  if (!value)
    return undefined

  const date = parse(value, 'yyyy-MM-dd', new Date())

  return isValid(date) ? date : undefined
}

function toUpdateInput(values: updateDoctorLeaveForm): UpdateDoctorLeaveInput {
  return {
    end_date: values.end_date,
    start_date: values.start_date,
  }
}

export default function DoctorLeaveUpdate({ leave, onUpdated }: Props) {
  const [open, setOpen] = useState(false)
  const id = useId()
  const defaults: updateDoctorLeaveInput = {
    end_date: leave.end_date,
    id: leave.id,
    start_date: leave.start_date,
  }
  const form = useForm<updateDoctorLeaveInput, unknown, updateDoctorLeaveForm>({
    resolver: zodResolver(updateDoctorLeaveSchema),
    defaultValues: defaults,
  })
  const [updateLeave, { loading }] = useMutation<UdateDoctorLeaveMutation, UdateDoctorLeaveMutationVariables>(UPDATE_DOCTOR_LEAVE)
  const { errors, isSubmitting } = form.formState
  const busy = loading || isSubmitting

  const resetForm = () => {
    form.reset(defaults)
  }

  const onSubmit = async (values: updateDoctorLeaveForm) => {
    let updatedLeave: UdateDoctorLeaveMutation['updateDoctorLeave']

    try {
      const response = await updateLeave({ variables: { id: leave.id, input: toUpdateInput(values) } })
      if (!response.data?.updateDoctorLeave) {
        toast.error('Doctor leave could not be updated. Please try again.')
        return
      }
      updatedLeave = response.data.updateDoctorLeave
    }
    catch (error) {
      toast.error(getSubmitErrorMessage(error))
      return
    }

    resetForm()
    setOpen(false)
    toast.success('Doctor leave updated successfully')

    try {
      await onUpdated?.(updatedLeave)
    }
    catch {
      toast.error('Doctor leave was updated, but refreshing failed. Please reload the page.')
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        if (busy)
          return
        resetForm()
        setOpen(nextOpen)
      }}
    >
      <DialogTrigger render={<Button type="button" variant="outline" disabled={busy} />}>Edit</DialogTrigger>
      <DialogContent showCloseButton={!busy}>
        <DialogHeader className="mb-6">
          <DialogTitle>Edit Department</DialogTitle>
          <DialogDescription>Update the Department.</DialogDescription>
        </DialogHeader>
        <form noValidate onSubmit={form.handleSubmit(onSubmit)}>
          <FieldGroup>
            <div className="rounded-md border p-3 text-sm">
              <p className="font-medium">{leave.doctor.userName}</p>
              <p className="text-muted-foreground">
                {leave.doctor.department?.name ?? 'No department assigned'}
              </p>
            </div>
            {([
              { name: 'start_date', label: 'Start Date' },
              { name: 'end_date', label: 'End Date' },
            ] as const).map(dateField => (
              <Controller
                key={dateField.name}
                control={form.control}
                name={dateField.name}
                render={({ field }) => {
                  const selectedDate = dateFromFormValue(field.value)

                  return (
                    <Field data-invalid={!!errors[dateField.name]}>
                      <FieldLabel htmlFor={`${id}-${dateField.name}`}>{dateField.label}</FieldLabel>
                      <Popover>
                        <PopoverTrigger
                          render={(
                            <Button
                              id={`${id}-${dateField.name}`}
                              type="button"
                              variant="outline"
                              disabled={busy}
                              aria-invalid={!!errors[dateField.name]}
                              aria-describedby={errors[dateField.name] ? `${id}-${dateField.name}-error` : undefined}
                              className={cn(
                                'w-full justify-start text-left font-normal',
                                !field.value && 'text-muted-foreground',
                              )}
                            />
                          )}
                        >
                          <CalendarIcon className="size-4" />
                          {selectedDate ? format(selectedDate, 'PPP') : 'Pick a date'}
                        </PopoverTrigger>
                        <PopoverContent align="start" className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={selectedDate}
                            onSelect={(date) => {
                              field.onChange(date ? format(date, 'yyyy-MM-dd') : '')
                            }}
                          />
                        </PopoverContent>
                      </Popover>
                      <FieldError id={`${id}-${dateField.name}-error`} errors={[errors[dateField.name]]} />
                    </Field>
                  )
                }}
              />
            ))}
            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                disabled={busy}
                onClick={() => {
                  resetForm()
                  setOpen(false)
                }}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={busy}>
                {busy ? 'Updating...' : 'Update Leave'}
              </Button>
            </div>
          </FieldGroup>
        </form>
      </DialogContent>
    </Dialog>
  )
}
