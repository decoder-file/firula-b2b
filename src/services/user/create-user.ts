import api from '../api'
import { toast } from 'sonner'

export type CreateUserResponseType = {
  userId: string
  message?: string
  success: boolean
}

export type CreateUserResponseApiType = {
  data: {
    userId: string
  }
}

export type CreateUsersRequest = {
  name: string
  email: string
  cpf: string
  password: string
}

export const createUser = async ({
  name,
  email,
  cpf,
  password,
}: CreateUsersRequest): Promise<CreateUserResponseType> => {
  try {
    const data = {
      name,
      email,
      cpf,
      passwordHash: password,
      role: 'OWNER',
    }

    const response: CreateUserResponseApiType = await api.post('users', data)

    console.log(response)

    const user = response.data.userId

    toast.success('Conta criada com sucesso!')
    return {
      userId: user,
      success: true,
    }
  } catch (error) {
    if (error.statusCode === 409) {
      toast.error(error.message)
      return {
        userId: '',
        success: false,
      }
    }
    toast.error('Erro ao criar conta, verifique os dados e tente novamente!')
    return {
      userId: '',
      success: false,
    }
  }
}
