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

export function formatCurrency(value: string) {
  // Converte o valor para um número flutuante e divide por 100 para obter as casas decimais
  const formattedValue = (parseFloat(value) / 100).toFixed(2)

  // Converte o valor para o formato de moeda brasileiro
  return formattedValue.replace('.', ',')
}

export enum Sport {
  SOCCER = 'SOCCER',
  VOLLEYBALL = 'VOLLEYBALL',
  BEACH_VOLLEY = 'BEACH_VOLLEY',
  BASKETBALL = 'BASKETBALL',
  FUTSAL = 'FUTSAL',
  TENNIS = 'TENNIS',
  TABLE_TENNIS = 'TABLE_TENNIS',
  HANDBALL = 'HANDBALL',
  SWIMMING = 'SWIMMING',
  ATHLETICS = 'ATHLETICS',
  SURFING = 'SURFING',
  SKATEBOARDING = 'SKATEBOARDING',
  JUDO = 'JUDO',
  KARATE = 'KARATE',
  TAEKWONDO = 'TAEKWONDO',
  JIU_JITSU = 'JIU_JITSU',
  BOXING = 'BOXING',
  MMA = 'MMA',
  CAPOEIRA = 'CAPOEIRA',
  CYCLING = 'CYCLING',
  MOTOR_RACING = 'MOTOR_RACING',
  EQUESTRIAN = 'EQUESTRIAN',
  GYMNASTICS = 'GYMNASTICS',
  SAILING = 'SAILING',
  BEACH_SOCCER = 'BEACH_SOCCER',
  FOOTVOLLEY = 'FOOTVOLLEY',
  RUGBY = 'RUGBY',
  ROLLER_HOCKEY = 'ROLLER_HOCKEY',
  BODYBOARDING = 'BODYBOARDING',
  KITESURFING = 'KITESURFING',
  CANOEING = 'CANOEING',
}
// Mapeamento de esportes para português
const sportTranslations: { [key in Sport]: string } = {
  [Sport.SOCCER]: 'Futebol',
  [Sport.VOLLEYBALL]: 'Vôlei',
  [Sport.BEACH_VOLLEY]: 'Vôlei de Praia',
  [Sport.BASKETBALL]: 'Basquete',
  [Sport.FUTSAL]: 'Futsal',
  [Sport.TENNIS]: 'Tênis',
  [Sport.TABLE_TENNIS]: 'Tênis de Mesa',
  [Sport.HANDBALL]: 'Handebol',
  [Sport.SWIMMING]: 'Natação',
  [Sport.ATHLETICS]: 'Atletismo',
  [Sport.SURFING]: 'Surfe',
  [Sport.SKATEBOARDING]: 'Skate',
  [Sport.JUDO]: 'Judô',
  [Sport.KARATE]: 'Karatê',
  [Sport.TAEKWONDO]: 'Taekwondo',
  [Sport.JIU_JITSU]: 'Jiu-Jitsu',
  [Sport.BOXING]: 'Boxe',
  [Sport.MMA]: 'MMA',
  [Sport.CAPOEIRA]: 'Capoeira',
  [Sport.CYCLING]: 'Ciclismo',
  [Sport.MOTOR_RACING]: 'Automobilismo',
  [Sport.EQUESTRIAN]: 'Hipismo',
  [Sport.GYMNASTICS]: 'Ginástica',
  [Sport.SAILING]: 'Vela',
  [Sport.BEACH_SOCCER]: 'Futebol de Praia',
  [Sport.FOOTVOLLEY]: 'Futevôlei',
  [Sport.RUGBY]: 'Rugby',
  [Sport.ROLLER_HOCKEY]: 'Hóquei sobre Patins',
  [Sport.BODYBOARDING]: 'Bodyboarding',
  [Sport.KITESURFING]: 'Kitesurf',
  [Sport.CANOEING]: 'Canoagem',
}

// Função para converter esportes para português
export const translateSportToPortuguese = (sport: Sport): string => {
  return sportTranslations[sport] || 'Esporte desconhecido'
}

export function translateDiaWeek(day: string): string {
  const daysWeek: { [key: string]: string } = {
    Monday: 'Segunda-feira',
    Tuesday: 'Terça-feira',
    Wednesday: 'Quarta-feira',
    Thursday: 'Quinta-feira',
    Friday: 'Sexta-feira',
    Saturday: 'Sábado',
    Sunday: 'Domingo',
  }

  const portugueseDay = daysWeek[day]

  if (!portugueseDay) {
    throw new Error('Dia da semana inválido')
  }

  return portugueseDay
}
