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
import { useNavigate, useParams } from 'react-router-dom'
import {
  translateSportToPortuguese,
  Sport,
  translateDiaWeek,
} from '../../utils/functions'
import { DateTimeSection } from '../../components/date-time-section'
import { capitalizeEachWord, maskReal } from '../../utils/Mask'
import { getBlockById } from '../../services/blocks/get-block-by-id'
import { ScreenLoading } from '../../components/screen-loading'
import { updateBlocks } from '../../services/blocks'

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
  'HANDBALL',
  'FOOTVOLLEY',
  'BEACH_TENNIS',
  'PETECA',
]

type DayState = {
  active: boolean
  startTime: string
  endTime: string
  isActiveDayUse: boolean
  valueForHour: string
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
  valueForHour: '',
  isActiveDayUse: false,
}

export function EditBlockPage() {
  const navigate = useNavigate()
  const { blockId } = useParams()

  const [loading, setLoading] = useState<boolean>(false)
  const [loadingBlock, setLoadingBlock] = useState<boolean>(true)

  const [blockImage, setBlockImage] = useState<string>('')
  const [typeBlock, setTypeBlock] = useState<string>('')
  const [imageUrl, setImageUrl] = useState<FileList | null>(null)
  const [typeBlockList, setTypeBlockList] = useState<TypeBlockType[]>([])
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
    setValue,
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

    const response = await updateBlocks({
      name: data.name,
      typeBlockId: typeBlock,
      valueForHour: data.valueForHour.replace(',', ''),
      imageUrl: imageBlock,
      sports,
      openingHours: Object.entries(days).map(([day, values]) => ({
        dayOfWeek: day,
        startTime: values.startTime,
        endTime: values.endTime,
        active: values.active,
        dayUseActive: values.isActiveDayUse,
        valueForHourDayUse: values.valueForHour.replace(',', ''),
      })),
      blockId: blockId ?? '',
    })

    if (response.success) {
      setLoading(false)

      navigate('/b2b/blocks')
      return true
    }

    setLoading(false)
  }

  function handleChoseImage(e: React.ChangeEvent<HTMLInputElement>) {
    setImageUrl(e.target.files)
  }

  const fetchBlock = async () => {
    setLoadingBlock(true)
    const responseTypeBlock = await getAllTypeBlock()

    if (responseTypeBlock.success) {
      setTypeBlockList(responseTypeBlock.typeBlock ?? [])
    }

    const response = await getBlockById({ blockId: blockId ?? '' })
    if (response.success) {
      setValue('name', response.block?.name ?? '')
      setValue('valueForHour', maskReal(response.block?.valueForHour ?? ''))
      setDays(
        response.block?.openingHours?.reduce(
          (acc, item) => {
            acc[item.dayOfWeek as keyof DaysState] = {
              active: item.active,
              startTime: item.startTime,
              endTime: item.endTime,
              isActiveDayUse: item.dayUseActive,
              valueForHour: item.valueForHourDayUse,
            }
            return acc
          },
          { ...days },
        ) ?? { ...days },
      )
      setSports(
        response.block?.sports.map(
          (sport) => sport.toLocaleUpperCase() as string,
        ) ?? [],
      )

      if (responseTypeBlock.typeBlock) {
        const typeBlock = responseTypeBlock.typeBlock.find(
          (type) => type.id === response.block?.typeBlockId,
        )?.id

        setTypeBlock(typeBlock ?? '')
      }

      if (response.block?.imageUrl) {
        setBlockImage(response.block?.imageUrl)
      }
    }
    setLoadingBlock(false)
  }

  useEffect(() => {
    fetchBlock()
  }, [])

  return (
    <>
      {loadingBlock ? (
        <ScreenLoading />
      ) : (
        <>
          <div>
            <h1 className=" text-lg font-semibold">Editar quadra</h1>
            <h2 className="mb-5  text-sm ">
              Preencha os campos abaixo para editar uma quadra
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
                    <img
                      src={`https://pub-ed847887b3d7415384bbf5488c674561.r2.dev/${blockImage}`}
                      alt="Logo Firula"
                      className="h-20 w-20"
                    />
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
                    {...register('valueForHour', {
                      onChange: (e) => {
                        e.target.value = maskReal(e.target.value)
                      },
                    })}
                    input={{
                      mask: maskReal,
                      maxLength: 100,
                      change: (val: string) => maskReal(val),
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

                <Select
                  onValueChange={(e) => setTypeBlock(e)}
                  defaultValue={typeBlock}
                >
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
                        isActiveDayUse={days[day].isActiveDayUse}
                        valueForHour={days[day].valueForHour}
                        setIsActiveDayUse={(active) => {
                          handleDayChange(day, {
                            ...days[day],
                            isActiveDayUse: active,
                          })
                        }}
                        setValueForHour={(value) =>
                          handleDayChange(day, {
                            ...days[day],
                            valueForHour: value,
                          })
                        }
                        setActive={(active) =>
                          handleDayChange(day, { ...days[day], active })
                        }
                        title={translateDiaWeek(capitalizeEachWord(day))}
                        setEndTime={(times) =>
                          handleDayChange(day, { ...days[day], endTime: times })
                        }
                        setStartTime={(times) =>
                          handleDayChange(day, {
                            ...days[day],
                            startTime: times,
                          })
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
                Salvar
              </Button>
            </div>
          </form>
        </>
      )}
    </>
  )
}
