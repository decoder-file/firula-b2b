/* eslint-disable camelcase */
import api from '../api'
import { toast } from 'sonner'

export type CreateCompanyResponseType = {
  companyId: string
  message?: string
}

export type CreateCompanyResponseApiType = {
  data: {
    companyId: string
  }
}

export type CreateCompanyRequest = {
  name: string
  cpfCnpj: string
  mobilePhone: string
  fantasy_name: string
  corporate_reason: string
  regime: string
  opening_date: string
  userId: string
  imageUrl?: string
}

export const createCompany = async ({
  name,
  cpfCnpj,
  mobilePhone,
  fantasy_name,
  corporate_reason,
  regime,
  opening_date,
  userId,
  imageUrl,
}: CreateCompanyRequest): Promise<CreateCompanyResponseType> => {
  try {
    if (!userId) {
      toast.error('Usuário não encontrado')
      return {
        companyId: '',
      }
    }

    const data = {
      name,
      cpfCnpj,
      typeDocument: 'CNPJ',
      mobilePhone,
      fantasy_name,
      corporate_reason,
      regime,
      opening_date,
      imageUrl,
    }

    const response: CreateCompanyResponseApiType = await api.post(
      `/company?userId=${userId}`,
      data,
    )

    const companyId = response.data.companyId

    toast.success('Empresa cadastrada com sucesso!')
    return {
      companyId,
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    if (error.statusCode === 409) {
      toast.error(error.message)
      return {
        companyId: '',
      }
    }
    toast.error(
      'Ocorreu um erro ao cadastrar a empresa, tente novamente mais tarde!',
    )
    return {
      companyId: '',
    }
  }
}
