/* eslint-disable camelcase */
import api from '../../api'
import { toast } from 'sonner'
import { AddressType } from './address-company.type'

export type CreateCompanyResponseType = {
  addressId: string
  message?: string
}

export const createAddressCompany = async (
  companyId: string,
  data: AddressType,
): Promise<CreateCompanyResponseType> => {
  try {
    if (!companyId) {
      toast.error(
        'Erro ao cadastrar endereço, entre em contato com seu gerente de conta.',
      )
      return {
        addressId: '',
      }
    }

    const dataAddress = {
      city: data.city,
      complement: data.complement,
      neighborhood: data.neighborhood,
      number: data.number,
      state: data.state,
      street: data.street,
      zipCode: data.zipCode,
    }

    const response: CreateCompanyResponseType = await api.post(
      `company-address?companyId=${companyId}`,
      dataAddress,
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
