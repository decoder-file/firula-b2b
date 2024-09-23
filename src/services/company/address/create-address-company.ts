/* eslint-disable camelcase */
import api from '../../api'
import { toast } from 'sonner'
import { AddressType } from './address-company.type'

export type CreateCompanyResponseType = {
  addressId: string
  message?: string
}

export const createAddressCompany = async ({
  city,
  complement,
  neighborhood,
  number,
  state,
  street,
  zipCode,
}: AddressType): Promise<CreateCompanyResponseType> => {
  try {
    const companyId = localStorage.getItem('companyId')

    if (!companyId) {
      toast.error(
        'Erro ao cadastrar endereço, entre em contato com seu gerente de conta.',
      )
      return {
        addressId: '',
      }
    }

    const data = {
      city,
      complement,
      neighborhood,
      number,
      state,
      street,
      zipCode,
    }

    const response: CreateCompanyResponseType = await api.post(
      `company-address?companyId=${companyId}`,
      data,
    )

    const addressId = response.addressId

    toast.success('Endereço cadastrado com sucesso!')
    return {
      addressId,
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    if (error.statusCode === 409) {
      toast.error(error.message)
      return {
        addressId: '',
      }
    }
    toast.error(
      'Ocorreu um erro ao cadastrar o endereço, tente novamente mais tarde!',
    )
    return {
      addressId: '',
    }
  }
}
