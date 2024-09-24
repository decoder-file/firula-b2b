import { Button } from '../../components/ui/button'
import { Input } from '../../components/ui/input'
import { Label } from '../../components/ui/label'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../components/ui/select'
import { toast } from 'sonner'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { useCallback, useEffect, useState } from 'react'
import {
  getAllTypeBlock,
  TypeBlockType,
} from '../../services/blocks/type-block'
import { GetUrlImageType } from '../../services/image'
import { getUrlImage } from '../../services/image/get-url-image'
import axios from 'axios'
import { createBlock } from '../../services/blocks/create-block'
import { useNavigate } from 'react-router-dom'
import {
  translateSportToPortuguese,
  Sport,
  translateDiaWeek,
} from '../../utils/functions'
import { DateTimeSection } from '../../components/date-time-section'
import { capitalizeEachWord } from '../../utils/Mask'

const createBlockForm = z.object({
  name: z.string().min(1, 'Nome é obrigatório'),
  valueForHour: z.string().min(1, 'Valor por hora é obrigatório'),
})

type CreateBlockForm = z.infer<typeof createBlockForm>

const sport = [
  'SOCCER',
  'VOLLEYBALL',
  'BEACH_VOLLEY',
  'BASKETBALL',
  'FUTSAL',
  'TENNIS',
  'TABLE_TENNIS',
  'HANDBALL',
  'SWIMMING',
  'ATHLETICS',
  'SURFING',
  'JIU_JITSU',
  'BOXING',
  'MMA',
  'CAPOEIRA',
  'BEACH_SOCCER',
  'FOOTVOLLEY',
]

type DayState = {
  active: boolean
  startTime: string
  endTime: string
}

type DaysState = {
  monday: DayState
  tuesday: DayState
  wednesday: DayState
  thursday: DayState
  friday: DayState
  saturday: DayState
  sunday: DayState
}

const initialDayState: DayState = {
  active: false,
  startTime: '',
  endTime: '',
}

