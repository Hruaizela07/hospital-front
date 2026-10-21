import type { updateDutyWeekForm, updateDutyWeekInput } from './schema'
import type { DoctorDutyShiftsQuery, DoctorDutyShiftsQueryVariables, UpdateDoctorDutyShiftWeekMutation, UpdateDoctorDutyShiftWeekMutationVariables } from '~/gql/graphql'
import { useApolloClient, useMutation } from '@apollo/client'
import { zodResolver } from '@hookform/resolvers/zod'
import { addDays, format, parseISO, startOfWeek } from 'date-fns'
import { useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { Button } from '~/components/ui/button'
import { Calendar } from '~/components/ui/calendar'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '~/components/ui/dialog'
import { Field, FieldError, FieldGroup, FieldLabel } from '~/components/ui/field'
import { Input } from '~/components/ui/input'
import { UPDATE_DOCTOR_DUTY_SHIFT_WEEK } from '~/graphql/mutation/update-doctor-duty-shift-week'
import { DOCTOR_DUTY_SHIFT_QUERY } from '~/graphql/query/doctor-duty-shift'
import getSubmitErrorMessage from '~/lib/get-submit-error-message'
import { FULL_WEEKDAYS, updateDutyWeekSchema } from './schema'

export type DutyForUpdate = DoctorDutyShiftsQuery['doctorDutyShifts']['data'][number]

interface Props {
  duty: DutyForUpdate
  onUpdated?: () => void | Promise<void>
}

export default function UpdateDuty({ duty, onUpdated }: Props) {
  const client = useApolloClient()
  const [open, setOpen] = useState(false)
  const [loadingDays, setLoadingDays] = useState(false)
  const [daySelection, setDaySelection] = useState<'full' | 'custom' | null>(null)
  const [customDates, setCustomDates] = useState<Date[]>([])
  const weekStart = startOfWeek(parseISO(duty.duty_date), { weekStartsOn: 1 })
  const weekEnd = addDays(weekStart, 4)
  const defaults: updateDutyWeekInput = {
    id: duty.id,
    weekdays: [],
    start_time: duty.start_time,
    end_time: duty.end_time,
  }
  const form = useForm<updateDutyWeekInput, unknown, updateDutyWeekForm>({
    resolver: zodResolver(updateDutyWeekSchema),
    defaultValues: defaults,
  })
  const [updateWeek, { loading }] = useMutation<UpdateDoctorDutyShiftWeekMutation, UpdateDoctorDutyShiftWeekMutationVariables>(UPDATE_DOCTOR_DUTY_SHIFT_WEEK)
  const { errors, isSubmitting } = form.formState
  const busy = loading || isSubmitting || loadingDays

  const resetForm = () => {
    form.reset(defaults)
    setDaySelection(null)
    setCustomDates([])
  }

  const loadExistingDays = async () => {
    setLoadingDays(true)
    try {
      const response = await client.query<DoctorDutyShiftsQuery, DoctorDutyShiftsQueryVariables>({
        query: DOCTOR_DUTY_SHIFT_QUERY,
        variables: {
          filter: {
            doctor_id: duty.doctor.id,
            from_date: format(weekStart, 'yyyy-MM-dd'),
            to_date: format(weekEnd, 'yyyy-MM-dd'),
          },
          first: 100,
          page: 1,
        },
        fetchPolicy: 'network-only',
      })
      const dates = response.data.doctorDutyShifts.data
        .filter(shift => shift.doctor.id === duty.doctor.id)
        .map(shift => parseISO(shift.duty_date))
      const weekdays = [...new Set(dates.map(date => date.getDay() || 7))]
        .sort((first, second) => first - second)

      form.reset({ ...defaults, weekdays })
      setCustomDates(dates)
      setDaySelection(FULL_WEEKDAYS.every(day => weekdays.includes(day)) ? 'full' : 'custom')
    }
    catch (error) {
      toast.error(getSubmitErrorMessage(error))
      setOpen(false)
    }
    finally {
      setLoadingDays(false)
    }
  }

  const onSubmit = async (values: updateDutyWeekForm) => {
    try {
      const response = await updateWeek({
        variables: {
          id: duty.id,
          input: {
            weekdays: values.weekdays,
            start_time: values.start_time,
            end_time: values.end_time,
          },
        },
      })
      if (!response.data?.updateDoctorDutyShiftWeek) {
        toast.error('Duty shifts could not be updated. Please try again.')
        return
      }
    }
    catch (error) {
      toast.error(getSubmitErrorMessage(error))
      return
    }

    resetForm()
    setOpen(false)
    toast.success('Duty shifts updated successfully')

    try {
      await onUpdated?.()
    }
    catch {
      toast.error('Duty shifts were updated, but refreshing failed. Please reload the page.')
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
        if (nextOpen)
          void loadExistingDays()
      }}
    >
      <DialogTrigger render={<Button type="button" variant="outline" disabled={busy} />}>Edit</DialogTrigger>
      <DialogContent showCloseButton={!busy}>
        <DialogHeader className="mb-6">
          <DialogTitle>Edit Duty Week</DialogTitle>
          <DialogDescription>
            Update duty days and times for the week of
            {' '}
            {format(weekStart, 'PPP')}
            .
          </DialogDescription>
        </DialogHeader>
        <form noValidate onSubmit={form.handleSubmit(onSubmit)}>
          <FieldGroup>
            <Field>
              <FieldLabel>Doctor</FieldLabel>
              <p className="text-sm">{duty.doctor.userName}</p>
            </Field>
            <Field>
              <FieldLabel>Existing duty date</FieldLabel>
              <p className="text-sm">{format(parseISO(duty.duty_date), 'PPP')}</p>
            </Field>
            <Controller
              control={form.control}
              name="weekdays"
              render={({ field }) => (
                <Field data-invalid={!!errors.weekdays}>
                  <FieldLabel>Duty days</FieldLabel>
                  <p className="text-sm text-muted-foreground">
                    Select every day to keep in this duty week. Saving replaces the current days.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <Button
                      type="button"
                      variant={daySelection === 'full' ? 'default' : 'outline'}
                      disabled={busy}
                      onClick={() => {
                        setDaySelection('full')
                        setCustomDates([])
                        field.onChange([...FULL_WEEKDAYS])
                      }}
                    >
                      Full weekdays
                    </Button>
                    <Button
                      type="button"
                      variant={daySelection === 'custom' ? 'default' : 'outline'}
                      disabled={busy}
                      onClick={() => {
                        setDaySelection('custom')
                        setCustomDates([])
                        field.onChange([])
                      }}
                    >
                      Custom days
                    </Button>
                  </div>
                  {daySelection === 'custom' && (
                    <div className="rounded-md border p-2">
                      <Calendar
                        mode="multiple"
                        defaultMonth={weekStart}
                        disabled={date => date < weekStart || date > weekEnd}
                        selected={customDates}
                        onSelect={(dates) => {
                          const selectedDates = dates ?? []
                          const weekdays = [...new Set(selectedDates.map(date => date.getDay() || 7))]
                            .sort((first, second) => first - second)
                          setCustomDates(selectedDates)
                          field.onChange(weekdays)
                        }}
                      />
                      <p className="px-3 text-sm text-muted-foreground">
                        {field.value.length
                          ? `${field.value.map(weekday => format(addDays(weekStart, weekday - 1), 'EEEE')).join(', ')} selected`
                          : 'Select one or more weekdays.'}
                      </p>
                    </div>
                  )}
                  <FieldError errors={[errors.weekdays]} />
                </Field>
              )}
            />
            {([
              { name: 'start_time', label: 'Start Time' },
              { name: 'end_time', label: 'End Time' },
            ] as const).map(field => (
              <Field key={field.name} data-invalid={!!errors[field.name]}>
                <FieldLabel htmlFor={`edit-duty-${duty.id}-${field.name}`}>{field.label}</FieldLabel>
                <Input
                  id={`edit-duty-${duty.id}-${field.name}`}
                  type="time"
                  disabled={busy}
                  required
                  aria-invalid={!!errors[field.name]}
                  {...form.register(field.name)}
                />
                <FieldError errors={[errors[field.name]]} />
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
              <Button type="submit" disabled={busy || !form.getValues('weekdays').length}>
                {busy ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          </FieldGroup>
        </form>
      </DialogContent>
    </Dialog>
  )
}
