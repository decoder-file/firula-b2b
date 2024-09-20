import moment from 'moment'

export const formatStringCapitalized = (string: string) => {
  return string.charAt(0).toUpperCase() + string.slice(1)
}

export const formatPhone = (phone: string) => {
  const numbersPhone = phone.replace(/\D/g, '')

  return numbersPhone.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3')
}

export const isValidAndOver18 = (dateString: string) => {
  // Verificar se a data é válida
  const date = moment(dateString, 'DD/MM/YYYY', true)
  if (!date.isValid()) {
    return false // Data inválida
  }

  // Calcular a diferença de anos entre a data fornecida e a data atual
  const age = moment().diff(date, 'years')

  // Verificar se a idade é maior ou igual a 18 anos
  return age >= 18
}

export function formatPhoneNumber(phoneNumber: string) {
  const cleaned = ('' + phoneNumber).replace(/\D/g, '') // Remove any non-digit characters
  const match = cleaned.match(/^(\d{2})(\d{5})(\d{4})$/) // Match the pattern (XX) XXXXX-XXXX

  if (match) {
    return `(${match[1]}) ${match[2]}-${match[3]}`
  }

  return null // Return null if the input doesn't match the expected format
}

export function formatValue(value: string) {
  // Verifica se o primeiro caractere é zero
  if (value[0] === '0') {
    // Remove o primeiro caractere (zero) e retorna a string resultante
    return value.substring(1)
  }
  // Se o primeiro caractere não for zero, retorna a string original
  return value
}
