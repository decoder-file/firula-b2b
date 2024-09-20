import api from '../api'
import { toast } from 'sonner'
import { FaqType } from './type-faq'

export type UpdateFaqResponseType = {
  data: {
    faq: FaqType
  }
}

type UpdateTypeBlockTypeRequest = {
  question?: string
  answer?: string
  category?: string
  isActive?: boolean
  faqId: string
}

export const updateFaq = async ({
  question,
  answer,
  category,
  isActive,
  faqId,
}: UpdateTypeBlockTypeRequest): Promise<{ success: boolean }> => {
  try {
    if (faqId?.length === 0) {
      toast.error('Pergunta não encontrado!')
      return {
        success: false,
      }
    }
    const url = `faq?faqId=${faqId}`

    const response: UpdateFaqResponseType = await api.patch(url, {
      question,
      answer,
      category,
      isActive,
    })

    console.log('######response', response)

    const { data } = response

    return {
      success: !!data.faq.id,
    }
  } catch (error) {
    toast.error(
      'Ocorreu um erro ao atualizar perguntar, tente novamente mais tarde!',
    )
    return {
      success: false,
    }
  }
}
