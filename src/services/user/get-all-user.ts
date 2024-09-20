import api from '../api'
import { toast } from 'sonner'
import { CompanyType } from '../companies'

export type UserType = {
  id: string
  name: string
  email: string
  cpf: string
  role: string
  isBlock: boolean
  imageUrl: string | null
  UserAddress: []
  Company: CompanyType
  UserProfile: []
}

export type GetAllUsersResponseType = {
  data: {
    users: UserType[]
  }
}

type GetAllUserType = {
  users: UserType[] | []
}

export type GetAllUserRequest = {
  page: string
  queryName?: string
}

export const getAllUsers = async ({
  page,
  queryName,
}: GetAllUserRequest): Promise<GetAllUserType> => {
  try {
    let url = `users/all?page=${page}`

    url = queryName ? `${url}&queryName=${queryName}` : url

    const response: GetAllUsersResponseType = await api.get(url)

    const { users } = response.data

    return {
      users,
    }
  } catch (error) {
    toast.error(
      'Ocorreu um erro ao buscar os usuários cadastrados, tente novamente mais tarde!',
    )
    return {
      users: [],
    }
  }
}
