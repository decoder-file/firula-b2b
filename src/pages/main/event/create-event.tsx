import { toast } from 'sonner'
import { StepProgress } from '../../../components/step-progress'
import { Button } from '../../../components/ui/button'
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from '../../../components/ui/card'
import { Input } from '../../../components/ui/input'
import { Label } from '../../../components/ui/label'
import { useState } from 'react'
import { Textarea } from '../../../components/ui/textarea'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '../../../components/ui/popover'
import { cn } from '../../../lib/utils'
import { Search } from 'lucide-react'
import { Calendar } from '../../../components/ui/calendar'
import { format } from 'date-fns'
import { maskCEP } from '../../../utils/Mask'
import {
  AddressResponseType,
  getAddressByCep,
} from '../../../services/company/address'
import { useUserStore } from '../../../store/UserStore'
import { createEvent, CreateEventRequestType } from '../../../services/event'
import { useNavigate } from 'react-router-dom'
import { GetUrlImageType } from '../../../services/image'
import { getUrlImage } from '../../../services/image/get-url-image'
import axios from 'axios'

const steps = ['Evento', 'Data', 'Endereço']

export function CreateEventPage() {
  const { user } = useUserStore()
  const navigate = useNavigate()

  const [currentStep, setCurrentStep] = useState(0)
  const [loadingAddress, setLoadingAddress] = useState(false)

  const [title, setTitle] = useState<string>()
  const [description, setDescription] = useState<string>()
  const [imageUrl, setImageUrl] = useState<FileList | null>(null)

  const [startDate, setStartDate] = useState<Date>()
  const [endDate, setEndDate] = useState<Date>()
  const [startTime, setStartTime] = useState<string>()
  const [endTime, setEndTime] = useState<string>()

  const [street, setStreet] = useState<string>()
  const [number, setNumber] = useState<string>()
  const [complement, setComplement] = useState<string>()
  const [neighborhood, setNeighborhood] = useState<string>()
  const [city, setCity] = useState<string>()
  const [state, setState] = useState<string>()
  const [zipCode, setZipCode] = useState<string>()

  const [loading, setLoading] = useState(false)

  const handleNext = () => {
    if (currentStep === 0) {
      const isValid = handleValidateFirstStep()
      if (!isValid) return
    }

    if (currentStep === 1) {
      const isValid = handleValidateSecondStep()
      if (!isValid) return
    }

    setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1))
  }

  const handlePrevious = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 0))
  }

  async function handleCreateEvent() {
    setLoading(true)

    let imageEvent = ''

    if (
      imageUrl &&
      imageUrl[0].type !== 'image/png' &&
      imageUrl[0].type !== 'image/jpg'
    ) {
      toast.error('A imagem deve ser do tipo PNG ou JPG.')
      setLoading(false)
      return
    }

    if (imageUrl) {
      if (!title) {
        toast.error('O titulo do evento é obrigatório')
        setLoading(false)
        return
      }

      const responseImage: GetUrlImageType = (await getUrlImage(
        title.replace(/\s/g, '') + '_event',
      )) as GetUrlImageType

      imageEvent = responseImage.data.url

      await axios.put(responseImage.data.signedUrl, imageUrl[0], {
        headers: {
          'Content-Type': 'image/png',
        },
      })
    }

    const data: CreateEventRequestType = {
      title: title || '',
      description: description || '',
      imageUrl: imageEvent,
      companyId: user.companyId || '',
      startDate: startDate?.toISOString() || '',
      startTime: startTime || '',
      endDate: endDate?.toISOString() || '',
      endTime: endTime || '',
      street: street || '',
      number: number || '',
      complement: complement || '',
      neighborhood: neighborhood || '',
      city: city || '',
      state: state || '',
      zipCode: zipCode || '',
    }

    const response = await createEvent(data)

    if (response.success) {
      toast.success('Evento cadastrado com sucesso!')
    }

    navigate(`/b2b/list-events`)

    setLoading(false)
  }

  function handleChoseImage(e: React.ChangeEvent<HTMLInputElement>) {
    setImageUrl(e.target.files)
  }

  const getAddress = async () => {
    if (!zipCode) return

    const formatCep = zipCode.replace(/[^0-9]/g, '')
    if (formatCep.length === 8) {
      setLoadingAddress(true)
      const response: AddressResponseType = await getAddressByCep(zipCode)

      setStreet(response.logradouro)
      setNeighborhood(response.bairro)
      setCity(response.localidade)
      setState(response.uf)
      setLoadingAddress(false)
    }
  }

  const handleValidateFirstStep = () => {
    if (!title) {
      toast.error('O titulo do evento é obrigatório')
      return false
    }

    if (!description) {
      toast.error('A descrição do evento é obrigatória')
      return false
    }

    return true
  }

  const handleValidateSecondStep = () => {
    if (!startDate) {
      toast.error('A data de inicio é obrigatória')
      return false
    }

    if (!endDate) {
      toast.error('A data final é obrigatória')
      return false
    }

    if (!startTime) {
      toast.error('O horário de inicio é obrigatório')
      return false
    }

    if (!endTime) {
      toast.error('O horário final é obrigatório')
      return false
    }

    return true
  }

  const handleSubmit = async () => {
    if (!zipCode) {
      toast.error('O CEP é obrigatório')
      return false
    }

    if (!street) {
      toast.error('A rua é obrigatória')
      return false
    }

    if (!number) {
      toast.error('O número é obrigatório')
      return false
    }

    if (!neighborhood) {
      toast.error('O bairro é obrigatório')
      return false
    }

    if (!city) {
      toast.error('A cidade é obrigatória')
      return false
    }

    if (!state) {
      toast.error('O estado é obrigatório')
      return false
    }

    await handleCreateEvent()
  }

  return (
    <>
      <div>
        <h1 className=" text-lg font-semibold">Criar novo evento</h1>
        <h2 className="mb-5  text-sm ">
          Preencha os campos abaixo para criar um novo evento
        </h2>
        <div className=" p-4">
          <Card className="w-full">
            <CardHeader>
              <StepProgress steps={steps} currentStep={currentStep} />
            </CardHeader>
            <CardContent>
              <form>
                {currentStep === 0 && (
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="firstName">Titulo do evento</Label>
                      <Input
                        id="title"
                        input={{
                          change: (val: string) => setTitle(val),
                          value: title,
                        }}
                      />
                    </div>
                    <div>
                      <Label htmlFor="lastName">Descrição</Label>
                      <Textarea
                        id="description"
                        placeholder="Descrição do evento"
                        onChange={(e) => setDescription(e.target.value)}
                        value={description}
                      />
                    </div>
                    <Label
                      className="mb-1 mt-2 text-sm font-semibold"
                      htmlFor="lastName"
                    >
                      Imagem do evento
                    </Label>
                    <div className="mb-2 flex w-full items-center justify-center">
                      <label
                        htmlFor="dropzone-file"
                        className="dark:hover:bg-bray-800 flex w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 hover:bg-gray-100 dark:border-gray-600 dark:bg-gray-700 dark:hover:border-gray-500 dark:hover:bg-gray-600"
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
                  </div>
                )}
                {currentStep === 1 && (
                  <div className="space-y-4">
                    <Label htmlFor="lastName">Data e horário de inicio</Label>
                    <div className="flex items-center gap-2">
                      <div>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant={'outline'}
                              className={cn(
                                'w-[240px] justify-start text-left font-normal',
                                !startDate && 'text-muted-foreground',
                              )}
                            >
                              {startDate ? (
                                format(startDate, 'PPP')
                              ) : (
                                <span>Data de inicio</span>
                              )}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={startDate}
                              onSelect={setStartDate}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                      </div>
                      <div>
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
                            className="block h-10 w-full rounded-lg border  p-2.5 text-sm leading-none text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:bg-transparent dark:text-white  dark:focus:border-blue-500 dark:focus:ring-blue-500"
                            min="06:00"
                            max="23:00"
                            value={startTime}
                            onChange={(e) => setStartTime(e.target.value)}
                          />
                        </div>
                      </div>
                    </div>
                    <Label htmlFor="lastName">Data e horário final</Label>
                    <div className="flex items-center gap-2">
                      <div>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant={'outline'}
                              className={cn(
                                'w-[240px] justify-start text-left font-normal',
                                !endDate && 'text-muted-foreground',
                              )}
                            >
                              {endDate ? (
                                format(endDate, 'PPP')
                              ) : (
                                <span>Data Final</span>
                              )}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={endDate}
                              onSelect={setEndDate}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                      </div>
                      <div>
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
                            className="block h-10 w-full rounded-lg border  p-2.5 text-sm leading-none text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:bg-transparent dark:text-white  dark:focus:border-blue-500 dark:focus:ring-blue-500"
                            min="06:00"
                            max="23:00"
                            value={endTime}
                            onChange={(e) => setEndTime(e.target.value)}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                {currentStep === 2 && (
                  <div className="space-y-4">
                    <div className="flex w-full items-end gap-2">
                      <div className="w-full space-y-2">
                        <Label htmlFor="zipCode">CEP</Label>
                        <Input
                          id="zipCode"
                          input={{
                            maxLength: 9,
                            change: (val: string) => setZipCode(maskCEP(val)),
                            mask: maskCEP,
                            value: zipCode,
                          }}
                        />
                      </div>
                      <div>
                        <Button
                          type="button"
                          className="w-full"
                          variant={'secondary'}
                          onClick={getAddress}
                        >
                          <Search />
                        </Button>
                      </div>
                    </div>
                    {loadingAddress ? (
                      <div className="w-full justify-center text-center">
                        <p className="text-xs text-muted-foreground">
                          Estamos buscando seu endereço...
                        </p>
                      </div>
                    ) : (
                      <>
                        <div className="flex w-full items-end gap-2">
                          <div className="w-full space-y-2">
                            <Label htmlFor="street">Rua</Label>
                            <Input
                              id="street"
                              input={{
                                change: (val: string) => setStreet(val),
                                value: street,
                              }}
                            />
                          </div>
                          <div className="w-full space-y-2">
                            <Label htmlFor="number">Número</Label>
                            <Input
                              id="number"
                              input={{
                                change: (val: string) => setNumber(val),
                                value: number,
                              }}
                            />
                          </div>
                        </div>
                        <div className="flex w-full items-end gap-2">
                          <div className="w-full space-y-2">
                            <Label htmlFor="regime">Bairro</Label>
                            <Input
                              id="neighborhood"
                              input={{
                                change: (val: string) => setNeighborhood(val),
                                value: neighborhood,
                              }}
                            />
                          </div>
                          <div className="w-full space-y-2">
                            <Label htmlFor="city">Cidade</Label>
                            <Input
                              id="city"
                              input={{
                                change: (val: string) => setCity(val),
                                value: city,
                              }}
                            />
                          </div>
                        </div>

                        <div className="flex w-full items-end gap-2">
                          <div className="w-full space-y-2">
                            <Label htmlFor="state">Estado</Label>
                            <Input
                              id="state"
                              input={{
                                change: (val: string) => setState(val),
                                value: state,
                              }}
                            />
                          </div>

                          <div className="w-full space-y-2">
                            <Label htmlFor="complement">Complemento</Label>
                            <Input
                              id="complement"
                              input={{
                                change: (val: string) => setComplement(val),
                                value: complement,
                              }}
                            />
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                )}
              </form>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button
                variant="outline"
                onClick={handlePrevious}
                disabled={currentStep === 0}
              >
                Voltar
              </Button>
              {currentStep === steps.length - 1 ? (
                <Button onClick={handleSubmit} disabled={loading}>
                  Criar evento
                </Button>
              ) : (
                <Button onClick={handleNext}>Próximo</Button>
              )}
            </CardFooter>
          </Card>
        </div>
      </div>
    </>
  )
}
