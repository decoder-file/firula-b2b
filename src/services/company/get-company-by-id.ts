import api from '../api'
import { toast } from 'sonner'
import { CompanyType } from './company.type'

export type GetCompanyByIdResponseType = {
  data: {
    company: CompanyType
  }
}

type GetCompanyByIdType = {
  company?: CompanyType
  success: boolean
}

export type GetCompanyByIdRequest = {
  companyId: string
}

export const getCompanyById = async ({
  companyId,
}: GetCompanyByIdRequest): Promise<GetCompanyByIdType> => {
  try {
    const url = `/company/companyId?companyId=${companyId}`

    const response: GetCompanyByIdResponseType = await api.get(url)

    const { company } = response.data

    return {
      company,
      success: true,
    }
  } catch (error) {
    toast.error(
      'Ocorreu um erro ao buscar as informações da empresa, tente novamente mais tarde!',
    )
    return {
      success: false,
    }
  }
}