export function CreateBlockPage() {
  const navigate = useNavigate()

  const [typeBlock, setTypeBlock] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(false)
  const [imageUrl, setImageUrl] = useState<FileList | null>(null)
  const [typeBlockList, setTypeBlockList] = useState<TypeBlockType[]>([])
  const [loadingTypeBlock, setLoadingTypeBlock] = useState<boolean>(true)
  const [sports, setSports] = useState<string[]>([])
  const [days, setDays] = useState<DaysState>({
    monday: initialDayState,
    tuesday: initialDayState,
    wednesday: initialDayState,
    thursday: initialDayState,
    friday: initialDayState,
    saturday: initialDayState,
    sunday: initialDayState,
  })

  useEffect(() => {
    console.log('days', JSON.stringify(days))
  }, [days])

  const handleDayChange = useCallback(
    (day: keyof DaysState, newState: DayState) => {
      setDays((prevDays) => ({
        ...prevDays,
        [day]: newState,
      }))
    },
    [],
  )

  const {
    register,
    handleSubmit,
    formState: { isSubmitting, errors },
  } = useForm<CreateBlockForm>({
    resolver: zodResolver(createBlockForm),
  })

  const handleSelectSport = (sport: string) => {
    if (sports.includes(sport)) {
      setSports(sports.filter((item) => item !== sport))
    } else {
      setSports([...sports, sport])
    }
  }

  async function handleRegisterSportsFields(data: CreateBlockForm) {
    setLoading(true)
    if (sports.length === 0) {
      toast.error('Selecione pelo menos um esporte para continuar.')
      setLoading(false)

      return false
    }

    if (!typeBlock) {
      toast.error('Selecione o tipo da quadra para continuar.')
      setLoading(false)

      return false
    }
    setLoading(true)

    let imageBlock = ''
    if (imageUrl) {
      const responseImage: GetUrlImageType = (await getUrlImage(
        data.name.replace(/\s/g, '') + '_block',
      )) as GetUrlImageType

      imageBlock = responseImage.data.url

      await axios.put(responseImage.data.signedUrl, imageUrl[0], {
        headers: {
          'Content-Type': 'image/png',
        },
      })
    }

    const response = await createBlock({
      name: data.name,
      typeBlockId: typeBlock,
      valueForHour: data.valueForHour.replace('R$', ''),
      imageUrl: imageBlock,
      sports,
      openingHours: Object.entries(days).map(([day, values]) => ({
        dayOfWeek: day,
        startTime: values.startTime,
        endTime: values.endTime,
        active: values.active,
      })),
    })

    if (response.success) {
      setLoading(false)

      navigate('/b2b/blocks')
      return true
    }

    setLoading(false)
  }

  const fetchTypeBlock = async () => {
    setLoadingTypeBlock(true)
    const response = await getAllTypeBlock()

    if (response.success) {
      setTypeBlockList(response.typeBlock ?? [])
    }
    setLoadingTypeBlock(false)
  }

  function handleChoseImage(e: React.ChangeEvent<HTMLInputElement>) {
    setImageUrl(e.target.files)
  }

  useEffect(() => {
    fetchTypeBlock()
  }, [])

  return (
    <>
      <div>
        <h1 className=" text-lg font-semibold">Cadastrar quadras</h1>
        <h2 className="mb-5  text-sm ">
          Preencha o formulário abaixo para cadastrar as quadras disponíveis
          para aluguel.
        </h2>
      </div>

      <form
        className=" space-y-4"
        onSubmit={handleSubmit(handleRegisterSportsFields)}
      >
        <Label className="mb-1 text-sm font-semibold" htmlFor="lastName">
          Imagem da quadra
        </Label>
        <div className="mb-2 flex w-full items-center justify-center">
          <label
            htmlFor="dropzone-file"
            className="dark:hover:bg-bray-800 flex h-64 w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 hover:bg-gray-100 dark:border-gray-600 dark:bg-gray-700 dark:hover:border-gray-500 dark:hover:bg-gray-600"
          >
            <div className="flex flex-col items-center justify-center pb-6 pt-5">
              {imageUrl ? (
                <img
                  src={URL.createObjectURL(imageUrl[0])}
                  alt="Logo Firula"
                  className="h-20 w-20"
                />
              ) : (
                <svg
                  className="mb-4 h-8 w-8 text-gray-500 dark:text-gray-400"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 20 16"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                  />
                </svg>
              )}

              <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                <span className="font-semibold">
                  {imageUrl
                    ? 'Clique para alterar a imagem'
                    : 'Clique para carregar'}
                </span>
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                PNG ou JPG (MAX. 400x400px)
              </p>
            </div>
            <input
              id="dropzone-file"
              type="file"
              onChange={handleChoseImage}
              className="hidden"
            />
          </label>
        </div>
        <div className="w-full rounded-lg ">
          <div className="flex gap-2">
            <div className="w-full space-y-2">
              <Label className="text-sm font-semibold" htmlFor="name">
                Nome da quadra
              </Label>
              <Input
                id="name"
                {...register('name')}
                input={{
                  maxLength: 100,
                  change: (val: string) => val,
                  value: undefined,
                }}
              />
              {errors.name && (
                <span className="text-xs text-red-600">
                  {errors.name.message}
                </span>
              )}
            </div>

            <div className="w-full space-y-2">
              <Label className="text-sm font-semibold" htmlFor="lastName">
                Valor por hora
              </Label>
              <Input
                id="valueForHour"
                {...register('valueForHour')}
                input={{
                  maxLength: 100,
                  change: (val: string) => val,
                  value: undefined,
                }}
              />
              {errors.valueForHour && (
                <span className="text-xs text-red-600">
                  {errors.valueForHour.message}
                </span>
              )}
            </div>
          </div>
          <div className="mt-2 w-full">
            <Label className="text-sm font-semibold">Tipo da quadra</Label>
            {!loadingTypeBlock && (
              <Select onValueChange={(e) => setTypeBlock(e)}>
                <SelectTrigger className="mt-2">
                  <SelectValue placeholder="Selecione o tipo da quadra" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {typeBlockList.map((type) => (
                      <SelectItem key={type.id} value={type.id}>
                        {type.name}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            )}
          </div>

          <div className="mt-2 w-full">
            <Label className="text-sm font-semibold">
              Horário de funcionamento da quadra
            </Label>

            <div className="w-full justify-between p-4">
              {(
                [
                  'monday',
                  'tuesday',
                  'wednesday',
                  'thursday',
                  'friday',
                  'saturday',
                  'sunday',
                ] as (keyof DaysState)[]
              ).map((day, index) => (
                <div key={day}>
                  <DateTimeSection
                    active={days[day].active}
                    setActive={(active) =>
                      handleDayChange(day, { ...days[day], active })
                    }
                    title={translateDiaWeek(capitalizeEachWord(day))}
                    setEndTime={(times) =>
                      handleDayChange(day, { ...days[day], endTime: times })
                    }
                    setStartTime={(times) =>
                      handleDayChange(day, { ...days[day], startTime: times })
                    }
                    startTime={days[day].startTime}
                    endTime={days[day].endTime}
                  />
                  {index < 6 && <div className="mt-3" />}
                </div>
              ))}
            </div>
          </div>

          <div className="mt-2 w-full">
            <Label className="text-sm font-semibold">
              Selecione os esporte que sua quadra atende:
            </Label>

            <div className="grid grid-cols-3 gap-2 md:grid-cols-8">
              {sport.map((sport) => (
                <div
                  key={sport}
                  className=" mt-3"
                  onClick={() => handleSelectSport(sport)}
                >
                  <div
                    className={`items-center justify-center rounded-md ${sports.includes(sport) ? 'bg-primary' : 'bg-white'} cursor-pointer p-2`}
                  >
                    <p
                      className={`text-center text-xs  ${sports.includes(sport) ? 'text-white' : 'text-black'}`}
                    >
                      {translateSportToPortuguese(sport as Sport)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="mt-3 flex items-center justify-between">
          <Button
            type="submit"
            variant="default"
            disabled={isSubmitting || loading}
          >
            Cadastrar
          </Button>
        </div>
      </form>
    </>
  )
}
