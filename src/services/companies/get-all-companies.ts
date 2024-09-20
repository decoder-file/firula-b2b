import api from '../api'
import { toast } from 'sonner'
import { CompanyType } from './type-companies'

export type GetAllCompaniesResponseType = {
  data: {
    company: CompanyType[]
  }
}

type GetAllCompaniesType = {
  companies: CompanyType[] | []
}

export type GetAllCompaniesRequest = {
  page: string
  nameQuery?: string
}

export const getAllCompanies = async ({
  page,
  nameQuery,
}: GetAllCompaniesRequest): Promise<GetAllCompaniesType> => {
  try {
    let url = `company?page=${page}`

    if (nameQuery) {
      url = url + `nameQuery=${nameQuery}`
    }
    const response: GetAllCompaniesResponseType = await api.get(url)

    const { company } = response.data

    return {
      companies: company,
    }
  } catch (error) {
    toast.error(
      'Ocorreu um erro ao buscar as empresas cadastradas, tente novamente mais tarde!',
    )
    return {
      companies: [],
    }
  }
}
