import { toast } from 'sonner'
import api from '../../../services/api'
import { AddressType } from './address-company.type'

export type GetCompanyAddressByCompanyIdResponseType = {
  data: {
    companyAddress: AddressType[]
  }
}

type GetCompanyAddressByCompanyIdType = {
  companyAddress?: AddressType
  success: boolean
}

export type GetCompanyAddressByCompanyIdRequest = {
  companyId: string
}

export const getCompanyAddressByCompanyId = async ({
  companyId,
}: GetCompanyAddressByCompanyIdRequest): Promise<GetCompanyAddressByCompanyIdType> => {
  try {
    const url = `/company-address/companyId?companyId=${companyId}`

    const response: GetCompanyAddressByCompanyIdResponseType =
      await api.get(url)

    const { companyAddress } = response.data

    return {
      companyAddress: companyAddress[0],
      success: true,
    }
  } catch (error) {
    toast.error(
      'Ocorreu um erro ao buscar endereço cadastro, tente novamente mais tarde!',
    )
    return {
      success: false,
    }
  }
}
