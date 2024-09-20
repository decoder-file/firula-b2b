import api from '../api'
import { toast } from 'sonner'

export type CreateTypeBlockResponseType = {
  id: string
  name: string
  createdAt: string
  updatedAt: string
}

type CreateTypeBlockType = {
  success: boolean
}

type CreateTypeBlockTypeRequest = {
  name: string
}

export const createTypeBlock = async ({
  name,
}: CreateTypeBlockTypeRequest): Promise<CreateTypeBlockType> => {
  try {
    const url = `type-block`

    const response: CreateTypeBlockResponseType = await api.post(url, { name })

    const { id } = response

    return {
      success: !id,
    }
  } catch (error) {
    toast.error(
      'Ocorreu um erro ao criar o tipo de quadra, tente novamente mais tarde!',
    )
    return {
      success: false,
    }
  }
}
