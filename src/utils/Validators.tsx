export const isValidTypeableBarcode = (barcode: string) => {
  const barcodeClean = barcode.replace(/\D/g, '')
  return barcodeClean.length === 47 || barcodeClean.length === 48
}

export const isValidCPF = (strCPF: string, clearCPF = false) => {
  if (clearCPF) strCPF = validateOnlyNumber(strCPF)

  let sum
  let rest
  sum = 0

  if (strCPF === '00000000000') return false

  for (let i = 1; i <= 9; i++) {
    sum = sum + parseInt(strCPF.substring(i - 1, i)) * (11 - i)
  }
  rest = (sum * 10) % 11

  if (rest === 10 || rest === 11) rest = 0
  if (rest !== parseInt(strCPF.substring(9, 10))) return false

  sum = 0
  for (let i = 1; i <= 10; i++)
    sum = sum + parseInt(strCPF.substring(i - 1, i)) * (12 - i)
  rest = (sum * 10) % 11

  if (rest === 10 || rest === 11) rest = 0
  if (rest !== parseInt(strCPF.substring(10, 11))) return false
  return true
}

export const isValidCNPJ = (value: string) => {
  if (!value) return false

  const match = value.toString().match(/\d/g)
  const numbers = Array.isArray(match) ? match.map(Number) : []

  if (numbers.length !== 14) return false

  const items = [...new Set(numbers)]
  if (items.length === 1) return false

  const calc = (x: number) => {
    const slice = numbers.slice(0, x)
    let factor = x - 7
    let sum = 0

    for (let i = x; i >= 1; i--) {
      const n = slice[x - i]
      sum += n * factor--
      if (factor < 2) factor = 9
    }

    const result = 11 - (sum % 11)

    return result > 9 ? 0 : result
  }

  const digits = numbers.slice(12)

  const digit0 = calc(12)
  if (digit0 !== digits[0]) return false

  const digit1 = calc(13)
  return digit1 === digits[1]
}

export function validateZipcode(zipCode: string) {
  const cleanedZipcode = validateOnlyNumber(zipCode)

  return cleanedZipcode.length === 8
}

export function validateEmail(email: string) {
  const regex =
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  return regex.test(String(email).toLowerCase())
}

export function validateHasUppercase(text: string) {
  const hasUppercaseRegex = /.*[A-Z]+.*/g
  return hasUppercaseRegex.test(text)
}

export function validateHasLowercase(text: string) {
  const hasLowercaseRegex = /.*[a-z]+.*/g
  return hasLowercaseRegex.test(text)
}

export function validateHasNumber(text: string) {
  const hasNumberRegex = /.*[0-9]+.*/g
  return hasNumberRegex.test(text)
}

export function validateOnlyNumber(text: string) {
  return text.replace(/\D/g, '')
}

export function validateMinLength(text: string, minLength: number) {
  return text.length >= minLength
}

export function validateLength(text: string, length: number) {
  return text.length === length
}

export function validateSpecialCharacters(text: string) {
  const hasSpecialCharacters = /[^A-Za-z0-9]/g
  return hasSpecialCharacters.test(text)
}

export function isEmptyObject(obj: Object | any) {
  return Object.keys(obj).length === 0
}

export function isEmptyString(str: string) {
  return !str || str.length === 0
}

export function isDefined(value: any) {
  return value !== null && value !== undefined
}

export function isValidResponse(response: any, statusCode = 200) {
  return response && response.status === statusCode
}

export function isValidTime(time: string | undefined) {
  if (!time) return false

  const isValidTime = /^([0-1][0-9]|2[0-3]):([0-5][0-9])$/

  return isValidTime.test(time)
}

export const isValidPhone = (phone: string) => {
  const number = validateOnlyNumber(phone)

  return number.length === 10 || number.length === 11
}

export const validateSpecialCharactersPassword = (text: string) => {
  const allowCharacters = ['#', '?', '!', '@', '$', '%', '^', '&', '*', '-']

  const contains = allowCharacters
    .map((c) => text.split('').includes(c))
    .includes(true)

  return contains
}

export const isValidPassword = (password: string) =>
  validateHasUppercase(password) &&
  validateHasLowercase(password) &&
  validateHasNumber(password) &&
  validateMinLength(password, 8) &&
  validateSpecialCharactersPassword(password)
