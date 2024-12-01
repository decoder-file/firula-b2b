export type CreateEventRequestType = {
  title: string
  description: string
  imageUrl?: string
  companyId: string
  startDate: string
  startTime: string
  endDate: string
  endTime: string
  street: string
  number: string
  complement: string
  neighborhood: string
  city: string
  state: string
  zipCode: string
}

export type ticketTypes = {
  id: string
  title: string
  description: string
  amount: number
  quantitySold: number
  price: string
  isActive: boolean
  startDate: Date
  endDate: Date
  endTime: string
  startTime: string
  createdAt: Date
  updatedAt: Date
  eventId: string
}

export type EventType = {
  id: string
  title: string
  description: string
  date: Date
  isActive: boolean
  imageUrl?: string
  slug: string
  startDate: Date
  startTime: string
  endDate: Date
  endTime: string
  street: string
  number: string
  complement?: string
  neighborhood: string
  city: string
  state: string
  zipCode: string
  createdAt: Date
  updatedAt: Date
  companyId: string
  ticketTypes?: ticketTypes[]
}
