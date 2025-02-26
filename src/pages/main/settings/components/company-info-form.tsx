import { Button } from '../../../../components/ui/button'
import { Input } from '../../../../components/ui/input'
import { Label } from '../../../../components/ui/label'
import { updateCompany } from '../../../../services/company'
import { GetUrlImageType } from '../../../../services/image'
import { getUrlImage } from '../../../../services/image/get-url-image'
import { maskCNPJ, maskPhoneNumber } from '../../../../utils/Mask'
import axios from 'axios'

import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { useUserStore } from '../../../../store/UserStore'
import { useEffect, useState } from 'react'
import { getCompanyById } from '../../../../services/company/get-company-by-id'
import { Info } from 'lucide-react'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '../../../../components/ui/tooltip'

const createCompanyForm = z.object({
  cpfCnpj: z.string().min(1, 'Campo CNPJ é obrigatório'),
  mobilePhone: z.string().min(1, 'Campo telefone é obrigatório'),
  fantasy_name: z.string().min(1, 'Campo nome fantasia é obrigatório'),
  name: z.string().min(1, 'Campo nome é obrigatório'),
  corporate_reason: z.string().min(1, 'Campo razão social é obrigatório'),
  regime: z.string().min(1, 'Campo regime é obrigatório'),
  opening_date: z.string().min(1, 'Campo data de abertura é obrigatório'),
  payment_id: z
    .string()
    .min(1, 'Campo id de pagamento é obrigatório')
    .optional(),
  description: z.string().optional(),
})

type CreateCompanyForm = z.infer<typeof createCompanyForm>

