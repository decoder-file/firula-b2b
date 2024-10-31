import { useEffect, useState } from 'react'
import { Minus, Plus } from 'lucide-react'
import { useNavigate, useParams } from 'react-router-dom'

import { Button } from '../../components/ui/button'
import { Label } from '../../components/ui/label'

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../components/ui/select'
import { Input } from '../../components/ui/input'
import { Checkbox } from '../../components/ui/checkbox'
import { createOpeningHours } from '../../services/blocks/create-opening-hours'
import { getOpeningHours } from '../../services/blocks/get-opening-hours'
import { ScreenLoading } from '../../components/screen-loading'

const daysOfTheWeek = [
  {
    id: 1,
    name: 'Segunda-feira',
    value: 'monday',
  },
  {
    id: 2,
    name: 'Terça-feira',
    value: 'tuesday',
  },
  {
    id: 3,
    name: 'Quarta-feira',
    value: 'wednesday',
  },
  {
    id: 4,
    name: 'Quinta-feira',
    value: 'thursday',
  },
  {
    id: 5,
    name: 'Sexta-feira',
    value: 'friday',
  },
  {
    id: 6,
    name: 'Sábado',
    value: 'saturday',
  },
  {
    id: 7,
    name: 'Domingo',
    value: 'sunday',
  },
]

type Block = {
  dayOfWeek: string
  priceForHour: string
  startTime: string
  endTime: string
  dayUseActive: boolean
  valueForHourDayUse: string
  active: boolean
}

