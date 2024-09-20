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

export type GetUsersByIdResponseType = {
  data: {
    data: UserType
  }
}

type GetUserByIdType = {
  user: UserType | []
}

export type GetAllUserRequest = {
  userId: string
}

export const getUserById = async ({
  userId,
}: GetAllUserRequest): Promise<GetUserByIdType> => {
  try {
    const url = `users?userId=${userId}`

    const response: GetUsersByIdResponseType = await api.get(url)

    console.log('response', response)

    const { data } = response.data

    return {
      user: data,
    }
  } catch (error) {
    toast.error(
      'Ocorreu um erro ao buscar detalhes do usuário, tente novamente mais tarde!',
    )
    return {
      user: [],
    }
  }
}
