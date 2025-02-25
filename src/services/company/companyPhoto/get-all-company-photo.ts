/* eslint-disable camelcase */
import api from '../../../services/api'
import { toast } from 'sonner'

export type PhotosType = {
  id: string
  imageUrl: string
  companyId: string
  createdAt: string
  updatedAt: string
}

export type GetAllCompanyResponseType = {
  photos: PhotosType[]
}

export type GetAllCompanyPhotoResponseApiType = {
  data: {
    photos: PhotosType[]
  }
}

export type GetAllCompanyPhotoRequest = {
  companyId: string
}

export const getAllCompanyPhoto = async ({
  companyId,
}: GetAllCompanyPhotoRequest): Promise<GetAllCompanyResponseType> => {
  try {
    if (!companyId) {
      toast.error('Empresa não encontrado')
      return {
        photos: [],
      }
    }

    const response: GetAllCompanyPhotoResponseApiType = await api.get(
      `/company-photo?companyId=${companyId}`,
    )

    return {
      photos: response.data.photos,
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    toast.error(
      'Ocorreu um erro ao buscar as fotos da empresa, tente novamente',
    )
    return {
      photos: [],
    }
  }
}
