import api from '../api'
import { toast } from 'sonner'

export type GetCompanyStatusResponseType = {
  data: {
    status: string
    data: {
      urlOnboarding: string
      type: string
      title: string
    }[]
  }
}

export type GetCompanyStatusType = {
  status: string
  data: {
    urlOnboarding: string
    type: string
    title: string
  }[]
}

export type GetCompanyStatusRequest = {
  companyId: string
}

export const getCompanyStatus = async ({
  companyId,
}: GetCompanyStatusRequest): Promise<GetCompanyStatusType> => {
  try {
    const url = `/company/check-onboarding-status?companyId=${companyId}`

    const response: GetCompanyStatusResponseType = await api.get(url)

    const { status, data } = response.data

    return {
      status,
      data,
    }
  } catch (error) {
    toast.error(
      'Ocorreu um erro ao buscar o status da empresa, por favor tente novamente.',
    )
    return {
      status: 'error',
      data: [],
    }
  }
}
