import api from '../api'
import { toast } from 'sonner'

export type DeleteFaqResponseType = {
  success: boolean
}

type DeleteTypeBlockTypeRequest = {
  faqId: string
}

export const deleteFaq = async ({
  faqId,
}: DeleteTypeBlockTypeRequest): Promise<{ success: boolean }> => {
  try {
    if (faqId?.length === 0) {
      toast.error('Pergunta não encontrado!')
      return {
        success: false,
      }
    }

    const response: DeleteFaqResponseType = await api.delete(
      `/faq?faqId=${faqId}`,
    )

    const { success } = response

    return {
      success,
    }
  } catch (error) {
    toast.error(
      'Ocorreu um erro ao deletar perguntar, tente novamente mais tarde!',
    )
    return {
      success: false,
    }
  }
}
