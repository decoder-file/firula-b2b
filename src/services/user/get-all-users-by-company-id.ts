import api from '../api'
import { toast } from 'sonner'

export type UsersType = {
  id: string
  name: string
  email: string
  cpf: string
  isBlock: boolean
  imageUrl: string | null
}

export type GetAllUsersByCompanyIdResponseType = {
  data: {
    users: UsersType[]
  }
}

export type GetAllUsersByCompanyIdRequestType = {
  companyId: string
  page?: string
  queryName?: string
}

type GetAllUsersByCompanyIdType = {
  users?: UsersType[]
  success: boolean
}

export const getAllUsersByCompanyId = async ({
  companyId,
  page,
  queryName,
}: GetAllUsersByCompanyIdRequestType): Promise<GetAllUsersByCompanyIdType> => {
  try {
    if (!companyId) {
      toast.error(
        'Ocorreu um erro ao buscar as quadras cadastradas, tente novamente mais tarde!',
      )
      return {
        success: false,
      }
    }

    const url = `/users/by-company?companyId=${companyId}&page=${page}`

    if (queryName) {
      url.concat(`&nameQuery=${queryName}`)
    }

    const response: GetAllUsersByCompanyIdResponseType = await api.get(url)

    const { users } = response.data

    return {
      users,
      success: true,
    }
  } catch (error) {
    toast.error(
      'Ocorreu um erro ao buscar clientes cadastradas, tente novamente mais tarde!',
    )
    return {
      success: false,
    }
  }
}
