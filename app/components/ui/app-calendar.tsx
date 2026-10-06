import { format } from 'date-fns'
import { useState } from 'react'
import { DayPicker, getDefaultClassNames } from 'react-day-picker'
import { Button, buttonVariants } from '~/components/ui/button'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '~/components/ui/popover'
import { cn } from '~/lib/utils'

interface Props {
  date: string | null
  setDate: (date: string | null) => void
  buttonClassName?: string
  className?: string
  variant?: 'link'
  closeSheet?: () => void
}

export default function AppCalendar({
  date,
  setDate,
  className,
  buttonClassName,
  variant,
  closeSheet,
}: Props) {
  const [openCalendar, setOpenCalendar] = useState(false)
  const [month, setMonth] = useState<Date>(() => {
    return date ? new Date(date) : new Date()
  })

  const calendarDate = date ? new Date(date) : undefined

  const defaultClassNames = getDefaultClassNames()

  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      const formattedDate = format(date, 'yyyy-MM-dd')
      setDate(formattedDate)
    }
    else {
      setDate(null)
    }
    setOpenCalendar(false)
    closeSheet && closeSheet()
  }

  return (
    <Popover
      modal={true}
      open={openCalendar}
      onOpenChange={setOpenCalendar}
    >
      <PopoverTrigger
        render={(
          <Button
            variant={variant ? 'link' : 'outline'}
            className={cn(
              `
                h-5/6 w-full justify-center text-left text-xs font-normal
                text-black
              `,
              !date && 'text-muted-foreground',
              buttonClassName,
            )}
          />
        )}
      >
        {calendarDate
          ? (
              <>
                <span
                  className={`
                    hidden
                    lg:block
                  `}
                >
                  {format(calendarDate, 'do MMMM yyyy')}
                </span>
                <span className="lg:hidden">
                  {format(calendarDate, 'do MMM yyyy')}
                </span>
              </>
            )
          : (
              <span>Pick a date</span>
            )}
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <DayPicker
          showOutsideDays={false}
          mode="single"
          selected={calendarDate}
          onSelect={handleDateSelect}
          month={month}
          modifiers={{
            disabled: [
              { before: new Date('2015-01-01') },
              { after: new Date() },
            ],
          }}
          onMonthChange={setMonth}
          className={cn('p-1', className)}
          classNames={{
            months: 'flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0',
            month: 'space-y-4 flex flex-col w-full',
            caption_label: 'text-sm font-medium',
            nav: cn(
              `
                pointer-events-none absolute inset-x-0 top-0 flex w-full
                items-center justify-between gap-1
              `,
              defaultClassNames.nav,
            ),
            button_previous: cn(
              buttonVariants({ variant: 'outline' }),
              `
                pointer-events-auto m-1 size-7 bg-transparent p-0 text-black
                select-none
                aria-disabled:opacity-50
              `,
              defaultClassNames.button_previous,
            ),
            button_next: cn(
              buttonVariants({ variant: 'outline' }),
              `
                pointer-events-auto m-1 size-7 bg-transparent p-0 text-black
                select-none
                aria-disabled:opacity-50
              `,
              defaultClassNames.button_next,
            ),
            month_caption: cn(
              `
                flex h-[--cell-size] w-full items-center justify-center
                px-[--cell-size]
              `,
              defaultClassNames.month_caption,
            ),
            month_grid: 'w-full border-collapse space-y-1',
            weekdays: 'flex',
            weekday: 'text-muted-foreground rounded-md w-9 font-normal text-[0.8rem]',
            week: 'flex w-full mt-2',
            day: 'h-9 w-9 text-center text-sm p-0 relative [&:has([aria-selected].day-range-end)]:rounded-r-md [&:has([aria-selected].day-outside)]:bg-accent/50 [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20',
            day_button: cn(
              buttonVariants({ variant: 'ghost' }),
              `
                size-9 p-0 font-normal
                aria-selected:opacity-100
              `,
            ),
            range_end: 'day-range-end',
            selected: 'bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground rounded-md',
            today: 'bg-accent text-accent-foreground',
            outside: 'day-outside text-muted-foreground opacity-50 aria-selected:bg-accent/50 aria-selected:text-muted-foreground aria-selected:opacity-30',
            disabled: 'text-muted-foreground opacity-50',
            range_middle: 'aria-selected:bg-accent aria-selected:text-accent-foreground',
            hidden: 'invisible',
          }}
        />
      </PopoverContent>
    </Popover>
  )
}
