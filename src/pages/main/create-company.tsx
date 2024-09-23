import { useState } from 'react'

import { Helmet } from 'react-helmet-async'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'

import { Button } from '../../components/ui/button'
import { Input } from '../../components/ui/input'
import { Label } from '../../components/ui/label'

import LogoGreen from '../../assets/logo-green.png'
import { maskCNPJ, maskPhoneNumber } from '../../utils/Mask'
import { Search } from 'lucide-react'
import { toast } from 'sonner'
import { createCompany } from '../../services/company'
import { useNavigate } from 'react-router-dom'

const createCompanyForm = z.object({
  cpfCnpj: z.string().min(1, 'Campo CNPJ é obrigatório'),
  mobilePhone: z.string().min(1, 'Campo telefone é obrigatório'),
  fantasy_name: z.string().min(1, 'Campo nome fantasia é obrigatório'),
  corporate_reason: z.string().min(1, 'Campo razão social é obrigatório'),
  regime: z.string().min(1, 'Campo regime é obrigatório'),
  opening_date: z.string().min(1, 'Campo data de abertura é obrigatório'),
})

type CreateCompanyForm = z.infer<typeof createCompanyForm>

export function CreateCompany() {
  const navigate = useNavigate()

  const [loadingCreateCompany, setLoadingCreateCompany] = useState(false)
  const [loadingGetCNPJ, setLoadingGetCNPJ] = useState(false)

  const {
    register,
    handleSubmit,
    getValues,
    setValue,
    formState: { isSubmitting, errors, isValid },
  } = useForm<CreateCompanyForm>({
    resolver: zodResolver(createCompanyForm),
  })

  const handleGetCNJP = async () => {
    setLoadingGetCNPJ(true)
    const url = 'http://localhost:3333/queries/cnpj?cnpj='
    const cnpj = getValues('cpfCnpj').replace(/\D/g, '')

    if (cnpj.length !== 14) {
      toast.error('CNPJ inválido')
      setLoadingGetCNPJ(false)
      return
    }

    fetch(`${url}${cnpj}`)
      .then((response) => {
        return response.json()
      })
      .then((docInfo) => {
        setValue('fantasy_name', docInfo.companyData.fantasia)
        setValue('corporate_reason', docInfo.companyData.razaoSocial)
        setValue('mobilePhone', docInfo.companyData.telefone)
        setValue('opening_date', docInfo.companyData.abertura)
        setLoadingGetCNPJ(false)
      })
      .catch((err) => {
        toast.error('CNPJ não encontrado')
        setLoadingGetCNPJ(false)
        console.log(err)
      })
  }

  async function handleCreateCompany(data: CreateCompanyForm) {
    setLoadingCreateCompany(true)

    const sendData = {
      name: data.fantasy_name,
      cpfCnpj: data.cpfCnpj,
      mobilePhone: data.mobilePhone,
      fantasy_name: data.fantasy_name,
      corporate_reason: data.corporate_reason,
      regime: data.regime,
      opening_date: data.opening_date,
    }

    const response = await createCompany(sendData)

    if (response.companyId.length === 0) {
      setLoadingCreateCompany(false)

      return
    }
    localStorage.setItem('companyId', response.companyId)
    navigate('/b2b/register-address-company')
    setLoadingCreateCompany(false)
  }
  return (
    <>
      <Helmet title="Cadastro" />
      <div className="flex h-screen w-full items-center justify-center ">
        <div className="flex w-full max-w-lg  flex-col justify-center gap-3">
          <div className="flex flex-col items-center justify-center  text-center">
            <img src={LogoGreen} alt="Logo Firula" className="w-20 md:hidden" />

            <h1 className="text-2xl font-semibold tracking-tight">
              Cadastro de Empresa
            </h1>
            <p className="text-sm text-muted-foreground">
              Preencha os campos abaixo para cadastrar uma nova empresa no
              Firula
            </p>
          </div>

          <form
            className="space-y-4"
            onSubmit={handleSubmit(handleCreateCompany)}
          >
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
                  disabled={loadingGetCNPJ}
                  input={{
                    maxLength: 18,
                    change: (val: string) => maskCNPJ(val),
                    mask: maskCNPJ,
                    value: undefined,
                  }}
                />

                {errors.cpfCnpj && (
                  <span className="text-xs text-red-600">
                    {errors.cpfCnpj.message}
                  </span>
                )}
              </div>
              <div>
                <Button
                  type="button"
                  className="w-full"
                  variant={'secondary'}
                  onClick={handleGetCNJP}
                >
                  <Search />
                </Button>
              </div>
            </div>
            {loadingGetCNPJ ? (
              <div className="w-full justify-center text-center">
                <p className="text-xs text-muted-foreground">
                  Estamos buscando os dados da empresa para você...
                </p>
              </div>
            ) : (
              <>
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
                    />
                    {errors.fantasy_name && (
                      <span className="text-xs text-red-600">
                        {errors.fantasy_name.message}
                      </span>
                    )}
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
                    />
                    {errors.fantasy_name && (
                      <span className="text-xs text-red-600">
                        {errors.fantasy_name.message}
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex w-full items-end gap-2">
                  <div className="w-full space-y-2">
                    <Label htmlFor="regime">Regime</Label>
                    <Input
                      id="regime"
                      {...register('regime')}
                      input={{
                        change: (val: string) => val,
                        value: undefined,
                      }}
                    />
                    {errors.regime && (
                      <span className="text-xs text-red-600">
                        {errors.regime.message}
                      </span>
                    )}
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
                    />
                    {errors.opening_date && (
                      <span className="text-xs text-red-600">
                        {errors.opening_date.message}
                      </span>
                    )}
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
              </>
            )}

            <Button
              type="submit"
              className="w-full"
              disabled={loadingCreateCompany || isSubmitting || !isValid}
            >
              Cadastrar empresa
            </Button>
          </form>
        </div>
      </div>
    </>
  )
}
