import { Button } from '../../../../components/ui/button'
import { Input } from '../../../../components/ui/input'
import { Label } from '../../../../components/ui/label'

import { maskCEP } from '../../../../utils/Mask'

import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { useUserStore } from '../../../../store/UserStore'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  AddressResponseType,
  createAddressCompany,
  getAddressByCep,
} from '../../../../services/company/address'
import { Search } from 'lucide-react'
import { getCompanyAddressByCompanyId } from '../../../../services/company/address/get-address-by-company-id'

const createAddressCompanyForm = z.object({
  zipCode: z.string().min(1, 'CEP é obrigatório'),
  street: z.string().min(1, 'Endereço é obrigatório'),
  neighborhood: z.string().min(1, 'Bairro é obrigatório'),
  number: z.string().min(1, 'Número é obrigatório'),
  city: z.string().min(1, 'Cidade é obrigatório'),
  state: z.string().min(1, 'Estado é obrigatório'),
  complement: z.string().optional(),
})

type CreateAddressCompanyForm = z.infer<typeof createAddressCompanyForm>

export function CompanyAddressForm() {
  const { user } = useUserStore()

  const navigate = useNavigate()

  const [loadingCreateAddressCompany, setLoadingCreateAddressCompany] =
    useState(false)
  const [loadingAddress, setLoadingAddress] = useState(false)

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { isSubmitting, errors, isValid },
  } = useForm<CreateAddressCompanyForm>({
    resolver: zodResolver(createAddressCompanyForm),
  })

  const inputValue = watch('zipCode')

  async function handleCreateCompany(data: CreateAddressCompanyForm) {
    setLoadingCreateAddressCompany(true)
    const response = await createAddressCompany(user.companyId ?? '', data)

    if (!response.message) {
      setLoadingCreateAddressCompany(false)
      navigate('/b2b/home')
    }
  }

  const getAddress = async () => {
    const formatCep = inputValue.replace(/[^0-9]/g, '')
    if (formatCep.length === 8) {
      setLoadingAddress(true)
      const response: AddressResponseType = await getAddressByCep(inputValue)

      setValue('street', response.logradouro)
      setValue('neighborhood', response.bairro)
      setValue('city', response.localidade)
      setValue('state', response.uf)
      setLoadingAddress(false)
    }
  }

  const fetchDataCompany = async () => {
    const response = await getCompanyAddressByCompanyId({
      companyId: user.companyId ?? '',
    })

    if (!response.success) {
      return
    }

    const { companyAddress } = response

    setValue('zipCode', companyAddress?.zipCode ?? '')
    setValue('street', companyAddress?.street ?? '')
    setValue('neighborhood', companyAddress?.neighborhood ?? '')
    setValue('number', companyAddress?.number ?? '')
    setValue('city', companyAddress?.city ?? '')
    setValue('state', companyAddress?.state ?? '')
    setValue('complement', companyAddress?.complement ?? '')
  }

  useEffect(() => {
    fetchDataCompany()
  }, [])

  useEffect(() => {
    if (inputValue !== '' || inputValue !== undefined) {
      getAddress()
    } else {
      console.log('vazio')
    }
  }, [inputValue])

  return (
    <main className="grid gap-2">
      <form className="space-y-4" onSubmit={handleSubmit(handleCreateCompany)}>
        <div className="flex w-full items-end gap-2">
          <div className="w-full space-y-2">
            <Label htmlFor="zipCode">CEP</Label>
            <Input
              id="zipCode"
              {...register('zipCode', {
                onChange: (e) => {
                  e.target.value = maskCEP(e.target.value)
                },
              })}
              input={{
                maxLength: 9,
                change: (val: string) => maskCEP(val),
                mask: maskCEP,
                value: undefined,
              }}
            />

            {errors.zipCode && (
              <span className="text-xs text-red-600">
                {errors.zipCode.message}
              </span>
            )}
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
                  {...register('street')}
                  input={{
                    change: (val: string) => val,
                    value: undefined,
                  }}
                />
                {errors.street && (
                  <span className="text-xs text-red-600">
                    {errors.street.message}
                  </span>
                )}
              </div>
              <div className="w-full space-y-2">
                <Label htmlFor="number">Número</Label>
                <Input
                  id="number"
                  {...register('number')}
                  input={{
                    change: (val: string) => val,
                    value: undefined,
                  }}
                />
                {errors.number && (
                  <span className="text-xs text-red-600">
                    {errors.number.message}
                  </span>
                )}
              </div>
            </div>
            <div className="flex w-full items-end gap-2">
              <div className="w-full space-y-2">
                <Label htmlFor="regime">Bairro</Label>
                <Input
                  id="neighborhood"
                  {...register('neighborhood')}
                  input={{
                    change: (val: string) => val,
                    value: undefined,
                  }}
                />
                {errors.neighborhood && (
                  <span className="text-xs text-red-600">
                    {errors.neighborhood.message}
                  </span>
                )}
              </div>
              <div className="w-full space-y-2">
                <Label htmlFor="city">Cidade</Label>
                <Input
                  id="city"
                  {...register('city')}
                  input={{
                    change: (val: string) => val,
                    value: undefined,
                  }}
                />
                {errors.city && (
                  <span className="text-xs text-red-600">
                    {errors.city.message}
                  </span>
                )}
              </div>
            </div>

            <div className="flex w-full items-end gap-2">
              <div className="w-full space-y-2">
                <Label htmlFor="state">Estado</Label>
                <Input
                  id="state"
                  {...register('state')}
                  input={{
                    change: (val: string) => val,
                    value: undefined,
                  }}
                />
                {errors.state && (
                  <span className="text-xs text-red-600">
                    {errors.state.message}
                  </span>
                )}
              </div>

              <div className="w-full space-y-2">
                <Label htmlFor="complement">Complemento</Label>
                <Input
                  id="complement"
                  {...register('complement')}
                  input={{
                    change: (val: string) => val,
                    value: undefined,
                  }}
                />
                {errors.complement && (
                  <span className="text-xs text-red-600">
                    {errors.complement.message}
                  </span>
                )}
              </div>
            </div>
          </>
        )}

        <Button
          type="submit"
          className="w-full"
          disabled={loadingCreateAddressCompany || isSubmitting || !isValid}
        >
          Atualizar Endereço
        </Button>
      </form>
    </main>
  )
}
