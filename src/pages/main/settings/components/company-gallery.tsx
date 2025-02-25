import { useUserStore } from '../../../../store/UserStore'
import { Plus, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import axios from 'axios'
import { createCompanyPhoto } from '../../../../services/company/companyPhoto/create-company-photo'
import { GetUrlImageType } from '../../../../services/image'
import { getUrlImage } from '../../../../services/image/get-url-image'
import {
  getAllCompanyPhoto,
  PhotosType,
} from '../../../../services/company/companyPhoto/get-all-company-photo'

export function CompanyGallery() {
  const { user } = useUserStore()

  const [images, setImages] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [companyPhotos, setCompanyPhotos] = useState<PhotosType[]>([])
  const maxImages = 9

  const fetchCompanyPhotos = async () => {
    const response = await getAllCompanyPhoto({
      companyId: user?.companyId || '',
    })

    setCompanyPhotos(response.photos)
    setImages(
      response.photos.map(
        (photo) =>
          `https://pub-ed847887b3d7415384bbf5488c674561.r2.dev/${photo.imageUrl}`,
      ),
    )
    setLoading(false)
  }

  const handleImageUpload = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const files = event.target.files
    if (files && files.length > 0) {
      const file = files[0]
      const newImageUrl = URL.createObjectURL(file)

      // Envia a imagem para o backend
      const responseImageUpload: GetUrlImageType = (await getUrlImage(
        `${user.companyId}` + '_company_gallery',
      )) as GetUrlImageType

      await axios.put(responseImageUpload.data.signedUrl, file, {
        headers: {
          'Content-Type': file.type,
        },
      })

      // Cria a foto na empresa
      await createCompanyPhoto({
        companyId: user?.companyId || '',
        imageUrl: responseImageUpload.data.url,
      })

      // Atualiza o estado local
      setImages((prevImages) => [...prevImages, newImageUrl])
    }
  }

  const handleDeleteImage = async (index: number) => {
    const imageToDelete = companyPhotos[index]
    if (imageToDelete) {
      // Aqui você deve implementar a lógica para deletar a foto do backend
      // await deleteCompanyPhoto(imageToDelete.id);
    }

    // Atualiza o estado local
    const newImages = images.filter((_, i) => i !== index)
    setImages(newImages)
  }

  const renderImageSlot = (index: number) => {
    if (index < images.length) {
      return (
        <div
          key={index}
          className="group relative aspect-[3/4] overflow-hidden rounded-xl border-2 border-dashed"
        >
          <img
            src={images[index] || '/placeholder.svg'}
            alt={`Uploaded image ${index + 1}`}
            className="h-full w-full transform object-cover transition-transform group-hover:scale-110"
          />
          <button
            onClick={() => handleDeleteImage(index)}
            className="absolute right-2 top-2 rounded-full bg-red-600 p-1.5 text-white"
          >
            <X size={16} />
          </button>
        </div>
      )
    }

    return (
      <label
        key={index}
        className="flex aspect-[3/4] cursor-pointer items-center justify-center rounded-xl border-2 border-dashed border-gray-600 transition-colors hover:border-gray-500"
      >
        <input
          type="file"
          accept=".png,.jpg,.jpeg"
          onChange={handleImageUpload}
          className="hidden"
        />
        <Plus size={24} className="text-primary" />
      </label>
    )
  }

  useEffect(() => {
    fetchCompanyPhotos()
  }, [])

  return (
    <>
      {loading && <div>Carregando...</div>}
      <main className="grid gap-2">
        <div className="mx-auto max-w-xl p-4">
          <div className="mb-4">
            <div className="font-medium">Atenção</div>
            <div className="text-sm text-gray-500">
              Para uma melhor experiência dos seus clientes, adicione fotos na
              resolução de 520x520 pixels.
            </div>
          </div>

          <div className="mb-8">
            <div className="grid grid-cols-3 gap-2">
              {Array.from({ length: maxImages }, (_, i) => renderImageSlot(i))}
            </div>
          </div>
        </div>
      </main>
    </>
  )
}
