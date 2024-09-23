import axios from 'axios'

export type AddressResponseType = {
  bairro: string
  localidade: string
  logradouro: string
  uf: string
}

export const getAddressByCep = async (
  cep: string,
): Promise<AddressResponseType> => {
  try {
    const formatCep = cep.replace(/[^0-9]/g, '')

    if (formatCep.length !== 8) return {} as AddressResponseType // Change the return value to an empty object of type AddressResponseType
    const response = await axios.get(
      `https://viacep.com.br/ws/${formatCep}/json/`,
    )

    console.log(response.data)

    return {
      bairro: response.data.bairro,
      localidade: response.data.localidade,
      logradouro: response.data.logradouro,
      uf: response.data.uf,
    }
  } catch (error) {
    return {} as AddressResponseType
  }
}
