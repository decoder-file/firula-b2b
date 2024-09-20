import api from '../api'
import { toast } from 'sonner'

export type UpdateUserResponseType = {
  userId: string
}

export type UpdateUsersRequest = {
  name?: string
  role?: string
  isBlock?: boolean
  image?: string
}

export const updateUser = async (
  userId: string,
  { name, role, isBlock, image }: UpdateUsersRequest,
): Promise<{ success: boolean }> => {
  try {
    const data = {
      name,
      role,
      isBlock,
      image,
    }
    const url = `users?userId=${userId}`

    const response: UpdateUserResponseType = await api.patch(url, data)

    const user = response.userId

    toast.success('Usuário atualizado com sucesso!')
    return {
      success: !user,
    }
  } catch (error) {
    toast.error(
      'Ocorreu um erro ao atualizar o usuário, tente novamente mais tarde!',
    )
    return {
      success: false,
    }
  }
}
