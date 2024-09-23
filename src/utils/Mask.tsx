import { validateOnlyNumber } from './Validators'

export function capitalizeFirstLetter(string = '') {
  return string.charAt(0).toUpperCase() + string.slice(1)
}

export function capitalizeAll(string = '') {
  return string.toUpperCase()
}

export function capitalizeEachWord(string: string) {
  const splitStr = string.toLowerCase().split(' ')
  for (let i = 0; i < splitStr.length; i++) {
    splitStr[i] = splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1)
  }

  return splitStr.join(' ')
}

export function maskCPF(cpf: string) {
  cpf = cpf.replace(/\D/g, '')
  cpf = cpf.replace(/(\d{3})(\d)/, '$1.$2')
  cpf = cpf.replace(/(\d{3})(\d)/, '$1.$2')
  cpf = cpf.replace(/(\d{3})(\d{1,2})$/, '$1-$2')
  return cpf
}

export function maskCEP(cep: string) {
  cep = cep.replace(/\D/g, '') // Remove todos os caracteres que não são dígitos
  cep = cep.replace(/(\d{5})(\d)/, '$1-$2') // Adiciona o hífen após os primeiros 5 dígitos
  return cep
}

export function maskCNPJ(cnpj: string) {
  cnpj = cnpj.replace(/\D/g, '')
  cnpj = cnpj.replace(/^(\d{2})(\d)/, '$1.$2')
  cnpj = cnpj.replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3')
  cnpj = cnpj.replace(/\.(\d{3})(\d)/, '.$1/$2')
  cnpj = cnpj.replace(/(\d{4})(\d)/, '$1-$2')
  return cnpj
}

export function encryptCPForCNPJ(document: string) {
  const cpfEnd = document.substring(document.length - 3, document.length)
  let cpfBegning = document.substring(0, document.length - 3)
  cpfBegning = cpfBegning.replace(/\d/g, `\u2022`)
  cpfBegning = cpfBegning.concat(cpfEnd)
  return cpfBegning
}

export function maskCPFeCNPJ(doc: string) {
  doc = doc.replace(/\D/g, '')
  if (doc.length > 11) {
    doc = doc.replace(/^(\d{2})(\d)/, '$1.$2')
    doc = doc.replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3')
    doc = doc.replace(/\.(\d{3})(\d)/, '.$1/$2')
    doc = doc.replace(/(\d{4})(\d)/, '$1-$2')
  } else {
    doc = doc.replace(/\D/g, '')
    doc = doc.replace(/(\d{3})(\d)/, '$1.$2')
    doc = doc.replace(/(\d{3})(\d)/, '$1.$2')
    doc = doc.replace(/(\d{3})(\d{1,2})$/, '$1-$2')
  }
  return doc
}

export function maskPix(doc: string) {
  return doc
    .replace(/\W/g, '')
    .replace(/(\w{8})(\w)/, '$1-$2')
    .replace(/(-\w{4})(\w)/, '$1-$2')
    .replace(/(-\w{4})(\w)/, '$1-$2')
    .replace(/(-\w{4})(\w)/, '$1-$2')
    .replace(/(-\w{12})(\w)/, '$1-$2')
}

export function maskPhoneNumber(phone: string, internationalNumber = false) {
  phone = phone.replace(/\D/g, '')

  if (internationalNumber) {
    phone = phone.replace(/^(\+55)(\d)/, '$1')
    phone = phone.replace(/(\d{2})(\d)/, '+$1 ($2')
  } else {
    phone = phone.replace(/(\d{2})(\d)/, '($1) $2')
  }
  phone = phone.replace(/(\d{5})(\d{1,4})$/, '$1-$2')
  return phone
}

export function maskOnlyNumber(text: string) {
  return text.replace(/\D/g, '')
}

export function formatDate(date: Date, separator = '/') {
  const month = (date.getUTCMonth() + 1).toString().padStart(2, '0') // months from 1-12
  const day = date.getUTCDate().toString().padStart(2, '0')
  const year = date.getUTCFullYear()

  return day + separator + month + separator + year
}

export function formatStringDate(date: string, separator = '/') {
  const dateSplitted = date.match(/.{1,2}/g)

  if (!dateSplitted) return date

  return (
    dateSplitted[0] +
    separator +
    dateSplitted[1] +
    separator +
    dateSplitted[2] +
    dateSplitted[3]
  )
}

export function maskZipCode(zipCode: string) {
  zipCode = zipCode.replace(/\D/g, '')
  zipCode = zipCode.replace(/(\d{5})(\d{1,3})$/, '$1-$2')
  return zipCode
}

export function maskBarCode(barCode: string) {
  try {
    barCode = barCode.replace(/\D/g, '')

    if (barCode.length <= 47) {
      barCode = barCode.replace(/(\d{5})(\d)/, '$1.$2')
      barCode = barCode.replace(/(\d{5})(\d)/, '$1 $2')
      barCode = barCode.replace(/(\d{5})(\d)/, '$1.$2')
      barCode = barCode.replace(/(\d{5})(\d)/, '$1 $2')
      barCode = barCode.replace(/(\d{5})(\d)/, '$1.$2')
      barCode = barCode.replace(/(\d{5})(\d)/, '$1 $2')
      barCode = barCode.replace(/(\d{1})(\d{1,14})$/, ' $1 $2')
    }

    if (barCode.length === 48) {
      barCode = barCode.replace(/(\d{12})(\d)/, '$1 $2')
      barCode = barCode.replace(/(\d{12})(\d)/, '$1 $2')
      barCode = barCode.replace(/(\d{12})(\d)/, '$1 $2')
    }
    return barCode
  } catch (error) {
    console.log(error)
  }
}

export const maskCurrency = (
  value: any,
  hasFractionDigits = false,
  showCurrency = true,
) => {
  let options = {}
  if (!value) value = 0

  if (!hasFractionDigits) value = parseInt(value) / 100

  if (showCurrency)
    options = {
      style: 'currency',
      currency: 'BRL',
    }
  else {
    options = { minimumFractionDigits: 2 }
  }

  const formatter = new Intl.NumberFormat('pt-BR', options)

  return formatter.format(value)
}

export const maskInputCurrency = (value: string | undefined | null) => {
  let currentValue: string | number = 0

  if (value) {
    currentValue = validateOnlyNumber(value)

    if (currentValue.length >= 3)
      currentValue = [
        currentValue.slice(0, currentValue.length - 2),
        '.',
        currentValue.slice(currentValue.length - 2),
      ].join('')

    if (currentValue.length === 2) currentValue = '0'
    currentValue = parseFloat(currentValue)
  }

  return currentValue.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
  })
}

export const maskTelephone = (phone = '') => {
  if (phone === null || phone === undefined || phone.includes('null')) return ''

  phone = validateOnlyNumber(phone)

  if (phone.length <= 9) {
    return phone.replace(/(\d{4,5})(\d{4})/, '$1-$2')
  }
  return phone.replace(/(\d{2})(\d{4,5})(\d{4})/, '($1) $2-$3')
}

export const maskHourMinute = (time: string) => {
  time = validateOnlyNumber(time)

  const block = []
  block[0] = time.substr(0, 2)
  block[1] = time.substr(2, 2)

  if (block[0] && parseFloat(block[0]) >= 24) block[0] = '00'
  if (block[1] && parseFloat(block[1]) >= 60) block[1] = '00'

  let formattedTime = ''

  if (block[0]) formattedTime += `${block[0]}`
  if (block[1]) formattedTime += `:${block[1]}`

  return formattedTime
}

export const maskLastDigits = (text: string, amount: number) => {
  return text.substr(text.length - amount)
}
