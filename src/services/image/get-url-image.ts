import { toast } from 'sonner'
import api from '../api'
import { GetUrlImageType } from './image.type'

export const getUrlImage = async (companyName: string) => {
  const data = {
    name: companyName,
    contentType: 'image/png',
  }

  try {
    const response: GetUrlImageType = await api.post('image/uploads', data)

    return response
  } catch (error) {
    toast.error('Ocorreu um erro ao enviar a imagem, tente novamente!')

    return ''
  }
}
