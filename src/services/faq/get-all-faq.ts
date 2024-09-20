import api from '../api'
import { toast } from 'sonner'
import { FaqType } from './type-faq'

export type GetAllFaqResponseType = {
  data: {
    faq: FaqType[]
  }
}

type GetAllFaq = {
  faq: FaqType[] | []
}

export const getAllFaq = async (): Promise<GetAllFaq> => {
  try {
    const response: GetAllFaqResponseType = await api.get('/faq')

    const { faq } = response.data

    return {
      faq,
    }
  } catch (error) {
    toast.error(
      'Ocorreu um erro ao buscar as perguntas, tente novamente mais tarde!',
    )
    return {
      faq: [],
    }
  }
}