export function CompanyInfoForm() {
  const { user } = useUserStore()

  const [loadingCreateCompany, setLoadingCreateCompany] = useState(false)
  const [imageUrl, setImageUrl] = useState<FileList | null>(null)
  const [companyImage, setCompanyImage] = useState('')

  const {
    register,
    handleSubmit,
    setValue,
    formState: { isSubmitting, errors },
  } = useForm<CreateCompanyForm>({
    resolver: zodResolver(createCompanyForm),
  })

  async function handleCreateCompany(data: CreateCompanyForm) {
    setLoadingCreateCompany(true)

    let imageCompany = ''
    if (imageUrl) {
      const responseImage: GetUrlImageType = (await getUrlImage(
        data.fantasy_name.toLocaleLowerCase().replace(/\s/g, '') + '_company',
      )) as GetUrlImageType

      imageCompany = responseImage.data.url

      await axios.put(responseImage.data.signedUrl, imageUrl[0], {
        headers: {
          'Content-Type': 'image/png',
        },
      })
    }

    const sendData = {
      name: data.name,
      mobilePhone: data.mobilePhone,
      imageUrl: imageCompany,
      companyId: user.companyId ?? '',
      paymentId: data.payment_id,
      description: data.description,
    }

    const response = await updateCompany(sendData)

    if (response.companyId.length === 0) {
      setLoadingCreateCompany(false)

      return
    }

    setLoadingCreateCompany(false)
  }

  function handleChoseImage(e: React.ChangeEvent<HTMLInputElement>) {
    setImageUrl(e.target.files)
  }

  const fetchDataCompany = async () => {
    const response = await getCompanyById({ companyId: user.companyId ?? '' })

    if (!response.success) {
      return
    }

    const { company } = response

    setValue('cpfCnpj', company?.cpf_cnpj ?? '')
    setValue('mobilePhone', company?.mobilePhone ?? '')
    setValue('fantasy_name', company?.fantasyName ?? '')
    setValue('corporate_reason', company?.corporateReason ?? '')
    setValue('regime', company?.regime ?? '')
    setValue('opening_date', company?.openingDate ?? '')
    setValue('name', company?.name ?? '')
    setValue('payment_id', company?.paymentId ?? '')
    setValue('description', company?.description ?? '')

    if (response.company?.imageUrl) {
      setCompanyImage(response.company?.imageUrl)
    }
  }

  useEffect(() => {
    fetchDataCompany()
  }, [])
  return (
    <main className="grid gap-2">
      <form className="space-y-4" onSubmit={handleSubmit(handleCreateCompany)}>
        <Label className="mb-1 text-sm font-semibold" htmlFor="lastName">
          Imagem da empresa
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
                <img
                  src={`https://pub-ed847887b3d7415384bbf5488c674561.r2.dev/${companyImage}`}
                  alt="Logo Firula"
                  className="h-20 w-20"
                />
              )}

              <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                <span className="font-semibold">
                  Clique para alterar a imagem
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
        <div className="flex w-full items-end gap-2">
          <div className="w-full space-y-2">
            <Label htmlFor="cpfCnpj">CNPJ</Label>
            <Input
              id="cpfCnpj"
              {...register('cpfCnpj', {
                onChange: (e) => {
                  e.target.value = maskCNPJ(e.target.value)
                },
              })}
              disabled={true}
              input={{
                maxLength: 18,
                change: (val: string) => maskCNPJ(val),
                mask: maskCNPJ,
                value: undefined,
              }}
            />
          </div>
        </div>

        <div className="flex w-full items-end gap-2">
          <div className="w-full space-y-2">
            <Label htmlFor="fantasy_name">Nome Fantasia</Label>
            <Input
              id="fantasy_name"
              {...register('fantasy_name')}
              input={{
                change: (val: string) => val,
                value: undefined,
              }}
              disabled={true}
            />
          </div>
          <div className="w-full space-y-2">
            <Label htmlFor="corporate_reason">Razão Social</Label>
            <Input
              id="corporate_reason"
              {...register('corporate_reason')}
              input={{
                change: (val: string) => val,
                value: undefined,
              }}
              disabled={true}
            />
          </div>
        </div>
        <div className="flex w-full items-end gap-2">
          <div className="w-full space-y-2">
            <div className="flex items-center gap-1">
              <Label htmlFor="payment_id">ID de pagamento</Label>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info size={14} className="text-primary" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>
                      Este campo corresponde ao ID de pagamento. Só deve ser
                      alterado caso solicitado pelo gerente de conta.
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>

            <Input
              id="payment_id"
              {...register('payment_id')}
              input={{
                change: (val: string) => val,
                value: undefined,
              }}
            />
          </div>
        </div>
        <div className="flex w-full items-end gap-2">
          <div className="w-full space-y-2">
            <Label htmlFor="name">Nome</Label>
            <Input
              id="name"
              {...register('name')}
              input={{
                change: (val: string) => val,
                value: undefined,
              }}
            />
          </div>
          <div className="w-full space-y-2">
            <Label htmlFor="regime">Regime</Label>
            <Input
              id="regime"
              {...register('regime')}
              input={{
                change: (val: string) => val,
                value: undefined,
              }}
              disabled={true}
            />
          </div>
          <div className="w-full space-y-2">
            <Label htmlFor="opening_date">Data de Abertura</Label>
            <Input
              id="opening_date"
              {...register('opening_date')}
              input={{
                change: (val: string) => val,
                value: undefined,
              }}
              disabled={true}
            />
          </div>
        </div>

        <div className="flex w-full items-end gap-2">
          <div className="w-full space-y-2">
            <Label htmlFor="mobilePhone">Telefone</Label>
            <Input
              id="mobilePhone"
              {...register('mobilePhone', {
                onChange: (e) => {
                  e.target.value = maskPhoneNumber(e.target.value)
                },
              })}
              input={{
                change: (val: string) => maskPhoneNumber(val),
                maxLength: 15,
                mask: maskPhoneNumber,
                value: undefined,
              }}
            />
            {errors.mobilePhone && (
              <span className="text-xs text-red-600">
                {errors.mobilePhone.message}
              </span>
            )}
          </div>
        </div>
        <div className="flex w-full items-end gap-2">
          <div className="w-full space-y-2">
            <Label htmlFor="description">Descrição</Label>
            <Input
              id="description"
              {...register('description')}
              input={{
                change: (val: string) => val,
                value: undefined,
              }}
            />
            {errors.description && (
              <span className="text-xs text-red-600">
                {errors.description.message}
              </span>
            )}
          </div>
        </div>

        <Button
          type="submit"
          className="w-full"
          disabled={loadingCreateCompany || isSubmitting}
        >
          Atualizar
        </Button>
      </form>
    </main>
  )
}
