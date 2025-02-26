/* eslint-disable camelcase */
import api from '../api'
import { toast } from 'sonner'

export type UpdateCompanyResponseType = {
  companyId: string
  message?: string
}

export type UpdateCompanyResponseApiType = {
  data: {
    companyId: string
  }
}

export type UpdateCompanyRequest = {
  companyId: string
  name?: string
  mobilePhone?: string
  imageUrl?: string
  paymentId?: string
  description?: string
}

type UpdateCompanyType = {
  name?: string
  mobilePhone?: string
  imageUrl?: string
  paymentId?: string
  description?: string
}

export const updateCompany = async ({
  name,
  mobilePhone,
  imageUrl,
  companyId,
  paymentId,
  description,
}: UpdateCompanyRequest): Promise<UpdateCompanyResponseType> => {
  try {
    const data: UpdateCompanyType = {
      name,
      mobilePhone,
      paymentId,
      description,
    }

    if (imageUrl !== '') {
      data.imageUrl = imageUrl
    }

    const response: UpdateCompanyResponseApiType = await api.patch(
      `/company?companyId=${companyId}`,
      data,
    )

    const company = response.data.companyId

    toast.success('Empresa atualizada com sucesso!')
    return {
      companyId: company,
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
      'Ocorreu um erro ao atualizar a empresa, tente novamente mais tarde!',
    )
    return {
      companyId: '',
    }
  }
}
