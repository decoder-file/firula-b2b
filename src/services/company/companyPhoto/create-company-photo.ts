/* eslint-disable camelcase */
import api from '../../../services/api'
import { toast } from 'sonner'

export type CreateCompanyResponseType = {
  imageUrl: string
  message?: string
  success: boolean
}

export type CreateCompanyPhotoResponseApiType = {
  data: {
    imageUrl: string
  }
}

export type CreateCompanyPhotoRequest = {
  imageUrl: string
  companyId: string
}

export const createCompanyPhoto = async ({
  companyId,
  imageUrl,
}: CreateCompanyPhotoRequest): Promise<CreateCompanyResponseType> => {
  try {
    if (!companyId) {
      toast.error('Empresa não encontrado')
      return {
        imageUrl: '',
        success: false,
        message: 'Empresa não encontrado',
      }
    }

    const data = {
      imageUrl,
    }

    const response: CreateCompanyPhotoResponseApiType = await api.post(
      `/company-photo?companyId=${companyId}`,
      data,
    )

    const photo = response.data.imageUrl

    toast.success('Foto adicionada com sucesso!')
    return {
      imageUrl: photo,
      success: true,
      message: 'Photo cadastrada na galeria com sucesso',
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    toast.error(
      'Ocorreu um erro ao cadastrar a empresa, tente novamente mais tarde!',
    )
    return {
      imageUrl: '',
      success: false,
      message: error.message,
    }
  }
}
