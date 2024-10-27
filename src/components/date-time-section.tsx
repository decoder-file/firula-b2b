import { ChangeEvent } from 'react'
import { Switch } from './ui/switch'
import { Moon } from 'lucide-react'
import { Checkbox } from './ui/checkbox'
import { Input } from './ui/input'

type DateTimeSectionProps = {
  active: boolean
  title: string
  setActive: (active: boolean) => void
  setStartTime: (startTime: string) => void
  startTime: string
  setEndTime: (startTime: string) => void
  endTime: string
  isActiveDayUse: boolean
  valueForHour?: string
  setValueForHour: (value: string) => void
  setIsActiveDayUse: (isActiveDayUse: boolean) => void
}

export function DateTimeSection({
  active,
  title,
  setActive,
  setStartTime,
  setEndTime,
  startTime,
  endTime,
  isActiveDayUse,
  valueForHour,
  setValueForHour,
  setIsActiveDayUse,
}: DateTimeSectionProps) {
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.id === 'startTime') {
      setStartTime(e.target.value)
    } else {
      setEndTime(e.target.value)
    }
  }

  const handleDayUse = () => {
    setIsActiveDayUse(!isActiveDayUse)
  }

  return (
    <form>
      <div className="w-full items-center justify-between justify-items-center sm:flex">
        <div className="mb-2 mr-3 flex items-center justify-items-center">
          <Switch
            id="airplane-mode"
            checked={active}
            onCheckedChange={() => setActive(!active)}
          />
          <p className="ml-3 text-sm font-medium">{title}</p>
        </div>
        <div className="flex w-full justify-end gap-2">
          <div className="flex items-center gap-3">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="terms"
                checked={isActiveDayUse}
                onClick={handleDayUse}
              />
              <label
                htmlFor="terms"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                DayUse
              </label>
            </div>
            {isActiveDayUse && (
              <Input
                id="valueForHour"
                type="valueForHour"
                placeholder="Valor do DayUse"
                input={{
                  change: (val: string) => setValueForHour(val),
                  value: valueForHour,
                  // mask: maskReal,
                }}
              />
            )}
          </div>
          {active ? (
            <>
              <div className="grid w-full max-w-[35rem] grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="startTime"
                    className="mb-2 block text-xs font-medium text-gray-900 dark:text-white"
                  >
                    De:
                  </label>
                  <div className="relative">
                    <input
                      type="time"
                      id="startTime"
                      className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm leading-none text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                      min="09:00"
                      max="23:59"
                      value={startTime}
                      onChange={handleChange}
                      required
                    />
                    <div className="pointer-events-none absolute inset-y-0 end-0 top-0 flex items-center pe-3.5">
                      <svg
                        className="h-4 w-4 text-gray-500 dark:text-gray-400"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          fillRule="evenodd"
                          d="M2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10S2 17.523 2 12Zm11-4a1 1 0 1 0-2 0v4a1 1 0 0 0 .293.707l3 3a1 1 0 0 0 1.414-1.414L13 11.586V8Z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                  </div>
                </div>
                <div>
                  <label
                    htmlFor="endTime"
                    className="mb-2 block text-xs font-medium text-gray-900 dark:text-white"
                  >
                    Até:
                  </label>
                  <div className="relative">
                    <div className="pointer-events-none absolute inset-y-0 end-0 top-0 flex items-center pe-3.5">
                      <svg
                        className="h-4 w-4 text-gray-500 dark:text-gray-400"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          fillRule="evenodd"
                          d="M2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10S2 17.523 2 12Zm11-4a1 1 0 1 0-2 0v4a1 1 0 0 0 .293.707l3 3a1 1 0 0 0 1.414-1.414L13 11.586V8Z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <input
                      type="time"
                      id="endTime"
                      className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm leading-none text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                      min="09:00"
                      max="23:00"
                      value={endTime}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="flex w-full max-w-[35rem] items-center justify-items-center rounded-lg bg-slate-500 p-3">
                <Moon />
                <p className="ml-3 gap-4 text-sm font-normal">Fechado</p>
              </div>
            </>
          )}
        </div>
      </div>
    </form>
  )
}
