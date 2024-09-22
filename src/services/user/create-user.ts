import api from '../api'
import { toast } from 'sonner'

export type CreateUserResponseType = {
  userId: string
  message?: string
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

    const response: CreateUserResponseType = await api.post('users', data)

    const user = response.userId

    toast.success('Conta criada com sucesso!')
    return {
      userId: user,
    }
  } catch (error) {
    if (error.statusCode === 409) {
      toast.error(error.message)
      return {
        userId: '',
      }
    }
    toast.error('Erro ao criar conta, verifique os dados e tente novamente!')
    return {
      userId: '',
    }
  }
}
