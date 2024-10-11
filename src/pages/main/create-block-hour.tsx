import { Button } from '../../components/ui/button'
import { Calendar } from '../../components/ui/calendar'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '../../components/ui/popover'
import { cn } from '../../lib/utils'
import { CalendarIcon } from 'lucide-react'
import { Helmet } from 'react-helmet-async'
import React from 'react'
import { format } from 'date-fns'
import { Label } from '../../components/ui/label'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../components/ui/select'
import moment from 'moment'
import { BlockType, getAllBlocks } from '../../services/blocks'
import {
  AvailableTimeType,
  getAvailableTime,
} from '../../services/blocks/available-time'
import { blockSchedule } from '../../services/scheduling/block-schedule'
import { useNavigate } from 'react-router-dom'

export default function CreateBlockHourPage() {
  const navigate = useNavigate()

  const [date, setDate] = React.useState<Date>()
  const [block, setBlock] = React.useState<BlockType[]>([])
  const [loadingBlock, setLoadingBlock] = React.useState<boolean>(true)
  const [blockId, setBlockId] = React.useState<string>('')
  const [loadingHour, setLoadingHour] = React.useState<boolean>(true)
  const [hour, setHour] = React.useState<AvailableTimeType[]>([])
  const [loading, setLoading] = React.useState<boolean>(false)
  const [hourSelected, setHourSelected] = React.useState<string>('')

  const getBlocks = async () => {
    setLoadingBlock(true)
    const response = await getAllBlocks({ page: '1' })

    if (response.blocks) {
      setBlock(response.blocks)
    }

    setLoadingBlock(false)
  }

  const getHours = async () => {
    setLoadingHour(true)
    const dateString = moment(date, 'ddd MMM DD YYYY HH:mm:ss ZZ').format(
      'DD/MM/YYYY',
    )

    const response = await getAvailableTime({ date: dateString, blockId })

    if (response.success && response.courtTimes) {
      const availableHours = response.courtTimes.filter(
        (hour) => hour.status === 'available',
      )
      setHour(availableHours)
    }

    setLoadingHour(false)
  }

  const createBlockHour = async () => {
    setLoading(true)
    const dateString = moment(date, moment.ISO_8601)
    const response = await blockSchedule({
      date: dateString,
      blockId,
      hour: hourSelected,
    })

    if (!response.success) {
      setLoading(false)
      return
    }
    setLoading(false)
    navigate('/b2b/agenda')
  }

  React.useEffect(() => {
    getBlocks()
  }, [])

  React.useEffect(() => {
    if (date && blockId) {
      getHours()
    }
  }, [date, blockId])

  return (
    <>
      <Helmet title="Agenda" />

      <div>
        <h1 className="mb-5 font-semibold">
          Selecione o dia para realizar o bloqueio bloqueio
        </h1>
        <div className="flex items-center gap-3">
          <div className=" flex flex-col">
            <Label className="mb-2 text-sm font-semibold">Dia</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={'outline'}
                  className={cn(
                    'w-[240px] justify-start text-left font-normal',
                    !date && 'text-muted-foreground',
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, 'PPP') : <span>Selecione um dia</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  disabled={(date) =>
                    date < moment().subtract(1, 'day').toDate()
                  }
                  initialFocus
                  lang="pt"
                />
              </PopoverContent>
            </Popover>
          </div>

          {!loadingBlock && (
            <>
              <div>
                <Label className="text-sm font-semibold">Quadra</Label>

                <Select onValueChange={(e) => setBlockId(e)}>
                  <SelectTrigger className="mt-2">
                    <SelectValue placeholder="Selecione a quadra para filtrar" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {block.map((type) => (
                        <SelectItem key={type.id} value={type.id}>
                          {type.name}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
            </>
          )}
          {hour.length > 0 && (
            <div>
              <Label className="text-sm font-semibold">
                Horário disponível para bloqueio
              </Label>

              {loadingHour ? (
                <>
                  <p>Carregando...</p>
                </>
              ) : (
                <>
                  <Select onValueChange={(e) => setHourSelected(e)}>
                    <SelectTrigger className="mt-2 w-full">
                      <SelectValue placeholder="Horários" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        {hour.map((type) => (
                          <SelectItem key={type.hour} value={type.hour}>
                            {type.hour}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </>
              )}
            </div>
          )}
        </div>
        <Button
          className="mt-10"
          disabled={!date || !blockId || !hourSelected || loading}
          onClick={createBlockHour}
        >
          Realizar bloqueio
        </Button>
      </div>
    </>
  )
}
