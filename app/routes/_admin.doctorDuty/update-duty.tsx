import type { updateDoctorDutyForm, updateDoctorDutyInput } from './schema'
import type { DoctorsQuery, DoctorsQueryVariables, UpdateDoctorDutyShiftMutation, UpdateDoctorDutyShiftMutationVariables, UpdateShiftInput } from '~/gql/graphql'
import { useMutation, useQuery } from '@apollo/client'
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
import { Input } from '~/components/ui/input'
import { Popover, PopoverContent, PopoverTrigger } from '~/components/ui/popover'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '~/components/ui/select'
import { UPDATE_DOCTOR_DUTY_SHIFT } from '~/graphql/mutation/update-doctor-duty-shift'
import { DOCTORS_QUERY } from '~/graphql/query/doctors'
import getSubmitErrorMessage from '~/lib/get-submit-error-message'
import { cn } from '~/lib/utils'
import { updateDutySchema } from './schema'

export interface DutyForUpdate {
  doctor: {
    id: string
    userName: string
  }
  duty_date: string
  end_time: string
  id: string
  start_time: string
}

interface Props {
  duty: DutyForUpdate
  onUpdated?: (duty: UpdateDoctorDutyShiftMutation['updateDoctorDutyShift']) => void | Promise<void>
}

function dateFromFormValue(value?: string) {
  if (!value)
    return undefined

  const date = parse(value, 'yyyy-MM-dd', new Date())

  return isValid(date) ? date : undefined
}

function toInputMutation(values: updateDoctorDutyForm): UpdateShiftInput {
  return {
    doctor_id: values.doctor_id,
    duty_date: values.duty_date,
    end_time: values.end_time,
    start_time: values.start_time,
  }
}

export default function UpdateDuty({ duty, onUpdated }: Props) {
  const [open, setOpen] = useState(false)
  const id = useId()
  const defaults: updateDoctorDutyInput = {
    id: duty.id,
    doctor_id: duty.doctor.id,
    duty_date: duty.duty_date,
    end_time: duty.end_time,
    start_time: duty.start_time,
  }
  const form = useForm<updateDoctorDutyInput, unknown, updateDoctorDutyForm>({
    resolver: zodResolver(updateDutySchema),
    defaultValues: defaults,
  })
  const [updateDuty, { loading }] = useMutation<UpdateDoctorDutyShiftMutation, UpdateDoctorDutyShiftMutationVariables>(UPDATE_DOCTOR_DUTY_SHIFT)
  const doctors = useQuery<DoctorsQuery, DoctorsQueryVariables>(DOCTORS_QUERY, {
    variables: { first: 100, page: 1 },
    skip: !open,
    fetchPolicy: 'cache-and-network',
    notifyOnNetworkStatusChange: true,
  })
  const doctorOptions = [...new Map([
    duty.doctor,
    ...(doctors.data?.doctors.data ?? []),
  ].map(doctor => [doctor.id, doctor])).values()]
  const { errors, isSubmitting } = form.formState
  const busy = loading || isSubmitting

  const resetForm = () => {
    form.reset(defaults)
  }

  const onSubmit = async (values: updateDoctorDutyForm) => {
    let updatedDuty: UpdateDoctorDutyShiftMutation['updateDoctorDutyShift']

    try {
      const response = await updateDuty({ variables: { id: duty.id, input: toInputMutation(values) } })
      if (!response.data?.updateDoctorDutyShift) {
        toast.error('Duty shift could not be updated. Please try again.')
        return
      }
      updatedDuty = response.data.updateDoctorDutyShift
    }
    catch (error) {
      toast.error(getSubmitErrorMessage(error))
      return
    }

    resetForm()
    setOpen(false)
    toast.success('Duty shift updated successfully')

    try {
      await onUpdated?.(updatedDuty)
    }
    catch {
      toast.error('Duty shift was updated, but refreshing failed. Please reload the page.')
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
          <DialogTitle>Edit Duty Shift</DialogTitle>
          <DialogDescription>Update the doctor, duty date, and time window.</DialogDescription>
        </DialogHeader>
        <form noValidate onSubmit={form.handleSubmit(onSubmit)}>
          <FieldGroup>
            <Controller
              control={form.control}
              name="doctor_id"
              render={({ field }) => (
                <Field data-invalid={!!errors.doctor_id}>
                  <FieldLabel htmlFor={`${id}-doctor`}>Doctor</FieldLabel>
                  <Select
                    items={doctorOptions.map(doctor => ({ value: doctor.id, label: doctor.userName }))}
                    value={field.value || null}
                    onValueChange={value => field.onChange(value ?? '')}
                    disabled={busy || doctors.loading || !doctorOptions.length}
                  >
                    <SelectTrigger
                      id={`${id}-doctor`}
                      ref={field.ref}
                      onBlur={field.onBlur}
                      className="w-full"
                      aria-required="true"
                      aria-invalid={!!errors.doctor_id}
                      aria-describedby={errors.doctor_id ? `${id}-doctor-error` : undefined}
                    >
                      <SelectValue placeholder="Select a doctor" />
                    </SelectTrigger>
                    <SelectContent>
                      {doctorOptions.map(doctor => <SelectItem key={doctor.id} value={doctor.id}>{doctor.userName}</SelectItem>)}
                    </SelectContent>
                  </Select>
                  <FieldError id={`${id}-doctor-error`} errors={[errors.doctor_id]} />
                  {doctors.error && (
                    <p role="alert" className="text-sm text-destructive">Could not load doctors.</p>
                  )}
                </Field>
              )}
            />
            <Controller
              control={form.control}
              name="duty_date"
              render={({ field }) => {
                const selectedDate = dateFromFormValue(field.value)

                return (
                  <Field data-invalid={!!errors.duty_date}>
                    <FieldLabel htmlFor={`${id}-duty_date`}>Duty Date</FieldLabel>
                    <Popover>
                      <PopoverTrigger
                        render={(
                          <Button
                            id={`${id}-duty_date`}
                            type="button"
                            variant="outline"
                            disabled={busy}
                            aria-invalid={!!errors.duty_date}
                            aria-describedby={errors.duty_date ? `${id}-duty_date-error` : undefined}
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
                    <FieldError id={`${id}-duty_date-error`} errors={[errors.duty_date]} />
                  </Field>
                )
              }}
            />
            {([
              { name: 'start_time', label: 'Start Time', type: 'time' },
              { name: 'end_time', label: 'End Time', type: 'time' },
            ] as const).map(field => (
              <Field key={field.name} data-invalid={!!errors[field.name]}>
                <FieldLabel htmlFor={`${id}-${field.name}`}>{field.label}</FieldLabel>
                <Input
                  id={`${id}-${field.name}`}
                  type={field.type}
                  disabled={busy}
                  required
                  aria-invalid={!!errors[field.name]}
                  aria-describedby={errors[field.name] ? `${id}-${field.name}-error` : undefined}
                  {...form.register(field.name)}
                />
                <FieldError id={`${id}-${field.name}-error`} errors={[errors[field.name]]} />
              </Field>
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
              <Button type="submit" disabled={busy || doctors.loading || !doctorOptions.length}>
                {busy ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          </FieldGroup>
        </form>
      </DialogContent>
    </Dialog>
  )
}
