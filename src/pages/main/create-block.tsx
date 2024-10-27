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
import { useEffect, useState } from 'react'
import {
  getAllTypeBlock,
  TypeBlockType,
} from '../../services/blocks/type-block'
import { GetUrlImageType } from '../../services/image'
import { getUrlImage } from '../../services/image/get-url-image'
import axios from 'axios'
import { createBlock } from '../../services/blocks/create-block'
import { useNavigate } from 'react-router-dom'
import { translateSportToPortuguese, Sport } from '../../utils/functions'
import { useUserStore } from '../../store/UserStore'

const createBlockForm = z.object({
  name: z.string().min(1, 'Nome é obrigatório'),
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

export function CreateBlockPage() {
  const navigate = useNavigate()
  const { user } = useUserStore()

  const [typeBlock, setTypeBlock] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(false)
  const [imageUrl, setImageUrl] = useState<FileList | null>(null)
  const [typeBlockList, setTypeBlockList] = useState<TypeBlockType[]>([])
  const [loadingTypeBlock, setLoadingTypeBlock] = useState<boolean>(true)
  const [sports, setSports] = useState<string[]>([])

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
    console.log('##########')
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
      valueForHour: '0',
      imageUrl: imageBlock,
      sports,
      companyId: user.companyId ?? '',
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