export function CourtSchedulesPage() {
  const navigate = useNavigate()
  const { blockId } = useParams()

  const [loadingSendData, setLoadingSendData] = useState(false)
  const [loadingGetData, setLoadingGetData] = useState(true)

  const [blocks, setBlocks] = useState<Block[]>([
    {
      dayOfWeek: '',
      priceForHour: '',
      startTime: '',
      endTime: '',
      dayUseActive: false,
      valueForHourDayUse: '',
      active: true,
    },
  ])

  const addBlock = () => {
    setBlocks([
      ...blocks,
      {
        dayOfWeek: '',
        priceForHour: '',
        startTime: '',
        endTime: '',
        dayUseActive: false,
        valueForHourDayUse: '',
        active: true,
      },
    ])
  }

  const removeBlock = (index: number) => {
    if (blocks.length > 1) {
      setBlocks(blocks.filter((_, i) => i !== index))
    }
  }

  type BlockField =
    | 'dayOfWeek'
    | 'startTime'
    | 'endTime'
    | 'active'
    | 'priceForHour'
    | 'valueForHourDayUse'
    | 'dayUseActive'

  const handleChange = (
    index: number,
    field: BlockField,
    value: string | boolean,
  ) => {
    const newBlocks = [...blocks]
    if (field === 'dayUseActive') {
      newBlocks[index][field] = value as boolean
    } else {
      ;(newBlocks[index][field] as string | boolean) = value
    }
    setBlocks(newBlocks)
  }

  const handleSubmit = async () => {
    setLoadingSendData(true)

    const response = await createOpeningHours({
      companyBlockId: blockId ?? '',
      openingHours: blocks.map((block) => ({
        dayOfWeek: block.dayOfWeek,
        priceForHour: block.priceForHour
          ? block.priceForHour.replace(',', '')
          : '',
        startTime: block.startTime,
        endTime: block.endTime,
        dayUseActive: block.dayUseActive,
        valueForHourDayUse: block.valueForHourDayUse
          ? block.valueForHourDayUse.replace(',', '')
          : '',
        active: block.active,
      })),
    })

    if (!response.success) {
      setLoadingSendData(false)
      return
    }
    setLoadingSendData(false)
    navigate('/b2b/blocks')
  }

  const handleCurrencyChange = (
    e: string,
    index: number,
    typeValue: BlockField,
  ) => {
    const numericValue = e.replace(/\D/g, '')
    const formattedValue = (parseInt(numericValue, 10) / 100).toFixed(2)
    const maskedValue = formattedValue.replace('.', ',')
    handleChange(index, typeValue, maskedValue)
  }

  const fetchOpeningHours = async () => {
    setLoadingGetData(true)
    const response = await getOpeningHours({ companyBlockId: blockId ?? '' })

    if (!response.success) {
      setLoadingGetData(false)
      return
    }

    const newBlocks = response.openingHours?.map((block) => ({
      dayOfWeek: block.dayOfWeek,
      priceForHour: block.priceForHour,
      startTime: block.startTime,
      endTime: block.endTime,
      dayUseActive: block.dayUseActive,
      valueForHourDayUse: block.valueForHourDayUse,
      active: block.active,
    }))

    if (newBlocks && newBlocks?.length > 0) {
      setBlocks(newBlocks)
    }

    setLoadingGetData(false)
  }

  useEffect(() => {
    fetchOpeningHours()
  }, [])

  return (
    <>
      {loadingGetData ? (
        <ScreenLoading />
      ) : (
        <>
          <div>
            <h1 className=" text-lg font-semibold">
              Horários de funcionamento
            </h1>
            <h2 className="mb-5  text-sm ">
              Adicione abaixo os dias da semana e os respectivos horários em que
              a quadra estará aberta.
            </h2>
          </div>

          <div>
            {blocks.map((block, index) => (
              <div key={index} className="mb-5 rounded-md bg-slate-600 p-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="terms"
                      checked={block.dayUseActive}
                      onClick={() =>
                        handleChange(index, 'dayUseActive', !block.dayUseActive)
                      }
                    />
                    <label
                      htmlFor="terms"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      DayUse
                    </label>
                  </div>
                  <div>
                    <Button onClick={addBlock} variant="outline" size="icon">
                      <Plus className="h-4 w-4" />
                    </Button>
                    {index > 0 && (
                      <Button
                        onClick={() => removeBlock(index)}
                        variant="outline"
                        size="icon"
                        className="ml-1"
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>

                <div className="grid w-full grid-cols-2 gap-4 md:grid-cols-4">
                  <div>
                    <Label className="text-sm font-normal">Dia da semana</Label>

                    <Select
                      onValueChange={(e: string) =>
                        handleChange(index, 'dayOfWeek', e)
                      }
                      defaultValue={block.dayOfWeek}
                    >
                      <SelectTrigger className="h-12 w-full">
                        <SelectValue placeholder="Selecione o dia da semana" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          {daysOfTheWeek.map((type) => (
                            <SelectItem key={type.id} value={type.value}>
                              {type.name}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label className="text-sm font-normal">De:</Label>
                    <div className="relative">
                      <input
                        type="time"
                        id="startTime"
                        className="block h-12 w-full rounded-lg border border-gray-300 p-2.5 text-sm leading-none text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                        min="06:00"
                        max="23:59"
                        value={block.startTime}
                        onChange={(e) =>
                          handleChange(index, 'startTime', e.target.value)
                        }
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
                        className="block h-12 w-full rounded-lg border border-gray-300  p-2.5 text-sm leading-none text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                        min="06:00"
                        max="23:00"
                        value={block.endTime}
                        onChange={(e) =>
                          handleChange(index, 'endTime', e.target.value)
                        }
                      />
                    </div>
                  </div>
                  {block.dayUseActive ? (
                    <div>
                      <div>
                        <Label className="text-sm font-normal">
                          Valor do DayUse
                        </Label>

                        <Input
                          className="h-12 w-full"
                          id="valueForHourDayUse"
                          type="valueForHourDayUse"
                          placeholder="Valor do DayUse"
                          input={{
                            change: (e: string) =>
                              handleCurrencyChange(
                                e,
                                index,
                                'valueForHourDayUse',
                              ),
                            value: block.valueForHourDayUse,
                          }}
                        />
                      </div>
                    </div>
                  ) : (
                    <div>
                      <Label className="text-sm font-normal">
                        Valor por hora
                      </Label>

                      <Input
                        className="h-12 w-full"
                        id="priceForHour"
                        type="priceForHour"
                        placeholder="Valor por hora"
                        input={{
                          change: (e: string) =>
                            handleCurrencyChange(e, index, 'priceForHour'),
                          value: block.priceForHour,
                        }}
                      />
                    </div>
                  )}
                </div>
              </div>
            ))}

            <div className="mt-3 flex items-center justify-between">
              <Button
                type="submit"
                variant="default"
                onClick={handleSubmit}
                disabled={loadingSendData}
              >
                Salvar
              </Button>
            </div>
          </div>
        </>
      )}
    </>
  )
}
